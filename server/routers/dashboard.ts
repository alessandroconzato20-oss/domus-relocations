/**
 * Dashboard tRPC router
 * - client.* procedures: protected, only accessible by the authenticated client
 * - admin.dashboard.* procedures: admin-only, full CRUD for all client data
 */
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { storagePut, storageGetSignedUrl } from "../storage";
import {
  getClientProfileByUserId,
  getClientProfileById,
  getAllClientProfiles,
  createClientProfile,
  updateClientProfile,
  getChecklistByClientId,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
  getDocumentsByClientId,
  getDocumentById,
  createDocument,
  deleteDocument,
  getAppointmentsByClientId,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getSchoolsByClientId,
  getSchoolById,
  createSchoolOption,
  updateSchoolOption,
  deleteSchoolOption,
  getMessagesByClientId,
  createMessage,
  markMessagesAsRead,
  getUnreadMessageCount,
} from "../db-dashboard";
import { getUserByEmail } from "../db";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function requireAdmin(userEmail: string | null | undefined) {
  if (!userEmail || userEmail !== ENV.adminEmail) {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
}

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "image/jpeg",
  "image/png",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// ─── CLIENT ROUTER ────────────────────────────────────────────────────────────

export const clientDashboardRouter = router({
  /** Get the authenticated client's own profile */
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getClientProfileByUserId(ctx.user.id);
    if (!profile) {
      throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found. Please contact your DOMUS advisor." });
    }
    return profile;
  }),

  /** Get the authenticated client's checklist */
  getMyChecklist: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getClientProfileByUserId(ctx.user.id);
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found." });
    return getChecklistByClientId(profile.id);
  }),

  /** Toggle a checklist item as completed/incomplete */
  toggleChecklistItem: protectedProcedure
    .input(z.object({ itemId: z.number(), isCompleted: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getClientProfileByUserId(ctx.user.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found." });
      await updateChecklistItem(input.itemId, {
        isCompleted: input.isCompleted ? 1 : 0,
        completedAt: input.isCompleted ? new Date() : undefined,
      });
      return { success: true };
    }),

  /** Get the authenticated client's documents */
  getMyDocuments: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getClientProfileByUserId(ctx.user.id);
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found." });
    return getDocumentsByClientId(profile.id);
  }),

  /** Get a pre-signed download URL for a document */
  getDocumentDownloadUrl: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const profile = await getClientProfileByUserId(ctx.user.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found." });
      const doc = await getDocumentById(input.documentId);
      if (!doc || doc.clientProfileId !== profile.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Document not found or access denied." });
      }
      const url = await storageGetSignedUrl(doc.s3Key);
      return { url, fileName: doc.originalName };
    }),

  /** Get the authenticated client's appointments */
  getMyAppointments: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getClientProfileByUserId(ctx.user.id);
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found." });
    return getAppointmentsByClientId(profile.id);
  }),

  /** Get the authenticated client's school options */
  getMySchools: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getClientProfileByUserId(ctx.user.id);
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found." });
    return getSchoolsByClientId(profile.id);
  }),

  /** Get messages for the authenticated client */
  getMyMessages: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getClientProfileByUserId(ctx.user.id);
    if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found." });
    // Mark admin messages as read when client views them
    await markMessagesAsRead(profile.id, "admin");
    return getMessagesByClientId(profile.id);
  }),

  /** Send a message from the client to admin */
  sendMessage: protectedProcedure
    .input(z.object({ content: z.string().min(1).max(5000) }))
    .mutation(async ({ ctx, input }) => {
      const profile = await getClientProfileByUserId(ctx.user.id);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "No client profile found." });
      const msg = await createMessage({
        clientProfileId: profile.id,
        senderRole: "client",
        content: input.content.trim(),
        isRead: 0,
      });
      return msg;
    }),

  /** Get unread message count for the client */
  getUnreadCount: protectedProcedure.query(async ({ ctx }) => {
    const profile = await getClientProfileByUserId(ctx.user.id);
    if (!profile) return { count: 0 };
    const count = await getUnreadMessageCount(profile.id, "client");
    return { count };
  }),
});

// ─── ADMIN DASHBOARD ROUTER ───────────────────────────────────────────────────

