import { beforeEach, describe, expect, it, vi } from "vitest";
import { TRPCError } from "@trpc/server";
import type { TrpcContext } from "./_core/context";
import { getDb, getUserByEmail } from "./db";

vi.mock("./db", () => ({
  getDb: vi.fn(),
  getUserByEmail: vi.fn(),
}));

function createContext(email = "milano@domusrelocations.com", userId = 1): TrpcContext {
  return {
    user: {
      id: userId,
      openId: `user-${userId}`,
      email,
      name: "DOMUS User",
      loginMethod: "email",
      role: email === "milano@domusrelocations.com" ? "admin" : "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

function createDb(selectRows: unknown[][]) {
  let selectIndex = 0;
  const where = vi.fn(() => {
    const result = selectRows[selectIndex++] ?? [];
    return {
      limit: vi.fn(async () => result),
      then: <T>(resolve: (value: unknown[]) => T, reject?: (reason: unknown) => T) =>
        Promise.resolve(result).then(resolve, reject),
    };
  });
  const db = {
    select: vi.fn(() => ({ from: vi.fn(() => ({ where })) })),
    update: vi.fn(() => ({ set: vi.fn(() => ({ where: vi.fn().mockResolvedValue([]) })) })),
    insert: vi.fn(() => ({ values: vi.fn().mockResolvedValue([]) })),
  };
  return db;
}

describe("intake preview lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("publishes edited preview content even when the client has not yet created an account", async () => {
    const db = createDb([[{ email: "client@example.com" }]]);
    vi.mocked(getDb).mockResolvedValue(db as never);
    vi.mocked(getUserByEmail).mockResolvedValue(null);
    const { appRouter } = await import("./routers");

    await expect(
      appRouter.createCaller(createContext()).intake.publishPreview({ id: 3, previewContent: "A considered preview." })
    ).resolves.toEqual({ success: true, publishedToProfile: false });
    expect(db.update).toHaveBeenCalled();
  });

  it("records the first client read event against the linked profile", async () => {
    const db = createDb([[{ id: 7, clientPreviewReadAt: null }]]);
    vi.mocked(getDb).mockResolvedValue(db as never);
    const { appRouter } = await import("./routers");

    await expect(appRouter.createCaller(createContext("client@example.com", 7)).intake.markPreviewRead()).resolves.toEqual({ success: true });
    expect(db.update).toHaveBeenCalled();
  });

  it("links an intake to the current user and creates a client profile when none exists", async () => {
    const db = createDb([
      [{ id: 9, accountStatus: "pending_account", linkedUserId: null, primaryName: "Ava Rossi", email: "ava@example.com", phone: null, nationalities: null, fromCity: null, arrivalDate: null, clientPreviewContent: "Welcome to Milan." }],
      [],
    ]);
    vi.mocked(getDb).mockResolvedValue(db as never);
    const { appRouter } = await import("./routers");

    await expect(appRouter.createCaller(createContext("ava@example.com", 9)).intake.linkToAccount({ intakeId: 9 })).resolves.toEqual({ success: true });
    expect(db.insert).toHaveBeenCalled();
  });

  it("rejects account linking for an unknown intake ID", async () => {
    const db = createDb([[]]);
    vi.mocked(getDb).mockResolvedValue(db as never);
    const { appRouter } = await import("./routers");

    await expect(appRouter.createCaller(createContext("ava@example.com", 9)).intake.linkToAccount({ intakeId: 999 })).rejects.toMatchObject<Partial<TRPCError>>({ code: "NOT_FOUND" });
  });
});
