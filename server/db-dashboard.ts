/**
 * Dashboard database helpers — client profiles, checklist, documents,
 * appointments, school options, and messages.
 */
import { eq, desc, asc, and } from "drizzle-orm";
import {
  clientProfiles,
  checklistItems,
  documents,
  appointments,
  schoolOptions,
  messages,
  users,
  type ClientProfile,
  type InsertClientProfile,
  type ChecklistItem,
  type InsertChecklistItem,
  type Document,
  type InsertDocument,
  type Appointment,
  type InsertAppointment,
  type SchoolOption,
  type InsertSchoolOption,
  type Message,
  type InsertMessage,
} from "../drizzle/schema";
import { getDb } from "./db";

// ─── CLIENT PROFILES ─────────────────────────────────────────────────────────

export async function getClientProfileByUserId(userId: number): Promise<ClientProfile | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(clientProfiles).where(eq(clientProfiles.userId, userId)).limit(1);
  return results[0] ?? null;
}

export async function getClientProfileById(id: number): Promise<ClientProfile | null> {
  const db = await getDb();
  if (!db) return null;
  const results = await db.select().from(clientProfiles).where(eq(clientProfiles.id, id)).limit(1);
  return results[0] ?? null;
}

export async function getAllClientProfiles(): Promise<(ClientProfile & { userName: string | null; userEmail: string | null })[]> {
  const db = await getDb();
  if (!db) return [];
  const results = await db
    .select({
      id: clientProfiles.id,
      userId: clientProfiles.userId,
      fullName: clientProfiles.fullName,
      email: clientProfiles.email,
      phone: clientProfiles.phone,
      nationality: clientProfiles.nationality,
      currentCity: clientProfiles.currentCity,
      targetMoveDate: clientProfiles.targetMoveDate,
      servicePackage: clientProfiles.servicePackage,
      notes: clientProfiles.notes,
      isActive: clientProfiles.isActive,
      createdAt: clientProfiles.createdAt,
      updatedAt: clientProfiles.updatedAt,
      userName: users.name,
      userEmail: users.email,
    })
    .from(clientProfiles)
    .leftJoin(users, eq(clientProfiles.userId, users.id))
    .orderBy(desc(clientProfiles.createdAt));
  return results;
}

export async function createClientProfile(data: InsertClientProfile): Promise<ClientProfile | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(clientProfiles).values(data);
  const insertId = (result as any)[0]?.insertId ?? (result as any).insertId;
  if (!insertId) return null;
  return getClientProfileById(Number(insertId));
}

export async function updateClientProfile(id: number, data: Partial<InsertClientProfile>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.update(clientProfiles).set(data).where(eq(clientProfiles.id, id));
  return true;
}

// ─── CHECKLIST ITEMS ─────────────────────────────────────────────────────────

export async function getChecklistByClientId(clientProfileId: number): Promise<ChecklistItem[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(checklistItems)
    .where(eq(checklistItems.clientProfileId, clientProfileId))
    .orderBy(asc(checklistItems.sortOrder), asc(checklistItems.createdAt));
}

export async function createChecklistItem(data: InsertChecklistItem): Promise<ChecklistItem | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(checklistItems).values(data);
  const insertId = (result as any)[0]?.insertId ?? (result as any).insertId;
  if (!insertId) return null;
  const rows = await db.select().from(checklistItems).where(eq(checklistItems.id, Number(insertId))).limit(1);
  return rows[0] ?? null;
}

export async function updateChecklistItem(id: number, data: Partial<InsertChecklistItem>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.update(checklistItems).set(data).where(eq(checklistItems.id, id));
  return true;
}

export async function deleteChecklistItem(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(checklistItems).where(eq(checklistItems.id, id));
  return true;
}

// ─── DOCUMENTS ───────────────────────────────────────────────────────────────

export async function getDocumentsByClientId(clientProfileId: number): Promise<Document[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(documents)
    .where(eq(documents.clientProfileId, clientProfileId))
    .orderBy(desc(documents.uploadedAt));
}

export async function getDocumentById(id: number): Promise<Document | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(documents).where(eq(documents.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createDocument(data: InsertDocument): Promise<Document | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(documents).values(data);
  const insertId = (result as any)[0]?.insertId ?? (result as any).insertId;
  if (!insertId) return null;
  return getDocumentById(Number(insertId));
}

export async function deleteDocument(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(documents).where(eq(documents.id, id));
  return true;
}

// ─── APPOINTMENTS ─────────────────────────────────────────────────────────────

export async function getAppointmentsByClientId(clientProfileId: number): Promise<Appointment[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(appointments)
    .where(eq(appointments.clientProfileId, clientProfileId))
    .orderBy(asc(appointments.appointmentDate));
}

export async function getAppointmentById(id: number): Promise<Appointment | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createAppointment(data: InsertAppointment): Promise<Appointment | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(appointments).values(data);
  const insertId = (result as any)[0]?.insertId ?? (result as any).insertId;
  if (!insertId) return null;
  return getAppointmentById(Number(insertId));
}

export async function updateAppointment(id: number, data: Partial<InsertAppointment>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.update(appointments).set(data).where(eq(appointments.id, id));
  return true;
}

export async function deleteAppointment(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(appointments).where(eq(appointments.id, id));
  return true;
}

// ─── SCHOOL OPTIONS ───────────────────────────────────────────────────────────

export async function getSchoolsByClientId(clientProfileId: number): Promise<SchoolOption[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(schoolOptions)
    .where(eq(schoolOptions.clientProfileId, clientProfileId))
    .orderBy(desc(schoolOptions.createdAt));
}

export async function getSchoolById(id: number): Promise<SchoolOption | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(schoolOptions).where(eq(schoolOptions.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createSchoolOption(data: InsertSchoolOption): Promise<SchoolOption | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(schoolOptions).values(data);
  const insertId = (result as any)[0]?.insertId ?? (result as any).insertId;
  if (!insertId) return null;
  return getSchoolById(Number(insertId));
}

export async function updateSchoolOption(id: number, data: Partial<InsertSchoolOption>): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.update(schoolOptions).set(data).where(eq(schoolOptions.id, id));
  return true;
}

export async function deleteSchoolOption(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.delete(schoolOptions).where(eq(schoolOptions.id, id));
  return true;
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export async function getMessagesByClientId(clientProfileId: number): Promise<Message[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages)
    .where(eq(messages.clientProfileId, clientProfileId))
    .orderBy(asc(messages.createdAt));
}

export async function createMessage(data: InsertMessage): Promise<Message | null> {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(messages).values(data);
  const insertId = (result as any)[0]?.insertId ?? (result as any).insertId;
  if (!insertId) return null;
  const rows = await db.select().from(messages).where(eq(messages.id, Number(insertId))).limit(1);
  return rows[0] ?? null;
}

export async function markMessagesAsRead(clientProfileId: number, senderRole: "admin" | "client"): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  await db.update(messages)
    .set({ isRead: 1, readAt: new Date() })
    .where(and(
      eq(messages.clientProfileId, clientProfileId),
      eq(messages.senderRole, senderRole),
    ));
  return true;
}

export async function getUnreadMessageCount(clientProfileId: number, forRole: "admin" | "client"): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  // Count messages sent by the OTHER role that are unread
  const otherRole = forRole === "admin" ? "client" : "admin";
  const rows = await db.select().from(messages)
    .where(and(
      eq(messages.clientProfileId, clientProfileId),
      eq(messages.senderRole, otherRole),
      eq(messages.isRead, 0),
    ));
  return rows.length;
}
