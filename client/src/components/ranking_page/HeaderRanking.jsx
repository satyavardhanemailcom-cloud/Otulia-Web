import React, { useState } from "react";
import {
  FaTrophy,
  FaUsers,
  FaRegCalendarAlt,
  FaChevronRight,
} from "react-icons/fa";
import { IoShareSocialOutline } from "react-icons/io5";
import ShareListingModal from "../asset_page/ShareListingModal";

function RankingHeader({ data }) {
  const [isShareOpen, setIsShareOpen] = useState(false);
  if (!data) return null;

  const { tag, main, sub } = (function getTitleParts(
    title = "",
    highlight = "",
  ) {
    let main = title.trim();
    let sub = highlight ? highlight.trim() : "";
    let tag = "TOP";

    if (/^best\s+/i.test(main)) {
      main = main.replace(/^best\s+/i, "");
    }

    if (!sub) {
      if (/\s+of\s+\d{4}$/i.test(main)) {
        sub = main.match(/\s+of\s+\d{4}$/i)[0].trim();
        main = main.replace(/\s+of\s+\d{4}$/i, "");
      } else if (/\s+\d{4}$/i.test(main)) {
        sub = "OF " + main.match(/\s+\d{4}$/i)[0].trim();
        main = main.replace(/\s+\d{4}$/i, "");
      } else {
        sub = "OF 2026";
      }
    }

    return {
      tag: tag.toUpperCase(),
      main: main.toUpperCase(),
      sub: sub.toUpperCase(),
    };
  })(data.titleMain || "Hypercars", data.titleHighlight);

  const fallbackBanner =
    "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1600&auto=format&fit=crop";
  const coverImg =
    data.bannerImage || data.coverImage || data.categoryImage || fallbackBanner;
  const isContentCreator = ["content creator", "content creators"].includes(
    String(data.type || "").trim().toLowerCase(),
  );

  return (
    <section className="bg-transparent pt-2 pb-6 font-sans">
      {/* Breadcrumb Navigation above banner */}
      {data.breadcrumbs && data.breadcrumbs.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-zinc-400 mb-3 font-sans">
          {data.breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              <span className="hover:text-white transition cursor-pointer">
                {item}
              </span>
              {index !== data.breadcrumbs.length - 1 && (
                <FaChevronRight className="text-[10px] text-zinc-600" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Main Cover Banner Box */}
      {!isContentCreator && <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-800/80 shadow-2xl lg:min-h-[416px] lg:h-[416px] flex items-center bg-black">
        {/* Banner Cover Image */}
        <img
          src={coverImg}
          alt={data.titleMain || "Category Banner"}
          className="w-full h-auto block lg:absolute lg:inset-0 lg:h-full lg:object-cover object-center"
        />

        <button
          type="button"
          onClick={() => setIsShareOpen(true)}
          aria-label="Share this ranking"
          className="absolute right-3 top-3 z-20 inline-flex h-10 items-center gap-2 rounded-full border border-white/25 bg-black/70 px-4 text-sm font-medium text-white shadow-lg backdrop-blur transition hover:bg-black/90 sm:right-4 sm:top-4"
        >
          <IoShareSocialOutline className="h-5 w-5" />
          <span>Share</span>
        </button>

        {/* Gradient Overlay for Text Contrast */}
        {/* 
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent w-full md:w-3/4 lg:w-3/5" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        */}

        {/* Content Container inside Banner */}
        {/* 
        <div className="relative z-10 p-5 sm:p-7 md:p-8 max-w-2xl text-white flex flex-col justify-between min-h-full">
          <div>
            <span className="text-[#D48D2A] font-bold text-xs md:text-sm tracking-[0.25em] uppercase mb-0.5 block">
              {tag}
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-none">
              {main}
            </h1>

            <div className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#D48D2A] leading-none mt-1 mb-3">
              {sub}
            </div>

            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-xl font-normal mb-5">
              {data.description || "Ranking the world's most extreme machines that push the limits of speed, engineering, and innovation."}
            </p>
          </div>

          <div className="flex items-center gap-5 sm:gap-7 flex-wrap pt-4 border-t border-zinc-700/50">
            <div className="flex items-center gap-3">
              <FaTrophy className="text-[#D48D2A] text-2xl sm:text-3xl shrink-0" />
              <div className="flex flex-col justify-center">
                <span className="font-black text-base sm:text-lg text-white leading-tight">
                  {data.nominees || "0"}
                </span>
                <span className="text-[10px] tracking-widest text-zinc-400 font-bold uppercase mt-0.5">
                  NOMINEES
                </span>
              </div>
            </div>

            <div className="h-7 w-[1px] bg-zinc-700/60" />

            <div className="flex items-center gap-3">
              <FaUsers className="text-zinc-300 text-2xl sm:text-3xl shrink-0" />
              <div className="flex flex-col justify-center">
                <span className="font-black text-base sm:text-lg text-white leading-tight">
                  {data.votes ? `${data.votes}${data.votes.endsWith('+') || data.votes.endsWith('K') ? '' : '+'}` : "0"}
                </span>
                <span className="text-[10px] tracking-widest text-zinc-400 font-bold uppercase mt-0.5">
                  TOTAL VOTES
                </span>
              </div>
            </div>

            <div className="h-7 w-[1px] bg-zinc-700/60" />

            <div className="flex items-center gap-3">
              <FaRegCalendarAlt className="text-zinc-300 text-2xl sm:text-3xl shrink-0" />
              <div className="flex flex-col justify-center">
                <span className="font-black text-xs sm:text-sm text-white leading-tight uppercase">
                  {data.updated || "MAY 2026"}
                </span>
                <span className="text-[10px] tracking-widest text-zinc-400 font-bold uppercase mt-0.5">
                  LAST UPDATED
                </span>
              </div>
            </div>
          </div>
        </div> 
        */}
      </div>}
      {isShareOpen && (
        <ShareListingModal
          asset={{ title: data.titleMain || main, description: data.description }}
          assetType="Ranking"
          image={coverImg}
          shareDescription={data.description}
          showPrice={false}
          onClose={() => setIsShareOpen(false)}
        />
      )}
    </section>
  );
}

export default RankingHeader;
