/*
 * DOMUS Relocations — Hero Section
 * Design: Full-bleed Milan aerial image, dark overlay, ivory/gold text
 * Centered headline, Milano Est 2022 top right, improved spacing
 */

import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import InquiryForm from "./InquiryForm";

const HERO_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-hero-milan-8KAoKuZsmiaC2PDXN6NmGS.webp";

const headlineWords = ["Your", "Life", "in", "Milan,", "Curated", "Before", "You", "Arrive."];

export default function HeroSection() {
  const [, setLocation] = useLocation();
  const [wordsVisible, setWordsVisible] = useState<boolean[]>(new Array(headlineWords.length).fill(false));
  const [subVisible, setSubVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [inquiryFormOpen, setInquiryFormOpen] = useState(false);

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
      {/* Background image — using <img fetchPriority="high"> so the browser
           discovers and fetches it immediately during HTML parsing, not after CSS.
           This is the single most impactful LCP optimisation. */}
      <img
        src={HERO_IMAGE}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        decoding="sync"
        width={1920}
        height={1080}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center 30%",
          transform: "scale(1.05)",
          transition: "transform 8s ease-out",
          pointerEvents: "none",
          userSelect: "none",
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
          padding: "clamp(2rem, 5vw, 4rem) 1.5rem 0 1.5rem",
        }}
      >


        {/* Headline */}
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 400,
            fontStyle: "italic",
            fontSize: "clamp(2.5rem, 7vw, 7rem)",
            lineHeight: 1.1,
            color: "#F5F0E8",
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
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
            fontSize: "clamp(0.95rem, 1.8vw, 1.5rem)",
            lineHeight: 1.4,
            color: "rgba(245, 240, 232, 0.98)",
            maxWidth: "700px",
            marginBottom: "clamp(1rem, 2vw, 2rem)",
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
            fontSize: "clamp(0.8rem, 1.2vw, 1rem)",
            lineHeight: 1.8,
            color: "rgba(245, 240, 232, 0.75)",
            maxWidth: "600px",
            marginBottom: "clamp(1.5rem, 3vw, 3rem)",
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
            gap: "clamp(0.75rem, 2vw, 1.5rem)",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.7s ease, transform 0.7s ease",
            width: "100%",
            paddingBottom: "clamp(1rem, 2vw, 2rem)",
          }}
        >
          <a
            href="/intake"
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
              display: "inline-block",
              textAlign: "center",
              boxShadow: "0 8px 24px rgba(214, 175, 98, 0.25)",
              borderRadius: "2px",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 12px 36px rgba(214, 175, 98, 0.4)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(214, 175, 98, 0.25)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Begin Your Private Relocation
          </a>
          <button
            onClick={scrollToAbout}
            className="btn-luxury"
            style={{ borderColor: "rgba(245, 240, 232, 0.5)", color: "#F5F0E8", whiteSpace: "nowrap" }}
          >
            Our Story
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "2.5rem",
          right: "3rem",
          display: window.innerWidth < 768 ? "none" : "flex",
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

      {/* Inquiry Form Modal */}
      <InquiryForm isOpen={inquiryFormOpen} onClose={() => setInquiryFormOpen(false)} />
    </section>
  );
}
