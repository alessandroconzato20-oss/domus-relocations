import { createHash } from "node:crypto";
import { eq } from "drizzle-orm";
import { intakeSubmissionLimits } from "../../drizzle/schema";
import type { getDb } from "../db";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
type Database = NonNullable<Awaited<ReturnType<typeof getDb>>>;

function getHourlyWindow(now: Date) {
  return new Date(Math.floor(now.getTime() / WINDOW_MS) * WINDOW_MS);
}

function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex");
}

export async function allowIntakeSubmission(db: Database, ip: string, now = new Date()): Promise<boolean> {
  const ipHash = hashIp(ip);
  const windowStartedAt = getHourlyWindow(now);

  return db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(intakeSubmissionLimits)
      .where(eq(intakeSubmissionLimits.ipHash, ipHash))
      .limit(1);
    const current = existing[0];

    if (!current) {
      await tx.insert(intakeSubmissionLimits).values({ ipHash, windowStartedAt, submissionCount: 1 });
      return true;
    }

    if (current.windowStartedAt.getTime() !== windowStartedAt.getTime()) {
      await tx
        .update(intakeSubmissionLimits)
        .set({ windowStartedAt, submissionCount: 1 })
        .where(eq(intakeSubmissionLimits.ipHash, ipHash));
      return true;
    }

    if (current.submissionCount >= MAX_SUBMISSIONS) return false;

    await tx
      .update(intakeSubmissionLimits)
      .set({ submissionCount: current.submissionCount + 1 })
      .where(eq(intakeSubmissionLimits.ipHash, ipHash));
    return true;
  });
}
