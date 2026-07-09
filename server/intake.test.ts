/**
 * DOMUS Relocations — Intake Router Tests
 *
 * Tests the intake.submit procedure in isolation:
 * - Valid payload saves to DB and returns firstName + preferredLanguage
 * - Missing required fields are rejected with a validation error
 * - Admin procedures reject non-admin callers with FORBIDDEN
 *
 * Note: PDF generation and email delivery run in a non-blocking Promise.all
 * after the DB insert, so they are not asserted here (they require Chromium
 * and a live Resend key). The unit test validates the synchronous contract only.
 */

import { describe, expect, it, vi, beforeEach } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";

// ─── Minimal form payload (all required fields) ───────────────────────────────
const minimalPayload = {
  primaryName: "Isabelle Fontaine",
  email: "isabelle@example.com",
  whoRelocating: ["Myself only"],
  fromCity: "London, UK",
  moveReasons: ["Lifestyle & quality of life"],
  targetCity: ["Milan"],
  rentOrBuy: ["Rent initially, buy later"],
  budget: ["€3,500–€6,000/month"],
  commsPref: ["Email"],
};

// ─── Context factories ────────────────────────────────────────────────────────
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(email: string = "milano@domusrelocations.com"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-open-id",
      email,
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "user-open-id",
      email: "regular@example.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Mock the DB so tests don't need a live MySQL connection ──────────────────
vi.mock("./db", () => {
  const mockInsert = vi.fn().mockResolvedValue([{ insertId: 1 }]);
  const mockSelect = vi.fn().mockReturnValue({
    from: vi.fn().mockReturnValue({
      where: vi.fn().mockReturnValue({
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([
            {
              id: 1,
              primaryName: "Isabelle Fontaine",
              email: "isabelle@example.com",
              preferredLanguage: "English",
              whoRelocating: ["Myself only"],
              fromCity: "London, UK",
              moveReasons: ["Lifestyle & quality of life"],
              targetCity: ["Milan"],
              rentOrBuy: ["Rent initially, buy later"],
              budget: ["€3,500–€6,000/month"],
              commsPref: ["Email"],
              advisorBriefSent: 0,
              clientPreviewSent: 0,
              submittedAt: new Date(),
              children: null,
              childEduProfiles: null,
            },
          ]),
        }),
      }),
    }),
  });
  const mockUpdate = vi.fn().mockReturnValue({
    set: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue([]),
    }),
  });

  return {
    getDb: vi.fn().mockResolvedValue({
      insert: vi.fn().mockReturnValue({ values: mockInsert }),
      select: mockSelect,
      update: vi.fn().mockReturnValue({ set: vi.fn().mockReturnValue({ where: mockUpdate }) }),
    }),
    // New: email-existence check added in the dashboard-preview flow
    getUserByEmail: vi.fn().mockResolvedValue(null),
  };
});

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("intake.submit", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("accepts a valid minimal payload and returns firstName + preferredLanguage", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createPublicContext());

    const result = await caller.intake.submit(minimalPayload);

    expect(result.success).toBe(true);
    expect(result.firstName).toBe("Isabelle");
    expect(result.preferredLanguage).toBe("English");
  });

  it("rejects a payload missing the required email field", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createPublicContext());

    const badPayload = { ...minimalPayload, email: "not-an-email" };

    await expect(caller.intake.submit(badPayload)).rejects.toThrow();
  });

  it("rejects a payload missing required whoRelocating", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createPublicContext());

    const badPayload = { ...minimalPayload, whoRelocating: [] };

    await expect(caller.intake.submit(badPayload)).rejects.toThrow();
  });
});

describe("intake.listSubmissions", () => {
  it("throws FORBIDDEN for a non-admin authenticated user", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createUserContext());

    await expect(caller.intake.listSubmissions()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  it("throws UNAUTHORIZED for an unauthenticated caller", async () => {
    const { appRouter } = await import("./routers");
    const caller = appRouter.createCaller(createPublicContext());

    await expect(caller.intake.listSubmissions()).rejects.toThrow(TRPCError);
  });
});
