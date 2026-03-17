/*
 * DOMUS Relocations — Services Section
 * Design: Dark background (charcoal), editorial numbered list
 * Ghost Roman numerals, gold accents, sequential reveal on scroll
 * Services: Private Relocation Advisory, School Advisory, Milan Integration, Trusted Network Access
 */

import { useEffect, useRef, useState } from "react";

const SERVICES_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-services-bg-bw2fJWzQFdWmUZnpMgczV9.webp";

const services = [
  {
    numeral: "I",
    label: "Private Relocation Advisory",
    title: "A strategy as unique as your family.",
    description:
      "We begin where others end — with a deeply personal understanding of who you are and what you need. Our private relocation advisory provides a personalised relocation strategy tailored to your lifestyle, coordinating with selected real estate agents to guide you in choosing the right neighbourhood. We remain by your side throughout the first months in Milan, ensuring every transition is handled with the precision and discretion you deserve.",
    details: [
      "Personalised relocation strategy",
      "Neighbourhood selection guidance",
      "Coordination with curated real estate agents",
      "Personal support during your first months in Milan",
    ],
  },
  {
    numeral: "II",
    label: "School Advisory",
    title: "The right school, chosen with certainty.",
    description:
      "Choosing the right school for your children is one of the most consequential decisions of any relocation. We begin with a thorough assessment of your family's needs, then provide curated introductions to selected international schools in Milan. We guide you through the entire application and admission process — and offer something truly rare: a 1-to-1 insider student conversation, giving you the unfiltered truth of a school's environment in a single conversation, rather than having to discover it the hard way.",
    details: [
      "Assessment of family needs and educational priorities",
      "Introductions to selected international schools",
      "Guidance through application and admission",
      "1-to-1 insider student talk for genuine insight",
    ],
  },
  {
    numeral: "III",
    label: "Milan Integration",
    title: "Become part of the city, not just a resident.",
    description:
      "Moving to a new city is more than finding an address. It is about building a life. We facilitate introductions to international communities, exclusive clubs, sports facilities, cultural institutions, and trusted lifestyle services — so that from your very first weeks, Milan feels like home. Our network ensures you are surrounded by the right people, in the right places, from the very beginning.",
    details: [
      "Introductions to international communities",
      "Access to clubs and sports facilities",
      "Cultural institutions and lifestyle services",
      "Curated social integration for the whole family",
    ],
  },
  {
    numeral: "IV",
    label: "Trusted Network Access",
    title: "The people you need, before you know you need them.",
    description:
      "In a new city, you don't yet have a trusted doctor, a reliable lawyer, or a cleaner you can count on. We provide access to a carefully vetted network of professionals — architects, interior designers, legal experts, medical specialists, and private service providers — built over years of living in Milan at the highest level. Every contact in our network has been personally verified and is held to the same standards of excellence we apply to everything we do.",
    details: [
      "Vetted medical and legal professionals",
      "Architects and interior designers",
      "Private household and lifestyle services",
      "Ongoing access as your needs evolve",
    ],
  },
];

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), index * 120);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="fade-up service-card-dark"
      style={{
        position: "relative",
        padding: "3.5rem 3rem 3.5rem 5rem",
        borderBottom: "1px solid rgba(245, 240, 232, 0.08)",
        cursor: "pointer",
        transition: "background 0.4s ease",
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Ghost numeral */}
      <span
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1rem",
          fontFamily: "'Cormorant Garamond', serif",
          fontWeight: 300,
          fontSize: "6rem",
          lineHeight: 1,
          color: "var(--domus-gold)",
          opacity: 0.1,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {service.numeral}
      </span>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem" }}>
        <div style={{ flex: 1 }}>
          {/* Label */}
          <span
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 500,
              fontSize: "0.65rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "var(--domus-gold)",
              display: "block",
              marginBottom: "0.75rem",
            }}
          >
            {service.label}
          </span>

          {/* Title */}
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(1.6rem, 2.5vw, 2.25rem)",
              lineHeight: 1.2,
              color: "#F5F0E8",
              marginBottom: "1.25rem",
            }}
          >
            {service.title}
          </h3>

          {/* Description */}
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
              fontSize: "0.95rem",
              lineHeight: 1.85,
              color: "rgba(245, 240, 232, 0.6)",
              maxWidth: "680px",
              marginBottom: expanded ? "1.75rem" : 0,
            }}
          >
            {service.description}
          </p>

          {/* Expanded details */}
          <div
            style={{
              overflow: "hidden",
              maxHeight: expanded ? "300px" : "0",
              transition: "max-height 0.5s ease",
            }}
          >
            <div style={{ paddingTop: "0.5rem" }}>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 500,
                  fontSize: "0.65rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "rgba(245, 240, 232, 0.4)",
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                What's Included
              </span>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {service.details.map((detail, i) => (
                  <li
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.75rem",
                      fontFamily: "'Jost', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.875rem",
                      color: "rgba(245, 240, 232, 0.7)",
                      lineHeight: 1.6,
                    }}
                  >
                    <span style={{ color: "var(--domus-gold)", marginTop: "0.3rem", flexShrink: 0 }}>—</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Expand indicator */}
        <div
          style={{
            flexShrink: 0,
            width: "40px",
            height: "40px",
            border: "1px solid rgba(201, 168, 76, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
            marginTop: "0.5rem",
          }}
        >
          <span
            style={{
              color: "var(--domus-gold)",
              fontSize: "1.25rem",
              fontWeight: 300,
              lineHeight: 1,
              transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
              display: "block",
            }}
          >
            +
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      style={{
        position: "relative",
        background: "var(--domus-charcoal)",
        paddingTop: "8rem",
        paddingBottom: "8rem",
        overflow: "hidden",
      }}
    >
      {/* Background image with very dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${SERVICES_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.12,
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} className="fade-up" style={{ marginBottom: "5rem" }}>
          <span className="section-label" style={{ color: "var(--domus-gold)" }}>
            Our Services
          </span>
          <span className="gold-rule" style={{ display: "block", marginTop: "1rem", marginBottom: "2rem" }} />
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(2.5rem, 4vw, 3.75rem)",
              lineHeight: 1.1,
              color: "#F5F0E8",
              maxWidth: "600px",
            }}
          >
            Every detail of your<br />
            <em style={{ color: "var(--domus-gold)" }}>new life, considered.</em>
          </h2>
        </div>

        {/* Services list */}
        <div style={{ borderTop: "1px solid rgba(245, 240, 232, 0.08)" }}>
          {services.map((service, i) => (
            <ServiceCard key={i} service={service} index={i} />
          ))}
        </div>
      </div>

      <style>{`
        .service-card-dark:hover {
          background: rgba(201, 168, 76, 0.04) !important;
        }
      `}</style>
    </section>
  );
}
