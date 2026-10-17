import React, { useState } from "react";

const BRAND_NAME = "Otulia";
const EYEBROW = "Seller Playbook";
const TITLE = "How to Stage a Luxury Home to Sell Faster (and for More)";
const SUBTITLE =
  "Staged luxury homes priced at $2 million-plus sell up to 45% faster than the market average. The investment is almost always small relative to the gain — but where and how you stage matters as much as whether you stage at all.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Luxury Property Network";
const DATE_PUBLISHED = "30 Jun 2026";
const READ_TIME = "7 Minute Read";
const CTA_URL = "#";

const TOC = [
  { id: "roi", label: "The ROI Data Behind Staging" },
  { id: "what-first", label: "What to Stage First (and Why It Matters)" },
  { id: "physical-virtual", label: "Physical vs. Virtual Staging" },
  { id: "cost", label: "What Luxury Staging Costs" },
  { id: "checklist", label: "A Practical Staging Checklist" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "Is staging worth it for a luxury home that's already well-designed?",
    a: "Usually yes — staging isn't about fixing a deficient property, it's about presenting any property, however well-designed, in the way that resonates most with how buyers want to live. Even well-appointed luxury homes benefit from staging because it neutralizes the current owner's personal taste in favor of broader buyer appeal.",
  },
  {
    q: "How much does it cost to stage a luxury home?",
    a: "Physical staging for a luxury listing typically runs $5,000–$8,000 or more, depending on the property size and local luxury furniture rental rates, while virtual staging for luxury photos costs roughly $59–$129 per image.",
  },
  {
    q: "Does virtual staging work for high-end listings, or only physical staging?",
    a: "Both work, and they're often used together. Virtual staging is particularly effective for digital marketing and secondary spaces, while physical staging tends to matter more for key rooms buyers will walk through in person on a high-value property.",
  },
  {
    q: "How much faster do staged luxury homes sell?",
    a: "Data reported by Inman shows staged luxury listings priced at $2 million-plus selling up to 45% faster than the broader market — a notably larger speed advantage than staging typically delivers at lower price points.",
  },
];

const CHECKLIST_STEPS = [
  {
    title: "Declutter and depersonalize completely.",
    body: "Consistently cited by NAR as the single highest-impact, lowest-cost preparation step.",
  },
  {
    title:
      "Prioritize the living room, primary bedroom, and dining room first.",
    body: "If budget or time is limited, these three rooms carry the most weight with buyers.",
  },
  {
    title: "Define every flex space.",
    body: "Home office, wellness room, guest suite — rather than leaving it empty or ambiguous.",
  },
  {
    title: "Maximize natural light.",
    body: "Clean windows, lighter window treatments, and trimmed exterior landscaping that may be blocking light.",
  },
  {
    title: "Match staging style to your specific buyer profile.",
    body: "\u201CQuiet luxury\u201D minimalism for some markets, warmer and more layered design for others, depending on what's resonating locally.",
  },
  {
    title: "Pair physical staging with professional, well-lit photography.",
    body: "The majority of buyer interest is now formed online before a single showing happens.",
  },
];

const STAT_CARDS = [
  {
    value: "45%",
    label: "faster sale on $2M+ staged listings",
    source: "Inman, 2025",
  },
  {
    value: "109%",
    label: "average sale-to-list ratio, staged homes",
    source: "RESA, Q3 2025",
  },
  {
    value: "3,551%",
    label: "average ROI on staging investment",
    source: "RESA, Q3 2025",
  },
  {
    value: "15%",
    label: "higher price ceiling in premium markets",
    source: "Industry data, 2026",
  },
];

