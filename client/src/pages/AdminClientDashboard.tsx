import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Client {
  id: number;
  name: string | null;
  email: string | null;
  openId: string;
  role: string;
}

export default function AdminClientDashboard() {
  const [, setLocation] = useLocation();
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all clients
  const { data: clients = [], isLoading: clientsLoading } = trpc.admin.getAllClients.useQuery();

  // Fetch selected client data
  const { data: selectedClient } = trpc.admin.getClientData.useQuery(
    { clientId: selectedClientId! },
    { enabled: !!selectedClientId }
  );

  const handleSelectClient = (clientId: number) => {
    setSelectedClientId(clientId);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAF8F4", display: "flex" }}>
      {/* Sidebar - Client List */}
      <div
        style={{
          width: "280px",
          background: "#FFFFFF",
          borderRight: "0.5px solid #E3DED5",
          padding: "2rem 1.5rem",
          overflowY: "auto",
          maxHeight: "100vh",
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.5rem",
            fontWeight: 300,
            color: "#1C1C1A",
            marginBottom: "1.5rem",
          }}
        >
          Clients
        </h2>

        {clientsLoading ? (
          <p style={{ color: "#8A8880", fontSize: "0.9rem" }}>Loading clients...</p>
        ) : clients.length === 0 ? (
          <p style={{ color: "#8A8880", fontSize: "0.9rem" }}>No clients found</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {clients.map((client: Client) => (
              <button
                key={client.id}
                onClick={() => handleSelectClient(client.id)}
                style={{
                  padding: "1rem",
                  background: selectedClientId === client.id ? "#F0EDE6" : "transparent",
                  border: "0.5px solid #E3DED5",
                  borderRadius: "10px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (selectedClientId !== client.id) {
                    (e.target as HTMLButtonElement).style.background = "#F5EFE3";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedClientId !== client.id) {
                    (e.target as HTMLButtonElement).style.background = "transparent";
                  }
                }}
              >
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "#1C1C1A",
                    marginBottom: "0.25rem",
                  }}
                >
                  {client.name || "Unknown"}
                </div>
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.8rem",
                    color: "#8A8880",
                  }}
                >
                  {client.email}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        {!selectedClientId ? (
          <div
            style={{
              textAlign: "center",
              padding: "4rem 2rem",
              color: "#8A8880",
            }}
          >
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem" }}>
              Select a client to manage
            </p>
          </div>
        ) : selectedClient ? (
          <div>
            {/* Client Header */}
            <div style={{ marginBottom: "2rem" }}>
              <h1
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  fontWeight: 300,
                  fontStyle: "italic",
                  color: "#1C1C1A",
                  marginBottom: "0.5rem",
                }}
              >
                Welcome back, {selectedClient.name || "Client"}
              </h1>
              <p style={{ color: "#8A8880", fontSize: "0.9rem" }}>
                Manage relocation details for {selectedClient.email}
              </p>
            </div>

            {/* Client Management Sections */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
              }}
            >
              {/* Priority Actions Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid #E3DED5",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.3rem",
                    fontWeight: 300,
                    color: "#1C1C1A",
                    marginBottom: "1rem",
                  }}
                >
                  Priority Actions
                </h3>
                <p style={{ color: "#8A8880", fontSize: "0.9rem" }}>
                  Create and manage tasks for this client
                </p>
                <button
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    background: "#C9A96E",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Manage Tasks
                </button>
              </div>

              {/* Schools Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid #E3DED5",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.3rem",
                    fontWeight: 300,
                    color: "#1C1C1A",
                    marginBottom: "1rem",
                  }}
                >
                  School Shortlist
                </h3>
                <p style={{ color: "#8A8880", fontSize: "0.9rem" }}>
                  Add and manage school options
                </p>
                <button
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    background: "#C9A96E",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Manage Schools
                </button>
              </div>

              {/* Documents Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid #E3DED5",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.3rem",
                    fontWeight: 300,
                    color: "#1C1C1A",
                    marginBottom: "1rem",
                  }}
                >
                  Documents
                </h3>
                <p style={{ color: "#8A8880", fontSize: "0.9rem" }}>
                  Upload and manage client documents
                </p>
                <button
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    background: "#C9A96E",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Manage Documents
                </button>
              </div>

              {/* Appointments Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid #E3DED5",
                  borderRadius: "12px",
                  padding: "1.5rem",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.3rem",
                    fontWeight: 300,
                    color: "#1C1C1A",
                    marginBottom: "1rem",
                  }}
                >
                  Appointments
                </h3>
                <p style={{ color: "#8A8880", fontSize: "0.9rem" }}>
                  Schedule and manage appointments
                </p>
                <button
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    background: "#C9A96E",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Manage Appointments
                </button>
              </div>

              {/* Messages Card */}
              <div
                style={{
                  background: "#FFFFFF",
                  border: "0.5px solid #E3DED5",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  gridColumn: "1 / -1",
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.3rem",
                    fontWeight: 300,
                    color: "#1C1C1A",
                    marginBottom: "1rem",
                  }}
                >
                  Messages
                </h3>
                <p style={{ color: "#8A8880", fontSize: "0.9rem" }}>
                  Send and manage messages with client
                </p>
                <button
                  style={{
                    marginTop: "1rem",
                    padding: "0.75rem 1.5rem",
                    background: "#C9A96E",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: "20px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "0.9rem",
                  }}
                >
                  Manage Messages
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#8A8880" }}>
            <p>Loading client data...</p>
          </div>
        )}
      </div>
    </div>
  );
}
