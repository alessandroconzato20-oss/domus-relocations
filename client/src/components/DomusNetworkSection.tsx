import { useState } from "react";
import { useLocation } from "wouter";

interface Partner {
  id: string;
  name: string;
  logo: string;
  description: string;
  category: string;
  categoryGroup: string;
  quote?: string;
  website?: string;
  featured?: boolean;
}

const activePartners: Partner[] = [
  // Education & School Advisory
  {
    id: "academie",
    name: "Académie Advisory Group",
    logo: "🎓",
    description: "A leading private school advisory and tutoring firm operating across Milan and the broader Italian education landscape.",
    category: "EDUCATION",
    categoryGroup: "EDUCATION & SCHOOL ADVISORY",
    quote: "Our preferred school placement partner for families seeking IB, British, and bilingual Italian programmes in Milan.",
    featured: true,
  },
  {
    id: "tf",
    name: "The Tutoring Firm",
    logo: "📚",
    description: "Your trusted tutoring partner for children in academic transition — bridging curricula across systems and languages.",
    category: "EDUCATION",
    categoryGroup: "EDUCATION & SCHOOL ADVISORY",
  },
  {
    id: "ism",
    name: "ISM Admissions Office",
    logo: "🏫",
    description: "Our direct admissions contact at the International School of Milan — giving DOMUS families priority access to the enrollment process.",
    category: "EDUCATION",
    categoryGroup: "EDUCATION & SCHOOL ADVISORY",
  },
];

const ongoingNegotiations: Partner[] = [
  // Tax, Wealth & Legal
  {
    id: "sl",
    name: "Studio Legals Partner",
    logo: "⚖️",
    description: "Our preferred immigration and residency counsel for families establishing legal domicile under Italy's €100k flat tax regime.",
    category: "TAX & WEALTH",
    categoryGroup: "TAX, WEALTH & LEGAL",
  },
  {
    id: "wm",
    name: "Private Wealth Managers",
    logo: "💼",
    description: "Trusted wealth advisors with deep expertise in cross-border asset structuring for newly resident HNWI families.",
    category: "TAX & WEALTH",
    categoryGroup: "TAX, WEALTH & LEGAL",
  },

  // Real Estate & Property
  {
    id: "ev",
    name: "Engel & Völkers Milan",
    logo: "🏠",
    description: "Our luxury property partner for off-market and premium residential listings across Brera, Porta Nuova, and City Life.",
    category: "REAL ESTATE",
    categoryGroup: "REAL ESTATE & PROPERTY",
  },
  {
    id: "id",
    name: "Atelier Interior Studio",
    logo: "🎨",
    description: "A Milan-based design studio we trust to turn a new apartment into a home — quickly, beautifully, and within a defined brief.",
    category: "REAL ESTATE",
    categoryGroup: "REAL ESTATE & PROPERTY",
  },

  // Healthcare & Lifestyle
  {
    id: "hc",
    name: "Private Clinic Partner",
    logo: "🏥",
    description: "Concierge-level private healthcare for DOMUS families — English-speaking GPs, specialist referrals, and priority access.",
    category: "HEALTHCARE",
    categoryGroup: "HEALTHCARE & LIFESTYLE",
  },
  {
    id: "pb",
    name: "Private Bank Milan",
    logo: "🏦",
    description: "Our recommended private banking contact for foreign nationals navigating Italian account opening and wealth management.",
    category: "HEALTHCARE",
    categoryGroup: "HEALTHCARE & LIFESTYLE",
  },
];

