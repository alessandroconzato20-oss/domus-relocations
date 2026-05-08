/*
 * DOMUS Relocations — Persona Quiz
 * Design: Full-screen modal overlay, dark library background
 * One question at a time, horizontal slide transitions
 * Builds a persona profile and shows a tailored recommendation
 */

import { useEffect, useRef, useState } from "react";

const QUIZ_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-quiz-bg-Z5cU3DfFa2EAhLAnDd5BTY.webp";

interface QuizOption {
  id: string;
  label: string;
  description?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
  multiSelect?: boolean;
}

const questions: QuizQuestion[] = [
  {
    id: "timeline",
    question: "When are you planning to move to Milan?",
    subtitle: "This helps us understand the urgency of your needs.",
    options: [
      { id: "immediate", label: "Within 3 months", description: "Immediate planning required" },
      { id: "soon", label: "3–6 months", description: "Time to prepare thoughtfully" },
      { id: "planning", label: "6–12 months", description: "Strategic planning phase" },
      { id: "exploring", label: "Still exploring", description: "Early-stage consideration" },
    ],
  },
  {
    id: "family",
    question: "Who is relocating with you?",
    subtitle: "Understanding your family structure shapes every recommendation we make.",
    options: [
      { id: "solo", label: "Just myself", description: "Individual relocation" },
      { id: "couple", label: "Myself and a partner", description: "Two adults" },
      { id: "family_young", label: "Family with young children", description: "Children under 10" },
      { id: "family_teen", label: "Family with teenagers", description: "Children aged 10–18" },
    ],
  },
  {
    id: "priority",
    question: "What matters most to you in this move?",
    subtitle: "Select all that apply.",
    multiSelect: true,
    options: [
      { id: "housing", label: "Finding the right home", description: "Neighbourhood and property" },
      { id: "schools", label: "School selection", description: "International education" },
      { id: "community", label: "Building a social life", description: "Integration and connections" },
      { id: "professionals", label: "Trusted professionals", description: "Doctors, lawyers, services" },
    ],
  },
  {
    id: "neighbourhood",
    question: "What kind of environment are you drawn to?",
    subtitle: "Milan has many distinct characters; we want to find yours.",
    options: [
      { id: "central", label: "Central & cosmopolitan", description: "Brera, Porta Nuova, Duomo" },
      { id: "residential", label: "Elegant & residential", description: "Porta Venezia, Navigli" },
      { id: "quiet", label: "Quiet & family-oriented", description: "Parioli-style neighbourhoods" },
      { id: "open", label: "Open to guidance", description: "I trust your recommendation" },
    ],
  },
  {
    id: "experience",
    question: "How would you describe your relocation experience?",
    subtitle: "This helps us calibrate the level of support you need.",
    options: [
      { id: "first", label: "This is my first international move", description: "New to global relocation" },
      { id: "some", label: "I have moved once or twice before", description: "Some experience" },
      { id: "experienced", label: "I am an experienced expat", description: "Multiple international moves" },
      { id: "returning", label: "I am returning to Italy", description: "Familiar with the country" },
    ],
  },
  {
    id: "contact",
    question: "How would you prefer to begin?",
    subtitle: "We will reach out to arrange a private, no-obligation consultation.",
    options: [
      { id: "call", label: "A private phone call", description: "Speak directly with our team" },
      { id: "email", label: "An introductory email", description: "Written correspondence first" },
      { id: "meeting", label: "An in-person meeting in Milan", description: "Meet us in the city" },
      { id: "video", label: "A video consultation", description: "Wherever you are in the world" },
    ],
  },
];

const personaMap: Record<string, { title: string; description: string; services: string[] }> = {
  family: {
    title: "The Discerning Family",
    description:
      "Your priority is a seamless, complete transition for your entire family: from finding the perfect home in the right neighbourhood to ensuring your children thrive in a world-class school. DOMUS is built for families like yours.",
    services: ["Private Relocation Advisory", "School Advisory", "Milan Integration"],
  },
  solo: {
    title: "The Global Professional",
    description:
      "You move with purpose and efficiency. You need the right address, the right network, and the right professionals around you from day one. Our advisory is calibrated to your pace.",
    services: ["Private Relocation Advisory", "Trusted Network Access", "Milan Integration"],
  },
  community: {
    title: "The Social Architect",
    description:
      "For you, a city is only as good as the life you build within it. You want to be introduced to the right communities, the right clubs, and the right people, and we know exactly where to take you.",
    services: ["Milan Integration", "Trusted Network Access", "Private Relocation Advisory"],
  },
};

