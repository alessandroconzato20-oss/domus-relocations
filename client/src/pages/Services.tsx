import { useEffect } from "react";
import ContactSection from "@/components/ContactSection";
import Navigation from "@/components/Navigation";
import ServicesSection from "@/components/ServicesSection";

export default function Services() {
  useEffect(() => {
    document.title = "Private Relocation Services Milan | DOMUS Relocations";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", "DOMUS Relocations offers private relocation advisory, school placement, property search, tax and residency advisory, and the DOMUS Compass AI Intelligence Brief for families and executives moving to Milan.");
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute("href", "https://www.domusrelocations.com/services");
  }, []);

  return (
    <div className="domus-secondary-page">
      <Navigation />
      <section className="domus-secondary-hero">
        <div className="container domus-secondary-hero-layout">
          <div>
            <span className="section-label">Private services</span>
            <span className="domus-secondary-rule" aria-hidden="true" />
            <h1>Every detail of your move, <em>thoughtfully held.</em></h1>
          </div>
          <div>
            <p>From a first conversation through the first months of life in Milan, DOMUS provides a private, considered relocation service for internationally mobile families and executives.</p>
            <div className="domus-secondary-hero-actions">
              <a href="/intake">Begin a private consultation</a>
              <a href="mailto:milano@domusrelocations.com">Contact DOMUS</a>
            </div>
          </div>
        </div>
      </section>
      <ServicesSection />
      <ContactSection />
    </div>
  );
}
