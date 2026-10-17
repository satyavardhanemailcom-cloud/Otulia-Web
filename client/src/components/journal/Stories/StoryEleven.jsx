import React, { useState } from "react";
import hero_image from "../../../assets/journal/blog_eleven/hero.webp";
import first_image from "../../../assets/journal/blog_eleven/img_01.webp";
import second_image from "../../../assets/journal/blog_eleven/img_02.webp";
import third_image from "../../../assets/journal/blog_eleven/img_03.webp";
import four_image from "../../../assets/journal/blog_eleven/img_04.webp";
import fifth_image from "../../../assets/journal/blog_eleven/img_05.webp";
import six_image from "../../../assets/journal/blog_eleven/img_06.webp";
import seven_image from "../../../assets/journal/blog_eleven/img_07.webp";
import eight_image from "../../../assets/journal/blog_eleven/img_08.webp";
import nine_image from "../../../assets/journal/blog_eleven/img_09.webp";
import ten_image from "../../../assets/journal/blog_eleven/img_10.webp";

const BRAND_NAME = "Otulia";
const EYEBROW = "Celebrity Collection";
const TITLE =
  "From Ferrari to Bugatti: Inside Erling Haaland's Multimillion-Dollar Car Collection";
const SUBTITLE =
  "Goal-scoring records and Birkin bags aren't the only things the soccer star collects.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Automotive Network";
const DATE_PUBLISHED = "28 Jul 2026";
const READ_TIME = "8 Minute Read";
const CTA_URL = "#";

const TOC = [
  { id: "overview", label: "The Collection at a Glance" },
  { id: "aston-martin", label: "Aston Martin DBX707" },
  { id: "audi", label: "Audi RS 6 Avant" },
  { id: "bugatti", label: "Bugatti Tourbillon" },
  { id: "ferrari", label: "Ferrari Monza SP2" },
  { id: "lamborghini", label: "Lamborghini Huracán Sterrato" },
  { id: "mercedes", label: "Mercedes-Maybach S 680 Virgil Abloh" },
  { id: "porsche", label: "Porsche 911 GT3 RS" },
  { id: "range-rover", label: "Range Rover Sport" },
  { id: "rolls-royce", label: "Rolls-Royce Cullinan" },
  { id: "shelby", label: "Shelby F-150 Super Snake" },
  { id: "bottom-line", label: "The Bottom Line" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "How many cars does Erling Haaland have?",
    a: "Haaland is reported to own at least 10 vehicles, ranging from performance SUVs and wagons to hypercars and a pickup truck. His collection includes models from Aston Martin, Audi, Bugatti, Ferrari, Lamborghini, Mercedes-Benz, Porsche, Land Rover, Rolls-Royce, and Shelby.",
  },
  {
    q: "What is the most expensive car in Erling Haaland's collection?",
    a: "The Bugatti Tourbillon, with a reported price tag of $4.6 million, is the most expensive vehicle in his collection. It is a hybrid hypercar that makes 1,600 hp, and only 250 build slots were available.",
  },
  {
    q: "How much does Erling Haaland make per year?",
    a: "Haaland is reported to make around $60 million per year, which includes his salary at Manchester City and endorsement deals. His car collection represents a relatively modest portion of his annual income.",
  },
  {
    q: "What Ferrari models does Haaland own?",
    a: "Haaland reportedly owns several Ferraris, including a Monza SP2, an 812 Competizione Aperta, and a 12Cilindri. The Monza SP2, valued at $1.8 million, is a windscreen-less speedster that launched Ferrari's Icona Series.",
  },
  {
    q: "Does Erling Haaland have a pickup truck?",
    a: "Yes, Haaland owns a Shelby F-150 Super Snake, which is a high-performance version of Ford's bestselling pickup. It features a 5.0-liter supercharged V-8 making up to 785 hp and starts at $138,495.",
  },
];