interface PersonaQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PersonaQuiz({ isOpen, onClose }: PersonaQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [animating, setAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [persona, setPersona] = useState<typeof personaMap[string] | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentStep(0);
      setAnswers({});
      setCompleted(false);
      setPersona(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen) return null;

  const question = questions[currentStep];
  const currentAnswer = answers[question.id];
  const isAnswered = question.multiSelect
    ? Array.isArray(currentAnswer) && currentAnswer.length > 0
    : !!currentAnswer;

  const handleSelect = (optionId: string) => {
    if (question.multiSelect) {
      const current = (answers[question.id] as string[]) || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: optionId });
    }
  };

  const isOptionSelected = (optionId: string) => {
    if (question.multiSelect) {
      return Array.isArray(currentAnswer) && currentAnswer.includes(optionId);
    }
    return currentAnswer === optionId;
  };

  const goNext = () => {
    if (!isAnswered || animating) return;
    if (currentStep === questions.length - 1) {
      // Determine persona
      const familyAnswer = answers["family"] as string;
      const priorityAnswer = answers["priority"] as string[];
      let p = personaMap.solo;
      if (familyAnswer === "family_young" || familyAnswer === "family_teen") {
        p = personaMap.family;
      } else if (priorityAnswer?.includes("community")) {
        p = personaMap.community;
      }
      setPersona(p);
      setCompleted(true);
      return;
    }
    setDirection("forward");
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s + 1);
      setAnimating(false);
    }, 300);
  };

  const goBack = () => {
    if (currentStep === 0 || animating) return;
    setDirection("back");
    setAnimating(true);
    setTimeout(() => {
      setCurrentStep((s) => s - 1);
      setAnimating(false);
    }, 300);
  };

  const progress = ((currentStep) / questions.length) * 100;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        alignItems: "stretch",
      }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${QUIZ_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(10, 8, 6, 0.88)",
        }}
      />

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "2rem",
          right: "2rem",
          background: "none",
          border: "1px solid rgba(245, 240, 232, 0.2)",
          color: "rgba(245, 240, 232, 0.7)",
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          fontSize: "1.25rem",
          zIndex: 10,
          transition: "all 0.3s ease",
        }}
        aria-label="Close quiz"
      >
        ×
      </button>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "4rem 1.5rem",
          overflowY: "auto",
        }}
      >
        {!completed ? (
          <div style={{ width: "100%", maxWidth: "680px" }}>
            {/* Progress */}
            <div style={{ marginBottom: "3rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.65rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--domus-gold)",
                  }}
                >
                  Your Profile
                </span>
                <span
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.75rem",
                    color: "rgba(245, 240, 232, 0.4)",
                  }}
                >
                  {currentStep + 1} / {questions.length}
                </span>
              </div>
              <div style={{ height: "1px", background: "rgba(245, 240, 232, 0.1)", position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    height: "100%",
                    background: "var(--domus-gold)",
                    width: `${progress}%`,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div
              style={{
                opacity: animating ? 0 : 1,
                transform: animating
                  ? direction === "forward" ? "translateX(-30px)" : "translateX(30px)"
                  : "translateX(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                  lineHeight: 1.2,
                  color: "#F5F0E8",
                  marginBottom: "0.75rem",
                }}
              >
                {question.question}
              </h2>
              {question.subtitle && (
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.875rem",
                    color: "rgba(245, 240, 232, 0.5)",
                    marginBottom: "2.5rem",
                    lineHeight: 1.6,
                  }}
                >
                  {question.subtitle}
                </p>
              )}

              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "2.5rem" }}>
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                      padding: "1.25rem 1.5rem",
                      border: isOptionSelected(option.id)
                        ? "1px solid var(--domus-gold)"
                        : "1px solid rgba(245, 240, 232, 0.12)",
                      background: isOptionSelected(option.id)
                        ? "rgba(201, 168, 76, 0.08)"
                        : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      transition: "all 0.25s ease",
                    }}
                  >
                    {/* Checkbox/radio indicator */}
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        border: isOptionSelected(option.id)
                          ? "1px solid var(--domus-gold)"
                          : "1px solid rgba(245, 240, 232, 0.3)",
                        background: isOptionSelected(option.id) ? "var(--domus-gold)" : "transparent",
                        flexShrink: 0,
                        marginTop: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.25s ease",
                        borderRadius: question.multiSelect ? "2px" : "50%",
                      }}
                    >
                      {isOptionSelected(option.id) && (
                        <span style={{ color: "var(--domus-charcoal)", fontSize: "0.65rem", fontWeight: 700 }}>✓</span>
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Jost', sans-serif",
                          fontWeight: 400,
                          fontSize: "0.95rem",
                          color: isOptionSelected(option.id) ? "#F5F0E8" : "rgba(245, 240, 232, 0.75)",
                          marginBottom: option.description ? "0.25rem" : 0,
                          transition: "color 0.25s ease",
                        }}
                      >
                        {option.label}
                      </div>
                      {option.description && (
                        <div
                          style={{
                            fontFamily: "'Jost', sans-serif",
                            fontWeight: 300,
                            fontSize: "0.75rem",
                            color: "rgba(245, 240, 232, 0.35)",
                            letterSpacing: "0.05em",
                          }}
                        >
                          {option.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <button
                  onClick={goBack}
                  disabled={currentStep === 0}
                  style={{
                    background: "none",
                    border: "none",
                    color: currentStep === 0 ? "rgba(245, 240, 232, 0.2)" : "rgba(245, 240, 232, 0.5)",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.75rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    cursor: currentStep === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "color 0.3s ease",
                  }}
                >
                  ← Back
                </button>

                <button
                  onClick={goNext}
                  disabled={!isAnswered}
                  className={isAnswered ? "btn-luxury-dark" : ""}
                  style={
                    !isAnswered
                      ? {
                          padding: "0.875rem 2.5rem",
                          background: "rgba(245, 240, 232, 0.05)",
                          border: "1px solid rgba(245, 240, 232, 0.1)",
                          color: "rgba(245, 240, 232, 0.2)",
                          fontFamily: "'Jost', sans-serif",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          cursor: "not-allowed",
                        }
                      : {}
                  }
                >
                  {currentStep === questions.length - 1 ? "Reveal My Profile" : "Continue →"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div
            style={{
              width: "100%",
              maxWidth: "680px",
              opacity: 1,
              animation: "fadeInUp 0.7s ease forwards",
            }}
          >
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 500,
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--domus-gold)",
                display: "block",
                marginBottom: "1rem",
              }}
            >
              Your DOMUS Profile
            </span>
            <div style={{ width: "40px", height: "1px", background: "var(--domus-gold)", marginBottom: "2rem" }} />

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.15,
                color: "#F5F0E8",
                marginBottom: "1.5rem",
              }}
            >
              {persona?.title}
            </h2>

            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: "1rem",
                lineHeight: 1.85,
                color: "rgba(245, 240, 232, 0.7)",
                marginBottom: "2.5rem",
              }}
            >
              {persona?.description}
            </p>

            {/* Recommended services */}
            <div style={{ marginBottom: "3rem" }}>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(245, 240, 232, 0.4)",
                  display: "block",
                  marginBottom: "1.25rem",
                }}
              >
                Recommended for you
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {persona?.services.map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "1rem 1.25rem",
                      border: "1px solid rgba(201, 168, 76, 0.2)",
                      background: "rgba(201, 168, 76, 0.04)",
                    }}
                  >
                    <span style={{ color: "var(--domus-gold)", fontSize: "0.75rem" }}>—</span>
                    <span
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 400,
                        fontSize: "0.9rem",
                        color: "rgba(245, 240, 232, 0.8)",
                      }}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    const el = document.getElementById("contact");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }, 300);
                }}
                className="btn-luxury-dark"
              >
                Request a Private Consultation
              </button>
              <button
                onClick={onClose}
                className="btn-luxury"
                style={{ borderColor: "rgba(245, 240, 232, 0.3)", color: "rgba(245, 240, 232, 0.7)" }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
