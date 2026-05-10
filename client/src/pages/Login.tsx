/*
 * DOMUS Relocations — Login Page
 * Design: Milanese Atelier — light theme
 */

import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loginMutation = trpc.auth.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginMutation.mutateAsync({ email, password });

      if (result.success) {
        toast.success("Logged in successfully!");
        // Check if this is the admin account
        if (email === "milano@domusrelocations.com" && password === "Newlifemilano26") {
          setLocation("/admin");
        } else {
          setLocation("/dashboard");
        }
      } else {
        toast.error(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
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
          Welcome Back
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
          Sign in to your account
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
              Email
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

          {/* Forgot Password Link */}
          <div style={{ textAlign: "right", marginBottom: "1rem" }}>
            <button
              onClick={() => setLocation("/forgot-password")}
              style={{
                background: "none",
                border: "none",
                color: "var(--domus-gold)",
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "none",
                padding: 0,
              }}
            >
              Forgot password?
            </button>
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
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Social Login Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "2rem 0",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "rgba(45, 41, 38, 0.1)" }} />
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.75rem",
              color: "rgba(45, 41, 38, 0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Or
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(45, 41, 38, 0.1)" }} />
        </div>

        {/* Social Login Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button
            onClick={() => {
              toast.info("Google login coming soon");
            }}
            style={{
              padding: "0.75rem 1.5rem",
              background: "white",
              border: "1px solid rgba(45, 41, 38, 0.15)",
              color: "var(--domus-charcoal)",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(45, 41, 38, 0.02)";
              e.currentTarget.style.borderColor = "var(--domus-gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "rgba(45, 41, 38, 0.15)";
            }}
          >
            <span>🔵</span> Continue with Google
          </button>
          <button
            onClick={() => {
              toast.info("Apple login coming soon");
            }}
            style={{
              padding: "0.75rem 1.5rem",
              background: "white",
              border: "1px solid rgba(45, 41, 38, 0.15)",
              color: "var(--domus-charcoal)",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(45, 41, 38, 0.02)";
              e.currentTarget.style.borderColor = "var(--domus-gold)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "white";
              e.currentTarget.style.borderColor = "rgba(45, 41, 38, 0.15)";
            }}
          >
            <span>🍎</span> Continue with Apple
          </button>
        </div>

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
            Don't have an account?{" "}
            <button
              onClick={() => setLocation("/signup")}
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
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
