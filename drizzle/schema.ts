import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: text("passwordHash"), // For local authentication
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Quiz responses table
export const quizResponses = mysqlTable("quizResponses", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  // Store quiz answers as JSON
  answers: text("answers").notNull(), // JSON stringified
  // Persona result
  persona: varchar("persona", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizResponse = typeof quizResponses.$inferSelect;
export type InsertQuizResponse = typeof quizResponses.$inferInsert;

// Contact submissions table
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

// Password reset tokens table
export const passwordResetTokens = mysqlTable("passwordResetTokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

// Family dashboard tables
export const families = mysqlTable("families", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  familyName: varchar("familyName", { length: 255 }).notNull(),
  serviceTier: varchar("serviceTier", { length: 100 }).default("standard").notNull(), // standard, premium, vip
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Family = typeof families.$inferSelect;
export type InsertFamily = typeof families.$inferInsert;

// Priority tasks table
export const familyTasks = mysqlTable("familyTasks", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }).notNull(), // Housing, Schools, Legal, Integration
  dueDate: timestamp("dueDate"),
  isCompleted: tinyint("isCompleted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FamilyTask = typeof familyTasks.$inferSelect;
export type InsertFamilyTask = typeof familyTasks.$inferInsert;

// School shortlist table
export const familySchools = mysqlTable("familySchools", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  schoolName: varchar("schoolName", { length: 255 }).notNull(),
  schoolInitials: varchar("schoolInitials", { length: 10 }).notNull(),
  curriculumType: varchar("curriculumType", { length: 100 }).notNull(), // IB, Cambridge, Italian, etc
  ageRange: varchar("ageRange", { length: 100 }).notNull(), // e.g., "3-5 years"
  status: varchar("status", { length: 100 }).default("reviewed").notNull(), // Applied, Visit booked, Reviewed, Offer received, Accepted
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FamilySchool = typeof familySchools.$inferSelect;
export type InsertFamilySchool = typeof familySchools.$inferInsert;

// Messages table
export const familyMessages = mysqlTable("familyMessages", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  senderName: varchar("senderName", { length: 255 }).notNull(), // "DOMUS Advisory", "James Henderson", etc
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: tinyint("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FamilyMessage = typeof familyMessages.$inferSelect;
export type InsertFamilyMessage = typeof familyMessages.$inferInsert;

// Documents table
export const familyDocuments = mysqlTable("familyDocuments", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  documentUrl: text("documentUrl").notNull(), // S3 URL
  category: varchar("category", { length: 100 }).notNull(), // Housing, Schools, Legal, Integration, etc
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FamilyDocument = typeof familyDocuments.$inferSelect;
export type InsertFamilyDocument = typeof familyDocuments.$inferInsert;

// Appointments table
export const familyAppointments = mysqlTable("familyAppointments", {
  id: int("id").autoincrement().primaryKey(),
  familyId: int("familyId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  appointmentDate: timestamp("appointmentDate").notNull(),
  location: varchar("location", { length: 255 }),
  status: varchar("status", { length: 100 }).default("scheduled").notNull(), // scheduled, completed, cancelled
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FamilyAppointment = typeof familyAppointments.$inferSelect;
export type InsertFamilyAppointment = typeof familyAppointments.$inferInsert;
