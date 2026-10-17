import React, { useState } from "react";

const BRAND_NAME = "Otulia";
const EYEBROW = "Financing Guide";
const TITLE =
  "Jumbo Loans Explained: What Buyers Need to Know Before Financing a Luxury Home";
const SUBTITLE =
  "A jumbo loan isn't simply a bigger mortgage. The qualification bar is higher, the rate spread between lenders is real money, and the cash you'll need at closing is larger than most buyers expect.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Luxury Property Network";
const DATE_PUBLISHED = "30 Jun 2026";
const READ_TIME = "8 Minute Read";
const CTA_URL = "#";

const TOC = [
  { id: "what-counts", label: "What Actually Counts as a Jumbo Loan in 2026" },
  { id: "why-different", label: "Why Jumbo Loans Work Differently" },
  { id: "qualify", label: "What It Takes to Qualify" },
  { id: "closing-costs", label: "What Jumbo Loans Actually Cost to Close" },
  { id: "piggyback", label: "Jumbo Loan vs. Piggyback Loan" },
  { id: "shop", label: "How to Shop a Jumbo Loan Correctly" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "What is the jumbo loan limit in 2026?",
    a: "The baseline conforming loan limit — above which a mortgage is classified as jumbo — is $832,750 for a one-unit property in most U.S. counties in 2026, rising to $1,249,125 in designated high-cost areas, per the Federal Housing Finance Agency.",
  },
  {
    q: "Are jumbo loan interest rates higher than conforming loan rates?",
    a: "Not always. Jumbo rates have at times run close to, or even slightly below, conforming rates, but the typical spread runs 0.25 to 1.0 percentage points higher depending on the lender and market conditions. The bigger issue is that jumbo rates vary far more between lenders than conforming rates do, making lender shopping essential.",
  },
  {
    q: "How much down payment do I need for a jumbo loan?",
    a: "Most jumbo lenders require 10–20% down, though some may require up to 30% depending on loan size and the borrower's overall financial profile — notably higher than the 3% minimum available on some conforming loan programs.",
  },
  {
    q: "How much in cash reserves do jumbo lenders require?",
    a: "Typically 6–12 months of mortgage payments, though some lenders require up to 18 months. On a $5,800 monthly payment, that translates to $34,800–$69,600 in required reserves on top of your down payment and closing costs.",
  },
];

const QUALIFY_FACTORS = [
  {
    title: "Credit score",
    body: "Most jumbo lenders require a minimum of 700–720, with the best rates typically reserved for borrowers at 740 or higher — some luxury-focused brokers recommend targeting 760+, since the rate improvement from 720 to 760 tends to be more pronounced on jumbo loans than on conforming ones.",
  },
  {
    title: "Down payment",
    body: "Jumbo loans typically require 10–20% down, compared to as little as 3% for some conforming first-time-buyer programs. Larger loan amounts or unique financial profiles may push some lenders to require up to 30% down.",
  },
  {
    title: "Cash reserves",
    body: "This is the requirement that surprises the most buyers. Jumbo lenders commonly want to see 6–12 months of mortgage payments held in reserve after closing — some lenders ask for up to 18 months. On a $5,800 monthly payment, that's $34,800 to $69,600 sitting in reserve on top of the down payment and closing costs.",
  },
  {
    title: "Documentation",
    body: "Jumbo underwriting is more detailed than conforming underwriting, and approval timelines often run 45–60 days or longer, especially for very large loan amounts or unusual properties that require additional appraisal review.",
  },
];

const SHOP_STEPS = [
  {
    title: "Get quotes from at least three lenders.",
    body: "National banks, mortgage banks, credit unions, and portfolio lenders all price jumbo loans differently, and the spread between them is real money, not statistical noise.",
  },
  {
    title: "Compare the full Loan Estimate, not just the headline rate.",
    body: "Origination fees, points, and lender credits all affect the true cost of the loan.",
  },
  {
    title: "Confirm your reserve requirement early.",
    body: "Knowing whether a lender wants 6 or 18 months of reserves changes how much total cash you need well before you're at the closing table.",
  },
  {
    title:
      "Ask about seller credits if you're negotiating in a buyer-favorable moment.",
    body: "These can offset specific jumbo closing costs like origination fees, title and escrow fees, and prepaid taxes, though they cannot be applied to your down payment or used as cash back.",
  },
  {
    title: "Build your timeline around jumbo underwriting speed.",
    body: "Budgeting 45–60+ days for approval, rather than assuming a conforming-loan timeline, will prevent unnecessary closing-date stress.",
  },
];

