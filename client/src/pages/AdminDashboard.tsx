/*
 * DOMUS Relocations — Admin Dashboard
 * Protected page for viewing quiz responses and contact submissions
 */

import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"quiz" | "contact">("quiz");

  // TODO: Re-enable auth guard after fixing cookie issue

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render content if not authenticated or not admin
  if (!user) {
    return null;
  }

  if (user.role !== "admin") {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--domus-ivory)" }}>
      <AdminDashboardContent activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}

function AdminDashboardContent({
  activeTab,
  setActiveTab,
}: {
  activeTab: "quiz" | "contact";
  setActiveTab: (tab: "quiz" | "contact") => void;
}) {
  const { data: quizResponses, isLoading: quizLoading } =
    trpc.submissions.getQuizResponses.useQuery();
  const { data: contactSubmissions, isLoading: contactLoading } =
    trpc.submissions.getContactSubmissions.useQuery();

  return (
    <div className="container" style={{ paddingTop: "2rem", paddingBottom: "2rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "3rem" }}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "2.5rem",
            color: "var(--domus-charcoal)",
            marginBottom: "0.5rem",
          }}
        >
          Admin Dashboard
        </h1>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.9rem",
            color: "rgba(45, 41, 38, 0.6)",
          }}
        >
          Manage quiz responses and contact inquiries
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid rgba(45, 41, 38, 0.1)" }}>
        <button
          onClick={() => setActiveTab("quiz")}
          style={{
            padding: "1rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "quiz" ? "2px solid var(--domus-gold)" : "none",
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.9rem",
            fontWeight: activeTab === "quiz" ? 600 : 400,
            color: activeTab === "quiz" ? "var(--domus-charcoal)" : "rgba(45, 41, 38, 0.5)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Persona Quiz Responses ({quizResponses?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          style={{
            padding: "1rem 1.5rem",
            background: "none",
            border: "none",
            borderBottom: activeTab === "contact" ? "2px solid var(--domus-gold)" : "none",
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.9rem",
            fontWeight: activeTab === "contact" ? 600 : 400,
            color: activeTab === "contact" ? "var(--domus-charcoal)" : "rgba(45, 41, 38, 0.5)",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
        >
          Contact Inquiries ({contactSubmissions?.length || 0})
        </button>
      </div>

      {/* Content */}
      {activeTab === "quiz" ? (
        <QuizResponsesTable responses={quizResponses || []} loading={quizLoading} />
      ) : (
        <ContactSubmissionsTable submissions={contactSubmissions || []} loading={contactLoading} />
      )}
    </div>
  );
}

interface QuizResponse {
  id: number;
  email: string;
  fullName: string;
  answers: string;
  persona: string;
  createdAt: Date;
}

