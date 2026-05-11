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

// Trusted network contacts table
export const trustedNetworkContacts = mysqlTable("trustedNetworkContacts", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(), // e.g., "Pediatrician", "Tax Advisor"
  category: mysqlEnum("category", [
    "Medical",
    "Legal & Tax",
    "Education",
    "Property",
    "Lifestyle & Home",
    "Social & Community",
  ]).notNull(),
  endorsement: text("endorsement").notNull(), // One-line DOMUS endorsement
  contactMethod: mysqlEnum("contactMethod", ["email", "phone"]).notNull(),
  contactValue: varchar("contactValue", { length: 255 }).notNull(), // Email or phone number
  imageUrl: varchar("imageUrl", { length: 512 }), // Optional profile image
  isActive: tinyint("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TrustedNetworkContact = typeof trustedNetworkContacts.$inferSelect;
export type InsertTrustedNetworkContact = typeof trustedNetworkContacts.$inferInsert;

// TOTP 2FA table for admin accounts
export const totpSecrets = mysqlTable("totpSecrets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  secret: varchar("secret", { length: 255 }).notNull(), // Base32 encoded secret
  backupCodes: text("backupCodes").notNull(), // JSON array of backup codes
  isEnabled: tinyint("isEnabled").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  enabledAt: timestamp("enabledAt"),
});

export type TotpSecret = typeof totpSecrets.$inferSelect;
export type InsertTotpSecret = typeof totpSecrets.$inferInsert;
