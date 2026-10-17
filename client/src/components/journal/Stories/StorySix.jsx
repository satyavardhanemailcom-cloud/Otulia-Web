import React, { useState } from "react";

const BRAND_NAME = "Otulia";
const EYEBROW = "Collector Insight";
const TITLE =
  "Which Exotic Cars Hold Their Value Best? A Guide to Investment-Grade Vehicles";
const SUBTITLE =
  "Most cars lose value the moment they leave the lot. A narrow, well-documented category of exotic and collector vehicles does the opposite — knowing which category a specific car falls into, before you buy, is the entire game.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Certified Dealer Network";
const DATE_PUBLISHED = "30 Jun 2026";
const READ_TIME = "8 Minute Read";
const CTA_URL = "#";

const TOC = [
  {
    id: "what-makes",
    label: "What Actually Makes a Car \u201CInvestment-Grade\u201D",
  },
  { id: "data", label: "The Data: How Much Have These Cars Appreciated?" },
  { id: "models", label: "Which Specific Models Come Up Most Often" },
  { id: "mileage", label: "Why Low Mileage Matters More Here" },
  { id: "risk", label: "The Risk Side of This Equation" },
  { id: "evaluate", label: "How to Evaluate a Potential Purchase" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "What makes an exotic car a good investment instead of just a depreciating luxury purchase?",
    a: "Genuine scarcity (often under 1,000 units produced), historical or technical significance, analog/naturally aspirated engineering that's no longer in production, and well-documented low-mileage condition are the core factors that separate investment-grade exotics from cars that simply depreciate more slowly than average.",
  },
  {
    q: "Do all exotic and supercars appreciate in value?",
    a: "No — most exotic and luxury cars still depreciate, often faster than mainstream vehicles. Appreciation is concentrated in a relatively narrow category of genuinely scarce, historically significant models, not exotic cars broadly.",
  },
  {
    q: "Which exotic cars are most commonly cited as holding value well right now?",
    a: "Models frequently cited by collector-market specialists include the Porsche 911 GT3 RS, Ferrari 812 Competizione, Lamborghini Huracán STO, Bugatti Chiron, Porsche 918 Spyder, and earlier icons like the Ferrari Enzo and F40.",
  },
  {
    q: "Does mileage matter as much for collector exotics as for regular used cars?",
    a: "It matters even more. Low-mileage, well-documented examples consistently command premiums over higher-mileage versions of the same model, since mileage in this segment functions as a proxy for both mechanical condition and preservation quality.",
  },
];

const CORE_FACTORS = [
  {
    title: "Genuine scarcity",
    body: "Limited production runs create real scarcity rather than marketing scarcity. The Ferrari Enzo, for example, was built in just 399 examples between 2002 and 2004, and the Aston Martin One-77's extremely limited production, combined with most examples sitting in long-term private collections, means very few surface on the open market at any given time.",
  },
  {
    title: "Historical or technical significance",
    body: "Cars that represent a genuine turning point — the end of an engineering era, a technological first, or a manufacturer's halo achievement — tend to hold collector interest longer than cars that were simply fast for their time. The Bugatti Veyron, for instance, was the first production car to break 250 mph, an achievement that still anchors its collector significance decades later.",
  },
  {
    title: "Analog, non-electrified engineering",
    body: "As manufacturers shift toward hybrid and electric powertrains, naturally aspirated engines and manual transmissions have become a defining scarcity factor in their own right. The Lamborghini Aventador SVJ's status as the final naturally aspirated V12 Lamborghini — with the brand's transition to hybrid power via the Revuelto — has helped seal its position in the collector market.",
  },
];

const APPRECIATION_STATS = [
  {
    value: "+60%",
    label: "Ferrari F50 value increase in a single year",
    source: "Curated market data",
  },
  {
    value: "12–18%",
    label: "Aventador SVJ annual appreciation, well-maintained",
    source: "Collector-market analysis",
  },
  {
    value: "10–15%",
    label: "Ferrari 458 Speciale annual appreciation",
    source: "Collector-market analysis",
  },
  {
    value: "$1M → $3M+",
    label: "Ferrari F40 auction value, roughly a decade",
    source: "Auction data",
  },
];

const MODELS = [
  {
    name: "Porsche 911 GT3 RS",
    note: "Widely cited as the strongest value-retention performer in the modern Porsche GT lineup, frequently trading above original MSRP.",
  },
  {
    name: "Ferrari 812 Competizione",
    note: "Positioned as a final tribute to Ferrari's pure, non-hybrid V12 architecture.",
  },
  {
    name: "Lamborghini Huracán STO",
    note: "A road-legal, race-derived V10 model gaining recognition as one of the last analog Lamborghinis.",
  },
  {
    name: "Bugatti Chiron",
    note: "Combines hypercar-level performance with significant appreciation potential, per collector-market analysts.",
  },
  {
    name: "Porsche 918 Spyder",
    note: "Limited to 918 examples; the Weissach Package specification commands a particular premium.",
  },
  {
    name: "Ferrari Enzo & F40",
    note: "Long-term cornerstone assets showing steady appreciation through multiple market cycles rather than speculative spikes.",
  },
];

