import React, { useState } from "react";

const BRAND_NAME = "Otulia";
const EYEBROW = "Buyer Protection";
const TITLE =
  "How to Verify a Luxury Car's History and Authenticity Before You Buy";
const SUBTITLE =
  "About 40% of used cars carry undisclosed accident damage. Cloned VINs, title washing, and curbstoning can leave a buyer with a car they can't properly insure, register, or resell — here's exactly how to check before money changes hands.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Certified Dealer Network";
const DATE_PUBLISHED = "30 Jun 2026";
const READ_TIME = "8 Minute Read";
const CTA_URL = "#";

const TOC = [
  { id: "vin", label: "Start With the VIN — Check It in Multiple Places" },
  { id: "history-report", label: "Pull a Full Vehicle History Report" },
  { id: "title-washing", label: "Watch for Title Washing and Curbstoning" },
  { id: "documentation", label: "Confirm Authenticity Through Documentation" },
  { id: "inspection", label: "Get a Pre-Purchase Inspection" },
  { id: "checklist", label: "A Practical Verification Checklist" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "What is the fastest way to check if a used luxury car has a clean history?",
    a: "Start with a VIN cross-check across the dashboard, door jamb, and title, then pull a full vehicle history report from an NMVTIS-approved provider like Carfax or AutoCheck — this will surface accident history, title status, odometer issues, and open recalls in one report.",
  },
  {
    q: "How common is undisclosed damage on used cars?",
    a: "About 40% of used vehicles on U.S. roads carry documented accident damage, and nearly 20% are still under an open safety recall — both of which a proper VIN-based history check will reveal.",
  },
  {
    q: "What is title washing, and how do I spot it?",
    a: "Title washing is moving a vehicle between states specifically to erase a salvage or lemon brand from its title. Warning signs include a title history that jumps between multiple states with no clear explanation; cross-referencing through NMVTIS or a state DMV title lookup tool can help confirm whether the history is legitimate.",
  },
  {
    q: "Do I need a specialist inspection, or is a general mechanic enough for a luxury car?",
    a: "For genuinely high-value or rare vehicles, a brand specialist is strongly recommended over a generalist mechanic, since specialists are far more likely to catch inconsistencies between a car's claimed specification, service history, and actual condition.",
  },
];

const CHECKLIST_STEPS = [
  {
    title:
      "Cross-check the VIN across the dashboard, door jamb, engine bay, and title.",
    body: "All should match exactly — any discrepancy is a serious red flag, not a minor inconsistency to explain away.",
  },
  {
    title:
      "Pull a full vehicle history report from an NMVTIS-approved provider.",
    body: "Not just a free basic lookup — Carfax, AutoCheck, or another NMVTIS-approved source.",
  },
  {
    title: "Check the title chain for unexplained state-to-state jumps.",
    body: "Jumps with no clear explanation could indicate title washing.",
  },
  {
    title: "Review all available documentation for internal consistency.",
    body: "Sale records, restoration receipts, and service history should align on VINs and purchase dates.",
  },
  {
    title: "Inspect physical identification numbers in person.",
    body: "Look for signs of tampering, replacement, or inconsistent stamping.",
  },
  {
    title: "Commission a pre-purchase inspection from a specialist.",
    body: "A mechanic or specialist who works specifically on that make and model.",
  },
  {
    title: "Be wary of urgency or resistance to verification.",
    body: "A legitimate seller of a genuine vehicle has no reason to discourage any of the above steps.",
  },
];

