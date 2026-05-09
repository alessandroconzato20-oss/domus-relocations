/*
 * DOMUS Relocations — Reset Password Page
 * Design: Milanese Atelier — light theme
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [token, setToken] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get("token") || "";
    setToken(resetToken);
  }, []);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const resetPasswordMutation = trpc.auth.resetPassword.useMutation();

  useEffect(() => {
    if (token && !isLoading) {
      // Token is loaded, check if it's valid
    }
  }, [token, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link");
      setIsInvalid(true);
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const result = await resetPasswordMutation.mutateAsync({
        token,
        newPassword: password,
      });

      if (result.success) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
          setLocation("/login");
        }, 2000);
      } else {
        toast.error(result.message || "Failed to reset password");
        if (result.message && result.message.includes("Invalid or expired")) {
          setIsInvalid(true);
        }
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isInvalid) {
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
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              color: "#d9534f",
            }}
          >
            ✕
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
            Invalid Link
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(45, 41, 38, 0.7)",
              marginBottom: "2rem",
            }}
          >
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <button
            onClick={() => setLocation("/forgot-password")}
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
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
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
            textAlign: "center",
          }}
        >
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
            Password Reset
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.9rem",
              color: "rgba(45, 41, 38, 0.7)",
              marginBottom: "2rem",
            }}
          >
            Your password has been reset successfully. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

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
          Create New Password
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
          Enter your new password below
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {/* Password */}
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
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 characters"
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

          {/* Confirm Password */}
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
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
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
            {isLoading ? "Resetting..." : "Reset Password"}
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
      </div>
    </div>
  );
}
