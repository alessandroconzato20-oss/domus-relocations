/**
 * DOMUS Relocations — Admin: Client List
 * Lists all client profiles with links to individual client management
 */
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

const PACKAGE_COLORS: Record<string, string> = {
  standard: "#6b8fb4",
  premium: "#b49b6e",
  elite: "#1a1a1a",
};

export default function AdminClientList() {
  const [, navigate] = useLocation();
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  const clientsQuery = trpc.adminDashboard.listClients.useQuery();
  const clients = clientsQuery.data ?? [];

  const userSearchQuery = trpc.adminDashboard.searchUserByEmail.useQuery(
    { email: debouncedEmail },
    { enabled: debouncedEmail.length > 3 && debouncedEmail.includes("@") }
  );

  const [newClientForm, setNewClientForm] = useState({
    userId: 0,
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    currentCity: "",
    targetMoveDate: "",
    servicePackage: "standard" as "standard" | "premium" | "elite",
    notes: "",
  });

  const createClientMutation = trpc.adminDashboard.createClient.useMutation({
    onSuccess: () => {
      clientsQuery.refetch();
      setShowNewClientModal(false);
      setSearchEmail("");
      setDebouncedEmail("");
      setNewClientForm({
        userId: 0,
        fullName: "",
        email: "",
        phone: "",
        nationality: "",
        currentCity: "",
        targetMoveDate: "",
        servicePackage: "standard",
        notes: "",
      });
      toast.success("Client profile created successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create client profile");
    },
  });

  const handleEmailSearch = (email: string) => {
    setSearchEmail(email);
    // Debounce
    const timer = setTimeout(() => setDebouncedEmail(email), 500);
    return () => clearTimeout(timer);
  };

  const handleSelectFoundUser = () => {
    if (userSearchQuery.data) {
      setNewClientForm((f) => ({
        ...f,
        userId: userSearchQuery.data!.id,
        fullName: userSearchQuery.data!.name ?? "",
        email: userSearchQuery.data!.email ?? "",
      }));
    }
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.userId) {
      toast.error("Please search for and select a registered user first");
      return;
    }
    createClientMutation.mutate(newClientForm);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.625rem 0.875rem",
    backgroundColor: "#f9f6f1",
    border: "1px solid rgba(180,155,110,0.3)",
    borderRadius: "2px",
    fontSize: "0.875rem",
    color: "#1a1a1a",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#6b6b6b",
    marginBottom: "0.375rem",
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9f6f1" }}>
      {/* Header */}
      <div style={{
        backgroundColor: "#1a1a1a",
        padding: "1.5rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.25rem" }}>
            Admin Panel
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 300, fontSize: "1.5rem", color: "#ffffff", letterSpacing: "0.05em" }}>
            Client Management
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <a href="/admin" style={{
            padding: "0.6rem 1.25rem",
            fontSize: "0.7rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "2px",
            textDecoration: "none",
          }}>
            ← Admin Home
          </a>
          <button
            onClick={() => setShowNewClientModal(true)}
            style={{
              padding: "0.6rem 1.25rem",
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#1a1a1a",
              backgroundColor: "#b49b6e",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
            }}
          >
            + New Client
          </button>
        </div>
      </div>

      <div style={{ padding: "2rem" }}>
        {clientsQuery.isLoading && (
          <div style={{ color: "#6b6b6b", fontSize: "0.875rem" }}>Loading clients…</div>
        )}

        {!clientsQuery.isLoading && clients.length === 0 && (
          <div style={{
            padding: "3rem 2rem",
            textAlign: "center",
            backgroundColor: "#ffffff",
            border: "1px solid rgba(180,155,110,0.15)",
            borderRadius: "2px",
          }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "1.125rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>
              No client profiles yet
            </div>
            <p style={{ fontSize: "0.8rem", color: "#6b6b6b", marginBottom: "1.5rem" }}>
              Create the first client profile by clicking "New Client" above.
            </p>
          </div>
        )}

        {clients.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1rem" }}>
            {clients.map((client) => (
              <div
                key={client.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(180,155,110,0.12)",
                  borderRadius: "2px",
                  padding: "1.5rem",
                  cursor: "pointer",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onClick={() => navigate(`/admin/clients/${client.id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(180,155,110,0.4)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(180,155,110,0.12)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#1a1a1a" }}>
                      {client.fullName}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b6b6b", marginTop: "0.125rem" }}>
                      {client.email}
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: PACKAGE_COLORS[client.servicePackage] ?? "#6b6b6b",
                    padding: "0.15rem 0.5rem",
                    border: `1px solid ${PACKAGE_COLORS[client.servicePackage] ?? "#6b6b6b"}`,
                    borderRadius: "999px",
                  }}>
                    {client.servicePackage}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.75rem", color: "#9b9b9b" }}>
                  {client.nationality && <span>🌍 {client.nationality}</span>}
                  {client.currentCity && <span>📍 {client.currentCity}</span>}
                  {client.targetMoveDate && <span>📅 {client.targetMoveDate}</span>}
                </div>
                <div style={{ marginTop: "0.75rem", fontSize: "0.7rem", color: "#b49b6e", letterSpacing: "0.05em" }}>
                  View Profile →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Client Modal */}
      {showNewClientModal && (
        <div style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          padding: "1rem",
        }}>
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "2px",
            padding: "2rem",
            width: "100%",
            maxWidth: "560px",
            maxHeight: "90vh",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 300, fontSize: "1.25rem", color: "#1a1a1a" }}>
                Add New Client
              </h2>
              <button
                onClick={() => setShowNewClientModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "#6b6b6b" }}
              >
                ✕
              </button>
            </div>

            {/* Step 1: Find user by email */}
            <div style={{ marginBottom: "1.5rem", padding: "1rem", backgroundColor: "rgba(180,155,110,0.06)", border: "1px solid rgba(180,155,110,0.2)", borderRadius: "2px" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b49b6e", marginBottom: "0.75rem" }}>
                Step 1 — Find Registered User
              </div>
              <label style={labelStyle}>Search by Email Address</label>
              <input
                type="email"
                value={searchEmail}
                onChange={(e) => handleEmailSearch(e.target.value)}
                placeholder="client@example.com"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")}
              />
              {userSearchQuery.isLoading && searchEmail.includes("@") && (
                <div style={{ fontSize: "0.75rem", color: "#6b6b6b", marginTop: "0.5rem" }}>Searching…</div>
              )}
              {userSearchQuery.data && (
                <div style={{
                  marginTop: "0.75rem",
                  padding: "0.75rem",
                  backgroundColor: "#ffffff",
                  border: "1px solid rgba(180,155,110,0.3)",
                  borderRadius: "2px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontSize: "0.875rem", color: "#1a1a1a" }}>{userSearchQuery.data.name}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b6b6b" }}>{userSearchQuery.data.email}</div>
                  </div>
                  {newClientForm.userId === userSearchQuery.data.id ? (
                    <span style={{ fontSize: "0.7rem", color: "#6b9b6e", letterSpacing: "0.1em" }}>✓ Selected</span>
                  ) : (
                    <button
                      onClick={handleSelectFoundUser}
                      style={{
                        padding: "0.4rem 0.875rem",
                        backgroundColor: "#b49b6e",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "2px",
                        fontSize: "0.7rem",
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                      }}
                    >
                      Select
                    </button>
                  )}
                </div>
              )}
              {debouncedEmail.includes("@") && !userSearchQuery.isLoading && userSearchQuery.data === null && (
                <div style={{ fontSize: "0.75rem", color: "#9b6b6b", marginTop: "0.5rem" }}>
                  No registered user found with this email. The client must sign up first.
                </div>
              )}
            </div>

            {/* Step 2: Profile details */}
            <form onSubmit={handleCreateClient} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#b49b6e" }}>
                Step 2 — Profile Details
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input
                    type="text"
                    value={newClientForm.fullName}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, fullName: e.target.value }))}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email"
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, email: e.target.value }))}
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input
                    type="tel"
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, phone: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Nationality</label>
                  <input
                    type="text"
                    value={newClientForm.nationality}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, nationality: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Current City</label>
                  <input
                    type="text"
                    value={newClientForm.currentCity}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, currentCity: e.target.value }))}
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Target Move Date</label>
                  <input
                    type="text"
                    value={newClientForm.targetMoveDate}
                    onChange={(e) => setNewClientForm((f) => ({ ...f, targetMoveDate: e.target.value }))}
                    placeholder="e.g. September 2025"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Service Package</label>
                <select
                  value={newClientForm.servicePackage}
                  onChange={(e) => setNewClientForm((f) => ({ ...f, servicePackage: e.target.value as "standard" | "premium" | "elite" }))}
                  style={{ ...inputStyle }}
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="elite">Elite</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Internal Notes</label>
                <textarea
                  value={newClientForm.notes}
                  onChange={(e) => setNewClientForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.3)")}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowNewClientModal(false)}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "transparent",
                    border: "1px solid rgba(180,155,110,0.3)",
                    borderRadius: "2px",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "#6b6b6b",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createClientMutation.isPending || !newClientForm.userId}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: newClientForm.userId ? "#1a1a1a" : "rgba(0,0,0,0.2)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "2px",
                    fontSize: "0.7rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: newClientForm.userId && !createClientMutation.isPending ? "pointer" : "not-allowed",
                  }}
                >
                  {createClientMutation.isPending ? "Creating…" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
