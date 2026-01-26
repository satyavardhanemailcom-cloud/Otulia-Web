import React, { useState } from 'react';
import { FiX, FiCheck, FiArrowRight, FiZap, FiAward, FiShield, FiStar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const UpgradeModal = ({ isOpen, onClose }) => {
    const { token, refreshUser } = useAuth();
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [successPlan, setSuccessPlan] = useState(null);

    if (!isOpen) return null;

    const plans = [
        {
            name: "Premium Basic",
            price: "£ 5,000",
            period: "per month",
            features: [
                "List up to 25 luxury assets",
                "Verified Seller Badge",
                "Advanced performance metrics",
                "Direct buyer enquiries",
                "Priority email support"
            ],
            icon: FiZap,
            theme: "blue",
            accent: "#3b82f6"
        },
        {
            name: "Business VIP",
            price: "£ 15,000",
            period: "per month",
            features: [
                "Listing capacity: 50 assets",
                "VIP featured placement",
                "Personal Account Manager",
                "Bespoke analytics dashboard",
                "Concierge listing support",
                "24/7 Priority VIP support"
            ],
            icon: FiAward,
            theme: "gold",
            accent: "#d4af37",
            popular: true
        }
    ];

    const handleUpgrade = async (planName) => {
        setLoadingPlan(planName);

        // Simulate a "Payment Redirect" then "Payment Success" flow
        setTimeout(async () => {
            try {
                const response = await fetch('/api/auth/upgrade-plan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ plan: planName })
                });

                if (response.ok) {
                    setSuccessPlan(planName);
                    await refreshUser(); // Refresh global state so Navbar/Profile reflect change

                    // Close after success animation
                    setTimeout(() => {
                        onClose();
                        setSuccessPlan(null);
                    }, 2500);
                } else {
                    const data = await response.json();
                    alert(data.error || "Upgrade failed.");
                }
            } catch (error) {
                console.error("Upgrade error:", error);
                alert("Connection error.");
            } finally {
                setLoadingPlan(null);
            }
        }, 1500); // Dummy delay for "Payment Processing" experience
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-8 animate-in fade-in duration-500">

            {/* Main Container */}
            <div className="bg-white rounded-[2.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative flex flex-col md:flex-row">

                {/* SUCCESS OVERLAY */}
                {successPlan && (
                    <div className="absolute inset-0 z-[210] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center text-white animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
                            <FiCheck className="text-5xl" />
                        </div>
                        <h2 className="text-4xl font-bold playfair-display mb-2">Welcome to {successPlan}!</h2>
                        <p className="text-gray-400">Your profile has been elevated. Unlocking your new limits...</p>
                    </div>
                )}

                {/* LEFT PANEL: The Brand Vibe */}
                <div className="md:w-[35%] bg-[#080808] p-10 text-white flex flex-col justify-between relative overflow-hidden">
                    {/* Artistic backgrounds */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#D90416]/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -ml-32 -mb-32"></div>

                    <div className="relative z-10">
                        <img src="/logos/logo_inverted.png" alt="Otulia" className="w-32 mb-12 opacity-80" />
                        <h2 className="text-4xl md:text-5xl font-bold playfair-display mb-6 leading-tight">
                            The Inner <span className="italic text-gray-400">Circle</span>
                        </h2>
                        <p className="text-gray-400 text-sm font-light leading-relaxed mb-8">
                            Luxury is not just what you own, but where you belong. Secure your place among our elite sellers and unlock the true potential of your collection.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#D90416] font-bold">
                                <FiShield className="text-lg" /> 100% Secure Transaction
                            </div>
                            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                                <FiStar className="text-lg" /> Global Elite Audience
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 mt-12 pb-4 border-t border-white/10 pt-8">
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-loose">
                            Otulia Private Membership <br /> © 2026 Collection
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL: Plans */}
                <div className="md:w-[65%] bg-white p-8 md:p-14 overflow-y-auto">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D90416] mb-2 block">Available Tiers</span>
                            <h3 className="text-3xl font-bold text-gray-900 playfair-display">Refine your membership</h3>
                        </div>
                        <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-black hover:text-white rounded-full transition-all">
                            <FiX className="text-xl" />
                        </button>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {plans.map((plan, idx) => (
                            <div
                                key={idx}
                                className={`group relative p-8 rounded-[2rem] border-2 transition-all duration-500 flex flex-col h-full ${plan.popular
                                    ? 'border-black bg-gray-50 shadow-2xl scale-[1.02]'
                                    : 'border-gray-100 bg-white hover:border-gray-300'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-full whitespace-nowrap shadow-xl">
                                        Most Coveted
                                    </div>
                                )}

                                <div className="flex justify-between items-center mb-8">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5 ${plan.theme === 'blue' ? 'bg-blue-600' : 'bg-black'
                                        }`}>
                                        <plan.icon className="text-xl" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-black">{plan.price}</p>
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">{plan.period}</p>
                                    </div>
                                </div>

                                <h4 className="text-xl font-bold text-gray-900 mb-6">{plan.name}</h4>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feat, fidx) => (
                                        <li key={fidx} className="flex items-start gap-3">
                                            <FiCheck className="text-gray-300 group-hover:text-black transition-colors shrink-0 mt-0.5" />
                                            <span className="text-[11px] text-gray-600 font-medium leading-relaxed">{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    disabled={loadingPlan === plan.name}
                                    onClick={() => handleUpgrade(plan.name)}
                                    className={`w-full py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${plan.popular
                                        ? 'bg-black text-white hover:bg-black/90 shadow-lg shadow-black/20'
                                        : 'bg-gray-100 text-black hover:bg-black hover:text-white'
                                        }`}
                                >
                                    {loadingPlan === plan.name ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            Processing Membership...
                                        </div>
                                    ) : (
                                        <>Select This Plan <FiArrowRight /></>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="mt-12 text-center text-gray-400 text-[10px] font-medium uppercase tracking-[0.1em]">
                        Upgrade instantly • No credit card required (Simulation Mode)
                    </p>
                </div>

            </div>
        </div>
    );
};

export default UpgradeModal;
