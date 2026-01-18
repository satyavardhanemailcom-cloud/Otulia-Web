import React from 'react'

const DestinationSection = () => {
    const content = [
        {
            id: 1,
            text: "Trusted Dealers & Sellers Only"
        },
        {
            id: 2,
            text: "Priority Service in Store or Online"
        },
        {
            id: 3,
            text: "Expert professionals only"
        },
        {
            id: 4,
            text: "Earn points with every purchase. Redeem for exclusive rewards"
        }
    ]

    return (
        <section className="w-full min-h-[90vh] relative flex items-center bg-[url('/images/yacht_bg_final.png')] bg-cover bg-center">
            {/* Soft overlay to ensure text readability on the left */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/50 to-transparent"></div>

            {/* Content Container */}
            <div className='relative z-10 w-full px-16 pl-24'>

                {/* Headlines */}
                <div className='mb-16'>
                    <h2 className='text-6xl font-sans font-medium text-black leading-tight mb-6 tracking-tight'>
                        Your Ultimate Destination for <br />
                        Luxury Items
                    </h2>
                    <p className='text-xl font-normal text-black/90 max-w-xl leading-relaxed'>
                        Find the most exquisite collection of luxury items at Otulia. We strive to provide an unparalleled shopping experience for discerning enthusiasts.
                    </p>
                </div>

                {/* Grid Box */}
                <div className='grid grid-cols-1 md:grid-cols-2 max-w-4xl border-t border-l border-black/80'>
                    {content.map((item) => (
                        <div key={item.id} className='p-8 h-40 border-r border-b border-black/80 backdrop-blur-sm bg-white/20 flex items-center justify-center text-center hover:bg-white/30 transition-colors'>
                            <p className='text-xl text-black font-medium leading-snug'>
                                {item.text}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default DestinationSection
