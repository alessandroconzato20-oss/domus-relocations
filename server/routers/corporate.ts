/**
 * DOMUS Meridian — Corporate HR Platform Router
 * Procedures: leads, access codes, accounts, assignments, cost data
 */

import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import {
  cityCostData,
  completedEngagementData,
  corporateAccessCodes,
  corporateAccounts,
  corporateAssignments,
  corporateLeads,
  users,
} from "../../drizzle/schema";
import { adminProcedure, protectedProcedure, publicProcedure } from "../_core/trpc";

// ─── PUBLIC ───────────────────────────────────────────────────────────────────

export const corporateRouter = {
  // Submit a corporate lead (public gated form)
  submitLead: publicProcedure
    .input(
      z.object({
        companyName: z.string().min(1).max(255),
        workEmail: z.string().email().max(320),
        relocationsPerYear: z.string().min(1).max(100),
        contactName: z.string().max(255).optional(),
        message: z.string().max(2000).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.insert(corporateLeads).values({
        companyName: input.companyName,
        workEmail: input.workEmail,
        relocationsPerYear: input.relocationsPerYear,
        contactName: input.contactName,
        message: input.message,
        status: "pending",
      });
      return { success: true };
    }),

  // Activate a corporate account with an access code
  activateCode: protectedProcedure
    .input(z.object({ code: z.string().min(6).max(6) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const upperCode = input.code.toUpperCase();
      const [record] = await db
        .select()
        .from(corporateAccessCodes)
        .where(and(eq(corporateAccessCodes.code, upperCode), eq(corporateAccessCodes.isActive, 1)));

      if (!record) throw new TRPCError({ code: "NOT_FOUND", message: "Invalid or expired access code." });
      if (record.usedAt) throw new TRPCError({ code: "CONFLICT", message: "This code has already been used." });

      // Mark code as used
      await db
        .update(corporateAccessCodes)
        .set({ usedAt: new Date(), usedByUserId: ctx.user.id })
        .where(eq(corporateAccessCodes.id, record.id));

      // Update user role to corporate_hr (cast to any since enum may not include it yet)
      await db.update(users).set({ role: "corporate_hr" as any }).where(eq(users.id, ctx.user.id));

      // Create corporate account
      const [account] = await db.insert(corporateAccounts).values({
        companyName: record.companyName,
        accessCodeId: record.id,
        primaryUserId: ctx.user.id,
        showFullNames: 0,
        isActive: 1,
      }).$returningId();

      return { success: true, companyName: record.companyName, accountId: account.id };
    }),

  // Get current user's corporate account
  getMyAccount: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [account] = await db
      .select()
      .from(corporateAccounts)
      .where(eq(corporateAccounts.primaryUserId, ctx.user.id));
    return account ?? null;
  }),

  // Get assignments for the current corporate account
  getAssignments: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    const [account] = await db
      .select()
      .from(corporateAccounts)
      .where(eq(corporateAccounts.primaryUserId, ctx.user.id));
    if (!account) throw new TRPCError({ code: "FORBIDDEN", message: "No corporate account found." });

    return db
      .select()
      .from(corporateAssignments)
      .where(eq(corporateAssignments.corporateAccountId, account.id))
      .orderBy(desc(corporateAssignments.createdAt));
  }),

  // Get cost data for estimator
  getCostData: publicProcedure
    .input(
      z.object({
        city: z.string(),
        profileType: z.enum(["solo", "couple", "family_children"]),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      return db
        .select()
        .from(cityCostData)
        .where(
          and(
            eq(cityCostData.city, input.city),
            eq(cityCostData.profileType, input.profileType)
          )
        )
        .orderBy(cityCostData.subArea);
    }),

  // Get all available cities
  getCities: publicProcedure.query(async () => {
    const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db
      .selectDistinct({ city: cityCostData.city, dataQuality: cityCostData.dataQuality })
      .from(cityCostData)
      .orderBy(cityCostData.city);
  }),

  // Toggle showFullNames setting
  updateAccountSettings: protectedProcedure
    .input(z.object({ showFullNames: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db
        .update(corporateAccounts)
        .set({ showFullNames: input.showFullNames ? 1 : 0 })
        .where(eq(corporateAccounts.primaryUserId, ctx.user.id));
      return { success: true };
    }),

  // ─── ADMIN ─────────────────────────────────────────────────────────────────

  adminListLeads: adminProcedure.query(async () => {
    const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db.select().from(corporateLeads).orderBy(desc(corporateLeads.createdAt));
  }),

  adminUpdateLeadStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.enum(["pending", "approved", "rejected"]) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.update(corporateLeads).set({ status: input.status }).where(eq(corporateLeads.id, input.id));
      return { success: true };
    }),

  adminListCodes: adminProcedure.query(async () => {
    const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db.select().from(corporateAccessCodes).orderBy(desc(corporateAccessCodes.createdAt));
  }),

  adminGenerateCode: adminProcedure
    .input(z.object({ companyName: z.string().min(1).max(255) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const code = Math.random().toString(36).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6).padEnd(6, "X");
      await db.insert(corporateAccessCodes).values({
        code,
        companyName: input.companyName,
        createdByAdminId: ctx.user.id,
        isActive: 1,
      });
      return { code };
    }),

  adminListAccounts: adminProcedure.query(async () => {
    const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db.select().from(corporateAccounts).orderBy(desc(corporateAccounts.createdAt));
  }),

  adminUpsertAssignment: adminProcedure
    .input(
      z.object({
        id: z.number().optional(),
        corporateAccountId: z.number(),
        employeeInitials: z.string().max(10),
        employeeFullName: z.string().max(255).optional(),
        seniorityBand: z.enum(["junior", "mid", "senior", "executive"]),
        familySize: z.enum(["solo", "couple", "family_children"]),
        destinationCity: z.string().max(100),
        status: z.enum(["new", "on_track", "needs_attention", "completed"]),
        progressPercent: z.number().min(0).max(100),
        milestones: z.object({
          housing: z.enum(["pending", "in_progress", "completed"]),
          school: z.enum(["pending", "in_progress", "completed", "na"]),
          documentation: z.enum(["pending", "in_progress", "completed"]),
          banking: z.enum(["pending", "in_progress", "completed"]),
          healthcare: z.enum(["pending", "in_progress", "completed"]),
        }),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const payload = {
        employeeInitials: input.employeeInitials,
        employeeFullName: input.employeeFullName,
        seniorityBand: input.seniorityBand,
        familySize: input.familySize,
        destinationCity: input.destinationCity,
        status: input.status,
        progressPercent: input.progressPercent,
        milestones: input.milestones,
        notes: input.notes,
      };
      if (input.id) {
        await db.update(corporateAssignments).set(payload).where(eq(corporateAssignments.id, input.id));
      } else {
        await db.insert(corporateAssignments).values({ ...payload, corporateAccountId: input.corporateAccountId });
      }
      return { success: true };
    }),

  // ─── CITY COST DATA ADMIN ──────────────────────────────────────────────────

  adminListCostData: adminProcedure.query(async () => {
    const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
    return db.select().from(cityCostData).orderBy(cityCostData.city, cityCostData.profileType);
  }),

  adminUpsertCostData: adminProcedure
    .input(
      z.object({
        id: z.number().optional(),
        city: z.string().max(100),
        subArea: z.string().max(100).optional(),
        profileType: z.enum(["solo", "couple", "family_children"]),
        rentRangeMin: z.number().int().min(0),
        rentRangeMax: z.number().int().min(0),
        schoolFeeRangeMin: z.number().int().min(0).optional(),
        schoolFeeRangeMax: z.number().int().min(0).optional(),
        setupCostEstimate: z.number().int().min(0),
        healthcareCostEstimate: z.number().int().min(0),
        domusServiceFeeMin: z.number().int().min(0),
        domusServiceFeeMax: z.number().int().min(0),
        dataSource: z.enum(["market_only", "blended", "domus_data"]),
        dataQuality: z.enum(["full", "limited"]),
        lastUpdatedBy: z.string().max(255),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const values = {
        city: input.city,
        subArea: input.subArea,
        profileType: input.profileType,
        rentRangeMin: input.rentRangeMin,
        rentRangeMax: input.rentRangeMax,
        schoolFeeRangeMin: input.schoolFeeRangeMin,
        schoolFeeRangeMax: input.schoolFeeRangeMax,
        setupCostEstimate: input.setupCostEstimate,
        healthcareCostEstimate: input.healthcareCostEstimate,
        domusServiceFeeMin: input.domusServiceFeeMin,
        domusServiceFeeMax: input.domusServiceFeeMax,
        dataSource: input.dataSource,
        dataQuality: input.dataQuality,
        lastUpdatedBy: input.lastUpdatedBy,
      };
      if (input.id) {
        await db.update(cityCostData).set(values).where(eq(cityCostData.id, input.id));
      } else {
        await db.insert(cityCostData).values(values);
      }
      return { success: true };
    }),

  adminDeleteCostData: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.delete(cityCostData).where(eq(cityCostData.id, input.id));
      return { success: true };
    }),

  adminAddEngagementData: adminProcedure
    .input(
      z.object({
        city: z.string().max(100),
        profileType: z.enum(["solo", "couple", "family_children"]),
        actualRentPaid: z.number().int().min(0),
        actualSchoolFeesPaid: z.number().int().min(0).optional(),
        actualSetupCost: z.number().int().min(0),
        actualTimeToHousing: z.number().int().min(0).optional(),
        actualTimeToSchoolPlacement: z.number().int().min(0).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      await db.insert(completedEngagementData).values({
        city: input.city,
        profileType: input.profileType,
        actualRentPaid: input.actualRentPaid,
        actualSchoolFeesPaid: input.actualSchoolFeesPaid,
        actualSetupCost: input.actualSetupCost,
        actualTimeToHousing: input.actualTimeToHousing,
        actualTimeToSchoolPlacement: input.actualTimeToSchoolPlacement,
        notes: input.notes,
      });
      return { success: true };
    }),
};