export const adminDashboardRouter = router({
  /** List all client profiles */
  listClients: protectedProcedure.query(async ({ ctx }) => {
    requireAdmin(ctx.user.email);
    return getAllClientProfiles();
  }),

  /** Search for a user by email (for linking when creating a new client profile) */
  searchUserByEmail: protectedProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const user = await getUserByEmail(input.email);
      if (!user) return null;
      return { id: user.id, name: user.name, email: user.email };
    }),

  /** Create a new client profile linked to an existing user */
  createClient: protectedProcedure
    .input(z.object({
      userId: z.number(),
      fullName: z.string().min(1).max(255),
      email: z.string().email(),
      phone: z.string().max(50).optional(),
      nationality: z.string().max(100).optional(),
      currentCity: z.string().max(100).optional(),
      targetMoveDate: z.string().max(50).optional(),
      servicePackage: z.enum(["standard", "premium", "elite"]).default("standard"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const profile = await createClientProfile({
        userId: input.userId,
        fullName: input.fullName,
        email: input.email,
        phone: input.phone,
        nationality: input.nationality,
        currentCity: input.currentCity,
        targetMoveDate: input.targetMoveDate,
        servicePackage: input.servicePackage,
        notes: input.notes,
        isActive: 1,
      });
      if (!profile) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create client profile." });
      return profile;
    }),

  /** Update a client profile */
  updateClient: protectedProcedure
    .input(z.object({
      id: z.number(),
      fullName: z.string().min(1).max(255).optional(),
      phone: z.string().max(50).optional(),
      nationality: z.string().max(100).optional(),
      currentCity: z.string().max(100).optional(),
      targetMoveDate: z.string().max(50).optional(),
      servicePackage: z.enum(["standard", "premium", "elite"]).optional(),
      notes: z.string().optional(),
      isActive: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const { id, ...data } = input;
      await updateClientProfile(id, data);
      return { success: true };
    }),

  /** Get full client data (profile + all related data) */
  getClientFull: protectedProcedure
    .input(z.object({ clientId: z.number() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const profile = await getClientProfileById(input.clientId);
      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Client not found." });
      const [checklist, docs, appts, schools, msgs] = await Promise.all([
        getChecklistByClientId(profile.id),
        getDocumentsByClientId(profile.id),
        getAppointmentsByClientId(profile.id),
        getSchoolsByClientId(profile.id),
        getMessagesByClientId(profile.id),
      ]);
      return { profile, checklist, documents: docs, appointments: appts, schools, messages: msgs };
    }),

  // ─── CHECKLIST ADMIN ───────────────────────────────────────────────────────

  addChecklistItem: protectedProcedure
    .input(z.object({
      clientProfileId: z.number(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      category: z.string().max(100).optional(),
      dueDate: z.date().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const item = await createChecklistItem({
        clientProfileId: input.clientProfileId,
        title: input.title,
        description: input.description,
        category: input.category,
        dueDate: input.dueDate,
        sortOrder: input.sortOrder,
        isCompleted: 0,
      });
      if (!item) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create checklist item." });
      return item;
    }),

  updateChecklistItem: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      category: z.string().max(100).optional(),
      isCompleted: z.boolean().optional(),
      dueDate: z.date().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const { id, isCompleted, ...rest } = input;
      await updateChecklistItem(id, {
        ...rest,
        ...(isCompleted !== undefined ? {
          isCompleted: isCompleted ? 1 : 0,
          completedAt: isCompleted ? new Date() : undefined,
        } : {}),
      });
      return { success: true };
    }),

  deleteChecklistItem: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      await deleteChecklistItem(input.id);
      return { success: true };
    }),

  // ─── DOCUMENTS ADMIN ───────────────────────────────────────────────────────

  /** Upload a document for a client — expects base64-encoded file data */
  uploadDocument: protectedProcedure
    .input(z.object({
      clientProfileId: z.number(),
      fileName: z.string().min(1).max(255),
      mimeType: z.string(),
      fileSize: z.number().max(MAX_FILE_SIZE, "File exceeds 10MB limit"),
      base64Data: z.string(), // base64-encoded file content
      category: z.string().max(100).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      if (!ALLOWED_MIME_TYPES.includes(input.mimeType)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "File type not allowed. Allowed: PDF, DOCX, XLSX, JPG, PNG." });
      }
      const buffer = Buffer.from(input.base64Data, "base64");
      const s3Key = `clients/${input.clientProfileId}/documents/${Date.now()}-${input.fileName}`;
      await storagePut(s3Key, buffer, input.mimeType);
      const doc = await createDocument({
        clientProfileId: input.clientProfileId,
        fileName: input.fileName,
        originalName: input.fileName,
        mimeType: input.mimeType,
        fileSize: input.fileSize,
        s3Key,
        category: input.category,
      });
      if (!doc) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to save document record." });
      return doc;
    }),

  /** Get a pre-signed download URL for a document (admin) */
  getDocumentDownloadUrl: protectedProcedure
    .input(z.object({ documentId: z.number() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const doc = await getDocumentById(input.documentId);
      if (!doc) throw new TRPCError({ code: "NOT_FOUND", message: "Document not found." });
      const url = await storageGetSignedUrl(doc.s3Key);
      return { url, fileName: doc.originalName };
    }),

  deleteDocument: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      await deleteDocument(input.id);
      return { success: true };
    }),

  // ─── APPOINTMENTS ADMIN ────────────────────────────────────────────────────

  addAppointment: protectedProcedure
    .input(z.object({
      clientProfileId: z.number(),
      title: z.string().min(1).max(255),
      description: z.string().optional(),
      appointmentDate: z.date(),
      location: z.string().max(255).optional(),
      type: z.enum(["call", "viewing", "meeting", "school_visit", "other"]).default("meeting"),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const appt = await createAppointment({
        clientProfileId: input.clientProfileId,
        title: input.title,
        description: input.description,
        appointmentDate: input.appointmentDate,
        location: input.location,
        type: input.type,
        status: "scheduled",
      });
      if (!appt) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create appointment." });
      return appt;
    }),

  updateAppointment: protectedProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      appointmentDate: z.date().optional(),
      location: z.string().max(255).optional(),
      type: z.enum(["call", "viewing", "meeting", "school_visit", "other"]).optional(),
      status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const { id, ...data } = input;
      await updateAppointment(id, data);
      return { success: true };
    }),

  deleteAppointment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      await deleteAppointment(input.id);
      return { success: true };
    }),

  // ─── SCHOOLS ADMIN ─────────────────────────────────────────────────────────

  addSchool: protectedProcedure
    .input(z.object({
      clientProfileId: z.number(),
      schoolName: z.string().min(1).max(255),
      type: z.enum(["international", "bilingual", "local", "montessori", "other"]).default("international"),
      ageRange: z.string().max(50).optional(),
      curriculum: z.string().max(100).optional(),
      location: z.string().max(255).optional(),
      website: z.string().max(512).optional(),
      notes: z.string().optional(),
      status: z.enum(["shortlisted", "applied", "accepted", "rejected", "waitlisted"]).default("shortlisted"),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const school = await createSchoolOption(input);
      if (!school) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to create school option." });
      return school;
    }),

  updateSchool: protectedProcedure
    .input(z.object({
      id: z.number(),
      schoolName: z.string().min(1).max(255).optional(),
      type: z.enum(["international", "bilingual", "local", "montessori", "other"]).optional(),
      ageRange: z.string().max(50).optional(),
      curriculum: z.string().max(100).optional(),
      location: z.string().max(255).optional(),
      website: z.string().max(512).optional(),
      notes: z.string().optional(),
      status: z.enum(["shortlisted", "applied", "accepted", "rejected", "waitlisted"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const { id, ...data } = input;
      await updateSchoolOption(id, data);
      return { success: true };
    }),

  deleteSchool: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      await deleteSchoolOption(input.id);
      return { success: true };
    }),

  // ─── MESSAGES ADMIN ────────────────────────────────────────────────────────

  /** Get messages for a specific client (admin view) */
  getClientMessages: protectedProcedure
    .input(z.object({ clientProfileId: z.number() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      // Mark client messages as read when admin views them
      await markMessagesAsRead(input.clientProfileId, "client");
      return getMessagesByClientId(input.clientProfileId);
    }),

  /** Send a message from admin to a client */
  sendMessageToClient: protectedProcedure
    .input(z.object({
      clientProfileId: z.number(),
      content: z.string().min(1).max(5000),
    }))
    .mutation(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const msg = await createMessage({
        clientProfileId: input.clientProfileId,
        senderRole: "admin",
        content: input.content.trim(),
        isRead: 0,
      });
      return msg;
    }),

  /** Get unread message count from clients (admin view) */
  getClientUnreadCount: protectedProcedure
    .input(z.object({ clientProfileId: z.number() }))
    .query(async ({ ctx, input }) => {
      requireAdmin(ctx.user.email);
      const count = await getUnreadMessageCount(input.clientProfileId, "admin");
      return { count };
    }),
});
