import React, { useState } from "react";

const BRAND_NAME = "Otulia";
const EYEBROW = "Ownership Guides";
const TITLE = "The True Cost of Owning a Luxury Car: Beyond the Purchase Price";
const SUBTITLE =
  "A six-figure price tag is the easiest number to plan for. The harder numbers — depreciation, insurance, and maintenance — are the ones that decide whether a luxury car is affordable to keep, not just to buy.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Certified Dealer Network";
const DATE_PUBLISHED = "30 Jun 2026";
const READ_TIME = "9 Minute Read";
const CTA_URL = "#";

const TOC = [
  {
    id: "depreciation",
    label: "Depreciation: The Cost You Don't Write a Check For",
  },
  { id: "insurance", label: "Insurance: Where Luxury and Exotic Diverge" },
  { id: "maintenance", label: "Maintenance: The Cost That Compounds" },
  { id: "comparison", label: "Quick Comparison Table" },
  { id: "budget", label: "How to Budget Before You Buy" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "Is a luxury car worth the extra cost?",
    a: "It depends on the specific model, how long you plan to keep it, and whether you've budgeted for post-warranty maintenance and insurance — not just the purchase price. Some luxury models hold value and cost relatively little to maintain; others do not.",
  },
  {
    q: "What is the cheapest way to insure a luxury car?",
    a: "State Farm, Travelers, and Progressive are generally among the best-rated insurers for luxury cars, while exotic vehicles typically require a specialty insurer such as Hagerty, Grundy, or PURE. Comparing multiple quotes for the exact model is the most reliable way to find the lowest rate.",
  },
  {
    q: "Do luxury cars always depreciate faster than regular cars?",
    a: "Generally yes, but not universally. A 2026 study of nearly a million vehicle transactions found that only two Porsche models and one Lexus coupe ranked among the top 25 vehicles for value retention — meaning most luxury models depreciate faster than average, but a small number of exceptions exist.",
  },
  {
    q: "How much should I budget annually for a luxury car beyond the loan payment?",
    a: "A reasonable starting point is insurance plus 8–10% of the car's value annually for maintenance reserves once out of warranty, though this varies significantly by brand and model — research the specific vehicle before finalizing a budget.",
  },
];

const BUDGET_STEPS = [
  {
    title: "Get an insurance quote for the exact model first.",
    body: "Rates vary enormously even within a brand — quote the actual VIN or trim, not just \u201Cluxury car insurance.\u201D",
  },
  {
    title: "Ask for the out-of-warranty service schedule.",
    body: "A dealer or specialist shop can tell you what years 5–10 actually cost, not just the complimentary-maintenance years.",
  },
  {
    title: "Research the specific model's depreciation curve.",
    body: "Some luxury models hold value far better than others within the same brand.",
  },
  {
    title:
      "Factor in mileage caps if you're considering an agreed-value policy.",
    body: "If you plan to drive the car regularly, confirm the policy supports your expected mileage without a penalty.",
  },
  {
    title: "Build a separate maintenance reserve.",
    body: "Many owners budget a fixed monthly amount specifically for the post-warranty repair years.",
  },
];

