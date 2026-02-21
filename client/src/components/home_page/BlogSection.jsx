import React from 'react'
import { useNavigate } from 'react-router-dom'

const BlogSection = () => {

        const navigate = useNavigate()

        const mainPost = {
        title: 'Luxury Real Estate 2026: An Outlook By Sotheby’s International Realty',
        date: '22 Jan 2026',
        snippet: 'The 2026 Luxury Outlook by Sotheby’s International Realty confirms a clear structural shift in the global property landscape.',
        image: 'https://luxurylifestyleawards.com/wp-content/uploads/2026/01/4-24-1536x1024.png',
        navigate: 'https://luxurylifestyleawards.com/experience/luxury-real-estate-2026-an-outlook-by-sothebys-international-realty'
    }

    const sidePosts = [
        {
            title: "Top 7 Most Expensive Cars in the World (2026 Edition)",
            date: '21 Jan 2026',
            snippet: 'Ultra expensive cars exist far beyond the realm of simple transportation. ',
            image: 'https://robbreport.com/wp-content/uploads/2025/07/RR_20250715_Most_Expensive_Cars_update_Lead.jpg?w=1000',
            navigate: 'https://www.motozite.com/blog/most-expensive-cars-in-the-world/'
        },
        {
            title: "7 Incredibly Chic Trends That Will Define Luxury in 2026",
            date: '08 Jan 2026',
            snippet: "There's a feeling of renewal in the air now that 2026 has arrived. The new year is a blank slate ready to be filled with a fresh ...",
            image: 'https://cdn.mos.cms.futurecdn.net/MV33hJCzxobZGH2N5gmeUi-1024-80.jpg.webp',
            navigate: 'https://www.whowhatwear.com/fashion/shopping/luxury-fashion-trends-2026'
        },
        {
            title: "The 10 Best Compact Luxury SUVs to Buy Right Now",
            date: '06 Jan 2026',
            snippet: 'German Hypercar Maker Capricorn Just Unveiled New Prototypes of Its $3.5 Million Beast ...',
            image: 'https://robbreport.com/wp-content/uploads/2026/02/RR_20260202_Best_Compact_SUVs_Lead.jpg?w=1000',
            navigate: 'https://robbreport.com/motors/cars/'
        }
    ]

    return (
        <section className="w-full px-3 md:px-16 py-6 bg-white">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl playfair-display text-black">Our Blog</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Main Post */}
                <a href={mainPost.navigate} target='_blank' className="relative group cursor-pointer overflow-hidden aspect-[16/10]">
                    <img src={mainPost.image} alt={mainPost.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10">
                        <span className="text-white/80 text-sm font-medium mb-4 block tracking-wide uppercase">{mainPost.date}</span>
                        <h3 className="text-3xl text-white font-serif font-bold leading-tight mb-4 group-hover:underline decoration-1 underline-offset-4">
                            {mainPost.title}
                        </h3>
                        <p className="text-white/90 text-sm leading-relaxed max-w-xl">
                            {mainPost.snippet}
                        </p>
                    </div>
                </a>

                {/* Right: Side Posts */}
                <div className="flex flex-col gap-10">
                    {sidePosts.map((post, idx) => (
                        <a key={idx} href={post.navigate} target='_blank' className="flex gap-6 group cursor-pointer">
                            <div className="w-48 h-32 flex-shrink-0 overflow-hidden">
                                <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <div className="flex flex-col justify-between">
                                <span className="text-gray-400 text-xs font-semibold mb-2 uppercase tracking-tight">{post.date}</span>
                                <h4 className="text-lg font-bold text-black leading-snug mb-2 group-hover:text-gray-700 transition-colors">
                                    {post.title}
                                </h4>
                                <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                                    {post.snippet}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BlogSection