export default function DomusNetworkSection() {
  const [, setLocation] = useLocation();

  const handlePartnerClick = (partner: Partner) => {
    setLocation(`/partner/${partner.id}`);
  };

  return (
    <section
      id="partners"
      style={{
        padding: "6rem 0",
        background: "var(--domus-ivory)",
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: "4rem", textAlign: "center" }}>
          <span
            style={{
              color: "var(--domus-gold)",
              fontSize: "0.75rem",
              letterSpacing: "0.15rem",
              textTransform: "uppercase",
            }}
          >
            The DOMUS Network
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              color: "var(--domus-charcoal)",
              marginTop: "1rem",
              marginBottom: "2rem",
            }}
          >
            Trusted by association.
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "1rem",
              color: "var(--domus-charcoal)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Every family we work with benefits from relationships we have built over years with Milan and Europe's leading specialists. We introduce our clients only to partners who share our standard of discretion, quality, and care.
          </p>
        </div>

        {/* Active Partners Section */}
        <div style={{ marginBottom: "5rem" }}>
          {/* Category Label */}
          <div
            style={{
              borderBottom: "1px solid var(--domus-gold)",
              paddingBottom: "1rem",
              marginBottom: "2rem",
            }}
          >
            <span
              style={{
                color: "var(--domus-gold)",
                fontSize: "0.7rem",
                letterSpacing: "0.15rem",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              EDUCATION & SCHOOL ADVISORY
            </span>
          </div>

          {/* Featured Partner */}
          {activePartners[0] && (
            <div
              onClick={() => handlePartnerClick(activePartners[0])}
              style={{
                display: "grid",
                gridTemplateColumns: "150px 1fr",
                gap: "3rem",
                marginBottom: "3rem",
                padding: "2rem",
                border: "1px solid #e0d5c7",
                background: "#faf8f5",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f5f0ea";
                e.currentTarget.style.borderColor = "var(--domus-gold)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#faf8f5";
                e.currentTarget.style.borderColor = "#e0d5c7";
              }}
            >
              {/* Logo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  background: "#f0ebe5",
                  borderRadius: "4px",
                }}
              >
                {activePartners[0].logo}
              </div>

              {/* Content */}
              <div>
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "#f5e6d3",
                      color: "var(--domus-gold)",
                      fontSize: "0.65rem",
                      padding: "0.4rem 0.8rem",
                      borderRadius: "2px",
                      marginBottom: "0.5rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1rem",
                      fontWeight: 600,
                    }}
                  >
                    Featured Partner
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    color: "var(--domus-charcoal)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {activePartners[0].name}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--domus-charcoal)",
                    marginBottom: "1rem",
                    lineHeight: 1.6,
                  }}
                >
                  {activePartners[0].description}
                </p>
                {activePartners[0].quote && (
                  <blockquote
                    style={{
                      fontStyle: "italic",
                      color: "var(--domus-charcoal)",
                      borderLeft: "3px solid var(--domus-gold)",
                      paddingLeft: "1rem",
                      margin: "1rem 0",
                      fontSize: "0.9rem",
                    }}
                  >
                    "{activePartners[0].quote}"
                  </blockquote>
                )}
              </div>
            </div>
          )}

          {/* Partner Grid */}
          {activePartners.slice(1).length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "2rem",
              }}
            >
              {activePartners.slice(1).map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => handlePartnerClick(partner)}
                  style={{
                    padding: "2rem",
                    border: "1px solid #e0d5c7",
                    background: "#faf8f5",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f5f0ea";
                    e.currentTarget.style.borderColor = "var(--domus-gold)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#faf8f5";
                    e.currentTarget.style.borderColor = "#e0d5c7";
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                    {partner.logo}
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.2rem",
                      fontWeight: 400,
                      color: "var(--domus-charcoal)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {partner.name}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--domus-charcoal)",
                      lineHeight: 1.6,
                    }}
                  >
                    {partner.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ongoing Negotiations Section */}
        <div style={{ marginBottom: "5rem", marginTop: "6rem" }}>
          <div style={{ marginBottom: "3rem", textAlign: "center" }}>
            <span
              style={{
                color: "var(--domus-gold)",
                fontSize: "0.75rem",
                letterSpacing: "0.15rem",
                textTransform: "uppercase",
              }}
            >
              Coming Soon
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 400,
                color: "var(--domus-charcoal)",
                marginTop: "1rem",
                marginBottom: "2rem",
              }}
            >
              Ongoing Negotiations
            </h2>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "1rem",
                color: "var(--domus-charcoal)",
                maxWidth: "600px",
                margin: "0 auto",
                lineHeight: 1.6,
              }}
            >
              We are actively developing partnerships across tax & wealth advisory, real estate, interior design, and private healthcare. These collaborations will be announced as they are finalized.
            </p>
          </div>

          {/* Ongoing Partners Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {ongoingNegotiations.map((partner) => (
              <div
                key={partner.id}
                style={{
                  padding: "2rem",
                  border: "1px solid #e0d5c7",
                  background: "#faf8f5",
                  opacity: 0.7,
                }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
                  {partner.logo}
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.2rem",
                    fontWeight: 400,
                    color: "var(--domus-charcoal)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {partner.name}
                </h3>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--domus-gold)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1rem",
                    marginBottom: "0.5rem",
                    fontWeight: 600,
                  }}
                >
                  {partner.categoryGroup}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--domus-charcoal)",
                    lineHeight: 1.6,
                  }}
                >
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Partner CTA */}
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            background: "#fff",
            border: "1px solid #e0d5c7",
            marginTop: "4rem",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              color: "var(--domus-charcoal)",
              marginBottom: "1.5rem",
            }}
          >
            Become a DOMUS partner.
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "1rem",
              color: "var(--domus-charcoal)",
              maxWidth: "600px",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            We work with a carefully selected group of specialists who share our commitment to discretion and excellence. If you advise, serve, or support international families relocating to Milan, we would welcome a conversation.
          </p>
          <a
            href="mailto:milano@domusrelocations.com?subject=Partnership%20Inquiry"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              background: "var(--domus-charcoal)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--domus-gold)";
              e.currentTarget.style.color = "var(--domus-charcoal)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--domus-charcoal)";
              e.currentTarget.style.color = "#fff";
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
