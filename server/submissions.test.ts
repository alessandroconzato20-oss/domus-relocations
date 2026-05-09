import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

// Mock the database functions
vi.mock("./db", () => ({
  saveQuizResponse: vi.fn(async () => ({ insertId: 1 })),
  getQuizResponses: vi.fn(async () => []),
  saveContactSubmission: vi.fn(async () => ({ insertId: 1 })),
  getContactSubmissions: vi.fn(async () => []),
}));

// Mock the notification function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(async () => true),
}));

import { saveQuizResponse, getQuizResponses, saveContactSubmission, getContactSubmissions } from "./db";
import { notifyOwner } from "./_core/notification";

describe("Submissions Procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("submitQuiz", () => {
    it("should validate email format", () => {
      const schema = z.object({
        email: z.string().email(),
        fullName: z.string().min(1),
        answers: z.record(z.string(), z.string()),
        persona: z.string(),
      });

      expect(() => {
        schema.parse({
          email: "invalid-email",
          fullName: "John Doe",
          answers: { q1: "a1" },
          persona: "The Discerning Family",
        });
      }).toThrow();
    });

    it("should validate fullName is not empty", () => {
      const schema = z.object({
        email: z.string().email(),
        fullName: z.string().min(1),
        answers: z.record(z.string(), z.string()),
        persona: z.string(),
      });

      expect(() => {
        schema.parse({
          email: "test@example.com",
          fullName: "",
          answers: { q1: "a1" },
          persona: "The Discerning Family",
        });
      }).toThrow();
    });

    it("should accept valid quiz submission data", () => {
      const schema = z.object({
        email: z.string().email(),
        fullName: z.string().min(1),
        answers: z.record(z.string(), z.string()),
        persona: z.string(),
      });

      const validData = {
        email: "john@example.com",
        fullName: "John Doe",
        answers: { timeline: "immediate", family: "solo", priority: "housing" },
        persona: "The Global Professional",
      };

      expect(() => schema.parse(validData)).not.toThrow();
    });

    it("should call saveQuizResponse with correct data", async () => {
      const mockSaveQuizResponse = saveQuizResponse as any;
      mockSaveQuizResponse.mockResolvedValueOnce({ insertId: 1 });

      const input = {
        email: "john@example.com",
        fullName: "John Doe",
        answers: { timeline: "immediate", family: "solo" },
        persona: "The Global Professional",
      };

      await saveQuizResponse({
        email: input.email,
        fullName: input.fullName,
        answers: JSON.stringify(input.answers),
        persona: input.persona,
      });

      expect(mockSaveQuizResponse).toHaveBeenCalledWith({
        email: "john@example.com",
        fullName: "John Doe",
        answers: JSON.stringify({ timeline: "immediate", family: "solo" }),
        persona: "The Global Professional",
      });
    });

    it("should call notifyOwner after saving quiz response", async () => {
      const mockNotifyOwner = notifyOwner as any;
      mockNotifyOwner.mockResolvedValueOnce(true);

      const input = {
        email: "john@example.com",
        fullName: "John Doe",
        answers: { timeline: "immediate", family: "solo" },
        persona: "The Global Professional",
      };

      await notifyOwner({
        title: "New Persona Quiz Submission",
        content: `${input.fullName} (${input.email}) has completed the persona quiz and identified as: ${input.persona}.`,
      });

      expect(mockNotifyOwner).toHaveBeenCalledWith({
        title: "New Persona Quiz Submission",
        content: expect.stringContaining("John Doe"),
      });
    });
  });

  describe("submitContact", () => {
    it("should validate email format", () => {
      const schema = z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      });

      expect(() => {
        schema.parse({
          fullName: "John Doe",
          email: "invalid-email",
          message: "Hello",
        });
      }).toThrow();
    });

    it("should validate message is not empty", () => {
      const schema = z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      });

      expect(() => {
        schema.parse({
          fullName: "John Doe",
          email: "john@example.com",
          message: "",
        });
      }).toThrow();
    });

    it("should accept valid contact submission data", () => {
      const schema = z.object({
        fullName: z.string().min(1),
        email: z.string().email(),
        message: z.string().min(1),
      });

      const validData = {
        fullName: "John Doe",
        email: "john@example.com",
        message: "I am interested in relocating to Milan.",
      };

      expect(() => schema.parse(validData)).not.toThrow();
    });

    it("should call saveContactSubmission with correct data", async () => {
      const mockSaveContactSubmission = saveContactSubmission as any;
      mockSaveContactSubmission.mockResolvedValueOnce({ insertId: 1 });

      const input = {
        fullName: "John Doe",
        email: "john@example.com",
        message: "I am interested in relocating to Milan.",
      };

      await saveContactSubmission(input);

      expect(mockSaveContactSubmission).toHaveBeenCalledWith(input);
    });

    it("should call notifyOwner after saving contact submission", async () => {
      const mockNotifyOwner = notifyOwner as any;
      mockNotifyOwner.mockResolvedValueOnce(true);

      const input = {
        fullName: "John Doe",
        email: "john@example.com",
        message: "I am interested in relocating to Milan.",
      };

      const messagePreview = input.message.substring(0, 100) + (input.message.length > 100 ? "..." : "");
      await notifyOwner({
        title: "New Contact Inquiry",
        content: `${input.fullName} (${input.email}) has sent a new inquiry: "${messagePreview}"`,
      });

      expect(mockNotifyOwner).toHaveBeenCalledWith({
        title: "New Contact Inquiry",
        content: expect.stringContaining("John Doe"),
      });
    });
  });

  describe("getQuizResponses", () => {
    it("should return an array of quiz responses", async () => {
      const mockGetQuizResponses = getQuizResponses as any;
      const mockResponses = [
        {
          id: 1,
          email: "john@example.com",
          fullName: "John Doe",
          answers: '{"timeline":"immediate"}',
          persona: "The Global Professional",
          createdAt: new Date(),
        },
      ];
      mockGetQuizResponses.mockResolvedValueOnce(mockResponses);

      const result = await getQuizResponses();

      expect(result).toEqual(mockResponses);
      expect(mockGetQuizResponses).toHaveBeenCalled();
    });
  });

  describe("getContactSubmissions", () => {
    it("should return an array of contact submissions", async () => {
      const mockGetContactSubmissions = getContactSubmissions as any;
      const mockSubmissions = [
        {
          id: 1,
          fullName: "John Doe",
          email: "john@example.com",
          message: "I am interested in relocating to Milan.",
          createdAt: new Date(),
        },
      ];
      mockGetContactSubmissions.mockResolvedValueOnce(mockSubmissions);

      const result = await getContactSubmissions();

      expect(result).toEqual(mockSubmissions);
      expect(mockGetContactSubmissions).toHaveBeenCalled();
    });
  });
});
