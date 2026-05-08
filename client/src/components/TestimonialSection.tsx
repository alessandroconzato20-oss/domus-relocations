/*
 * DOMUS Relocations — Testimonial/Quote Section
 * Design: Full-width dark section with large italic quote
 * Bridges Milan section and Contact section
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

export default function TestimonialSection() {
  const ref = useScrollReveal(0.2);

  return (
    <section
      style={{
        background: "var(--domus-charcoal)",
        padding: "7rem 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative large quote mark */}
      <div
        style={{
          position: "absolute",
          top: "-2rem",
          left: "5%",
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "20rem",
          lineHeight: 1,
          color: "rgba(201, 168, 76, 0.05)",
          pointerEvents: "none",
          userSelect: "none",
          fontWeight: 300,
        }}
      >
        "
      </div>

      <div className="container">
        <div
          ref={ref}
          className="fade-up"
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          {/* Gold rule */}
          <div style={{ width: "40px", height: "1px", background: "var(--domus-gold)", margin: "0 auto 2.5rem" }} />

          <blockquote
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
              lineHeight: 1.5,
              color: "rgba(245, 240, 232, 0.85)",
              margin: "0 0 2.5rem",
              padding: 0,
              border: "none",
            }}
          >
            "We had moved many times before, but Milan was different. DOMUS didn't just help us find a home; they helped us find our life here. Within weeks, our children were settled in the right school, we had a doctor we trusted, and we felt genuinely at home in a city that can take years to open up."
          </blockquote>

          {/* Gold rule */}
          <div style={{ width: "40px", height: "1px", background: "var(--domus-gold)", margin: "0 auto 2rem" }} />

          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 400,
              fontSize: "0.75rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--domus-gold)",
            }}
          >
            A DOMUS Client — Relocated from Singapore, 2024
          </p>
        </div>
      </div>
    </section>
  );
}
