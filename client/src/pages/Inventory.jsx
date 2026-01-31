import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
    FiGrid, FiPackage, FiUsers, FiPieChart,
    FiGlobe, FiCreditCard, FiSettings, FiBell,
    FiArrowUpRight, FiTrendingUp, FiDownload, FiHome, FiAnchor,
    FiMail, FiPhone, FiShield, FiLock, FiKey,
    FiBriefcase, FiCheckCircle, FiUpload, FiCalendar, FiMapPin,
    FiSearch, FiFilter, FiPlus, FiChevronDown, FiHeart, FiEdit2, FiTrash2, FiEye,
    FiUser, FiLogOut, FiClock, FiLoader
} from 'react-icons/fi';
import Navbar from '../components/Navbar';
import AddAssetModal from '../components/inventory/AddAssetModal';
import DealerVerificationModal from '../components/inventory/DealerVerificationModal';
import numberWithCommas from '../modules/numberwithcomma';

const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "GBP",
    intent: "capture"
};

const Inventory = () => {
    const { token, user, refreshUser, updateUserLocal, logout, login } = useAuth();
    const navigate = useNavigate();

    // UI State
    const [activeTab, setActiveTab] = useState('inventory');
    const [timeframe, setTimeframe] = useState('Week');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [leadStatusFilter, setLeadStatusFilter] = useState('All Status');
    const [leadCategoryFilter, setLeadCategoryFilter] = useState('All Categories');
    const [inventoryStatusFilter, setInventoryStatusFilter] = useState('All Status');
    const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All Categories');
    const [isVerifiedDealer, setIsVerifiedDealer] = useState(user?.isVerified || false);
    const [upgradePlan, setUpgradePlan] = useState(null); // 'Premium Basic' or 'Business VIP'

    useEffect(() => {
        if (user) {
            setIsVerifiedDealer(user.isVerified);
            // If verification is pending, we can optionally show a banner or status
        }
    }, [user]);
    const [companyInfo, setCompanyInfo] = useState({
        name: 'Prestige Motors & Yachts',
        email: 'contact@prestigemotors.com',
        phone: '+1 555 0100',
        address: '123 Luxury Avenue, Beverly Hills, CA 90210',
        website: 'www.prestigemotors.com',
        logo: null
    });

    useEffect(() => {
        fetchDashboard();
    }, [token, user]);

    const fetchDashboard = async () => {
        try {
            const response = await fetch('/api/inventory/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const resData = await response.json();
                setData(resData);
                if (resData.userProfile) {
                    // Sync latest verification status to global user context
                    if (updateUserLocal) {
                        updateUserLocal({
                            verificationStatus: resData.userProfile.verificationStatus,
                            isVerified: resData.userProfile.isVerified,
                            plan: resData.userProfile.plan
                        });
                    }

                    setCompanyInfo({
                        name: resData.userProfile.name || companyInfo.name,
                        email: resData.userProfile.email || companyInfo.email,
                        phone: resData.userProfile.phone || companyInfo.phone,
                        address: companyInfo.address, // Address not in user profile yet
                        website: companyInfo.website,
                        logo: resData.userProfile.profilePicture
                    });
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePublic = async (item) => {
        setUpdatingId(item.id);
        const isCurrentPublic = item.status === 'Active';
        try {
            const response = await fetch('/api/inventory/toggle-visibility', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId: item.id,
                    model: item.category,
                    isPublic: !isCurrentPublic
                })
            });
            if (response.ok) {
                await fetchDashboard();
            }
        } catch (error) {
            console.error("Toggle Error:", error);
        } finally {
            setUpdatingId(null);
        }
    };

    const handleVerificationSubmit = async (documents) => {
        try {
            const formData = new FormData();
            Object.keys(documents).forEach(key => {
                if (documents[key]) formData.append(key, documents[key]); // field name -> file
            });

            const response = await fetch('/api/auth/submit-verification', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const updatedUser = await response.json();
                alert('Verification documents submitted successfully! Status updated to Pending.');

                // Update local context
                if (login) login(token, updatedUser);

                setIsVerificationModalOpen(false);
                setActiveTab('settings'); // Redirect to settings to see status
            } else {
                alert('Failed to submit verification documents. Please try again.');
            }
        } catch (error) {
            console.error("Verification Submit Error:", error);
            alert(`An error occurred: ${error.message}`);
        }
    };

    const handlePlanChange = (newPlan) => {
        setUpgradePlan(newPlan);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!data) return null;

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: FiGrid },
        { id: 'inventory', label: 'My Assets', icon: FiPackage },
        { id: 'leads', label: 'Leads', icon: FiUsers },
        { id: 'analytics', label: 'Analytics & Insights', icon: FiPieChart },
        { id: 'marketplace', label: 'Public Marketplace', icon: FiGlobe },
        { id: 'subscription', label: 'Subscription', icon: FiCreditCard },
        { id: 'settings', label: 'Settings', icon: FiSettings },
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex montserrat">

            {/* SIDEBAR */}
            <div className={`w-72 border-r flex flex-col fixed inset-y-0 z-50 transition-colors duration-300 bg-white border-gray-100`}>
                <div className="p-8 pb-12">
                    <img src="/logos/otulia_logo_black.png" alt="Otulia" className="h-8 cursor-pointer" onClick={() => navigate('/')} />
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                                ? 'bg-[#F2E8DB] text-gray-900 border-l-4 border-black'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className={`text-lg ${activeTab === item.id ? 'text-black' : 'text-gray-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-8 border-t border-gray-50">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-loose">
                        © 2026 Otulia <br /> Luxury Asset Platform
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            {/* MAIN CONTENT AREA */}
            <div className={`flex-1 ml-72 transition-colors duration-300 bg-[#F9FAFB]`}>

                {/* TOP HEADER BAR */}
                <header className={`h-20 border-b flex items-center justify-between px-8 sticky top-0 z-[40] transition-colors duration-300 bg-white border-gray-100`}>
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            {activeTab === 'settings' ? 'Profile & Company Settings' : navItems.find(n => n.id === activeTab)?.label}
                            {activeTab === 'inventory' && (
                                <span className="text-sm font-medium text-gray-400">
                                    ({data?.inventory?.length || 0}/{user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5} used)
                                </span>
                            )}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Last 30 Days Dropdown */}
                        <div className="relative">
                            <select className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#D48D2A] cursor-pointer">
                                <option>Last 30 days</option>
                                <option>Last 7 days</option>
                                <option>Last 90 days</option>
                                <option>This year</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                        </div>

                        {/* Day/Week/Month Tabs */}
                        <div className="flex items-center rounded-lg bg-gray-50 p-1">
                            {['Day', 'Week', 'Month'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-5 py-2 text-sm font-semibold transition-all rounded-md ${timeframe === t
                                        ? 'bg-[#D48D2A] text-white shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* Icons Section */}
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                            <div className="relative w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                                <FiBell className="text-gray-400 text-lg" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </div>
                        </div>

                        {/* User Profile Section */}
                        <div className="relative border-l border-gray-200 pl-4">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                onBlur={() => setTimeout(() => setIsProfileDropdownOpen(false), 200)}
                                className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
                            >
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">{user?.name || 'Prestige Motors'}</p>
                                    <p className="text-xs text-gray-400 font-medium">{user?.plan || 'Professional'} Plan</p>
                                </div>
                                <img src={user?.profilePicture || '/assets/user.png'} className="w-10 h-10 rounded-full border border-gray-200" alt="Profile" />
                                <FiChevronDown className={`text-gray-400 text-sm transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                                    <div className="px-4 py-3 border-b border-gray-50">
                                        <p className="text-sm font-bold text-gray-900">{user?.name || 'Prestige Motors'}</p>
                                        <p className="text-xs text-gray-500 truncate">{user?.email || 'contact@prestigemotors.com'}</p>
                                    </div>
                                    <div className="py-1">
                                        <button
                                            onClick={() => navigate('/profile')}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                        >
                                            <FiUser className="text-lg" /> My Profile
                                        </button>
                                        {user?.role === 'admin' && (
                                            <button
                                                onClick={() => navigate('/admin')}
                                                className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                            >
                                                <FiShield className="text-lg" /> Admin Dashboard
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setActiveTab('subscription')}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                        >
                                            <FiCreditCard className="text-lg" /> Subscription
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('settings')}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                        >
                                            <FiSettings className="text-lg" /> Settings
                                        </button>
                                    </div>
                                    <div className="border-t border-gray-50 py-1">
                                        <button
                                            onClick={() => {
                                                logout();
                                                navigate('/login');
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                                        >
                                            <FiLogOut className="text-lg" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* TAB CONTENT */}
                <main className="p-10 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">

                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {/* Dashboard KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                <AnalyticsCard title="Total Views" value={data.stats.totalViews} growth="+12.5%" icon={<FiEye />} />
                                <AnalyticsCard title="Total Leads" value={data.stats.totalLeads} growth="+8.2%" icon={<FiUsers />} />
                                <AnalyticsCard title="Saved / Shortlisted" value="89" growth="+5.1%" icon={<FiHeart />} />
                                <AnalyticsCard title="Est. Lead Value" value={`£${numberWithCommas(4250000)}`} growth="+15.3%" icon={<FiTrendingUp />} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                {/* Views vs Leads Line Chart */}
                                <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <h4 className="text-lg font-bold text-gray-900 mb-8 font-playfair">Views vs Leads Over Time</h4>
                                    <div className="h-64 flex items-end gap-4 border-b border-gray-100 pb-2 overflow-hidden px-4 relative">
                                        {/* Simplified Line Chart Mockup */}
                                        <svg className="absolute inset-0 w-full h-full px-10 pb-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <path d="M0,80 L20,70 L40,75 L60,60 L80,65 L100,50" fill="none" stroke="#D48D2A" strokeWidth="2" />
                                            <path d="M0,90 L20,85 L40,88 L60,75 L80,80 L100,65" fill="none" stroke="#3B82F6" strokeWidth="2" />
                                        </svg>
                                        {['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12'].map((date, idx) => (
                                            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-[-24px]">{date}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-center gap-6 mt-12">
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#D48D2A]"></div> Views
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Leads
                                        </div>
                                    </div>
                                </div>

                                {/* Leads by Category Bar Chart */}
                                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <h4 className="text-lg font-bold text-gray-900 mb-8 font-playfair">Leads by Asset Category</h4>
                                    <div className="space-y-6">
                                        {[
                                            { label: 'Cars', count: 142, color: 'bg-[#D48D2A]' },
                                            { label: 'Yachts', count: 86, color: 'bg-blue-500' },
                                            { label: 'Real Estate', count: 98, color: 'bg-emerald-500' },
                                            { label: 'Bikes', count: 54, color: 'bg-indigo-500' }
                                        ].map((cat) => (
                                            <div key={cat.label}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{cat.label}</span>
                                                </div>
                                                <div className="w-full h-8 bg-gray-50 rounded-lg overflow-hidden flex">
                                                    <div className={`${cat.color} h-full transition-all duration-1000`} style={{ width: `${(cat.count / 160) * 100}%` }}></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-6 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                        <span>0</span>
                                        <span>40</span>
                                        <span>80</span>
                                        <span>120</span>
                                        <span>160</span>
                                    </div>
                                </div>
                            </div>

                            {/* Attention & Performance Cards */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white p-8 rounded-[2.5rem] border-l-4 border-emerald-500 shadow-sm border-y border-r border-gray-100">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-6 uppercase text-[10px] font-bold tracking-widest">
                                        <FiTrendingUp /> Top Performing
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h5 className="text-xl font-bold text-gray-900 mb-2 font-playfair">{data.inventory[1]?.title || '2024 Lamborghini Revuelto'}</h5>
                                            <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                                                <span className="flex items-center gap-1.5"><FiEye /> 12,450 views</span>
                                                <span className="flex items-center gap-1.5"><FiUsers /> 34 leads</span>
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase">Cars</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white p-8 rounded-[2.5rem] border-l-4 border-orange-500 shadow-sm border-y border-r border-gray-100">
                                    <div className="flex items-center gap-2 text-orange-600 mb-6 uppercase text-[10px] font-bold tracking-widest">
                                        <FiTrendingUp className="rotate-90" /> Needs Attention
                                    </div>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h5 className="text-xl font-bold text-gray-900 mb-2 font-playfair">{data.inventory[7]?.title || 'Vintage 1965 Aston Martin DB5'}</h5>
                                            <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                                                <span className="flex items-center gap-1.5"><FiEye /> 890 views</span>
                                                <span className="flex items-center gap-1.5"><FiUsers /> 2 leads</span>
                                            </div>
                                            <span className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[10px] font-bold uppercase">Cars</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Leads Integration in Dashboard */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-8 py-6 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="text-lg font-bold text-gray-900 font-playfair">Recent Leads</h3>
                                    <button onClick={() => setActiveTab('leads')} className="text-xs font-bold text-[#D48D2A] uppercase tracking-widest hover:underline">View All Leads</button>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50">
                                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buyer</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                            <th className="px-4 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                            <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.leads.slice(0, 5).map((lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50/30 transition-all">
                                                <td className="px-8 py-4">
                                                    <p className="text-sm font-bold text-gray-900">{lead.buyerName}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <p className="text-sm font-medium text-gray-500 truncate max-w-[250px]">{lead.assetName}</p>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{lead.category?.replace('Asset', '')}</span>
                                                </td>
                                                <td className="px-4 py-4 text-xs font-medium text-gray-400">
                                                    {new Date(lead.date).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-4 text-right">
                                                    <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${lead.status === 'New' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* INVENTORY TAB */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {/* Filter Bar */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <select
                                            value={inventoryCategoryFilter}
                                            onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                                            className="appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#D48D2A] cursor-pointer min-w-[160px]"
                                        >
                                            <option>All Categories</option>
                                            <option>Cars</option>
                                            <option>Yachts</option>
                                            <option>Real Estate</option>
                                            <option>Bikes</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={inventoryStatusFilter}
                                            onChange={(e) => setInventoryStatusFilter(e.target.value)}
                                            className="appearance-none bg-white border border-gray-200 rounded-lg py-2.5 pl-4 pr-10 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#D48D2A] cursor-pointer min-w-[140px]"
                                        >
                                            <option>All Status</option>
                                            <option>Active</option>
                                            <option>Draft</option>
                                            <option>Sold</option>
                                            <option>In Transit</option>
                                            <option>In Showroom</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const limit = user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5;
                                        if (isVerifiedDealer) {
                                            if ((data?.inventory?.length || 0) >= limit) {
                                                alert(`You have reached your limit of ${limit} listings. Please upgrade your plan.`);
                                                return;
                                            }
                                            setIsAddModalOpen(true);
                                        } else {
                                            if (user?.verificationStatus === 'Pending') {
                                                alert("Your dealer verification is currently pending approval. You will be notified once approved.");
                                            } else if (user?.verificationStatus === 'Rejected') {
                                                alert("Your previous verification documents were rejected. Please re-submit valid documents.");
                                                setIsVerificationModalOpen(true);
                                            } else {
                                                alert("Please complete dealer verification to start listing assets.");
                                                setIsVerificationModalOpen(true);
                                            }
                                        }
                                    }}
                                    className={`px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold text-sm shadow-md transition-all ${isVerifiedDealer
                                        ? 'bg-[#D48D2A] text-white hover:bg-[#B5751C]'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                                        }`}
                                >
                                    <FiPlus className="text-base" /> Add New Asset
                                    {!isVerifiedDealer && <FiLock className="text-xs ml-1" />}
                                </button>
                            </div>

                            {/* Inventory Table */}
                            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset</th>
                                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Performance</th>
                                            <th className="px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Public</th>
                                            <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data.inventory.filter(item => {
                                            const matchesCategory = inventoryCategoryFilter === 'All Categories' ||
                                                (item.category === 'CarAsset' && inventoryCategoryFilter === 'Cars') ||
                                                (item.category === 'YachtAsset' && inventoryCategoryFilter === 'Yachts') ||
                                                (item.category === 'EstateAsset' && inventoryCategoryFilter === 'Real Estate') ||
                                                (item.category === 'BikeAsset' && inventoryCategoryFilter === 'Bikes');

                                            const matchesStatus = inventoryStatusFilter === 'All Status' ||
                                                (inventoryStatusFilter === 'Active' && item.status === 'Active') ||
                                                item.status === inventoryStatusFilter;

                                            return matchesCategory && matchesStatus;
                                        }).map((item) => {
                                            const categoryIcon = item.category === 'CarAsset' ? <FiPackage /> :
                                                item.category === 'YachtAsset' ? <FiAnchor /> :
                                                    <FiHome />;
                                            const categoryName = item.category === 'CarAsset' ? 'Cars' :
                                                item.category === 'YachtAsset' ? 'Yachts' :
                                                    item.category === 'EstateAsset' ? 'Real Estate' :
                                                        item.category?.replace('Asset', 's');

                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                                                <img src={item.images?.[0]} className="w-full h-full object-cover" alt={item.title} />
                                                            </div>
                                                            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2 text-gray-500">
                                                            {categoryIcon}
                                                            <span className="text-sm font-medium">{categoryName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${item.type === 'Rent' ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                            {item.type || 'Sale'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className="text-sm font-semibold text-gray-900">£{numberWithCommas(item.price)}</span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                                                            item.status === 'Draft' ? 'bg-gray-100 text-gray-600' :
                                                                item.status === 'In Transit' ? 'bg-blue-50 text-blue-600' :
                                                                    item.status === 'In Showroom' ? 'bg-orange-50 text-orange-600' :
                                                                        'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {item.status === 'Active' ? 'Live' : item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-4 text-gray-400 text-sm">
                                                            <span className="flex items-center gap-1.5">
                                                                <FiEye className="text-base" /> {item.views || 0}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <FiUsers className="text-base" /> {item.leads || 0}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div
                                                            onClick={() => handleTogglePublic(item)}
                                                            className={`w-11 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${item.status === 'Active' ? 'bg-[#D48D2A]' : 'bg-gray-200'
                                                                }`}
                                                        >
                                                            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${item.status === 'Active' ? 'left-6' : 'left-0.5'
                                                                }`}></div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => {
                                                                    setEditingItem(item);
                                                                    setIsAddModalOpen(true);
                                                                }}
                                                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                                                            >
                                                                <FiEdit2 className="text-base" />
                                                            </button>
                                                            <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                                                <FiTrash2 className="text-base" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* LEADS TAB */}
                    {activeTab === 'leads' && (
                        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
                            {/* Lead Filter Bar */}
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3">
                                    <div className="relative">
                                        <select
                                            value={leadStatusFilter}
                                            onChange={(e) => setLeadStatusFilter(e.target.value)}
                                            className="appearance-none bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-gray-600 focus:outline-none focus:border-[#D48D2A] cursor-pointer min-w-[140px] shadow-sm"
                                        >
                                            <option>All Status</option>
                                            <option>New</option>
                                            <option>Contacted</option>
                                            <option>Negotiating</option>
                                            <option>Closed</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={leadCategoryFilter}
                                            onChange={(e) => setLeadCategoryFilter(e.target.value)}
                                            className="appearance-none bg-white border border-gray-200 rounded-xl py-3 pl-4 pr-10 text-sm font-bold text-gray-600 focus:outline-none focus:border-[#D48D2A] cursor-pointer min-w-[160px] shadow-sm"
                                        >
                                            <option>All Categories</option>
                                            <option>Cars</option>
                                            <option>Yachts</option>
                                            <option>Real Estate</option>
                                            <option>Bikes</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Lead Count Badge */}
                                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
                                    <FiUsers className="text-gray-400 text-sm" />
                                    <span className="text-sm font-bold text-gray-600">
                                        {data.leads.filter(lead => {
                                            const matchesStatus = leadStatusFilter === 'All Status' || lead.status === leadStatusFilter;
                                            const cat = lead.category?.replace('Asset', 's') || 'General';
                                            const matchesCategory = leadCategoryFilter === 'All Categories' || cat.toLowerCase().includes(leadCategoryFilter.toLowerCase().replace(' ', ''));
                                            return matchesStatus && matchesCategory;
                                        }).length} Leads
                                    </span>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Buyer</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                            <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {data.leads
                                            .filter(lead => {
                                                const matchesStatus = leadStatusFilter === 'All Status' || lead.status === leadStatusFilter;
                                                const cat = lead.category?.replace('Asset', 's') || 'General';
                                                const matchesCategory = leadCategoryFilter === 'All Categories' || cat.toLowerCase().includes(leadCategoryFilter.toLowerCase().replace(' ', ''));
                                                return matchesStatus && matchesCategory;
                                            })
                                            .map((lead) => (
                                                <tr key={lead.id} className="hover:bg-gray-50/50 transition-all group">
                                                    <td className="px-10 py-6">
                                                        <p className="text-sm font-bold text-gray-900">{lead.buyerName}</p>
                                                        {user.plan === 'Business VIP' && <p className="text-xs text-blue-500 font-medium mt-1">{lead.customerContact}</p>}
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <p className="text-sm font-medium text-gray-600 truncate max-w-[300px]">{lead.assetName}</p>
                                                    </td>
                                                    <td className="px-6 py-6">
                                                        <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-tight">
                                                            {lead.category === 'CarAsset' ? 'Cars' : lead.category === 'YachtAsset' ? 'Yachts' : lead.category === 'EstateAsset' ? 'Real Estate' : lead.category?.replace('Asset', 's') || 'General'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-6 text-sm text-gray-400 font-medium">
                                                        {new Date(lead.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wide inline-flex items-center justify-center min-w-[100px] ${lead.status === 'New' ? 'bg-blue-50 text-blue-600' :
                                                            lead.status === 'Contacted' ? 'bg-orange-50 text-orange-600' :
                                                                lead.status === 'Negotiating' ? 'bg-yellow-50 text-yellow-700' :
                                                                    lead.status === 'Closed' ? 'bg-emerald-50 text-emerald-600' :
                                                                        'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-10 animate-in fade-in duration-700">

                            {/* Analytics KPI Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                <AnalyticsCard title="Total Views" value={numberWithCommas(data.stats.totalViews)} growth="+18.2%" icon={<FiEye />} />
                                <AnalyticsCard title="Total Leads" value={data.stats.totalLeads} growth="+12.5%" icon={<FiUsers />} />
                                <AnalyticsCard title="Conversion Rate" value={`${data.stats.avgConversion}%`} growth="+0.3%" icon={<FiTrendingUp />} />
                                <AnalyticsCard title="Avg Lead Value" value="£12,426" growth="+5.8%" icon={<FiCreditCard />} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Performance Trend Line Chart */}
                                <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <h4 className="text-xl font-bold text-gray-900 mb-10 font-playfair">Performance Trend</h4>
                                    <div className="h-64 relative border-b border-l border-gray-100 mb-8 pt-4">
                                        {/* Grid Lines */}
                                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                            {[16000, 12000, 8000, 4000, 0].map(val => (
                                                <div key={val} className="w-full border-t border-gray-50 flex items-center">
                                                    <span className="text-[10px] text-gray-300 font-bold -ml-10 w-8 text-right">{val}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* SVG Chart */}
                                        {/* SVG Chart */}
                                        <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            {(() => {
                                                const trend = data.analytics?.performanceTrend || [];
                                                const maxVal = Math.max(...trend.map(t => Math.max(t.views, t.leads)), 100);

                                                // Calculate points
                                                const getPoints = (key) => trend.map((t, i) => {
                                                    const x = i * 33.33;
                                                    const y = 100 - ((t[key] / maxVal) * 80); // Leave some headroom
                                                    return `${x},${y}`;
                                                });

                                                const viewsPoints = getPoints('views');
                                                const leadsPoints = getPoints('leads');
                                                const viewsPath = `M${viewsPoints.join(' L')}`;
                                                const leadsPath = `M${leadsPoints.join(' L')}`;

                                                return (
                                                    <>
                                                        {/* Views Line (Orange) */}
                                                        <path d={viewsPath} fill="none" stroke="#D48D2A" strokeWidth="2" strokeLinecap="round" />
                                                        {viewsPoints.map((p, i) => {
                                                            const [cx, cy] = p.split(',');
                                                            return <circle key={`v-${i}`} cx={cx} cy={cy} r="1.5" fill="#D48D2A" />;
                                                        })}

                                                        {/* Leads Line (Blue) */}
                                                        <path d={leadsPath} fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                                                        {leadsPoints.map((p, i) => {
                                                            const [cx, cy] = p.split(',');
                                                            return <circle key={`l-${i}`} cx={cx} cy={cy} r="1.5" fill="#3B82F6" />;
                                                        })}
                                                    </>
                                                );
                                            })()}
                                        </svg>
                                    </div>
                                    <div className="flex justify-between px-2 text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-10">
                                        <span>Week 1</span>
                                        <span>Week 2</span>
                                        <span>Week 3</span>
                                        <span>Week 4</span>
                                    </div>
                                    <div className="flex justify-center gap-10">
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-[#D48D2A] bg-white"></div>
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">views</span>
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-500 bg-white"></div>
                                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">leads</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Leads by Location Horizontal Bars */}
                                <div className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                    <h4 className="text-xl font-bold text-gray-900 mb-10 font-playfair">Leads by Location</h4>
                                    <div className="space-y-8">
                                        {[
                                            { country: 'United States', count: 98 },
                                            { country: 'United Kingdom', count: 68 },
                                            { country: 'UAE', count: 54 },
                                            { country: 'France', count: 42 },
                                            { country: 'Germany', count: 38 }
                                        ].map((loc) => (
                                            <div key={loc.country} className="flex flex-col gap-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-tight">{loc.country}</span>
                                                    <span className="text-xs font-black text-gray-900">{loc.count}</span>
                                                </div>
                                                <div className="w-full h-10 bg-gray-50/50 rounded-lg overflow-hidden flex items-center pr-2">
                                                    <div
                                                        className="h-full bg-[#D48D2A] rounded-lg transition-all duration-1000 ease-out"
                                                        style={{ width: `${loc.count}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-6 px-1 opacity-20 text-[9px] font-black text-gray-400">
                                        <span>0</span>
                                        <span>25</span>
                                        <span>50</span>
                                        <span>75</span>
                                        <span>100</span>
                                    </div>
                                </div>
                            </div>

                            {/* Asset Performance Table */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                                <div className="px-10 py-8 border-b border-gray-50">
                                    <h4 className="text-xl font-bold text-gray-900 font-playfair">Asset Performance</h4>
                                </div>
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-gray-50/30">
                                            <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Asset Name</th>
                                            <th className="px-4 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Views</th>
                                            <th className="px-4 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Leads</th>
                                            <th className="px-10 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trend</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(data.topAssets || []).map((asset, i) => (
                                            <tr key={i} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-10 py-6 text-sm font-bold text-gray-800">{asset.name}</td>
                                                <td className="px-4 py-6 text-sm font-medium text-gray-600">{numberWithCommas(asset.views)}</td>
                                                <td className="px-4 py-6 text-sm font-medium text-gray-600">{asset.leads}</td>
                                                <td className={`px-10 py-6 text-xs font-bold ${asset.color || 'text-gray-400'} flex items-center gap-1.5`}>
                                                    {asset.trend === 'Up' ? '↑ Up' : asset.trend === 'Down' ? '↓ Down' : '— Stable'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* AI Insights Section */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-500 text-xl">💡</span>
                                    <h4 className="text-xl font-bold text-gray-900 font-playfair">AI Insights</h4>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 border-l-4 border-l-[#D48D2A] shadow-sm">
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            High views but low leads on <span className="font-bold text-gray-900">'Vintage 1965 Aston Martin DB5'</span> — consider improving listing images or adjusting price.
                                        </p>
                                    </div>
                                    <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 border-l-4 border-l-emerald-500 shadow-sm">
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            <span className="font-bold text-gray-900">'2024 Lamborghini Revuelto'</span> performs 340% above category average. Consider featuring it prominently.
                                        </p>
                                    </div>
                                    <div className="bg-white p-8 rounded-[1.5rem] border border-gray-100 border-l-4 border-l-blue-500 shadow-sm">
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            Average response time to leads is <span className="font-bold text-gray-900">4.2 hours</span>. Faster responses correlate with higher conversion rates.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* PUBLIC MARKETPLACE TAB */}
                    {activeTab === 'marketplace' && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">

                            {/* Visibility Controls */}
                            <section>
                                <div className="mb-8">
                                    <h3 className="text-xl font-bold text-gray-900 font-playfair mb-2">Visibility Controls</h3>
                                    <p className="text-sm text-gray-400">Manage which assets appear on your public marketplace profile.</p>
                                </div>
                                <div className="space-y-4">
                                    {data.inventory.map((item) => (
                                        <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#D48D2A] transition-all duration-300">
                                            <div className="flex items-center gap-6">
                                                <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                                                    <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-gray-900 mb-1">{item.title}</h4>
                                                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-tight">
                                                        <span className="flex items-center gap-1.5">
                                                            {item.category === 'EstateAsset' ? <FiHome /> : item.category === 'YachtAsset' ? <FiAnchor /> : <FiPackage />}
                                                            {item.category === 'CarAsset' ? 'Cars' : item.category === 'YachtAsset' ? 'Yachts' : item.category === 'EstateAsset' ? 'Real Estate' : item.category?.replace('Asset', 's')}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                        <span>${numberWithCommas(item.price)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                                                    {item.status === 'Active' ? 'Public' : 'Private'}
                                                </span>
                                                <div
                                                    onClick={() => handleTogglePublic(item)}
                                                    className={`w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${item.status === 'Active' ? 'bg-[#D48D2A]' : 'bg-gray-200'}`}
                                                >
                                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${item.status === 'Active' ? 'left-7' : 'left-1'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Public Preview */}
                            <section className="pt-8 border-t border-gray-100">
                                <div className="mb-10">
                                    <h3 className="text-xl font-bold text-gray-900 font-playfair mb-2">Public Preview</h3>
                                    <p className="text-sm text-gray-400">This is how your listings appear to potential buyers on the marketplace.</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                                    {data.inventory.filter(i => i.status === 'Active').map((item) => (
                                        <div key={item.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all duration-500">
                                            {/* Preview Image Area */}
                                            <div className="h-64 bg-gray-50 relative overflow-hidden">
                                                <div className="absolute top-6 left-6 z-10">
                                                    <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-[10px] font-black text-gray-900 uppercase tracking-tighter shadow-sm">
                                                        {item.category === 'CarAsset' ? 'Cars' : item.category === 'YachtAsset' ? 'Yachts' : item.category === 'EstateAsset' ? 'Real Estate' : item.category?.replace('Asset', 's')}
                                                    </span>
                                                </div>
                                                <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                            {/* Preview Content Area */}
                                            <div className="p-8">
                                                <h4 className="text-base font-bold text-gray-900 mb-3 truncate group-hover:text-[#D48D2A] transition-colors font-playfair">{item.title}</h4>
                                                <p className="text-2xl font-black text-[#D48D2A] mb-8 italic">${numberWithCommas(item.price)}</p>
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-2 text-gray-400">
                                                        <FiEye className="text-sm" />
                                                        <span className="text-[11px] font-bold">{numberWithCommas(item.views || 0)}</span>
                                                    </div>
                                                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                                                        Available
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">

                            {/* Company Profile Section */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="w-10 h-10 rounded-xl bg-[#FDF8F0] border border-[#F2E8DB] flex items-center justify-center text-[#D48D2A]">
                                        <FiBriefcase className="text-xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 font-playfair">Company Profile</h3>
                                    {isVerifiedDealer && (
                                        <span className="ml-2 px-3 py-1 bg-[#E0F2FE] text-[#0369A1] text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                                            <FiCheckCircle className="text-[11px]" /> Verified
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                                    {/* Logo Upload */}
                                    <div className="lg:col-span-4 space-y-4">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company Logo</p>
                                        <label className="block w-full h-64 border-2 border-dashed border-gray-100 rounded-[2rem] hover:bg-gray-50 hover:border-[#D48D2A] transition-all cursor-pointer overflow-hidden group bg-gray-50/50">
                                            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                                                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-300 group-hover:text-[#D48D2A] transition-colors">
                                                    <FiUpload className="text-2xl" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-400">Click to upload logo</p>
                                                    <p className="text-[10px] text-gray-300 font-medium mt-1">PNG, JPG up to 5MB</p>
                                                </div>
                                            </div>
                                            <input type="file" className="hidden" />
                                        </label>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="lg:col-span-8 space-y-8">
                                        <SettingsInputField label="Company Name" value={companyInfo.name} readOnly={isVerifiedDealer} />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <SettingsInputField label="Email" value={companyInfo.email} icon={<FiMail />} readOnly={isVerifiedDealer} />
                                            <SettingsInputField label="Phone" value={companyInfo.phone} icon={<FiPhone />} readOnly={isVerifiedDealer} />
                                        </div>
                                        <SettingsInputField label="Address" value={companyInfo.address} icon={<FiMapPin />} readOnly={isVerifiedDealer} />
                                        <SettingsInputField label="Website" value={companyInfo.website} icon={<FiGlobe />} readOnly={false} />
                                    </div>
                                </div>
                            </div>

                            {/* Dealer Verification Section */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                                <h3 className="text-xl font-bold text-gray-900 font-playfair mb-8">Dealer Verification</h3>

                                {isVerifiedDealer ? (
                                    <div className="bg-[#ECFDF5] border border-[#D1FAE5] rounded-[2rem] p-10 flex items-start gap-8">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-[#D1FAE5]">
                                            <FiCheckCircle className="text-3xl" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-emerald-900 mb-2">Verified Dealer</h4>
                                            <p className="text-emerald-700 leading-relaxed mb-6 max-w-2xl">
                                                Your dealership is fully verified. You have access to all premium features, unlimited listings,
                                                and priority support.
                                            </p>
                                            <div className="flex gap-4">
                                                <button className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold text-sm shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-all">
                                                    View Benefits
                                                </button>
                                                <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all">
                                                    Account Settings
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (data?.userProfile?.verificationStatus || user?.verificationStatus) === 'Pending' ? (
                                    <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[2rem] p-10 flex items-start gap-8">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm border border-[#DBEAFE]">
                                            <FiClock className="text-3xl" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-blue-900 mb-2">Verification Pending</h4>
                                            <p className="text-blue-700 leading-relaxed max-w-2xl">
                                                Your documents have been submitted and are currently under review by our team. This process
                                                typically takes 24-48 hours. You will be notified once approved.
                                            </p>
                                            <div className="mt-6">
                                                <span className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm border border-blue-100 inline-flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                                    In Review
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-[2rem] p-10 flex items-start gap-8">
                                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm border border-[#FDE68A]">
                                            <FiShield className="text-3xl" />
                                        </div>
                                        <div className="space-y-4">
                                            <h4 className="text-xl font-bold text-gray-900 font-playfair">
                                                {user?.verificationStatus === 'Rejected' ? 'Verification Rejected' : 'Verification Not Completed'}
                                            </h4>
                                            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
                                                {user?.verificationStatus === 'Rejected'
                                                    ? "Your previous verification attempt was not approved. Please review your documents and try again."
                                                    : "Complete your dealer verification to unlock enhanced visibility, trust badges, and access to premium features on the Otulia marketplace."
                                                }
                                            </p>
                                            <button
                                                onClick={() => setIsVerificationModalOpen(true)}
                                                className="mt-4 bg-[#D48D2A] text-white px-6 py-3 rounded-xl text-xs font-bold shadow-lg shadow-[#D48D2A]/20 hover:bg-[#B5751C] transition-all flex items-center gap-2"
                                            >
                                                <FiUpload /> {user?.verificationStatus === 'Rejected' ? 'Resubmit Documents' : 'Start Verification Process'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Account Settings Section */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                                <h3 className="text-xl font-bold text-gray-900 font-playfair mb-8">Account Settings</h3>
                                <div className="space-y-4">
                                    <SettingsActionRow
                                        label="Email Notifications"
                                        desc="Receive updates about leads and listings"
                                        btnText="Configure"
                                    />
                                    <SettingsActionRow
                                        label="Security Settings"
                                        desc="Manage password and two-factor authentication"
                                        btnText="Manage"
                                    />
                                    <SettingsActionRow
                                        label="API Access"
                                        desc="Manage API keys for integrations"
                                        btnText="View Keys"
                                    />
                                </div>
                            </div>

                            {/* Footer Action */}
                            <div className="flex justify-end pt-4 pb-10">
                                <button className="bg-[#D48D2A] text-white px-10 py-4 rounded-xl flex items-center gap-2 font-bold text-sm shadow-xl shadow-[#D48D2A]/20 hover:bg-[#B5751C] transition-all">
                                    Save Changes
                                </button>
                            </div>

                        </div>
                    )
                    }

                    {/* SUBSCRIPTION TAB */}
                    {
                        activeTab === 'subscription' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">

                                {/* Current Plan Section */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-[#FDF8F0] border border-[#F2E8DB] flex items-center justify-center">
                                                <FiCreditCard className="text-2xl text-[#D48D2A]" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900 font-playfair">Current Plan</h2>
                                                <p className="text-sm text-gray-400 mt-1">Manage your subscription and billing</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Renewal Date</p>
                                            <p className="text-sm font-black text-gray-900">
                                                {companyInfo.planExpiresAt
                                                    ? new Date(companyInfo.planExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                    : new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-[#D48D2A] to-[#B5751C] rounded-[2rem] p-8 text-white mb-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-3xl font-bold font-playfair">{user?.plan || 'Business VIP'}</h3>
                                            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs font-black uppercase tracking-wider">
                                                Active
                                            </span>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="text-sm font-bold opacity-90">Listing Usage</p>
                                                    <p className="text-sm font-black">
                                                        {data?.inventory?.length || 0} of {user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5} listings
                                                    </p>
                                                </div>
                                                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                                    <div
                                                        className="h-full bg-white rounded-full transition-all duration-500"
                                                        style={{ width: `${Math.min(((data?.inventory?.length || 0) / (user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5)) * 100, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                                                <div>
                                                    <p className="text-xs opacity-75 mb-1">Analytics Level</p>
                                                    <p className="text-sm font-bold">Advanced</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs opacity-75 mb-1">Available Listings</p>
                                                    <p className="text-sm font-bold">{(user?.plan === 'Business VIP' ? 50 : user?.plan === 'Premium Basic' ? 25 : 5) - (data?.inventory?.length || 0)} remaining</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Available Plans Section */}
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-10">
                                    <h3 className="text-2xl font-bold text-gray-900 font-playfair mb-8">Available Plans</h3>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Premium Basic Plan */}
                                        <div className={`rounded-[2rem] border-2 p-8 transition-all ${user?.plan === 'Premium Basic'
                                            ? 'border-[#D48D2A] bg-[#FDF8F0] relative'
                                            : 'border-gray-200 bg-white hover:border-[#D48D2A] hover:shadow-lg'
                                            }`}>
                                            {user?.plan === 'Premium Basic' && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                    <span className="px-4 py-1 bg-[#D48D2A] text-white text-xs font-black uppercase tracking-widest rounded-full">
                                                        Current Plan
                                                    </span>
                                                </div>
                                            )}

                                            <div className="text-center mb-8">
                                                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                                                    <FiPackage className="text-3xl text-gray-400" />
                                                </div>
                                                <h4 className="text-2xl font-bold text-gray-900 font-playfair mb-2">Premium Basic</h4>
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-5xl font-black text-gray-900">£99</span>
                                                    <span className="text-gray-400 font-medium">/month</span>
                                                </div>

                                            </div>

                                            <ul className="space-y-3 mb-8">
                                                {[
                                                    '25 Active Listings',
                                                    'Advanced Analytics',
                                                    'Priority Email Support',
                                                    'Enhanced Visibility',
                                                    'Lead Management'
                                                ].map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 text-sm">
                                                        <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                                                        <span className="text-gray-600 font-medium">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {user?.plan === 'Premium Basic' ? (
                                                <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">
                                                    Current Plan
                                                </button>
                                            ) : user?.plan === 'Business VIP' ? (
                                                <button disabled className="w-full py-4 bg-gray-50 text-gray-300 rounded-xl font-bold text-sm cursor-not-allowed hidden">
                                                    Downgrade Unavailable
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handlePlanChange('Premium Basic')}
                                                    className="w-full py-4 bg-[#D48D2A] text-white rounded-xl font-bold text-sm hover:bg-[#B5751C] transition-all shadow-lg shadow-[#D48D2A]/20"
                                                >
                                                    Upgrade to Premium Basic
                                                </button>
                                            )}
                                        </div>

                                        {/* Business VIP Plan */}
                                        <div className={`rounded-[2rem] border-2 p-8 transition-all ${user?.plan === 'Business VIP'
                                            ? 'border-[#D48D2A] bg-[#FDF8F0] relative'
                                            : 'border-gray-200 bg-white hover:border-[#D48D2A] hover:shadow-lg'
                                            }`}>
                                            {user?.plan === 'Business VIP' && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                                    <span className="px-4 py-1 bg-[#D48D2A] text-white text-xs font-black uppercase tracking-widest rounded-full">
                                                        Current Plan
                                                    </span>
                                                </div>
                                            )}

                                            <div className="text-center mb-8">
                                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D48D2A] to-[#B5751C] flex items-center justify-center mx-auto mb-4">
                                                    <FiBriefcase className="text-3xl text-white" />
                                                </div>
                                                <h4 className="text-2xl font-bold text-gray-900 font-playfair mb-2">Business VIP</h4>
                                                <div className="flex items-baseline justify-center gap-1">
                                                    <span className="text-5xl font-black text-gray-900">£299</span>
                                                    <span className="text-gray-400 font-medium">/month</span>
                                                </div>
                                            </div>

                                            <ul className="space-y-3 mb-8">
                                                {[
                                                    '50 Active Listings',
                                                    'Full Analytics Suite',
                                                    'Priority Phone & Email Support',
                                                    'Premium Visibility',
                                                    'Lead Scoring',
                                                    'Dedicated Account Manager',
                                                    'API Access'
                                                ].map((feature, idx) => (
                                                    <li key={idx} className="flex items-center gap-3 text-sm">
                                                        <FiCheckCircle className="text-emerald-500 flex-shrink-0" />
                                                        <span className="text-gray-600 font-medium">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {user?.plan === 'Business VIP' ? (
                                                <button disabled className="w-full py-4 bg-gray-100 text-gray-400 rounded-xl font-bold text-sm cursor-not-allowed">
                                                    Current Plan
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handlePlanChange('Business VIP')}
                                                    className="w-full py-4 bg-[#D48D2A] text-white rounded-xl font-bold text-sm hover:bg-[#B5751C] transition-all shadow-lg shadow-[#D48D2A]/20"
                                                >
                                                    Upgrade to Business VIP
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Solution Section */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2.5rem] border border-gray-200 p-12 text-center">
                                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <FiSettings className="text-4xl text-gray-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 font-playfair mb-3">Need a Custom Solution?</h3>
                                    <p className="text-gray-500 text-sm max-w-2xl mx-auto mb-8 leading-relaxed">
                                        For large dealerships, auction houses, or enterprises with specific requirements, we offer tailored solutions with dedicated support and custom integrations.
                                    </p>
                                    <button className="px-8 py-4 bg-[#D48D2A] text-white rounded-xl font-bold text-sm hover:bg-[#B5751C] transition-all shadow-lg shadow-[#D48D2A]/20">
                                        Contact Sales
                                    </button>
                                </div>

                            </div>
                        )
                    }

                </main >
            </div >

            <AddAssetModal
                isOpen={isAddModalOpen}
                editData={editingItem}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                }}
                onCreated={() => {
                    fetchDashboard();
                    setIsAddModalOpen(false);
                    setEditingItem(null);
                }}
            />

            <DealerVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onSubmit={handleVerificationSubmit}
            />

            {/* PAYPAL UPGRADE MODAL */}
            {upgradePlan && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-300">
                        <button
                            onClick={() => setUpgradePlan(null)}
                            className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                        >
                            <FiPlus className="rotate-45 text-gray-500" />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-[#FDF8F0] border border-[#F2E8DB] flex items-center justify-center mx-auto mb-4 text-[#D48D2A]">
                                <FiCreditCard className="text-3xl" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 font-playfair mb-1">Upgrade to {upgradePlan}</h3>
                            <p className="text-gray-400 text-sm">
                                {upgradePlan === 'Business VIP' ? '£299.00 / month' : '£99.00 / month'}
                            </p>
                        </div>

                        <PayPalScriptProvider options={paypalOptions}>
                            <PayPalButtons
                                style={{ layout: "vertical", shape: "rect", color: "gold", label: "pay" }}
                                createOrder={(data, actions) => {
                                    return fetch("/api/payment/create-order", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ plan: upgradePlan })
                                    })
                                        .then((response) => response.json())
                                        .then((order) => order.id)
                                        .catch(err => {
                                            console.error("Order Create Error:", err);
                                            alert("Failed to initiate payment.");
                                            return null;
                                        });
                                }}
                                onApprove={(data, actions) => {
                                    return fetch("/api/payment/capture-order", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "Authorization": `Bearer ${token}`
                                        },
                                        body: JSON.stringify({ orderID: data.orderID, plan: upgradePlan })
                                    })
                                        .then((response) => response.json())
                                        .then(async (details) => {
                                            if (details.success) {
                                                alert(`Successfully upgraded to ${upgradePlan}!`);
                                                setUpgradePlan(null);
                                                await fetchDashboard();
                                                if (refreshUser) refreshUser();
                                                // Ensure tab stays on subscription or reloads
                                            } else {
                                                alert("Payment failed: " + (details.error || "Unknown error"));
                                            }
                                        });
                                }}
                                onError={(err) => {
                                    console.error("PayPal Error:", err);
                                    alert("An error occurred with PayPal.");
                                }}
                            />
                        </PayPalScriptProvider>

                        <p className="text-[10px] text-gray-400 text-center mt-6">
                            Secure payment processed by PayPal. You can cancel anytime.
                        </p>
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}} />
        </div >
    );
};

const AnalyticsCard = ({ title, value, growth, icon }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm group hover:border-[#D48D2A] transition-all duration-300">
        <div className="flex justify-between items-start mb-6">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 italic font-playfair">{value}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#F2E8DB] text-black flex items-center justify-center text-lg shadow-sm">
                {icon}
            </div>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-green-600">{growth}</span>
            <span className="text-[10px] text-gray-400 font-medium">from last period</span>
        </div>
    </div>
);

const SettingsInputField = ({ label, value, icon, readOnly }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            {label}
            {readOnly && <span className="ml-auto text-[9px] text-emerald-600 font-black uppercase tracking-widest">Verified</span>}
        </label>
        <input
            type="text"
            defaultValue={value}
            readOnly={readOnly}
            className={`w-full border-transparent rounded-[1.25rem] px-6 py-4 text-sm font-bold focus:outline-none transition-all shadow-inner ${readOnly
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                : 'bg-[#E5E7EB]/30 text-gray-900 focus:border-[#D48D2A] focus:bg-white'
                }`}
        />
    </div>
);

const SettingsActionRow = ({ label, desc, btnText }) => (
    <div className="flex items-center justify-between p-8 rounded-[1.5rem] bg-[#E5E7EB]/10 border border-gray-50 group hover:border-gray-200 transition-all">
        <div>
            <h5 className="text-sm font-bold text-gray-900 mb-1">{label}</h5>
            <p className="text-xs text-gray-400 font-medium">{desc}</p>
        </div>
        <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:border-[#D48D2A] hover:text-[#D48D2A] transition-all">
            {btnText}
        </button>
    </div>
);

export default Inventory;
