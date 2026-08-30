import { describe, expect, it } from "vitest";
import { API_RATE_LIMIT_CONFIG } from "./lib/rateLimit";

describe("API rate limit configuration", () => {
  it("limits API traffic to 100 requests per IP per minute", () => {
    expect(API_RATE_LIMIT_CONFIG.windowMs).toBe(60 * 1000);
    expect(API_RATE_LIMIT_CONFIG.limit).toBe(100);
    expect(API_RATE_LIMIT_CONFIG.standardHeaders).toBe("draft-8");
    expect(API_RATE_LIMIT_CONFIG.legacyHeaders).toBe(false);
  });
});
