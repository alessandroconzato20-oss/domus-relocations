const challenges = [
  {
    number: "01",
    title: "The contract trap",
    description: "Lease terms can be difficult to assess from abroad. Automatic renewals, disproportionate damage clauses, and hidden fees should be understood before a student commits.",
  },
  {
    number: "02",
    title: "The visa maze",
    description: "Student immigration is document led and time sensitive. A clear sequence for the visa, residence permit, tax code, and local registration prevents costly delays.",
  },
  {
    number: "03",
    title: "The neighbourhood question",
    description: "A suitable home is more than a postcode. Safety, transport, campus access, and day to day rhythm determine whether a student can settle with confidence.",
  },
  {
    number: "04",
    title: "The first weeks",
    description: "Arrival is often the most vulnerable moment. Practical orientation and the right local introductions make the difference between merely arriving and feeling at home.",
  },
];

const services = [
  ["I", "Visa and permit guidance", "A clear documentation sequence, appointment preparation, and practical guidance throughout the residence permit process."],
  ["II", "A considered housing search", "Curated options aligned with budget, campus access, and lifestyle. Every property and contract is reviewed with care before a decision is made."],
  ["III", "Contract clarity", "Lease obligations and key terms explained before signing, with concerns surfaced early and appropriate support coordinated where needed."],
  ["IV", "Neighbourhood intelligence", "A personal recommendation built around the student's university, routine, safety, transport, and preferred way of living."],
  ["V", "Arrival prepared", "Support with essential set up, including banking, local connectivity, utilities, transport, and primary care registration."],
  ["VI", "A connected city life", "Thoughtful local introductions and practical orientation that help a student establish their place in the city from the first weeks."],
];

const journey = [
  ["01", "Before arrival", "Three to six months prior", ["Visa document planning", "Initial housing brief", "Neighbourhood recommendation"]],
  ["02", "Arrival", "The first four weeks", ["Airport or arrival coordination", "Tax code and registration", "Property and key handover"]],
  ["03", "Settling in", "Months one to three", ["Residence permit support", "University orientation", "Local community introductions"]],
  ["04", "Continuity", "Throughout the first year", ["Lease renewal guidance", "Ongoing practical support", "Trusted local contacts"]],
];

export default function InternationalStudentsSection() {
  return (
    <section id="students" className="domus-students-section">
      <div className="container">
        <header className="domus-students-intro">
          <span className="section-label">International students</span>
          <span className="domus-students-rule" aria-hidden="true" />
          <div>
            <h2>Brilliant students deserve an arrival designed with <em>equal care.</em></h2>
            <p>
              Moving abroad for university is a formative step. DOMUS gives students and their families a measured, personal route from acceptance to a confident life in Italy.
            </p>
          </div>
        </header>

        <div className="domus-students-problems">
          <div className="domus-students-problems-heading">
            <span>The realities to anticipate</span>
            <p>Local knowledge transforms the decisions that shape a student's first year.</p>
          </div>
          <div className="domus-students-problems-list">
            {challenges.map((challenge) => (
              <article className="domus-student-problem" key={challenge.number}>
                <span>{challenge.number}</span>
                <div>
                  <h3>{challenge.title}</h3>
                  <p>{challenge.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="domus-students-service-band">
        <div className="container domus-students-service-layout">
          <header>
            <span className="section-label">The DOMUS student service</span>
            <span className="domus-students-rule" aria-hidden="true" />
            <h2>A capable start, from the first decision to the first day of class.</h2>
            <p>Six areas of support, delivered with the discretion and precision of every DOMUS relocation.</p>
          </header>
          <div className="domus-students-service-list">
            {services.map(([number, title, description]) => (
              <article className="domus-student-service" key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="container domus-students-journey-wrap">
        <header className="domus-students-journey-heading">
          <span className="section-label">The student journey</span>
          <h2>Every step, in the right order.</h2>
        </header>
        <div className="domus-students-journey">
          {journey.map(([number, phase, timeframe, items]) => (
            <article className="domus-student-journey-step" key={number as string}>
              <span className="domus-student-journey-number">{number}</span>
              <span className="domus-student-journey-line" aria-hidden="true" />
              <h3>{phase}</h3>
              <p className="domus-student-journey-timeframe">{timeframe}</p>
              <ul>
                {(items as string[]).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <div className="domus-students-cta">
          <p>For students, parents, and families who prefer a considered beginning.</p>
          <a href="/intake" className="btn-luxury">Begin a private consultation</a>
        </div>
      </div>
    </section>
  );
}
