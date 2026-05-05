import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import AssetCard from '../components/AssetCard';
import { FiMail, FiPhone, FiMapPin, FiGlobe, FiInstagram, FiLinkedin, FiFacebook, FiYoutube } from 'react-icons/fi';
import UserPlaceholder from '../assets/user.png';

const DealerProfile = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('listings');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`/api/auth/public-profile/${email}`);
                if (response.ok) {
                    const result = await response.json();
                    setData(result);
                } else {
                    setError("User not found");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [email]);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div></div>;
    if (error || !data) return <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]"><div className="text-center"><h1 className="text-2xl font-bold mb-4">{error}</h1><button onClick={() => navigate('/')} className="px-6 py-2 bg-black text-white rounded-lg">Back to Home</button></div></div>;

    const { user, listings } = data;
    const isPremium = user.plan === 'Premium Basic' || user.plan === 'Business VIP';
    
    // Logic: Freemium uses Agent details, Premium uses Company details
    const displayName = isPremium ? (user.company?.companyName || user.name) : user.name;
    const displayLogo = isPremium ? (user.company?.companyLogo || user.profilePicture) : user.profilePicture;
    const displayCover = isPremium ? (user.company?.coverPhoto || user.coverPhoto) : user.coverPhoto;
    const displayDesc = isPremium ? (user.company?.description || user.agentDescription) : user.agentDescription;
    const displayAddress = isPremium ? user.company?.address : '';
    const displayWebsite = isPremium ? user.company?.website : '';
    const displayPhone = isPremium ? (user.company?.phone || user.phone) : user.phone;
    const displayEmail = isPremium ? (user.company?.email || user.email) : user.email;
    const displaySocial = isPremium ? (user.company?.social || user.social) : user.social;

    return (
        <div className="min-h-screen bg-[#FAFAFA]">
            <SEO title={`${displayName} | Otulia`} description={`View listings and professional profile of ${displayName} on Otulia.`} />
            <Navbar />

            {/* Header / Hero Section */}
            <div className="pt-20">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Side: Info */}
                        <div className="order-2 lg:order-1">
                            <nav className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-6">
                                <span>Businesses</span>
                                <span>/</span>
                                <span className="text-black">{displayName}</span>
                            </nav>
                            
                            <h1 className="text-5xl md:text-6xl font-normal text-gray-900 canela mb-6 uppercase tracking-tight">
                                {displayName}
                            </h1>

                            <div className="flex flex-col gap-4 mb-8">
                                {displayAddress && (
                                    <div className="flex items-center gap-2 text-gray-500 font-medium montserrat text-sm">
                                        <FiMapPin className="shrink-0" />
                                        <span>{displayAddress}</span>
                                    </div>
                                )}
                                {user.jobTitle && !isPremium && (
                                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">{user.jobTitle}</p>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <button className="px-10 py-4 bg-black text-white font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center gap-2">
                                    <FiMail />
                                    Send Message
                                </button>
                                {displayPhone && (
                                    <button className="px-10 py-4 border border-gray-200 text-black font-bold uppercase tracking-widest text-xs hover:border-black transition-all flex items-center gap-2">
                                        <FiPhone />
                                        Show Phone Number
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Visuals */}
                        <div className="order-1 lg:order-2 relative">
                            <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border border-white bg-white">
                                {displayCover ? (
                                    <img src={displayCover} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                                        <span className="text-white/20 text-8xl font-black canela uppercase tracking-tighter">Otulia</span>
                                    </div>
                                )}
                            </div>
                            
                            {/* Floating Logo */}
                            <div className="absolute -bottom-6 -left-6 md:-left-8 w-24 h-24 md:w-32 md:h-32 bg-white rounded-2xl p-2 shadow-xl border border-gray-50 flex items-center justify-center overflow-hidden">
                                <img src={displayLogo || UserPlaceholder} className="w-full h-full object-contain" alt="Logo" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-y border-gray-100 bg-white sticky top-20 z-30">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex items-center gap-12">
                    {['listings', 'about'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-6 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === tab ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                        >
                            {tab}
                            {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 min-h-[600px]">
                {activeTab === 'listings' ? (
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                            <div>
                                <h2 className="text-2xl font-normal text-gray-900 canela mb-2">{listings.length} Listings for sale</h2>
                                <div className="w-12 h-[1px] bg-[#D48D2A]"></div>
                            </div>
                        </div>

                        {listings.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {listings.map(item => (
                                    <AssetCard key={item._id} item={{...item, agent: { name: user.name, photo: user.profilePicture, companyLogo: user.company?.companyLogo }}} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-32 text-center border-2 border-dashed border-gray-100 rounded-3xl">
                                <p className="text-gray-400 font-medium montserrat">No active listings found for this dealer.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-3xl">
                        <h2 className="text-4xl font-normal text-gray-900 canela mb-8 uppercase tracking-tight">About {displayName}</h2>
                        <div className="prose prose-lg text-gray-600 montserrat mb-12">
                            {displayDesc ? (
                                <p className="leading-relaxed whitespace-pre-wrap">{displayDesc}</p>
                            ) : (
                                <p className="italic text-gray-400">No description available for this business.</p>
                            )}
                        </div>

                        {/* Contact & Social Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-black uppercase tracking-widest mb-4">Contact Information</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FiMail className="text-gray-400" />
                                        <span className="text-sm font-medium">{displayEmail}</span>
                                    </div>
                                    {displayPhone && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <FiPhone className="text-gray-400" />
                                            <span className="text-sm font-medium">{displayPhone}</span>
                                        </div>
                                    )}
                                    {displayWebsite && (
                                        <div className="flex items-center gap-3 text-gray-600">
                                            <FiGlobe className="text-gray-400" />
                                            <a href={displayWebsite.startsWith('http') ? displayWebsite : `https://${displayWebsite}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:text-black transition-colors">{displayWebsite}</a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-sm font-bold text-black uppercase tracking-widest mb-4">Social Media</h4>
                                <div className="flex flex-wrap gap-4">
                                    {displaySocial?.instagram && (
                                        <a href={`https://${displaySocial.instagram.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-pink-500 hover:shadow-lg transition-all"><FiInstagram /></a>
                                    )}
                                    {displaySocial?.linkedin && (
                                        <a href={`https://${displaySocial.linkedin.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-blue-600 hover:shadow-lg transition-all"><FiLinkedin /></a>
                                    )}
                                    {displaySocial?.facebook && (
                                        <a href={`https://${displaySocial.facebook.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-blue-500 hover:shadow-lg transition-all"><FiFacebook /></a>
                                    )}
                                    {displaySocial?.youtube && (
                                        <a href={`https://${displaySocial.youtube.replace('https://', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-red-600 hover:shadow-lg transition-all"><FiYoutube /></a>
                                    )}
                                    {(displaySocial?.x || displaySocial?.twitter) && (
                                        <a href={`https://${(displaySocial.x || displaySocial.twitter).replace('https://', '')}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-black hover:shadow-lg transition-all font-serif font-black text-xs">X</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default DealerProfile;
