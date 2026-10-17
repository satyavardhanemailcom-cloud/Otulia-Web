import React, { useState } from "react";
import hero_image from "../../../assets/journal/blog_twelve/hero_image.webp";

const BRAND_NAME = "Otulia";
const EYEBROW = "Celebrity Real Estate";
const TITLE =
  "Hollywood Star Terry Crews Buys Luxury Residence at Binghatti Aquarise in Dubai";
const SUBTITLE =
  "Binghatti Developers has welcomed another global icon to its international portfolio of buyers, as Hollywood actor and television personality Terry Crews officially signed for an apartment at Binghatti Aquarise during the project's grand launch in Dubai.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Luxury Property Network";
const DATE_PUBLISHED = "28 July 2026";
const READ_TIME = "6 Minute Read";
const CTA_URL = "#";

const TOC = [
  { id: "signing", label: "A Star-Studded Signing" },
  { id: "project", label: "The Project: Binghatti Aquarise" },
  { id: "amenities", label: "Resort-Style Living in Business Bay" },
  { id: "celebrity-trust", label: "A Track Record of Celebrity Trust" },
  { id: "about-binghatti", label: "About Binghatti Developers" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "What is Binghatti Aquarise?",
    a: "Binghatti Aquarise is a new luxury residential development in Business Bay, Dubai, comprising 1,598 units ranging from studios to exclusive royal suites. The project features a 27,000+ square foot artificial beach, a 44-meter infinity pool with Burj Khalifa views, and an oval-shaped indoor gym. It is scheduled for completion by March 2027.",
  },
  {
    q: "Which celebrities have purchased at Binghatti developments?",
    a: "Binghatti's international celebrity homeowners include soccer star Neymar Jr., opera legend Andrea Bocelli, and footballer Aymeric Laporte, in addition to Terry Crews. These signings reinforce the brand's position as a leading force in luxury real estate with international appeal.",
  },
  {
    q: "When is Binghatti Aquarise scheduled for completion?",
    a: "Binghatti Aquarise is scheduled for completion by March 2027. Construction had already commenced as of the project's grand launch in May 2025, reflecting Binghatti's reputation as the UAE's fastest-growing and most dynamic real estate developer.",
  },
  {
    q: "What amenities does Binghatti Aquarise offer?",
    a: "Key amenities include a sprawling 27,000+ square foot artificial beach, a 44-meter by 12-meter infinity pool with panoramic Burj Khalifa views, an oval-shaped indoor gym designed as a wellness space, and a diverse selection of premium residential units including studios, 1- to 4-bedroom apartments, and royal suites.",
  },
  {
    q: "Who is Binghatti Developers?",
    a: "Binghatti Developers is a prestigious Emirati real estate brand with a portfolio of 80 projects valued at over AED 50 billion. Led by Chairman Muhammad Binghatti, the company has delivered more than 11,000 residential units and has collaborated with global brands such as Bugatti, Mercedes-Benz, and Jacob & Co.",
  },
];

const PROJECT_FEATURES = [
  {
    title: "27,000+ sq ft Artificial Beach",
    body: "A curated shoreline experience within the city, offering residents a resort-style beach lifestyle without leaving Business Bay.",
  },
  {
    title: "44-Meter Infinity Pool",
    body: "Measuring 44 meters in length and 12 meters in width, the infinity pool provides sweeping panoramic views of the Burj Khalifa and surrounding skyline.",
  },
  {
    title: "Oval-Shaped Indoor Gym",
    body: "A wellness space designed as a sculptural form that blends function with fluid architecture, redefining what a residential gym can be.",
  },
  {
    title: "1,598 Premium Units",
    body: "A diverse selection ranging from studios and 1- to 2-bedroom apartments to ultra-spacious 3- to 4-bedroom residences and exclusive royal suites.",
  },
];

