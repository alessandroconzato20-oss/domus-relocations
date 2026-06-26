/**
 * DOMUS Relocations — Client Dashboard: Messages
 * Secure messaging between client and DOMUS advisor
 */
import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import ClientDashboardLayout from "@/components/ClientDashboardLayout";

export default function DashboardMessages() {
  const utils = trpc.useUtils();
  const [message, setMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const messagesQuery = trpc.clientDashboard.getMyMessages.useQuery(undefined, {
    refetchInterval: 15000,
  });
  const sendMutation = trpc.clientDashboard.sendMessage.useMutation({
    onSuccess: () => {
      utils.clientDashboard.getMyMessages.invalidate();
      utils.clientDashboard.getUnreadCount.invalidate();
      setMessage("");
    },
  });

  const messages = messagesQuery.data ?? [];

  // Scroll to bottom when messages load or new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMutation.mutate({ content: message.trim() });
  };

  return (
    <ClientDashboardLayout title="Messages">
      <div style={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 200px)",
        minHeight: "400px",
        backgroundColor: "#ffffff",
        border: "1px solid rgba(180,155,110,0.15)",
        borderRadius: "2px",
        overflow: "hidden",
      }}>
        {/* Messages area */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}>
          {messagesQuery.isLoading && (
            <div style={{ color: "#6b6b6b", fontSize: "0.875rem", textAlign: "center" }}>
              Loading messages…
            </div>
          )}

          {!messagesQuery.isLoading && messages.length === 0 && (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: "#1a1a1a", marginBottom: "0.5rem" }}>
                No messages yet
              </div>
              <p style={{ fontSize: "0.8rem", color: "#6b6b6b" }}>
                Send a message to your DOMUS advisor below.
              </p>
            </div>
          )}

          {messages.map((msg) => {
            const isClient = msg.senderRole === "client";
            return (
              <div
                key={msg.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isClient ? "flex-end" : "flex-start",
                }}
              >
                {/* Sender label */}
                <div style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "#9b9b9b",
                  marginBottom: "0.25rem",
                }}>
                  {isClient ? "You" : "DOMUS Advisor"}
                </div>

                {/* Bubble */}
                <div style={{
                  maxWidth: "70%",
                  padding: "0.875rem 1rem",
                  backgroundColor: isClient ? "#1a1a1a" : "rgba(180,155,110,0.08)",
                  borderRadius: "2px",
                  fontSize: "0.875rem",
                  color: isClient ? "#ffffff" : "#1a1a1a",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>

                {/* Timestamp */}
                <div style={{ fontSize: "0.65rem", color: "#9b9b9b", marginTop: "0.25rem" }}>
                  {new Date(msg.createdAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div style={{
          borderTop: "1px solid rgba(180,155,110,0.15)",
          padding: "1rem 1.5rem",
          backgroundColor: "#faf8f5",
        }}>
          <form onSubmit={handleSend} style={{ display: "flex", gap: "0.75rem" }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e as unknown as React.FormEvent);
                }
              }}
              placeholder="Type your message… (Enter to send, Shift+Enter for new line)"
              rows={2}
              style={{
                flex: 1,
                padding: "0.75rem 1rem",
                backgroundColor: "#ffffff",
                border: "1px solid rgba(180,155,110,0.25)",
                borderRadius: "2px",
                fontSize: "0.875rem",
                color: "#1a1a1a",
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#b49b6e")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(180,155,110,0.25)")}
            />
            <button
              type="submit"
              disabled={sendMutation.isPending || !message.trim()}
              style={{
                padding: "0 1.5rem",
                backgroundColor: message.trim() ? "#1a1a1a" : "rgba(0,0,0,0.1)",
                color: "#ffffff",
                border: "none",
                borderRadius: "2px",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: message.trim() && !sendMutation.isPending ? "pointer" : "not-allowed",
                flexShrink: 0,
                alignSelf: "stretch",
              }}
            >
              {sendMutation.isPending ? "…" : "Send"}
            </button>
          </form>
        </div>
      </div>
    </ClientDashboardLayout>
  );
}
