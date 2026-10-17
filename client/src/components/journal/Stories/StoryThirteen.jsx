import React, { useState } from "react";
import hero_image from "../../../assets/journal/blog_thirteen/hero.webp";
import first_image from "../../../assets/journal/blog_thirteen/img_01.webp";
import second_image from "../../../assets/journal/blog_thirteen/img_02.webp";
import third_image from "../../../assets/journal/blog_thirteen/img_03.webp";
import four_image from "../../../assets/journal/blog_thirteen/img_04.webp";
import fifth_image from "../../../assets/journal/blog_thirteen/img_05.webp";

const BRAND_NAME = "Otulia";
const EYEBROW = "Celebrity Real Estate";
const TITLE = "Inside Zendaya and Tom Holland's $22 Million Property Portfolio";
const SUBTITLE =
  "The longtime couple's real estate holdings include multiple California properties, a luxury Brooklyn condo, and a renovated London home.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Luxury Property Network";
const DATE_PUBLISHED = "28 Jul 2026";
const READ_TIME = "8 Minute Read";
const CTA_URL = "#";

const TOC = [
  { id: "overview", label: "A Hollywood Power Couple" },
  { id: "northridge", label: "1. Northridge" },
  { id: "london", label: "2. London" },
  { id: "encino", label: "3. Encino" },
  { id: "brooklyn", label: "4. Brooklyn" },
  { id: "hollywood-hills", label: "5. Hollywood Hills" },
  { id: "bottom-line", label: "The Bottom Line" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "How much is Zendaya and Tom Holland's property portfolio worth?",
    a: "Across their combined holdings—a Northridge home, a London residence, an Encino compound, a Brooklyn Heights condo, and two Hollywood Hills properties—their portfolio is estimated at roughly $22 million.",
  },
  {
    q: "How many properties do they own?",
    a: "The couple collectively owns at least six properties: Zendaya holds four (Northridge, Encino, Brooklyn, and two adjacent Hollywood Hills homes counted as one compound), and Holland owns one in London. Holland has publicly denied rumors that he and Zendaya purchased a London home together.",
  },
  {
    q: "What is Tom Holland's London home like?",
    a: "Holland reportedly purchased his southwest London home in 2018 for around $3.35 million. The six-bedroom property underwent major renovations beginning in 2020 and is now valued at around $4.7 million. Reports suggest it includes a gym, movie theater, entertaining spaces, and a 'man cave,' with large folding glass doors connecting the kitchen to the patio and garden.",
  },
  {
    q: "Where does Zendaya live?",
    a: "Zendaya's primary residences are in Southern California. She owns a Mediterranean-style home in Northridge (purchased in 2016), a ranch-style compound in Encino (purchased in 2019), and has assembled a two-property compound in the Hollywood Hills. She also owns a waterfront condo in Brooklyn Heights.",
  },
  {
    q: "Do Zendaya and Tom Holland own property together?",
    a: "As of the latest reports, the couple's properties are held individually. Holland has publicly denied rumors that he and Zendaya purchased a London home together. Their portfolio reflects separate investments made at different points in their careers.",
  },
];

const PORTFOLIO_STATS = [
  {
    value: "$22M",
    label: "estimated total portfolio value",
    source: "Public records",
  },
  {
    value: "6",
    label: "properties across 3 cities",
    source: "Public records",
  },
  {
    value: "$1.4M",
    label: "first purchase (Northridge, 2016)",
    source: "Public records",
  },
  {
    value: "3",
    label: "countries: US, UK, and counting",
    source: "Public records",
  },
];

