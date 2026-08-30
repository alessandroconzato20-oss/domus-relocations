/* DOMUS Relocations: Core Values */

const values = [
  {
    number: "01",
    title: "Proficiency",
    statement: "Knowledge, applied with purpose.",
    text: "We bring a deep, practical understanding of international relocation shaped by years of personal experience. Every decision is informed, every detail considered, and every transition managed with quiet expertise.",
  },
  {
    number: "02",
    title: "Fidelity",
    statement: "Your interests, held above all else.",
    text: "Discretion, integrity, and transparency guide every recommendation we make. We represent our clients with independence and loyalty, protecting what matters while making even complex decisions feel clear.",
  },
  {
    number: "03",
    title: "Care",
    statement: "A relocation designed around real life.",
    text: "Behind every move is a family, a rhythm, and a future taking shape. We give each one the attention it deserves, creating continuity and reassurance at every stage of the transition.",
  },
];

export default function CoreValuesSection() {
  return (
    <section className="domus-values-section">
      <div className="container domus-values-layout">
        <header className="domus-values-intro">
          <span className="section-label">The DOMUS standard</span>
          <span className="domus-values-rule" aria-hidden="true" />
          <h2>
            The principles behind every <em>considered move.</em>
          </h2>
          <p>
            The way we work is as important as what we deliver. These three principles direct every introduction, decision, and detail.
          </p>
        </header>

        <div className="domus-values-list">
          {values.map((value) => (
            <article className="domus-value-row" key={value.title}>
              <span className="domus-value-number">{value.number}</span>
              <div className="domus-value-copy">
                <h3>{value.title}</h3>
                <p className="domus-value-statement">{value.statement}</p>
                <p className="domus-value-description">{value.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
