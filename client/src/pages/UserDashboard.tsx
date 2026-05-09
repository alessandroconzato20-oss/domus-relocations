/*
 * DOMUS Relocations — User Account Dashboard
 * Design: Milanese Atelier — light theme
 */

import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function UserDashboard() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);
    try {
      const utils = trpc.useUtils();
      const result = await utils.submissions.getUserQuizzes.fetch({ email });
      setQuizzes(result);
      setHasSearched(true);

      if (result.length === 0) {
        toast.info("No quiz responses found for this email");
      } else {
        toast.success(`Found ${result.length} quiz response(s)`);
      }
    } catch (error) {
      console.error("Failed to fetch quizzes:", error);
      toast.error("Failed to fetch your quiz responses");
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
        }}
      >
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
            marginBottom: "1rem",
          }}
        >
          Your Account
        </h1>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "0.95rem",
            color: "rgba(45, 41, 38, 0.7)",
            maxWidth: "600px",
          }}
        >
          View your personalized quiz responses and relocation profile
        </p>
      </div>

      {/* Search Form */}
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          marginBottom: "3rem",
          background: "white",
          padding: "2rem",
          boxShadow: "0 2px 8px rgba(45, 41, 38, 0.08)",
        }}
      >
        <h2
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--domus-charcoal)",
            marginBottom: "1.5rem",
          }}
        >
          Find Your Quiz Responses
        </h2>

        <form onSubmit={handleSearch} style={{ display: "flex", gap: "0.5rem" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            style={{
              flex: 1,
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
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => !isLoading && (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => !isLoading && (e.currentTarget.style.opacity = "1")}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>
      </div>

      {/* Results */}
      {hasSearched && (
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          {quizzes.length === 0 ? (
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
                No quiz responses found for <strong>{email}</strong>
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
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
