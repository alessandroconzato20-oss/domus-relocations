/**
 * DOMUS Relocations — Intake Questionnaire tRPC Router
 *
 * Handles: form submission, AI generation, PDF creation, email delivery, admin re-send.
 * Rate limited to 5 submissions per IP per hour (enforced via middleware in index.ts).
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import Anthropic from "@anthropic-ai/sdk";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { getDb } from "../db";
import { intakeForms } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { ADVISOR_BRIEF_SYSTEM_PROMPT, CLIENT_PREVIEW_SYSTEM_PROMPT } from "../lib/aiPrompts";
import { buildAdvisorBriefUserPrompt, buildClientPreviewUserPrompt } from "../lib/intakePromptBuilders";
import { generatePDF, buildAdvisorBriefHTML, buildClientPreviewHTML } from "../lib/pdfGenerator";
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
    // Return a placeholder when no API key is configured
    return "[AI generation unavailable — ANTHROPIC_API_KEY not configured. Please add the API key to enable this feature.]";
  }

  const anthropic = new Anthropic({ apiKey: ENV.anthropicApiKey });
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n");
}

// ─── PDF + email delivery ─────────────────────────────────────────────────────
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

async function generateAndSendClientPreview(form: IntakeForm): Promise<boolean> {
  try {
    const userPrompt = buildClientPreviewUserPrompt(form);
    const aiText = await callClaude(CLIENT_PREVIEW_SYSTEM_PROMPT, userPrompt, 1200);
    const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    const html = buildClientPreviewHTML(aiText, form.primaryName, date);
    const pdfBuffer = await generatePDF(html);

    const safeDate = new Date().toISOString().slice(0, 10);
    const filename = `DOMUS_YourMilanPreview_${safeDate}.pdf`;
    const firstName = form.primaryName.split(" ")[0];

    const lang = form.preferredLanguage || "English";
    const subject = getClientEmailSubject(lang);
    const body = getClientEmailBody(firstName, lang);

    const sent = await sendEmailWithAttachment({
      to: form.email,
      subject,
      text: body,
      pdfBuffer,
      filename,
    });

    return sent;
  } catch (err) {
    console.error("[Intake] Client preview generation failed:", err);
    return false;
  }
}

function getClientEmailSubject(lang: string): string {
  const subjects: Record<string, string> = {
    Italian: "La Tua Anteprima su Milano — da DOMUS Relocations",
    Japanese: "ミラノへの第一歩 — DOMUS Relocations より",
    Mandarin: "您的米兰预览 — DOMUS Relocations",
    French: "Votre Aperçu de Milan — DOMUS Relocations",
    German: "Ihre Mailand-Vorschau — DOMUS Relocations",
    Spanish: "Su Vista Previa de Milán — DOMUS Relocations",
    Portuguese: "Sua Prévia de Milão — DOMUS Relocations",
    Russian: "Ваш Предварительный Обзор Милана — DOMUS Relocations",
    Arabic: "معاينتك لميلانو — DOMUS Relocations",
    Korean: "밀라노 미리보기 — DOMUS Relocations",
  };
  return subjects[lang] || "Your Milan Preview — from DOMUS Relocations";
}

function getClientEmailBody(firstName: string, lang: string): string {
  if (lang === "English" || !lang) {
    return `Dear ${firstName},\n\nWe have read your questionnaire carefully and we wanted to send you something personal before we speak. Please find attached your personalised Milan Preview — our first gift to your family before we meet.\n\nYour DOMUS advisor will be in touch within 24 hours.\n\nWarm regards,\nThe DOMUS Team\n\ndomusrelocations.com · Milano`;
  }
  // For non-English, keep body in English — the PDF itself is in the client's language
  return `Dear ${firstName},\n\nPlease find attached your personalised Milan Preview from DOMUS Relocations.\n\nYour DOMUS advisor will be in touch within 24 hours.\n\nWarm regards,\nThe DOMUS Team\n\ndomusrelocations.com · Milano`;
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
      const [inserted] = await db
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

      // Generate and send PDFs in parallel (non-blocking — don't fail submission if email fails)
      Promise.all([
        generateAndSendAdvisorBrief(savedForm).then(async (sent) => {
          if (sent) {
            await db.update(intakeForms).set({ advisorBriefSent: 1 }).where(eq(intakeForms.id, savedForm.id));
          }
        }),
        generateAndSendClientPreview(savedForm).then(async (sent) => {
          if (sent) {
            await db.update(intakeForms).set({ clientPreviewSent: 1 }).where(eq(intakeForms.id, savedForm.id));
          }
        }),
      ]).catch((err) => {
        console.error("[Intake] Background PDF/email error:", err);
      });

      return {
        success: true,
        id: savedForm.id,
        firstName: clean.primaryName.split(" ")[0],
        preferredLanguage: clean.preferredLanguage,
      };
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
      return rows[0];
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

  // Admin: re-send client preview
  resendClientPreview: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user?.email !== ENV.adminEmail) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const rows = await db.select().from(intakeForms).where(eq(intakeForms.id, input.id));
      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND" });
      const sent = await generateAndSendClientPreview(rows[0]);
      if (sent) {
        await db.update(intakeForms).set({ clientPreviewSent: 1 }).where(eq(intakeForms.id, input.id));
      }
      return { success: sent };
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
