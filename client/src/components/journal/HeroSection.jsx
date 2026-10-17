import { Link } from "react-router-dom";
import useLatestPosts from "./cms/useLatestPosts";
import haaland from "/src/assets/journal/blog_eleven/hero.webp";
import terry from "/src/assets/journal/blog_twelve/hero_image.webp";
import zendaya from "/src/assets/journal/blog_thirteen/hero.webp";
import porsche from "/src/assets/journal/blog_fourteen/hero.webp";

// Hero slots: [0] large featured, [1..2] side list, [3] small image card
const POST_COUNT = 4;

// Hand-written stories that live in the codebase (not in the CMS).
// Fallback only: newer posts published from the Journal CMS push these
// down and they drop off the hero on their own.
const LEGACY_POSTS = [
  {
    tag: "Ownership Guides",
    category: "Real Estate",
    title:
      "Hollywood Star Terry Crews Buys Luxury Residence at Binghatti Aquarise in Dubai",
    excerpt:
      "Binghatti Developers has welcomed another global icon to its international portfolio of buyers, as Hollywood actor and television personality Terry Crews officially signed for an apartment at Binghatti Aquarise during the project's grand launch in Dubai.",
    image: terry,
    link: "/journal/terry-crews-binghatti-aquarise-dubai",
    publishedAt: "2026-07-28",
  },
  {
    tag: "Celebrity Real Estate",
    category: "Real Estate",
    title: "Inside Zendaya and Tom Holland's $22 Million Property Portfolio",
    excerpt:
      "The longtime couple's real estate holdings include multiple California properties, a luxury Brooklyn condo, and a renovated London home.",
    image: zendaya,
    link: "/journal/zendaya-tom-holland-property-portfolio",
    publishedAt: "2026-07-28",
  },
  {
    tag: "Real Estate News",
    category: "Real Estate",
    title:
      "Road Test: Porsche's All-Electric Cayenne Delivers Uncommon S.U.V. Power With Poise",
    excerpt:
      "On a test drive in Germany, the 2027 Porsche Cayenne Turbo Coupe Electric floored us with its ability to summon more muscle than the 918 Spyder.",
    image: porsche,
    link: "/journal/porsche-cayenne-turbo-coupe-electric-road-test",
    publishedAt: "2026-07-28",
  },
  {
    tag: "Celebrity Collection",
    category: "Cars",
    title:
      "From Ferrari to Bugatti: Inside Erling Haaland's Multimillion-Dollar Car Collection",
    excerpt:
      "Goal-scoring records and Birkin bags aren't the only things the soccer star collects.",
    image: haaland,
    link: "/journal/erling-haaland-multimillion-dollar-car-collection",
    publishedAt: "2026-07-28",
  },
];

function Eyebrow({ tag, category, size = "text-[10px]", categoryColor = "text-gray-400" }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      {tag && (
        <>
          <span className={`${size} font-semibold uppercase tracking-widest text-[#c8a96e] montserrat`}>
            {tag}
          </span>
          <span className="text-gray-300 text-xs">·</span>
        </>
      )}
      <span className={`${size} font-medium uppercase tracking-wider ${categoryColor} montserrat`}>
        {category}
      </span>
    </div>
  );
}

function PostImage({ src, alt, className }) {
  return src ? (
    <img src={src} alt={alt} className={className} />
  ) : (
    <div className={`${className} bg-gray-100`} />
  );
}

function HeroSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 animate-pulse">
      <div>
        <div className="w-full h-[600px] bg-gray-100 rounded-sm" />
        <div className="mt-5 h-3 w-40 bg-gray-100 mb-4" />
        <div className="h-8 w-4/5 bg-gray-100 mb-3" />
        <div className="h-4 w-full bg-gray-100" />
      </div>
      <div className="flex flex-col gap-8">
        {[0, 1].map((i) => (
          <div key={i} className="flex gap-5 pb-8 border-b border-gray-100">
            <div className="w-[140px] h-[100px] flex-shrink-0 bg-gray-100 rounded-sm" />
            <div className="flex-1">
              <div className="h-3 w-24 bg-gray-100 mb-3" />
              <div className="h-4 w-full bg-gray-100 mb-2" />
              <div className="h-4 w-2/3 bg-gray-100" />
            </div>
          </div>
        ))}
        <div className="pt-2">
          <div className="w-full h-[170px] bg-gray-100 rounded-sm mb-4" />
          <div className="h-3 w-24 bg-gray-100 mb-3" />
          <div className="h-4 w-full bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const posts = useLatestPosts(LEGACY_POSTS, POST_COUNT);

  if (posts && posts.length === 0) return null;

  const [featured, ...rest] = posts || [];
  const sideArticles = rest.slice(0, 2);
  const extraArticle = rest[2];

  return (
    <section className="w-full bg-white font-sans">
      {/* Hero Grid */}
      <div className="mx-auto px-25 py-10">
        {!posts ? (
          <HeroSkeleton />
        ) : (
          /* Two-column layout: large featured + stacked side */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
            {/* Featured (latest, large left) */}
            <Link to={featured.link} className="group block">
              <div className="overflow-hidden rounded-sm">
                <PostImage
                  src={featured.image}
                  alt={featured.title}
                  className="w-full h-[600px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
              <div className="mt-5">
                <div className="mb-3">
                  <Eyebrow
                    tag={featured.tag}
                    category={featured.category}
                    size="text-[12px]"
                    categoryColor="text-gray-500"
                  />
                </div>
                <h2
                  className="text-3xl font-bold leading-tight text-gray-900 mb-3 group-hover:text-[#c8a96e] transition-colors"
                  style={{
                    fontFamily: "'Kaisei Decol', serif",
                  }}
                >
                  {featured.title}
                </h2>
                {featured.excerpt && (
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}
              </div>
            </Link>

            {/* Side stack */}
            <div className="flex flex-col gap-8">
              {sideArticles.map((article, idx) => (
                <Link
                  key={article.link}
                  to={article.link}
                  className={`group flex gap-5 ${
                    idx < sideArticles.length - 1 || extraArticle
                      ? "pb-8 border-b border-gray-100"
                      : ""
                  }`}
                >
                  <div className="flex-shrink-0 overflow-hidden rounded-sm">
                    <PostImage
                      src={article.image}
                      alt={article.title}
                      className="w-[140px] h-[100px] object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <Eyebrow tag={article.tag} category={article.category} />
                    <h3
                      className="text-[14px] font-semibold text-gray-900 group-hover:text-[#c8a96e] transition-colors "
                      style={{
                        fontFamily: "'Kaisei Decol', serif",
                      }}
                    >
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}

              {/* Extra featured card */}
              {extraArticle && (
                <Link to={extraArticle.link} className="group block pt-2">
                  <div className="overflow-hidden rounded-sm mb-4">
                    <PostImage
                      src={extraArticle.image}
                      alt={extraArticle.title}
                      className="w-full h-[170px] object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <Eyebrow
                    tag={extraArticle.tag}
                    category={extraArticle.category}
                  />
                  <h3
                    className="text-sm font-bold leading-snug text-gray-900 group-hover:text-[#c8a96e] transition-colors"
                    style={{
                      fontFamily: "'Kaisei Decol', serif",
                    }}
                  >
                    {extraArticle.title}
                  </h3>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
