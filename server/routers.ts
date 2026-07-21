import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { clientDashboardRouter, adminDashboardRouter } from "./routers/dashboard";
import { intakeRouter } from "./routers/intake";
import { corporateRouter } from "./routers/corporate";
import { notifyOwner } from "./_core/notification";
import { invokeLLM } from "./_core/llm";
import { sendEmailViaResend, formatQuizEmailContent, formatInquiryEmailContent } from "./_core/resendService";
import { sdk } from "./_core/sdk";
import { z } from "zod";
import { saveQuizResponse, getQuizResponses, saveContactSubmission, getContactSubmissions, saveInquiry, getInquiries, getUserByEmail, createLocalUser, getDb, createPasswordResetToken, validatePasswordResetToken, deletePasswordResetToken, updateUserPasswordByUserId, getQuizResponsesByEmail, getTrustedNetworkContacts, getTrustedNetworkContactsByCategory, getAllClients, getClientWithData, createTotpSecret, getTotpSecretByUserId, enableTotpSecret, disableTotpSecret, validateBackupCode } from "./db";
import * as bcrypt from "bcryptjs";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    signup: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(8),
      }))
      .mutation(async (opts) => {
        const { input, ctx } = opts;
        try {
          const existingUser = await getUserByEmail(input.email);
          if (existingUser) {
            return { success: false, message: "Email already registered" };
          }

          const passwordHash = await bcrypt.hash(input.password, 10);
          const newUser = await createLocalUser(input.email, input.name, passwordHash);

          const sessionToken = await sdk.createSessionToken(newUser.openId, { name: newUser.name ?? "" });
          // Set cookie as fallback for environments where it works
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: 365 * 24 * 60 * 60 * 1000 });

          return { success: true, message: "Account created successfully", user: newUser, token: sessionToken };
        } catch (error) {
          console.error("Failed to sign up:", error);
          return { success: false, message: "Failed to create account" };
        }
      }),
    login: publicProcedure
      .input(z.object({
        email: z.string().email(),
        password: z.string().min(1),
      }))
      .mutation(async (opts) => {
        const { input, ctx } = opts;
        console.log(`[Auth] Login attempt for email: ${input.email}`);
        try {
          const user = await getUserByEmail(input.email);
          console.log(`[Auth] User found: ${user ? user.email : 'not found'}`);
          if (!user) {
            return { success: false, message: "Invalid email or password" };
          }

          if (!user.passwordHash) {
            return { success: false, message: "Invalid email or password" };
          }

          const passwordMatch = await bcrypt.compare(input.password, user.passwordHash);
          if (!passwordMatch) {
            return { success: false, message: "Invalid email or password" };
          }

          const db = await getDb();
          if (db) {
            await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, user.id));
          }

          const sessionToken = await sdk.createSessionToken(user.openId, { name: user.name ?? "" });
          // Set cookie as fallback for environments where it works
          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: 365 * 24 * 60 * 60 * 1000 });
          console.log(`[Auth] Session cookie set for user: ${user.email}`);

          return { success: true, message: "Logged in successfully", user, token: sessionToken };
        } catch (error) {
          console.error("Failed to log in:", error);
          return { success: false, message: "Failed to log in" };
        }
      }),
    requestPasswordReset: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async (opts) => {
        const { input } = opts;
        try {
          const user = await getUserByEmail(input.email);
          if (!user || !user.id) {
            return { success: false, message: "No account found with this email address" };
          }

          const token = await createPasswordResetToken(user.id, 1);
          console.log(`[Password Reset] Token created for ${input.email}`);

          // Send password reset email via Resend
          const resetUrl = `https://domusrelocations.com/reset-password?token=${token}`;
          const htmlContent = `
            <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #faf9f6; border: 1px solid #e8e0d0;">
              <div style="border-bottom: 2px solid #b49b6e; padding-bottom: 16px; margin-bottom: 24px;">
                <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; color: #1a1a1a; margin: 0; font-size: 22px; font-weight: 400; font-style: italic;">Reset your DOMUS password</h2>
              </div>
              <p style="font-family: Georgia, serif; color: #1a1a1a; font-size: 15px; line-height: 1.7; margin-bottom: 24px;">We received a request to reset the password for your DOMUS account. Click the button below to choose a new password.</p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background: #1a1a2e; color: #ffffff; text-decoration: none; font-family: 'Jost', Georgia, sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Reset My Password</a>
              </div>
              <p style="font-family: Georgia, serif; color: #6b6b6b; font-size: 13px; line-height: 1.6; margin-bottom: 8px;">This link will expire in <strong>1 hour</strong>. If you did not request a password reset, you can safely ignore this email — your account remains secure.</p>
              <p style="font-family: Georgia, serif; color: #999; font-size: 12px; margin-top: 24px; padding-top: 16px; border-top: 1px solid #e8e0d0;">If the button above does not work, copy and paste this link into your browser:<br><span style="color: #b49b6e; word-break: break-all;">${resetUrl}</span></p>
            </div>
          `;

          try {
            await sendEmailViaResend({
              to: input.email,
              subject: "Reset your DOMUS password",
              htmlContent,
              textContent: `Reset your DOMUS password\n\nClick the link below to reset your password (expires in 1 hour):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
            });
          } catch (emailError) {
            console.error("[Password Reset] Failed to send email:", emailError);
            // Still return success — token is valid, user can request again
          }

          return { success: true, message: "Check your email for password reset instructions" };
        } catch (error) {
          console.error("Failed to request password reset:", error);
          return { success: false, message: "Failed to process request" };
        }
      }),
    resetPassword: publicProcedure
      .input(z.object({
        token: z.string(),
        newPassword: z.string().min(8),
      }))
      .mutation(async (opts) => {
        const { input } = opts;
        try {
          const tokenRecord = await validatePasswordResetToken(input.token);
          if (!tokenRecord) {
            return { success: false, message: "Invalid or expired reset link" };
          }

          const passwordHash = await bcrypt.hash(input.newPassword, 10);
          await updateUserPasswordByUserId(tokenRecord.userId, passwordHash);
          await deletePasswordResetToken(tokenRecord.id);

          return { success: true, message: "Password reset successfully" };
        } catch (error) {
          console.error("Failed to reset password:", error);
          return { success: false, message: "Failed to reset password" };
        }
      }),
  }),

  // Quiz and contact submissions
  submissions: router({
    submitQuiz: publicProcedure
      .input(z.object({
        email: z.string().email(),
        fullName: z.string().min(1),
        answers: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
        persona: z.string(),
      }))
      .mutation(async (opts) => {
        const { input } = opts;
        try {
          // Generate AI-powered profile and recommendations
          const profilePrompt = `Based on these relocation quiz answers from ${input.fullName}, generate a concise personalized relocation profile:

Answers:
${Object.entries(input.answers).map(([q, a]) => `- ${q}: ${a}`).join('\n')}

Persona: ${input.persona}

Provide a JSON response with:
1. "summary": 2-3 sentence personalized summary of their relocation needs
2. "keyInsights": array of 3-4 key insights about their profile
3. "recommendedServices": array of recommended DOMUS services for them`;

          const profileResponse = await invokeLLM({
            messages: [
              { role: "system", content: "You are a relocation expert analyzing client profiles. Respond with valid JSON only." },
              { role: "user", content: profilePrompt },
            ],
            response_format: {
              type: "json_schema",
              json_schema: {
                name: "relocation_profile",
                strict: true,
                schema: {
                  type: "object",
                  properties: {
                    summary: { type: "string" },
                    keyInsights: { type: "array", items: { type: "string" } },
                    recommendedServices: { type: "array", items: { type: "string" } },
                  },
                  required: ["summary", "keyInsights", "recommendedServices"],
                  additionalProperties: false,
                },
              },
            },
          });

          let profile = null;
          let recommendations = null;
          let leadScore = 50;
          let leadPriority: "high" | "standard" | "future" = "standard";

          try {
            const profileContent = profileResponse.choices[0]?.message.content;
            if (typeof profileContent === "string") {
              const parsed = JSON.parse(profileContent);
              profile = JSON.stringify(parsed);
              recommendations = JSON.stringify(parsed.recommendedServices);
              
              // Calculate lead score based on answers
              const timeline = input.answers["timeline"];
              const familySize = input.answers["family"];
              
              if (timeline === "immediate" && (familySize === "family_young" || familySize === "family_teen")) {
                leadScore = 90;
                leadPriority = "high";
              } else if (timeline === "immediate") {
                leadScore = 80;
                leadPriority = "high";
              } else if (timeline === "soon") {
                leadScore = 65;
                leadPriority = "standard";
              } else {
                leadScore = 40;
                leadPriority = "future";
              }
            }
          } catch (parseError) {
            console.error("Failed to parse AI profile response:", parseError);
          }

          // Save quiz response with AI-generated data
          await saveQuizResponse({
            email: input.email,
            fullName: input.fullName,
            answers: JSON.stringify(input.answers),
            persona: input.persona,
            profile,
            recommendations,
            leadScore,
            leadPriority,
          });
          
          // Format quiz answers for email
          const formattedAnswers = Object.entries(input.answers)
            .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
            .join('\n\n');

          // Parse profile for email content
          let profileSummary = "Profile generation pending";
          let keyInsights: string[] = [];
          let recommendedServices: string[] = [];

          if (profile) {
            try {
              const profileData = JSON.parse(profile);
              profileSummary = profileData.summary || profileSummary;
              keyInsights = profileData.keyInsights || [];
              recommendedServices = profileData.recommendedServices || [];
            } catch (e) {
              console.error("Failed to parse profile for email:", e);
            }
          }

          // Send email to team with lead information
          const emailContent = `New Persona Quiz Submission - Lead Score: ${leadScore}/100 (${leadPriority.toUpperCase()})

Client Information:
Name: ${input.fullName}
Email: ${input.email}
Persona: ${input.persona}

Quiz Answers:
${formattedAnswers}

AI-Generated Profile:
${profileSummary}

Key Insights:
${keyInsights.map((insight) => `- ${insight}`).join('\n')}

Recommended Services:
${recommendedServices.map((service) => `- ${service}`).join('\n')}

View full details in the admin dashboard.`;

          // Send email notification using Manus email service
          try {
            const { subject, htmlContent, textContent } = formatQuizEmailContent({
              fullName: input.fullName,
              email: input.email,
              profileName: input.persona,
              profileDescription: profileSummary,
              recommendations: recommendedServices,
              leadScore,
              answers: input.answers,
            });
            
            await sendEmailViaResend({
              to: "milano@domusrelocations.com",
              subject,
              htmlContent,
              textContent,
            });
          } catch (emailError) {
            console.error("Error sending email:", emailError);
          }
          
          // Also notify owner via platform notification
          await notifyOwner({
            title: `New Lead: ${input.fullName} (Score: ${leadScore}/100)`,
            content: `${input.fullName} (${input.email}) completed the persona quiz as ${input.persona}. Lead Priority: ${leadPriority.toUpperCase()}. Check your email for full details.`,
          });
          
          return { success: true, message: "Quiz response saved successfully", leadScore, leadPriority };
        } catch (error) {
          console.error("Failed to save quiz response:", error);
          return { success: false, message: "Failed to save quiz response" };
        }
      }),

    submitContact: publicProcedure
      .input(z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      }))
      .mutation(async (opts) => {
        const { input } = opts;
        try {
          await saveContactSubmission({
            fullName: input.fullName,
            email: input.email,
            message: input.message,
          });
          
          // Send immediate email to milano@domusrelocations.com
          const messagePreview = input.message.substring(0, 100) + (input.message.length > 100 ? "..." : "");
          try {
            const htmlContent = `
              <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #faf9f6; border: 1px solid #e8e0d0;">
                <div style="border-bottom: 2px solid #b49b6e; padding-bottom: 16px; margin-bottom: 24px;">
                  <h2 style="font-family: 'Cormorant Garamond', Georgia, serif; color: #1a1a1a; margin: 0; font-size: 22px; font-weight: 400;">New Contact Inquiry — DOMUS</h2>
                </div>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                  <tr><td style="padding: 8px 0; color: #6b6b6b; font-size: 13px; width: 120px;">Name</td><td style="padding: 8px 0; color: #1a1a1a; font-size: 14px;">${input.fullName}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b6b6b; font-size: 13px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${input.email}" style="color: #b49b6e; text-decoration: none;">${input.email}</a></td></tr>
                </table>
                <div style="background: #ffffff; border-left: 3px solid #b49b6e; padding: 16px 20px; margin-bottom: 24px;">
                  <p style="margin: 0; color: #1a1a1a; font-size: 14px; line-height: 1.7;">${input.message.replace(/\n/g, "<br>")}</p>
                </div>
                <p style="font-size: 12px; color: #999; margin: 0;">Submitted via domusrelocations.com contact form</p>
              </div>
            `;
            await sendEmailViaResend({
              to: "milano@domusrelocations.com",
              subject: `New Contact Inquiry — ${input.fullName}`,
              htmlContent,
              textContent: `New contact inquiry from ${input.fullName} (${input.email}):\n\n${input.message}`,
            });
          } catch (emailError) {
            console.error("[Contact] Failed to send email notification:", emailError);
          }

          // Also notify via platform notification
          await notifyOwner({
            title: "New Contact Inquiry",
            content: `${input.fullName} (${input.email}) has sent a new inquiry: "${messagePreview}"`,
          });
          
          return { success: true, message: "Contact submission saved successfully" };
        } catch (error) {
          console.error("Failed to save contact submission:", error);
          return { success: false, message: "Failed to save contact submission" };
        }
      }),

    getQuizResponses: publicProcedure.query(async () => {
      try {
        const responses = await getQuizResponses();
        return responses;
      } catch (error) {
        console.error("Failed to get quiz responses:", error);
        return [];
      }
    }),

    getContactSubmissions: publicProcedure.query(async () => {
      try {
        const submissions = await getContactSubmissions();
        return submissions;
      } catch (error) {
        console.error("Failed to get contact submissions:", error);
        return [];
      }
    }),

    getUserQuizzes: publicProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .query(async (opts) => {
        const { input } = opts;
        try {
          const responses = await getQuizResponsesByEmail(input.email);
          return responses;
        } catch (error) {
          console.error("Failed to get user quizzes:", error);
          return [];
        }
      }),

    submitInquiry: publicProcedure
      .input(z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        serviceType: z.string().min(1),
        message: z.string().optional(),
      }))
      .mutation(async (opts) => {
        const { input } = opts;
        try {
          await saveInquiry({
            fullName: input.fullName,
            email: input.email,
            phone: input.phone,
            serviceType: input.serviceType,
            message: input.message,
          });
          
          // Send email notification using Manus email service
          try {
            const { subject, htmlContent, textContent } = formatInquiryEmailContent({
              fullName: input.fullName,
              email: input.email,
              phone: input.phone,
              serviceType: input.serviceType,
              message: input.message,
            });
            
            await sendEmailViaResend({
              to: "milano@domusrelocations.com",
              subject,
              htmlContent,
              textContent,
            });
          } catch (emailError) {
            console.error("Error sending inquiry email:", emailError);
          }
          
          const messagePreview = input.message ? input.message.substring(0, 100) + (input.message.length > 100 ? "..." : "") : "No message provided";
          await notifyOwner({
            title: "New DOMUS Inquiry",
            content: `${input.fullName} (${input.email}${input.phone ? ", " + input.phone : ""}) has submitted an inquiry for ${input.serviceType}: "${messagePreview}"`,
          });
          
          return { success: true, message: "Inquiry submitted successfully" };
        } catch (error) {
          console.error("Failed to save inquiry:", error);
          return { success: false, message: "Failed to submit inquiry" };
        }
      }),

    getInquiries: publicProcedure.query(async () => {
      try {
        const inquiries = await getInquiries();
        return inquiries;
      } catch (error) {
        console.error("Failed to get inquiries:", error);
        return [];
      }
    }),
  }),

  twoFactor: router({
    setupTotp: publicProcedure.mutation(async (opts) => {
      const { ctx } = opts;
      if (!ctx.user) {
        return { success: false, message: "Not authenticated" };
      }

      try {
        const speakeasy = await import("speakeasy");
        const qrcode = await import("qrcode");

        const secret = speakeasy.generateSecret({
          name: `DOMUS (${ctx.user.email})`,
          issuer: "DOMUS",
          length: 32,
        });

        const backupCodes = Array.from({ length: 10 }, () =>
          Math.random().toString(36).substring(2, 10).toUpperCase()
        );

        await createTotpSecret(ctx.user.id, secret.base32, backupCodes);

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url!);

        return {
          success: true,
          secret: secret.base32,
          qrCode: qrCodeUrl,
          backupCodes,
        };
      } catch (error) {
        console.error("Failed to setup TOTP:", error);
        return { success: false, message: "Failed to setup 2FA" };
      }
    }),

    verifyTotp: publicProcedure
      .input(z.object({
        code: z.string().length(6),
      }))
      .mutation(async (opts) => {
        const { input, ctx } = opts;
        if (!ctx.user) {
          return { success: false, message: "Not authenticated" };
        }

        try {
          const speakeasy = await import("speakeasy");
          const totp = await getTotpSecretByUserId(ctx.user.id);

          if (!totp) {
            return { success: false, message: "2FA not set up" };
          }

          const verified = speakeasy.totp.verify({
            secret: totp.secret,
            encoding: "base32",
            token: input.code,
            window: 2,
          });

          if (!verified) {
            return { success: false, message: "Invalid code" };
          }

          await enableTotpSecret(totp.id);

          return { success: true, message: "2FA enabled successfully" };
        } catch (error) {
          console.error("Failed to verify TOTP:", error);
          return { success: false, message: "Failed to verify code" };
        }
      }),

    disableTotp: publicProcedure.mutation(async (opts) => {
      const { ctx } = opts;
      if (!ctx.user) {
        return { success: false, message: "Not authenticated" };
      }

      try {
        await disableTotpSecret(ctx.user.id);
        return { success: true, message: "2FA disabled successfully" };
      } catch (error) {
        console.error("Failed to disable TOTP:", error);
        return { success: false, message: "Failed to disable 2FA" };
      }
    }),
  }),

  trustedNetwork: router({
    getAll: publicProcedure.query(async () => {
      try {
        const contacts = await getTrustedNetworkContacts();
        return contacts;
      } catch (error) {
        console.error("Failed to get trusted network contacts:", error);
        return [];
      }
    }),

    getByCategory: publicProcedure
      .input(z.object({
        category: z.string(),
      }))
      .query(async (opts) => {
        const { input } = opts;
        try {
          const contacts = await getTrustedNetworkContactsByCategory(input.category);
          return contacts;
        } catch (error) {
          console.error("Failed to get trusted network contacts by category:", error);
          return [];
        }
      }),
  }),

  // Client private dashboard
  clientDashboard: clientDashboardRouter,

  // Admin dashboard management
  adminDashboard: adminDashboardRouter,

  // Intake questionnaire
  intake: intakeRouter,

  // DOMUS Meridian — Corporate HR Platform
  corporate: router(corporateRouter),

  admin: router({
    getAllClients: publicProcedure.query(async () => {
      try {
        const clients = await getAllClients();
        return clients;
      } catch (error) {
        console.error("Failed to get all clients:", error);
        return [];
      }
    }),

    getClientData: publicProcedure
      .input(z.object({
        clientId: z.number(),
      }))
      .query(async (opts) => {
        const { input } = opts;
        try {
          const client = await getClientWithData(input.clientId);
          return client;
        } catch (error) {
          console.error("Failed to get client data:", error);
          return null;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