const CARS = [
  {
    id: "aston-martin",
    name: "Aston Martin DBX707",
    price: "$276,500",
    photoCredit: "Aston Martin",
    body: "It's fitting that the first vehicle on the alphabetical list is British-made. Haaland may have been raised in and played for Norway, but he was born in the north of England in 2000 while his father was playing for Leeds United. Aston Martin may be best known for its James Bond-approved grand tourers and sports cars, but its current bestseller is its first SUV, the DBX. Haaland owns the 707 variant; with 697 hp under the hood, it was the most powerful version of the super SUV when it debuted in 2022 — the same year the soccer star signed with Manchester City.",
    image: first_image,
  },
  {
    id: "audi",
    name: "Audi RS 6 Avant",
    price: "$130,000",
    photoCredit: "Audi",
    body: "No, Audi isn't a name that usually sets the heart racing, but the presence of the RS 6 Avant on this list lets you know that Haaland knows his cars. Enthusiasts have been swooning over the company's RS performance wagons since their debut in the mid-1990s, and the current RS 6 Avant may be the best of the bunch. The all-wheel-drive beast — which, unlike many of its predecessors, is available in the U.S. — is powered by a 4.0-liter twin-turbocharged V-8 that makes just shy of 621 hp in its GT guise.",
    image: second_image,
  },
  {
    id: "bugatti",
    name: "Bugatti Tourbillon",
    price: "$4,600,000",
    photoCredit: "Bugatti",
    body: "The RS 6 Avant shows that Haaland cares about driving dynamics, but the Bugatti Tourbillon shows he's not opposed to some flash. The French marque's third distinct modern vehicle is an outlandish hybrid hypercar with a price tag to match. Deliveries of the vehicle, which makes 1,600 hp, have yet to commence, but it was reported last year that the player had secured one of its 250 build slots.",
    image: third_image,
  },
  {
    id: "ferrari",
    name: "Ferrari Monza SP2",
    price: "$1,800,000",
    photoCredit: "Ferrari",
    body: "Haaland is reported to make around $60 million per year, so it's little surprise that he has several Ferraris in his collection, including an 812 Competizione Aperta and a 12Cilindri. But his most notable Prancing Horse is the Monza SP2. The windscreen-less speedster — which was available with one seat (the SP1) or two seats (the SP2) — was the model used to launch the automaker's Icona Series in 2018 and only 499 were built.",
    image: four_image,
  },
  {
    id: "lamborghini",
    name: "Lamborghini Huracán Sterrato",
    price: "$278,972",
    photoCredit: "Lamborghini",
    body: "Haaland is clearly someone who'd rather drive than be driven, so it makes sense that he has space in his collection for a Lamborghini Huracán Sterrato. The variant, which debuted near the end of the V-10's life cycle, is a supercar specifically engineered for off-roading, and it has the all-wheel-drive system and all-terrain tires to prove it.",
    image: fifth_image,
  },
  {
    id: "mercedes",
    name: "Mercedes-Maybach S 680 Virgil Abloh",
    price: "$347,650",
    photoCredit: "Mercedes-Benz",
    body: "Haaland made his name during the two seasons he spent playing for Germany's Borussia Dortmund. Because of this, it's little surprise to see some Mercedes in his collection. The forward owns one of the 275 AMG One examples that were built, but his most notable Mercedes is the Maybach S 680 Virgil Abloh. The saloon, which was released just months after the fashion designer's untimely passing, may be the most stylish vehicle Haaland owns.",
    image: six_image,
  },
  {
    id: "porsche",
    name: "Porsche 911 GT3 RS",
    price: "$250,000",
    photoCredit: "Porsche",
    body: "It's only fitting that Haaland have a place in his garage for a Porsche. His pick is the 911 GT3 RS. The most hard-core version of the German sports car maker's most iconic model is basically a street-legal race car. The lightweight two-door features a ridiculous aero kit and a naturally aspirated 4.0-liter flat six that makes well over 500 horses.",
    image: seven_image,
  },
  {
    id: "range-rover",
    name: "Range Rover Sport",
    price: "$213,200",
    photoCredit: "Jaguar Land Rover",
    body: "If you crave performance, there's only one Land Rover to consider and that is the Range Rover Sport. It's smaller than the standard version of the SUV it takes its name from, but it packs a bigger punch. The most powerful version, the SV variant, features a 4.4-liter twin-turbocharged V-8 that makes 626 hp and can reach a top speed of 180 mph.",
    image: eight_image,
  },
  {
    id: "rolls-royce",
    name: "Rolls-Royce Cullinan",
    price: "$432,350",
    photoCredit: "Rolls-Royce",
    body: "Haaland's DBX707 and Range Rover Sport aren't the only British vehicles he owns. The star also has at least two Rolls-Royce — a Ghost and a Cullinan. It's the latter of those vehicles that Haaland seems to spend the most time driving, which makes sense since the SUV is the chicest way for him to ferry his girlfriend Isabel and their son around Manchester.",
    image: nine_image,
  },
  {
    id: "shelby",
    name: "Shelby F-150 Super Snake",
    price: "$138,495",
    photoCredit: "Shelby American",
    body: "Haaland's affinity for America predates the World Cup. He was spotted pulling into Man City's practice facility in that most American of vehicles: a pickup. But not just any truck, this was a Shelby F-150 Super Snake. The performance shop's take on Ford's bestselling pickup features a 5.0-liter supercharged V-8 that pumps out up to 785 hp.",
    image: ten_image,
  },
];

