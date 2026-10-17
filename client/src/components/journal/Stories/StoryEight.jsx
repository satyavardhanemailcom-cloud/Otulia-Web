import React from "react";
import first_image from "../../../assets/journal/blog_eight/img-01.png";
import second_image from "../../../assets/journal/blog_eight/img-02.png";
import third_image from "../../../assets/journal/blog_eight/img-03.png";
import fourth_image from "../../../assets/journal/blog_eight/img-04.png";
import fifth_image from "../../../assets/journal/blog_eight/img-05.png";
import sixth_image from "../../../assets/journal/blog_eight/img-06.png";
import hero_image from "../../../assets/journal/blog_eight/hero.png";

// ---------------------------------------------------------------------------
// Configurable constants — swap these out for handoff / CMS wiring
// ---------------------------------------------------------------------------
const BRAND_NAME = "Otulia";
const EYEBROW = "Showcase";
const TITLE = "The 2027 Ferrari 12Cilindri Manuale in Photos";
const SUBTITLE = "It's the first Prancing Horse with a stick shift since 2012.";
const INTRO =
  "Ferrari just unveiled its first manual model in over a decade, the 2027 12Cilindri Manuale.";
const DATE_PUBLISHED = "16 Jul 2026";
const CTA_URL = "#";

const PHOTOS = [
  {
    caption: "The 2027 Ferrari 12Cilindri Manuale",
    source: first_image,
    note: "The supercar is the company's first to feature a manual transmission in more than a decade.",
  },
  {
    caption: "Inside the 2027 Ferrari 12Cilindri Manuale",
    source: third_image,
  },
  {
    caption: "The center console features a gated shifter",
    source: fourth_image,
  },
  {
    caption:
      "Manual mode gives drivers access to six of the engine's eight gears",
    source: fifth_image,
  },
  {
    caption:
      "Only 1,499 examples of the 2027 Ferrari 12Cilindri Manuale will be built",
    source: sixth_image,
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

// Styled placeholder for a photo that hasn't been supplied yet — flagged
// clearly so it's obvious to a CMS editor that a real press photo belongs here.
function PhotoPlaceholder({ caption, note, source }) {
  return (
    <figure className="mb-14">
      <div className="flex aspect-[3/2] w-full flex-col items-center justify-center gap-3 ">
        <img src={source} />
      </div>
      <figcaption className="mt-3 font-sans text-[13px] text-[#1C1A17]">
        {caption}
      </figcaption>
      {note && (
        <p className="mt-1 font-serif-body text-[15px] leading-relaxed text-[#4A463F]">
          {note}
        </p>
      )}
    </figure>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function Ferrari12CilindriManualeGallery() {
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
        <h1 className="mt-4 font-display text-[32px] leading-[1.14] text-[#1C1A17] md:text-[42px]">
          {TITLE}
        </h1>

        {/* Subtitle */}
        <p className="mt-5 font-serif-body text-[17px] leading-relaxed text-[#4A463F] md:text-[18px]">
          {SUBTITLE}
        </p>

        <img src={hero_image} />

        {/* Byline row */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#DDD6C7] pb-6">
          <p className="font-sans text-[12px] uppercase tracking-[0.1em] text-[#4A463F]">
            {DATE_PUBLISHED}
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

        {/* Intro line */}
        <p className="mt-6 mb-14 font-serif-body text-[16px] leading-[1.75] text-[#332F29] md:text-[17px]">
          {INTRO}
        </p>

        {/* Photo gallery */}
        <div>
          {PHOTOS.map((photo) => (
            <PhotoPlaceholder
              key={photo.caption}
              caption={photo.caption}
              note={photo.note}
              source={photo.source}
            />
          ))}
        </div>

        {/* CTA banner */}
        <div className="mt-4 flex flex-col items-start justify-between gap-6 border border-[#1C1A17] bg-[#1C1A17] p-8 text-[#F7F4EC] md:flex-row md:items-center md:p-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[0.14em] text-[#A8823F]">
              {BRAND_NAME}
            </p>
            <p className="mt-3 max-w-md font-display text-[22px] leading-snug md:text-[24px]">
              Track limited-production supercars like the 12Cilindri Manuale as
              they come to market.
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
