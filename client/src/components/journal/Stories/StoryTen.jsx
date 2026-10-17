import React from "react";
import first_image from "../../../assets/journal/blog_ten/img-01.png";
import second_image from "../../../assets/journal/blog_ten/img-02.png";
import third_image from "../../../assets/journal/blog_ten/img-03.png";
import fourth_image from "../../../assets/journal/blog_ten/img-04.png";
import fifth_image from "../../../assets/journal/blog_ten/img-05.png";
import sixth_image from "../../../assets/journal/blog_ten/img-06.png";
import hero_image from "../../../assets/journal/blog_ten/hero.png";

// ---------------------------------------------------------------------------
// Configurable constants — swap these out for handoff / CMS wiring
// ---------------------------------------------------------------------------
const BRAND_NAME = "Otulia";
const EYEBROW = "Celebrity Real Estate";
const TITLE = "Inside Novak Djokovic's Global Property Portfolio";
const SUBTITLE =
  "The Serbian tennis star has owned homes in Monaco, Serbia, Spain, Greece, and the U.S.";
const DATE_PUBLISHED = "16 Jul 2026";
const CTA_URL = "#";

const AT_A_GLANCE = [
  { label: "Grand Slam Titles", value: "24" },
  { label: "Career Prize Money", value: "~$194M" },
  { label: "Est. Net Worth", value: "~$250M" },
  { label: "Countries Owned In", value: "5+" },
];

const PROPERTIES = [
  {
    number: "01",
    id: "monaco",
    place: "Monte Carlo, Monaco",
    image: first_image,
    imageAlt:
      "Aerial view of a high-rise residential tower in Monte Carlo, Monaco",
    imageCaption:
      "Djokovic's Monaco apartment served as his primary home for roughly 15 years.",
    body: [
      "Monaco was where Djokovic first put down roots outside Serbia. He bought a hillside apartment in the principality not long after turning professional as a teenager, joining a long list of top players — including Daniil Medvedev and Alexander Zverev — who have based themselves there. The residence, believed to overlook the Mediterranean, functioned as his primary home for about 15 years and put him within easy reach of the Monte-Carlo Country Club, one of the sport's premier training facilities.",
      "Djokovic and his family have since relocated, but the Monaco connection has stayed close to his career — he's spoken often about the convenience of practicing on familiar courts between tournaments. There's no indication he's sold the property.",
    ],
  },
  {
    number: "02",
    id: "nyc",
    place: "New York City, New York",
    image: second_image,
    imageAlt: "Glass-wrapped residential tower in SoHo, New York City",
    imageCaption:
      "The SoHo development marked architect Renzo Piano's first residential project in New York.",
    body: [
      "Rather than a single trophy apartment in Manhattan, Djokovic bought two. In 2017 he spent over $10 million on a pair of SoHo units inside a glass-wrapped condominium designed by Pritzker Prize-winning architect Renzo Piano — reportedly located in different parts of the building, suggesting they were meant to function as separate living spaces rather than one combined unit.",
      "The purchase reflected as much an interest in architecture as in real estate; Djokovic has credited Piano's design as a major reason for the buy. The building, Piano's first residential project in the city, holds 115 units with soaring ceilings, floor-to-ceiling glass, and private elevator access.",
    ],
  },
  {
    number: "03",
    id: "miami",
    place: "Miami Beach, Florida",
    image: third_image,
    imageAlt: "Oceanfront condominium tower in Miami Beach, Florida",
    imageCaption:
      "The Miami Beach penthouse was sold in 2021, having never served as a residence.",
    body: [
      "Djokovic's appreciation for Renzo Piano's work extended to Florida. Around the same time as the SoHo purchases, he paid $5.77 million for a penthouse atop one of the architect's boutique oceanfront buildings in Miami Beach, citing both the design and the fact that New York and Miami had become regular stops on his travel schedule.",
      "The roughly 2,400-square-foot unit paired minimalist interiors with unobstructed Atlantic views, in a building offering infinity pools, a spa, a fitness center, and a private library. Djokovic never actually lived there — he listed it almost as soon as construction wrapped in late 2019 and sold it in 2021 for $6 million.",
    ],
  },
  {
    number: "04",
    id: "belgrade",
    place: "Belgrade, Serbia",
    image: fourth_image,
    imageAlt: "Aerial view of a lakefront villa near Belgrade, Serbia",
    imageCaption: "The Pavlovac Lake estate spans nearly 30,000 square feet.",
    body: [
      "Djokovic's Serbian holdings reflect his continued ties to his homeland. One is a penthouse overlooking Pavlova Lake, reportedly purchased for somewhere between $675,000 and $1.1 million depending on the report, followed by an extensive renovation. It holds three bedrooms, generous entertaining space, and a terrace with its own pool.",
      "He also owns a considerably larger estate near Pavlovac Lake — a nearly 30,000-square-foot villa with eight bedrooms, 12 bathrooms, a wine cellar, a spa, an indoor pool, a gym, and a private tennis court. The property has at times been offered as a luxury rental for around 15,000 euros (roughly $17,000) a night.",
    ],
  },
  {
    number: "05",
    id: "marbella",
    place: "Marbella, Spain",
    image: fifth_image,
    imageAlt:
      "Aerial view of a villa with a tennis court and pool in Marbella, Spain",
    imageCaption:
      "The Sierra Blanca villa became the family's full-time residence during the pandemic.",
    body: [
      "For several years, Djokovic's home base was a Moroccan-inspired villa in Marbella's exclusive Sierra Blanca enclave, reportedly bought in 2020 for about $11 million. Set between the mountains and the Mediterranean, the estate became the family's full-time residence during the pandemic, when Djokovic occasionally shared glimpses of it on social media.",
      "The nine-bedroom home includes a home theater, a gym, a Turkish bath, a swimming pool, and a full-size private tennis court. More recent reports suggest the property has undergone extensive renovation work.",
    ],
  },
  {
    number: "06",
    id: "athens",
    place: "Athens, Greece",
    image: sixth_image,
    imageAlt: "Aerial view of the Glyfada coastline near Athens, Greece",
    imageCaption:
      "Djokovic has reportedly been spotted training at Glyfada's Kavouri Tennis Club.",
    body: [
      "Djokovic's most recent address appears to be in Greece. Reports in 2025 indicated that he and his family had relocated to the Athens suburb of Glyfada after several years in Spain, though it's not publicly confirmed whether the home is owned or rented, and no purchase price has surfaced. Greek media have reported sightings of him training at the nearby Kavouri Tennis Club, suggesting the seaside neighborhood is now his primary base as he continues competing on tour.",
    ],
  },
];

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function ShareIcon({ label, path }) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#DDD6C7] text-[#1C1A17] transition-colors hover:border-[#7A2E2E] hover:bg-[#7A2E2E] hover:text-[#F7F4EC]"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d={path} />
      </svg>
    </button>
  );
}

