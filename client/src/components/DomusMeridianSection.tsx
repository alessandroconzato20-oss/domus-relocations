/*
 * DOMUS Meridian Section
 * Dedicated homepage section for the B2B corporate relocation platform.
 * Positioned directly below DomusCompassSection.
 * Design: Ivory background (contrasts with dark Compass section above).
 */
import { useEffect, useRef } from "react";

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

const meridianPoints = [
  {
    icon: "◈",
    label: "Cost Intelligence",
    text: "Real-time relocation cost estimates per city, neighbourhood, and family profile. Built on data your team controls and updates directly.",
  },
  {
    icon: "◈",
    label: "Assignment Tracking",
    text: "A private dashboard for every active relocation. Status, milestones, and advisor notes in one place, with full privacy controls.",
  },
  {
    icon: "◈",
    label: "Access Code Management",
    text: "Generate and distribute secure access codes to HR teams and assignees. Each code unlocks a tailored onboarding experience.",
  },
  {
    icon: "◈",
    label: "Direct DOMUS Advisory",
    text: "Every corporate account has a dedicated DOMUS contact for complex cases, escalations, and bespoke family relocation needs.",
  },
];

export default function DomusMeridianSection() {
  const labelRef = useScrollReveal();
  const headRef = useScrollReveal(0.1);
  const bodyRef = useScrollReveal(0.1);
  const gridRef = useScrollReveal(0.1);
  const ctaRef = useScrollReveal(0.1);

  return (
    <section
      id="meridian"
      style={{
        background: "var(--domus-ivory)",
        padding: "clamp(5rem, 10vw, 9rem) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background ornament */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "-8rem",
          top: "50%",
          transform: "translateY(-50%)",
          width: "clamp(300px, 45vw, 600px)",
          height: "clamp(300px, 45vw, 600px)",
          borderRadius: "50%",
          border: "1px solid rgba(201,168,76,0.06)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
        }}
      >
        {/* Label */}
        <div ref={labelRef} className="fade-up" style={{ marginBottom: "2rem" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "'Jost', sans-serif",
              fontWeight: 500,
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--domus-gold)",
              borderBottom: "1px solid var(--domus-gold)",
              paddingBottom: "0.4rem",
            }}
          >
            Corporate Relocation
          </span>
        </div>

        {/* Headline + intro */}
        <div
          ref={headRef}
          className="fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(2rem, 5vw, 6rem)",
            marginBottom: "clamp(3rem, 6vw, 5rem)",
            alignItems: "start",
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                fontWeight: 300,
                fontStyle: "italic",
                lineHeight: 1.1,
                color: "var(--domus-charcoal)",
                margin: 0,
              }}
            >
              Introducing DOMUS Meridian.
            </h2>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 400,
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "var(--domus-gold)",
                marginTop: "1.25rem",
                marginBottom: 0,
              }}
            >
              The corporate relocation platform for HR and global mobility teams.
            </p>
          </div>
          <div ref={bodyRef} className="fade-up">
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: "1rem",
                lineHeight: 1.9,
                color: "#4A4540",
                marginBottom: "1.5rem",
              }}
            >
              DOMUS Meridian is a dedicated B2B platform built for HR directors and global mobility teams
              managing employee relocations to Italy. It brings cost transparency, assignment visibility,
              and direct access to DOMUS advisory into a single, discreet interface.
            </p>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 300,
                fontSize: "1rem",
                lineHeight: 1.9,
                color: "#4A4540",
              }}
            >
              Where DOMUS Compass serves the individual, DOMUS Meridian serves the organisation.
              Both are built on the same standard of precision and discretion.
            </p>
          </div>
        </div>

        {/* Four pillars */}
        <div
          ref={gridRef}
          className="fade-up"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.5rem",
            marginBottom: "4rem",
          }}
        >
          {meridianPoints.map((point, i) => (
            <div
              key={i}
              style={{
                padding: "2rem",
                border: "1px solid rgba(201,168,76,0.18)",
                background: "rgba(201,168,76,0.02)",
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.45)";
                (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.06)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.18)";
                (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.02)";
              }}
            >
              <span
                style={{
                  display: "block",
                  color: "var(--domus-gold)",
                  fontSize: "1.25rem",
                  marginBottom: "1rem",
                  opacity: 0.8,
                }}
              >
                {point.icon}
              </span>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.7rem",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--domus-gold)",
                  marginBottom: "0.75rem",
                }}
              >
                {point.label}
              </p>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 300,
                  fontSize: "0.875rem",
                  lineHeight: 1.75,
                  color: "#5A5550",
                }}
              >
                {point.text}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div ref={ctaRef} className="fade-up" style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
          <a
            href="/corporate"
            style={{
              padding: "1.1rem 2.5rem",
              background: "transparent",
              border: "1px solid var(--domus-gold)",
              color: "var(--domus-charcoal)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "0.5px",
              textDecoration: "none",
              display: "inline-block",
              borderRadius: "2px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--domus-gold)";
              (e.currentTarget as HTMLElement).style.color = "var(--domus-charcoal)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--domus-charcoal)";
            }}
          >
            Explore DOMUS Meridian
          </a>
          <a
            href="mailto:milano@domusrelocations.com"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "0.8rem",
              color: "#8A8480",
              letterSpacing: "0.05em",
              textDecoration: "none",
              borderBottom: "1px solid rgba(138,132,128,0.3)",
              paddingBottom: "1px",
              transition: "color 0.2s ease",
            }}
          >
            Contact us about corporate programmes
          </a>
        </div>
      </div>
    </section>
  );
}
