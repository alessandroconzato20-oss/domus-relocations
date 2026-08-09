/*
 * DOMUS Relocations — /international-students
 * Dedicated SEO page for international student relocation to Milan.
 */
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import InternationalStudentsSection from "@/components/InternationalStudentsSection";
import ContactSection from "@/components/ContactSection";

export default function InternationalStudents() {
  useEffect(() => {
    document.title = "International Student Relocation Milan | DOMUS Relocations";
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", "DOMUS Relocations helps international students move to Milan for Bocconi, Politecnico, IED, Naba and other universities. Housing, visa support, contract review, and settling-in — handled before you arrive.");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://www.domusrelocations.com/international-students");
  }, []);

  return (
    <div style={{ background: "var(--domus-ivory)", minHeight: "100vh" }}>
      <Navigation />
      <section
        style={{
          paddingTop: "8rem",
          paddingBottom: "4rem",
          background: "var(--domus-ivory)",
          borderBottom: "1px solid rgba(201,168,76,0.15)",
        }}
      >
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--domus-gold)", marginBottom: "1.5rem", fontFamily: "'Jost', sans-serif" }}>
            International Students
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 300, fontStyle: "italic", lineHeight: 1.1, color: "var(--domus-charcoal)", marginBottom: "2rem" }}>
            Milan, handled before you arrive.
          </h1>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "1.05rem", fontWeight: 300, lineHeight: 1.85, color: "#4A4540", maxWidth: "680px" }}>
            Bocconi. Politecnico di Milano. IED. Naba. Cattolica. Every year, thousands of international
            students arrive in Milan for world-class education and face the same avoidable problems:
            wrong housing, wrong contracts, wrong neighbourhood, wrong visa process. DOMUS Relocations
            solves all of it, before your first day of term.
          </p>
          <div style={{ marginTop: "2.5rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="/intake" style={{ display: "inline-block", padding: "0.875rem 2.25rem", background: "var(--domus-gold)", color: "var(--domus-charcoal)", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", border: "1px solid var(--domus-gold)" }}>
              Begin Your Relocation
            </a>
            <a href="mailto:milano@domusrelocations.com" style={{ display: "inline-block", padding: "0.875rem 2.25rem", background: "transparent", color: "var(--domus-charcoal)", fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.15em", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(26,24,20,0.3)" }}>
              Contact Us
            </a>
          </div>
        </div>
      </section>
      <InternationalStudentsSection />
      <ContactSection />
    </div>
  );
}
