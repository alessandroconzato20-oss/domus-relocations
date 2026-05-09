import { useEffect, useRef } from "react";

export default function AboutSection() {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (labelRef.current) {
      observer.observe(labelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="py-20 md:py-32 bg-gradient-to-b from-[#F5F1ED] to-[#FEFDFB]"
      style={{ background: "linear-gradient(180deg, #F5F1ED 0%, #FEFDFB 100%)" }}
    >
      <div className="container">
        {/* Asymmetric header: logo left, title + text right */}
        <style>{`
          .about-header-asymmetric {
            display: grid;
            grid-template-columns: 1fr 1.2fr;
            gap: 4rem;
            align-items: flex-start;
            margin-bottom: 5rem;
          }
          
          @media (max-width: 768px) {
            .about-header-asymmetric {
              grid-template-columns: 1fr;
              gap: 2rem;
            }
          }

          .fade-up {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
          }

          .fade-up.in-view {
            opacity: 1;
            transform: translateY(0);
          }
        `}</style>
        
        <div ref={labelRef} className="fade-up about-header-asymmetric">
          {/* Left: Large logo in container */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            padding: "2rem",
            background: "rgba(201, 168, 76, 0.04)",
            border: "1px solid rgba(201, 168, 76, 0.15)",
            minHeight: "400px"
          }}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/DomusRelocationsLogo_506fe4bc.png"
              alt="DOMUS Relocations"
              style={{ height: "clamp(200px, 35vw, 380px)", width: "auto", filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.08))" }}
            />
          </div>

          {/* Right: Title at top, line aligned with logo border, then text below */}
          <div style={{ paddingTop: "0", display: "flex", flexDirection: "column" }}>
            <span className="section-label" style={{ fontSize: "0.85rem", display: "block", marginBottom: "0.75rem", textAlign: "left", letterSpacing: "0.15em", color: "#C9A84C" }}>Our Story</span>
            <span className="gold-rule" style={{ display: "block", width: "60px", height: "2px", background: "#C9A84C", marginBottom: "2rem" }} />
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(45, 41, 38, 0.7)", maxWidth: "400px" }}>
              The DOMUS philosophy: proficiency in every detail, fidelity to your interests, and genuine care for the people behind the move. Crafted by a family who knows relocation by heart.
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            marginBottom: "5rem",
          }}
          className="md:grid-cols-2 gap-8 md:gap-12"
        >
          {/* Left column: Founder story */}
          <div className="fade-up">
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "1.3rem", lineHeight: 1.6, color: "#2D2926", marginBottom: "1.5rem" }}>
              DOMUS Relocations was born from our own journey as a family who have spent a lifetime moving across the world, experiencing relocation not as a service, but as a deeply personal and often complex transition.
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(45, 41, 38, 0.7)" }}>
              As a family of four, we lived for years across Asia, over six years in Tokyo, three in Hong Kong, and three in Shanghai, before choosing Milano in 2022. Throughout these years, we experienced relocation at a high level, navigating international schools, premium housing, and the expectations that come with a global, fast-paced lifestyle.
            </p>
          </div>

          {/* Right column: Philosophy */}
          <div className="fade-up">
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(45, 41, 38, 0.7)" }}>
              With every move, we came to understand that true relocation is not just about efficiency, it is about discretion, precision, and a seamless transition where every detail is handled with care. We learned how important it is to feel supported, understood, and guided when entering a new environment, especially when standards and expectations are high.
            </p>
            <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 300, fontSize: "0.95rem", lineHeight: 1.8, color: "rgba(45, 41, 38, 0.7)", marginTop: "1.5rem" }}>
              DOMUS Relocations was created to reflect exactly that. We offer a highly personalized, discreet, and detail-oriented approach designed for clients who value excellence and peace of mind. For us, relocation isn't just a service, it's a story we know by heart.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
