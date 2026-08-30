import { useLocation } from "wouter";

type Partner = {
  id: string;
  name: string;
  logo?: string;
  description: string;
  focus: string;
  quote?: string;
};

const educationPartners: Partner[] = [
  {
    id: "academie",
    name: "Lumo Privee",
    logo: "/manus-storage/lumo-privee-logo_900d8445.png",
    focus: "Education and school advisory",
    description: "Bespoke academic tutoring and educational support tailored to internationally minded students navigating Milan's leading school systems.",
    quote: "Our preferred school placement partner for families seeking IB, British, and bilingual Italian programmes in Milan.",
  },
  {
    id: "tf",
    name: "Paideia Mentors",
    logo: "/manus-storage/paideia-mentors-logo_a2f79dda.png",
    focus: "Education and university strategy",
    description: "Elite educational mentorship and long term university strategy for families aspiring toward the world's most prestigious institutions.",
  },
  {
    id: "ism",
    name: "ISM Admissions Office",
    focus: "International school admissions",
    description: "Our direct admissions contact at the International School of Milan, giving DOMUS families priority access to the enrollment process.",
  },
];

const taxPartners: Partner[] = [
  {
    id: "ciani",
    name: "Ciani Partners",
    logo: "/manus-storage/ciani-partners-logo_cff6b854.png",
    focus: "Tax, wealth, and legal advisory",
    description: "Comprehensive tax, wealth, and legal advisory for international families establishing residency in Italy and managing cross border financial structures.",
  },
  {
    id: "protax",
    name: "Protax Consulting Services",
    logo: "/manus-storage/protax-logo_627867a1.png",
    focus: "United States global mobility tax",
    description: "Global mobility tax support for United States expatriates, foreign nationals, and high net worth individuals, led by a principal with senior experience at EY, Deloitte, and PwC.",
  },
  {
    id: "barducci",
    name: "Barducci Law Firm",
    logo: "/manus-storage/barducci-law-firm-logo_7d7e5d97.jpg",
    focus: "Italy and United States legal counsel",
    description: "Dedicated cross border legal guidance across citizenship, immigration, real estate, business establishment, and the authentication of legal documents.",
  },
];

const ongoingPartners = [
  ["01", "Private Wealth Managers", "Trusted wealth advisers with deep expertise in cross border asset structuring for newly resident families."],
  ["02", "Luxury Property Partners", "Premium residential real estate advice for international families considering Italy's most desirable homes."],
  ["03", "Interior Design Services", "A carefully selected network for furnishing and personalising a new residence."],
  ["04", "Private Clinic Partner", "Concierge level private healthcare with English speaking general practitioners and specialist referrals."],
  ["05", "Private Bank Milan", "Guidance for foreign nationals navigating Italian account opening and wealth management."],
];

function FeaturedPartner({ partner, index, onOpen }: { partner: Partner; index: number; onOpen: () => void }) {
  return (
    <button type="button" className="domus-network-feature" onClick={onOpen}>
      <div className="domus-network-logo-panel">
        {partner.logo ? <img src={partner.logo} alt={`${partner.name} logo`} loading="lazy" decoding="async" /> : <span className="domus-network-monogram">{partner.name.slice(0, 1)}</span>}
      </div>
      <div className="domus-network-feature-copy">
        <div className="domus-network-feature-topline">
          <span>0{index + 1}</span>
          <span>{partner.focus}</span>
        </div>
        <h3>{partner.name}</h3>
        <p>{partner.description}</p>
        {partner.quote && <blockquote>“{partner.quote}”</blockquote>}
        <span className="domus-network-detail-link">View partner profile</span>
      </div>
    </button>
  );
}

function PartnerRow({ partner, onOpen, number }: { partner: Partner; onOpen: () => void; number: string }) {
  return (
    <button type="button" className="domus-network-row" onClick={onOpen}>
      <span>{number}</span>
      <div>
        <p>{partner.focus}</p>
        <h3>{partner.name}</h3>
      </div>
      <span className="domus-network-row-action">Profile</span>
    </button>
  );
}

export default function DomusNetworkSection() {
  const [, setLocation] = useLocation();
  const openPartner = (partner: Partner) => setLocation(`/partner/${partner.id}`);

  return (
    <section id="partners" className="domus-network-section">
      <div className="container">
        <header className="domus-network-intro">
          <div>
            <span className="section-label">The DOMUS Network</span>
            <span className="domus-network-rule" aria-hidden="true" />
          </div>
          <div>
            <h2>Trusted by <em>association.</em></h2>
            <p>Every DOMUS introduction is personal, relevant, and made only when it serves the family in front of us.</p>
          </div>
        </header>

        <section className="domus-network-group">
          <div className="domus-network-group-heading">
            <span>Education</span>
            <p>School and academic decisions, made with context.</p>
          </div>
          <div className="domus-network-feature-list">
            {educationPartners.slice(0, 2).map((partner, index) => <FeaturedPartner key={partner.id} partner={partner} index={index} onOpen={() => openPartner(partner)} />)}
          </div>
          <div className="domus-network-rows">
            {educationPartners.slice(2).map((partner, index) => <PartnerRow key={partner.id} partner={partner} number={`0${index + 3}`} onOpen={() => openPartner(partner)} />)}
          </div>
        </section>

        <section className="domus-network-group domus-network-group-dark">
          <div className="domus-network-group-heading">
            <span>Tax, wealth, and legal</span>
            <p>For complex decisions that need trusted, cross border expertise.</p>
          </div>
          <div className="domus-network-feature-list">
            {taxPartners.map((partner, index) => <FeaturedPartner key={partner.id} partner={partner} index={index} onOpen={() => openPartner(partner)} />)}
          </div>
        </section>

        <section className="domus-network-ongoing">
          <header>
            <span className="section-label">Ongoing conversations</span>
            <h2>Our network grows with <em>intention.</em></h2>
          </header>
          <div className="domus-network-ongoing-list">
            {ongoingPartners.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <div className="domus-network-closing">
          <p>Looking for a trusted introduction?</p>
          <a href="mailto:milano@domusrelocations.com">Speak with DOMUS</a>
        </div>
      </div>
    </section>
  );
}
