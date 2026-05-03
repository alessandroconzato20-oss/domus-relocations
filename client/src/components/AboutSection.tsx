/*
 * DOMUS Relocations — About Section
 * Design: Asymmetric layout — text left, image right bleeding off edge
 * Family story, editorial feel, gold rule accents
 */

import { useEffect, useRef } from "react";

const ABOUT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-about-family-NdyPxWzYNXMoRBruwRrPJ2.webp";

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

const journeyPoints = [
  { city: "Tokyo", years: "6 years", flag: "🇯🇵" },
  { city: "Hong Kong", years: "3 years", flag: "🇭🇰" },
  { city: "Shanghai", years: "3 years", flag: "🇨🇳" },
  { city: "Milano", years: "Since 2022", flag: "🇮🇹" },
];

export default function AboutSection() {
  const labelRef = useScrollReveal();
  const contentRef = useScrollReveal(0.1);
  const imageRef = useScrollReveal(0.1);
  const journeyRef = useScrollReveal(0.1);

  return (
    <section
      id="about"
      style={{
        background: "var(--domus-ivory)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        overflow: "hidden",
      }}
    >
      <div className="container">
        {/* Section header with logo */}
        <div ref={labelRef} className="fade-up" style={{ marginBottom: "5rem", display: "flex", alignItems: "center", gap: "3rem" }}>
          <div style={{ flex: "0 0 auto" }}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/DomusRelocationsLogo_506fe4bc.png"
              alt="DOMUS Relocations"
              style={{ height: "280px", width: "auto", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.08))" }}
            />
          </div>
          <div>
            <span className="section-label" style={{ fontSize: "0.85rem", display: "block", marginBottom: "1rem" }}>Our Story</span>
            <span className="gold-rule" style={{ display: "block", marginBottom: "1rem", width: "60px" }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(45, 41, 38, 0.7)", maxWidth: "300px" }}>
              The DOMUS philosophy: proficiency in every detail, fidelity to your interests, and genuine care for the people behind the move. Crafted by a family who knows relocation by heart.
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "4rem",
          }}
          className="about-grid"
        >
          {/* Text column */}
          <div>
            <div ref={contentRef} className="fade-up" style={{ marginBottom: "2.5rem" }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontStyle: "italic",
                  fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
                  lineHeight: 1.1,
                  color: "var(--domus-charcoal)",
                  marginBottom: "2rem",
                }}
              >
                A story we know<br />
                <em style={{ color: "var(--domus-gold)" }}>by heart.</em>
              </h2>

              <p className="body-text" style={{ marginBottom: "1.5rem" }}>
                DOMUS Relocations was born from our own journey as a family who have spent a lifetime moving across the world, experiencing relocation not as a service, but as a deeply personal and often complex transition.
              </p>

              <p className="body-text" style={{ marginBottom: "1.5rem" }}>
                As a family of four, we lived for years across Asia — over six years in Tokyo, three in Hong Kong, and three in Shanghai — before choosing Milano in 2022. Throughout these years, we experienced relocation at a high level, navigating international schools, premium housing, and the expectations that come with a global, fast-paced lifestyle.
              </p>

              <p className="body-text" style={{ marginBottom: "1.5rem" }}>
                With every move, we came to understand that true relocation is not just about efficiency — it is about discretion, precision, and a seamless transition where every detail is handled with care. We learned how important it is to feel supported, understood, and guided when entering a new environment, especially when standards and expectations are high.
              </p>

              <p className="body-text" style={{ marginBottom: "2.5rem" }}>
                DOMUS Relocations was created to reflect exactly that. We offer a highly personalised, discreet, and detail-oriented approach designed for clients who value excellence and peace of mind. For us, relocation isn't just a service — it's a story we know by heart.
              </p>

              <span className="gold-rule" />
            </div>

            {/* Journey timeline */}
            <div ref={journeyRef} className="fade-up" style={{ marginTop: "2.5rem" }}>
              <p className="section-label" style={{ marginBottom: "1.5rem" }}>Our Journey</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                {journeyPoints.map((point, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "1.25rem 1.5rem",
                      border: "1px solid rgba(201, 168, 76, 0.2)",
                      background: i === 3 ? "rgba(201, 168, 76, 0.06)" : "transparent",
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{point.flag}</div>
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontWeight: 400,
                        fontSize: "1.25rem",
                        color: "var(--domus-charcoal)",
                        marginBottom: "0.25rem",
                      }}
                    >
                      {point.city}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Jost', sans-serif",
                        fontWeight: 400,
                        fontSize: "0.75rem",
                        letterSpacing: "0.1em",
                        color: i === 3 ? "var(--domus-gold)" : "var(--domus-grey)",
                        textTransform: "uppercase",
                      }}
                    >
                      {point.years}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image column */}
          <div
            ref={imageRef}
            className="fade-up"
            style={{
              position: "relative",
              minHeight: "400px",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: "8rem",
              }}
            >
              {/* Main image */}
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  aspectRatio: "4/5",
                }}
              >
                <img
                  src={ABOUT_IMAGE}
                  alt="A family looking out over Milan from their new home"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                    display: "block",
                  }}
                />
                {/* Gold corner accent */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "1.5rem",
                    left: "1.5rem",
                    right: "1.5rem",
                    padding: "1.25rem 1.5rem",
                    background: "rgba(15, 13, 11, 0.7)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontWeight: 300,
                      fontStyle: "italic",
                      fontSize: "1.1rem",
                      color: "var(--domus-gold-light)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    "For us, relocation isn't just a service — it's a story we know by heart."
                  </p>
                </div>
              </div>

              {/* Decorative gold border element */}
              <div
                style={{
                  position: "absolute",
                  top: "-1rem",
                  right: "-1rem",
                  width: "60%",
                  height: "60%",
                  border: "1px solid rgba(201, 168, 76, 0.25)",
                  zIndex: -1,
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .about-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </section>
  );
}
