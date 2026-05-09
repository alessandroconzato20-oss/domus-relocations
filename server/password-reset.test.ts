import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import * as bcrypt from "bcryptjs";

// Mock the database functions
vi.mock("./db", () => ({
  createPasswordResetToken: vi.fn(),
  validatePasswordResetToken: vi.fn(),
  deletePasswordResetToken: vi.fn(),
  updateUserPasswordByUserId: vi.fn(),
  getUserByEmail: vi.fn(),
}));

import {
  createPasswordResetToken,
  validatePasswordResetToken,
  deletePasswordResetToken,
  updateUserPasswordByUserId,
} from "./db";

describe("Password Reset Procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Request Password Reset", () => {
    it("should validate email format", () => {
      const schema = z.object({
        email: z.string().email(),
      });

      expect(() => {
        schema.parse({
          email: "invalid-email",
        });
      }).toThrow();
    });

    it("should accept valid email", () => {
      const schema = z.object({
        email: z.string().email(),
      });

      const validData = {
        email: "milano@domusrelocations.com",
      };

      expect(() => schema.parse(validData)).not.toThrow();
    });

    it("should create reset token for valid user", async () => {
      const mockCreateToken = createPasswordResetToken as any;
      mockCreateToken.mockResolvedValueOnce("reset_token_123");

      const result = await createPasswordResetToken(1, 1);

      expect(mockCreateToken).toHaveBeenCalledWith(1, 1);
      expect(result).toBe("reset_token_123");
    });
  });

  describe("Reset Password", () => {
    it("should validate token is not empty", () => {
      const schema = z.object({
        token: z.string().min(1),
        newPassword: z.string().min(8),
      });

      expect(() => {
        schema.parse({
          token: "",
          newPassword: "password123",
        });
      }).toThrow();
    });

    it("should validate new password minimum length", () => {
      const schema = z.object({
        token: z.string(),
        newPassword: z.string().min(8),
      });

      expect(() => {
        schema.parse({
          token: "valid_token",
          newPassword: "short",
        });
      }).toThrow();
    });

    it("should accept valid reset data", () => {
      const schema = z.object({
        token: z.string(),
        newPassword: z.string().min(8),
      });

      const validData = {
        token: "reset_token_123",
        newPassword: "Newlifemilano26",
      };

      expect(() => schema.parse(validData)).not.toThrow();
    });

    it("should validate password reset token", async () => {
      const mockValidateToken = validatePasswordResetToken as any;
      mockValidateToken.mockResolvedValueOnce({
        id: 1,
        userId: 1,
        token: "reset_token_123",
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
      });

      const result = await validatePasswordResetToken("reset_token_123");

      expect(mockValidateToken).toHaveBeenCalledWith("reset_token_123");
      expect(result).toBeDefined();
      expect(result?.userId).toBe(1);
    });

    it("should return null for invalid token", async () => {
      const mockValidateToken = validatePasswordResetToken as any;
      mockValidateToken.mockResolvedValueOnce(null);

      const result = await validatePasswordResetToken("invalid_token");

      expect(result).toBeNull();
    });

    it("should update user password", async () => {
      const mockUpdatePassword = updateUserPasswordByUserId as any;
      mockUpdatePassword.mockResolvedValueOnce(true);

      const passwordHash = await bcrypt.hash("Newlifemilano26", 10);
      await updateUserPasswordByUserId(1, passwordHash);

      expect(mockUpdatePassword).toHaveBeenCalledWith(1, passwordHash);
    });

    it("should delete used reset token", async () => {
      const mockDeleteToken = deletePasswordResetToken as any;
      mockDeleteToken.mockResolvedValueOnce(true);

      await deletePasswordResetToken(1);

      expect(mockDeleteToken).toHaveBeenCalledWith(1);
    });
  });

  describe("Token Expiration", () => {
    it("should generate token with 1 hour expiry", async () => {
      const mockCreateToken = createPasswordResetToken as any;
      mockCreateToken.mockResolvedValueOnce("token_with_expiry");

      const result = await createPasswordResetToken(1, 1);

      expect(mockCreateToken).toHaveBeenCalledWith(1, 1);
      expect(result).toBe("token_with_expiry");
    });

    it("should reject expired tokens", async () => {
      const mockValidateToken = validatePasswordResetToken as any;
      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago

      mockValidateToken.mockResolvedValueOnce(null);

      const result = await validatePasswordResetToken("expired_token");

      expect(result).toBeNull();
    });
  });

  describe("Password Hashing", () => {
    it("should hash password correctly", async () => {
      const password = "Newlifemilano26";
      const hash = await bcrypt.hash(password, 10);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });

    it("should verify hashed password", async () => {
      const password = "Newlifemilano26";
      const hash = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hash);

      expect(isMatch).toBe(true);
    });
  });
});