const HISTORY_REPORT_ITEMS = [
  "Accident and damage history, including severity and frequency",
  "Title status, including whether the vehicle has ever carried a salvage or rebuilt title",
  "Odometer consistency, to rule out mileage rollback",
  "Open recalls that haven't been addressed",
  "Prior use as a rental, fleet, or commercial vehicle, which affects both value and wear patterns",
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

// Custom line-art hero illustration: the article's thesis (cross-check the VIN
// in every stamped location before trusting it) rendered as three matching
// checkpoints on a car silhouette, rather than a generic stock photo.
function HeroIllustration() {
  const vinFragment = "WVWZZZ...4829";
  return (
    <svg
      viewBox="0 0 1200 520"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0" y="0" width="1200" height="520" fill="#EFEAE0" />
      <line
        x1="0"
        y1="400"
        x2="1200"
        y2="400"
        stroke="#DDD6C7"
        strokeWidth="1"
      />
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

      {/* car silhouette (side profile) */}
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

      {/* checkpoint markers on the car itself */}
      <circle cx="430" cy="278" r="5" fill="#7A2E2E" />
      <circle cx="365" cy="345" r="5" fill="#7A2E2E" />
      <circle cx="900" cy="360" r="5" fill="#7A2E2E" />

      {/* callout: dashboard */}
      <g>
        <line
          x1="430"
          y1="278"
          x2="430"
          y2="150"
          stroke="#A8823F"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="430" cy="150" r="3" fill="#A8823F" />
        <text
          x="430"
          y="120"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          letterSpacing="1.5"
          fill="#7A2E2E"
        >
          DASHBOARD
        </text>
        <text
          x="430"
          y="99"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="15"
          fill="#1C1A17"
        >
          {vinFragment}
        </text>
      </g>

      {/* callout: door jamb */}
      <g>
        <line
          x1="365"
          y1="345"
          x2="300"
          y2="150"
          stroke="#A8823F"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="300" cy="150" r="3" fill="#A8823F" />
        <text
          x="300"
          y="120"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          letterSpacing="1.5"
          fill="#7A2E2E"
        >
          DOOR JAMB
        </text>
        <text
          x="300"
          y="99"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="15"
          fill="#1C1A17"
        >
          {vinFragment}
        </text>
      </g>

      {/* callout: engine bay */}
      <g>
        <line
          x1="900"
          y1="360"
          x2="900"
          y2="150"
          stroke="#A8823F"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="900" cy="150" r="3" fill="#A8823F" />
        <text
          x="900"
          y="120"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="12"
          letterSpacing="1.5"
          fill="#7A2E2E"
        >
          ENGINE BAY
        </text>
        <text
          x="900"
          y="99"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="15"
          fill="#1C1A17"
        >
          {vinFragment}
        </text>
      </g>

      {/* match indicator */}
      <text
        x="600"
        y="470"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="2"
        fill="#4A463F"
      >
        THREE LOCATIONS. ONE NUMBER. NO EXCEPTIONS.
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function VerifyLuxuryCarHistoryArticle() {
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
                The {BRAND_NAME} Verification Standard
              </span>{" "}
              — VIN, Title &amp; Documentation, 2026
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
                Verifying a luxury car's history starts with the VIN — a unique
                17-character code that should match exactly across the
                dashboard, door jamb, and title. From there, pull a full vehicle
                history report (Carfax, AutoCheck, or an NMVTIS-approved
                provider), confirm the title hasn't been "washed" across states
                to hide salvage status, and have a brand-specialist mechanic
                inspect the car in person before money changes hands. About 40%
                of used vehicles carry documented accident damage, which makes
                this verification step essential rather than optional.
              </p>
            </div>

            {/* VIN */}
            <section className="mb-12">
              <SectionHeading id="vin">
                Start With the VIN — and Check It in Multiple Places
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Every vehicle has a unique 17-character Vehicle Identification
                Number that functions like a fingerprint — it's tied to that one
                specific car for life. Verifying it correctly is the foundation
                everything else depends on: if you get the VIN wrong, every
                history report you pull afterward will be for a completely
                different vehicle.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The standard practice is to cross-reference the VIN in every
                location it appears — typically the dashboard (visible through
                the windshield), the driver's-side door jamb, and the engine bay
                — and confirm all three match the VIN on the title and
                registration.
              </p>

              <PullQuote>
                On a genuine luxury or exotic vehicle, the VIN is stamped in
                multiple locations precisely so buyers can perform this check;
                any discrepancy between locations is considered a serious red
                flag, not a minor inconsistency to explain away.
              </PullQuote>

              <p className="mt-2 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The VIN itself also encodes useful information once decoded: the
                model year, the assembly plant, and a built-in "check digit" — a
                security code calculated from the other characters specifically
                to confirm the VIN is authentic and hasn't been altered.
              </p>
            </section>

            {/* History report */}
            <section className="mb-12">
              <SectionHeading id="history-report">
                Pull a Full Vehicle History Report
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Once the VIN is confirmed, the next step is a comprehensive
                vehicle history report through a service like Carfax, AutoCheck,
                or another NMVTIS-approved provider (NMVTIS — the National Motor
                Vehicle Title Information System — is the national database
                designed specifically to protect consumers from fraud and
                prevent stolen or unsafe vehicles from being resold).
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                This is not a step worth skipping to save the report fee. About
                40% of used cars on U.S. roads carry documented accident damage,
                and nearly 20% are still operating under an open safety recall —
                issues a basic visual inspection often can't catch, but that a
                proper VIN-based history check will surface immediately, along
                with odometer tampering and title washing.
              </p>
              <p className="mt-6 font-sans text-[14px] font-medium text-[#1C1A17]">
                A thorough report should let you check for:
              </p>
              <ul className="mt-4 space-y-3 border-l border-[#DDD6C7] pl-6">
                {HISTORY_REPORT_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="font-serif-body text-[16px] leading-[1.6] text-[#332F29]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Title washing */}
            <section className="mb-12">
              <SectionHeading id="title-washing">
                Watch for Title Washing and Curbstoning
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Two specific scam patterns show up disproportionately in the
                luxury and exotic segment, where a relatively small price
                reduction can still represent a large absolute dollar amount
                worth hiding a problem for.
              </p>
              <ul className="mt-4 space-y-4 border-l border-[#DDD6C7] pl-6">
                <li className="font-serif-body text-[16px] leading-[1.7] text-[#332F29]">
                  <span className="font-sans font-medium text-[#1C1A17]">
                    Title washing
                  </span>{" "}
                  is the practice of moving a vehicle from state to state
                  specifically to erase a salvage or lemon brand from its title
                  record.
                </li>
                <li className="font-serif-body text-[16px] leading-[1.7] text-[#332F29]">
                  <span className="font-sans font-medium text-[#1C1A17]">
                    Curbstoning
                  </span>{" "}
                  involves unlicensed sellers flipping cars without proper
                  dealer documentation or licensing, often to avoid the
                  disclosure requirements a licensed dealer would have to meet.
                </li>
              </ul>
              <p className="mt-6 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                If a title history bounces between multiple states with no clear
                explanation — a move, a relocation, a logical chain of ownership
                — treat that as worth investigating further rather than
                dismissing as a paperwork quirk. Cross-referencing through
                NMVTIS or your state DMV's title lookup tool can usually clarify
                whether the jumps are explainable or suspicious.
              </p>
            </section>

            {/* Documentation */}
            <section className="mb-12">
              <SectionHeading id="documentation">
                Confirm Authenticity Through Documentation, Not Just the VIN
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                For exotic and collector-grade vehicles specifically,
                authenticity verification goes beyond confirming the car isn't
                stolen or wrecked — it extends to confirming the car actually is
                what it's being sold as. Original sale records, restoration
                receipts, and certifications from recognized marque specialists
                or registries all contribute to a documented, defensible
                history.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                When reviewing this kind of documentation, look specifically for
                consistency: do the VINs and purchase dates referenced in the
                paperwork align across every document? Identification numbers
                showing inconsistent fonts, uneven stamping, or signs of
                replacement on the physical car are signals worth raising
                directly with the seller.
              </p>

              <PullQuote attribution="Specialist Dealer">
                Scammy sellers typically rush the sale, create vague urgency, or
                refuse third-party inspections and VIN verification outright —
                legitimate sellers expect this level of scrutiny and come
                prepared with documentation to support it.
              </PullQuote>
            </section>

            {/* Inspection */}
            <section className="mb-12">
              <SectionHeading id="inspection">
                Get a Pre-Purchase Inspection From a Brand Specialist
              </SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                A general mechanic can confirm a car runs well. A brand
                specialist can tell you whether a specific Ferrari, Lamborghini,
                or McLaren has the service history, component originality, and
                condition consistent with its claimed history and asking price —
                and can often spot inconsistencies between a car's claimed
                specification and its actual build that a generalist would miss
                entirely.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                This step matters even more on rare or limited-production
                vehicles, where a specific factory option, color, or trim
                package can represent a meaningful share of the car's value. A
                pre-purchase inspection from someone who knows the model deeply
                is one of the best protections against paying collector-grade
                prices for a car that doesn't actually match the documentation.
              </p>
            </section>

            {/* Checklist */}
            <section id="checklist" className="mb-12 scroll-mt-28">
              <SectionHeading>
                A Practical Verification Checklist
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
                Verifying a luxury or exotic car's history isn't a formality —
                it's the difference between a confident purchase and a car you
                may not be able to insure, register, or resell at full value.
                The VIN is your starting point, the history report is your
                safety net, and a specialist inspection is your final
                confirmation that the car in front of you is exactly what it
                claims to be.
              </p>
            </section>

            {/* FAQs */}
            <section id="faqs" className="mb-4 scroll-mt-28">
              <SectionHeading>
                FAQs: Verifying a Luxury Car's History
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
              purposes only and does not constitute legal or financial advice.
              Always verify vehicle history through official, NMVTIS-approved
              sources and consult a qualified specialist before completing a
              high-value vehicle purchase.
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
              Every listing on our platform is backed by verified vehicle
              history and a curated network of dealers held to a higher
              standard.
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
