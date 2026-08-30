import { useEffect } from "react";
import ContactSection from "@/components/ContactSection";
import InternationalStudentsSection from "@/components/InternationalStudentsSection";
import Navigation from "@/components/Navigation";

export default function InternationalStudents() {
  useEffect(() => {
    document.title = "International Student Relocation Milan | DOMUS Relocations";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", "DOMUS Relocations helps international students move to Milan for Bocconi, Politecnico, IED, Naba and other universities. Housing, visa support, contract review, and settling in handled before you arrive.");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://www.domusrelocations.com/international-students");
  }, []);

  return (
    <div className="domus-secondary-page">
      <Navigation />
      <section className="domus-secondary-hero domus-secondary-hero-dark">
        <div className="container domus-secondary-hero-layout">
          <div>
            <span className="section-label">International students</span>
            <span className="domus-secondary-rule" aria-hidden="true" />
            <h1>A more confident beginning, before the first day of class.</h1>
          </div>
          <div>
            <p>For students and families who want the practicalities of Italy to feel clear before arrival, and the first weeks to be guided with real care.</p>
            <div className="domus-secondary-hero-actions">
              <a href="/intake">Begin a private consultation</a>
              <a href="mailto:milano@domusrelocations.com">Contact DOMUS</a>
            </div>
          </div>
        </div>
      </section>
      <InternationalStudentsSection />
      <ContactSection />
    </div>
  );
}
