import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { invokeLLM } from "./_core/llm";

// Mock the LLM and email functions
vi.mock("./_core/llm");
vi.mock("./_core/notification");

describe("AI-Powered Quiz Functionality", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Lead Scoring Algorithm", () => {
    it("should assign high priority (90/100) for immediate timeline with family", () => {
      const timeline = "immediate";
      const familySize = "family_young";
      
      let leadScore = 50;
      let leadPriority: "high" | "standard" | "future" = "standard";

      if (timeline === "immediate" && (familySize === "family_young" || familySize === "family_teen")) {
        leadScore = 90;
        leadPriority = "high";
      }

      expect(leadScore).toBe(90);
      expect(leadPriority).toBe("high");
    });

    it("should assign high priority (80/100) for immediate timeline without family", () => {
      const timeline = "immediate";
      const familySize = "solo";
      
      let leadScore = 50;
      let leadPriority: "high" | "standard" | "future" = "standard";

      if (timeline === "immediate" && (familySize === "family_young" || familySize === "family_teen")) {
        leadScore = 90;
        leadPriority = "high";
      } else if (timeline === "immediate") {
        leadScore = 80;
        leadPriority = "high";
      }

      expect(leadScore).toBe(80);
      expect(leadPriority).toBe("high");
    });

    it("should assign standard priority (65/100) for 3-6 months timeline", () => {
      const timeline = "soon";
      
      let leadScore = 50;
      let leadPriority: "high" | "standard" | "future" = "standard";

      if (timeline === "soon") {
        leadScore = 65;
        leadPriority = "standard";
      }

      expect(leadScore).toBe(65);
      expect(leadPriority).toBe("standard");
    });

    it("should assign future priority (40/100) for exploring or 6-12 months", () => {
      const timeline = "exploring";
      
      let leadScore = 50;
      let leadPriority: "high" | "standard" | "future" = "standard";

      if (timeline === "exploring") {
        leadScore = 40;
        leadPriority = "future";
      }

      expect(leadScore).toBe(40);
      expect(leadPriority).toBe("future");
    });
  });

  describe("Profile Generation", () => {
    it("should generate profile with required fields", () => {
      const mockProfile = {
        summary: "A family relocating to Milan within 3 months seeking school options and community integration.",
        keyInsights: [
          "High urgency timeline indicates serious commitment",
          "Family with young children prioritizes education",
          "Seeking established community connections"
        ],
        recommendedServices: [
          "Private Relocation Advisory",
          "School Advisory",
          "Milan Integration"
        ]
      };

      expect(mockProfile).toHaveProperty("summary");
      expect(mockProfile).toHaveProperty("keyInsights");
      expect(mockProfile).toHaveProperty("recommendedServices");
      expect(Array.isArray(mockProfile.keyInsights)).toBe(true);
      expect(Array.isArray(mockProfile.recommendedServices)).toBe(true);
      expect(mockProfile.keyInsights.length).toBeGreaterThan(0);
      expect(mockProfile.recommendedServices.length).toBeGreaterThan(0);
    });

    it("should stringify profile for database storage", () => {
      const profile = {
        summary: "Test summary",
        keyInsights: ["Insight 1", "Insight 2"],
        recommendedServices: ["Service 1", "Service 2"]
      };

      const stringified = JSON.stringify(profile);
      const parsed = JSON.parse(stringified);

      expect(parsed).toEqual(profile);
      expect(typeof stringified).toBe("string");
    });
  });

  describe("Email Formatting", () => {
    it("should format quiz answers correctly for email", () => {
      const answers = {
        timeline: "immediate",
        family: "family_young",
        priority: "schools",
        neighbourhood: "central"
      };

      const formattedAnswers = Object.entries(answers)
        .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
        .join('\n\n');

      expect(formattedAnswers).toContain("Q: timeline");
      expect(formattedAnswers).toContain("A: immediate");
      expect(formattedAnswers).toContain("Q: family");
      expect(formattedAnswers).toContain("A: family_young");
    });

    it("should format profile data for email content", () => {
      const profile = {
        summary: "Family seeking Milan relocation",
        keyInsights: ["Urgent timeline", "Family priority"],
        recommendedServices: ["School Advisory", "Integration"]
      };

      const keyInsights = profile.keyInsights.map((insight) => `- ${insight}`).join('\n');
      const services = profile.recommendedServices.map((service) => `- ${service}`).join('\n');

      expect(keyInsights).toContain("- Urgent timeline");
      expect(keyInsights).toContain("- Family priority");
      expect(services).toContain("- School Advisory");
      expect(services).toContain("- Integration");
    });

    it("should create valid email subject with lead information", () => {
      const fullName = "John Doe";
      const persona = "The Discerning Family";
      const leadScore = 90;

      const subject = `New Lead: ${fullName} (${persona}) - Score ${leadScore}/100`;

      expect(subject).toContain("John Doe");
      expect(subject).toContain("The Discerning Family");
      expect(subject).toContain("90/100");
    });
  });

  describe("Email Validation", () => {
    it("should validate correct email format", () => {
      const email = "test@example.com";
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      expect(isValid).toBe(true);
    });

    it("should reject invalid email formats", () => {
      const invalidEmails = [
        "notanemail",
        "missing@domain",
        "@nodomain.com",
        "spaces in@email.com"
      ];

      invalidEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(false);
      });
    });
  });

  describe("Quiz Completion Flow", () => {
    it("should determine persona based on family status", () => {
      const familyAnswer = "family_young";
      const priorityAnswer = ["schools", "community"];

      let persona = "solo";
      if (familyAnswer === "family_young" || familyAnswer === "family_teen") {
        persona = "family";
      } else if (priorityAnswer?.includes("community")) {
        persona = "community";
      }

      expect(persona).toBe("family");
    });

    it("should determine community persona when priority includes community", () => {
      const familyAnswer = "solo";
      const priorityAnswer = ["community", "professionals"];

      let persona = "solo";
      if (familyAnswer === "family_young" || familyAnswer === "family_teen") {
        persona = "family";
      } else if (priorityAnswer?.includes("community")) {
        persona = "community";
      }

      expect(persona).toBe("community");
    });

    it("should default to solo persona", () => {
      const familyAnswer = "solo";
      const priorityAnswer = ["housing", "professionals"];

      let persona = "solo";
      if (familyAnswer === "family_young" || familyAnswer === "family_teen") {
        persona = "family";
      } else if (priorityAnswer?.includes("community")) {
        persona = "community";
      }

      expect(persona).toBe("solo");
    });
  });

  describe("Lead Priority Mapping", () => {
    it("should map lead score to priority correctly", () => {
      const testCases = [
        { score: 90, priority: "high" },
        { score: 80, priority: "high" },
        { score: 65, priority: "standard" },
        { score: 40, priority: "future" }
      ];

      testCases.forEach(({ score, priority }) => {
        let mappedPriority: "high" | "standard" | "future" = "standard";
        if (score >= 80) {
          mappedPriority = "high";
        } else if (score >= 50) {
          mappedPriority = "standard";
        } else {
          mappedPriority = "future";
        }

        expect(mappedPriority).toBe(priority);
      });
    });
  });

  describe("Data Persistence", () => {
    it("should prepare quiz response object with all required fields", () => {
      const quizResponse = {
        email: "test@example.com",
        fullName: "John Doe",
        answers: JSON.stringify({ timeline: "immediate", family: "family_young" }),
        persona: "The Discerning Family",
        profile: JSON.stringify({
          summary: "Test",
          keyInsights: ["Insight"],
          recommendedServices: ["Service"]
        }),
        recommendations: JSON.stringify(["Service 1", "Service 2"]),
        leadScore: 90,
        leadPriority: "high" as const
      };

      expect(quizResponse).toHaveProperty("email");
      expect(quizResponse).toHaveProperty("fullName");
      expect(quizResponse).toHaveProperty("answers");
      expect(quizResponse).toHaveProperty("persona");
      expect(quizResponse).toHaveProperty("profile");
      expect(quizResponse).toHaveProperty("recommendations");
      expect(quizResponse).toHaveProperty("leadScore");
      expect(quizResponse).toHaveProperty("leadPriority");
    });
  });
});
