import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const ADMIN_EMAIL = "milano@domusrelocations.com";

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

        const isAdmin = result.user?.email === ADMIN_EMAIL;

        // Store role in localStorage so the app knows who is logged in
        // after the hard navigation
        localStorage.setItem("domus_user_email", result.user?.email ?? "");
        localStorage.setItem("domus_is_admin", isAdmin ? "true" : "false");

        // Use hard navigation — not wouter setLocation — so the full
        // app reinitialises with fresh server session state
        setTimeout(() => {
          if (isAdmin) {
            window.location.replace("/admin/clients");
          } else {
            window.location.replace("/family-dashboard");
          }
        }, 400);
      } else {
        toast.error(result.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto", marginTop: "4rem" }}>
      <h1>Log In</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="milano@domusrelocations.com"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{ width: "100%", padding: "0.5rem", marginTop: "0.5rem" }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: "#333",
            color: "white",
            border: "none",
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setLocation("/forgot-password")}
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
        >
          Forgot password?
        </button>
      </div>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          onClick={() => setLocation("/signup")}
          style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