// Literal <img> placeholder — swap the src for the real asset.
function ArticleImage({ src, alt, caption, credit }) {
  return (
    <figure className="mt-6 mb-8">
      <div className="aspect-[3/2] w-full overflow-hidden border border-[#DDD6C7] bg-[#EFEAE0]">
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
      {(caption || credit) && (
        <figcaption className="mt-3 font-sans text-[12px] leading-relaxed text-[#4A463F]">
          {caption}{" "}
          {credit && <span className="italic text-[#8A8577]">{credit}</span>}
        </figcaption>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function DjokovicPropertyPortfolioArticle() {
  return (
    <div className="min-h-screen w-full  text-[#1C1A17]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-serif-body { font-family: 'Source Serif 4', Georgia, serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="mx-auto w-full max-w-7xl px-4 pb-24 pt-14 md:px-8 md:pt-20">
        {/* Eyebrow */}
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-[#7A2E2E]">
          {EYEBROW}
        </p>

        {/* Headline */}
        <h1 className="mt-4 font-display text-[32px] leading-[1.14] text-[#1C1A17] md:text-[42px]">
          {TITLE}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 max-w-[680px] font-serif-body text-[17px] leading-relaxed text-[#4A463F] md:text-[18px]">
          {SUBTITLE}
        </p>

        {/* Byline row */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#DDD6C7] pb-6">
          <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#4A463F]">
            {DATE_PUBLISHED}
          </p>
          <div className="flex items-center gap-2">
            <ShareIcon
              label="Share via email"
              path="M2 6a2 2 0 012-2h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm2 0l8 6 8-6"
            />
            <ShareIcon
              label="Share on Facebook"
              path="M13 22v-8h2.7l.4-3H13V9c0-.9.2-1.5 1.6-1.5H16V5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H7v3h2.6v8H13z"
            />
            <ShareIcon
              label="Share on X"
              path="M4 4l7.5 8.6L4.4 20H6l6.3-6.9L17 20h3l-7.9-9L19 4h-1.6l-5.7 6.3L8 4H4z"
            />
            <ShareIcon
              label="Share on LinkedIn"
              path="M4.98 3.5A2.5 2.5 0 100 6a2.5 2.5 0 004.98-.5zM.5 8.75h4.9V21H.5V8.75zM8.5 8.75h4.7v1.68h.07c.66-1.2 2.27-2.47 4.68-2.47 5 0 5.93 3.3 5.93 7.59V21h-4.9v-5.9c0-1.41-.03-3.23-1.97-3.23-1.97 0-2.27 1.54-2.27 3.13V21H8.5V8.75z"
            />
          </div>
        </div>

        {/* Hero image */}
        <ArticleImage
          src={hero_image}
          alt="Novak Djokovic celebrating on court at Wimbledon"
          credit="Adam Davy/PA Images via Getty Images"
        />

        {/* Intro */}
        <div className="mb-14 max-w-[680px]">
          <p className="font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
            For more than two decades, Novak Djokovic has been rewriting
            tennis's record books. The Serbian star has collected 24 Grand Slam
            singles titles, over 100 ATP Tour-level wins, and nearly $194
            million in career prize money — more than any player in the sport's
            history. Even at 39, he remains a threat on the biggest stages,
            chasing an unprecedented 25th major while cementing a legacy that
            already ranks among the greatest in the sport.
          </p>
          <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
            That success has made him one of tennis's highest earners off the
            court as well, with endorsement deals spanning Lacoste, Hublot,
            Asics, Aman, and NetJets contributing to an estimated $250 million
            fortune. Away from competition, he and his wife, Jelena — his
            longtime partner since high school — are raising their two children
            while running a growing set of ventures, including the Novak Tennis
            Academy and the Novak Djokovic Foundation, which funds early
            childhood education programs in Serbia.
          </p>
          <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
            Like many top-earning athletes, Djokovic has put a meaningful share
            of that wealth into property, building a portfolio that spans from
            the Mediterranean coast to the mountains above Monaco. Here's a look
            at the homes he's owned over the years.
          </p>
        </div>

        {/* Property sections */}
        <div>
          {PROPERTIES.map((prop) => (
            <section key={prop.id} id={prop.id} className="mb-14 scroll-mt-28">
              <div className="flex items-baseline gap-4 border-b border-[#DDD6C7] pb-3">
                <span className="font-display text-[20px] text-[#A8823F]">
                  {prop.number}
                </span>
                <h2 className="font-display text-[24px] leading-tight text-[#1C1A17] md:text-[28px]">
                  {prop.place}
                </h2>
              </div>

              <ArticleImage
                src={prop.image}
                alt={prop.imageAlt}
                caption={prop.imageCaption}
              />

              {prop.body.map((para, i) => (
                <p
                  key={i}
                  className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]"
                >
                  {para}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-4 flex flex-col items-start justify-between gap-6 border border-[#1C1A17] bg-[#1C1A17] p-8 text-[#F7F4EC] md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#A8823F]">
              {BRAND_NAME}
            </p>
            <p className="mt-3 max-w-md font-display text-[22px] leading-snug md:text-[24px]">
              Follow the properties shaping the world's most exclusive
              addresses.
            </p>
          </div>
          <a
            href={CTA_URL}
            className="shrink-0 whitespace-nowrap border border-[#F7F4EC] px-6 py-3 font-sans text-[13px] uppercase tracking-[0.08em] text-[#F7F4EC] transition-colors hover:bg-[#F7F4EC] hover:text-[#1C1A17]"
          >
            Browse Curated Properties ↗
          </a>
        </div>
      </div>
    </div>
  );
}
