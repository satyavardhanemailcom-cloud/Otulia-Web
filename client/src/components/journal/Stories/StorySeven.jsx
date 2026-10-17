import React, { useState } from "react";
import first_image from "../../../assets/journal/blog_seven/img-01.png";
import second_image from "../../../assets/journal/blog_seven/img-02.png";
import hero_image from "../../../assets/journal/blog_seven/hero.png";

const BRAND_NAME = "Otulia";
const EYEBROW = "Ownership Guides";
const TITLE = "McLaren Just Unveiled Its First New Supercar Since 2024";
const SUBTITLE =
  "The company's first new car since 2024 is the ultimate evolution of the 720S.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Certified Dealer Network";
const DATE_PUBLISHED = "30 Jun 2026";
const READ_TIME = "9 Minute Read";
const CTA_URL = "#";

const TOC = [
  {
    id: "introduction",
    label: "Introduction",
  },
  { id: "insurance", label: "Insurance: Where Luxury and Exotic Diverge" },
  { id: "maintenance", label: "Maintenance: The Cost That Compounds" },
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
  return <img src={hero_image} className="object-top object-cover" />;
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function McLarenSupercar() {
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
            <span className="text-[#1C1A17]">McLaren</span>
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
            {/* Introduction */}
            <section className="mb-12">
              <SectionHeading id="introduction">Introduction</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                McLaren’s first new car in nearly two years sees them return to
                a winning formula.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The British sports car maker unveiled the 788HS on Thursday. It
                is the company’s most refined mid-engine V-8 supercar yet, and
                will also be hard to get, with the company only planning to
                build 200 examples at this point.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The 788HS is the first unveiling we’ve seen from the Woking,
                England-based automaker pulled back the curtain the
                boundary-pushing W1 in the fall of 2024. The company’s latest is
                the ultimate iteration of a V-8-powered supercar that debuted
                under the name of the 720S way back in 2017. The second Super
                Series model evolved to become the 765LT in 2020 and then the
                750S in 2023.
              </p>
              <img src={first_image} className="pt-4" />
            </section>

            {/* Insurance */}
            <section className="mb-12">
              <SectionHeading id="insurance">
                Insurance: Where Luxury and Exotic Diverge Sharply
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The supercar is only the third McLaren to carry the HS, or High
                Sport, suffix. It more than lives up to the distinction. Like
                the three cars that came before it, the 788HS is powered by a
                4.0-liter twin-turbocharged V-8. Thanks to some mechanical
                magic, the mill now makes 777 hp, or 37 hp more than the 750S,
                while torque sits at unchanged 590 ft lbs of torque. Thanks to
                all that oomph, the car can rocket from zero to 60 mph in 2.0
                seconds and zero to 124 mph in 7.8 seconds. Top speed,
                meanwhile, is an extremely respectable 205 mph.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Other mechanical features include a refined suspension and
                carbon-ceramic brakes borrowed from the Senna. The new model is
                also lighter than its direct predecessor. The hard-top version
                tips the scales at just 2,789 pounds, giving it the best
                power-to-weight ratio in the series.
              </p>
              <img src={second_image} className="pt-4" />
            </section>

            {/* Maintenance */}
            <section className="mb-12">
              <SectionHeading id="maintenance">
                Maintenance: The Cost That Compounds After the Warranty Ends
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Although it’s clear that the 788HS and 720S are related, the
                newer car is significantly more aggressive looking. It sports a
                more sculpted shape that includes a new front splitter, an
                S-duct in the hood, and a redesigned rear diffuser. These
                changes mean that vehicle’s carbon-fiber aero package produces
                10 percent more downforce than that of the 765LT. The cabin has
                been left relatively untouched, though it does feature a new
                center console made from carbon fiber, plenty of HS branding,
                and a numbered plaque. Each example will also be customized by
                the McLaren Special Operations team.
              </p>

              <p className="mt-2 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                If the 788HS has caught your eye, time is of the essence.
                McLaren has said it will only build 200 examples of the vehicle,
                100 of which will be coupes, while the other 100 will be
                open-top spyders. The automaker hasn’t said how much its latest
                V-8 will cost, but considering the performance bump, something
                over the 750S’s $365,100 starting price seems likely.
              </p>
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