const CELEBRITY_BUYERS = [
  {
    name: "Neymar Jr.",
    note: "Brazilian soccer superstar and one of the most recognizable athletes in the world.",
  },
  {
    name: "Andrea Bocelli",
    note: "Legendary Italian opera tenor and one of the most celebrated classical musicians of our time.",
  },
  {
    name: "Aymeric Laporte",
    note: "Spanish professional footballer who has played for Manchester City and the Spanish national team.",
  },
  {
    name: "Terry Crews",
    note: "Hollywood actor, television personality, and former NFL player known for his roles in Brooklyn Nine-Nine and The Expendables.",
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
  return <img src={hero_image} className="object-cover object-top" />;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TerryCrewsBinghattiArticle() {
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

        {/* Hero illustration */}
        <figure className="mt-8">
          <div className="aspect-[1200/520] w-full overflow-hidden rounded-sm border border-[#DDD6C7]">
            <HeroIllustration />
          </div>
          <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-2 font-sans text-[12px] text-[#4A463F]">
            <span>
              <span className="text-[#1C1A17]">
                The {BRAND_NAME} Property Index
              </span>{" "}
              — Binghatti Aquarise, Business Bay, 2025
            </span>
            <a
              href={CTA_URL}
              className="text-[#7A2E2E] underline decoration-[#DDD6C7] underline-offset-4 hover:decoration-[#7A2E2E]"
            >
              View source
            </a>
          </figcaption>
        </figure>

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
            {/* The Signing */}
            <section id="signing" className="mb-12 scroll-mt-28">
              <SectionHeading>A Star-Studded Signing</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The landmark signing took place live on stage at the Coca-Cola
                Arena, where Terry Crews was also the exclusive host of the
                event. The high-energy launch attracted over 12,000 attendees,
                including VIP investors, top brokers, and representatives from
                leading global firms.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                This signing joins Binghatti's growing list of international
                celebrity homeowners, reaffirming the brand's position as a
                leading force in luxury real estate with international appeal.
              </p>

              <PullQuote attribution="Muhammad Binghatti, Chairman, Binghatti Developers">
                We are thrilled to welcome Terry Crews to the community of
                homeowners at Binghatti Aquarise. This milestone reflects the
                rising confidence in our visionary developments and further
                cements Dubai's status as a premier global hub for luxury
                living.
              </PullQuote>

              <p className="mt-2 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The evening also featured a special surprise as Terry Crews
                unveiled a live video feed from the Binghatti Aquarise
                construction site, revealing that work had already commenced.
                This symbolic moment marked the official start of the project's
                development, scheduled for completion by March 2027.
              </p>
            </section>

            {/* The Project */}
            <section id="project" className="mb-12 scroll-mt-28">
              <SectionHeading>The Project: Binghatti Aquarise</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Binghatti Aquarise is set to become a new architectural landmark
                in Business Bay. The project comprises 1,598 units, offering a
                diverse selection of premium studios, 1- and 2-bedroom
                apartments, ultra-spacious 3- and 4-bedroom residences, and
                exclusive royal suites. It introduces an entirely new standard
                of residential resort living to the heart of Dubai.
              </p>

              {/* Stat cards */}
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] md:grid-cols-4">
                <div className="bg-[#F7F4EC] p-5">
                  <p className="font-display text-[24px] leading-none text-[#7A2E2E]">
                    1,598
                  </p>
                  <p className="mt-2 font-sans text-[12px] leading-snug text-[#332F29]">
                    total residential units
                  </p>
                  <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.08em] text-[#8A8577]">
                    Binghatti
                  </p>
                </div>
                <div className="bg-[#F7F4EC] p-5">
                  <p className="font-display text-[24px] leading-none text-[#7A2E2E]">
                    27,000+
                  </p>
                  <p className="mt-2 font-sans text-[12px] leading-snug text-[#332F29]">
                    sq ft artificial beach
                  </p>
                  <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.08em] text-[#8A8577]">
                    Binghatti
                  </p>
                </div>
                <div className="bg-[#F7F4EC] p-5">
                  <p className="font-display text-[24px] leading-none text-[#7A2E2E]">
                    44m
                  </p>
                  <p className="mt-2 font-sans text-[12px] leading-snug text-[#332F29]">
                    infinity pool length
                  </p>
                  <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.08em] text-[#8A8577]">
                    Binghatti
                  </p>
                </div>
                <div className="bg-[#F7F4EC] p-5">
                  <p className="font-display text-[24px] leading-none text-[#7A2E2E]">
                    Mar 2027
                  </p>
                  <p className="mt-2 font-sans text-[12px] leading-snug text-[#332F29]">
                    scheduled completion
                  </p>
                  <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.08em] text-[#8A8577]">
                    Binghatti
                  </p>
                </div>
              </div>
            </section>

            {/* Amenities */}
            <section id="amenities" className="mb-12 scroll-mt-28">
              <SectionHeading>
                Resort-Style Living in Business Bay
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                One of the project's most notable features is a sprawling
                27,000+ square foot artificial beach, offering residents a
                curated shoreline experience within the city. Adding to its
                standout features, the project boasts an oval-shaped indoor gym,
                designed as a wellness space that blends function with fluid
                design.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Binghatti Aquarise also features an infinity pool measuring 44
                meters in length and 12 meters in width, providing sweeping
                panoramic views of the Burj Khalifa and surrounding skyline,
                offering both leisure and spectacle in one experience.
              </p>

              <div className="mt-6 space-y-6">
                {PROJECT_FEATURES.map((f) => (
                  <div key={f.title} className="border-l border-[#DDD6C7] pl-6">
                    <p className="font-sans text-[15px] font-medium text-[#1C1A17]">
                      {f.title}
                    </p>
                    <p className="mt-1.5 font-serif-body text-[15px] leading-relaxed text-[#4A463F]">
                      {f.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Celebrity Trust */}
            <section id="celebrity-trust" className="mb-12 scroll-mt-28">
              <SectionHeading>A Track Record of Celebrity Trust</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Terry Crews is the latest in a growing line of international
                celebrities who have chosen Binghatti for their Dubai
                residences. The brand's collaboration with global icons
                reinforces its position as a developer that appeals to
                high-profile buyers seeking both luxury and architectural
                distinction.
              </p>

              <div className="mt-6 divide-y divide-[#DDD6C7] border-t border-[#DDD6C7]">
                {CELEBRITY_BUYERS.map((buyer) => (
                  <div
                    key={buyer.name}
                    className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8"
                  >
                    <p className="w-full shrink-0 font-display text-[17px] text-[#1C1A17] sm:w-[200px]">
                      {buyer.name}
                    </p>
                    <p className="font-serif-body text-[15px] leading-relaxed text-[#4A463F]">
                      {buyer.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* About Binghatti */}
            <section id="about-binghatti" className="mb-12 scroll-mt-28">
              <SectionHeading>About Binghatti Developers</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Binghatti Developers is a prestigious Emirati brand in the field
                of real estate development, holding a leading position thanks to
                its portfolio of 80 projects with a value of over AED 50
                billion. The company is led by Chairman Muhammad Binghatti who,
                through his innovative vision, aims to deliver luxury projects
                that reflect refined artistic taste and high standards in design
                and quality.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Binghatti has successfully delivered more than 11,000
                residential units by 2024, achieving notable accomplishments in
                collaboration with global brands such as Bugatti, Mercedes-Benz,
                and Jacob & Co. The company continues to expand its real estate
                portfolio to meet the increasing market aspirations, with a
                focus on delivering residential projects that elevate the level
                of luxury in Dubai.
              </p>

              <PullQuote attribution="Muhammad Binghatti, Chairman">
                With its visionary features, strategic location, and endorsement
                from global icons, Binghatti Aquarise stands as a bold new
                chapter in Dubai's urban evolution. More than just a
                development, it represents a future-forward lifestyle defined by
                luxury, curated amenities, and resort-inspired living.
              </PullQuote>
            </section>

            {/* Bottom line */}
            <section className="mb-12">
              <SectionHeading>The Bottom Line</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                With its visionary features, strategic location in Business Bay,
                and endorsement from global icons like Terry Crews, Binghatti
                Aquarise represents a future-forward lifestyle defined by
                luxury, curated amenities, and resort-inspired living. For
                buyers looking at Dubai's evolving luxury landscape, the project
                signals where the market is heading — not just residential
                towers, but fully curated lifestyle destinations.
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-4 scroll-mt-28">
              <SectionHeading>
                FAQs: Binghatti Aquarise and Celebrity Real Estate in Dubai
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
              purposes and reflects publicly available information as of the
              stated publication date. Project details, timelines, and pricing
              are subject to change. Consult a licensed real estate professional
              for specific guidance.
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
