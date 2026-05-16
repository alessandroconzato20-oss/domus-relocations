/*
 * DOMUS Relocations — Hero Section
 * Design: Full-bleed Milan aerial image, dark overlay, ivory/gold text
 * Centered headline, Milano Est 2022 top right, improved spacing
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
        alignItems: "center",
        justifyContent: "center",
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
      <div
        style={{
          position: "relative",
          zIndex: 10,
          width: "100%",
          maxWidth: "1000px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "4rem 2rem 0 2rem",
        }}
      >
        {/* Label — positioned at top right */}
        <div
          style={{
            position: "absolute",
            top: "2rem",
            right: "2rem",
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            zIndex: 20,
          }}
        >
          <span className="section-label" style={{ color: "var(--domus-gold-light)", fontSize: "0.85rem", letterSpacing: "0.15em" }}>
            MILANO · EST. 2022
          </span>
        </div>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            lineHeight: 1.1,
            color: "#F5F0E8",
            marginBottom: "2.5rem",
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
            fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
            lineHeight: 1.4,
            color: "rgba(245, 240, 232, 0.98)",
            maxWidth: "700px",
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
            fontSize: "clamp(0.9rem, 1.4vw, 1rem)",
            lineHeight: 1.8,
            color: "rgba(245, 240, 232, 0.75)",
            maxWidth: "600px",
            marginBottom: "3rem",
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
            gap: "1.5rem",
            alignItems: "center",
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
          }}
        >
          {/* Primary CTAs */}
          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              flexWrap: "wrap",
              justifyContent: "center",
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

          {/* Schedule Consultation CTA */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              alignItems: "center",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <button
              onClick={() => {
                window.location.href = "mailto:milano@domusrelocations.com?subject=Schedule%20a%20Private%20Consultation&body=Hello%20DOMUS%20Relocations%2C%0A%0AI%20would%20like%20to%20schedule%20a%20private%20consultation.%0A%0AThank%20you";
              }}
              style={{
                padding: "1.1rem 2.5rem",
                background: "linear-gradient(135deg, var(--domus-gold) 0%, rgba(214, 175, 98, 0.9) 100%)",
                border: "none",
                color: "var(--domus-charcoal)",
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.1rem",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
                letterSpacing: "0.5px",
                textDecoration: "none",
                display: "block",
                width: "100%",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(214, 175, 98, 0.25)",
                borderRadius: "2px",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 12px 36px rgba(214, 175, 98, 0.4)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(214, 175, 98, 0.25)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Schedule A Private Consultation
            </button>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "0.9rem",
                fontWeight: 400,
                color: "rgba(245, 240, 232, 0.85)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Explore how DOMUS can support every aspect of your transition to Milan with a discreet, fully tailored approach.
            </p>
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
            fontSize: "0.75rem",
            color: "rgba(245, 240, 232, 0.6)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "24px",
            height: "40px",
            border: "2px solid rgba(245, 240, 232, 0.4)",
            borderRadius: "12px",
            display: "flex",
            justifyContent: "center",
            padding: "8px 0",
          }}
        >
          <div
            style={{
              width: "2px",
              height: "8px",
              background: "rgba(245, 240, 232, 0.6)",
              borderRadius: "1px",
              animation: "scroll-down 2s infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scroll-down {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(12px);
          }
        }
      `}</style>
    </section>
  );
}
