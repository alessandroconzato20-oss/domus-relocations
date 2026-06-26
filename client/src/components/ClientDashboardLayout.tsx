/**
 * DOMUS Relocations — Client Dashboard Layout
 * Sidebar navigation for the private client portal
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

const ADMIN_EMAIL = "milano@domusrelocations.com";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: "⌂" },
  { href: "/dashboard/checklist", label: "My Checklist", icon: "✓" },
  { href: "/dashboard/documents", label: "My Documents", icon: "⊡" },
  { href: "/dashboard/appointments", label: "Appointments", icon: "◷" },
  { href: "/dashboard/schools", label: "Schools", icon: "✦" },
  { href: "/dashboard/messages", label: "Messages", icon: "✉" },
  { href: "/dashboard/network", label: "DOMUS Network", icon: "◈" },
];

interface ClientDashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function ClientDashboardLayout({ children, title }: ClientDashboardLayoutProps) {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const meQuery = trpc.auth.me.useQuery();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.replace("/login");
    },
  });

  const user = meQuery.data;
  const isAdmin = user?.email === ADMIN_EMAIL;

  // Redirect to login if not authenticated
  if (!meQuery.isLoading && !user) {
    window.location.replace("/login");
    return null;
  }

  const unreadQuery = trpc.clientDashboard.getUnreadCount.useQuery(undefined, {
    enabled: !!user && !isAdmin,
    refetchInterval: 30000,
  });

  const unreadCount = unreadQuery.data?.count ?? 0;

  const isActive = (href: string) => {
    if (href === "/dashboard") return location === "/dashboard";
    return location.startsWith(href);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f9f6f1" }}>
      {/* Sidebar — desktop */}
      <aside
        style={{
          width: "260px",
          minHeight: "100vh",
          backgroundColor: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 40,
          flexShrink: 0,
        }}
        className="hidden md:flex"
      >
        {/* Brand */}
        <div style={{ padding: "2rem 1.5rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <a href="/" style={{ textDecoration: "none" }}>
            <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.25rem" }}>
              Private Client Portal
            </div>
            <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 300, fontSize: "1.5rem", letterSpacing: "0.1em", color: "#ffffff" }}>
              DOMUS
            </div>
          </a>
          {user && (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ fontSize: "0.75rem", color: "#b49b6e", letterSpacing: "0.05em" }}>
                Welcome back,
              </div>
              <div style={{ fontSize: "0.875rem", color: "#e8e0d0", marginTop: "0.125rem", fontWeight: 300 }}>
                {user.name || user.email}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: "1.5rem 0", overflowY: "auto" }}>
          {navItems.map((item) => {
            const active = isActive(item.href);
            const hasUnread = item.href === "/dashboard/messages" && unreadCount > 0;
            return (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1.5rem",
                  textDecoration: "none",
                  fontSize: "0.8rem",
                  letterSpacing: "0.08em",
                  color: active ? "#b49b6e" : "rgba(255,255,255,0.6)",
                  backgroundColor: active ? "rgba(180,155,110,0.1)" : "transparent",
                  borderLeft: active ? "2px solid #b49b6e" : "2px solid transparent",
                  transition: "all 0.2s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "0.9rem", width: "1.25rem", textAlign: "center" }}>{item.icon}</span>
                <span>{item.label}</span>
                {hasUnread && (
                  <span style={{
                    marginLeft: "auto",
                    backgroundColor: "#b49b6e",
                    color: "#1a1a1a",
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    padding: "0.1rem 0.4rem",
                    borderRadius: "999px",
                    minWidth: "1.25rem",
                    textAlign: "center",
                  }}>
                    {unreadCount}
                  </span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          {isAdmin && (
            <a
              href="/admin"
              style={{
                display: "block",
                padding: "0.6rem 1rem",
                marginBottom: "0.75rem",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#b49b6e",
                border: "1px solid rgba(180,155,110,0.3)",
                borderRadius: "2px",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Admin Panel
            </a>
          )}
          <button
            onClick={() => logoutMutation.mutate()}
            style={{
              width: "100%",
              padding: "0.6rem 1rem",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              backgroundColor: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: "#1a1a1a",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem", color: "#ffffff", letterSpacing: "0.1em" }}>
          DOMUS
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: "none", border: "none", color: "#b49b6e", fontSize: "1.5rem", cursor: "pointer" }}
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 45,
            backgroundColor: "#1a1a1a",
            paddingTop: "4rem",
          }}
        >
          <nav style={{ padding: "1rem 0" }}>
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "1rem 1.5rem",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    color: active ? "#b49b6e" : "rgba(255,255,255,0.7)",
                    borderLeft: active ? "2px solid #b49b6e" : "2px solid transparent",
                  }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
          <div style={{ padding: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              onClick={() => logoutMutation.mutate()}
              style={{
                width: "100%",
                padding: "0.75rem",
                fontSize: "0.75rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                backgroundColor: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "2px",
                cursor: "pointer",
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <main
        style={{
          flex: 1,
          marginLeft: 0,
          paddingTop: 0,
        }}
        className="md:ml-[260px]"
      >
        {/* Page header */}
        {title && (
          <div
            style={{
              padding: "2rem 2.5rem 1.5rem",
              borderBottom: "1px solid rgba(180,155,110,0.15)",
              backgroundColor: "#ffffff",
            }}
            className="pt-20 md:pt-0"
          >
            <h1
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontWeight: 300,
                fontSize: "1.5rem",
                letterSpacing: "0.05em",
                color: "#1a1a1a",
              }}
            >
              {title}
            </h1>
          </div>
        )}
        <div className={title ? "" : "pt-16 md:pt-0"} style={{ padding: title ? "2rem 2.5rem" : "2rem 2.5rem" }}>
          {children}
        </div>
      </main>
    </div>
  );
}
