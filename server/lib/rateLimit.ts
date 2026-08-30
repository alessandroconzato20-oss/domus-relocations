import rateLimit from "express-rate-limit";

export const API_RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8" as const,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again shortly." },
};

export function createApiRateLimiter() {
  return rateLimit(API_RATE_LIMIT_CONFIG);
}
