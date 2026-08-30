const ABOUT_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/domus-about-family-NdyPxWzYNXMoRBruwRrPJ2.webp";
const DOMUS_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663449035187/5G96cC5HiLZMXbLbP234aP/DomusRelocationsLogo_506fe4bc.png";

const journey = [
  ["Tokyo", "Six years"],
  ["Hong Kong", "Three years"],
  ["Shanghai", "Three years"],
  ["Milano", "Since 2022"],
];

export default function AboutSection() {
  return (
    <section id="about" className="domus-story-section">
      <div className="container">
        <header className="domus-story-intro">
          <div className="domus-story-mark">
            <img src={DOMUS_LOGO} alt="DOMUS Relocations" loading="lazy" decoding="async" />
            <span>Our story</span>
          </div>
          <div>
            <span className="section-label">A life lived internationally</span>
            <span className="domus-story-rule" aria-hidden="true" />
            <h2>A story we know <em>by heart.</em></h2>
          </div>
          <p>
            DOMUS was shaped by a family who have lived the realities of international relocation, from school choices and new homes to the quieter work of creating a life in an unfamiliar city.
          </p>
        </header>

        <div className="domus-story-feature">
          <figure className="domus-story-image">
            <img
              src={ABOUT_IMAGE}
              alt="A family looking out over Milan from their new home"
              loading="lazy"
              decoding="async"
              width="800"
              height="1000"
            />
            <figcaption>“For us, relocation is not simply a service. It is a story we know by heart.”</figcaption>
          </figure>

          <div className="domus-story-copy">
            <p>
              Our own path took us across Asia: six years in Tokyo, three in Hong Kong, and three in Shanghai, before we chose Milano in 2022. In every place, we experienced the high stakes of finding the right school, home, support, and community.
            </p>
            <p>
              That experience taught us that a move should never be treated as a checklist. It is a deeply personal transition that deserves discretion, precision, and a steady hand through every decision.
            </p>
            <p>
              Today, DOMUS brings that perspective to every client. We listen closely, anticipate what is next, and create a seamless beginning for families who expect thoughtful care in every detail.
            </p>
            <a href="/intake" className="domus-story-link">Start a private conversation</a>
          </div>
        </div>

        <div className="domus-story-journey">
          <div>
            <span className="section-label">Our journey</span>
            <p>Global experience, brought home to Italy.</p>
          </div>
          <ol>
            {journey.map(([city, years], index) => (
              <li key={city}>
                <span>0{index + 1}</span>
                <strong>{city}</strong>
                <em>{years}</em>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
