import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Request, Response } from "express";
import { getDb } from "./db";
import { intakeCleanupHandler } from "./handlers/intakeCleanup";

vi.mock("./db", () => ({ getDb: vi.fn() }));

function createResponse() {
  const response = {
    status: vi.fn(),
    json: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response as unknown as Response & { status: ReturnType<typeof vi.fn>; json: ReturnType<typeof vi.fn> };
}

describe("intakeCleanupHandler", () => {
  beforeEach(() => vi.clearAllMocks());

  it("deletes stale pending account submissions for an authenticated scheduled request", async () => {
    const where = vi.fn().mockResolvedValue({ affectedRows: 2 });
    vi.mocked(getDb).mockResolvedValue({
      delete: vi.fn(() => ({ where })),
    } as never);
    const response = createResponse();
    const request = { headers: { cookie: "app_session_id=heartbeat" } } as Request;

    await intakeCleanupHandler(request, response);

    expect(where).toHaveBeenCalledOnce();
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining({ ok: true, deleted: 2 }));
  });

  it("rejects an unauthenticated scheduled request", async () => {
    vi.mocked(getDb).mockResolvedValue({ delete: vi.fn() } as never);
    const response = createResponse();
    const request = { headers: {} } as Request;

    await intakeCleanupHandler(request, response);

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });
});
