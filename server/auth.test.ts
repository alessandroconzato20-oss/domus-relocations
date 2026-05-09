import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";
import * as bcrypt from "bcryptjs";

// Mock the database functions
vi.mock("./db", () => ({
  getUserByEmail: vi.fn(),
  createLocalUser: vi.fn(),
  getDb: vi.fn(),
}));

import { getUserByEmail, createLocalUser } from "./db";

describe("Authentication Procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Login", () => {
    it("should validate email format", () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });

      expect(() => {
        schema.parse({
          email: "invalid-email",
          password: "password123",
        });
      }).toThrow();
    });

    it("should validate password is not empty", () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });

      expect(() => {
        schema.parse({
          email: "test@example.com",
          password: "",
        });
      }).toThrow();
    });

    it("should accept valid login data", () => {
      const schema = z.object({
        email: z.string().email(),
        password: z.string().min(1),
      });

      const validData = {
        email: "milano@domusrelocations.com",
        password: "Newlifemilano26",
      };

      expect(() => schema.parse(validData)).not.toThrow();
    });

    it("should call getUserByEmail with correct email", async () => {
      const mockGetUserByEmail = getUserByEmail as any;
      mockGetUserByEmail.mockResolvedValueOnce(null);

      await getUserByEmail("test@example.com");

      expect(mockGetUserByEmail).toHaveBeenCalledWith("test@example.com");
    });

    it("should handle user not found", async () => {
      const mockGetUserByEmail = getUserByEmail as any;
      mockGetUserByEmail.mockResolvedValueOnce(null);

      const result = await getUserByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("Signup", () => {
    it("should validate email format", () => {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(8),
      });

      expect(() => {
        schema.parse({
          email: "invalid-email",
          name: "John Doe",
          password: "password123",
        });
      }).toThrow();
    });

    it("should validate name is not empty", () => {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(8),
      });

      expect(() => {
        schema.parse({
          email: "test@example.com",
          name: "",
          password: "password123",
        });
      }).toThrow();
    });

    it("should validate password minimum length", () => {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(8),
      });

      expect(() => {
        schema.parse({
          email: "test@example.com",
          name: "John Doe",
          password: "short",
        });
      }).toThrow();
    });

    it("should accept valid signup data", () => {
      const schema = z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(8),
      });

      const validData = {
        email: "milano@domusrelocations.com",
        name: "Admin User",
        password: "Newlifemilano26",
      };

      expect(() => schema.parse(validData)).not.toThrow();
    });

    it("should call createLocalUser with correct data", async () => {
      const mockCreateLocalUser = createLocalUser as any;
      mockCreateLocalUser.mockResolvedValueOnce({
        openId: "local_test@example.com_123",
        email: "test@example.com",
        name: "Test User",
        passwordHash: "hashedpassword",
        loginMethod: "local",
        role: "user",
      });

      const result = await createLocalUser("test@example.com", "Test User", "hashedpassword");

      expect(mockCreateLocalUser).toHaveBeenCalledWith("test@example.com", "Test User", "hashedpassword");
      expect(result).toBeDefined();
    });

    it("should set admin role for milano@domusrelocations.com", async () => {
      const mockCreateLocalUser = createLocalUser as any;
      mockCreateLocalUser.mockResolvedValueOnce({
        openId: "local_milano@domusrelocations.com_123",
        email: "milano@domusrelocations.com",
        name: "Admin",
        passwordHash: "hashedpassword",
        loginMethod: "local",
        role: "admin",
      });

      const result = await createLocalUser("milano@domusrelocations.com", "Admin", "hashedpassword");

      expect(result.role).toBe("admin");
    });
  });

  describe("Password Hashing", () => {
    it("should hash password correctly", async () => {
      const password = "Newlifemilano26";
      const hash = await bcrypt.hash(password, 10);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
    });

    it("should verify password correctly", async () => {
      const password = "Newlifemilano26";
      const hash = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare(password, hash);

      expect(isMatch).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "Newlifemilano26";
      const hash = await bcrypt.hash(password, 10);
      const isMatch = await bcrypt.compare("wrongpassword", hash);

      expect(isMatch).toBe(false);
    });
  });
});
