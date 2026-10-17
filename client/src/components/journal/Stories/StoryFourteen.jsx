import React, { useState } from "react";
import hero_image from "../../../assets/journal/blog_fourteen/hero.webp";
import first_image from "../../../assets/journal/blog_fourteen/img_01.webp";
import second_image from "../../../assets/journal/blog_fourteen/img_02.webp";
import third_image from "../../../assets/journal/blog_fourteen/img_03.webp";
import four_image from "../../../assets/journal/blog_fourteen/img_04.webp";
import fifth_image from "../../../assets/journal/blog_fourteen/img_05.webp";
import sixth_image from "../../../assets/journal/blog_fourteen/img_06.webp";

const BRAND_NAME = "Otulia";
const EYEBROW = "Road Test";
const TITLE =
  "Road Test: Porsche's All-Electric Cayenne Delivers Uncommon S.U.V. Power With Poise";
const SUBTITLE =
  "On a test drive in Germany, the 2027 Porsche Cayenne Turbo Coupe Electric floored us with its ability to summon more muscle than the 918 Spyder.";
const AUTHOR = "Otulia Editorial Team";
const REVIEWER = "Otulia Automotive Network";
const DATE_PUBLISHED = "28 Jul 2026";
const READ_TIME = "10 Minute Read";
const CTA_URL = "#";

const TOC = [
  { id: "overview", label: "Introduction" },
  { id: "whats-new", label: "What\u2019s New for 2027" },
  { id: "design", label: "Design" },
  { id: "powertrain", label: "Power Train and Other Hardware" },
  { id: "performance", label: "Performance" },
  { id: "worth-it", label: "Is It Worth It?" },
  { id: "specs", label: "Specifications" },
  { id: "faqs", label: "FAQs" },
];

const FAQS = [
  {
    q: "How much horsepower does the 2027 Porsche Cayenne Turbo Coupe Electric have?",
    a: "The Cayenne Turbo Coupe Electric produces 845 hp in normal operation and up to 1,139 hp with launch control engaged, making it among the most powerful Porsches in the marque's 78-year history.",
  },
  {
    q: "How fast is the 2027 Porsche Cayenne Turbo Coupe Electric?",
    a: "Porsche claims zero to 60 mph in 2.4 seconds, with a top speed of 162 mph. It can also hit 124 mph in 7.4 seconds and dispatch a quarter-mile sprint in 9.9 seconds.",
  },
  {
    q: "What is the range of the 2027 Porsche Cayenne Turbo Coupe Electric?",
    a: "The EPA has not offered official estimates, but Porsche expects electric Cayennes to easily surpass 340 miles in real-world driving.",
  },
  {
    q: "How much does the 2027 Porsche Cayenne Turbo Coupe Electric cost?",
    a: "The Cayenne Turbo Coupe Electric starts at $170,350. As tested, the review vehicle priced out at $233,000 after options. A standard Cayenne Coupe Electric starts from $116,150, and a Cayenne S Coupe Electric starts from $133,550.",
  },
  {
    q: "What charging technology does the 2027 Porsche Cayenne Turbo Coupe Electric use?",
    a: "The Cayenne features a sophisticated 800-volt architecture that allows a blazing 400-kilowatt charging rate, enabling a refill from 10 percent to 80 percent in less than 16 minutes. It also offers an ingenious wireless inductive charging system.",
  },
];

const SPECS = [
  { label: "Vehicle Type", value: "All-electric midsize S.U.V., standard AWD" },
  { label: "In Production Since", value: "2026 for the 2027 model year" },
  {
    label: "Power Train",
    value:
      "Dual permanent-magnet synchronous AC motors; Output: 845 hp, rising to 1,139 hp and 1,106 ft lbs of torque under launch control",
  },
  {
    label: "Performance",
    value: "Zero to 60 mph: 2.4 seconds; Top Speed: 162 mph",
  },
  { label: "Base Price", value: "$170,350" },
  { label: "As Tested", value: "$233,000" },
];

