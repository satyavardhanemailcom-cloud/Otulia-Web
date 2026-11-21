import React from "react";
import { BlogCard, blogPosts } from "./BlogCards";
import useCmsPosts from "./cms/useCmsPosts";
import JournalComments from "./JournalComments";

const RELATED_COUNT = 4;

// Category of any journal post (hand-written or CMS) by slug
export const getPostCategory = (slug, cmsPosts = []) =>
  [...blogPosts, ...cmsPosts].find((p) => p.link === `/journal/${slug}`)
    ?.category || null;

// Bottom of every Journal article: related stories from the same
// category (same cards as the Journal home), then the comments.
export default function JournalArticleFooter({
  slug,
  category: categoryProp,
  commentsEnabled = true,
}) {
  const cmsPosts = useCmsPosts();
  const category = categoryProp || getPostCategory(slug, cmsPosts);

  // Same ordering as the Journal home grid: newest first
  const related = [...blogPosts, ...cmsPosts]
    .reverse()
    .filter(
      (p) =>
        p.link !== `/journal/${slug}` && (!category || p.category === category),
    )
    .slice(0, RELATED_COUNT);

  return (
    <div className="w-full bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,500;1,8..60,400&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Fraunces', serif; }
        .font-serif-body { font-family: 'Source Serif 4', Georgia, serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {related.length > 0 && (
        <section className="mx-auto px-4 pb-16 md:px-25">
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-100" />
            <span className="px-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {category ? `More ${category} Stories` : "More Stories"}
            </span>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {commentsEnabled && (
        <div className="mx-auto w-full max-w-[880px] px-4 pb-24 md:px-8">
          <JournalComments slug={slug} />
        </div>
      )}
    </div>
  );
}
