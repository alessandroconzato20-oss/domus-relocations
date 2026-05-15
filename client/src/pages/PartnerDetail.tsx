import { useRoute, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

// Partner data - should match DomusNetworkSection
const partnersData: Record<string, any> = {
  academie: {
    name: "Lumo Privee",
    logo: "🎓",
    category: "EDUCATION",
    description: "A leading private school advisory and tutoring firm operating across Milan and the broader Italian education landscape.",
    fullDescription: "Lumo Privee specializes in helping international families navigate the Italian and international school landscape. With over 15 years of experience, they provide personalized school placement services, academic tutoring, and curriculum guidance.",
    quote: "Our preferred school placement partner for families seeking IB, British, and bilingual Italian programmes in Milan.",
    website: "https://academie.example.com",
    contact: "hello@academie.example.com",
    phone: "+39 02 1234 5678",
  },
  tf: {
    name: "PAIDEIA MENTORS",
    logo: "📚",
    category: "EDUCATION",
    description: "Your trusted tutoring partner for children in academic transition — bridging curricula across systems and languages.",
    fullDescription: "PAIDEIA MENTORS offers comprehensive academic support for students transitioning between different educational systems. Their team of experienced tutors specializes in helping children adapt to new curricula while maintaining academic excellence.",
    website: "https://thetutoringfirm.example.com",
    contact: "info@thetutoringfirm.example.com",
    phone: "+39 02 8765 4321",
  },
  ism: {
    name: "ISM Admissions Office",
    logo: "🏫",
    category: "EDUCATION",
    description: "Our direct admissions contact at the International School of Milan — giving DOMUS families priority access to the enrollment process.",
    fullDescription: "The International School of Milan (ISM) is a leading international school offering IB programs and English-language education. DOMUS families receive priority consideration in the admissions process.",
    website: "https://ismilanschool.com",
    contact: "admissions@ismilanschool.com",
    phone: "+39 02 4000 1000",
  },
  sl: {
    name: "Studio Legals Partner",
    logo: "⚖️",
    category: "TAX & WEALTH",
    description: "Our preferred immigration and residency counsel for families establishing legal domicile under Italy's €100k flat tax regime.",
    fullDescription: "Studio Legals specializes in immigration law and tax optimization for high-net-worth individuals relocating to Italy. They provide expert guidance on residency permits, tax planning, and legal domicile establishment.",
    website: "https://studiolegals.example.com",
    contact: "info@studiolegals.example.com",
    phone: "+39 02 5555 6666",
  },
  wm: {
    name: "Private Wealth Managers",
    logo: "💼",
    category: "TAX & WEALTH",
    description: "Trusted wealth advisors with deep expertise in cross-border asset structuring for newly resident HNWI families.",
    fullDescription: "Our wealth management partners provide comprehensive financial advisory services including asset structuring, investment management, and tax-efficient wealth planning for international clients.",
    website: "https://privatewealthmanagers.example.com",
    contact: "contact@privatewealthmanagers.example.com",
    phone: "+39 02 7777 8888",
  },
  ev: {
    name: "Engel & Völkers Milan",
    logo: "🏠",
    category: "REAL ESTATE",
    description: "Our luxury property partner for off-market and premium residential listings across Brera, Porta Nuova, and City Life.",
    fullDescription: "Engel & Völkers is a global luxury real estate firm with extensive experience in Milan's premium residential market. They specialize in off-market properties and provide white-glove service for discerning clients.",
    website: "https://engelvoelkers.com/milan",
    contact: "milan@engelvoelkers.com",
    phone: "+39 02 3000 1000",
  },
  id: {
    name: "Atelier Interior Studio",
    logo: "🎨",
    category: "REAL ESTATE",
    description: "A Milan-based design studio we trust to turn a new apartment into a home — quickly, beautifully, and within a defined brief.",
    fullDescription: "Atelier Interior Studio specializes in residential interior design and renovation. Their team works efficiently to transform new apartments into beautiful, functional homes that reflect their clients' lifestyle and preferences.",
    website: "https://atelierinteriorstudio.example.com",
    contact: "info@atelierinteriorstudio.example.com",
    phone: "+39 02 2222 3333",
  },
  hc: {
    name: "Private Clinic Partner",
    logo: "🏥",
    category: "HEALTHCARE",
    description: "Concierge-level private healthcare for DOMUS families — English-speaking GPs, specialist referrals, and priority access.",
    fullDescription: "Our healthcare partner provides premium private medical services with English-speaking physicians, specialist referrals, and concierge-level care coordination for international families.",
    website: "https://privateclinic.example.com",
    contact: "hello@privateclinic.example.com",
    phone: "+39 02 4444 5555",
  },
  pb: {
    name: "Private Bank Milan",
    logo: "🏦",
    category: "HEALTHCARE",
    description: "Our recommended private banking contact for foreign nationals navigating Italian account opening and wealth management.",
    fullDescription: "Private Bank Milan specializes in serving high-net-worth individuals and international clients. They provide comprehensive banking services, investment management, and wealth advisory tailored to the needs of relocating families.",
    website: "https://privatebankmilangroup.com",
    contact: "international@privatebankmilangroup.com",
    phone: "+39 02 6666 7777",
  },
};

export default function PartnerDetail() {
  const [match, params] = useRoute("/partner/:id");
  const [, setLocation] = useLocation();

  if (!match) {
    return <div>Partner not found</div>;
  }

  const partnerId = params?.id as string;
  const partner = partnersData[partnerId];

  if (!partner) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <h2>Partner not found</h2>
        <button
          onClick={() => setLocation("/")}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            background: "var(--domus-gold)",
            color: "var(--domus-ivory)",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--domus-ivory)", minHeight: "100vh" }}>
      {/* Header with back button */}
      <div
        style={{
          padding: "2rem",
          background: "var(--domus-ivory)",
          borderBottom: "1px solid #e0d5c7",
        }}
      >
        <div className="container">
          <button
            onClick={() => setLocation("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "none",
              border: "none",
              color: "var(--domus-gold)",
              cursor: "pointer",
              fontSize: "0.9rem",
              textTransform: "uppercase",
              letterSpacing: "0.1rem",
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="container" style={{ padding: "4rem 2rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "150px 1fr",
            gap: "3rem",
            marginBottom: "4rem",
          }}
        >
          {/* Logo */}
          <div
            style={{
              fontSize: "4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {partner.logo}
          </div>

          {/* Content */}
          <div>
            <span
              style={{
                color: "var(--domus-gold)",
                fontSize: "0.75rem",
                letterSpacing: "0.15rem",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {partner.category}
            </span>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.5rem",
                fontWeight: 400,
                color: "var(--domus-charcoal)",
                marginTop: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {partner.name}
            </h1>
            <p
              style={{
                fontSize: "1rem",
                color: "var(--domus-charcoal)",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              {partner.fullDescription}
            </p>

            {/* Contact Info */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "2rem",
                marginTop: "3rem",
              }}
            >
              {partner.website && (
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1rem",
                      color: "var(--domus-gold)",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    Website
                  </span>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--domus-charcoal)",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    {partner.website.replace("https://", "")}
                  </a>
                </div>
              )}
              {partner.contact && (
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1rem",
                      color: "var(--domus-gold)",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    Email
                  </span>
                  <a
                    href={`mailto:${partner.contact}`}
                    style={{
                      color: "var(--domus-charcoal)",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    {partner.contact}
                  </a>
                </div>
              )}
              {partner.phone && (
                <div>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1rem",
                      color: "var(--domus-gold)",
                      marginBottom: "0.5rem",
                      fontWeight: 600,
                    }}
                  >
                    Phone
                  </span>
                  <a
                    href={`tel:${partner.phone}`}
                    style={{
                      color: "var(--domus-charcoal)",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    {partner.phone}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
