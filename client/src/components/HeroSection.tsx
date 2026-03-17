/*
 * DOMUS Relocations — Hero Section
 * Design: Full-bleed Milan aerial image, dark overlay, ivory/gold text
 * Staggered word-by-word headline reveal, scroll indicator
 */

import { useEffect, useRef, useState } from "react";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-hero-milan-8KAoKuZsmiaC2PDXN6NmGS.webp";

const headlineWords = ["Your", "Life", "in", "Milan,", "Curated", "Before", "You", "Arrive."];

export default function HeroSection() {
  const [wordsVisible, setWordsVisible] = useState<boolean[]>(new Array(headlineWords.length).fill(false));
  const [subVisible, setSubVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  useEffect(() => {
    headlineWords.forEach((_, i) => {
      setTimeout(() => {
        setWordsVisible(prev => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 400 + i * 90);
    });
    setTimeout(() => setSubVisible(true), 400 + headlineWords.length * 90 + 200);
    setTimeout(() => setCtaVisible(true), 400 + headlineWords.length * 90 + 500);
  }, []);

  const scrollToAbout = () => {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        height: "100vh",
        minHeight: "700px",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          transform: "scale(1.05)",
          transition: "transform 8s ease-out",
        }}
        className="hero-bg"
      />

      {/* Gradient overlay — dark at bottom, lighter at top */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(15,13,11,0.25) 0%, rgba(15,13,11,0.15) 40%, rgba(15,13,11,0.75) 100%)",
        }}
      />

      {/* Large Logo Display - Top Right */}
      <div
        style={{
          position: "absolute",
          top: "4rem",
          right: "2rem",
          zIndex: 15,
          opacity: subVisible ? 1 : 0,
          transform: subVisible ? "translateY(0)" : "translateY(-30px)",
          transition: "opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s",
        }}
      >
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/DomusRelocationsLogo_506fe4bc.png"
          alt="DOMUS Relocations"
          style={{
            height: "140px",
            width: "auto",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
          }}
        />
      </div>

      {/* Content */}
      <div className="container" style={{ position: "relative", zIndex: 10, paddingBottom: "8rem", width: "100%" }}>
        <div style={{ maxWidth: "900px" }}>
          {/* Label */}
          <div
            style={{
              opacity: subVisible ? 1 : 0,
              transform: subVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
              marginBottom: "1.5rem",
            }}
          >
            <span className="section-label" style={{ color: "var(--domus-gold-light)" }}>
              Milano · Est. 2022
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(3rem, 7vw, 6.5rem)",
              lineHeight: 1.05,
              color: "#F5F0E8",
              marginBottom: "2rem",
              letterSpacing: "-0.01em",
            }}
          >
            {headlineWords.map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.3em",
                  opacity: wordsVisible[i] ? 1 : 0,
                  transform: wordsVisible[i] ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Subheadline */}
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              lineHeight: 1.8,
              color: "rgba(245, 240, 232, 0.8)",
              maxWidth: "520px",
              marginBottom: "2.5rem",
              opacity: subVisible ? 1 : 0,
              transform: subVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            A private relocation advisory for those who expect more than efficiency — 
            discretion, precision, and a seamless transition into Milanese life.
          </p>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            <button
              onClick={() => {
                const el = document.getElementById("services");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="btn-luxury-dark"
            >
              Discover Our Services
            </button>
            <button
              onClick={scrollToAbout}
              className="btn-luxury"
              style={{ borderColor: "rgba(245, 240, 232, 0.5)", color: "#F5F0E8" }}
            >
              Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          right: "3rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.75rem",
          opacity: ctaVisible ? 1 : 0,
          transition: "opacity 1s ease 0.5s",
          zIndex: 10,
          cursor: "pointer",
        }}
        onClick={scrollToAbout}
      >
        <span
          style={{
            fontFamily: "'Jost', sans-serif",
            fontWeight: 400,
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(245, 240, 232, 0.6)",
            writingMode: "vertical-rl",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "60px",
            background: "linear-gradient(to bottom, rgba(201, 168, 76, 0.8), transparent)",
            animation: "scrollPulse 2s ease-in-out infinite",
          }}
        />
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }
        .hero-bg {
          animation: heroZoom 8s ease-out forwards;
        }
        @keyframes heroZoom {
          from { transform: scale(1.08); }
          to { transform: scale(1.0); }
        }
      `}</style>
    </section>
  );
}
