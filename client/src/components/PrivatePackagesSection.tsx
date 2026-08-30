const packages = [
  {
    level: "I",
    name: "Essential",
    subtitle: "A composed beginning",
    intro: "For families who want the right foundations in place before and immediately after arrival.",
    includedLabel: "Included",
    features: [
      "Identification and selection of suitable international schools",
      "Recommendations and introductions to trusted doctors and dentists",
      "Recommendations for suitable gyms, clubs, and leisure facilities",
      "Guidance on supermarkets, shops, and essential local services",
      "Identification of a trusted veterinary service, if required",
      "A 40 minute family briefing after the DOMUS Family Questionnaire, allowing us to understand priorities and prepare the relocation accordingly",
      "One week of dedicated private support following arrival",
    ],
  },
  {
    level: "II",
    name: "Elevate",
    subtitle: "A more considered arrival",
    intro: "For families seeking an intelligently planned home search and a seamless first chapter in Italy.",
    includedLabel: "Everything in Essential, plus",
    featured: true,
    features: [
      "An 80 minute family briefing after the DOMUS Family Questionnaire",
      "Three carefully selected property options, identified through our proprietary AI powered platform and refined through DOMUS expertise",
      "Assistance with property related due diligence and coordination, where required",
      "Private airport to home concierge service for a seamless arrival and transition",
      "Three weeks of dedicated private support following arrival",
      "Assistance with banking arrangements and account setup",
      "Coordination of utilities transfers and registrations",
      "Assistance with arranging car rental, if required",
      "A Michelin star chef preparing a classic Italian dish of the family's choosing on the first evening at home",
    ],
  },
  {
    level: "III",
    name: "Thrive",
    subtitle: "A home, ready to live in",
    intro: "For families who want every arrival detail anticipated, prepared, and personally overseen.",
    includedLabel: "Everything in Elevate, plus",
    features: [
      "A dedicated interior designer to assist with preparing and personalising the new residence",
      "A carefully curated DOMUS Welcome Pack",
      "A DOMUS representative personally welcoming the family at the airport and accompanying them home",
      "The home prepared before arrival, including a fully stocked fridge with the family's requested essentials",
      "Wi Fi installed and fully operational before the family's arrival",
      "Coordination of a trusted private housekeeping and cleaning service",
      "Access to a trusted home maintenance network for ongoing household needs",
      "Two months of dedicated private DOMUS support following arrival",
      "A Michelin star chef preparing the family's chosen dinner on the first evening at home",
    ],
  },
];

export default function PrivatePackagesSection() {
  return (
    <section id="packages" className="domus-packages-section">
      <div className="container">
        <header className="domus-packages-header">
          <span className="section-label">Private relocation packages</span>
          <span className="gold-rule" aria-hidden="true" />
          <h2>Three ways to arrive well.</h2>
          <p>
            Each DOMUS programme is designed around the family, not a formula. Choose the level of support that reflects how you would like your new life to begin.
          </p>
        </header>

        <div className="domus-packages-grid">
          {packages.map((pkg) => (
            <article
              key={pkg.name}
              className={`domus-package-card${pkg.featured ? " domus-package-card-featured" : ""}`}
            >
              <div className="domus-package-topline">
                <span className="domus-package-numeral">{pkg.level}</span>
                {pkg.featured && <span className="domus-package-recommended">Most comprehensive choice</span>}
              </div>
              <h3>{pkg.name}</h3>
              <p className="domus-package-subtitle">{pkg.subtitle}</p>
              <p className="domus-package-intro">{pkg.intro}</p>

              <div className="domus-package-inclusions">
                <span>{pkg.includedLabel}</span>
                <ul>
                  {pkg.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>

              <a href="/intake" className="domus-package-link">
                Begin a private consultation
              </a>
            </article>
          ))}
        </div>

        <p className="domus-packages-footnote">
          Every programme begins with a private conversation. We tailor the delivery of each package to your family, timing, and priorities.
        </p>
      </div>
    </section>
  );
}
