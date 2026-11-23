import React from "react";

// Turns whatever the editor pasted into something we can render:
//  - YouTube / Vimeo page links  -> their embed player
//  - <iframe ...> embed code     -> its src only (the rest of the markup is ignored)
//  - direct .mp4 / .webm / .mov  -> native <video>
//  - any other https embed URL   -> iframe as-is
// Returns null for anything that isn't https, so nothing unsafe is rendered.
export function parseVideo(input) {
  let value = String(input || "").trim();
  if (!value) return null;

  if (/^<iframe/i.test(value)) {
    value = value.match(/\ssrc=["']([^"']+)["']/i)?.[1] || "";
  }
  if (value.startsWith("//")) value = `https:${value}`;

  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;

  const host = url.hostname.replace(/^www\.|^m\./, "");

  // YouTube
  let ytId = null;
  if (host === "youtu.be") ytId = url.pathname.slice(1).split("/")[0];
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") ytId = url.searchParams.get("v");
    else ytId = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1] || null;
  }
  if (ytId && /^[\w-]{6,}$/.test(ytId)) {
    const start = parseInt(
      url.searchParams.get("start") || url.searchParams.get("t") || "",
      10,
    );
    return {
      type: "iframe",
      src: `https://www.youtube-nocookie.com/embed/${ytId}?rel=0${
        Number.isFinite(start) && start > 0 ? `&start=${start}` : ""
      }`,
    };
  }

  // Vimeo
  if (host === "vimeo.com") {
    const id = url.pathname.match(/^\/(\d+)/)?.[1];
    if (id) return { type: "iframe", src: `https://player.vimeo.com/video/${id}` };
  }

  // Direct video file
  if (/\.(mp4|webm|mov|m4v)$/i.test(url.pathname)) {
    return { type: "video", src: url.href };
  }

  return { type: "iframe", src: url.href };
}

// Editorial video block: ruled "Watch" header, 16:9 player, optional caption.
export default function JournalVideo({ value, caption, title }) {
  const video = parseVideo(value);
  if (!video) return null;

  return (
    <figure className="my-10 border-y border-[#DDD6C7] py-8">
      <div className="mb-6 flex justify-center">
        <span className="border-b border-[#DDD6C7] px-6 pb-2 font-sans text-[12px] font-medium uppercase tracking-[0.28em] text-[#1C1A17]">
          Watch
        </span>
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-[#1C1A17]">
        {video.type === "video" ? (
          <video
            src={video.src}
            controls
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-contain"
          />
        ) : (
          <iframe
            src={video.src}
            title={caption || title || "Embedded video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>

      {caption && (
        <figcaption className="mt-3 font-sans text-[12px] text-[#4A463F]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
