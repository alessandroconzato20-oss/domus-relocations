/**
 * DOMUS Relocations — Intake Questionnaire tRPC Router
 *
 * Handles: form submission, AI generation, Advisor Brief PDF + email, Client Preview saved to DB.
 * The Advisor Brief is emailed as a PDF to milano@domusrelocations.com.
 * The Client Preview is saved to the database and published to the client dashboard by the admin.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Anthropic from "@anthropic-ai/sdk";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { getUserByEmail } from "../db";
import { intakeForms, clientProfiles, users } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { ADVISOR_BRIEF_SYSTEM_PROMPT, CLIENT_PREVIEW_SYSTEM_PROMPT } from "../lib/aiPrompts";
import { buildAdvisorBriefUserPrompt, buildClientPreviewUserPrompt } from "../lib/intakePromptBuilders";
import { generatePDF, buildAdvisorBriefHTML } from "../lib/pdfGenerator";
import { sendEmailViaResend } from "../_core/resendService";
import type { IntakeForm } from "../../drizzle/schema";

// ─── Zod schema for child objects ────────────────────────────────────────────
const childSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  currentSchool: z.string(),
  currentCurriculum: z.string(),
  yearGrade: z.string(),
  languagesSpoken: z.string(),
  academicLevel: z.string().optional(),
  strongestSubjects: z.string().optional(),
  weakestSubjects: z.string().optional(),
  extracurriculars: z.string().optional(),
  personality: z.string().optional(),
});

const childEduProfileSchema = z.object({
  childName: z.string(),
  academicStrengths: z.string(),
  extracurriculars: z.string(),
  continuityEssential: z.string(),
});

// ─── Full intake form Zod schema ─────────────────────────────────────────────
const intakeFormSchema = z.object({
  // Section 1 — The Family
  primaryName: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  preferredLanguage: z.string().default("English"),
  whoRelocating: z.array(z.string()).min(1, "Please select who is relocating"),
  partnerName: z.string().optional(),
  partnerNationality: z.string().optional(),
  partnerLanguages: z.string().optional(),
  children: z.array(childSchema).optional(),
  pets: z.array(z.string()).optional(),

  // Section 2 — The Move
  fromCity: z.string().min(1, "Current city is required"),
  nationalities: z.string().optional(),
  moveReasons: z.array(z.string()).min(1, "Please select at least one reason"),
  arrivalDate: z.string().optional(),
  dateFirmness: z.string().optional(),
  intendedDuration: z.array(z.string()).optional(),
  targetCity: z.array(z.string()).min(1, "Please select a target city"),
  livedInItalyBefore: z.string().optional(),
  previousCountries: z.string().optional(),

  // Section 3 — Housing
  rentOrBuy: z.array(z.string()).min(1, "Please select rent or buy preference"),
  budget: z.array(z.string()).min(1, "Please select a budget range"),
  bedrooms: z.string().optional(),
  propertyType: z.string().optional(),
  propertyRequirements: z.array(z.string()).optional(),
  neighbourhoodVibe: z.array(z.string()).optional(),
  neighbourhoodInterest: z.string().optional(),
  previousHomeNotes: z.string().optional(),

  // Section 4 — Education
  childEduProfiles: z.array(childEduProfileSchema).optional(),
  italianImmersionScale: z.number().int().min(1).max(5).optional(),
  curriculumPreference: z.array(z.string()).optional(),
  midYearEntry: z.array(z.string()).optional(),
  learningNeeds: z.string().optional(),
  universityTarget: z.string().optional(),

  // Section 5 — Professional & Fiscal
  professionalSituation: z.array(z.string()).optional(),
  partnerProfSituation: z.array(z.string()).optional(),
  flatTaxInterest: z.array(z.string()).optional(),
  livedInItalyLast9: z.array(z.string()).optional(),
  hasCommercialista: z.array(z.string()).optional(),
  bankingNeeds: z.array(z.string()).optional(),

  // Section 6 — Lifestyle
  lifestyleDescriptors: z.array(z.string()).optional(),
  hobbies: z.string().optional(),
  socialNetworkScale: z.number().int().min(1).max(5).optional(),
  italianLevelYou: z.string().optional(),
  italianLevelPartner: z.string().optional(),
  healthcareNeeds: z.array(z.string()).optional(),
  healthcareOther: z.string().optional(),
  dietaryNotes: z.string().optional(),

  // Section 7 — Priorities
  topPriorities: z.array(z.string()).optional(),
  biggestAnxiety: z.string().optional(),
  prevReloScale: z.number().int().min(1).max(5).optional(),
  prevReloWentWrong: z.string().optional(),
  commsPref: z.array(z.string()).optional(),
  timezone: z.string().optional(),
  additionalDecisionMaker: z.string().optional(),
  anythingElse: z.string().optional(),
  heardAboutDomus: z.array(z.string()).optional(),
});

// ─── HTML sanitiser ───────────────────────────────────────────────────────────
function stripHtml(value: unknown): unknown {
  if (typeof value === "string") {
    return value.replace(/<[^>]*>/g, "").trim();
  }
  if (Array.isArray(value)) {
    return value.map(stripHtml);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, stripHtml(v)])
    );
  }
  return value;
}

// ─── Claude API call ──────────────────────────────────────────────────────────
async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  maxTokens: number = 2000
): Promise<string> {
  if (!ENV.anthropicApiKey) {
    return "[AI generation unavailable — ANTHROPIC_API_KEY not configured. Please add the API key to enable this feature.]";
  }

  const anthropic = new Anthropic({ apiKey: ENV.anthropicApiKey });
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

// ─── Advisor Brief: generate PDF and email to DOMUS ──────────────────────────
async function generateAndSendAdvisorBrief(form: IntakeForm): Promise<boolean> {
  try {
    const userPrompt = buildAdvisorBriefUserPrompt(form);
    const aiText = await callClaude(ADVISOR_BRIEF_SYSTEM_PROMPT, userPrompt, 2000);
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const html = buildAdvisorBriefHTML(aiText, form.primaryName, date);
    const pdfBuffer = await generatePDF(html);

    const safeFamily = form.primaryName.replace(/[^a-zA-Z0-9]/g, "_");
    const safeDate = new Date().toISOString().slice(0, 10);
    const filename = `DOMUS_AdvisorBrief_${safeFamily}_${safeDate}.pdf`;

    const targetCity = Array.isArray(form.targetCity) ? (form.targetCity as string[]).join(", ") : "Italy";
    const arrivalStr = form.arrivalDate ? ` — arriving ${form.arrivalDate}` : "";

    const sent = await sendEmailWithAttachment({
      to: "milano@domusrelocations.com",
      subject: `New intake: ${form.primaryName} — ${targetCity}${arrivalStr}`,
      text: `New private client intake received.\n\nAdvisor Brief attached. Please review before first contact with the family.\n\nFamily: ${form.primaryName}\nEmail: ${form.email}\nTarget city: ${targetCity}`,
      pdfBuffer,
      filename,
    });

    return sent;
  } catch (err) {
    console.error("[Intake] Advisor brief generation failed:", err);
    return false;
  }
}

// ─── Client Preview: generate text and save to DB ────────────────────────────
async function generateClientPreviewText(form: IntakeForm): Promise<string> {
  const userPrompt = buildClientPreviewUserPrompt(form);
  return callClaude(CLIENT_PREVIEW_SYSTEM_PROMPT, userPrompt, 1200);
}

// ─── Resend with PDF attachment ───────────────────────────────────────────────
async function sendEmailWithAttachment(opts: {
  to: string;
  subject: string;
  text: string;
  pdfBuffer: Buffer;
  filename: string;
}): Promise<boolean> {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(ENV.resendApiKey);

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: opts.to,
      subject: opts.subject,
      text: opts.text,
      attachments: [
        {
          filename: opts.filename,
          content: opts.pdfBuffer,
        },
      ],
    });

    if (result.error) {
      console.error("[Intake Email] Failed:", result.error);
      return false;
    }
    console.log(`[Intake Email] Sent to ${opts.to} — ID: ${result.data?.id}`);
    return true;
  } catch (err) {
    console.error("[Intake Email] Exception:", err);
    return false;
  }
}

// ─── tRPC Router ──────────────────────────────────────────────────────────────
export const intakeRouter = router({
  // Public: submit intake form
  submit: publicProcedure
    .input(intakeFormSchema)
    .mutation(async ({ input }) => {
      // Sanitise all text inputs
      const clean = stripHtml(input) as typeof input;

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Save to database
      await db
        .insert(intakeForms)
        .values({
          primaryName: clean.primaryName,
          email: clean.email,
          phone: clean.phone,
          preferredLanguage: clean.preferredLanguage,
          whoRelocating: clean.whoRelocating,
          partnerName: clean.partnerName,
          partnerNationality: clean.partnerNationality,
          partnerLanguages: clean.partnerLanguages,
          children: clean.children,
          pets: clean.pets,
          fromCity: clean.fromCity,
          nationalities: clean.nationalities,
          moveReasons: clean.moveReasons,
          arrivalDate: clean.arrivalDate,
          dateFirmness: clean.dateFirmness,
          intendedDuration: clean.intendedDuration,
          targetCity: clean.targetCity,
          livedInItalyBefore: clean.livedInItalyBefore,
          previousCountries: clean.previousCountries,
          rentOrBuy: clean.rentOrBuy,
          budget: clean.budget,
          bedrooms: clean.bedrooms,
          propertyType: clean.propertyType,
          propertyRequirements: clean.propertyRequirements,
          neighbourhoodVibe: clean.neighbourhoodVibe,
          neighbourhoodInterest: clean.neighbourhoodInterest,
          previousHomeNotes: clean.previousHomeNotes,
          childEduProfiles: clean.childEduProfiles,
          italianImmersionScale: clean.italianImmersionScale,
          curriculumPreference: clean.curriculumPreference,
          midYearEntry: clean.midYearEntry,
          learningNeeds: clean.learningNeeds,
          universityTarget: clean.universityTarget,
          professionalSituation: clean.professionalSituation,
          partnerProfSituation: clean.partnerProfSituation,
          flatTaxInterest: clean.flatTaxInterest,
          livedInItalyLast9: clean.livedInItalyLast9,
          hasCommercialista: clean.hasCommercialista,
          bankingNeeds: clean.bankingNeeds,
          lifestyleDescriptors: clean.lifestyleDescriptors,
          hobbies: clean.hobbies,
          socialNetworkScale: clean.socialNetworkScale,
          italianLevelYou: clean.italianLevelYou,
          italianLevelPartner: clean.italianLevelPartner,
          healthcareNeeds: clean.healthcareNeeds,
          healthcareOther: clean.healthcareOther,
          dietaryNotes: clean.dietaryNotes,
          topPriorities: clean.topPriorities,
          biggestAnxiety: clean.biggestAnxiety,
          prevReloScale: clean.prevReloScale,
          prevReloWentWrong: clean.prevReloWentWrong,
          commsPref: clean.commsPref,
          timezone: clean.timezone,
          additionalDecisionMaker: clean.additionalDecisionMaker,
          anythingElse: clean.anythingElse,
          heardAboutDomus: clean.heardAboutDomus,
        });

      // Fetch the saved record
      const savedForms = await db
        .select()
        .from(intakeForms)
        .where(eq(intakeForms.email, clean.email))
        .orderBy(desc(intakeForms.submittedAt))
        .limit(1);

      const savedForm = savedForms[0];
      if (!savedForm) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save intake form" });
      }

      console.log(`[Intake] Saved form ID ${savedForm.id} for ${savedForm.primaryName} at ${new Date().toISOString()}`);

      // Check if this email already has a DOMUS account
      const existingUser = await getUserByEmail(clean.email);
      const emailExists = !!existingUser;

      // Background: generate Advisor Brief (PDF + email) and Client Preview (save to DB)
      Promise.all([
        // Advisor Brief — PDF emailed to DOMUS advisor
        generateAndSendAdvisorBrief(savedForm).then(async (sent) => {
          if (sent) {
            await db.update(intakeForms).set({ advisorBriefSent: 1 }).where(eq(intakeForms.id, savedForm.id));
          }
        }),

        // Client Preview — generate text and save to intakeForms.clientPreviewContent
        generateClientPreviewText(savedForm).then(async (previewText) => {
          await db
            .update(intakeForms)
            .set({ clientPreviewContent: previewText })
            .where(eq(intakeForms.id, savedForm.id));

          // If the client already has an account with a clientProfile, save preview there too
          if (existingUser) {
            const profileRows = await db
              .select()
              .from(clientProfiles)
              .where(eq(clientProfiles.userId, existingUser.id))
              .limit(1);
            if (profileRows[0]) {
              await db
                .update(clientProfiles)
                .set({
                  clientPreview: previewText,
                  clientPreviewGeneratedAt: new Date(),
                })
                .where(eq(clientProfiles.id, profileRows[0].id));
            }
          }
        }),
      ]).catch((err) => {
        console.error("[Intake] Background generation error:", err);
      });

      return {
        success: true,
        id: savedForm.id,
        firstName: clean.primaryName.split(" ")[0],
        preferredLanguage: clean.preferredLanguage,
        emailExists,
        submittedEmail: clean.email,
      };
    }),

  // Public: link an intake submission to a newly created or logged-in user account
  // Called by Signup and Login pages when intakeId is present in URL params
  linkToAccount: protectedProcedure
    .input(z.object({ intakeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Fetch the intake form
      const formRows = await db.select().from(intakeForms).where(eq(intakeForms.id, input.intakeId)).limit(1);
      if (!formRows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "Intake submission not found" });
      const form = formRows[0];

      // Guard: already linked to a different account
      if (form.accountStatus === "linked" && form.linkedUserId && form.linkedUserId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "This submission is already linked to another account" });
      }

      // Mark intake as linked
      await db
        .update(intakeForms)
        .set({ accountStatus: "linked", linkedUserId: ctx.user.id })
        .where(eq(intakeForms.id, input.intakeId));

      // Find or create clientProfile for this user
      const profileRows = await db
        .select()
        .from(clientProfiles)
        .where(eq(clientProfiles.userId, ctx.user.id))
        .limit(1);

      if (profileRows[0] && form.clientPreviewContent) {
        // Profile exists — push preview and auto-publish
        await db
          .update(clientProfiles)
          .set({
            clientPreview: form.clientPreviewContent,
            clientPreviewGeneratedAt: new Date(),
            clientPreviewPublished: 1,
          })
          .where(eq(clientProfiles.id, profileRows[0].id));
      } else if (!profileRows[0]) {
        // No profile yet — create a minimal one with the preview pre-loaded
        const nameParts = form.primaryName.trim().split(" ");
        await db.insert(clientProfiles).values({
          userId: ctx.user.id,
          fullName: form.primaryName,
          email: form.email,
          phone: form.phone ?? undefined,
          nationality: form.nationalities ?? undefined,
          currentCity: form.fromCity ?? undefined,
          targetMoveDate: form.arrivalDate ?? undefined,
          clientPreview: form.clientPreviewContent ?? undefined,
          clientPreviewGeneratedAt: form.clientPreviewContent ? new Date() : undefined,
          clientPreviewPublished: form.clientPreviewContent ? 1 : 0,
        });
      }

      // Also mark intake clientPreviewPublished
      await db
        .update(intakeForms)
        .set({ clientPreviewPublished: 1 })
        .where(eq(intakeForms.id, input.intakeId));

      return { success: true };
    }),


  // Admin: list all intake submissions
  listSubmissions: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.email !== ENV.adminEmail) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db
      .select({
        id: intakeForms.id,
        primaryName: intakeForms.primaryName,
        email: intakeForms.email,
        targetCity: intakeForms.targetCity,
        arrivalDate: intakeForms.arrivalDate,
        submittedAt: intakeForms.submittedAt,
        advisorBriefSent: intakeForms.advisorBriefSent,
        clientPreviewSent: intakeForms.clientPreviewSent,
        clientPreviewPublished: intakeForms.clientPreviewPublished,
        assignedAdvisor: intakeForms.assignedAdvisor,
      })
      .from(intakeForms)
      .orderBy(desc(intakeForms.submittedAt));
  }),

  // Admin: get single submission detail
  getSubmission: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user?.email !== ENV.adminEmail) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const rows = await db.select().from(intakeForms).where(eq(intakeForms.id, input.id));
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });

      // Also fetch the linked clientProfile preview read status if the email matches a user
      const linkedUser = await getUserByEmail(rows[0].email);
      let previewReadAt: Date | null = null;
      let linkedProfileId: number | null = null;
      if (linkedUser) {
        const profileRows = await db
          .select({ id: clientProfiles.id, clientPreviewReadAt: clientProfiles.clientPreviewReadAt })
          .from(clientProfiles)
          .where(eq(clientProfiles.userId, linkedUser.id))
          .limit(1);
        if (profileRows[0]) {
          previewReadAt = profileRows[0].clientPreviewReadAt ?? null;
          linkedProfileId = profileRows[0].id;
        }
      }

      return { ...rows[0], previewReadAt, linkedProfileId };
    }),

  // Admin: publish Client Preview to client dashboard
  publishPreview: protectedProcedure
    .input(z.object({
      id: z.number(),
      previewContent: z.string().min(1, "Preview content cannot be empty"),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.email !== ENV.adminEmail) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Update intakeForms with possibly-edited content and mark as published
      await db
        .update(intakeForms)
        .set({ clientPreviewContent: input.previewContent, clientPreviewPublished: 1 })
        .where(eq(intakeForms.id, input.id));

      // Find the linked user and their clientProfile
      const formRows = await db.select({ email: intakeForms.email }).from(intakeForms).where(eq(intakeForms.id, input.id));
      if (!formRows[0]) throw new TRPCError({ code: "NOT_FOUND" });

      const linkedUser = await getUserByEmail(formRows[0].email);
      if (!linkedUser) {
        // No account yet — preview is stored in intakeForms, will be pushed when account is linked
        return { success: true, publishedToProfile: false };
      }

      const profileRows = await db
        .select()
        .from(clientProfiles)
        .where(eq(clientProfiles.userId, linkedUser.id))
        .limit(1);

      if (!profileRows[0]) {
        return { success: true, publishedToProfile: false };
      }

      await db
        .update(clientProfiles)
        .set({
          clientPreview: input.previewContent,
          clientPreviewGeneratedAt: new Date(),
          clientPreviewPublished: 1,
        })
        .where(eq(clientProfiles.id, profileRows[0].id));

      return { success: true, publishedToProfile: true };
    }),

  // Protected (client): mark preview as read
  markPreviewRead: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const profileRows = await db
      .select()
      .from(clientProfiles)
      .where(eq(clientProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profileRows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found" });

    // Only set readAt the first time
    if (!profileRows[0].clientPreviewReadAt) {
      await db
        .update(clientProfiles)
        .set({ clientPreviewReadAt: new Date() })
        .where(eq(clientProfiles.id, profileRows[0].id));
    }

    return { success: true };
  }),

  // Protected (client): get published preview for current user
  getMyPreview: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const profileRows = await db
      .select({
        clientPreview: clientProfiles.clientPreview,
        clientPreviewPublished: clientProfiles.clientPreviewPublished,
        clientPreviewGeneratedAt: clientProfiles.clientPreviewGeneratedAt,
        clientPreviewReadAt: clientProfiles.clientPreviewReadAt,
      })
      .from(clientProfiles)
      .where(eq(clientProfiles.userId, ctx.user.id))
      .limit(1);

    if (!profileRows[0]) return null;

    const p = profileRows[0];
    if (!p.clientPreviewPublished) return null;

    return {
      content: p.clientPreview,
      generatedAt: p.clientPreviewGeneratedAt,
      readAt: p.clientPreviewReadAt,
    };
  }),

  // Admin: re-send advisor brief
  resendAdvisorBrief: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.email !== ENV.adminEmail) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const rows = await db.select().from(intakeForms).where(eq(intakeForms.id, input.id));
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });
      const sent = await generateAndSendAdvisorBrief(rows[0]);
      if (sent) {
        await db.update(intakeForms).set({ advisorBriefSent: 1 }).where(eq(intakeForms.id, input.id));
      }
      return { success: sent };
    }),

  // Admin: regenerate AI content (Advisor Brief + Client Preview) for an existing submission
  regenerateAI: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.email !== ENV.adminEmail) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      if (!ENV.anthropicApiKey) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "ANTHROPIC_API_KEY is not configured" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const rows = await db.select().from(intakeForms).where(eq(intakeForms.id, input.id));
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });
      const form = rows[0];

      // Generate both documents in parallel
      const [advisorText, previewText] = await Promise.all([
        callClaude(ADVISOR_BRIEF_SYSTEM_PROMPT, buildAdvisorBriefUserPrompt(form), 2000),
        callClaude(CLIENT_PREVIEW_SYSTEM_PROMPT, buildClientPreviewUserPrompt(form), 1200),
      ]);

      // Save preview to intakeForms
      await db
        .update(intakeForms)
        .set({ clientPreviewContent: previewText })
        .where(eq(intakeForms.id, input.id));

      // If there is a linked clientProfile, update it too
      const linkedUser = await getUserByEmail(form.email);
      if (linkedUser) {
        const profileRows = await db
          .select()
          .from(clientProfiles)
          .where(eq(clientProfiles.userId, linkedUser.id))
          .limit(1);
        if (profileRows[0]) {
          await db
            .update(clientProfiles)
            .set({ clientPreview: previewText, clientPreviewGeneratedAt: new Date() })
            .where(eq(clientProfiles.id, profileRows[0].id));
        }
      }

      // Regenerate and re-send the Advisor Brief PDF
      const briefSent = await generateAndSendAdvisorBrief(form);
      if (briefSent) {
        await db.update(intakeForms).set({ advisorBriefSent: 1 }).where(eq(intakeForms.id, input.id));
      }

      return { success: true, advisorBriefSent: briefSent, previewText };
    }),

  // Admin: delete stale pending_account submissions older than 24 hours
  cleanupStale: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.user?.email !== ENV.adminEmail) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const { lt, and, isNull } = await import("drizzle-orm");

    const stale = await db
      .select({ id: intakeForms.id })
      .from(intakeForms)
      .where(
        and(
          eq(intakeForms.accountStatus, "pending_account"),
          isNull(intakeForms.linkedUserId),
          lt(intakeForms.submittedAt, cutoff)
        )
      );

    let deleted = 0;
    for (const row of stale) {
      await db.delete(intakeForms).where(eq(intakeForms.id, row.id));
      deleted++;
    }

    console.log(`[Intake Cleanup] Deleted ${deleted} stale pending_account submissions`);
    return { success: true, deleted };
  }),

  // Admin: update internal notes
  updateNotes: protectedProcedure
    .input(z.object({ id: z.number(), internalNotes: z.string(), assignedAdvisor: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.email !== ENV.adminEmail) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db
        .update(intakeForms)
        .set({ internalNotes: input.internalNotes, assignedAdvisor: input.assignedAdvisor })
        .where(eq(intakeForms.id, input.id));
      return { success: true };
    }),
});
