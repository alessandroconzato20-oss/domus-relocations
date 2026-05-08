/*
 * DOMUS Relocations — Contact Section & Footer
 * Design: Dark charcoal background, gold accents, editorial layout
 * Simple, elegant CTA with contact information
 */

import { useEffect, useRef, useState } from "react";

const LOGO_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/DomusRelocationsLogo_506fe4bc.png";

function useScrollReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

interface ContactSectionProps {
  onQuizOpen: () => void;
}

export default function ContactSection({ onQuizOpen }: ContactSectionProps) {
  const headerRef = useScrollReveal();
  const formRef = useScrollReveal(0.1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      {/* Contact Section */}
      <section
        id="contact"
        style={{
          background: "var(--domus-charcoal)",
          paddingTop: "8rem",
          paddingBottom: "8rem",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "5rem",
            }}
            className="contact-grid"
          >
            {/* Left: CTA text */}
            <div ref={headerRef} className="fade-up">
              <span className="section-label" style={{ color: "var(--domus-gold)", display: "block", marginBottom: "1rem" }}>
                Begin Your Journey
              </span>
              <span className="gold-rule" style={{ display: "block", marginBottom: "2rem" }} />

              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(2.25rem, 3.5vw, 3.5rem)",
                  lineHeight: 1.1,
                  color: "#F5F0E8",
                  marginBottom: "1.75rem",
                }}
              >
                Your life in Milan<br />
                <em style={{ color: "var(--domus-gold)" }}>starts here.</em>
              </h2>

              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.95rem",
                  lineHeight: 1.85,
                  color: "rgba(245, 240, 232, 0.6)",
                  maxWidth: "420px",
                  marginBottom: "2.5rem",
                }}
              >
                Every engagement begins with a private, no-obligation consultation. We listen first, then we plan. Reach out to begin a conversation about your move to Milan.
              </p>

              <button onClick={onQuizOpen} className="btn-luxury" style={{ borderColor: "rgba(201, 168, 76, 0.5)", color: "rgba(245, 240, 232, 0.8)", marginBottom: "3rem" }}>
                Take the Profile Quiz
              </button>

              {/* Contact details */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div>
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(245, 240, 232, 0.3)",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Email
                  </span>
                  <a
                    href="mailto:milano@domusrelocations.com"
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.9rem",
                      color: "rgba(245, 240, 232, 0.7)",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                  >
                    milano@domusrelocations.com
                  </a>
                </div>
                <div>
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "rgba(245, 240, 232, 0.3)",
                      display: "block",
                      marginBottom: "0.25rem",
                    }}
                  >
                    Based in
                  </span>
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.9rem",
                      color: "rgba(245, 240, 232, 0.7)",
                    }}
                  >
                    Milano, Italy
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Contact form */}
            <div ref={formRef} className="fade-up">
              {!submitted ? (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 500,
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(245, 240, 232, 0.4)",
                        display: "block",
                        marginBottom: "0.6rem",
                      }}
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Full name"
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem",
                        background: "transparent",
                        border: "1px solid rgba(245, 240, 232, 0.12)",
                        color: "#F5F0E8",
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 300,
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(201, 168, 76, 0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(245, 240, 232, 0.12)")}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 500,
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(245, 240, 232, 0.4)",
                        display: "block",
                        marginBottom: "0.6rem",
                      }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem",
                        background: "transparent",
                        border: "1px solid rgba(245, 240, 232, 0.12)",
                        color: "#F5F0E8",
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 300,
                        fontSize: "0.9rem",
                        outline: "none",
                        transition: "border-color 0.3s ease",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(201, 168, 76, 0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(245, 240, 232, 0.12)")}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 500,
                        fontSize: "0.65rem",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(245, 240, 232, 0.4)",
                        display: "block",
                        marginBottom: "0.6rem",
                      }}
                    >
                      Tell Us About Your Move
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="When are you moving? What are your priorities? Any questions?"
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem",
                        background: "transparent",
                        border: "1px solid rgba(245, 240, 232, 0.12)",
                        color: "#F5F0E8",
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 300,
                        fontSize: "0.9rem",
                        outline: "none",
                        resize: "vertical",
                        transition: "border-color 0.3s ease",
                        boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "rgba(201, 168, 76, 0.5)")}
                      onBlur={(e) => (e.target.style.borderColor = "rgba(245, 240, 232, 0.12)")}
                    />
                  </div>

                  <button type="submit" className="btn-luxury-dark" style={{ alignSelf: "flex-start" }}>
                    Send Enquiry
                  </button>

                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.75rem",
                      color: "rgba(245, 240, 232, 0.25)",
                      lineHeight: 1.6,
                    }}
                  >
                    All enquiries are handled with absolute discretion. We respond within 24 hours.
                  </p>
                </form>
              ) : (
                <div
                  style={{
                    padding: "3rem",
                    border: "1px solid rgba(201, 168, 76, 0.2)",
                    background: "rgba(201, 168, 76, 0.04)",
                    animation: "fadeInUp 0.6s ease forwards",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 500,
                      fontSize: "0.65rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--domus-gold)",
                      display: "block",
                      marginBottom: "1rem",
                    }}
                  >
                    Message Received
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                      fontStyle: "italic",
                      fontSize: "1.75rem",
                      color: "#F5F0E8",
                      marginBottom: "1rem",
                    }}
                  >
                    Thank you, {formData.name}.
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.9rem",
                      color: "rgba(245, 240, 232, 0.6)",
                      lineHeight: 1.8,
                    }}
                  >
                    We have received your enquiry and will be in touch within 24 hours. We look forward to beginning this journey with you.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "var(--domus-dark)",
          borderTop: "1px solid rgba(245, 240, 232, 0.05)",
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
            }}
            className="footer-inner"
          >
            {/* Logo */}
            <img
              src={LOGO_URL}
              alt="DOMUS Relocations"
              style={{ height: "64px", width: "auto", opacity: 0.85 }}
            />

            {/* Tagline */}
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 400,
                fontSize: "0.65rem",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "rgba(245, 240, 232, 0.25)",
              }}
            >
              Your Trusted Entry to Milan
            </span>

            {/* Divider */}
            <div style={{ width: "40px", height: "1px", background: "rgba(201, 168, 76, 0.3)" }} />

            {/* Links */}
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
              {["About", "Services", "Milan", "Contact"].map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    const el = document.getElementById(link.toLowerCase());
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "'Jost', sans-serif",
                    fontWeight: 400,
                    fontSize: "0.65rem",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(245, 240, 232, 0.3)",
                    cursor: "pointer",
                    transition: "color 0.3s ease",
                  }}
                  onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "rgba(201, 168, 76, 0.7)")}
                  onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "rgba(245, 240, 232, 0.3)")}
                >
                  {link}
                </button>
              ))}
            </div>

            {/* Copyright */}
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: "0.7rem",
                color: "rgba(245, 240, 232, 0.15)",
                textAlign: "center",
                margin: 0,
              }}
            >
              © {new Date().getFullYear()} DOMUS Relocations. All rights reserved. Milano, Italy.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