const COLLECTION_STATS = [
  {
    value: "$8.2M+",
    label: "estimated total collection value",
    source: "Public reports",
  },
  {
    value: "$60M",
    label: "reported annual income",
    source: "Forbes, 2026",
  },
  {
    value: "10+",
    label: "known vehicles in collection",
    source: "Public sightings",
  },
  {
    value: "$4.6M",
    label: "most expensive car (Bugatti Tourbillon)",
    source: "Bugatti",
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

      {/* car silhouette (luxury coupe profile) */}
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

      {/* soccer ball */}
      <circle
        cx="150"
        cy="140"
        r="30"
        fill="none"
        stroke="#1C1A17"
        strokeWidth="2"
      />
      <polygon
        points="150,115 165,130 158,148 142,148 135,130"
        fill="#1C1A17"
        stroke="#1C1A17"
        strokeWidth="1"
      />

      {/* title */}
      <text
        x="600"
        y="90"
        textAnchor="middle"
        fontFamily="Fraunces, serif"
        fontSize="28"
        fill="#1C1A17"
      >
        Inside Haaland's Garage
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
        10 VEHICLES. $8.2M+ ESTIMATED VALUE.
      </text>

      {/* value callout */}
      <g>
        <line
          x1="600"
          y1="256"
          x2="600"
          y2="180"
          stroke="#A8823F"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <circle cx="600" cy="180" r="3" fill="#A8823F" />
        <text
          x="600"
          y="165"
          textAnchor="middle"
          fontFamily="Inter, sans-serif"
          fontSize="11"
          letterSpacing="1.5"
          fill="#7A2E2E"
        >
          COLLECTION VALUE
        </text>
      </g>

      <text
        x="600"
        y="470"
        textAnchor="middle"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        letterSpacing="2"
        fill="#4A463F"
      >
        FROM FERRARI TO BUGATTI
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function HaalandCarCollectionArticle() {
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
          <img src={hero_image} />
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
              <SectionHeading>The Collection at a Glance</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                His team may not have made it to this weekend's final, but no
                one had as good of a World Cup as Erling Haaland. Not only did
                his goal-scoring efforts help push Norway to the quarterfinals
                of this year's tournament — its best finish at the quadrennial
                event ever — but he also managed to capture the hearts of the
                soccer-watching public while doing so.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                During his time in the U.S., Haaland proved himself to be so
                much more than a goal-scoring machine. In between his seven
                goals, the player joked around with kids before games and took
                time to soak up all America has to offer. The forward, who lines
                up for Manchester City during the club season, may be one of the
                game's best players, but he also has interests off the pitch.
              </p>

              <PullQuote>
                Goal-scoring records and Birkin bags aren't the only things
                Haaland has an eye for. He's also built one of the better car
                collections you'll see this year.
              </PullQuote>

              {/* Stat cards */}
              <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-[#DDD6C7] bg-[#DDD6C7] md:grid-cols-4">
                {COLLECTION_STATS.map((stat) => (
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

            {/* Individual car sections */}
            {CARS.map((car) => (
              <section key={car.id} id={car.id} className="mb-12 scroll-mt-28">
                <SectionHeading id={car.id}>{car.name}</SectionHeading>
                <figure className="mt-5">
                  <div className="w-full overflow-hidden rounded-sm border border-[#DDD6C7] bg-[#EFEAE0]">
                    <div className="flex h-[320px] items-center justify-center">
                      <img
                        src={car.image}
                        alt={car.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <figcaption className="mt-3 font-sans text-[12px] text-[#4A463F]">
                    <span className="text-[#1C1A17]">{car.name}</span> —{" "}
                    {car.photoCredit}
                  </figcaption>
                </figure>
                <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                  {car.body}
                </p>
              </section>
            ))}

            {/* Bottom line */}
            <section id="bottom-line" className="mb-12 scroll-mt-28">
              <SectionHeading>The Bottom Line</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Haaland's collection tells you something about his personality
                that the highlight reels don't. He appreciates driving dynamics,
                as the RS 6 Avant and GT3 RS attest. He's drawn to craft and
                exclusivity, as the Monza SP2 and Tourbillon prove. And he's
                practical enough to daily-drive a Cullinan and a pickup truck.
                For a 25-year-old who earns roughly $60 million a year, the
                garage is remarkably well-considered — not just a shopping
                spree, but a collection with taste.
              </p>
            </section>

            {/* Reviewer / disclaimer */}
            <p className="mt-10 border-t border-[#DDD6C7] pt-6 font-sans text-[12px] leading-relaxed text-[#8A8577]">
              Reviewed by {REVIEWER}. This article is for general informational
              purposes and reflects publicly reported information about vehicle
              ownership as of mid-2026. Exact collection details may vary.
              Consult automotive and financial professionals for specific
              guidance.
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
              Explore verified luxury vehicles from the world's most exclusive
              marques, backed by transparent history and curated dealer
              networks.
            </p>
          </div>
          <a
            href={CTA_URL}
            className="shrink-0 whitespace-nowrap border border-[#F7F4EC] px-6 py-3 font-sans text-[13px] uppercase tracking-[0.08em] text-[#F7F4EC] transition-colors hover:bg-[#F7F4EC] hover:text-[#1C1A17]"
          >
            Browse Curated Vehicles
          </a>
        </div>
      </div>
    </div>
  );
}
