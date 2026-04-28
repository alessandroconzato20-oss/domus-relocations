/*
 * DOMUS Relocations — Home Page
 * Design: Milanese Atelier — Restrained Opulence
 * Sections: Hero → About → Services → Quiz CTA → Milan → Contact/Footer
 * Quiz: Full-screen modal overlay triggered from nav and CTAs
 */

import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import CoreValuesSection from "@/components/CoreValuesSection";
import HeroSection from "@/components/HeroSection";
import MilanSection from "@/components/MilanSection";
import Navigation from "@/components/Navigation";
import PersonaQuiz from "@/components/PersonaQuiz";
import ServicesSection from "@/components/ServicesSection";
import TestimonialSection from "@/components/TestimonialSection";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <div style={{ background: "var(--domus-ivory)", minHeight: "100vh" }}>
      {/* Fixed navigation */}
      <Navigation onQuizOpen={() => setQuizOpen(true)} />

      {/* Page sections */}
      <main>
        <HeroSection />
        <CoreValuesSection />
        <AboutSection />
        <ServicesSection />
        <QuizCTABanner onQuizOpen={() => setQuizOpen(true)} />
        <MilanSection />
        <TestimonialSection />
        <ContactSection onQuizOpen={() => setQuizOpen(true)} />
      </main>

      {/* Full-screen persona quiz */}
      <PersonaQuiz isOpen={quizOpen} onClose={() => setQuizOpen(false)} />
    </div>
  );
}

/* Quiz CTA interlude banner between Services and Milan */
function QuizCTABanner({ onQuizOpen }: { onQuizOpen: () => void }) {
  return (
    <div
      style={{
        background: "var(--domus-ivory)",
        padding: "7rem 0",
        borderTop: "1px solid rgba(201, 168, 76, 0.15)",
        borderBottom: "1px solid rgba(201, 168, 76, 0.15)",
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "1.5rem",
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
            }}
          >
            Discover Your Profile
          </span>

          {/* Gold rule */}
          <div style={{ width: "40px", height: "1px", background: "var(--domus-gold)" }} />

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(2rem, 3.5vw, 3.25rem)",
              lineHeight: 1.15,
              color: "var(--domus-charcoal)",
              maxWidth: "560px",
              margin: "0 auto",
            }}
          >
            Not sure where to begin?<br />
            <em style={{ color: "var(--domus-gold)" }}>Let us find out together.</em>
          </h2>

          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "0.95rem",
              lineHeight: 1.85,
              color: "var(--domus-grey)",
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Answer six questions and we will build your personalised DOMUS profile — revealing which services are most relevant to your move to Milan.
          </p>

          <button
            onClick={onQuizOpen}
            className="btn-luxury"
            style={{ marginTop: "0.75rem" }}
          >
            Begin the Profile Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
