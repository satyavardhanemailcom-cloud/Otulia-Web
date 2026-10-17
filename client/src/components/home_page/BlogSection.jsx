import React from "react";
import useLatestPosts, {
  formatPostDate as formatDate,
} from "../journal/cms/useLatestPosts";

import haalandImg from "../../assets/journal/blog_eleven/hero.webp";
import terryImg from "../../assets/journal/blog_twelve/hero_image.webp";
import zendayaImg from "../../assets/journal/blog_thirteen/hero.webp";
import porscheImg from "../../assets/journal/blog_fourteen/hero.webp";

// How many posts the homepage shows: 1 featured (left) + 3 side posts (right)
const POST_COUNT = 4;

// Hand-written stories that live in the codebase (not in the CMS).
// They only act as fallback: as soon as newer posts are published from the
// Journal CMS, these get pushed down and drop off the homepage on their own.
const LEGACY_POSTS = [
  {
    title:
      "From Ferrari to Bugatti: Inside Erling Haaland's Multimillion-Dollar Car Collection",
    publishedAt: "2026-07-28",
    excerpt:
      "Goal-scoring records and Birkin bags aren't the only things the soccer star collects.",
    image: haalandImg,
    link: "/journal/erling-haaland-multimillion-dollar-car-collection",
  },
  {
    title:
      "Hollywood Star Terry Crews Buys Luxury Residence at Binghatti Aquarise in Dubai",
    publishedAt: "2026-07-28",
    excerpt:
      "Binghatti Developers has welcomed another global icon to its international portfolio of buyers, as...",
    image: terryImg,
    link: "/journal/terry-crews-binghatti-aquarise-dubai",
  },
  {
    title: "Inside Zendaya and Tom Holland's $22 Million Property Portfolio",
    publishedAt: "2026-07-28",
    excerpt:
      "The longtime couple's real estate holdings include multiple California properties, a luxury Brooklyn condo, and a renovated London home.",
    image: zendayaImg,
    link: "/journal/zendaya-tom-holland-property-portfolio",
  },
  {
    title:
      "Road Test: Porsche's All-Electric Cayenne Delivers Uncommon S.U.V. Power With Poise",
    publishedAt: "2026-07-28",
    excerpt:
      "On a test drive in Germany, the 2027 Porsche Cayenne Turbo Coupe Electric floored us with its ability to summon more muscle than the 918 Spyder.",
    image: porscheImg,
    link: "/journal/porsche-cayenne-turbo-coupe-electric-road-test",
  },
];

const PostImage = ({ src, alt, className }) =>
  src ? (
    <img src={src} alt={alt} loading="lazy" className={className} />
  ) : (
    <div className="w-full h-full bg-gray-100" />
  );

const BlogSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
    <div>
      <div className="aspect-[16/9] bg-gray-100 mb-6" />
      <div className="h-3 w-28 bg-gray-100 mb-4" />
      <div className="h-8 w-4/5 bg-gray-100 mb-3" />
      <div className="h-4 w-full bg-gray-100" />
    </div>
    <div className="flex flex-col gap-10">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex gap-6">
          <div className="w-48 h-32 flex-shrink-0 bg-gray-100" />
          <div className="flex-1">
            <div className="h-3 w-24 bg-gray-100 mb-3" />
            <div className="h-5 w-full bg-gray-100 mb-2" />
            <div className="h-3 w-3/4 bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const BlogSection = () => {
  const posts = useLatestPosts(LEGACY_POSTS, POST_COUNT);

  if (posts && posts.length === 0) return null;

  const [mainPost, ...sidePosts] = posts || [];

  return (
    <section className="w-full px-3 md:px-6 py-6 bg-white">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-4xl canela text-black">Our Blog</h2>
      </div>

      {!posts ? (
        <BlogSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Featured (latest) Post */}
          <a
            href={mainPost.link}
            target="_blank"
            className="group cursor-pointer flex flex-col"
          >
            <div className="overflow-hidden aspect-[16/9] mb-6">
              <PostImage
                src={mainPost.image}
                alt={mainPost.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <span className="text-gray-400 text-sm font-semibold mb-3 block tracking-wide uppercase">
              {formatDate(mainPost.publishedAt)}
            </span>
            <h3 className="text-2xl md:text-3xl text-black font-serif font-bold leading-tight mb-3 group-hover:underline decoration-1 underline-offset-4">
              {mainPost.title}
            </h3>
            {mainPost.excerpt && (
              <p className="text-gray-500 text-sm leading-relaxed max-w-2xl line-clamp-3">
                {mainPost.excerpt}
              </p>
            )}
          </a>

          {/* Right: Next 3 Posts */}
          <div className="flex flex-col gap-10">
            {sidePosts.map((post) => (
              <a
                key={post.link}
                href={post.link}
                target="_blank"
                className="flex gap-6 group cursor-pointer"
              >
                <div className="w-48 h-32 flex-shrink-0 overflow-hidden">
                  <PostImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <span className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-tight">
                    {formatDate(post.publishedAt)}
                  </span>
                  <h4 className="text-lg font-bold text-black leading-snug mb-2 group-hover:text-gray-700 transition-colors">
                    {post.title}
                  </h4>
                  {post.excerpt && (
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
