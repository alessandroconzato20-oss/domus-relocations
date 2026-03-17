/*
 * DOMUS Relocations — Milan Section
 * Design: Ivory background, editorial layout, Milan street image
 * Bridges the city's identity with DOMUS's promise
 */

import { useEffect, useRef } from "react";

const MILAN_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-milan-street-LCypDbRnGtYHRCqmLxjVVN.webp";

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

const qualities = [
  {
    title: "Discretion",
    text: "Every engagement is conducted with absolute confidentiality. Your privacy is not a feature — it is a foundation.",
  },
  {
    title: "Precision",
    text: "We do not offer generic solutions. Every recommendation, introduction, and decision is made with your specific circumstances in mind.",
  },
  {
    title: "Continuity",
    text: "Our relationship does not end when you arrive. We remain available throughout your first months, ensuring nothing is left to chance.",
  },
];

export default function MilanSection() {
  const leftRef = useScrollReveal();
  const rightRef = useScrollReveal(0.1);
  const qualitiesRef = useScrollReveal(0.1);

  return (
    <section
      id="milan"
      style={{
        background: "var(--domus-ivory)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* Top: image left, text right */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "5rem",
            marginBottom: "7rem",
            alignItems: "center",
          }}
          className="md-grid-2"
        >
          {/* Image */}
          <div ref={leftRef} className="fade-up" style={{ position: "relative" }}>
            <div style={{ position: "relative", overflow: "hidden", aspectRatio: "3/4" }}>
              <img
                src={MILAN_IMAGE}
                alt="An elegant Milanese street at golden hour"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
              {/* Decorative offset border */}
              <div
                style={{
                  position: "absolute",
                  bottom: "-1.5rem",
                  right: "-1.5rem",
                  width: "50%",
                  height: "50%",
                  border: "1px solid rgba(201, 168, 76, 0.3)",
                  zIndex: -1,
                }}
              />
            </div>

            {/* Stat overlay */}
            <div
              style={{
                position: "absolute",
                top: "2rem",
                right: "-2rem",
                background: "var(--domus-charcoal)",
                padding: "1.5rem 2rem",
                minWidth: "160px",
              }}
              className="hidden-mobile"
            >
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: "2.5rem",
                  color: "var(--domus-gold)",
                  lineHeight: 1,
                  marginBottom: "0.25rem",
                }}
              >
                15+
              </div>
              <div
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 400,
                  fontSize: "0.65rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "rgba(245, 240, 232, 0.6)",
                }}
              >
                Years of global<br />relocation experience
              </div>
            </div>
          </div>

          {/* Text */}
          <div ref={rightRef} className="fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/DomusRelocationsLogo_506fe4bc.png"
                alt="DOMUS Relocations"
                style={{ height: "56px", width: "auto" }}
              />
              <div style={{ height: "40px", width: "1px", background: "var(--domus-gold)", opacity: 0.3 }} />
              <span className="section-label" style={{ display: "block" }}>
                Milano
              </span>
            </div>
            <span className="gold-rule" style={{ display: "block", marginBottom: "2rem" }} />

            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(2.25rem, 3.5vw, 3.25rem)",
                lineHeight: 1.15,
                color: "var(--domus-charcoal)",
                marginBottom: "1.75rem",
              }}
            >
              The city that rewards<br />
              <em style={{ color: "var(--domus-gold)" }}>those who know it well.</em>
            </h2>

            <p className="body-text" style={{ marginBottom: "1.5rem" }}>
              Milan is not a city that reveals itself easily. Behind its composed façade lies a world of extraordinary quality — in its neighbourhoods, its schools, its social fabric, and its private life. To access it fully, you need someone who already lives inside it.
            </p>

            <p className="body-text" style={{ marginBottom: "2.5rem" }}>
              We chose Milan not as a destination, but as a home. We know its rhythms, its best-kept addresses, and the communities that make it one of Europe's most compelling cities for international families. That knowledge is what we offer you.
            </p>

            <button
              onClick={() => {
                const el = document.getElementById("services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-luxury"
            >
              Explore Our Services
            </button>
          </div>
        </div>

        {/* Divider */}
        <span className="gold-rule-full" style={{ display: "block", marginBottom: "7rem" }} />

        {/* Three qualities */}
        <div ref={qualitiesRef} className="fade-up">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0",
            }}
            className="qualities-grid"
          >
            {qualities.map((q, i) => (
              <div
                key={i}
                style={{
                  padding: "3rem 2.5rem",
                  borderLeft: i > 0 ? "1px solid rgba(201, 168, 76, 0.2)" : "none",
                  borderTop: "1px solid rgba(201, 168, 76, 0.2)",
                  borderBottom: "1px solid rgba(201, 168, 76, 0.2)",
                  borderRight: i === qualities.length - 1 ? "none" : "none",
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
                    marginBottom: "1.25rem",
                  }}
                >
                  0{i + 1}
                </span>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontWeight: 400,
                    fontSize: "1.75rem",
                    color: "var(--domus-charcoal)",
                    marginBottom: "1rem",
                  }}
                >
                  {q.title}
                </h3>
                <p className="body-text" style={{ fontSize: "0.9rem" }}>
                  {q.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .md-grid-2 {
            grid-template-columns: 1fr 1fr !important;
          }
          .qualities-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
          .qualities-grid > div:first-child {
            border-left: 1px solid rgba(201, 168, 76, 0.2) !important;
          }
          .qualities-grid > div:last-child {
            border-right: 1px solid rgba(201, 168, 76, 0.2) !important;
          }
        }
        @media (min-width: 1024px) {
          .hidden-mobile {
            display: block !important;
          }
        }
        .hidden-mobile {
          display: none;
        }
      `}</style>
    </section>
  );
}
