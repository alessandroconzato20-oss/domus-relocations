import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, quizResponses, InsertQuizResponse, contactSubmissions, InsertContactSubmission, trustedNetworkContacts } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Quiz responses
export async function saveQuizResponse(data: InsertQuizResponse) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save quiz response: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(quizResponses).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save quiz response:", error);
    throw error;
  }
}

export async function getQuizResponses() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get quiz responses: database not available");
    return [];
  }

  try {
    const result = await db.select().from(quizResponses).orderBy(quizResponses.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get quiz responses:", error);
    throw error;
  }
}

// Contact submissions
export async function saveContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save contact submission: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(contactSubmissions).values(data);
    return result;
  } catch (error) {
    console.error("[Database] Failed to save contact submission:", error);
    throw error;
  }
}

export async function getContactSubmissions() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submissions: database not available");
    return [];
  }

  try {
    const result = await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get contact submissions:", error);
    throw error;
  }
}


// Local authentication helpers
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  try {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    console.error("[Database] Failed to get user by email:", error);
    throw error;
  }
}

export async function createLocalUser(email: string, name: string, passwordHash: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create user: database not available");
    throw new Error("Database not available");
  }

  try {
    // Generate a unique openId for local users
    const openId = `local_${email}_${Date.now()}`;
    
    await db.insert(users).values({
      openId,
      email,
      name,
      passwordHash,
      loginMethod: "local",
      role: email === "milano@domusrelocations.com" ? "admin" : "user",
    });

    return {
      openId,
      email,
      name,
      passwordHash,
      loginMethod: "local",
      role: email === "milano@domusrelocations.com" ? "admin" : "user",
    };
  } catch (error) {
    console.error("[Database] Failed to create local user:", error);
    throw error;
  }
}

export async function updateUserPassword(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    throw new Error("Database not available");
  }

  try {
    // Note: We need to add a password field to the schema for this to work
    // For now, we'll store it in a separate table or use a different approach
    console.warn("[Database] Password update not yet implemented");
    return true;
  } catch (error) {
    console.error("[Database] Failed to update user password:", error);
    throw error;
  }
}


// Password reset token functions
export async function createPasswordResetToken(userId: number, expiresInHours: number = 1) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create reset token: database not available");
    throw new Error("Database not available");
  }

  try {
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);

    const { passwordResetTokens } = await import("../drizzle/schema");
    await db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt,
    });

    return token;
  } catch (error) {
    console.error("[Database] Failed to create reset token:", error);
    throw error;
  }
}

export async function validatePasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot validate reset token: database not available");
    return null;
  }

  try {
    const { passwordResetTokens } = await import("../drizzle/schema");
    const result = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const tokenRecord = result[0];

    // Check if token has expired
    if (new Date() > tokenRecord.expiresAt) {
      return null;
    }

    return tokenRecord;
  } catch (error) {
    console.error("[Database] Failed to validate reset token:", error);
    throw error;
  }
}

export async function deletePasswordResetToken(tokenId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete reset token: database not available");
    throw new Error("Database not available");
  }

  try {
    const { passwordResetTokens } = await import("../drizzle/schema");
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, tokenId));
  } catch (error) {
    console.error("[Database] Failed to delete reset token:", error);
    throw error;
  }
}

export async function updateUserPasswordByUserId(userId: number, passwordHash: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update password: database not available");
    throw new Error("Database not available");
  }

  try {
    await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update password:", error);
    throw error;
  }
}


export async function getQuizResponsesByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get quiz responses: database not available");
    return [];
  }

  try {
    const result = await db.select().from(quizResponses).where(eq(quizResponses.email, email)).orderBy(quizResponses.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get quiz responses by email:", error);
    throw error;
  }
}


// Trusted network contacts
export async function getTrustedNetworkContacts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get trusted network contacts: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(trustedNetworkContacts)
      .where(eq(trustedNetworkContacts.isActive, 1))
      .orderBy(trustedNetworkContacts.category);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get trusted network contacts:", error);
    throw error;
  }
}

export async function getTrustedNetworkContactsByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get trusted network contacts: database not available");
    return [];
  }

  try {
    const result = await db
      .select()
      .from(trustedNetworkContacts)
      .where(
        and(
          eq(trustedNetworkContacts.category as any, category),
          eq(trustedNetworkContacts.isActive as any, 1)
        )
      );
    return result;
  } catch (error) {
    console.error("[Database] Failed to get trusted network contacts by category:", error);
    throw error;
  }
}


// Admin client management
export async function getAllClients() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get all clients: database not available");
    return [];
  }
  try {
    const result = await db
      .select()
      .from(users)
      .orderBy(users.name);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get all clients:", error);
    throw error;
  }
}

export async function getClientWithData(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get client data: database not available");
    return null;
  }
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id as any, userId))
      .limit(1);
    
    if (!user.length) return null;
    
    return user[0];
  } catch (error) {
    console.error("[Database] Failed to get client data:", error);
    throw error;
  }
}


// TOTP 2FA functions
export async function createTotpSecret(userId: number, secret: string, backupCodes: string[]) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const { totpSecrets } = await import("../drizzle/schema");
    const result = await db.insert(totpSecrets).values({
      userId,
      secret,
      backupCodes: JSON.stringify(backupCodes),
      isEnabled: 0,
    });
    
    return result;
  } catch (error) {
    console.error("Failed to create TOTP secret:", error);
    throw error;
  }
}

export async function getTotpSecretByUserId(userId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const { totpSecrets } = await import("../drizzle/schema");
    const result = await db.select().from(totpSecrets).where(eq(totpSecrets.userId, userId)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error("Failed to get TOTP secret:", error);
    throw error;
  }
}

export async function enableTotpSecret(totpId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const { totpSecrets } = await import("../drizzle/schema");
    await db.update(totpSecrets).set({ isEnabled: 1, enabledAt: new Date() }).where(eq(totpSecrets.id, totpId));
  } catch (error) {
    console.error("Failed to enable TOTP secret:", error);
    throw error;
  }
}

export async function disableTotpSecret(userId: number) {
  try {
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const { totpSecrets } = await import("../drizzle/schema");
    await db.delete(totpSecrets).where(eq(totpSecrets.userId, userId));
  } catch (error) {
    console.error("Failed to disable TOTP secret:", error);
    throw error;
  }
}

export async function validateBackupCode(userId: number, code: string) {
  try {
    const totp = await getTotpSecretByUserId(userId);
    if (!totp) return false;
    
    const codes = JSON.parse(totp.backupCodes) as string[];
    const index = codes.indexOf(code);
    
    if (index === -1) return false;
    
    // Remove used backup code
    codes.splice(index, 1);
    
    const db = await getDb();
    if (!db) throw new Error("Database connection failed");
    
    const { totpSecrets } = await import("../drizzle/schema");
    await db.update(totpSecrets).set({ backupCodes: JSON.stringify(codes) }).where(eq(totpSecrets.id, totp.id));
    
    return true;
  } catch (error) {
    console.error("Failed to validate backup code:", error);
    return false;
  }
}


// Inquiry functions
export async function saveInquiry(inquiry: {
  fullName: string;
  email: string;
  phone?: string;
  serviceType: string;
  message?: string;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save inquiry: database not available");
    throw new Error("Database not available");
  }

  try {
    const { inquiries } = await import("../drizzle/schema");
    const result = await db.insert(inquiries).values({
      fullName: inquiry.fullName,
      email: inquiry.email,
      phone: inquiry.phone || null,
      serviceType: inquiry.serviceType,
      message: inquiry.message || null,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to save inquiry:", error);
    throw error;
  }
}

export async function getInquiries() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get inquiries: database not available");
    return [];
  }

  try {
    const { inquiries } = await import("../drizzle/schema");
    const result = await db.select().from(inquiries).orderBy(inquiries.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get inquiries:", error);
    throw error;
  }
}