const COMPARISON_ROWS = [
  {
    category: "Annual Insurance",
    mainstream: "~$1,600–$2,300",
    luxury: "~$2,700–$3,700+",
    exotic: "$5,000–$60,000+",
  },
  {
    category: "Annual Maintenance (post-warranty)",
    mainstream: "~$580–$630",
    luxury: "~$1,600–$3,500",
    exotic: "Often $5,000+",
  },
  {
    category: "5-Year Depreciation",
    mainstream: "~40–55% of value",
    luxury: "Often 50%+ of value",
    exotic: "Highly model-dependent; some hold value",
  },
  {
    category: "Mileage Restrictions",
    mainstream: "None typical",
    luxury: "Rare",
    exotic: "Common (2,500–5,000 mi/yr on specialty policies)",
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

// Custom line-art hero illustration: the article's thesis (three hidden costs
// trailing behind the purchase) rendered as annotated callouts on a car silhouette.
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 1200 520"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="1200" height="520" fill="#EFEAE0" />
      {/* horizon */}
      <line
        x1="0"
        y1="400"
        x2="1200"
        y2="400"
        stroke="#DDD6C7"
        strokeWidth="1"
      />
      {/* road */}
      <rect x="0" y="400" width="1200" height="120" fill="#E4DECE" />
      <line
        x1="0"
        y1="430"
        x2="1200"
        y2="430"
        stroke="#C9BFA6"
        strokeWidth="2"
        strokeDasharray="18 14"
      />

      {/* car silhouette (side profile, simplified luxury coupe) */}
      <g
        stroke="#1C1A17"
        strokeWidth="2.5"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <path d="M230 400 C230 360 260 345 300 340 L360 300 C395 275 440 260 500 260 L700 260 C750 260 790 278 820 305 L870 340 C930 345 965 365 970 400" />
        <path d="M360 300 L410 262" />
        <path d="M480 262 L470 300" />
        <path d="M470 300 L700 300" />
        <path d="M700 300 L760 262" />
        <path d="M230 400 L970 400" />
      </g>
      <circle cx="340" cy="400" r="38" fill="#1C1A17" />
      <circle cx="340" cy="400" r="15" fill="#EFEAE0" />
      <circle cx="860" cy="400" r="38" fill="#1C1A17" />
      <circle cx="860" cy="400" r="15" fill="#EFEAE0" />

      {/* callout: depreciation */}
      <g>
        <line
          x1="420"
          y1="290"
          x2="420"
          y2="150"
          stroke="#A8823F"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="420" cy="150" r="3" fill="#A8823F" />
        <text
          x="420"
          y="120"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          letterSpacing="1.5"
          fill="#7A2E2E"
        >
          DEPRECIATION
        </text>
        <text
          x="420"
          y="100"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize="26"
          fill="#1C1A17"
        >
          −55%
        </text>
        <text
          x="420"
          y="80"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="11"
          fill="#4A463F"
        >
          first 5 years, avg.
        </text>
      </g>

      {/* callout: insurance */}
      <g>
        <line
          x1="620"
          y1="256"
          x2="620"
          y2="90"
          stroke="#A8823F"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="620" cy="90" r="3" fill="#A8823F" />
        <text
          x="620"
          y="60"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          letterSpacing="1.5"
          fill="#7A2E2E"
        >
          INSURANCE
        </text>
        <text
          x="620"
          y="40"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize="26"
          fill="#1C1A17"
        >
          $1K–$60K+
        </text>
        <text
          x="620"
          y="20"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="11"
          fill="#4A463F"
        >
          per year, by segment
        </text>
      </g>

      {/* callout: maintenance */}
      <g>
        <line
          x1="830"
          y1="300"
          x2="880"
          y2="150"
          stroke="#A8823F"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="880" cy="150" r="3" fill="#A8823F" />
        <text
          x="880"
          y="120"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          letterSpacing="1.5"
          fill="#7A2E2E"
        >
          MAINTENANCE
        </text>
        <text
          x="880"
          y="100"
          textAnchor="middle"
          fontFamily="Fraunces, serif"
          fontSize="26"
          fill="#1C1A17"
        >
          2–3×
        </text>
        <text
          x="880"
          y="80"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="11"
          fill="#4A463F"
        >
          cost of non-luxury
        </text>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LuxuryCarCostArticle() {
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
                The {BRAND_NAME} True Cost Index
              </span>{" "}
              — Depreciation, Insurance &amp; Maintenance, 2026
            </span>
            <a
              href={CTA_URL}
              className="text-[#7A2E2E] underline decoration-[#DDD6C7] underline-offset-4 hover:decoration-[#7A2E2E]"
            >
              View methodology ↗
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
            {/* Quick answer callout */}
            <div className="mb-10 border border-[#DDD6C7] bg-[#EFEAE0] p-6">
              <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#7A2E2E]">
                Quick Answer
              </p>
              <p className="mt-3 font-serif-body text-[15px] leading-relaxed text-[#1C1A17] md:text-[16px]">
                Beyond the purchase price, expect three major recurring costs:
                depreciation (luxury vehicles often lose value faster than
                mainstream cars), insurance (luxury models can run $1,000+ more
                per year than a standard sedan, while exotic brands like Ferrari
                or Lamborghini can run $5,000–$20,000+ annually), and
                maintenance (luxury brands frequently cost two to three times
                more to maintain than non-luxury brands once the factory
                warranty expires). Together, these three categories — not the
                sticker price — typically determine whether a luxury car is
                affordable to keep, not just to buy.
              </p>
            </div>

            {/* Depreciation */}
            <section className="mb-12">
              <SectionHeading id="depreciation">
                Depreciation: The Cost You Don't Write a Check For
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Depreciation is the single largest expense of owning any car —
                luxury or not — but it hits differently in this segment.
                Industry data is consistent on the broad pattern: most vehicles
                lose about 20% or more of their original value in the first
                year, and new cars often shed about 55% of their original
                purchase price within the first five years.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Luxury and performance vehicles tend to sit on the steeper end
                of that curve. As U.S. News &amp; World Report notes, luxury
                models and electric vehicles depreciate the quickest, while
                smaller, reliable vehicles from nonluxury brands hold their
                value better. A 2026 analysis cited by The Car Guide found that
                across nearly a million vehicle transactions, the only luxury
                models to crack the top 25 for value retention were two Porsches
                and one Lexus coupe — meaning the vast majority of luxury
                vehicles depreciated faster than the broader market.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The exception worth knowing about: a small number of
                limited-production and collector-grade vehicles buck this trend
                entirely and can hold value or even appreciate. That's a
                separate conversation from typical luxury depreciation — see our
                companion guide on investment-grade exotic cars for which
                specific models fall into that category.
              </p>
            </section>

            {/* Insurance */}
            <section className="mb-12">
              <SectionHeading id="insurance">
                Insurance: Where Luxury and Exotic Diverge Sharply
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                This is the category where "luxury" and "exotic" stop being
                interchangeable terms and start being two very different
                budgets.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Luxury vehicles (BMW, Mercedes-Benz, Lexus, Audi, etc.) carry a
                real but moderate premium over mainstream cars. Luxury and
                performance models cost over $1,000 more annually than reliable
                sedans, SUVs, or minivans, according to 2026 industry data.
                Full-coverage insurance runs about $865/year for a Cadillac
                Escalade, $796/year for a BMW 330i, and $793/year for a Tesla
                Model 3, while practical models like the Subaru Outback or Honda
                Odyssey average several hundred dollars less per year.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Exotic and ultra-luxury vehicles (Ferrari, Lamborghini, Bugatti,
                McLaren) are an entirely different category. Lamborghini drivers
                can expect to pay around $516 per month for full-coverage
                insurance, while the average cost of full-coverage insurance for
                a Ferrari is about $601 per month.
              </p>

              <PullQuote>
                At the very top of the market, insurance for a Bugatti can range
                from around $4,000 to $5,000 per month — meaning insurance alone
                can exceed $50,000 a year before a single mile is driven.
              </PullQuote>

              <p className="mt-2 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                A few structural factors drive this gap:
              </p>
              <ul className="mt-4 space-y-4 border-l border-[#DDD6C7] pl-6">
                <li className="font-serif-body text-[16px] leading-[1.7] text-[#332F29]">
                  <span className="font-sans font-medium text-[#1C1A17]">
                    Specialized parts and labor.
                  </span>{" "}
                  Due to their extra-high value and need for exceedingly
                  expensive repairs and maintenance, exotic cars cost much more
                  to insure than everyday cars.
                </li>
                <li className="font-serif-body text-[16px] leading-[1.7] text-[#332F29]">
                  <span className="font-sans font-medium text-[#1C1A17]">
                    Agreed-value coverage.
                  </span>{" "}
                  Most specialty insurers use this model instead of standard
                  depreciation-based payouts — paying the preset figure without
                  factoring in depreciation, versus actual cash value coverage,
                  which pays what a totaled exotic is worth on paper that exact
                  day. Agreed-value is almost always the better fit for an
                  appreciating or slow-depreciating exotic.
                </li>
                <li className="font-serif-body text-[16px] leading-[1.7] text-[#332F29]">
                  <span className="font-sans font-medium text-[#1C1A17]">
                    Mileage caps.
                  </span>{" "}
                  Specialty exotic car policies typically cap annual mileage at
                  2,500 to 5,000 miles, and driving more than that can trigger a
                  premium increase of 25% to 40%.
                </li>
                <li className="font-serif-body text-[16px] leading-[1.7] text-[#332F29]">
                  <span className="font-sans font-medium text-[#1C1A17]">
                    Limited insurer pool.
                  </span>{" "}
                  Very few insurance companies in the United States are willing
                  to insure ultra-exotic brands like Ferrari and Lamborghini,
                  and those that do are highly selective about which models they
                  cover.
                </li>
              </ul>
            </section>

            {/* Maintenance */}
            <section className="mb-12">
              <SectionHeading id="maintenance">
                Maintenance: The Cost That Compounds After the Warranty Ends
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Routine maintenance on a luxury car looks deceptively manageable
                in years one through three — largely because it isn't being paid
                for the same way. Several luxury brands have complimentary
                maintenance periods on new vehicles, and cars typically need
                very little work in the first couple of years beyond an oil
                change and tire rotation, with nearly all new-car warranties
                lasting at least three years. The real cost shows up later.
              </p>

              <PullQuote attribution="Consumer Reports, Auto Data Lead">
                Costs can skyrocket when the warranty and free maintenance
                periods expire — expensive luxury vehicles are often quite
                expensive to maintain over time.
              </PullQuote>

              <p className="mt-2 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The brand-to-brand gap is significant. Several European luxury
                marques — Audi, BMW, Land Rover, Mercedes-Benz, Porsche, and
                Volvo — cluster at the most expensive end of Consumer Reports'
                10-year cost rankings. BMW and Audi 10-year maintenance costs
                approach or exceed $9,500 to nearly $10,000, while
                Mercedes-Benz, Porsche, and Land Rover extend into the
                double-digit thousands — with Land Rover's average reaching
                about $19,250 over ten years.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Day-to-day repair costs reflect the same gap. A Honda owner
                spends roughly $583 per year on maintenance, while a Porsche
                owner spends nearly three times that, at $1,623. A basic oil
                change on a Porsche 911 can run $400 to $600 because the oil is
                specialized synthetic and the labor is meticulous, and a
                Mercedes E-Class costs roughly three times more per year to
                maintain than a Toyota Camry, adding up to about $6,000 in extra
                expense over five years.
              </p>
            </section>

            {/* Comparison table */}
            <section id="comparison" className="mb-12 scroll-mt-28">
              <SectionHeading>
                Luxury Car True Cost of Ownership: Quick Comparison
              </SectionHeading>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse font-sans text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-[#1C1A17]">
                      <th className="py-3 pr-4 text-left font-medium uppercase tracking-[0.06em] text-[#1C1A17]">
                        Cost Category
                      </th>
                      <th className="py-3 pr-4 text-left font-medium uppercase tracking-[0.06em] text-[#1C1A17]">
                        Mainstream
                      </th>
                      <th className="py-3 pr-4 text-left font-medium uppercase tracking-[0.06em] text-[#1C1A17]">
                        Luxury
                      </th>
                      <th className="py-3 text-left font-medium uppercase tracking-[0.06em] text-[#7A2E2E]">
                        Exotic / Ultra-Luxury
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, i) => (
                      <tr
                        key={row.category}
                        className={
                          i !== COMPARISON_ROWS.length - 1
                            ? "border-b border-[#DDD6C7]"
                            : ""
                        }
                      >
                        <td className="py-4 pr-4 text-[#1C1A17]">
                          {row.category}
                        </td>
                        <td className="py-4 pr-4 text-[#4A463F]">
                          {row.mainstream}
                        </td>
                        <td className="py-4 pr-4 text-[#4A463F]">
                          {row.luxury}
                        </td>
                        <td className="py-4 font-medium text-[#7A2E2E]">
                          {row.exotic}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 font-sans text-[12px] italic text-[#4A463F]">
                Figures are national averages drawn from the sources cited
                throughout this article; your actual costs will depend on the
                specific make, model, location, and driving profile.
              </p>
            </section>

            {/* Budget steps */}
            <section id="budget" className="mb-12 scroll-mt-28">
              <SectionHeading>
                How to Budget for Luxury Car Ownership Before You Buy
              </SectionHeading>
              <ol className="mt-6 space-y-6">
                {BUDGET_STEPS.map((step, i) => (
                  <li key={step.title} className="flex gap-5">
                    <span className="font-display text-[22px] leading-none text-[#A8823F]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-sans text-[15px] font-medium text-[#1C1A17]">
                        {step.title}
                      </p>
                      <p className="mt-1 font-serif-body text-[15px] leading-relaxed text-[#4A463F]">
                        {step.body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Bottom line */}
            <section className="mb-12">
              <SectionHeading>The Bottom Line</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The purchase price of a luxury car is the smallest number in the
                real budget. Depreciation, insurance, and maintenance — taken
                together over five to ten years — routinely add up to more than
                the car cost to buy in the first place. None of that should
                discourage luxury ownership; it should just inform which car,
                which insurer, and how much reserve you build before you sign.
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-4 scroll-mt-28">
              <SectionHeading>FAQs: Luxury Car Ownership Costs</SectionHeading>
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
              purposes and does not constitute financial or insurance advice.
              Cost figures are based on national industry averages as of 2026
              and will vary by vehicle, location, and individual circumstances.
              Always obtain a personalized quote before purchasing.
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
              Every listing includes the detail you need to run this calculation
              with real numbers, not guesses.
            </p>
          </div>
          <a
            href={CTA_URL}
            className="shrink-0 whitespace-nowrap border border-[#F7F4EC] px-6 py-3 font-sans text-[13px] uppercase tracking-[0.08em] text-[#F7F4EC] transition-colors hover:bg-[#F7F4EC] hover:text-[#1C1A17]"
          >
            Browse Verified Listings ↗
          </a>
        </div>
      </div>
    </div>
  );
}
