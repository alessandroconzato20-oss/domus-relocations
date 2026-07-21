import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, tinyint, json, date } from "drizzle-orm/mysql-core";

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
  // AI-generated profile and recommendations
  profile: text("profile"), // JSON stringified personalized profile
  recommendations: text("recommendations"), // JSON stringified recommendations
  // Lead scoring
  leadScore: int("leadScore").default(0).notNull(), // 0-100 score
  leadPriority: mysqlEnum("leadPriority", ["high", "standard", "future"]).default("standard").notNull(),
  // PDF report
  reportUrl: varchar("reportUrl", { length: 512 }), // URL to generated PDF report
  // Email notification status
  emailSent: tinyint("emailSent").default(0).notNull(),
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

// Inquiry submissions table
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  serviceType: varchar("serviceType", { length: 255 }).notNull(), // e.g., "Relocation", "School Placement"
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

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

// ─── CLIENT DASHBOARD TABLES ────────────────────────────────────────────────

// Client profiles — one per user, created by admin
export const clientProfiles = mysqlTable("clientProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  nationality: varchar("nationality", { length: 100 }),
  currentCity: varchar("currentCity", { length: 100 }),
  targetMoveDate: varchar("targetMoveDate", { length: 50 }),
  servicePackage: mysqlEnum("servicePackage", ["standard", "premium", "elite"]).default("standard").notNull(),
  notes: text("notes"),
  isActive: tinyint("isActive").default(1).notNull(),
  // Milan Preview — AI-generated, published by admin
  clientPreview: text("clientPreview"),
  clientPreviewGeneratedAt: timestamp("clientPreviewGeneratedAt"),
  clientPreviewReadAt: timestamp("clientPreviewReadAt"),
  clientPreviewPublished: tinyint("clientPreviewPublished").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ClientProfile = typeof clientProfiles.$inferSelect;
export type InsertClientProfile = typeof clientProfiles.$inferInsert;

// Checklist items — per client, managed by admin
export const checklistItems = mysqlTable("checklistItems", {
  id: int("id").autoincrement().primaryKey(),
  clientProfileId: int("clientProfileId").notNull().references(() => clientProfiles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 100 }),
  isCompleted: tinyint("isCompleted").default(0).notNull(),
  completedAt: timestamp("completedAt"),
  dueDate: timestamp("dueDate"),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChecklistItem = typeof checklistItems.$inferSelect;
export type InsertChecklistItem = typeof checklistItems.$inferInsert;

// Documents — per client, uploaded by admin, stored in S3
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  clientProfileId: int("clientProfileId").notNull().references(() => clientProfiles.id, { onDelete: "cascade" }),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }).notNull(),
  fileSize: int("fileSize").notNull(), // bytes
  s3Key: varchar("s3Key", { length: 512 }).notNull(), // S3 storage key
  category: varchar("category", { length: 100 }), // e.g. "Lease", "Visa", "School"
  uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// Appointments — per client, managed by admin
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  clientProfileId: int("clientProfileId").notNull().references(() => clientProfiles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  appointmentDate: timestamp("appointmentDate").notNull(),
  location: varchar("location", { length: 255 }),
  type: mysqlEnum("type", ["call", "viewing", "meeting", "school_visit", "other"]).default("meeting").notNull(),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled"]).default("scheduled").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// School options — per client, curated by admin
export const schoolOptions = mysqlTable("schoolOptions", {
  id: int("id").autoincrement().primaryKey(),
  clientProfileId: int("clientProfileId").notNull().references(() => clientProfiles.id, { onDelete: "cascade" }),
  schoolName: varchar("schoolName", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["international", "bilingual", "local", "montessori", "other"]).default("international").notNull(),
  ageRange: varchar("ageRange", { length: 50 }),
  curriculum: varchar("curriculum", { length: 100 }),
  location: varchar("location", { length: 255 }),
  website: varchar("website", { length: 512 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["shortlisted", "applied", "accepted", "rejected", "waitlisted"]).default("shortlisted").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SchoolOption = typeof schoolOptions.$inferSelect;
export type InsertSchoolOption = typeof schoolOptions.$inferInsert;

// Messages — between admin and client
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  clientProfileId: int("clientProfileId").notNull().references(() => clientProfiles.id, { onDelete: "cascade" }),
  senderRole: mysqlEnum("senderRole", ["admin", "client"]).notNull(),
  content: text("content").notNull(),
  isRead: tinyint("isRead").default(0).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ─── TOTP 2FA TABLE ───────────────────────────────────────────────────────────

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

// ─── INTAKE QUESTIONNAIRE TABLE ──────────────────────────────────────────────

export const intakeForms = mysqlTable("intakeForms", {
  id: int("id").autoincrement().primaryKey(),

  // Section 1 — The Family
  primaryName: varchar("primaryName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  preferredLanguage: varchar("preferredLanguage", { length: 50 }).notNull().default("English"),
  whoRelocating: json("whoRelocating").$type<string[]>().notNull(),
  partnerName: varchar("partnerName", { length: 255 }),
  partnerNationality: varchar("partnerNationality", { length: 100 }),
  partnerLanguages: text("partnerLanguages"),
  children: json("children").$type<Array<{
    name: string;
    dateOfBirth: string;
    currentSchool: string;
    currentCurriculum: string;
    yearGrade: string;
    languagesSpoken: string;
    academicLevel?: string;
    strongestSubjects?: string;
    weakestSubjects?: string;
    extracurriculars?: string;
    personality?: string;
  }>>(),
  pets: json("pets").$type<string[]>(),

  // Section 2 — The Move
  fromCity: varchar("fromCity", { length: 255 }).notNull(),
  nationalities: text("nationalities"),
  moveReasons: json("moveReasons").$type<string[]>().notNull(),
  arrivalDate: varchar("arrivalDate", { length: 20 }),
  dateFirmness: varchar("dateFirmness", { length: 100 }),
  intendedDuration: json("intendedDuration").$type<string[]>(),
  targetCity: json("targetCity").$type<string[]>().notNull(),
  livedInItalyBefore: varchar("livedInItalyBefore", { length: 100 }),
  previousCountries: text("previousCountries"),

  // Section 3 — Housing
  rentOrBuy: json("rentOrBuy").$type<string[]>().notNull(),
  budget: json("budget").$type<string[]>().notNull(),
  bedrooms: varchar("bedrooms", { length: 50 }),
  propertyType: varchar("propertyType", { length: 100 }),
  propertyRequirements: json("propertyRequirements").$type<string[]>(),
  neighbourhoodVibe: json("neighbourhoodVibe").$type<string[]>(),
  neighbourhoodInterest: text("neighbourhoodInterest"),
  previousHomeNotes: text("previousHomeNotes"),

  // Section 4 — Education
  childEduProfiles: json("childEduProfiles").$type<Array<{
    childName: string;
    academicStrengths: string;
    extracurriculars: string;
    continuityEssential: string;
  }>>(),
  italianImmersionScale: int("italianImmersionScale"),
  curriculumPreference: json("curriculumPreference").$type<string[]>(),
  midYearEntry: json("midYearEntry").$type<string[]>(),
  learningNeeds: text("learningNeeds"),
  universityTarget: text("universityTarget"),

  // Section 5 — Professional & Fiscal
  professionalSituation: json("professionalSituation").$type<string[]>(),
  partnerProfSituation: json("partnerProfSituation").$type<string[]>(),
  flatTaxInterest: json("flatTaxInterest").$type<string[]>(),
  livedInItalyLast9: json("livedInItalyLast9").$type<string[]>(),
  hasCommercialista: json("hasCommercialista").$type<string[]>(),
  bankingNeeds: json("bankingNeeds").$type<string[]>(),

  // Section 6 — Lifestyle
  lifestyleDescriptors: json("lifestyleDescriptors").$type<string[]>(),
  hobbies: text("hobbies"),
  socialNetworkScale: int("socialNetworkScale"),
  italianLevelYou: varchar("italianLevelYou", { length: 50 }),
  italianLevelPartner: varchar("italianLevelPartner", { length: 50 }),
  healthcareNeeds: json("healthcareNeeds").$type<string[]>(),
  healthcareOther: text("healthcareOther"),
  dietaryNotes: text("dietaryNotes"),

  // Section 7 — Priorities
  topPriorities: json("topPriorities").$type<string[]>(),
  biggestAnxiety: text("biggestAnxiety"),
  prevReloScale: int("prevReloScale"),
  prevReloWentWrong: text("prevReloWentWrong"),
  commsPref: json("commsPref").$type<string[]>(),
  timezone: varchar("timezone", { length: 100 }),
  additionalDecisionMaker: varchar("additionalDecisionMaker", { length: 255 }),
  anythingElse: text("anythingElse"),
  heardAboutDomus: json("heardAboutDomus").$type<string[]>(),

  // Metadata
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  advisorBriefSent: tinyint("advisorBriefSent").default(0).notNull(),
  clientPreviewSent: tinyint("clientPreviewSent").default(0).notNull(),
  assignedAdvisor: varchar("assignedAdvisor", { length: 255 }),
  internalNotes: text("internalNotes"),
  // Client Preview — stored here until linked to a user account
  clientPreviewContent: text("clientPreviewContent"),
  clientPreviewPublished: tinyint("clientPreviewPublished").default(0).notNull(),
  // Account gate — tracks whether the submitter has created/linked an account
  accountStatus: mysqlEnum("accountStatus", ["pending_account", "linked", "skipped"]).default("pending_account").notNull(),
  linkedUserId: int("linkedUserId").references(() => users.id, { onDelete: "set null" }),
});

export type IntakeForm = typeof intakeForms.$inferSelect;
export type InsertIntakeForm = typeof intakeForms.$inferInsert;

// ─── DOMUS MERIDIAN — CORPORATE HR PLATFORM ──────────────────────────────────

// Corporate lead submissions — public gated form at /corporate
export const corporateLeads = mysqlTable("corporateLeads", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  workEmail: varchar("workEmail", { length: 320 }).notNull(),
  relocationsPerYear: varchar("relocationsPerYear", { length: 100 }).notNull(),
  contactName: varchar("contactName", { length: 255 }),
  message: text("message"),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CorporateLead = typeof corporateLeads.$inferSelect;
export type InsertCorporateLead = typeof corporateLeads.$inferInsert;

// Corporate access codes — admin-generated, single-use per company
export const corporateAccessCodes = mysqlTable("corporateAccessCodes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  createdByAdminId: int("createdByAdminId").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  usedAt: timestamp("usedAt"),
  usedByUserId: int("usedByUserId").references(() => users.id, { onDelete: "set null" }),
  isActive: tinyint("isActive").default(1).notNull(),
});

export type CorporateAccessCode = typeof corporateAccessCodes.$inferSelect;
export type InsertCorporateAccessCode = typeof corporateAccessCodes.$inferInsert;

// Corporate accounts — one per company, created when code is activated
export const corporateAccounts = mysqlTable("corporateAccounts", {
  id: int("id").autoincrement().primaryKey(),
  companyName: varchar("companyName", { length: 255 }).notNull(),
  accessCodeId: int("accessCodeId").references(() => corporateAccessCodes.id, { onDelete: "set null" }),
  primaryUserId: int("primaryUserId").notNull().references(() => users.id, { onDelete: "cascade" }),
  showFullNames: tinyint("showFullNames").default(0).notNull(), // privacy toggle
  isActive: tinyint("isActive").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CorporateAccount = typeof corporateAccounts.$inferSelect;
export type InsertCorporateAccount = typeof corporateAccounts.$inferInsert;

// Corporate assignments — employee relocations managed per company
export const corporateAssignments = mysqlTable("corporateAssignments", {
  id: int("id").autoincrement().primaryKey(),
  corporateAccountId: int("corporateAccountId").notNull().references(() => corporateAccounts.id, { onDelete: "cascade" }),
  employeeInitials: varchar("employeeInitials", { length: 10 }).notNull(),
  employeeFullName: varchar("employeeFullName", { length: 255 }), // optional, shown only if showFullNames toggled
  seniorityBand: mysqlEnum("seniorityBand", ["junior", "mid", "senior", "executive"]).default("mid").notNull(),
  familySize: mysqlEnum("familySize", ["solo", "couple", "family_children"]).default("solo").notNull(),
  destinationCity: varchar("destinationCity", { length: 100 }).notNull(),
  startDate: timestamp("startDate"),
  status: mysqlEnum("status", ["new", "on_track", "needs_attention", "completed"]).default("new").notNull(),
  // Milestone tracking (JSON flags)
  milestones: json("milestones").$type<{
    housing: "pending" | "in_progress" | "completed";
    school: "pending" | "in_progress" | "completed" | "na";
    documentation: "pending" | "in_progress" | "completed";
    banking: "pending" | "in_progress" | "completed";
    healthcare: "pending" | "in_progress" | "completed";
  }>().notNull(),
  progressPercent: int("progressPercent").default(0).notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CorporateAssignment = typeof corporateAssignments.$inferSelect;
export type InsertCorporateAssignment = typeof corporateAssignments.$inferInsert;

// City cost data — admin-maintained reference table for cost estimator
export const cityCostData = mysqlTable("cityCostData", {
  id: int("id").autoincrement().primaryKey(),
  city: varchar("city", { length: 100 }).notNull(),
  subArea: varchar("subArea", { length: 100 }), // optional e.g. "Brera", "Navigli"
  profileType: mysqlEnum("profileType", ["solo", "couple", "family_children"]).notNull(),
  rentRangeMin: int("rentRangeMin").notNull(), // monthly EUR
  rentRangeMax: int("rentRangeMax").notNull(),
  schoolFeeRangeMin: int("schoolFeeRangeMin"), // annual EUR, null if no children
  schoolFeeRangeMax: int("schoolFeeRangeMax"),
  setupCostEstimate: int("setupCostEstimate").notNull(), // fiscal + admin one-off
  healthcareCostEstimate: int("healthcareCostEstimate").notNull(), // annual
  domusServiceFeeMin: int("domusServiceFeeMin").notNull(),
  domusServiceFeeMax: int("domusServiceFeeMax").notNull(),
  dataSource: mysqlEnum("dataSource", ["market_only", "blended", "domus_data"]).default("market_only").notNull(),
  dataQuality: mysqlEnum("dataQuality", ["full", "limited"]).default("full").notNull(), // "limited" = thin data city
  lastUpdatedBy: varchar("lastUpdatedBy", { length: 255 }).notNull(),
  lastUpdatedAt: timestamp("lastUpdatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CityCostData = typeof cityCostData.$inferSelect;
export type InsertCityCostData = typeof cityCostData.$inferInsert;

// Completed engagement data — real outcome data fed in after engagements close
export const completedEngagementData = mysqlTable("completedEngagementData", {
  id: int("id").autoincrement().primaryKey(),
  city: varchar("city", { length: 100 }).notNull(),
  profileType: mysqlEnum("profileType", ["solo", "couple", "family_children"]).notNull(),
  actualRentPaid: int("actualRentPaid").notNull(), // monthly EUR
  actualSchoolFeesPaid: int("actualSchoolFeesPaid"), // annual EUR, nullable
  actualSetupCost: int("actualSetupCost").notNull(),
  actualTimeToHousing: int("actualTimeToHousing"), // days
  actualTimeToSchoolPlacement: int("actualTimeToSchoolPlacement"), // days
  completedAt: timestamp("completedAt").defaultNow().notNull(),
  notes: text("notes"),
});

export type CompletedEngagementData = typeof completedEngagementData.$inferSelect;
export type InsertCompletedEngagementData = typeof completedEngagementData.$inferInsert;
