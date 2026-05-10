/*
 * DOMUS Relocations — Hero Section
 * Design: Full-bleed Milan aerial image, dark overlay, ivory/gold text
 * Staggered word-by-word headline reveal, scroll indicator
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-hero-milan-8KAoKuZsmiaC2PDXN6NmGS.webp";

const headlineWords = ["Your", "Life", "in", "Milan,", "Curated", "Before", "You", "Arrive."];

export default function HeroSection() {
  const [, setLocation] = useLocation();
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
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(3.5rem, 8vw, 7.5rem)",
              lineHeight: 0.95,
              color: "#F5F0E8",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            {headlineWords.map((word, i) => (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  marginRight: "0.25em",
                  opacity: wordsVisible[i] ? 1 : 0,
                  transform: wordsVisible[i] ? "translateY(0)" : "translateY(30px)",
                  transition: "opacity 0.6s ease, transform 0.6s ease",
                }}
              >
                {word}
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(1.25rem, 2.2vw, 1.65rem)",
              lineHeight: 1.4,
              color: "rgba(245, 240, 232, 0.98)",
              maxWidth: "600px",
              marginBottom: "2rem",
              opacity: subVisible ? 1 : 0,
              transform: subVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s",
            }}
          >
            A discreet relocation partner for internationally mobile clients
          </p>

          {/* Subheadline */}
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)",
              lineHeight: 1.8,
              color: "rgba(245, 240, 232, 0.75)",
              maxWidth: "520px",
              marginBottom: "2.5rem",
              opacity: subVisible ? 1 : 0,
              transform: subVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            A private relocation advisory rooted in discretion, precision, and a seamless transition into Milanese life. We expect more than efficiency.
          </p>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease, transform 0.7s ease",
            }}
          >
            {/* Primary CTAs */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => {
                  const el = document.getElementById("services");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn-luxury-dark"
                style={{ background: "var(--domus-ivory)", color: "var(--domus-charcoal)", border: "1px solid var(--domus-ivory)" }}
              >
                Begin Your Private Relocation
              </button>
              <button
                onClick={scrollToAbout}
                className="btn-luxury"
                style={{ borderColor: "rgba(245, 240, 232, 0.5)", color: "#F5F0E8" }}
              >
                Our Story
              </button>
            </div>

            {/* Auth buttons — below and centered */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setLocation("/login")}
                style={{
                  padding: "0.5rem 1rem",
                  background: "transparent",
                  border: "1px solid rgba(245, 240, 232, 0.4)",
                  color: "rgba(245, 240, 232, 0.85)",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--domus-gold)";
                  e.currentTarget.style.color = "var(--domus-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245, 240, 232, 0.4)";
                  e.currentTarget.style.color = "rgba(245, 240, 232, 0.85)";
                }}
              >
                Log In
              </button>
              <button
                onClick={() => setLocation("/signup")}
                style={{
                  padding: "0.5rem 1rem",
                  background: "rgba(214, 175, 98, 0.15)",
                  border: "1px solid rgba(214, 175, 98, 0.4)",
                  color: "var(--domus-gold)",
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.3px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(214, 175, 98, 0.25)";
                  e.currentTarget.style.borderColor = "var(--domus-gold)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(214, 175, 98, 0.15)";
                  e.currentTarget.style.borderColor = "rgba(214, 175, 98, 0.4)";
                }}
              >
                Sign Up
              </button>
            </div>
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
