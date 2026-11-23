import { Link } from "react-router-dom";
import useCmsPosts from "./cms/useCmsPosts";
import true_cost from "/src/assets/journal/true_cost.png";
import verify from "/src/assets/journal/verify.png";
import sell_faster from "/src/assets/journal/sell_faster.png";
import trends from "/src/assets/journal/trends.png";
import jumbo from "/src/assets/journal/jumbo.png";
import exotic_car from "/src/assets/journal/exotic_car.png";
import bieber from "/src/assets/journal/blog_nine/hero.png";
import mclaren from "/src/assets/journal/blog_seven/hero.png";
import ferrari from "/src/assets/journal/blog_eight/hero.png";
import novak from "/src/assets/journal/blog_ten/hero.png";
import haaland from "/src/assets/journal/blog_eleven/hero.webp";
import terry from "/src/assets/journal/blog_twelve/hero_image.webp";
import zendaya from "/src/assets/journal/blog_thirteen/hero.webp";
import porsche from "/src/assets/journal/blog_fourteen/hero.webp";

// Exported so article pages can reuse the same cards for "Related stories".
export const blogPosts = [
  {
    id: 1,
    tag: "Ownership Guides",
    category: "Cars",
    title: "The True Cost of Owning a Luxury Car: Beyond the Purchase Price",
    image: true_cost,
    author: "Otulia Editorial Team",
    date: "30 June",
    readTime: "9",
    link: "/journal/the-true-cost-of-owning-a-luxurycar",
  },
  {
    id: 2,
    tag: "Buyer Protection",
    category: "Cars",
    title:
      "How to Verify a Luxury Car's History and Authenticity Before You Buy",
    image: verify,
    author: "Otulia Editorial Team",
    date: "26 June",
    readTime: "8",
    link: "/journal/how-to-verify-a-luxury-car-history-and-authenticity-before-you-buy",
  },
  {
    id: 3,
    tag: "Seller Playbook",
    category: "Real Estate",
    title: "How to Stage a Luxury Home to Sell Faster (and for More)",
    image: sell_faster,
    author: "Otulia Editorial Team",
    date: "30 June",
    readTime: "8",
    link: "/journal/how-to-stage-a-luxury-home-to-sell-faster",
  },
  {
    id: 4,
    tag: "Market Intelligence",
    category: "Real Estate",
    title:
      "Luxury Real Estate Trends 2026: What Buyers and Sellers Need to Know",
    image: trends,
    author: "Otulia Editorial Team",
    date: "25 June",
    readTime: "8",
    link: "/journal/luxury-real-estate-trends-2026-what-buyers-and-sellers-need-to-know",
  },
  {
    id: 5,
    tag: "Financing Guide",
    category: "Real Estate",
    title:
      "Jumbo Loans Explained: What Buyers Need to Know Before Financing a Luxury Home",
    image: jumbo,
    author: "Otulia Editorial Team",
    date: "30 June",
    readTime: "8",
    link: "/journal/jumbo-loans-explained-what-buyers-need-to-know-before-financing-a-luxury-home",
  },
  {
    id: 6,
    tag: "Collector Insight",
    category: "Cars",
    title:
      "Which Exotic Cars Hold Their Value Best? A Guide to Investment-Grade Vehicles",
    image: exotic_car,
    author: "Otulia Editorial Team",
    date: "30 June",
    readTime: "8",
    link: "/journal/which-exotic-cars-hold-their-value-best-a-guide-to-investment-grade-vehicles",
  },
  {
    id: 7,
    tag: "Ownership Guides",
    category: "Cars",
    title: "McLaren Just Unveiled Its First New Supercar Since 2024",
    image: mclaren,
    author: "Otulia Editorial Team",
    date: "10 June",
    readTime: "< 1",
    link: "/journal/mclaren-just-unveiled-its-first-new-supercar-since-2024",
  },
  {
    id: 8,
    tag: "Showcase",
    category: "Cars",
    title: "The 2027 Ferrari 12Cilindri Manuale in Photos",
    image: ferrari,
    author: "Otulia Editorial Team",
    date: "14 July",
    readTime: "< 1",
    link: "/journal/photos-2027-ferrari-12cilindri-manuale",
  },
  {
    id: 9,
    tag: "Real Estate News",
    category: "Real Estate",
    title:
      "Justin and Hailey Bieber Just Bought a $12 Million N.Y.C. Pied-à-Terre",
    image: bieber,
    author: "Otulia Editorial Team",
    date: "14 July",
    readTime: "<4",
    link: "/journal/justin-hailey-bieber-buy-west-village-condo",
  },
  {
    id: 10,
    tag: "Celebrity Real Estate",
    category: "Real Estate",
    title: "Inside Novak Djokovic's Global Property Portfolio",
    image: novak,
    author: "Otulia Editorial Team",
    date: "14 July",
    readTime: "<10",
    link: "/journal/novak-djokovic-property-portfolio",
  },
  {
    id: 11,
    tag: "Celebrity Collection",
    category: "Cars",
    title:
      "From Ferrari to Bugatti: Inside Erling Haaland's Multimillion-Dollar Car Collection",
    image: haaland,
    author: "Otulia Editorial Team",
    date: "28 July",
    readTime: "8",
    link: "/journal/erling-haaland-multimillion-dollar-car-collection",
  },
  {
    id: 12,
    tag: "Celebrity Real Estate",
    category: "Real Estate",
    title:
      "Hollywood Star Terry Crews Buys Luxury Residence at Binghatti Aquarise in Dubai",
    image: terry,
    author: "Otulia Editorial Team",
    date: "28 July",
    readTime: "6",
    link: "/journal/terry-crews-binghatti-aquarise-dubai",
  },
  {
    id: 13,
    tag: "Celebrity Real Estate",
    category: "Real Estate",
    title: "Inside Zendaya and Tom Holland's $22 Million Property Portfolio",
    image: zendaya,
    author: "Otulia Editorial Team",
    date: "28 July",
    readTime: "8",
    link: "/journal/zendaya-tom-holland-property-portfolio",
  },
  {
    id: 14,
    tag: "Road Test",
    category: "Cars",
    title:
      "Road Test: Porsche's All-Electric Cayenne Delivers Uncommon S.U.V. Power With Poise",
    image: porsche,
    author: "Otulia Editorial Team",
    date: "28 July",
    readTime: "10",
    link: "/journal/porsche-cayenne-turbo-coupe-electric-road-test",
  },
];

function ClockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block mr-1"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function BlogCard({ post }) {
  const CardWrapper = post.link ? Link : "div";
  const wrapperProps = post.link ? { to: post.link } : {};

  return (
    <CardWrapper {...wrapperProps} className="group flex flex-col bg-white">
      {/* Image */}
      <div className="overflow-hidden rounded-sm mb-4">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[190px] object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          loading="lazy"
        />
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mb-2">
        {post.tag && (
          <>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#c8a96e] montserrat">
              {post.tag}
            </span>
            <span className="text-gray-300 text-xs">·</span>
          </>
        )}
        <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400 montserrat">
          {post.category}
        </span>
      </div>

      {/* Title */}
      <h3
        className="text-[16px] leading-[1.15] text-gray-900 group-hover:text-[#c8a96e] transition-colors mb-3 font-extrabold flex-1"
        style={{
          fontFamily: "'Kaisei Decol', serif",
        }}
      >
        {post.title}
      </h3>

      {/* Meta */}
      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-auto pt-2 border-t border-gray-100 montserrat">
        <span>{post.date}</span>
        <span>by</span>
        <span className="text-gray-500 font-normal">{post.author}</span>
        <span className="ml-auto flex items-center text-gray-400">
          <ClockIcon />
          {post.readTime} min.
        </span>
      </div>
    </CardWrapper>
  );
}

export default function BlogCards({ activeCategory = null }) {
  const cmsPosts = useCmsPosts();
  const allPosts = [...blogPosts, ...cmsPosts];
  const filteredPosts = (
    activeCategory
      ? allPosts.filter((post) => post.category === activeCategory)
      : allPosts
  )

    .slice()
    .reverse();

  return (
    <section className="w-full bg-white">
      <div className="mx-auto px-4 md:px-25 pb-16">
        {/* Section divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 px-2">
            {activeCategory ? `${activeCategory} Stories` : "Latest Stories"}
          </span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* Cards grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 text-sm py-16">
            No stories in this category yet — check back soon.
          </p>
        )}

        {/* Load More */}
        {/* <div className="flex justify-center mt-14">
          <button className="px-10 py-3 border border-black text-xs font-semibold uppercase tracking-widest text-black hover:bg-black hover:text-white transition-colors duration-200">
            Load More
          </button>
        </div> */}
      </div>
    </section>
  );
}
