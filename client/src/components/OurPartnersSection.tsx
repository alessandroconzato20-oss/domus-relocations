/*
 * DOMUS Relocations — Our Partners Section
 * Design: Milanese Atelier — elegant partner showcase
 * Partners displayed in a grid with logos and descriptions
 */

export default function OurPartnersSection() {
  const partners = [
    {
      id: 1,
      name: "Premium Real Estate Partners",
      description: "Curated selection of Milan's most prestigious residential properties and developments",
      icon: "🏛️",
    },
    {
      id: 2,
      name: "International Relocation Specialists",
      description: "Expert logistics and coordination for seamless cross-border transitions",
      icon: "✈️",
    },
    {
      id: 3,
      name: "Luxury Concierge Services",
      description: "Bespoke lifestyle management and personalized Milan experiences",
      icon: "🎭",
    },
    {
      id: 4,
      name: "Financial & Legal Advisors",
      description: "Specialized guidance for international clients navigating Italian regulations",
      icon: "⚖️",
    },
    {
      id: 5,
      name: "Educational Institutions",
      description: "Partnerships with leading international schools and universities in Milan",
      icon: "🎓",
    },
    {
      id: 6,
      name: "Healthcare Providers",
      description: "Access to Milan's premier medical facilities and wellness centers",
      icon: "🏥",
    },
  ];

  return (
    <section
      id="partners"
      style={{
        padding: "6rem 0",
        background: "#F5F0E8",
        position: "relative",
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ marginBottom: "4rem", textAlign: "center" }}>
          <span
            className="section-label"
            style={{
              color: "var(--domus-gold)",
              fontSize: "0.75rem",
              letterSpacing: "0.15rem",
              textTransform: "uppercase",
            }}
          >
            Trusted Network
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 400,
              color: "var(--domus-charcoal)",
              marginTop: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            The DOMUS Network
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "1rem",
              color: "rgba(15, 13, 11, 0.7)",
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            We collaborate with Milan's finest institutions and service providers to ensure every aspect of your relocation is handled with precision and care.
          </p>
        </div>

        {/* Partners Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
            marginBottom: "3rem",
          }}
        >
          {partners.map((partner) => (
            <div
              key={partner.id}
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(201, 168, 76, 0.2)",
                padding: "2.5rem",
                borderRadius: "4px",
                transition: "all 0.3s ease",
                cursor: "pointer",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--domus-gold)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(201, 168, 76, 0.1)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(201, 168, 76, 0.2)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div
                style={{
                  fontSize: "2.5rem",
                  marginBottom: "1rem",
                }}
              >
                {partner.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  color: "var(--domus-charcoal)",
                  marginBottom: "0.75rem",
                }}
              >
                {partner.name}
              </h3>
              <p
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "0.9rem",
                  color: "rgba(15, 13, 11, 0.6)",
                  lineHeight: 1.5,
                }}
              >
                {partner.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.95rem",
              color: "rgba(15, 13, 11, 0.7)",
              marginBottom: "1.5rem",
            }}
          >
            Interested in partnering with DOMUS Relocations?
          </p>
          <a
            href="mailto:milano@domusrelocations.com"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              background: "var(--domus-charcoal)",
              color: "#F5F0E8",
              textDecoration: "none",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.9rem",
              fontWeight: 500,
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--domus-gold)";
              e.currentTarget.style.color = "var(--domus-charcoal)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--domus-charcoal)";
              e.currentTarget.style.color = "#F5F0E8";
            }}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
