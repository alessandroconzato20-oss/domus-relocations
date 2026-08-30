import { describe, expect, it, vi } from "vitest";
import { allowIntakeSubmission } from "./lib/intakeRateLimit";

function createLimitDb(initialRow?: { windowStartedAt: Date; submissionCount: number }) {
  let row = initialRow ? { ipHash: "existing", ...initialRow } : undefined;
  const tx = {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          limit: vi.fn(async () => (row ? [row] : [])),
        })),
      })),
    })),
    insert: vi.fn(() => ({
      values: vi.fn(async (value) => {
        row = { ...value };
      }),
    })),
    update: vi.fn(() => ({
      set: vi.fn((value) => ({
        where: vi.fn(async () => {
          row = { ...row!, ...value };
        }),
      })),
    })),
  };

  return { transaction: async (callback: (transaction: typeof tx) => Promise<boolean>) => callback(tx) } as never;
}

describe("intake submission rate limit", () => {
  it("creates a durable counter for the first submission in the current hour", async () => {
    const db = createLimitDb();
    await expect(allowIntakeSubmission(db, "203.0.113.10", new Date("2026-08-30T15:05:00Z"))).resolves.toBe(true);
  });

  it("rejects a sixth submission in the same stored hourly window", async () => {
    const db = createLimitDb({ windowStartedAt: new Date("2026-08-30T15:00:00Z"), submissionCount: 5 });
    await expect(allowIntakeSubmission(db, "203.0.113.11", new Date("2026-08-30T15:45:00Z"))).resolves.toBe(false);
  });

  it("resets the durable counter when a new hourly window begins", async () => {
    const db = createLimitDb({ windowStartedAt: new Date("2026-08-30T15:00:00Z"), submissionCount: 5 });
    await expect(allowIntakeSubmission(db, "203.0.113.12", new Date("2026-08-30T16:00:00Z"))).resolves.toBe(true);
  });
});
