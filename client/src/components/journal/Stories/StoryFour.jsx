import React, { useState } from "react";

const BRAND_NAME = "Otulia";
const EYEBROW = "Market Intelligence";
const TITLE =
  "Luxury Real Estate Trends 2026: What Buyers and Sellers Need to Know";
const SUBTITLE =
  "Wealth concentration, a generational transfer, and a buyer base that prioritizes how a home supports their life over how large it looks on paper — the luxury market is no longer following the same script as everyone else.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Luxury Property Network";
const DATE_PUBLISHED = "30 Jun 2026";
const READ_TIME = "8 Minute Read";
const CTA_URL = "#";

const TOC = [
  {
    id: "wealth",
    label: "Wealth Is Concentrating — and Moving to Real Estate",
  },
  { id: "lifestyle", label: "Lifestyle Now Outranks Location and Size" },
  { id: "cash", label: "Cash Is Still King at the Top of the Market" },
  { id: "global", label: "Global Demand Remains Concentrated" },
  { id: "buying-selling", label: "What This Means for Buyers and Sellers" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "Is the luxury real estate market slowing down in 2026?",
    a: "Not exactly — it's normalizing rather than slowing. Christie's International Real Estate's 2026 Prime Sentiment Index shows buyer demand cooling slightly from 2025's unusually strong levels, while price outlook and inventory metrics are actually improving, which most analysts describe as a healthier, more balanced market rather than a weak one.",
  },
  {
    q: "Why are luxury buyers getting younger?",
    a: "A historic generational wealth transfer — estimated at roughly $6 trillion — is moving wealth to millennial and Gen X buyers, and Sotheby's International Realty reports a growing share of millennial clients, especially in the $5 million-and-above segment.",
  },
  {
    q: "What home features matter most to luxury buyers in 2026?",
    a: "Wellness infrastructure (air/water filtration, fitness and recovery spaces), multigenerational layouts, and privacy/security features rank among the top priorities, according to Sotheby's International Realty's 2026 Mid-Year Luxury Outlook report.",
  },
  {
    q: "Do luxury buyers still use mortgages?",
    a: "Some do, but high-net-worth buyers are increasingly purchasing with cash, which insulates them from mortgage rate fluctuations that affect the broader housing market. This is one of the key reasons luxury real estate has continued to outperform the general housing market.",
  },
];

const STAT_CARDS = [
  {
    value: "$54T",
    label: "net worth of the top 1% of Americans, Q3 2025",
    source: "Federal Reserve / Sotheby's",
  },
  {
    value: "$6T",
    label: "estimated generational wealth transfer underway",
    source: "Sotheby's, 2026 Outlook",
  },
  {
    value: "73%",
    label: "of agents in the $5M+ segment report more millennial clients",
    source: "Sotheby's, 2026",
  },
  {
    value: "62%",
    label: "of professionals cite lifestyle as the top purchase factor",
    source: "Sotheby's, 2026",
  },
];

