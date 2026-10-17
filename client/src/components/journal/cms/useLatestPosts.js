import { useEffect, useState } from "react";

// Latest published Journal posts for "featured + side" layouts
// (homepage "Our Blog", Journal hero).
//
// Merges CMS posts from /api/blog with hand-written fallback posts,
// sorts newest first, and returns the top `count`.
// Publishing a newer post in the CMS pushes it into slot 0 and the
// oldest one drops off automatically.
//
// Returns null while loading, then an array of:
// { title, excerpt, image, link, tag, category, publishedAt }

// Newest first. On the same date, CMS posts win over fallback ones,
// then the original order is kept.
const pickLatest = (cmsPosts, legacyPosts, count) => {
  const all = [
    ...cmsPosts.map((p, i) => ({ ...p, source: 0, order: i })),
    ...legacyPosts.map((p, i) => ({ ...p, source: 1, order: i })),
  ];

  const seen = new Set();
  return all
    .sort(
      (a, b) =>
        new Date(b.publishedAt) - new Date(a.publishedAt) ||
        a.source - b.source ||
        a.order - b.order,
    )
    .filter((p) => {
      if (seen.has(p.link)) return false;
      seen.add(p.link);
      return true;
    })
    .slice(0, count);
};

export default function useLatestPosts(legacyPosts = [], count = 4) {
  const [posts, setPosts] = useState(null); // null = still loading

  useEffect(() => {
    let cancelled = false;

    fetch("/api/blog")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) =>
        (Array.isArray(data) ? data : []).map((p) => ({
          title: p.title,
          excerpt: p.excerpt,
          image: p.heroImage,
          link: `/journal/${p.slug}`,
          tag: p.tag,
          category: p.category,
          publishedAt: p.publishedAt,
        })),
      )
      .catch(() => [])
      .then((cmsPosts) => {
        if (!cancelled) setPosts(pickLatest(cmsPosts, legacyPosts, count));
      });

    return () => {
      cancelled = true;
    };
    // legacyPosts is a module-level constant in callers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  return posts;
}

// "2026-07-28" / ISO string -> "28 July 2026" (UTC so the CMS date never shifts a day)
export const formatPostDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