const STAT_CARDS = [
  {
    value: "$832,750",
    label: "conforming limit, most U.S. counties, 2026",
    source: "FHFA",
  },
  {
    value: "$1.25M",
    label: "conforming ceiling in high-cost areas",
    source: "FHFA",
  },
  {
    value: "10–20%",
    label: "typical jumbo down payment",
    source: "Industry data, 2026",
  },
  {
    value: "6–12 mo.",
    label: "cash reserves commonly required",
    source: "Industry data, 2026",
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

// Custom line-art hero illustration: the article's thesis (a jumbo loan is
// defined entirely by crossing a specific dollar threshold) rendered as a
// literal loan-amount gauge with the conforming limit and high-cost ceiling
// marked, rather than a generic house-and-keys stock photo.
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 1200 520"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="1200" height="520" fill="#EFEAE0" />

      {/* gauge track */}
      <rect x="140" y="250" width="920" height="20" fill="#DDD6C7" />
      {/* conforming segment */}
      <rect x="140" y="250" width="560" height="20" fill="#C9BFA6" />
      {/* high-cost segment */}
      <rect
        x="700"
        y="250"
        width="180"
        height="20"
        fill="#A8823F"
        opacity="0.55"
      />
      {/* jumbo territory segment */}
      <rect x="880" y="250" width="180" height="20" fill="#7A2E2E" />

      {/* threshold markers */}
      <line
        x1="700"
        y1="220"
        x2="700"
        y2="290"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      <text
        x="700"
        y="205"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="18"
        fill="#1C1A17"
      >
        $832,750
      </text>
      <text
        x="700"
        y="185"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        letterSpacing="1"
        fill="#7A2E2E"
      >
        CONFORMING LIMIT
      </text>

      <line
        x1="880"
        y1="220"
        x2="880"
        y2="290"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      <text
        x="880"
        y="205"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="18"
        fill="#1C1A17"
      >
        $1,249,125
      </text>
      <text
        x="880"
        y="185"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="11"
        letterSpacing="1"
        fill="#7A2E2E"
      >
        HIGH-COST CEILING
      </text>

      {/* region labels */}
      <text
        x="420"
        y="320"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="13"
        letterSpacing="1"
        fill="#4A463F"
      >
        CONFORMING
      </text>
      <text
        x="790"
        y="320"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="1"
        fill="#4A463F"
      >
        HIGH-COST AREAS
      </text>
      <text
        x="970"
        y="320"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="13"
        letterSpacing="1.5"
        fill="#F7F4EC"
      >
        JUMBO
      </text>

      <text
        x="600"
        y="120"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="2"
        fill="#7A2E2E"
      >
        2026 CONFORMING LOAN LIMITS
      </text>
      <text
        x="600"
        y="410"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="1.5"
        fill="#4A463F"
      >
        EVERY DOLLAR ABOVE THE LINE IS PRICED BY A DIFFERENT SET OF RULES
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function JumboLoanGuideArticle() {
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
                The {BRAND_NAME} Financing Threshold
              </span>{" "}
              — Conforming vs. Jumbo, 2026
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
                A jumbo loan is any mortgage that exceeds the conforming loan
                limit set annually by the Federal Housing Finance Agency —
                $832,750 in most U.S. counties in 2026, up to $1,249,125 in
                high-cost areas. Because jumbo loans aren't purchased by Fannie
                Mae or Freddie Mac, each lender sets its own rates and
                underwriting standards, which means shopping multiple lenders
                matters far more on a jumbo loan than on a conforming one — the
                rate spread between lenders on the same loan can run a full
                percentage point or more.
              </p>
            </div>

            {/* What counts as jumbo */}
            <section className="mb-10">
              <SectionHeading id="what-counts">
                What Actually Counts as a Jumbo Loan in 2026
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The conforming loan limit is the line that separates a standard
                mortgage from a jumbo one. For 2026, that baseline limit is
                $832,750 for a one-unit property in most of the country, with a
                ceiling of up to $1,249,125 in designated high-cost areas.
                Anything borrowed above that local limit is classified as a
                jumbo loan, regardless of the home's total price — a buyer
                putting 30% down on a $1.5 million home, for example, may or may
                not need a jumbo loan depending on the resulting loan amount and
                county.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] md:grid-cols-4">
                {STAT_CARDS.map((stat) => (
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
                This limit adjusts annually under the Housing Economic Recovery
                Act to reflect shifts in average home prices, so a property that
                needed jumbo financing two years ago might fall under conforming
                limits today, or vice versa, depending on your specific county.
              </p>
            </section>

            {/* Why different */}
            <section className="mb-12">
              <SectionHeading id="why-different">
                Why Jumbo Loans Work Differently Than Conforming Loans
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The core difference is structural. Conforming loans are eligible
                for purchase by Fannie Mae and Freddie Mac, which creates
                relative pricing consistency across lenders — rates typically
                cluster within 0.125–0.25% of each other. Jumbo loans are held
                or sold privately, so each lender prices independently based on
                their own balance sheet, risk appetite, and portfolio strategy.
              </p>

              <PullQuote attribution="Luxury Mortgage Broker">
                The same borrower can be quoted dramatically different rates by
                different lenders on the exact same loan, on the exact same day,
                with no obvious explanation beyond differing risk appetites.
              </PullQuote>

              <p className="mt-2 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                On a $1.2 million loan, a 0.625-point rate spread between
                lenders can translate to roughly $450 a month — or about $5,400
                a year — in payment difference for an otherwise identical loan.
              </p>
            </section>

            {/* Qualify */}
            <section className="mb-12">
              <SectionHeading id="qualify">
                What It Takes to Qualify
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Jumbo lending standards are meaningfully stricter than
                conforming loans across several dimensions:
              </p>
              <div className="mt-6 space-y-6">
                {QUALIFY_FACTORS.map((f) => (
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

            {/* Closing costs */}
            <section className="mb-12">
              <SectionHeading id="closing-costs">
                What Jumbo Loans Actually Cost to Close
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Closing costs on a jumbo loan typically fall in the same 2–5% of
                loan amount range as a conforming mortgage — but because the
                loan balance is so much larger, the dollar amount is
                significantly higher even when the percentage is comparable. A
                routine percentage-based fee that's negligible on a $400,000
                loan becomes a meaningful dollar figure on a $2 million one.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                There's a useful, somewhat counterintuitive wrinkle here: some
                flat-fee closing costs, like a fixed-price appraisal, represent
                a smaller percentage of a large jumbo loan than they do of a
                smaller conforming loan — meaning entry-level buyers can
                sometimes face higher effective closing-cost rates than luxury
                buyers on certain line items, even though the luxury buyer's
                total dollar cost is higher overall.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                As of late 2025 and into 2026, average rates for a 30-year fixed
                jumbo loan have run close to conforming rates — sometimes even
                slightly lower — though the typical spread between jumbo and
                conforming rates runs anywhere from 0.25 to 1.0 percentage
                points depending on the lender and broader rate environment.
              </p>
            </section>

            {/* Piggyback */}
            <section id="piggyback" className="mb-12 scroll-mt-28">
              <SectionHeading>
                Jumbo Loan vs. Piggyback Loan: Which Is Cheaper?
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Some buyers consider an 80/20 "piggyback" structure — a
                conforming first mortgage plus a second loan — specifically to
                avoid jumbo classification. In theory this can work, but in
                practice the second mortgage's rate (typically prime plus 1–2%)
                often makes the total blended cost higher than a single,
                well-shopped jumbo loan. This is very deal-specific: run the
                actual numbers on your situation before assuming the piggyback
                structure is the cheaper path.
              </p>
            </section>

            {/* Shop */}
            <section id="shop" className="mb-12 scroll-mt-28">
              <SectionHeading>
                How to Shop a Jumbo Loan Correctly
              </SectionHeading>
              <ol className="mt-6 space-y-6">
                {SHOP_STEPS.map((step, i) => (
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
                A jumbo loan isn't simply "a bigger mortgage" — it's a different
                financial product with its own pricing logic, qualification bar,
                and cash requirements. For buyers financing a luxury property,
                the single most impactful action before closing is shopping
                multiple jumbo lenders directly, since the rate variance between
                lenders on an identical loan can be worth tens of thousands of
                dollars over the life of the loan.
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-4 scroll-mt-28">
              <SectionHeading>
                FAQs: Jumbo Loans for Luxury Homes
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
              purposes only and does not constitute financial or mortgage
              advice. Loan limits, rates, and requirements change and vary by
              lender, location, and individual financial circumstances. Consult
              a licensed mortgage professional before making financing
              decisions.
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
              Our listings are built with verified property data, so you know
              exactly what you're financing before you start comparing lenders.
            </p>
          </div>
          <a
            href={CTA_URL}
            className="shrink-0 whitespace-nowrap border border-[#F7F4EC] px-6 py-3 font-sans text-[13px] uppercase tracking-[0.08em] text-[#F7F4EC] transition-colors hover:bg-[#F7F4EC] hover:text-[#1C1A17]"
          >
            Explore Luxury Properties ↗
          </a>
        </div>
      </div>
    </div>
  );
}
