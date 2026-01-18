import React from 'react'

const BlogSection = () => {
    const mainPost = {
        title: 'European Pied-à-Terres: How Streamlined Co-Ownership Is Reshaping Luxury Urban Living Abroad',
        date: '14 Jan 2026',
        snippet: 'The appeal of a European pied-à-terre has long captivated high-net-worth individuals seeking a home away from home...',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200'
    }

    const sidePosts = [
        {
            title: "Vorarlberg's Alpine Retreat: Exclusive Property Opportunities in Austria's Premier Ski Region",
            date: '14 Jan 2026',
            snippet: 'In the heart of the Arlberg ski region and the tranquil valleys of Brandnertal and Wald am Arlberg...',
            image: 'https://images.unsplash.com/photo-1549111351-befbe8af806b?auto=format&fit=crop&w=400'
        },
        {
            title: "The Prestige Effect: 7 Most-Viewed Celebrity Estates on JamesEdition in 2025",
            date: '08 Jan 2026',
            snippet: 'Celebrity-owned consistently leads readership and drives listing engagement. At the intersection...',
            image: 'https://images.unsplash.com/photo-1613977257363-b9016c144d0c?auto=format&fit=crop&w=400'
        },
        {
            title: "From Hidden Gem to Global Hotspot: Inside Bermuda's Luxury Real Estate Renaissance",
            date: '06 Jan 2026',
            snippet: 'In this episode, Eric Finnas Dahlstrom, CEO of JamesEdition, sits down with Jonathan Halata, Head...',
            image: 'https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=400'
        }
    ]

    return (
        <section className="w-full px-16 py-16 bg-white">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-4xl font-bodoni font-normal text-black">Our Blog</h2>
                <button className="px-10 py-3 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors">
                    Read More...
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Main Post */}
                <div className="relative group cursor-pointer overflow-hidden aspect-[16/10]">
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
                </div>

                {/* Right: Side Posts */}
                <div className="flex flex-col gap-10">
                    {sidePosts.map((post, idx) => (
                        <div key={idx} className="flex gap-6 group cursor-pointer">
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
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default BlogSection
