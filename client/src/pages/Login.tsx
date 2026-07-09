/**
 * DOMUS Relocations — Login Page
 * Milanese Atelier aesthetic: ivory background, serif typography, warm gold accents
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const ADMIN_EMAIL = "milano@domusrelocations.com";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("email") ?? "";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        // Store JWT in localStorage so it survives page navigation and proxy stripping of cookies
        if (data.token) {
          localStorage.setItem("domus_auth_token", data.token);
        }
        const isAdmin = data.user?.email === ADMIN_EMAIL;
        // Hard navigate to refresh auth state
        if (isAdmin) {
          window.location.replace("/admin");
        } else {
          window.location.replace("/dashboard");
        }
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    },
    onError: () => {
      setError("An unexpected error occurred. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate({ email, password });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#f9f6f1" }}
    >
      {/* Background texture */}
      <div
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(180,155,110,0.08) 0%, transparent 60%),
                            radial-gradient(circle at 80% 20%, rgba(180,155,110,0.06) 0%, transparent 50%)`,
        }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-10">
          <a href="/" className="inline-block">
            <div
              className="text-xs tracking-[0.35em] uppercase mb-1"
              style={{ color: "#b49b6e", fontFamily: "var(--font-sans)" }}
            >
              Private Client Access
            </div>
            <h1
              className="text-3xl font-light tracking-wide"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1a1a1a" }}
            >
              DOMUS
            </h1>
            <div
              className="text-xs tracking-[0.2em] uppercase mt-0.5"
              style={{ color: "#6b6b6b" }}
            >
              Relocations
            </div>
          </a>
        </div>

        {/* Card */}
        <div
          className="rounded-sm shadow-sm border px-8 py-10"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "rgba(180,155,110,0.2)",
          }}
        >
          <h2
            className="text-xl font-light tracking-wide mb-1"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif", color: "#1a1a1a" }}
          >
            Welcome Back
          </h2>
          <p className="text-sm mb-8" style={{ color: "#6b6b6b" }}>
            Sign in to your private client portal
          </p>

          {error && (
            <div
              className="mb-6 px-4 py-3 rounded-sm text-sm border"
              style={{
                backgroundColor: "rgba(220,53,69,0.06)",
                borderColor: "rgba(220,53,69,0.2)",
                color: "#c0392b",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                className="block text-xs tracking-[0.15em] uppercase mb-2"
                style={{ color: "#6b6b6b" }}
              >
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "#f9f6f1",
                  border: "1px solid rgba(180,155,110,0.3)",
                  borderRadius: "2px",
                  color: "#1a1a1a",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#b49b6e";
                  e.target.style.backgroundColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(180,155,110,0.3)";
                  e.target.style.backgroundColor = "#f9f6f1";
                }}
              />
            </div>

            <div>
              <label
                className="block text-xs tracking-[0.15em] uppercase mb-2"
                style={{ color: "#6b6b6b" }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 text-sm outline-none transition-colors"
                style={{
                  backgroundColor: "#f9f6f1",
                  border: "1px solid rgba(180,155,110,0.3)",
                  borderRadius: "2px",
                  color: "#1a1a1a",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#b49b6e";
                  e.target.style.backgroundColor = "#ffffff";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(180,155,110,0.3)";
                  e.target.style.backgroundColor = "#f9f6f1";
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full py-3.5 text-xs tracking-[0.2em] uppercase transition-all duration-200 mt-2"
              style={{
                backgroundColor: loginMutation.isPending ? "rgba(180,155,110,0.5)" : "#b49b6e",
                color: "#ffffff",
                border: "none",
                borderRadius: "2px",
                cursor: loginMutation.isPending ? "not-allowed" : "pointer",
              }}
            >
              {loginMutation.isPending ? "Signing In…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: "rgba(180,155,110,0.15)" }}>
            <p className="text-xs" style={{ color: "#6b6b6b" }}>
              Don't have an account?{" "}
              <a
                href="/signup"
                style={{ color: "#b49b6e", textDecoration: "none" }}
              >
                Create one here
              </a>
            </p>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs mt-6">
          <a
            href="/"
            style={{ color: "#b49b6e", textDecoration: "none" }}
          >
            ← Return to DOMUS Relocations
          </a>
        </p>
      </div>
    </div>
  );
}
