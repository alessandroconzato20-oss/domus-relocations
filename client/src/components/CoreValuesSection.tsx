/*
 * DOMUS Relocations — Core Values Section
 * Design: Ivory background, three value boxes with new titles
 * Proficiency, Fidelity, Care
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

const values = [
  {
    title: "Proficiency",
    text: "We bring a deep, hands-on understanding of international relocation shaped by years of personal experience. Every detail is handled with expertise, ensuring a seamless and efficient transition at every stage.",
  },
  {
    title: "Fidelity",
    text: "Trust is at the core of everything we do, guided by discretion, integrity, and complete transparency. We are committed to representing our clients' best interests with unwavering loyalty and care.",
  },
  {
    title: "Care",
    text: "We approach every relocation with genuine attention to the people behind the move, not just the process itself. Our role is to provide reassurance, continuity, and a sense of ease during moments of change.",
  },
];

export default function CoreValuesSection() {
  const valuesRef = useScrollReveal(0.1);

  return (
    <section
      style={{
        background: "var(--domus-ivory)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* Section title */}
        <div ref={valuesRef} className="fade-up" style={{ marginBottom: "5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(1.75rem, 2.5vw, 2.25rem)",
                color: "var(--domus-charcoal)",
                marginBottom: "1.5rem",
              }}
            >
              Our Core Values For You
            </h2>
            <div
              style={{
                width: "60px",
                height: "1px",
                background: "var(--domus-gold)",
                margin: "0 auto",
              }}
            />
          </div>

          {/* Three values */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "0",
            }}
            className="qualities-grid"
          >
            {values.map((v, i) => (
              <div
                key={i}
                style={{
                  padding: "3rem 2.5rem",
                  borderLeft: i > 0 ? "1px solid rgba(201, 168, 76, 0.2)" : "none",
                  borderTop: "1px solid rgba(201, 168, 76, 0.2)",
                  borderBottom: "1px solid rgba(201, 168, 76, 0.2)",
                  borderRight: i === values.length - 1 ? "none" : "none",
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
                  {v.title}
                </h3>
                <p className="body-text" style={{ fontSize: "0.9rem" }}>
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
