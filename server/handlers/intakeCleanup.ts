/**
 * DOMUS Relocations — Intake Cleanup Handler
 * Scheduled via Heartbeat (project-level cron, runs every 6 hours).
 * Deletes intakeForms rows where:
 *   - accountStatus = 'pending_account'
 *   - createdAt is older than 24 hours
 *   - linkedUserId is NULL (no account was ever linked)
 *
 * This enforces the promise made on the confirmation screen:
 * "If you do not create an account, your answers will be erased."
 */

import type { Request, Response } from "express";
import { getDb } from "../db";
import { intakeForms } from "../../drizzle/schema";
import { and, eq, lt, isNull } from "drizzle-orm";

export async function intakeCleanupHandler(req: Request, res: Response) {
  try {
    const db = await getDb();
    if (!db) {
      return res.status(500).json({ error: "Database not available" });
    }

    // Authenticate the cron caller — accept both Heartbeat cron identity and
    // a simple shared secret header for manual/test triggers.
    const authHeader = req.headers["x-cron-secret"];
    const isCronSecret = authHeader === process.env.CRON_SECRET;

    // For project-level Heartbeat, the platform POSTs with a session cookie
    // that has isCron=true. We do a lightweight check: if the request has no
    // recognisable auth at all, reject it.
    const hasCronCookie = req.headers.cookie?.includes("app_session_id");

    if (!isCronSecret && !hasCronCookie) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const result = await db
      .delete(intakeForms)
      .where(
        and(
          eq(intakeForms.accountStatus, "pending_account"),
          lt(intakeForms.submittedAt, cutoff),
          isNull(intakeForms.linkedUserId)
        )
      );

    const deleted = (result as unknown as { affectedRows?: number }).affectedRows ?? 0;

    console.log(`[IntakeCleanup] Deleted ${deleted} stale pending_account intake form(s) older than 24h`);

    return res.json({
      ok: true,
      deleted,
      cutoff: cutoff.toISOString(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[IntakeCleanup] Error:", error);
    return res.status(500).json({
      error: String(error),
      timestamp: new Date().toISOString(),
    });
  }
}