function QuizResponsesTable({ responses, loading }: { responses: QuizResponse[]; loading: boolean }) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (loading) {
    return <p>Loading quiz responses...</p>;
  }

  if (responses.length === 0) {
    return (
      <div
        style={{
          padding: "2rem",
          background: "rgba(201, 168, 76, 0.04)",
          border: "1px solid rgba(201, 168, 76, 0.2)",
          textAlign: "center",
          color: "rgba(45, 41, 38, 0.5)",
        }}
      >
        No quiz responses yet
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "'Jost', sans-serif",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid rgba(45, 41, 38, 0.1)" }}>
            <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Name
            </th>
            <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Email
            </th>
            <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Persona
            </th>
            <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Date
            </th>
            <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {responses.map((response) => (
            <tr key={response.id} style={{ borderBottom: "1px solid rgba(45, 41, 38, 0.05)" }}>
              <td style={{ padding: "1rem", color: "var(--domus-charcoal)" }}>{response.fullName}</td>
              <td style={{ padding: "1rem", color: "rgba(45, 41, 38, 0.7)" }}>{response.email}</td>
              <td style={{ padding: "1rem", color: "var(--domus-gold)", fontWeight: 600 }}>
                {response.persona}
              </td>
              <td style={{ padding: "1rem", color: "rgba(45, 41, 38, 0.6)" }}>
                {new Date(response.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: "1rem", textAlign: "center" }}>
                <button
                  onClick={() => setExpandedId(expandedId === response.id ? null : response.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "var(--domus-gold)",
                    color: "white",
                    border: "none",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {expandedId === response.id ? "Hide" : "View"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Expanded details */}
      {expandedId !== null && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "rgba(201, 168, 76, 0.04)",
            border: "1px solid rgba(201, 168, 76, 0.2)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "var(--domus-charcoal)",
            }}
          >
            Full Answers
          </h3>
          <pre
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "4px",
              overflow: "auto",
              fontFamily: "monospace",
              fontSize: "0.85rem",
              color: "rgba(45, 41, 38, 0.7)",
            }}
          >
            {JSON.stringify(
              JSON.parse(responses.find((r) => r.id === expandedId)?.answers || "{}"),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

interface ContactSubmission {
  id: number;
  fullName: string;
  email: string;
  message: string;
  createdAt: Date;
}

function ContactSubmissionsTable({
  submissions,
  loading,
}: {
  submissions: ContactSubmission[];
  loading: boolean;
}) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (loading) {
    return <p>Loading contact submissions...</p>;
  }

  if (submissions.length === 0) {
    return (
      <div
        style={{
          padding: "2rem",
          background: "rgba(201, 168, 76, 0.04)",
          border: "1px solid rgba(201, 168, 76, 0.2)",
          textAlign: "center",
          color: "rgba(45, 41, 38, 0.5)",
        }}
      >
        No contact submissions yet
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontFamily: "'Jost', sans-serif",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr style={{ borderBottom: "2px solid rgba(45, 41, 38, 0.1)" }}>
            <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Name
            </th>
            <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Email
            </th>
            <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Message Preview
            </th>
            <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Date
            </th>
            <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600, color: "var(--domus-charcoal)" }}>
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} style={{ borderBottom: "1px solid rgba(45, 41, 38, 0.05)" }}>
              <td style={{ padding: "1rem", color: "var(--domus-charcoal)" }}>{submission.fullName}</td>
              <td style={{ padding: "1rem", color: "rgba(45, 41, 38, 0.7)" }}>
                <a
                  href={`mailto:${submission.email}`}
                  style={{ color: "var(--domus-gold)", textDecoration: "none" }}
                >
                  {submission.email}
                </a>
              </td>
              <td style={{ padding: "1rem", color: "rgba(45, 41, 38, 0.6)" }}>
                {submission.message.substring(0, 50)}
                {submission.message.length > 50 ? "..." : ""}
              </td>
              <td style={{ padding: "1rem", color: "rgba(45, 41, 38, 0.6)" }}>
                {new Date(submission.createdAt).toLocaleDateString()}
              </td>
              <td style={{ padding: "1rem", textAlign: "center" }}>
                <button
                  onClick={() => setExpandedId(expandedId === submission.id ? null : submission.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "var(--domus-gold)",
                    color: "white",
                    border: "none",
                    fontFamily: "'Jost', sans-serif",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                    transition: "opacity 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {expandedId === submission.id ? "Hide" : "View"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Expanded details */}
      {expandedId !== null && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "rgba(201, 168, 76, 0.04)",
            border: "1px solid rgba(201, 168, 76, 0.2)",
          }}
        >
          <h3
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 600,
              marginBottom: "1rem",
              color: "var(--domus-charcoal)",
            }}
          >
            Full Message
          </h3>
          <p
            style={{
              background: "white",
              padding: "1rem",
              borderRadius: "4px",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              color: "rgba(45, 41, 38, 0.7)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {submissions.find((s) => s.id === expandedId)?.message}
          </p>
        </div>
      )}
    </div>
  );
}
