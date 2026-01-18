import React from 'react'

const SocialMedia = () => {
    const posts = [
        {
            id: 1,
            title: 'How much an F1 team really spends in a season',
            image: 'https://images.unsplash.com/photo-1541443131876-44b03de101c5?auto=format&fit=crop&w=600&q=80',
            label: 'Instagram'
        },
        {
            id: 2,
            title: 'The Weeknd buys Florida mega mansion with superyacht dock',
            image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
            label: 'YouTube'
        },
        {
            id: 3,
            title: 'This remote ski-out villa in Japan can be yours for just $8 million',
            image: 'https://images.unsplash.com/photo-1518005020951-ecc837016200?auto=format&fit=crop&w=600&q=80',
            label: 'X'
        },
        {
            id: 4,
            title: 'Guess the price of this 450 sq.ft tiny home in LA',
            image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80',
            label: 'Instagram'
        }
    ]

    return (
        <section className="w-full px-16 py-16 bg-white overflow-hidden">
            <div className="flex flex-col items-center mb-16">
                <h2 className="text-4xl font-bodoni font-normal text-black mb-10">Follow Us On Social Media</h2>
                <div className="flex items-center gap-12">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="instagram" className="h-8 w-8 object-contain cursor-pointer hover:scale-110 transition-transform" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg" alt="youtube" className="h-8 object-contain cursor-pointer hover:scale-110 transition-transform" />
                    <svg className="h-8 w-8 cursor-pointer hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z"></path></svg>
                </div>
            </div>

            <div className="relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pr-12">
                    {posts.map((post) => (
                        <div key={post.id} className="relative group overflow-hidden aspect-[4/5] cursor-pointer shadow-lg rounded-sm bg-gray-100">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                            {/* Circular Icon in card */}
                            <div className="absolute top-4 left-4">
                                {post.id === 2 && (
                                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                                        <img src="https://i.pravatar.cc/150?u=theweeknd" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div className="absolute bottom-16 left-6 right-6">
                                <h3 className="text-[17px] text-white font-sans font-extrabold leading-[1.2] drop-shadow-xl tracking-tight">
                                    {post.title.toUpperCase()}
                                </h3>
                            </div>

                            {/* Play/Logo Icon in bottom right */}
                            <div className="absolute bottom-6 left-6 flex items-center gap-2">
                                <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-full border border-white/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-4 h-4"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                                </div>
                                <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded">
                                    {post.label}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Vertical Next Button */}
                <button className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </section>
    )
}

export default SocialMedia
