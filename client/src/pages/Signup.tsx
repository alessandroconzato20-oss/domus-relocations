/**
 * DOMUS Relocations — Signup Page
 * Milanese Atelier aesthetic: ivory background, serif typography, warm gold accents
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("email") ?? "";
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        // Store JWT in localStorage so it survives page navigation
        if (data.token) {
          localStorage.setItem("domus_auth_token", data.token);
        }
        window.location.replace("/dashboard");
      } else {
        setError(data.message || "Signup failed. Please try again.");
      }
    },
    onError: () => {
      setError("An unexpected error occurred. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    signupMutation.mutate({ email, name, password });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#f9f6f1",
    border: "1px solid rgba(180,155,110,0.3)",
    borderRadius: "2px",
    color: "#1a1a1a",
    fontSize: "0.875rem",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, background-color 0.2s",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.7rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#6b6b6b",
    marginBottom: "0.5rem",
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backgroundColor: "#f9f6f1" }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.35em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.25rem" }}>
              Private Client Access
            </div>
            <h1 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 300, fontSize: "1.875rem", letterSpacing: "0.05em", color: "#1a1a1a", margin: 0 }}>
              DOMUS
            </h1>
            <div style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#6b6b6b", marginTop: "0.125rem" }}>
              Relocations
            </div>
          </a>
        </div>

        {/* Card */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid rgba(180,155,110,0.2)", borderRadius: "2px", padding: "2.5rem 2rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 300, fontSize: "1.25rem", letterSpacing: "0.05em", color: "#1a1a1a", marginBottom: "0.25rem" }}>
            Create Your Account
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#6b6b6b", marginBottom: "2rem" }}>
            Register to access your private client portal
          </p>

          {error && (
            <div style={{ marginBottom: "1.5rem", padding: "0.75rem 1rem", backgroundColor: "rgba(220,53,69,0.06)", border: "1px solid rgba(220,53,69,0.2)", borderRadius: "2px", fontSize: "0.875rem", color: "#c0392b" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your full name"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#b49b6e"; e.target.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(180,155,110,0.3)"; e.target.style.backgroundColor = "#f9f6f1"; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#b49b6e"; e.target.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(180,155,110,0.3)"; e.target.style.backgroundColor = "#f9f6f1"; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Minimum 8 characters"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#b49b6e"; e.target.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(180,155,110,0.3)"; e.target.style.backgroundColor = "#f9f6f1"; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat your password"
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "#b49b6e"; e.target.style.backgroundColor = "#ffffff"; }}
                onBlur={(e) => { e.target.style.borderColor = "rgba(180,155,110,0.3)"; e.target.style.backgroundColor = "#f9f6f1"; }}
              />
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending}
              style={{
                width: "100%",
                padding: "0.875rem",
                backgroundColor: signupMutation.isPending ? "rgba(180,155,110,0.5)" : "#b49b6e",
                color: "#ffffff",
                border: "none",
                borderRadius: "2px",
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                cursor: signupMutation.isPending ? "not-allowed" : "pointer",
                marginTop: "0.5rem",
              }}
            >
              {signupMutation.isPending ? "Creating Account…" : "Create Account"}
            </button>
          </form>

          <div style={{ marginTop: "1.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(180,155,110,0.15)", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: "#6b6b6b" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#b49b6e", textDecoration: "none" }}>
                Sign in here
              </a>
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.75rem", marginTop: "1.5rem" }}>
          <a href="/" style={{ color: "#b49b6e", textDecoration: "none" }}>
            ← Return to DOMUS Relocations
          </a>
        </p>
      </div>
    </div>
  );
}
