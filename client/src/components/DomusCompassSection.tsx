/*
 * DOMUS Compass Section
 * Standalone feature section highlighting the AI Pre-Moving Intelligence Brief
 * Positioned between CoreValues and About on the homepage
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

const compassPoints = [
  {
    icon: "◈",
    label: "Family Profile Analysis",
    text: "Your lifestyle, priorities, children's ages, career situation, and cultural background are read and cross-referenced to build a precise relocation profile.",
  },
  {
    icon: "◈",
    label: "Risk & Opportunity Mapping",
    text: "Fiscal deadlines, permit timelines, school admission windows, and neighbourhood fit are surfaced before you arrive — not after.",
  },
  {
    icon: "◈",
    label: "Milan Integration Roadmap",
    text: "A 30/60/90-day milestone plan tailored to your family, with named introductions to the right specialists at the right moment.",
  },
  {
    icon: "◈",
    label: "Advisor Intelligence Brief",
    text: "Your DOMUS advisor receives a parallel brief in English — ensuring every first conversation is already informed, strategic, and personal.",
  },
];

export default function DomusCompassSection() {
  const labelRef = useScrollReveal();
  const headRef = useScrollReveal(0.1);
  const gridRef = useScrollReveal(0.1);
  const ctaRef = useScrollReveal(0.1);

  return (
    <section
      id="compass"
      style={{
        background: "var(--domus-charcoal)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle gold radial glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "900px",
          height: "900px",
          background: "radial-gradient(ellipse at center, rgba(201,168,76,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Label + rule */}
        <div ref={labelRef} className="fade-up" style={{ marginBottom: "1rem" }}>
          <span
            className="section-label"
            style={{
              color: "var(--domus-gold)",
              display: "block",
              marginBottom: "0.75rem",
              letterSpacing: "0.2em",
              fontSize: "0.75rem",
            }}
          >
            Exclusive to DOMUS
          </span>
          <span
            className="gold-rule"
            style={{ display: "block", width: "60px", height: "2px", background: "var(--domus-gold)", marginBottom: "2rem" }}
          />
        </div>

        {/* Headline + intro */}
        <div ref={headRef} className="fade-up" style={{ marginBottom: "4rem", maxWidth: "760px" }}>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
              lineHeight: 1.1,
              color: "#F5F0E8",
              marginBottom: "1.75rem",
            }}
          >
            Introducing{" "}
            <em style={{ color: "var(--domus-gold)" }}>DOMUS Compass</em>
            <br />
            — your move, understood before it begins.
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "1rem",
              lineHeight: 1.9,
              color: "rgba(245,240,232,0.72)",
              marginBottom: "1.25rem",
            }}
          >
            DOMUS Compass is our proprietary{" "}
            <strong style={{ color: "rgba(245,240,232,0.9)", fontWeight: 400 }}>
              AI-powered Pre-Moving Intelligence Brief
            </strong>{" "}
            — the first of its kind in private relocation. Before your first conversation with an advisor, our
            AI analyses your intake questionnaire in depth: your family structure, professional context, lifestyle
            priorities, and destination requirements. It then generates a personalised intelligence document that
            maps your risks, your opportunities, and your optimal path into Milanese life.
          </p>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "1rem",
              lineHeight: 1.9,
              color: "rgba(245,240,232,0.72)",
            }}
          >
            No other relocation brand does this. Most advisors meet you without context. With DOMUS Compass,
            your advisor arrives at your first call already knowing your situation — and ready to act.
          </p>
        </div>

        {/* Four pillars grid */}
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
          {compassPoints.map((point, i) => (
            <div
              key={i}
              style={{
                padding: "2rem",
                border: "1px solid rgba(201,168,76,0.18)",
                background: "rgba(201,168,76,0.03)",
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.45)";
                (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.07)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.18)";
                (e.currentTarget as HTMLElement).style.background = "rgba(201,168,76,0.03)";
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
                  color: "rgba(245,240,232,0.65)",
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
            href="/intake"
            style={{
              padding: "1.1rem 2.5rem",
              background: "linear-gradient(135deg, var(--domus-gold) 0%, rgba(214,175,98,0.9) 100%)",
              border: "none",
              color: "var(--domus-charcoal)",
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.05rem",
              fontWeight: 500,
              cursor: "pointer",
              letterSpacing: "0.5px",
              textDecoration: "none",
              display: "inline-block",
              boxShadow: "0 8px 24px rgba(214,175,98,0.2)",
              borderRadius: "2px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 36px rgba(214,175,98,0.38)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(214,175,98,0.2)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Receive Your DOMUS Compass Brief
          </a>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "0.8rem",
              color: "rgba(245,240,232,0.4)",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            Included with every DOMUS intake — no additional cost.
          </p>
        </div>
      </div>
    </section>
  );
}
