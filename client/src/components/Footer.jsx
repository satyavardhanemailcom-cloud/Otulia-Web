import React from 'react'
import { useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate = useNavigate()
    const discover = [
        {
            name: 'Explore Categories',
            navigate: '/category/cars'
        },
        {
            name: 'Explore Categories',
            navigate: '/category/cars'
        },
    ]

    const company = [
        {
            id: 1,
            page: 'About Us',
            navigate: '/about'
        },
        {
            id: 3,
            page: 'Premium Membership',
            navigate: '/pricing'
        }
    ]

    const social = [
        {
            id: 1,
            name: "Facebook",
            navigate: "#"
        },
        {
            id: 2,
            name: "Instagram",
            navigate: "https://www.instagram.com/otulia.in?igsh=enZpemNoNzh0ZmZx"
        },
        {
            id: 3,
            name: "YouTube",
            navigate: "https://youtube.com/@otulia.com13?si=1klspMO6eVg1ZgQT"
        },
        {
            id: 4,
            name: "Twitter",
            navigate: "https://x.com/OtuliaGlobal?s=20"
        },
        {
            id: 5,
            name: "LinkedIn",
            navigate: "https://www.linkedin.com/company/otulia/"
        }
    ]

    return (
        <footer className="w-full bg-[#F8F8F8] pt-20">

            {/* Top Section */}
            <div className="px-3 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                {/* Logo Column */}
                <div onClick={() => { navigate('/') }} className="flex flex-col cursor-pointer">
                    <img className='w-[200px] h-[60px]' alt="logo" src="/logos/logo_inverted.png" title='Otulia' />
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
                        {company.map(item => (
                            <li key={item.id}><a href={`${item.navigate}`} className="text-sm text-gray-500 hover:text-black">{item.page}</a></li>
                        ))}
                    </ul>
                </div>



                {/* Connect With Us */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-sm font-bold text-black uppercase tracking-widest">Connect With Us</h3>
                    <ul className="flex flex-col gap-3">
                        {social.map(item => (
                            <li key={item.id}><a href={item.navigate} target='_blank' className="text-sm text-gray-500 hover:text-black">{item.name}</a></li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="px-3 md:px-16"><div className="w-full h-px bg-gray-300"></div></div>

            {/* Legal Links Section */}
            <div className="px-3 md:px-16 py-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
                {[
                    { name: 'Terms & Conditions', path: '/terms' },
                    { name: 'Privacy Policy', path: '/privacy-policy' },
                    { name: 'Shipping Information', path: '/shipping' },
                    { name: 'Returns & Refunds', path: '/returns' },
                    { name: 'Cookie Policy', path: '/cookie-policy' }
                ].map(item => (
                    <a key={item.name} href={item.path} className="text-sm text-gray-500 hover:text-black text-center">{item.name}</a>
                ))}
            </div>

            {/* Divider */}
            <div className="px-3 md:px-16"><div className="w-full h-px bg-gray-300"></div></div>

            {/* Payment Options Section */}
            <div className="px-3 md:px-16 py-12 flex flex-col items-center gap-6">
                <h4 className="text-sm font-bold text-black uppercase tracking-widest">Payment Options</h4>
                <div className="flex items-center gap-8 justify-center grayscale opacity-70 flex-wrap">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="mastercard" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/1b/UnionPay_logo.svg" alt="unionpay" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a6/Diners_Club_Logo3.svg" alt="diners" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="amex" className="h-6" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Discover_Card_logo.svg/250px-Discover_Card_logo.svg.png" alt="discover" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="visa" className="h-4" />
                </div>
            </div>

            {/* Divider */}
            <div className="px-16"><div className="w-full h-px bg-gray-200"></div></div>

            {/* Copyright Bar */}
            <div className="px-16 py-8 flex flex-col items-center gap-4">
                <p className="text-sm text-gray-800 font-medium">© 2026 Otulia. All Rights Reserved.</p>
            </div>





        </footer>
    )
}

export default Footer