const EVALUATE_STEPS = [
  {
    title: "Check production numbers.",
    body: "Genuine scarcity, not marketing language, is the foundation of long-term value.",
  },
  {
    title: "Confirm the specific specification.",
    body: "Color, transmission type, and factory options can meaningfully change a model's value within its own production run.",
  },
  {
    title: "Verify mileage and maintenance documentation.",
    body: "Low mileage paired with complete service records is the strongest combination for value retention.",
  },
  {
    title: "Research the model's actual price history.",
    body: "Not just current asking prices — this is how you tell whether an appreciation trend is sustained or speculative.",
  },
  {
    title: "Get a specialist pre-purchase inspection.",
    body: "Before finalizing any high-value purchase, regardless of how strong the documentation appears.",
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

// Custom line-art hero illustration: the article's thesis (investment-grade
// exotics are the rare exception moving against the market's normal curve)
// rendered as two diverging value curves from a shared starting point,
// rather than a generic garage-full-of-supercars stock photo.
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 1200 520"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="1200" height="520" fill="#EFEAE0" />

      {/* axes */}
      <line
        x1="160"
        y1="90"
        x2="160"
        y2="420"
        stroke="#C9BFA6"
        strokeWidth="1.5"
      />
      <line
        x1="160"
        y1="260"
        x2="1060"
        y2="260"
        stroke="#C9BFA6"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* shared starting point */}
      <circle cx="220" cy="260" r="5" fill="#1C1A17" />
      <text
        x="220"
        y="240"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fill="#4A463F"
      >
        PURCHASE
      </text>

      {/* typical depreciation curve, descending */}
      <path
        d="M220,260 C400,300 600,340 980,380"
        fill="none"
        stroke="#C9BFA6"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="980" cy="380" r="5" fill="#8A8577" />
      <text
        x="980"
        y="405"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        fill="#4A463F"
      >
        most vehicles
      </text>
      <text
        x="980"
        y="422"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="16"
        fill="#4A463F"
      >
        −20–30% / 5yr
      </text>

      {/* investment-grade curve, ascending */}
      <path
        d="M220,260 C400,220 600,150 980,110"
        fill="none"
        stroke="#7A2E2E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="980" cy="110" r="5" fill="#7A2E2E" />
      <text
        x="980"
        y="90"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        fill="#7A2E2E"
      >
        investment-grade
      </text>
      <text
        x="980"
        y="70"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="18"
        fill="#7A2E2E"
      >
        +10–25% / yr
      </text>

      <text
        x="600"
        y="470"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="2"
        fill="#4A463F"
      >
        THE EXCEPTION, NOT THE RULE
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function InvestmentGradeExoticCarsArticle() {
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
                The {BRAND_NAME} Value Divergence
              </span>{" "}
              — Depreciation vs. Appreciation, 2026
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
                Investment-grade exotic cars are typically defined by extreme
                scarcity (often fewer than 1,000 units produced), historical or
                technical significance, naturally aspirated or analog
                engineering that's no longer being produced, and well-documented
                ownership and maintenance history. Examples cited by
                collector-market specialists include the Porsche 911 GT3 RS,
                Ferrari F40 and F50, and Lamborghini Aventador SVJ — vehicles
                that have appreciated 10–25%+ annually in some cases, compared
                to the 20–30% five-year value loss typical of most vehicles.
              </p>
            </div>

            {/* What makes it investment-grade */}
            <section className="mb-12">
              <SectionHeading id="what-makes">
                What Actually Makes a Car "Investment-Grade"
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Not every expensive or exotic car qualifies. Specific,
                identifiable characteristics separate true investment-grade
                vehicles from high-performance cars that simply depreciate more
                slowly than average. Performance benchmarks provide a baseline —
                generally 0-60 mph in under 4.5 seconds, over 400 horsepower,
                and a top speed exceeding 180 mph — but raw performance numbers
                only tell part of the story.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Three factors matter more than spec sheets:
              </p>
              <div className="mt-6 space-y-6">
                {CORE_FACTORS.map((f) => (
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

            {/* Data */}
            <section className="mb-12">
              <SectionHeading id="data">
                The Data: How Much Have These Cars Actually Appreciated?
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The numbers behind this trend are substantial, not anecdotal.
                According to market analysis reported by Curated, Ferrari F50
                values increased more than 60% in a single year, with average
                sale prices reaching $5.3 million, while a Lamborghini Diablo GT
                with notably high mileage — 63,000 kilometers — still sold for
                $1.4 million, demonstrating that even well-used examples of the
                right models can command record prices.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] md:grid-cols-4">
                {APPRECIATION_STATS.map((stat) => (
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

              <p className="mt-8 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The Aventador SVJ specifically has seen values move up 15–25%
                since 2020, with well-maintained examples appreciating 12–18%
                annually — meaning an SVJ purchased at $500,000 in 2020 could
                command $620,000–$700,000 today. The Ferrari 458 Speciale,
                limited to 499 units, has appreciated 10–15% annually due to the
                increasing scarcity of naturally aspirated V12 Ferraris
                specifically.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Even icons from the late 20th century continue moving. A Ferrari
                F40 that traded for roughly $1 million a decade ago can now
                bring over $3 million at auction, and a Porsche 993 Turbo
                purchased for $250,000 in 2020 might fetch $380,000–$420,000
                today — both figures reflecting how this segment of the market
                has continued strengthening well past the initial hype around
                any single model.
              </p>
            </section>

            {/* Models */}
            <section id="models" className="mb-12 scroll-mt-28">
              <SectionHeading>
                Which Specific Models Come Up Most Often
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Collector-market specialists and dealers consistently point to a
                recurring set of models when discussing current investment-grade
                exotics:
              </p>
              <div className="mt-6 divide-y divide-[#DDD6C7] border-t border-[#DDD6C7]">
                {MODELS.map((m) => (
                  <div
                    key={m.name}
                    className="flex flex-col gap-1 py-4 sm:flex-row sm:gap-8"
                  >
                    <p className="w-full shrink-0 font-display text-[17px] text-[#1C1A17] sm:w-[260px]">
                      {m.name}
                    </p>
                    <p className="font-serif-body text-[15px] leading-relaxed text-[#4A463F]">
                      {m.note}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Mileage */}
            <section className="mb-12">
              <SectionHeading id="mileage">
                Why Low Mileage Matters More Here Than in the Regular Used
                Market
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                In the mainstream used car market, mileage is mostly a
                wear-and-tear proxy. In the collector exotic market, it's
                something closer to a value multiplier. Collector-grade
                supercars with fewer miles typically show less wear on
                mechanical components, interior materials, and performance
                systems, and low-mileage ownership often signals careful
                preservation and stronger documentation of maintenance history —
                both of which directly influence resale value in this segment.
              </p>

              <PullQuote>
                A car with low miles, a single owner, complete service records,
                and a desirable factory specification consistently commands a
                premium over an otherwise identical car missing any one of those
                elements.
              </PullQuote>
            </section>

            {/* Risk */}
            <section className="mb-12">
              <SectionHeading id="risk">
                The Risk Side of This Equation
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                None of this means every exotic car is a safe investment — quite
                the opposite. Most vehicles, including the overwhelming majority
                of luxury and exotic models, still depreciate in the
                conventional sense; see our companion guide on the true cost of
                luxury car ownership for how steep that depreciation curve
                typically is. Investment-grade appreciation is the exception
                within the exotic car category, not the rule, and it's
                concentrated in a relatively narrow set of models with genuine
                scarcity and significance — not simply any car with a high price
                tag or recognizable badge.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                A pre-purchase inspection from a marque specialist matters even
                more here than in a standard used car purchase, since a single
                undisclosed mechanical issue can be expensive enough to
                undermine the entire investment thesis. See our companion guide
                on verifying a luxury car's history and authenticity for the
                specific steps that protect you before you commit.
              </p>
            </section>

            {/* Evaluate */}
            <section id="evaluate" className="mb-12 scroll-mt-28">
              <SectionHeading>
                How to Evaluate a Potential Investment-Grade Purchase
              </SectionHeading>
              <ol className="mt-6 space-y-6">
                {EVALUATE_STEPS.map((step, i) => (
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
                A genuine investment-grade exotic car sits at the intersection
                of scarcity, significance, and documented condition — not simply
                high performance or a recognizable name. The data shows real,
                sustained appreciation in this narrow category, but it also
                shows that most exotic and luxury vehicles still follow the
                conventional depreciation curve. Knowing which category a
                specific car actually falls into, before you buy, is the entire
                game.
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-4 scroll-mt-28">
              <SectionHeading>
                FAQs: Investment-Grade Exotic Cars
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
              purposes only and does not constitute investment or financial
              advice. Collector car values fluctuate based on market conditions,
              condition, documentation, and specific vehicle specification.
              Consult a qualified specialist and conduct independent research
              before making a purchase intended as an investment.
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
              Our curated dealer network specializes in this category, with
              verified history and documentation built into every listing.
            </p>
          </div>
          <a
            href={CTA_URL}
            className="shrink-0 whitespace-nowrap border border-[#F7F4EC] px-6 py-3 font-sans text-[13px] uppercase tracking-[0.08em] text-[#F7F4EC] transition-colors hover:bg-[#F7F4EC] hover:text-[#1C1A17]"
          >
            Browse Curated Vehicles ↗
          </a>
        </div>
      </div>
    </div>
  );
}
