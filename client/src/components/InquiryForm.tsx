import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { X } from "lucide-react";

interface InquiryFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryForm({ isOpen, onClose }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    serviceType: "Relocation Advisory",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const submitInquiry = trpc.submissions.submitInquiry.useMutation();

  const serviceOptions = [
    "Relocation Advisory",
    "School Placement",
    "Tax & Wealth Planning",
    "Real Estate & Housing",
    "Healthcare & Lifestyle",
    "General Inquiry",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      await submitInquiry.mutateAsync({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone || undefined,
        serviceType: formData.serviceType,
        message: formData.message || undefined,
      });

      setSubmitStatus("success");
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        serviceType: "Relocation Advisory",
        message: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        onClose();
        setSubmitStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--domus-ivory)",
          borderRadius: "8px",
          padding: "2rem",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.75rem",
              fontWeight: 400,
              color: "var(--domus-charcoal)",
              margin: 0,
            }}
          >
            Schedule a Consultation
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--domus-charcoal)",
              padding: "0.5rem",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--domus-charcoal)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05rem",
              }}
            >
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d4c5b9",
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--domus-charcoal)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05rem",
              }}
            >
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d4c5b9",
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              placeholder="your@email.com"
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--domus-charcoal)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05rem",
              }}
            >
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d4c5b9",
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
              placeholder="+39 02 1234 5678"
            />
          </div>

          {/* Service Type */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--domus-charcoal)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05rem",
              }}
            >
              Service Type *
            </label>
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d4c5b9",
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            >
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--domus-charcoal)",
                marginBottom: "0.5rem",
                textTransform: "uppercase",
                letterSpacing: "0.05rem",
              }}
            >
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d4c5b9",
                borderRadius: "4px",
                fontSize: "0.95rem",
                fontFamily: "inherit",
                boxSizing: "border-box",
                resize: "vertical",
              }}
              placeholder="Tell us more about your relocation needs..."
            />
          </div>

          {/* Status Messages */}
          {submitStatus === "success" && (
            <div
              style={{
                padding: "1rem",
                background: "#f0fdf4",
                border: "1px solid #86efac",
                borderRadius: "4px",
                color: "#166534",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              ✓ Thank you! Your inquiry has been submitted successfully. We'll be in touch shortly.
            </div>
          )}

          {submitStatus === "error" && (
            <div
              style={{
                padding: "1rem",
                background: "#fef2f2",
                border: "1px solid #fca5a5",
                borderRadius: "4px",
                color: "#991b1b",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              ✗ There was an error submitting your inquiry. Please try again.
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || submitStatus === "success"}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: isSubmitting || submitStatus === "success" ? "#d4af37cc" : "var(--domus-gold)",
              color: "var(--domus-ivory)",
              border: "none",
              borderRadius: "4px",
              fontSize: "0.95rem",
              fontWeight: 600,
              cursor: isSubmitting || submitStatus === "success" ? "not-allowed" : "pointer",
              textTransform: "uppercase",
              letterSpacing: "0.05rem",
              transition: "all 0.3s ease",
            }}
          >
            {isSubmitting ? "Submitting..." : submitStatus === "success" ? "Submitted!" : "Submit Inquiry"}
          </button>
        </form>

        {/* Footer note */}
        <p
          style={{
            fontSize: "0.8rem",
            color: "#999999",
            marginTop: "1rem",
            textAlign: "center",
          }}
        >
          We respect your privacy. Your information will only be used to contact you about your inquiry.
        </p>
      </div>
    </div>
  );
}
