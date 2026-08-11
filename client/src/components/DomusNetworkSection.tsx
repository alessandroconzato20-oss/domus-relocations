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

const educationPartners: Partner[] = [
  // Education & School Advisory
  {
    id: "academie",
    name: "Lumo Privee",
    logo: "🎓",
    description: "Bespoke academic tutoring and educational support tailored to internationally minded students navigating Milan's leading school systems.",
    category: "EDUCATION",
    categoryGroup: "EDUCATION & SCHOOL ADVISORY",
    quote: "Our preferred school placement partner for families seeking IB, British, and bilingual Italian programmes in Milan.",
    featured: true,
  },
  {
    id: "tf",
    name: "Paideia Mentors",
    logo: "📚",
    description: "Elite educational mentorship and long-term university strategy for families aspiring toward the world's most prestigious institutions.",
    category: "EDUCATION",
    categoryGroup: "EDUCATION & SCHOOL ADVISORY",
  },
  {
    id: "ism",
    name: "ISM Admissions Office",
    logo: "🏫",
    description: "Our direct admissions contact at the International School of Milan, giving DOMUS families priority access to the enrollment process.",
    category: "EDUCATION",
    categoryGroup: "EDUCATION & SCHOOL ADVISORY",
  },
];

const taxWealthPartners: Partner[] = [
  {
    id: "ciani",
    name: "Ciani Partners",
    logo: "/manus-storage/ciani-partners-logo_cff6b854.png",
    description: "Comprehensive tax, wealth and legal advisory for international families establishing residency in Italy and managing cross-border financial structures.",
    category: "TAX & WEALTH",
    categoryGroup: "TAX, WEALTH & LEGAL",
    featured: true,
  },
  {
    id: "protax",
    name: "Protax Consulting Services",
    logo: "/manus-storage/protax-logo_627867a1.png",
    description: "Protax Consulting Services is the world's leading U.S. Global Mobility Tax services CPA firm specialising in U.S. Expatriates, Foreign Nationals, and High Net Worth individuals. Principal Marc J Strohl CPA brings senior experience from EY, Deloitte and PwC and is recognised internationally as a leading educator for CPAs and attorneys worldwide.",
    category: "TAX & WEALTH",
    categoryGroup: "TAX, WEALTH & LEGAL",
    featured: true,
  },
];

