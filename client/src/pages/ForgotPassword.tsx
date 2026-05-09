/*
 * DOMUS Relocations — Forgot Password Page
 * Design: Milanese Atelier — light theme
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const requestResetMutation = trpc.auth.requestPasswordReset.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestResetMutation.mutateAsync({ email });

      if (result.success) {
        setIsSubmitted(true);
        toast.success("Check your email for reset instructions");
      } else {
        toast.error(result.message || "Failed to process request");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--domus-ivory)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "white",
          padding: "3rem 2rem",
          boxShadow: "0 2px 8px rgba(45, 41, 38, 0.08)",
        }}
      >
        {!isSubmitted ? (
          <>
            {/* Header */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "2rem",
                color: "var(--domus-charcoal)",
                marginBottom: "0.5rem",
                textAlign: "center",
              }}
            >
              Reset Password
            </h1>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(45, 41, 38, 0.6)",
                textAlign: "center",
                marginBottom: "2rem",
              }}
            >
              Enter your email to receive a password reset link
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Email */}
              <div>
                <label
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--domus-charcoal)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(45, 41, 38, 0.02)",
                    border: "1px solid rgba(45, 41, 38, 0.15)",
                    color: "var(--domus-charcoal)",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.9rem",
                    outline: "none",
                    boxSizing: "border-box",
                    transition: "border-color 0.3s ease",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "var(--domus-gold)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(45, 41, 38, 0.15)")}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--domus-charcoal)",
                  color: "white",
                  border: "none",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  opacity: isLoading ? 0.6 : 1,
                  transition: "opacity 0.3s ease",
                  marginTop: "0.5rem",
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => !isLoading && (e.currentTarget.style.opacity = "1")}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Footer */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "2rem",
                borderTop: "1px solid rgba(45, 41, 38, 0.1)",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.85rem",
                  color: "rgba(45, 41, 38, 0.6)",
                }}
              >
                Remember your password?{" "}
                <button
                  onClick={() => setLocation("/login")}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--domus-gold)",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "none",
                    padding: 0,
                  }}
                >
                  Back to login
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Success Message */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "3rem",
                  marginBottom: "1rem",
                  color: "var(--domus-gold)",
                }}
              >
                ✓
              </div>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "1.5rem",
                  color: "var(--domus-charcoal)",
                  marginBottom: "1rem",
                }}
              >
                Check Your Email
              </h2>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.9rem",
                  color: "rgba(45, 41, 38, 0.7)",
                  marginBottom: "2rem",
                  lineHeight: "1.6",
                }}
              >
                We've sent a password reset link to <strong>{email}</strong>. The link will expire in 1 hour.
              </p>

              {/* Back to Login Button */}
              <button
                onClick={() => setLocation("/login")}
                style={{
                  padding: "0.75rem 1.5rem",
                  background: "var(--domus-charcoal)",
                  color: "white",
                  border: "none",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "opacity 0.3s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