const PROPERTIES = [
  {
    id: "northridge",
    number: "1",
    name: "Northridge",
    photoCredit: "Google Earth",
    paragraphs: [
      "Zendaya made her first major real estate purchase in 2016, picking up a $1.4 million Mediterranean-style home in Southern California at just 20 years old. Shortly after moving in, the actress gave fans a peek inside the property, including the dramatic curved staircase in the foyer that she famously nicknamed her \u201CCinderella spiral staircase.\u201D",
      "The 4,155-square-foot residence has five bedrooms and five bathrooms. The chef\u2019s kitchen is outfitted with Calacatta marble countertops and a large center island. Upstairs, the primary suite comes with its own fireplace, private balcony, dressing room, vanity area, and a marble bathroom centered around a soaking tub. Outside, the backyard is designed more like a private retreat, complete with a patio, swimming pool, and spa.",
    ],
    image: first_image,
  },
  {
    id: "london",
    number: "2",
    name: "London",
    photoCredit: "Google Maps",
    paragraphs: [
      "In the U.K., Holland\u2019s biggest real estate investment remains his longtime London home, which he reportedly purchased in 2018 for around $3.35 million. Located not far from where the actor grew up in Kingston-on-Thames, the property underwent major renovations beginning in 2020. By the time the work wrapped a few years later, the six-bedroom home had reportedly climbed in value to around $4.7 million thanks to a sizable extension and extensive upgrades throughout.",
      "While the notoriously private actor hasn\u2019t shared many details about the interiors, reports suggest the home now includes a gym, movie theater, entertaining spaces, and even a \u201Cman cave.\u201D The outdoor setup is especially impressive for London, with a large lawn, mature trees, and dense landscaping adding an extra layer of privacy. Large folding glass doors reportedly connect the kitchen directly to the patio and garden, giving the home a more open indoor-outdoor feel. Holland has publicly denied rumors that he and Zendaya purchased a London home together.",
    ],
    image: second_image,
  },
  {
    id: "encino",
    number: "3",
    name: "Encino",
    photoCredit: "Google Earth",
    paragraphs: [
      "In 2019, Zendaya added a second Southern California property to her growing portfolio. Purchased for $3.97 million, the ranch-style compound in Encino sits behind gates on nearly 3.72 acres of land. The more than 5,100-square-foot home has six bedrooms and seven bathrooms, plus a detached guesthouse for visitors. Compared to her Mediterranean starter home, the Encino property has a much more relaxed and minimalist feel, with hardwood floors throughout, neutral interiors, and lots of open living space. The kitchen sports granite countertops, stainless steel appliances, and plenty of room for gathering.",
      "Elsewhere, the home features multiple fireplaces, sweeping canyon views, and a primary suite with a built-in soaking tub and private balcony overlooking the grounds. Outside, the property leans into its secluded setting with direct hiking access and a newly updated swimming pool. At one point, Zendaya briefly listed the home as a luxury rental for $12,900 per month before eventually pulling it off the market.",
    ],
    image: third_image,
  },
  {
    id: "brooklyn",
    number: "4",
    name: "Brooklyn",
    photoCredit: "Google Maps",
    paragraphs: [
      "Zendaya expanded to the East Coast in 2020 with the purchase of a $4.9 million condo at Quay Tower in Brooklyn Heights, a waterfront building designed by ODA New York and Marmol Radziner. The three-bedroom, two-and-a-half-bathroom residence spans roughly 2,050 square feet with floor-to-ceiling windows. Wide-plank oak floors, custom cabinetry, and a kitchen fitted with Gaggenau appliances keep the interiors sleek but still comfortable, while the corner living and dining area opens up naturally toward the waterfront views. The primary suite includes a dressing area and a marble bathroom with radiant heated floors and a soaking tub.",
      "Residents also have access to a long list of amenities, including a 24-hour attended lobby, fitness center, rooftop terraces, music room, pet wash, and direct access to nearby Brooklyn Bridge Park. One of the biggest draws, however, was reportedly the private elevator entrance that opens directly into the apartment, adding an extra layer of privacy and security. While busy filming and working in Los Angeles, Zendaya has also reportedly rented out the condo in the past for around $16,000 a month, according to StreetEasy.",
    ],
    image: four_image,
  },
  {
    id: "hollywood-hills",
    number: "5",
    name: "Hollywood Hills",
    photoCredit: "Google Earth",
    paragraphs: [
      "Things appear to be expanding for Zendaya in the Hollywood Hills. Over the last two years, the actress has reportedly picked up two neighboring properties in the area, creating what already looks like the beginnings of a private compound spread across roughly half an acre.",
      "The centerpiece is a fully renovated mid-century modern estate she purchased in 2024 for about $6.5 million. Previously owned by fellow Disney alum Ashley Tisdale and her husband Christopher French, the property spans more than 4,000 square feet and includes five bedrooms and six bathrooms between the main house and guesthouse. Floor-to-ceiling sliding glass doors open directly onto a brick patio, Japanese-inspired gardens, and a kidney-shaped swimming pool.",
      "Then, in early 2026, Zendaya expanded the estate even further with the purchase of the neighboring property for just over $2 million. The nearly 3,000-square-foot fixer-upper has four bedrooms, two bathrooms, and a noticeably more rustic feel. Original wood paneling lines much of the interior, while the heavily landscaped grounds feature winding stone paths and a koi pond tucked into the backyard. The second home is reportedly now undergoing renovations.",
    ],
    image: fifth_image,
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

function SectionHeading({ id, children }) {
  return (
    <h2
      id={id}
      className="scroll-mt-28 font-display text-[26px] leading-tight text-[#1C1A17] md:text-[30px]"
    >
      {children}
    </h2>
  );
}

function PullQuote({ children, attribution }) {
  return (
    <blockquote className="my-8 border-l-2 border-[#A8823F] pl-6">
      <p className="font-display text-[19px] italic leading-snug text-[#1C1A17] md:text-[21px]">
        {children}
      </p>
      {attribution && (
        <cite className="mt-3 block font-sans text-[11px] not-italic uppercase tracking-[0.12em] text-[#7A2E2E]">
          {attribution}
        </cite>
      )}
    </blockquote>
  );
}

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#DDD6C7]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-display text-[17px] text-[#1C1A17] md:text-[18px]">
          {item.q}
        </span>
        <span
          className={`shrink-0 text-xl text-[#7A2E2E] transition-transform duration-200 ${
            isOpen ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen
            ? "grid-rows-[1fr] pb-5 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="font-serif-body text-[15px] leading-relaxed text-[#4A463F] md:text-[16px]">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 1200 520"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="1200" height="520" fill="#EFEAE0" />

      {/* map-like background */}
      <line
        x1="0"
        y1="260"
        x2="1200"
        y2="260"
        stroke="#DDD6C7"
        strokeWidth="1"
      />
      <line
        x1="600"
        y1="0"
        x2="600"
        y2="520"
        stroke="#DDD6C7"
        strokeWidth="1"
      />

      {/* LA side markers */}
      <circle cx="200" cy="300" r="6" fill="#7A2E2E" />
      <text
        x="200"
        y="325"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fill="#4A463F"
      >
        NORTHRIDGE
      </text>

      <circle cx="320" cy="280" r="6" fill="#7A2E2E" />
      <text
        x="320"
        y="305"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fill="#4A463F"
      >
        ENCINO
      </text>

      <circle cx="440" cy="240" r="6" fill="#7A2E2E" />
      <text
        x="440"
        y="265"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fill="#4A463F"
      >
        HOLLYWOOD HILLS
      </text>

      {/* NYC marker */}
      <circle cx="900" cy="200" r="6" fill="#A8823F" />
      <text
        x="900"
        y="225"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fill="#4A463F"
      >
        BROOKLYN
      </text>

      {/* London marker */}
      <circle cx="1050" cy="150" r="6" fill="#1C1A17" />
      <text
        x="1050"
        y="175"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fill="#4A463F"
      >
        LONDON
      </text>

      {/* connection lines */}
      <line
        x1="200"
        y1="300"
        x2="320"
        y2="280"
        stroke="#A8823F"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <line
        x1="320"
        y1="280"
        x2="440"
        y2="240"
        stroke="#A8823F"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* title */}
      <text
        x="600"
        y="60"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="28"
        fill="#1C1A17"
      >
        The $22M Portfolio
      </text>
      <text
        x="600"
        y="85"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="2"
        fill="#7A2E2E"
      >
        LOS ANGELES \u2022 BROOKLYN \u2022 LONDON
      </text>

      {/* value callout */}
      <g>
        <line
          x1="600"
          y1="420"
          x2="600"
          y2="360"
          stroke="#A8823F"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="600" cy="360" r="3" fill="#A8823F" />
        <text
          x="600"
          y="345"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="11"
          letterSpacing="1.5"
          fill="#7A2E2E"
        >
          PORTFOLIO VALUE
        </text>
        <text
          x="600"
          y="325"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize="20"
          fill="#1C1A17"
        >
          ~$22 Million
        </text>
      </g>

      <text
        x="600"
        y="490"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="2"
        fill="#4A463F"
      >
        FROM A CINDERELLA STAIRCASE TO A HOLLYWOOD HILLS COMPOUND
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ZendayaTomHollandPortfolioArticle() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen w-full text-[#1C1A17]">
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
        <h1 className="mt-4 font-display text-[34px] leading-[1.12] text-[#1C1A17] md:text-[46px]">
          {TITLE}
        </h1>

        <img src={hero_image} className="object-cover object-top pt-5" />
        {/* Subtitle */}
        <p className="mt-5 max-w-[680px] font-serif-body text-[17px] leading-relaxed text-[#4A463F] md:text-[18px]">
          {SUBTITLE}
        </p>

        {/* Byline row */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#DDD6C7] pb-6">
          <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#4A463F]">
            {DATE_PUBLISHED} &nbsp;|&nbsp; By {AUTHOR}
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

        {/* Body layout: sidebar + article */}
        <div className="mt-12 flex flex-col gap-10 md:flex-row md:gap-16">
          {/* Sidebar */}
          <aside className="shrink-0 md:w-[220px]">
            <div className="sticky top-10">
              <p className="font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-[#1C1A17]">
                {READ_TIME}
              </p>
              <nav className="mt-5 flex flex-col gap-3 border-l border-[#DDD6C7] pl-4">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="font-sans text-[13px] leading-snug text-[#4A463F] transition-colors hover:text-[#7A2E2E]"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Article body */}
          <article className="min-w-0 flex-1">
            {/* Overview */}
            <section id="overview" className="mb-12 scroll-mt-28">
              <SectionHeading>A Hollywood Power Couple</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Over the last decade, Zendaya and Tom Holland have gone from
                teenage breakout stars to two of the biggest names in
                Hollywood\u2014and along the way, they\u2019ve built a real
                estate portfolio stretching from Los Angeles to London and
                Brooklyn. The pair first met while screen-testing for
                2017\u2019s Spider-Man: Homecoming, where Holland landed the
                role of Peter Parker and Zendaya was cast as MJ. Nearly a decade
                later, both actors are firmly in A-list territory, balancing
                blockbuster franchises, fashion partnerships, and increasingly
                global careers. This summer, they\u2019ll reunite on screen in
                The Odyssey, Christopher Nolan\u2019s adaptation of the Greek
                epic.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Now 29, Zendaya has grown far beyond her Disney Channel roots,
                becoming an Emmy-winning star thanks to projects like Euphoria
                and the Dune films, while also emerging as one of fashion\u2019s
                biggest luxury ambassadors through partnerships with Bulgari and
                Louis Vuitton. Holland, also 29, transformed from a young stage
                actor in London\u2019s Billy Elliot the Musical into
                Marvel\u2019s Spider-Man, later expanding his career with
                projects like The Quiet Room and business ventures including his
                nonalcoholic beer company, Bero Brewing, as well as partnerships
                with Prada.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Their real estate portfolio has grown alongside their careers,
                spanning everything from Zendaya\u2019s first
                Mediterranean-style home in the San Fernando
                Valley\u2014purchased when she was just 20\u2014to a sprawling
                Encino retreat, a waterfront Brooklyn Heights condo, and a
                Hollywood Hills compound. Across the pond, Holland\u2019s
                renovated southwest London home serves as the couple\u2019s U.K.
                base. Altogether, the properties lean far more private and
                understated than flashy celebrity megamansions.
              </p>

              {/* Stat cards */}
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] md:grid-cols-4">
                {PORTFOLIO_STATS.map((stat) => (
                  <div key={stat.label} className="bg-[#F7F4EC] p-5">
                    <p className="font-display text-[24px] leading-none text-[#7A2E2E]">
                      {stat.value}
                    </p>
                    <p className="mt-2 font-sans text-[12px] leading-snug text-[#332F29]">
                      {stat.label}
                    </p>
                    <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.08em] text-[#8A8577]">
                      {stat.source}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Individual property sections */}
            {PROPERTIES.map((property) => (
              <section
                key={property.id}
                id={property.id}
                className="mb-12 scroll-mt-28"
              >
                <SectionHeading id={property.id}>
                  {property.number}. {property.name}
                </SectionHeading>
                <figure className="mt-5">
                  <div className="w-full overflow-hidden rounded-sm border border-[#DDD6C7] bg-[#EFEAE0]">
                    <div className="flex h-[320px] items-center justify-center">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 font-sans text-[12px] text-[#4A463F]">
                    <span className="text-[#1C1A17]">{property.name}</span> —{" "}
                    {property.photoCredit}
                  </figcaption>
                </figure>
                {property.paragraphs.map((para, i) => (
                  <p
                    key={i}
                    className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]"
                  >
                    {para}
                  </p>
                ))}
              </section>
            ))}

            {/* Bottom line */}
            <section id="bottom-line" className="mb-12 scroll-mt-28">
              <SectionHeading>The Bottom Line</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                What stands out most about this portfolio is how carefully it's
                been assembled. Rather than chasing headline-grabbing
                megamansions, both Zendaya and Holland have opted for
                understated, well-located properties that serve real
                purposes\u2014a first home bought at 20, a London base near
                family, a Brooklyn pied-\u00e0-terre with waterfront access, and
                a Hollywood Hills compound that's quietly grown into something
                bigger. At a combined estimated value of roughly $22 million,
                it's a portfolio that reflects taste and timing over flash.
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-4 scroll-mt-28">
              <SectionHeading>
                FAQs: Zendaya and Tom Holland's Property Portfolio
              </SectionHeading>
              <div className="mt-6">
                {FAQS.map((item, i) => (
                  <FaqItem
                    key={item.q}
                    item={item}
                    isOpen={openFaq === i}
                    onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                  />
                ))}
              </div>
            </section>

            {/* Reviewer / disclaimer */}
            <p className="mt-10 border-t border-[#DDD6C7] pt-6 font-sans text-[12px] leading-relaxed text-[#8A8577]">
              Reviewed by {REVIEWER}. This article is for general informational
              purposes and reflects publicly reported information about property
              ownership as of mid-2026. Exact portfolio details may vary.
              Consult real estate professionals for specific guidance.
            </p>
          </article>
        </div>

        {/* CTA banner */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border border-[#1C1A17] bg-[#1C1A17] p-8 text-[#F7F4EC] md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#A8823F]">
              {BRAND_NAME}
            </p>
            <p className="mt-3 max-w-md font-display text-[22px] leading-snug md:text-[24px]">
              Every luxury listing is built around the details today's buyer
              actually cares about.
            </p>
          </div>
          <a
            href={CTA_URL}
            className="shrink-0 whitespace-nowrap border border-[#F7F4EC] px-6 py-3 font-sans text-[13px] uppercase tracking-[0.08em] text-[#F7F4EC] transition-colors hover:bg-[#F7F4EC] hover:text-[#1C1A17]"
          >
            Browse Curated Properties
          </a>
        </div>
      </div>
    </div>
  );
}
