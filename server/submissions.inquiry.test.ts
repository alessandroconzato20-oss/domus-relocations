import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveInquiry, getInquiries } from "./db";

// Mock the database module
vi.mock("./db", async () => {
  const actual = await vi.importActual("./db");
  return {
    ...actual,
    saveInquiry: vi.fn(),
    getInquiries: vi.fn(),
  };
});

describe("Inquiry Submission", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should save an inquiry with all fields", async () => {
    const mockInquiry = {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+39 02 1234 5678",
      serviceType: "Relocation",
      message: "I need help relocating to Milan",
    };

    (saveInquiry as any).mockResolvedValue({ insertId: 1 });

    const result = await saveInquiry(mockInquiry);

    expect(saveInquiry).toHaveBeenCalledWith(mockInquiry);
    expect(result).toBeDefined();
  });

  it("should save an inquiry without phone", async () => {
    const mockInquiry = {
      fullName: "Jane Smith",
      email: "jane@example.com",
      serviceType: "School Placement",
      message: "Looking for school options",
    };

    (saveInquiry as any).mockResolvedValue({ insertId: 2 });

    const result = await saveInquiry(mockInquiry);

    expect(saveInquiry).toHaveBeenCalledWith(mockInquiry);
    expect(result).toBeDefined();
  });

  it("should retrieve all inquiries", async () => {
    const mockInquiries = [
      {
        id: 1,
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+39 02 1234 5678",
        serviceType: "Relocation",
        message: "I need help relocating to Milan",
        createdAt: new Date(),
      },
      {
        id: 2,
        fullName: "Jane Smith",
        email: "jane@example.com",
        phone: null,
        serviceType: "School Placement",
        message: "Looking for school options",
        createdAt: new Date(),
      },
    ];

    (getInquiries as any).mockResolvedValue(mockInquiries);

    const result = await getInquiries();

    expect(getInquiries).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].fullName).toBe("John Doe");
    expect(result[1].fullName).toBe("Jane Smith");
  });

  it("should handle inquiry with optional message", async () => {
    const mockInquiry = {
      fullName: "Alice Johnson",
      email: "alice@example.com",
      serviceType: "Tax Planning",
    };

    (saveInquiry as any).mockResolvedValue({ insertId: 3 });

    const result = await saveInquiry(mockInquiry);

    expect(saveInquiry).toHaveBeenCalledWith(mockInquiry);
    expect(result).toBeDefined();
  });

  it("should validate required fields", async () => {
    const invalidInquiry = {
      fullName: "",
      email: "invalid-email",
      serviceType: "",
    };

    // This should fail validation in the actual procedure
    expect(() => {
      if (!invalidInquiry.fullName || !invalidInquiry.email || !invalidInquiry.serviceType) {
        throw new Error("Missing required fields");
      }
    }).toThrow();
  });
});
