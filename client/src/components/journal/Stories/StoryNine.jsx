import React from "react";
import first_image from "../../../assets/journal/blog_nine/img-01.png";
import second_image from "../../../assets/journal/blog_nine/img-02.png";
import hero_image from "../../../assets/journal/blog_nine/hero.png";

// ---------------------------------------------------------------------------
// Configurable constants — swap these out for handoff / CMS wiring
// ---------------------------------------------------------------------------
const BRAND_NAME = "Otulia";
const EYEBROW = "Real Estate News";
const TITLE =
  "Justin and Hailey Bieber Just Bought a $12 Million N.Y.C. Pied-\u00e0-Terre";
const SUBTITLE =
  "The four-bedroom apartment sits in a curvaceous West Village building overlooking the Hudson River.";
const DATE_PUBLISHED = "16 Jul 2026";
const CTA_URL = "#";

const TOC = [
  { id: "the-deal", label: "The Deal" },
  { id: "the-building", label: "The Building" },
  { id: "the-residence", label: "Inside the Residence" },
  { id: "the-transaction", label: "The Transaction" },
  { id: "amenities", label: "Amenities and Notable Neighbors" },
  { id: "portfolio", label: "Their Real Estate Portfolio" },
];

const AT_A_GLANCE = [
  { label: "Price", value: "$12M" },
  { label: "Size", value: "~2,800 sq ft" },
  { label: "Layout", value: "4 bed / 4.5 bath" },
  { label: "Built", value: "2017" },
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

// Literal <img> placeholder — swap the src for the real asset. Kept in its
// own component so aspect ratio, caption, and credit styling stay consistent.
function ArticleImage({ src, alt, caption, credit }) {
  return (
    <figure className="my-10">
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

export default function BieberNYCCondoArticle() {
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
          alt="Living room of the Bieber's West Village condo overlooking the Hudson River"
          caption="The couple's new West Village living room looks out over the Hudson River."
          credit="Travis Mark; Kevin Mazur/Getty Images for The Recording Academy"
        />

        {/* Body layout: sidebar + article */}
        <div className="mt-2 flex flex-col gap-10 md:flex-row md:gap-16">
          {/* Sidebar */}
          <aside className="shrink-0 md:w-[220px]">
            <div className="sticky top-10">
              <p className="font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-[#1C1A17]">
                5 Minute Read
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
            {/* At a glance callout */}
            <div className="mb-10 border border-[#DDD6C7] bg-[#EFEAE0] p-6">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#7A2E2E]">
                At a Glance
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {AT_A_GLANCE.map((item) => (
                  <div key={item.label}>
                    <p className="font-display text-[20px] text-[#1C1A17]">
                      {item.value}
                    </p>
                    <p className="mt-0.5 font-sans text-[11px] uppercase tracking-[0.06em] text-[#4A463F]">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* The deal */}
            <section id="the-deal" className="mb-12 scroll-mt-28">
              <SectionHeading>The Deal</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Justin and Hailey Bieber have expanded their real estate
                holdings once again, closing on a $12 million condominium in
                Manhattan's West Village. Property records and people familiar
                with the transaction confirm the purchase, which marks the first
                home the couple has owned in New York City.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The purchase lands at a notable moment for both of them: Hailey
                recently completed the sale of her skincare brand, Rhode, in a
                deal reportedly worth over a billion dollars, while Justin has
                released his seventh studio album, Swag II, and headlined this
                year's Coachella festival.
              </p>
            </section>

            {/* The building */}
            <section id="the-building" className="mb-12 scroll-mt-28">
              <SectionHeading>The Building</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The condo sits inside a distinctive Hudson River-facing tower
                developed by the Ian Schrager Company and designed by the
                internationally acclaimed architecture firm Herzog &amp; de
                Meuron, completed in 2017. The building has become known among
                privacy-conscious buyers for its on-site garage and porte
                cochere, which let residents arrive and depart out of public
                view.
              </p>
            </section>

            {/* Interior photo */}
            <ArticleImage
              src={first_image}
              alt="Open dining and kitchen area of the condo with river views"
              caption="The waterfront condo spans roughly 2,800 square feet of living space."
              credit="Travis Mark"
            />

            {/* Inside the residence */}
            <section id="the-residence" className="mb-12 scroll-mt-28">
              <SectionHeading>Inside the Residence</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The listing describes a roughly 2,800-square-foot layout with
                four bedrooms and four-and-a-half bathrooms. One bedroom was
                staged by New York design firm Interior Marketing Group as a
                children's room, complete with a custom chalkboard wall — a
                detail the Biebers reportedly chose to keep for their son, Jack
                Blues.
              </p>
            </section>

            {/* Bedroom photo */}
            <ArticleImage
              src={second_image}
              alt="Bedroom staged as a children's room with a chalkboard wall"
              caption="One bedroom was staged as a children's room, complete with a custom chalkboard wall."
              credit="Travis Mark"
            />

            {/* Transaction */}
            <section id="the-transaction" className="mb-12 scroll-mt-28">
              <SectionHeading>The Transaction</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Records show the seller was Steven Brauser, chairman and CEO of
                Parkland Group, who bought the unit for $10.5 million in 2018.
                He listed it for $12 million in April, and it ultimately traded
                at that full asking price. Adam Heller, Amanda Rosenberg, and
                Michael Gavin of the Heller Organization represented the seller,
                while Romy Hechinger of Compass represented the Biebers.
              </p>
            </section>

            {/* Amenities */}
            <section id="amenities" className="mb-12 scroll-mt-28">
              <SectionHeading>Amenities and Notable Neighbors</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Building residents have access to a 70-foot indoor pool, a
                fitness center, a spa, a children's playroom, and private
                parking. The tower already counts Fanatics founder and CEO
                Michael Rubin among its owners — he paid roughly $43 million for
                a five-bedroom penthouse in 2018, then acquired the adjoining
                penthouse from Ryan Seacrest in 2022 with plans to combine the
                two units.
              </p>
            </section>

            {/* Portfolio */}
            <section id="portfolio" className="mb-4 scroll-mt-28">
              <SectionHeading>Their Real Estate Portfolio</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The New York purchase adds to a coast-to-coast portfolio. The
                couple's primary residence is a roughly $25.8 million estate in
                Los Angeles's exclusive Beverly Park enclave. They also hold a
                $16.6 million property in La Quinta's Madison Club and a
                lakefront retreat in Ontario, Canada, where they spent much of
                the pandemic.
              </p>
            </section>
          </article>
        </div>

        {/* CTA banner */}
        <div className="mt-16 flex flex-col items-start justify-between gap-6 border border-[#1C1A17] bg-[#1C1A17] p-8 text-[#F7F4EC] md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#A8823F]">
              {BRAND_NAME}
            </p>
            <p className="mt-3 max-w-md font-display text-[22px] leading-snug md:text-[24px]">
              Follow the deals shaping the world's most exclusive addresses.
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
