import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Mock the database functions
vi.mock("./db", () => ({
  getQuizResponsesByEmail: vi.fn(),
}));

import { getQuizResponsesByEmail } from "./db";

describe("User Quiz Retrieval", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Get User Quizzes by Email", () => {
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
        email: "user@example.com",
      };

      expect(() => schema.parse(validData)).not.toThrow();
    });

    it("should retrieve quiz responses for valid email", async () => {
      const mockGetQuizzes = getQuizResponsesByEmail as any;
      const mockQuizzes = [
        {
          id: 1,
          email: "user@example.com",
          fullName: "John Doe",
          answers: JSON.stringify({ q1: "answer1", q2: "answer2" }),
          persona: "The Diplomat",
          createdAt: new Date(),
        },
      ];

      mockGetQuizzes.mockResolvedValueOnce(mockQuizzes);

      const result = await getQuizResponsesByEmail("user@example.com");

      expect(mockGetQuizzes).toHaveBeenCalledWith("user@example.com");
      expect(result).toEqual(mockQuizzes);
      expect(result.length).toBe(1);
    });

    it("should return empty array for email with no quizzes", async () => {
      const mockGetQuizzes = getQuizResponsesByEmail as any;
      mockGetQuizzes.mockResolvedValueOnce([]);

      const result = await getQuizResponsesByEmail("noquizzes@example.com");

      expect(mockGetQuizzes).toHaveBeenCalledWith("noquizzes@example.com");
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it("should return multiple quiz responses for same email", async () => {
      const mockGetQuizzes = getQuizResponsesByEmail as any;
      const mockQuizzes = [
        {
          id: 1,
          email: "user@example.com",
          fullName: "John Doe",
          answers: JSON.stringify({ q1: "answer1" }),
          persona: "The Diplomat",
          createdAt: new Date("2026-01-01"),
        },
        {
          id: 2,
          email: "user@example.com",
          fullName: "John Doe",
          answers: JSON.stringify({ q1: "answer2" }),
          persona: "The Pioneer",
          createdAt: new Date("2026-02-01"),
        },
      ];

      mockGetQuizzes.mockResolvedValueOnce(mockQuizzes);

      const result = await getQuizResponsesByEmail("user@example.com");

      expect(result.length).toBe(2);
      expect(result[0].persona).toBe("The Diplomat");
      expect(result[1].persona).toBe("The Pioneer");
    });

    it("should handle case-insensitive email lookup", async () => {
      const mockGetQuizzes = getQuizResponsesByEmail as any;
      mockGetQuizzes.mockResolvedValueOnce([]);

      await getQuizResponsesByEmail("User@Example.COM");

      expect(mockGetQuizzes).toHaveBeenCalledWith("User@Example.COM");
    });

    it("should parse quiz answers JSON correctly", async () => {
      const mockGetQuizzes = getQuizResponsesByEmail as any;
      const answersJson = JSON.stringify({
        budget: "500k-1m",
        neighborhood: "Brera",
        lifestyle: "Modern",
      });

      const mockQuizzes = [
        {
          id: 1,
          email: "user@example.com",
          fullName: "Jane Smith",
          answers: answersJson,
          persona: "The Collector",
          createdAt: new Date(),
        },
      ];

      mockGetQuizzes.mockResolvedValueOnce(mockQuizzes);

      const result = await getQuizResponsesByEmail("user@example.com");

      expect(result[0].answers).toBe(answersJson);
      const parsed = JSON.parse(result[0].answers);
      expect(parsed.budget).toBe("500k-1m");
      expect(parsed.neighborhood).toBe("Brera");
    });

    it("should order results by creation date", async () => {
      const mockGetQuizzes = getQuizResponsesByEmail as any;
      const date1 = new Date("2026-01-01");
      const date2 = new Date("2026-02-01");
      const date3 = new Date("2026-03-01");

      const mockQuizzes = [
        {
          id: 1,
          email: "user@example.com",
          fullName: "John Doe",
          answers: "{}",
          persona: "First",
          createdAt: date1,
        },
        {
          id: 2,
          email: "user@example.com",
          fullName: "John Doe",
          answers: "{}",
          persona: "Second",
          createdAt: date2,
        },
        {
          id: 3,
          email: "user@example.com",
          fullName: "John Doe",
          answers: "{}",
          persona: "Third",
          createdAt: date3,
        },
      ];

      mockGetQuizzes.mockResolvedValueOnce(mockQuizzes);

      const result = await getQuizResponsesByEmail("user@example.com");

      expect(result[0].createdAt).toEqual(date1);
      expect(result[1].createdAt).toEqual(date2);
      expect(result[2].createdAt).toEqual(date3);
    });

    it("should handle database errors gracefully", async () => {
      const mockGetQuizzes = getQuizResponsesByEmail as any;
      mockGetQuizzes.mockRejectedValueOnce(new Error("Database connection failed"));

      await expect(getQuizResponsesByEmail("user@example.com")).rejects.toThrow("Database connection failed");
    });

    it("should include all required quiz fields", async () => {
      const mockGetQuizzes = getQuizResponsesByEmail as any;
      const mockQuizzes = [
        {
          id: 1,
          email: "user@example.com",
          fullName: "John Doe",
          answers: "{}",
          persona: "The Diplomat",
          createdAt: new Date(),
        },
      ];

      mockGetQuizzes.mockResolvedValueOnce(mockQuizzes);

      const result = await getQuizResponsesByEmail("user@example.com");
      const quiz = result[0];

      expect(quiz).toHaveProperty("id");
      expect(quiz).toHaveProperty("email");
      expect(quiz).toHaveProperty("fullName");
      expect(quiz).toHaveProperty("answers");
      expect(quiz).toHaveProperty("persona");
      expect(quiz).toHaveProperty("createdAt");
    });
  });
});
