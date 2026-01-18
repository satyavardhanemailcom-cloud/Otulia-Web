import React from 'react'

const Footer = () => {
    return (
        <footer className="w-full bg-[#F8F8F8] pt-20">

            {/* Top Section */}
            <div className="px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                {/* Logo Column */}
                <div className="flex flex-col">
                    <h2 className="text-3xl font-bodoni font-bold text-black mb-6">OTULIA</h2>
                </div>

                {/* Discover */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-black uppercase tracking-widest">Discover</h3>
                    <ul className="flex flex-col gap-3">
                        {['Explore Categories', 'Luxury Cars & Bikes', 'Yachts & Homes', 'Accessories', 'Exclusive Collections'].map(item => (
                            <li key={item}><a href="#" className="text-sm text-gray-500 hover:text-black">{item}</a></li>
                        ))}
                    </ul>
                </div>

                {/* Our Company */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-black uppercase tracking-widest">Our Company</h3>
                    <ul className="flex flex-col gap-3">
                        {['About Us', 'Reviews', 'Premium Membership', 'FAQ'].map(item => (
                            <li key={item}><a href="#" className="text-sm text-gray-500 hover:text-black">{item}</a></li>
                        ))}
                    </ul>
                </div>

                {/* Contact Us */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-black uppercase tracking-widest">Contact Us</h3>
                    <ul className="flex flex-col gap-3">
                        <li className="text-sm text-gray-500">info@otulia.com</li>
                        <li className="text-sm text-gray-500">500 Luxury Avenue, Metropolis, NY 10001</li>
                        <li className="text-sm text-gray-500">Tel: 123-456-7890</li>
                    </ul>
                </div>

                {/* Connect With Us */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-black uppercase tracking-widest">Connect With Us</h3>
                    <ul className="flex flex-col gap-3">
                        {['Facebook', 'Instagram', 'YouTube', 'Twitter', 'LinkedIn'].map(item => (
                            <li key={item}><a href="#" className="text-sm text-gray-500 hover:text-black">{item}</a></li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="px-16"><div className="w-full h-px bg-gray-300"></div></div>

            {/* Legal Links Section */}
            <div className="px-16 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                {['Terms & Conditions', 'Privacy Policy', 'Shipping Information', 'Returns & Refunds', 'Cookie Policy'].map(item => (
                    <a key={item} href="#" className="text-sm text-gray-500 hover:text-black text-center lg:text-left">{item}</a>
                ))}
            </div>

            {/* Divider */}
            <div className="px-16"><div className="w-full h-px bg-gray-300"></div></div>

            {/* Payment Options Section */}
            <div className="px-16 py-12 flex flex-col items-center gap-6">
                <h4 className="text-sm font-bold text-black uppercase tracking-widest">Payment Options</h4>
                <div className="flex items-center gap-8 grayscale opacity-70">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="mastercard" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg" alt="unionpay" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg" alt="diners" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="amex" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Discover_Card_logo.svg" alt="discover" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" className="h-4" />
                </div>
            </div>

            {/* Divider */}
            <div className="px-16"><div className="w-full h-px bg-gray-200"></div></div>

            {/* Copyright Bar */}
            <div className="px-16 py-8 flex flex-col items-center gap-4">
                <p className="text-sm text-gray-800 font-medium">© 2023 Otulia. All Rights Reserved.</p>
            </div>

            {/* Extra Bottom Bar matching user image */}
            <div className="w-full bg-black py-3 px-16 flex justify-between items-center text-[10px] text-white/80 font-medium">
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white uppercase tracking-widest">Terms & Support</a>
                    <a href="#" className="hover:text-white uppercase tracking-widest">Privacy Policy</a>
                </div>
                <div className="flex gap-2 items-center">
                    <span>Designed with Canva</span>
                </div>
            </div>

            {/* Floating Chat Tool */}
            <div className="fixed bottom-8 right-8 z-50">
                <button className="bg-[#E61E1E] text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                        <path d="M4.913 2.658c2.075-.21 4.19-.308 6.33-.308 2.14 0 4.255.098 6.33.308.536.053 1.01.308 1.35.714.34.406.49.93.432 1.455-.41 3.65-.41 7.3 0 10.95.058.525-.092 1.049-.432 1.455-.34.406-.814.661-1.35.714a43.14 43.14 0 0 1-6.33.308c-2.14 0-4.255-.098-6.33-.308a2.127 2.127 0 0 1-1.35-.714 2.127 2.127 0 0 1-.432-1.455 35.534 35.534 0 0 0 0-10.95c.058-.525.207-1.049.547-1.47.34-.42.813-.676 1.335-.729ZM9 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm4 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" />
                    </svg>
                </button>
            </div>

        </footer>
    )
}

export default Footer
