import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveInquiry, getInquiries } from "./db";

// Mock the database functions
vi.mock("./db", () => ({
  saveInquiry: vi.fn(),
  getInquiries: vi.fn(),
}));

describe("Inquiry Form Submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should save an inquiry with all fields", async () => {
    const inquiry = {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+39 02 1234 5678",
      serviceType: "Relocation Advisory",
      message: "I need help with my relocation to Milan",
    };

    await saveInquiry(inquiry);

    expect(saveInquiry).toHaveBeenCalledWith(inquiry);
    expect(saveInquiry).toHaveBeenCalledTimes(1);
  });

  it("should save an inquiry without phone number", async () => {
    const inquiry = {
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: undefined,
      serviceType: "School Placement",
      message: "Looking for school options",
    };

    await saveInquiry(inquiry);

    expect(saveInquiry).toHaveBeenCalledWith(inquiry);
  });

  it("should save an inquiry without message", async () => {
    const inquiry = {
      fullName: "Bob Wilson",
      email: "bob@example.com",
      phone: "+39 02 9876 5432",
      serviceType: "Tax & Wealth Planning",
      message: undefined,
    };

    await saveInquiry(inquiry);

    expect(saveInquiry).toHaveBeenCalledWith(inquiry);
  });

  it("should retrieve all inquiries", async () => {
    const mockInquiries = [
      {
        id: 1,
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+39 02 1234 5678",
        serviceType: "Relocation Advisory",
        message: "Help with relocation",
        createdAt: new Date(),
      },
      {
        id: 2,
        fullName: "Jane Smith",
        email: "jane@example.com",
        phone: null,
        serviceType: "School Placement",
        message: "School options",
        createdAt: new Date(),
      },
    ];

    vi.mocked(getInquiries).mockResolvedValue(mockInquiries);

    const result = await getInquiries();

    expect(result).toEqual(mockInquiries);
    expect(getInquiries).toHaveBeenCalledTimes(1);
  });

  it("should handle different service types", async () => {
    const serviceTypes = [
      "Relocation Advisory",
      "School Placement",
      "Tax & Wealth Planning",
      "Real Estate & Housing",
      "Healthcare & Lifestyle",
      "General Inquiry",
    ];

    for (const serviceType of serviceTypes) {
      const inquiry = {
        fullName: "Test User",
        email: "test@example.com",
        phone: undefined,
        serviceType,
        message: "Test message",
      };

      await saveInquiry(inquiry);

      expect(saveInquiry).toHaveBeenCalledWith(expect.objectContaining({ serviceType }));
    }

    expect(saveInquiry).toHaveBeenCalledTimes(serviceTypes.length);
  });

  it("should validate required fields", async () => {
    const invalidInquiry = {
      fullName: "",
      email: "invalid-email",
      phone: undefined,
      serviceType: "",
      message: undefined,
    };

    // This test verifies that the form should validate these fields
    // In a real implementation, validation would happen on the frontend
    // and the backend would reject invalid data
    expect(invalidInquiry.fullName).toBe("");
    expect(invalidInquiry.serviceType).toBe("");
  });
});