const ROOM_PRIORITIES = [
  { room: "Living Room", pct: 91 },
  { room: "Primary Bedroom", pct: 83 },
  { room: "Dining Room", pct: 69 },
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

// Custom line-art hero illustration: the article's thesis (not every room
// deserves equal staging attention) rendered as a floor plan with the three
// highest-impact rooms called out by their actual NAR staging-frequency data.
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 1200 520"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="1200" height="520" fill="#EFEAE0" />

      {/* floor plan outline */}
      <g stroke="#1C1A17" strokeWidth="2.5" fill="none" strokeLinejoin="round">
        <rect x="300" y="90" width="600" height="340" />
        {/* room dividers */}
        <line x1="300" y1="260" x2="620" y2="260" />
        <line x1="620" y1="90" x2="620" y2="430" />
        <line x1="620" y1="330" x2="900" y2="330" />
        {/* entry marker */}
        <line
          x1="580"
          y1="430"
          x2="640"
          y2="430"
          strokeWidth="4"
          stroke="#A8823F"
        />
      </g>

      {/* room fills, opacity scaled loosely to priority */}
      <rect
        x="300"
        y="90"
        width="320"
        height="170"
        fill="#7A2E2E"
        opacity="0.16"
      />
      <rect
        x="620"
        y="90"
        width="280"
        height="240"
        fill="#7A2E2E"
        opacity="0.11"
      />
      <rect
        x="620"
        y="330"
        width="280"
        height="100"
        fill="#7A2E2E"
        opacity="0.07"
      />
      <rect x="300" y="260" width="320" height="170" fill="none" />

      {/* room labels */}
      <text
        x="460"
        y="180"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="18"
        fill="#1C1A17"
      >
        Living Room
      </text>
      <text
        x="460"
        y="202"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="13"
        fill="#7A2E2E"
      >
        staged in 91% of listings
      </text>

      <text
        x="760"
        y="215"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="18"
        fill="#1C1A17"
      >
        Primary Bedroom
      </text>
      <text
        x="760"
        y="237"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="13"
        fill="#7A2E2E"
      >
        staged in 83% of listings
      </text>

      <text
        x="760"
        y="385"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="16"
        fill="#1C1A17"
      >
        Dining Room
      </text>
      <text
        x="760"
        y="405"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        fill="#7A2E2E"
      >
        staged in 69% of listings
      </text>

      <text
        x="460"
        y="345"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="1.5"
        fill="#8A8577"
      >
        FLEX SPACE
      </text>
      <text
        x="460"
        y="365"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        fill="#8A8577"
      >
        define it, don't leave it empty
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
        NOT EVERY ROOM DESERVES EQUAL ATTENTION
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function LuxuryHomeStagingArticle() {
  const [openFaq, setOpenFaq] = useState(0);

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
                The {BRAND_NAME} Staging Priority Map
              </span>{" "}
              — Where Buyers Feel a Home First, 2026
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
                Professionally staged luxury homes typically sell faster and for
                more — industry data shows luxury listings priced at $2
                million-plus selling up to 45% faster than the market average
                when professionally staged, with staged homes overall achieving
                sale-to-list ratios above 100% and ROI that can run into the
                thousands of percent. The investment is almost always small
                relative to the gain, but where and how you stage matters as
                much as whether you stage at all.
              </p>
            </div>

            {/* ROI */}
            <section className="mb-10">
              <SectionHeading id="roi">
                The ROI Data Behind Staging
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The broad numbers across all price points are already
                compelling. According to National Association of Realtors and
                HomeLight data, 96% of realtors believe home staging positively
                influences a buyer's decision, and homes staged before listing
                can sell 6–10% faster than unstaged comparables. Q3 2025 RESA
                (Real Estate Staging Association) data found staged homes
                posting an average 109% sale-to-list ratio and an average ROI of
                3,551% — meaning sellers typically recovered their staging
                investment nearly 36 times over.
              </p>

              {/* Stat cards */}
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] md:grid-cols-4">
                {STAT_CARDS.map((stat) => (
                  <div key={stat.label} className="bg-[#F7F4EC] p-5">
                    <p className="font-display text-[28px] leading-none text-[#7A2E2E]">
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
                At the luxury end specifically, the numbers get more dramatic,
                not less. One major staging firm's 2025 data, reported by Inman,
                found that staged properties listed at $2 million-plus sold 45%
                faster than the broader market — a meaningfully larger speed
                advantage than staging delivers at lower price points. The
                reasoning tracks with buyer psychology: the data suggests luxury
                buyers place an even stronger premium on presentation quality
                than buyers at lower price points, perhaps because they're
                evaluating more comparable, equally well-appointed properties.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Price impact is just as significant. In premium markets, staged
                homes can command up to 15% higher prices than comparable
                unstaged homes — on a $1 million listing, that's a potential
                $150,000 difference against a staging investment that typically
                runs $5,000 to $8,000 for that price tier.
              </p>
            </section>

            {/* What to stage first */}
            <section className="mb-12">
              <SectionHeading id="what-first">
                What to Stage First (and Why It Matters)
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Not every room deserves equal attention. According to NAR's
                Profile of Home Staging, the most commonly — and most
                effectively — staged rooms are the living room (91% of staged
                listings), the primary bedroom (83%), and the dining room (69%).
                For luxury properties specifically, vacant high-end listings
                tend to benefit most from physical (not virtual) staging in
                these key rooms, since buyers touring a multi-million-dollar
                property in person expect to feel the home's intended lifestyle,
                not just see it represented digitally.
              </p>

              {/* Room priority bars */}
              <div className="mt-8 space-y-4">
                {ROOM_PRIORITIES.map((r) => (
                  <div key={r.room}>
                    <div className="flex items-baseline justify-between font-sans text-[13px]">
                      <span className="font-medium text-[#1C1A17]">
                        {r.room}
                      </span>
                      <span className="text-[#7A2E2E]">{r.pct}%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full bg-[#DDD6C7]">
                      <div
                        className="h-1.5 bg-[#7A2E2E]"
                        style={{ width: `${r.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <PullQuote>
                An empty room reads as confusing to a buyer; a clearly staged
                "flex space" reads as a feature.
              </PullQuote>

              <p className="mt-2 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                A useful rule for luxury sellers: prioritize the spaces that
                establish the emotional tone of the home fastest — the entry,
                the primary living area, the primary suite — and don't leave
                bonus spaces (home offices, wellness rooms, guest suites)
                undefined.
              </p>
            </section>

            {/* Physical vs virtual */}
            <section className="mb-12">
              <SectionHeading id="physical-virtual">
                Physical vs. Virtual Staging for Luxury Listings
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The choice between physical and virtual staging isn't either/or
                — it's about matching the method to the property and the
                marketing moment. Vacant luxury listings often benefit most from
                physical staging in key rooms, while properties needing fast
                turnaround or digital-first marketing can lean on virtual
                staging for speed and cost control.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Virtual staging has become a serious tool in its own right, not
                just a budget fallback. The global virtual staging market grew
                from $1.22 billion in 2025 to $1.33 billion in 2026, and
                virtually staged listings get 90% more clicks and sell up to 73%
                faster than unstaged listings, while achieving 98.5–99% of
                asking price compared to 96–97% for unstaged properties. Given
                that 96% of homebuyers now begin their search online, the photos
                a listing leads with — staged or not — are doing more of the
                selling than the in-person showing used to.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                For luxury listings, the strongest approach is usually hybrid:
                physical staging for key rooms that buyers will walk through in
                person, supplemented by virtual staging for secondary spaces or
                to test different design directions in marketing photos before
                committing to a physical rental.
              </p>
            </section>

            {/* Cost */}
            <section className="mb-12">
              <SectionHeading id="cost">
                What Luxury Staging Costs
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Staging costs scale with property value, and luxury staging
                carries some specific cost drivers worth planning for. Costs
                compound for luxury properties because of higher rental prices
                for luxury furniture and decor, and many rental companies
                require a minimum three-month contract on luxury properties —
                regardless of whether the home sells within days.
              </p>
              <div className="mt-6 grid grid-cols-1 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] sm:grid-cols-2">
                <div className="bg-[#F7F4EC] p-6">
                  <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#7A2E2E]">
                    Physical Staging
                  </p>
                  <p className="mt-2 font-display text-[26px] text-[#1C1A17]">
                    $5,000–$8,000+
                  </p>
                  <p className="mt-1 font-sans text-[12px] text-[#4A463F]">
                    per multi-million-dollar listing
                  </p>
                </div>
                <div className="bg-[#F7F4EC] p-6">
                  <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-[#7A2E2E]">
                    Virtual Staging
                  </p>
                  <p className="mt-2 font-display text-[26px] text-[#1C1A17]">
                    $59–$129
                  </p>
                  <p className="mt-1 font-sans text-[12px] text-[#4A463F]">
                    per photo, luxury listings
                  </p>
                </div>
              </div>
            </section>

            {/* Checklist */}
            <section id="checklist" className="mb-12 scroll-mt-28">
              <SectionHeading>
                A Practical Staging Checklist for Luxury Sellers
              </SectionHeading>
              <ol className="mt-6 space-y-6">
                {CHECKLIST_STEPS.map((step, i) => (
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
                For a luxury listing, staging isn't a cosmetic afterthought —
                it's a financial decision with some of the best-documented ROI
                available in the entire selling process. Whether through
                physical staging, virtual staging, or a hybrid of both, the data
                is consistent: presentation quality directly affects both how
                fast a luxury home sells and how much it sells for.
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-4 scroll-mt-28">
              <SectionHeading>FAQs: Luxury Home Staging</SectionHeading>
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
              purposes based on industry data and reporting available as of
              mid-2026. Actual staging costs and outcomes vary by market,
              property, and stager. Consult a licensed real estate professional
              or staging specialist for guidance specific to your property.
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
              Every listing benefits from a marketplace built around
              presentation and verified property detail.
            </p>
          </div>
          <a
            href={CTA_URL}
            className="shrink-0 whitespace-nowrap border border-[#F7F4EC] px-6 py-3 font-sans text-[13px] uppercase tracking-[0.08em] text-[#F7F4EC] transition-colors hover:bg-[#F7F4EC] hover:text-[#1C1A17]"
          >
            List Your Property ↗
          </a>
        </div>
      </div>
    </div>
  );
}