const LIFESTYLE_DRIVERS = [
  {
    title: "Wellness infrastructure",
    body: "Now a baseline expectation, not a premium add-on. The global wellness real estate sector has more than doubled in five years and is projected to surpass $1.1 trillion by 2029, and nearly 38% of agents working in the $10 million-and-above segment report aging-in-place features as a growing buyer priority.",
  },
  {
    title: "Multigenerational layouts",
    body: "Roughly one in five U.S. home purchases now involve buyers planning to live with extended family, and in markets like Miami and New York, there's specific demand for adjoining apartments that can be combined into multigenerational suites.",
  },
  {
    title: "Privacy and security",
    body: "In a 2026 Sotheby's agent survey, 81% of agents said security and privacy were a top concern for luxury homebuyers — even as overall home burglaries have fallen significantly over the past three decades.",
  },
  {
    title: "\u201CQuiet luxury\u201D over the mega-mansion era",
    body: "Industry voices, including Corcoran Group CEO Pamela Liebman, point to smaller, more refined homes overtaking sheer square footage as the new status marker, with design quality and functionality driving buyer interest over scale.",
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

// Custom line-art hero illustration: the article's thesis (the market is
// normalizing, not weakening, while wealth quietly transfers to a younger
// buyer) rendered as the actual Prime Sentiment Index trend line paired with
// a generational transfer marker, rather than a generic skyline stock photo.
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 1200 520"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="1200" height="520" fill="#EFEAE0" />

      {/* chart axes */}
      <line
        x1="140"
        y1="120"
        x2="140"
        y2="380"
        stroke="#C9BFA6"
        strokeWidth="1.5"
      />
      <line
        x1="140"
        y1="380"
        x2="1060"
        y2="380"
        stroke="#C9BFA6"
        strokeWidth="1.5"
      />

      {/* index trend line: 37.7 (2025) -> 29.3 (2026) */}
      <polyline
        points="200,160 360,190 520,225 680,255 840,280 980,300"
        fill="none"
        stroke="#7A2E2E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="200" cy="160" r="5" fill="#7A2E2E" />
      <circle cx="980" cy="300" r="5" fill="#7A2E2E" />

      <text
        x="200"
        y="140"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="20"
        fill="#1C1A17"
      >
        37.7
      </text>
      <text
        x="200"
        y="120"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        letterSpacing="1"
        fill="#4A463F"
      >
        2025
      </text>

      <text
        x="980"
        y="280"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="20"
        fill="#1C1A17"
      >
        29.3
      </text>
      <text
        x="980"
        y="335"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        letterSpacing="1"
        fill="#4A463F"
      >
        2026
      </text>

      <text
        x="600"
        y="70"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="2"
        fill="#7A2E2E"
      >
        CHRISTIE'S PRIME SENTIMENT INDEX
      </text>
      <text
        x="600"
        y="440"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="1.5"
        fill="#4A463F"
      >
        COOLING TOWARD EQUILIBRIUM — NOT A WEAKENING MARKET
      </text>

      {/* wealth transfer marker */}
      <g>
        <line
          x1="140"
          y1="470"
          x2="1060"
          y2="470"
          stroke="#DDD6C7"
          strokeWidth="1"
        />
        <circle cx="220" cy="470" r="5" fill="#A8823F" />
        <text
          x="220"
          y="500"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          fill="#1C1A17"
        >
          $54T top 1% net worth
        </text>
        <line
          x1="270"
          y1="470"
          x2="900"
          y2="470"
          stroke="#A8823F"
          strokeWidth="1.5"
          markerEnd="url(#arrow)"
        />
        <circle cx="960" cy="470" r="5" fill="#A8823F" />
        <text
          x="960"
          y="500"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          fill="#1C1A17"
        >
          $6T moving to next generation
        </text>
      </g>
      <defs>
        <marker
          id="arrow"
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="4"
          orient="auto"
        >
          <path d="M0,0 L8,4 L0,8 Z" fill="#A8823F" />
        </marker>
      </defs>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LuxuryRealEstateTrends2026Article() {
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
                The {BRAND_NAME} Market Signal
              </span>{" "}
              — Sentiment &amp; Wealth Transfer, 2026
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
                In 2026, luxury real estate is being driven by three forces:
                record wealth concentration and an ongoing multi-trillion-dollar
                generational wealth transfer, a shift toward wellness-focused
                and multigenerational homes, and continued strength in all-cash
                transactions that insulate top-tier buyers from mortgage rate
                swings. Whether you're buying or selling above the $1M mark,
                these trends directly affect pricing, property features, and how
                quickly homes move.
              </p>
            </div>

            {/* Wealth concentration */}
            <section className="mb-10">
              <SectionHeading id="wealth">
                Wealth Is Concentrating — and Moving to Real Estate
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The numbers behind 2026's luxury market start with raw wealth
                growth. The net worth of the top 1% of Americans reached $54
                trillion by Q3 2025, according to Federal Reserve data cited in
                Sotheby's International Realty's 2026 Mid-Year Luxury Outlook
                report, while the S&amp;P 500 rose roughly 80% from early 2023
                through 2025. That wealth is increasingly flowing into property:
                luxury real estate continues to outperform the general market,
                fueled in part by an estimated $6 trillion historic transfer of
                inherited wealth now moving to a younger generation of buyers.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] md:grid-cols-4">
                {STAT_CARDS.map((stat) => (
                  <div key={stat.label} className="bg-[#F7F4EC] p-5">
                    <p className="font-display text-[26px] leading-none text-[#7A2E2E]">
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
                That generational shift is visible in the data. Sixty-six
                percent of luxury real estate professionals surveyed by
                Sotheby's reported an increase in millennial clients over the
                past year, a figure that rises to 73% among agents working in
                the $5 million-and-above segment. This matters for sellers: the
                buyer profile at the high end is getting younger, and younger
                luxury buyers prioritize different things than the generation
                before them.
              </p>
            </section>

            {/* Lifestyle */}
            <section className="mb-12">
              <SectionHeading id="lifestyle">
                Lifestyle Now Outranks Location and Size
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                For decades, luxury real estate followed a fairly predictable
                logic: bigger homes in more prestigious locations commanded
                higher prices. That calculus is shifting. Lifestyle
                considerations ranked as the single most frequently cited factor
                influencing luxury purchase decisions, with 62% of surveyed
                professionals identifying it as increasingly important — ahead
                of taxes, economic stability, and political stability.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                This is showing up physically in what buyers want:
              </p>
              <div className="mt-6 space-y-6">
                {LIFESTYLE_DRIVERS.map((d) => (
                  <div key={d.title} className="border-l border-[#DDD6C7] pl-6">
                    <p className="font-sans text-[15px] font-medium text-[#1C1A17]">
                      {d.title}
                    </p>
                    <p className="mt-1.5 font-serif-body text-[15px] leading-relaxed text-[#4A463F]">
                      {d.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Cash is king */}
            <section className="mb-12">
              <SectionHeading id="cash">
                Cash Is Still King at the Top of the Market
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                While mortgage rates continue to shape affordability for most of
                the housing market, high-net-worth buyers are notably less
                exposed to that pressure, with all-cash offers increasing
                through 2025. This single fact explains a lot of the divergence
                between luxury and mainstream housing performance in 2026 —
                luxury buyers are simply transacting on a different set of
                financial rules.
              </p>

              <PullQuote>
                All-cash buyers move faster, face fewer financing contingencies,
                and are less sensitive to rate environment than the rest of the
                market.
              </PullQuote>

              <p className="mt-2 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                For agents working both sides, understanding a buyer's financing
                position early changes how a deal should be structured and
                timed.
              </p>
            </section>

            {/* Global demand */}
            <section className="mb-12">
              <SectionHeading id="global">
                Global Demand Remains Concentrated in a Handful of Cities
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Despite a broader trend toward "secondary lifestyle markets"
                gaining prominence, demand for top-tier luxury property remains
                concentrated. Markets including New York City, San Francisco,
                Hong Kong, and Milan continue to see steady high-end activity,
                supported by sustained interest in prime properties even as the
                broader market normalizes.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Globally, Christie's International Real Estate's 2026 Prime
                Sentiment Index — a new forward-looking indicator the firm
                introduced this year — shows the market moving toward
                equilibrium rather than the frenzied conditions of recent years:
                buyer demand has cooled from 37.7 in 2025 to 29.3, while price
                outlook and inventory metrics have both improved.
              </p>

              <PullQuote attribution="Gavin Swartzman, President, Christie's International Real Estate">
                That's evidence of a more balanced market rather than a
                weakening one — well-priced properties in virtually every market
                are still moving.
              </PullQuote>
            </section>

            {/* Buying vs selling */}
            <section id="buying-selling" className="mb-12 scroll-mt-28">
              <SectionHeading>
                What This Means for Buyers and Sellers
              </SectionHeading>
              <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] md:grid-cols-2">
                <div className="bg-[#F7F4EC] p-6 md:p-7">
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#7A2E2E]">
                    If You're Buying
                  </p>
                  <p className="mt-3 font-serif-body text-[15px] leading-relaxed text-[#332F29] md:text-[16px]">
                    Expect competition for well-priced, well-positioned
                    properties even in a "balanced" market — balanced doesn't
                    mean slow. Properties with wellness features,
                    multigenerational flexibility, and strong privacy/security
                    infrastructure are likely to draw more competing offers than
                    comparable homes without them. If you're financing rather
                    than paying cash, expect to compete against buyers who
                    aren't carrying that same timeline pressure — see our
                    companion guide on jumbo loans for what that financing gap
                    looks like in practice.
                  </p>
                </div>
                <div className="bg-[#F7F4EC] p-6 md:p-7">
                  <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#7A2E2E]">
                    If You're Selling
                  </p>
                  <p className="mt-3 font-serif-body text-[15px] leading-relaxed text-[#332F29] md:text-[16px]">
                    Positioning matters more than ever. A property that leans
                    into 2026's actual demand drivers — wellness amenities,
                    flexible/multigenerational space, privacy,
                    quality-over-scale design — is likely to outperform a
                    comparable property marketed purely on size or address
                    prestige. If you haven't already, pair your listing strategy
                    with professional staging; see our companion guide on luxury
                    home staging ROI for the specific numbers behind that
                    decision.
                  </p>
                </div>
              </div>
            </section>

            {/* Bottom line */}
            <section className="mb-12">
              <SectionHeading>The Bottom Line</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The luxury real estate market in 2026 isn't following the same
                script as the broader housing market. It's being shaped by
                wealth concentration, generational transfer, and a buyer base
                that increasingly prioritizes how a home supports their life
                over how large or prestigious it looks on paper. Both buyers and
                sellers who understand these specific shifts — rather than
                relying on outdated assumptions about what luxury buyers want —
                are positioned to make smarter, faster decisions in this market.
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-4 scroll-mt-28">
              <SectionHeading>
                FAQs: Luxury Real Estate Trends 2026
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
              purposes and reflects market data and reporting available as of
              mid-2026. It does not constitute investment, financial, or real
              estate advice. Consult a licensed real estate professional for
              guidance specific to your market and circumstances.
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
            Browse Curated Properties ↗
          </a>
        </div>
      </div>
    </div>
  );
}
