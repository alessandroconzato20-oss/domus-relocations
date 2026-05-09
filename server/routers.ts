import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";
import { saveQuizResponse, getQuizResponses, saveContactSubmission, getContactSubmissions, getUserByEmail, createLocalUser, getDb, createPasswordResetToken, validatePasswordResetToken, deletePasswordResetToken, updateUserPasswordByUserId } from "./db";
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

          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, newUser.openId, cookieOptions);

          return { success: true, message: "Account created successfully", user: newUser };
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
        try {
          const user = await getUserByEmail(input.email);
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

          const cookieOptions = getSessionCookieOptions(ctx.req);
          ctx.res.cookie(COOKIE_NAME, user.openId, cookieOptions);

          return { success: true, message: "Logged in successfully", user };
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
            return { success: true, message: "If an account exists, a reset link has been sent to your email" };
          }

          const token = await createPasswordResetToken(user.id, 1);
          console.log(`[Password Reset] Token for ${input.email}: ${token}`);
          console.log(`Reset link: /reset-password?token=${token}`);

          return { success: true, message: "If an account exists, a reset link has been sent to your email" };
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
        answers: z.record(z.string(), z.string()),
        persona: z.string(),
      }))
      .mutation(async (opts) => {
        const { input } = opts;
        try {
          await saveQuizResponse({
            email: input.email,
            fullName: input.fullName,
            answers: JSON.stringify(input.answers),
            persona: input.persona,
          });
          
          // Notify owner of new quiz submission
          await notifyOwner({
            title: "New Persona Quiz Submission",
            content: `${input.fullName} (${input.email}) has completed the persona quiz and identified as: ${input.persona}. You can review their responses in the admin dashboard.`,
          });
          
          return { success: true, message: "Quiz response saved successfully" };
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
          
          // Notify owner of new contact submission
          const messagePreview = input.message.substring(0, 100) + (input.message.length > 100 ? "..." : "");
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
  }),
});

export type AppRouter = typeof appRouter;