const PRICING_TABLE = [
  {
    model: "Cayenne Coupe Electric",
    hp: "402 hp (435 launch)",
    zeroTo60: "4.5 sec",
    base: "$116,150",
  },
  {
    model: "Cayenne S Coupe Electric",
    hp: "536 hp (657 launch)",
    zeroTo60: "3.7 sec",
    base: "$133,550",
  },
  {
    model: "Cayenne Turbo Coupe Electric",
    hp: "845 hp (1,139 launch)",
    zeroTo60: "2.4 sec",
    base: "$170,350",
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

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PorscheCayenneElectricArticle() {
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
            <section id="overview" className="mb-12 scroll-mt-28">
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Porsche has struggled to bring an all-electric sports car to
                fruition, with battery-powered versions of its Boxster and
                Cayman seemingly stuck in a holding pattern. But on the S.U.V.
                front, it’s been no problem. In fact, the 2027 Cayenne Turbo
                Coupe Electric we recently drove becomes among the most powerful
                Porsches—street models or racers—in the marque’s
                78-year-history.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Let the 911 diehards sulk. Or better, let them experience what
                1,139 hp and a torrential 1,106 ft lbs of torque feel like in a
                five-passenger, all-weather S.U.V.—one that adopts a familiar
                arsenal of Porsche tech, such as rear-axle steering and the
                superlative Active Ride suspension, and then adds more. An
                ingenious wireless inductive charging system let us replenish
                the Porsche in Bavaria without leaving the driver seat and
                reaching for an awkward cord and plug. A sophisticated 800-volt
                architecture allows a blazing 400-kilowatt charging rate,
                matching the Lucid Gravity’s, for a refill from 10 percent to 80
                percent in less than 16 minutes. And, as any $6-a-gallon pumper
                in California might envy at this geopolitical moment, the
                Cayenne combines generous electric driving range with zero
                tailpipe emissions.
              </p>
              <img src={first_image} className="pt-5" />
            </section>

            {/* What's New */}
            <section id="whats-new" className="mb-12 scroll-mt-28">
              <SectionHeading>What's New for 2027</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The calendar says 2026, but beginning in late summer, the only
                all-new, fourth-generation Cayenne you’ll be able to buy is this
                2027 electric model. It’s available in a choice of a standard
                S.U.V. body style or the fastback Coupe we tested. Porsche isn’t
                expected to roll out a redesigned, fourth-gen gasoline Cayenne
                until 2028 at the earliest, which will replace the current model
                that debuted in 2019 and received a facelift for 2024. Porsche
                reiterates plans to keep selling pure internal-combustion and
                hybrid Cayennes “up to 2030 and beyond” for its global
                customers, alongside these electric vehicles.
              </p>
            </section>

            {/* Design */}
            <section id="design" className="mb-12 scroll-mt-28">
              <SectionHeading>Design</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Among gasoline Cayennes, Porsche says 40 percent of U.S.
                customers choose the slope-roofed Coupe version over a standard
                model. Here, both the Cayenne Electric and Cayenne Coupe
                Electric adopt a standalone electric platform with a nearly
                five-inch longer wheelbase and a radically reimagined interior.
                Not a single body panel is shared with internal-combustion
                Cayennes, and near-zero components as well, aside from a shapely
                GT steering wheel.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Once again, the fastback Coupe becomes the more-fashionable
                choice, while trading nearly 20 percent of the standard model’s
                rear cargo space and a touch of rear headroom. Now lower by
                nearly an inch, the Coupe’s roof helps deliver an impressively
                slippery 0.23 coefficient of drag, which affords about 11
                additional miles of driving range versus its square-backed
                sibling. Active cooling flaps adorn the shapely nose, and
                there’s a jaunty active decklid spoiler. On the Turbo, a pair of
                active “aeroblades” emerge from the rear body at speeds above 34
                mph.
              </p>
              <img src={second_image} className="pt-5" />
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                For the first-time Porsche customers that the marque expects
                this EV to attract, a generational leap in cockpit tech and
                infotainment may rank among the Cayenne’s most winning features.
                A new digital driver interface—dramatic, yet not
                overwhelming—centers on a vertically oriented, 14.25-inch OLED
                screen that curls away from the dashboard. The console’s leather
                hand rest is a subtle-yet-significant advance, making it a
                breeze to operate the screen while in motion.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                In another edge over many EVs, analog switches manage some key
                controls, including a volume knob. An optional passenger screen
                brings a comprehensive range of functions, topping the gimmicky,
                limited shotgun screens from Ferrari and others. Passengers can
                watch videos on the road, the view digitally shielded from the
                driver. Screen-based vent controls are one EV trend Porsche
                might well have skipped. My test Turbo was ordered extra-spicy,
                including Dolomite Silver paint; 22-inch, red-painted “Satin
                Pyro” wheels; a Bordeaux-red leather interior, and “Porsche” and
                “Turbo” scripts tracing black doorsills.
              </p>
              <img src={third_image} className="pt-5" />
            </section>

            {/* Power Train */}
            <section id="powertrain" className="mb-12 scroll-mt-28">
              <SectionHeading>Power Train and Other Hardware</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Every electric Cayenne integrates dual electric motors for
                standard AWD. For the range-topping Turbo Coupe Electric, those
                motors churn out 845 hp in normal operation. Launch-control
                starts summon an improbable 1,139 hp, toppling previous Porsche
                kings such as the hybrid 918 Spyder or the recent Taycan GT
                Turbo. For Turbo and S models, a robust rear electric motor
                traces directly to Porsche’s championship-winning Formula E
                racers. Non-conductive cooling oil flows directly through
                internal copper windings that carry live electricity, versus the
                external liquid jackets of every current EV. That affords
                regenerative braking at a remarkable 600-kilowatt rate, without
                overcooking components.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                An air-spring suspension is standard, with options including
                rear-axle steering and a torque-vectoring rear axle. Also
                optional is the near-magical Active Ride suspension, which
                combines hydraulic dampers and electric motors to control
                unwanted body motions to an astounding degree. Selecting Comfort
                mode seemingly isolates the cabin entirely, making the Porsche
                feel like it’s hovering over the road surface with hardly any
                sensation of body roll in corners. In sportier modes, each wheel
                can counteract handling forces with up to 2,250 pounds of
                resisting force.
              </p>
              <img src={four_image} className="pt-5" />
            </section>

            {/* Performance */}
            <section id="performance" className="mb-12 scroll-mt-28">
              <SectionHeading>Performance</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                On a memorable run from Munich into the foothills of the Alps,
                the Cayenne Turbo Coupe Electric rewrote the rules for what an
                S.U.V. is supposed to do. Those launch-controlled starts urge
                the Coupe to 60 mph in a Porsche-quoted 2.4 seconds. It felt
                closer to 2.2 seconds—faster than several supercars. The
                brain-squeezing rush of those starts is nearly indescribable. As
                improbable, this Teutonic flying saucer can hit 124 mph in 7.4
                seconds, and dispatch a quarter-mile sprint in 9.9 seconds.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                On the Autobahn, the Cayenne effortlessly stormed to its 162 mph
                top speed, feeling granite-solid and maintaining an air of
                serenity inside. Drivers can dial in a digitized soundtrack that
                feels inspired by old-school V-8s, or waft in whispery silence,
                though with more tire roar than in some luxury EVs. While
                heading into the lush alpine hills circling Germany’s lovely
                inland lakes, the Cayenne demonstrated agile steering and
                corner-carving talents that, again, defied all expectations for
                a nearly 6,000-pound S.U.V. At any moment, an addictive squeeze
                of the push-to-pass button on the steering wheel delivers
                another 173 hp hit of electric boost, available in giddy
                10-second bursts.
              </p>
              <img src={fifth_image} className="pt-5" />
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Porsche continues to resist offering the one-pedal regenerative
                braking that’s a staple of many EVs, preferring its models to
                coast like traditional cars when you lift off throttle. The
                upside is the regenerative brake pedal that Porsche says can
                handle 97 percent of all stops in everyday driving. Only a
                deeper dive into the pedal travel engages the physical brakes,
                with a truly invisible transition between the regenerative and
                friction stoppers. Once activated, those brakes haul down this
                Cayenne with monstrous force, boosted via optional
                ceramic-composite brakes. As for the model’s range, the EPA has
                not offered estimates, but we expect electric Cayennes to easily
                surpass 340 miles in real-world driving.
              </p>
            </section>

            {/* Is It Worth It? */}
            <section id="worth-it" className="mb-12 scroll-mt-28">
              <SectionHeading>Is It Worth It?</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The Cayenne Turbo Coupe Electric is a tour de force of tech and
                plug-in performance. For our test model, a $170,350 base price
                rose to $233,000 after options. The shopping list included
                ceramic-composite brakes for $10,900, the Active Ride suspension
                for $7,700, an augmented-reality head-up display for $2,910, and
                rear-axle steering at a relative-bargain of $1,350.
              </p>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Porsche might point to a Lamborghini Urus SE, a plug-in hybrid
                with 789 hp, 700 ft lbs of torque, and an interior that, in my
                opinion, screams “mainstream Audi.” The Porsche reaches 60 mph a
                full second quicker than the hyper-aggressive Urus. That
                Lamborghini S.U.V. starts from $262,000, or closer to $340,000
                after options, more than $100,000 beyond this electric Cayenne.
              </p>
              <img src={sixth_image} className="pt-5" />
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                Buyers can choose a standard Cayenne Coupe Electric from
                $116,150, with 402 hp, 435 launch-controlled horses, and a
                perfectly respectable 4.5-second run to 60 mph. A Cayenne S
                Coupe Electric treads a delightful middle ground: 536 hp, 657
                horses at launch, and a 3.7-second sprint to 60 mph. That
                Cayenne S starts from $133,550, and rises to just over $200,000
                with options. They include a $17,390 Lightweight Package that
                includes a weight savings of 40 pounds, a carbon-fiber roof, and
                fabric seat inserts in the charming “pepita” pattern that traces
                to classic Porsches from the 1960s. It’s a rare touch of
                nostalgia in a Porsche whose gaze is fixed squarely on the
                future.
              </p>
            </section>

            {/* Specifications */}
            <section id="specs" className="mb-12 scroll-mt-28">
              <SectionHeading>Specifications</SectionHeading>
              <div className="mt-6 overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse font-sans text-[13px]">
                  <tbody>
                    {SPECS.map((spec, i) => (
                      <tr
                        key={spec.label}
                        className={
                          i !== SPECS.length - 1
                            ? "border-b border-[#DDD6C7]"
                            : ""
                        }
                      >
                        <td className="py-4 pr-4 font-medium text-[#1C1A17]">
                          {spec.label}
                        </td>
                        <td className="py-4 text-[#4A463F]">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Bottom line */}
            <section className="mb-12">
              <SectionHeading>The Bottom Line</SectionHeading>
              <p className="mt-5 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
                The 2027 Porsche Cayenne Turbo Coupe Electric is a genuine
                paradigm shift for the brand. It delivers the kind of
                straight-line performance that would have seemed absurd for an
                S.U.V. just five years ago, yet wraps it in a package that
                remains practical, comfortable, and unmistakably Porsche. With a
                starting price of $170,350, it undercuts the Lamborghini Urus by
                more than $100,000 while offering significantly more power and
                the benefit of zero tailpipe emissions. For buyers who want
                supercar speed without sacrificing S.U.V. versatility, this may
                be the most compelling Porsche ever built.
              </p>
            </section>

            {/* Reviewer / disclaimer */}
            <p className="mt-10 border-t border-[#DDD6C7] pt-6 font-sans text-[12px] leading-relaxed text-[#8A8577]">
              Reviewed by {REVIEWER}. This article is for general informational
              purposes and reflects a test drive conducted in Germany. Actual
              performance, range, and pricing may vary. Consult Porsche and
              local dealers for specific details and availability.
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
