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
            id: 2,
            page: 'Reviews',
            navigate: '/reviews'
        },
        {
            id: 3,
            page: 'Premium Membership',
            navigate: '/pricing'
        },
        {
            id: 4,
            page: 'FAQ',
            navigate: '/faqs'
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
            <div className="px-3 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                {/* Logo Column */}
                <div onClick={()=>{navigate('/')}} className="flex flex-col cursor-pointer">
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
                {['Terms & Conditions', 'Privacy Policy', 'Shipping Information', 'Returns & Refunds', 'Cookie Policy'].map(item => (
                    <a key={item} href="#" className="text-sm text-gray-500 hover:text-black text-center">{item}</a>
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
                <p className="text-sm text-gray-800 font-medium">© 2023 Otulia. All Rights Reserved.</p>
            </div>

            {/* Extra Bottom Bar matching user image */}
            <div className="w-full bg-black py-3 px-16 flex justify-between items-center text-[10px] text-white/80 font-medium">
                <div className="flex gap-8">
                    <a href="#" className="hover:text-white uppercase tracking-widest">Terms & Support</a>
                    <a href="#" className="hover:text-white uppercase tracking-widest">Privacy Policy</a>
                </div>
            </div>

            {/* Floating Chat Tool */}
            <div className="fixed bottom-8 right-8 z-50">
                <button data-hook="minimized-chat" className="tsjHR d5SBv" id="minimized-chat" style={{ color: 'rgb(255, 255, 255)', backgroundColor: 'rgb(225, 10, 10)', borderRadius: '0px', padding: '13px' }}><svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: '0px', fill: 'rgb(255, 255, 255)', width: '32px', height: '32px', flexShrink: '0' }}><path d="M21.133 16.933a1.4 1.4 0 11.001-2.8 1.4 1.4 0 010 2.8m-4.667 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m-5.6 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m18.904-3.656c-1.013-5.655-5.753-10.22-11.528-11.105-4.343-.667-8.642.627-11.807 3.547-3.168 2.917-4.763 7.043-4.38 11.318.59 6.582 6.08 11.952 12.768 12.487 1.153.095 2.303.05 3.428-.13a14.12 14.12 0 002.428-.612.59.59 0 01.364-.006l3.714 1.167c.785.246 1.588-.331 1.588-1.144l-.002-3.517c0-.17.086-.301.157-.38a14.028 14.028 0 001.58-2.147c1.705-2.862 2.29-6.14 1.69-9.478" fill="currentColor" fillRule="nonzero"></path></svg>
                </button>
            </div>

        </footer>
    )
}

export default Footer