const ongoingNegotiations: Partner[] = [
  // Tax, Wealth & Legal
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
    id: "re",
    name: "Luxury Property Partners",
    logo: "🏠",
    description: "Premium residential real estate advisory for international families seeking luxury properties in Milan's most desirable neighborhoods.",
    category: "REAL ESTATE",
    categoryGroup: "REAL ESTATE & PROPERTY",
  },
  {
    id: "id",
    name: "Interior Design Services",
    logo: "🎨",
    description: "Professional interior design and home furnishing services to transform new residences into personalized living spaces.",
    category: "REAL ESTATE",
    categoryGroup: "REAL ESTATE & PROPERTY",
  },

  // Healthcare & Lifestyle
  {
    id: "hc",
    name: "Private Clinic Partner",
    logo: "🏥",
    description: "Concierge-level private healthcare for DOMUS families: English-speaking GPs, specialist referrals, and priority access.",
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

        {/* EDUCATION & SCHOOL ADVISORY Section */}
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

          {/* Featured Partner - Lumo Privee */}
          {educationPartners[0] && (
            <div
              onClick={() => handlePartnerClick(educationPartners[0])}
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(1fr, 100%, 1fr 1fr)",
                gap: "clamp(1.5rem, 3vw, 4rem)",
                marginBottom: "clamp(2rem, 4vw, 4rem)",
                padding: "clamp(1.5rem, 4vw, 3rem)",
                border: "none",
                background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Logo Container */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  borderRadius: "8px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  minHeight: "clamp(200px, 40vw, 300px)",
                }}
              >
                <img
                  src="/manus-storage/lumo-privee-logo_900d8445.png"
                  alt="Lumo Privee Logo"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="180"
                  style={{
                    maxHeight: "clamp(120px, 30vw, 180px)",
                    maxWidth: "90%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "var(--domus-gold)",
                      color: "#ffffff",
                      fontSize: "0.6rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      marginBottom: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12rem",
                      fontWeight: 600,
                    }}
                  >
                    Featured Partner
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "var(--domus-charcoal)",
                    marginBottom: "1rem",
                    lineHeight: 1.2,
                  }}
                >
                  {educationPartners[0].name}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--domus-charcoal)",
                    marginBottom: "1.5rem",
                    lineHeight: 1.7,
                  }}
                >
                  {educationPartners[0].description}
                </p>
                {educationPartners[0].quote && (
                  <blockquote
                    style={{
                      fontStyle: "italic",
                      color: "#666666",
                      borderLeft: "4px solid var(--domus-gold)",
                      paddingLeft: "1.5rem",
                      margin: "0",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    "{educationPartners[0].quote}"
                  </blockquote>
                )}
              </div>
            </div>
          )}

          {/* Featured Partner - Paideia Mentors */}
          {educationPartners[1] && (
            <div
              onClick={() => handlePartnerClick(educationPartners[1])}
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(1fr, 100%, 1fr 1fr)",
                gap: "clamp(1.5rem, 3vw, 4rem)",
                marginBottom: "clamp(2rem, 4vw, 4rem)",
                padding: "clamp(1.5rem, 4vw, 3rem)",
                border: "none",
                background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Logo Container */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  borderRadius: "8px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  minHeight: "clamp(200px, 40vw, 300px)",
                }}
              >
                <img
                  src="/manus-storage/paideia-mentors-logo_a2f79dda.png"
                  alt="Paideia Mentors Logo"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="180"
                  style={{
                    maxHeight: "clamp(120px, 30vw, 180px)",
                    maxWidth: "90%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "var(--domus-gold)",
                      color: "#ffffff",
                      fontSize: "0.6rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      marginBottom: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12rem",
                      fontWeight: 600,
                    }}
                  >
                    Featured Partner
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "var(--domus-charcoal)",
                    marginBottom: "1rem",
                    lineHeight: 1.2,
                  }}
                >
                  {educationPartners[1].name}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--domus-charcoal)",
                    marginBottom: "1.5rem",
                    lineHeight: 1.7,
                  }}
                >
                  {educationPartners[1].description}
                </p>
                {educationPartners[1].quote && (
                  <blockquote
                    style={{
                      fontStyle: "italic",
                      color: "#666666",
                      borderLeft: "4px solid var(--domus-gold)",
                      paddingLeft: "1.5rem",
                      margin: "0",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    "{educationPartners[1].quote}"
                  </blockquote>
                )}
              </div>
            </div>
          )}

          {/* Education Partner Grid - Remaining Partners */}
          {educationPartners.slice(2).length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2.5rem",
              }}
            >
              {educationPartners.slice(2).map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => handlePartnerClick(partner)}
                  style={{
                    padding: "2.5rem",
                    border: "none",
                    background: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {partner.logo}
                  </div>
                  <h4
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      color: "var(--domus-charcoal)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {partner.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666666",
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

        {/* TAX, WEALTH & LEGAL Section */}
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
              TAX, WEALTH & LEGAL
            </span>
          </div>

          {/* Featured Partner - Ciani Partners */}
          {taxWealthPartners[0] && (
            <div
              onClick={() => handlePartnerClick(taxWealthPartners[0])}
              style={{
                display: "grid",
                gridTemplateColumns: "clamp(1fr, 100%, 1fr 1fr)",
                gap: "clamp(1.5rem, 3vw, 4rem)",
                marginBottom: "clamp(2rem, 4vw, 4rem)",
                padding: "clamp(1.5rem, 4vw, 3rem)",
                border: "none",
                background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Logo Container */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  borderRadius: "8px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  minHeight: "clamp(200px, 40vw, 300px)",
                }}
              >
                <img
                  src="/manus-storage/ciani-partners-logo_cff6b854.png"
                  alt="Ciani Partners Logo"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="180"
                  style={{
                    maxHeight: "clamp(120px, 30vw, 180px)",
                    maxWidth: "90%",
                    objectFit: "contain",
                  }}
                />
              </div>

              {/* Content */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "var(--domus-gold)",
                      color: "#ffffff",
                      fontSize: "0.6rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      marginBottom: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12rem",
                      fontWeight: 600,
                    }}
                  >
                    Featured Partner
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "var(--domus-charcoal)",
                    marginBottom: "1rem",
                    lineHeight: 1.2,
                  }}
                >
                  {taxWealthPartners[0].name}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--domus-charcoal)",
                    marginBottom: "1.5rem",
                    lineHeight: 1.7,
                  }}
                >
                  {taxWealthPartners[0].description}
                </p>
                {taxWealthPartners[0].quote && (
                  <blockquote
                    style={{
                      fontStyle: "italic",
                      color: "#666666",
                      borderLeft: "4px solid var(--domus-gold)",
                      paddingLeft: "1.5rem",
                      margin: "0",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                    }}
                  >
                    "{taxWealthPartners[0].quote}"
                  </blockquote>
                )}
              </div>
            </div>
          )}

          {/* Featured Partner - Protax Consulting Services */}
          {taxWealthPartners[1] && (
            <div
              onClick={() => handlePartnerClick(taxWealthPartners[1])}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(1.5rem, 3vw, 4rem)",
                marginBottom: "clamp(2rem, 4vw, 4rem)",
                padding: "clamp(1.5rem, 4vw, 3rem)",
                border: "none",
                background: "linear-gradient(135deg, #faf8f5 0%, #f5f0ea 100%)",
                cursor: "pointer",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#ffffff",
                  borderRadius: "8px",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                  minHeight: "clamp(200px, 40vw, 300px)",
                }}
              >
                <img
                  src="/manus-storage/protax-logo_627867a1.png"
                  alt="Protax Consulting Services Logo"
                  loading="lazy"
                  decoding="async"
                  width="400"
                  height="180"
                  style={{
                    maxHeight: "clamp(120px, 30vw, 180px)",
                    maxWidth: "90%",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      background: "var(--domus-gold)",
                      color: "#ffffff",
                      fontSize: "0.6rem",
                      padding: "0.5rem 1rem",
                      borderRadius: "20px",
                      marginBottom: "1rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.12rem",
                      fontWeight: 600,
                    }}
                  >
                    Featured Partner
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2rem",
                    fontWeight: 400,
                    color: "var(--domus-charcoal)",
                    marginBottom: "1rem",
                    lineHeight: 1.2,
                  }}
                >
                  {taxWealthPartners[1].name}
                </h3>
                <p
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--domus-charcoal)",
                    marginBottom: "1.5rem",
                    lineHeight: 1.7,
                  }}
                >
                  {taxWealthPartners[1].description}
                </p>
              </div>
            </div>
          )}
          {/* Featured Partner - Barducci Law Firm */}
          {taxWealthPartners[2] && (
            <div
              style={{ cursor: "pointer", marginBottom: "3rem" }}
              onClick={() => handlePartnerClick(taxWealthPartners[2])}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0",
                  background: "linear-gradient(135deg, #faf9f7 0%, #f5f2ed 100%)",
                  border: "1px solid rgba(180,155,110,0.2)",
                  borderRadius: "2px",
                  overflow: "hidden",
                  minHeight: "420px",
                }}
              >
                <div
                  style={{
                    background: "#1c3557",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "3rem",
                  }}
                >
                  <img
                    src={taxWealthPartners[2].logo}
                    alt="Barducci Law Firm Logo"
                    loading="lazy"
                    decoding="async"
                    style={{ maxWidth: "260px", maxHeight: "260px", objectFit: "contain" }}
                  />
                </div>
                <div style={{ padding: "3rem 3.5rem", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.6rem",
                      letterSpacing: "0.2em",
                      color: "#B49B6E",
                      border: "1px solid rgba(180,155,110,0.4)",
                      padding: "0.3rem 0.8rem",
                      marginBottom: "1.5rem",
                      width: "fit-content",
                    }}
                  >
                    FEATURED PARTNER
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                      fontWeight: 400,
                      color: "#2D2926",
                      marginBottom: "1.2rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {taxWealthPartners[2].name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: "0.85rem",
                      color: "rgba(45,41,38,0.75)",
                      lineHeight: 1.8,
                      marginBottom: "1.5rem",
                    }}
                  >
                    {taxWealthPartners[2].description}
                  </p>
                </div>
              </div>
            </div>
          )}
          {/* Tax & Wealth Partner Grid - Remaining Partners */}
          {ongoingNegotiations.filter(p => p.categoryGroup === "TAX, WEALTH & LEGAL").length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "2.5rem",
              }}
            >
              {ongoingNegotiations.filter(p => p.categoryGroup === "TAX, WEALTH & LEGAL").map((partner) => (
                <div
                  key={partner.id}
                  onClick={() => handlePartnerClick(partner)}
                  style={{
                    padding: "2.5rem",
                    border: "none",
                    background: "#ffffff",
                    cursor: "pointer",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    borderRadius: "8px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    {partner.logo}
                  </div>
                  <h4
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.5rem",
                      fontWeight: 400,
                      color: "var(--domus-charcoal)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {partner.name}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.9rem",
                      color: "#666666",
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

        {/* ONGOING NEGOTIATIONS Section */}
        <div>
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
              ONGOING NEGOTIATIONS
            </span>
          </div>

          {/* Partner Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {ongoingNegotiations.filter(p => p.categoryGroup !== "TAX, WEALTH & LEGAL").map((partner) => (
              <div
                key={partner.id}
                onClick={() => handlePartnerClick(partner)}
                style={{
                  padding: "2.5rem",
                  border: "none",
                  background: "#ffffff",
                  cursor: "pointer",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    fontSize: "2.5rem",
                    marginBottom: "1rem",
                  }}
                >
                  {partner.logo}
                </div>
                <h4
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.5rem",
                    fontWeight: 400,
                    color: "var(--domus-charcoal)",
                    marginBottom: "0.75rem",
                  }}
                >
                  {partner.name}
                </h4>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#666666",
                    lineHeight: 1.6,
                  }}
                >
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
