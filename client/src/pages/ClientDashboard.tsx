/*
 * DOMUS Relocations — Client Dashboard
 * Design: Milanese Atelier — light theme
 */

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { exportQuizToPDF } from "@/lib/pdfExport";

export default function ClientDashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, logout } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
      return;
    }

    if (user && user.email) {
      fetchUserQuizzes();
    }
  }, [user, loading]);

  const fetchUserQuizzes = async () => {
    if (!user?.email) return;

    setIsLoading(true);
    try {
      const utils = trpc.useUtils();
      const result = await utils.submissions.getUserQuizzes.fetch({ email: user.email });
      setQuizzes(result);
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      toast.error("Failed to load your quiz responses");
    } finally {
      setIsLoading(false);
    }
  };

  const parseAnswers = (answersJson: string) => {
    try {
      return JSON.parse(answersJson);
    } catch {
      return {};
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--domus-ivory)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ fontFamily: "'Jost', sans-serif", color: "var(--domus-charcoal)" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--domus-ivory)",
        padding: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          marginBottom: "3rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <button
            onClick={() => setLocation("/")}
            style={{
              background: "none",
              border: "none",
              color: "var(--domus-gold)",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: "2rem",
              padding: 0,
            }}
          >
            ← Back to Home
          </button>

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
            Your Account
          </h1>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.95rem",
              color: "rgba(45, 41, 38, 0.7)",
              marginBottom: "1rem",
            }}
          >
            {user?.email}
          </p>
        </div>

        <button
          onClick={handleLogout}
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
          Logout
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {isLoading ? (
          <div
            style={{
              background: "white",
              padding: "3rem 2rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(45, 41, 38, 0.08)",
            }}
          >
            <p style={{ fontFamily: "'Jost', sans-serif", color: "var(--domus-charcoal)" }}>Loading your responses...</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "3rem 2rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(45, 41, 38, 0.08)",
            }}
          >
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.95rem",
                color: "rgba(45, 41, 38, 0.6)",
              }}
            >
              You haven't completed any quizzes yet
            </p>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.85rem",
                color: "rgba(45, 41, 38, 0.5)",
                marginTop: "0.5rem",
              }}
            >
              Complete the "Begin Your Private Relocation" quiz to see your personalized results here.
            </p>
            <button
              onClick={() => setLocation("/")}
              style={{
                marginTop: "1.5rem",
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
              Take the Quiz
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <h2
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--domus-charcoal)",
              }}
            >
              Your Quiz Responses ({quizzes.length})
            </h2>

            {quizzes.map((quiz, index) => {
              const isExpanded = expandedId === quiz.id;
              const answers = parseAnswers(quiz.answers);
              const createdDate = new Date(quiz.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              return (
                <div
                  key={quiz.id}
                  style={{
                    background: "white",
                    border: "1px solid rgba(45, 41, 38, 0.1)",
                    boxShadow: "0 2px 8px rgba(45, 41, 38, 0.08)",
                    overflow: "hidden",
                  }}
                >
                  {/* Card Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : quiz.id)}
                    style={{
                      width: "100%",
                      padding: "1.5rem 2rem",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(45, 41, 38, 0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <div>
                      <h3
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontSize: "1rem",
                          fontWeight: 600,
                          color: "var(--domus-charcoal)",
                          margin: 0,
                          marginBottom: "0.5rem",
                        }}
                      >
                        Quiz Response #{index + 1}
                      </h3>
                      <div
                        style={{
                          display: "flex",
                          gap: "2rem",
                          fontSize: "0.85rem",
                          color: "rgba(45, 41, 38, 0.6)",
                        }}
                      >
                        <span>
                          <strong>Persona:</strong> {quiz.persona}
                        </span>
                        <span>
                          <strong>Date:</strong> {createdDate}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "1.5rem",
                        color: "var(--domus-gold)",
                        transition: "transform 0.3s ease",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      ▼
                    </div>
                  </button>

                  {/* Card Content */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: "2rem",
                        borderTop: "1px solid rgba(45, 41, 38, 0.1)",
                        background: "rgba(45, 41, 38, 0.01)",
                      }}
                    >
                      <div
                        style={{
                          marginBottom: "1.5rem",
                        }}
                      >
                        <h4
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: "var(--domus-charcoal)",
                            marginBottom: "1rem",
                          }}
                        >
                          Your Answers
                        </h4>
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "1rem",
                          }}
                        >
                          {Object.entries(answers).map(([question, answer]) => (
                            <div
                              key={question}
                              style={{
                                padding: "1rem",
                                background: "white",
                                border: "1px solid rgba(45, 41, 38, 0.1)",
                              }}
                            >
                              <p
                                style={{
                                  fontFamily: "'Jost', sans-serif",
                                  fontSize: "0.8rem",
                                  fontWeight: 600,
                                  color: "rgba(45, 41, 38, 0.6)",
                                  margin: 0,
                                  marginBottom: "0.5rem",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.5px",
                                }}
                              >
                                {question}
                              </p>
                              <p
                                style={{
                                  fontFamily: "'Jost', sans-serif",
                                  fontSize: "0.9rem",
                                  color: "var(--domus-charcoal)",
                                  margin: 0,
                                }}
                              >
                                {String(answer)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Persona Description */}
                      <div
                        style={{
                          padding: "1rem",
                          background: "rgba(214, 175, 98, 0.1)",
                          border: "1px solid rgba(214, 175, 98, 0.3)",
                          marginBottom: "1.5rem",
                        }}
                      >
                        <p
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            color: "var(--domus-gold)",
                            margin: 0,
                            marginBottom: "0.5rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          Your Persona
                        </p>
                        <p
                          style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: "1.1rem",
                            fontWeight: 400,
                            color: "var(--domus-charcoal)",
                            margin: 0,
                          }}
                        >
                          {quiz.persona}
                        </p>
                      </div>

                      {/* Export Button */}
                      <button
                        onClick={async () => {
                          try {
                            await exportQuizToPDF(
                              index + 1,
                              quiz.persona,
                              answers,
                              user?.email || "unknown",
                              createdDate
                            );
                            toast.success("PDF downloaded successfully!");
                          } catch (error) {
                            console.error("Export error:", error);
                            toast.error("Failed to export PDF");
                          }
                        }}
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
                        📥 Download as PDF
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
