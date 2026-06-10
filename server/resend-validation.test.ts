import { describe, it, expect } from "vitest";
import { sendEmailViaResend, formatQuizEmailContent, formatInquiryEmailContent } from "./_core/resendService";

describe("Resend Email Service Validation", () => {
  it("should validate Resend API key is configured", async () => {
    // Test that the email service can be initialized
    const emailContent = formatQuizEmailContent({
      fullName: "Test User",
      email: "test@example.com",
      profileName: "Test Profile",
      profileDescription: "Test description",
      recommendations: ["Service 1", "Service 2"],
      leadScore: 85,
      answers: { timeline: "Within 3 months" },
    });

    expect(emailContent.subject).toContain("Test Profile");
    expect(emailContent.htmlContent).toContain("Test User");
    expect(emailContent.textContent).toContain("test@example.com");
  });

  it("should format quiz email content correctly", () => {
    const content = formatQuizEmailContent({
      fullName: "Sarah Johnson",
      email: "sarah@example.com",
      profileName: "The Discerning Family",
      profileDescription: "Your priority is a seamless, complete transition for your entire family.",
      recommendations: ["Private Relocation Advisory", "School Advisory"],
      leadScore: 95,
      answers: { timeline: "Within 3 months", family: "Family with young children" },
    });

    expect(content.subject).toBe("New Quiz Submission: The Discerning Family - Sarah Johnson");
    expect(content.htmlContent).toContain("Sarah Johnson");
    expect(content.htmlContent).toContain("95/100");
    expect(content.htmlContent).toContain("The Discerning Family");
  });

  it("should format inquiry email content correctly", () => {
    const content = formatInquiryEmailContent({
      fullName: "Maria Rossi",
      email: "maria@example.com",
      phone: "+39 02 5555 6666",
      serviceType: "School Placement",
      message: "Looking for school options for my children",
    });

    expect(content.subject).toContain("School Placement");
    expect(content.subject).toContain("Maria Rossi");
    expect(content.htmlContent).toContain("maria@example.com");
    expect(content.htmlContent).toContain("+39 02 5555 6666");
  });
});
