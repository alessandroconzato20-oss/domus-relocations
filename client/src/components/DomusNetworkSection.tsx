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

const partners: Partner[] = [
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
    featured: true,
  },

  // Real Estate & Property
  {
    id: "ev",
    name: "Engel & Völkers Milan",
    logo: "🏠",
    description: "Our luxury property partner for off-market and premium residential listings across Brera, Porta Nuova, and City Life.",
    category: "REAL ESTATE",
    categoryGroup: "REAL ESTATE & PROPERTY",
    featured: true,
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
    featured: true,
  },
];

const categoryGroups = [
  "EDUCATION & SCHOOL ADVISORY",
  "TAX, WEALTH & LEGAL",
  "REAL ESTATE & PROPERTY",
  "HEALTHCARE & LIFESTYLE",
];

export default function DomusNetworkSection() {
  const [, setLocation] = useLocation();
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

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

        {/* Categories */}
        {categoryGroups.map((categoryGroup) => {
          const groupPartners = partners.filter(
            (p) => p.categoryGroup === categoryGroup
          );
          const featured = groupPartners.find((p) => p.featured);
          const others = groupPartners.filter((p) => !p.featured);

          return (
            <div key={categoryGroup} style={{ marginBottom: "5rem" }}>
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
                  {categoryGroup}
                </span>
              </div>

              {/* Featured Partner */}
              {featured && (
                <div
                  onClick={() => handlePartnerClick(featured)}
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
                    {featured.logo}
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
                      {featured.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.95rem",
                        color: "var(--domus-charcoal)",
                        marginBottom: "1rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {featured.description}
                    </p>
                    {featured.quote && (
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
                        "{featured.quote}"
                      </blockquote>
                    )}
                  </div>
                </div>
              )}

              {/* Partner Grid */}
              {others.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                    gap: "2rem",
                  }}
                >
                  {others.map((partner) => (
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
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#faf8f5";
                        e.currentTarget.style.borderColor = "#e0d5c7";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {/* Logo */}
                      <div
                        style={{
                          fontSize: "2.5rem",
                          marginBottom: "1rem",
                        }}
                      >
                        {partner.logo}
                      </div>

                      {/* Category Badge */}
                      <span
                        style={{
                          display: "inline-block",
                          background: "#f5e6d3",
                          color: "var(--domus-gold)",
                          fontSize: "0.65rem",
                          padding: "0.4rem 0.8rem",
                          borderRadius: "2px",
                          marginBottom: "0.75rem",
                          textTransform: "uppercase",
                          letterSpacing: "0.1rem",
                          fontWeight: 600,
                        }}
                      >
                        {partner.category}
                      </span>

                      {/* Name */}
                      <h4
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1.25rem",
                          fontWeight: 400,
                          color: "var(--domus-charcoal)",
                          marginBottom: "0.75rem",
                        }}
                      >
                        {partner.name}
                      </h4>

                      {/* Description */}
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
          );
        })}

        {/* CTA Section */}
        <div
          style={{
            marginTop: "6rem",
            padding: "4rem 2rem",
            textAlign: "center",
            borderTop: "1px solid #e0d5c7",
          }}
        >
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2rem",
              fontWeight: 400,
              color: "var(--domus-charcoal)",
              marginBottom: "1rem",
            }}
          >
            Become a DOMUS partner.
          </h3>
          <p
            style={{
              fontSize: "0.95rem",
              color: "var(--domus-charcoal)",
              maxWidth: "600px",
              margin: "0 auto 2rem",
              lineHeight: 1.6,
            }}
          >
            We work with a carefully selected group of specialists who share our commitment to discretion and excellence. If you advise, serve, or support international families relocating to Milan, we would welcome a conversation.
          </p>
          <a
            href="mailto:milano@domusrelocations.com?subject=DOMUS Partner Inquiry"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              border: "1px solid var(--domus-gold)",
              color: "var(--domus-gold)",
              textDecoration: "none",
              fontSize: "0.85rem",
              letterSpacing: "0.1rem",
              textTransform: "uppercase",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--domus-gold)";
              e.currentTarget.style.color = "var(--domus-ivory)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--domus-gold)";
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
