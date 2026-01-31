import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
    FiGrid, FiUsers, FiPieChart, FiDollarSign, FiSettings,
    FiSearch, FiBell, FiChevronDown, FiCheckCircle, FiXCircle,
    FiMoreVertical, FiShoppingBag, FiShield
} from 'react-icons/fi';
import numberWithCommas from '../modules/numberwithcomma';

const AdminDashboard = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState(null);
    const [partners, setPartners] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [payouts, setPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [savingSettings, setSavingSettings] = useState(false);
    const [selectedPartnerDocs, setSelectedPartnerDocs] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // ... existing ...

    const handleSaveSettings = () => {
        setSavingSettings(true);
        // Simulate API call
        setTimeout(() => {
            setSavingSettings(false);
            alert('Settings saved successfully!');
        }, 1500);
    };

    const viewDocs = (partner) => {
        setSelectedPartnerDocs(partner);
    };

    const closeDocsModal = () => {
        setSelectedPartnerDocs(null);
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        fetchData();
        return () => window.removeEventListener('resize', handleResize);
    }, [token, user]);

    const fetchData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const [statsRes, partnersRes, usersRes, analyticsRes, payoutsRes] = await Promise.all([
                fetch('/api/admin/stats', { headers }),
                fetch('/api/admin/partners', { headers }),
                fetch('/api/admin/users', { headers }),
                fetch('/api/admin/analytics', { headers }),
                fetch('/api/admin/payouts', { headers })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (partnersRes.ok) setPartners(await partnersRes.json());
            if (usersRes.ok) setUsersList(await usersRes.json());
            if (analyticsRes.ok) setAnalyticsData(await analyticsRes.json());
            if (payoutsRes.ok) setPayouts(await payoutsRes.json());
        } catch (error) {
            console.error("Admin Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (userId, action) => {
        if (!confirm(`Are you sure you want to ${action} this partner?`)) return;
        setActionLoading(userId);
        try {
            const response = await fetch('/api/admin/verify-partner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId, action })
            });

            if (response.ok) {
                setPartners(prev => prev.map(p => {
                    if (p.id === userId) {
                        return {
                            ...p,
                            status: action === 'approve' ? 'Active' : 'Rejected',
                            verificationStatus: action === 'approve' ? 'Verified' : 'Rejected'
                        };
                    }
                    return p;
                }));
                alert(`Partner ${action}d successfully`);
            } else {
                alert('Action failed');
            }
        } catch (error) {
            console.error("Action Error:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    const KPICard = ({ title, value, growth, icon: Icon, colorClass, iconColorClass }) => (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-5 transition-transform group-hover:scale-110 ${colorClass}`}></div>
            <div className="flex justify-between items-start mb-6 z-10 relative">
                <div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
                    <h3 className="text-2xl font-black text-gray-900 font-playfair">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorClass}`}>
                    <Icon className="text-xl" />
                </div>
            </div>
            <div className="flex items-center gap-2 z-10 relative">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${growth.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {growth}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">vs last month</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex montserrat">
            {/* SIDEBAR */}
            <aside className={`w-72 border-r flex-col fixed inset-y-0 z-50 bg-white border-gray-100 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} transition-transform duration-300 ease-in-out`}>
                <div className="p-8 pb-12 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                        <img src="/logos/otulia_logo_black.png" alt="Otulia" className="h-8" />
                        <div className="ml-3 px-3 py-1 bg-[#D48D2A] text-white rounded-md flex items-center gap-1.5 shadow-sm shadow-orange-200">
                            <FiShield className="text-sm" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Admin</span>
                        </div>
                    </div>
                    <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-900 lg:hidden">
                        <FiXCircle className="h-6 w-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {[
                        { id: 'overview', label: 'Overview', icon: FiGrid },
                        { id: 'users', label: 'User Management', icon: FiUsers },
                        { id: 'analytics', label: 'Analytics', icon: FiPieChart },
                        { id: 'payouts', label: 'Payout Management', icon: FiDollarSign },
                        { id: 'partners', label: 'Partners', icon: FiShoppingBag },
                        { id: 'settings', label: 'Settings', icon: FiSettings },
                    ].map((item) => (
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

                <div className="p-4 m-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 p-0.5">
                            <img src={user?.profilePicture || "https://i.pravatar.cc/150?img=68"} alt="Admin" className="w-full h-full rounded-full object-cover" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                            <p className="text-xs text-gray-400 truncate">System Administrator</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/inventory')} className="w-full py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:text-[#D48D2A] hover:border-[#D48D2A] transition-all">
                        Switch to Inventory
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className={`flex-1 bg-[#F9FAFB] transition-all duration-300 ease-in-out lg:ml-72`}>
                {/* HEADER */}
                <header className="h-20 px-4 sm:px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-900 lg:hidden">
                            <FiGrid className="h-6 w-6" />
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 font-playfair">
                            {activeTab === 'overview' ? 'Dashboard Overview' :
                                activeTab === 'partners' ? 'Partner Verification' :
                                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="relative hidden sm:block">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                className="w-40 sm:w-64 bg-gray-50 border border-gray-100 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-gray-600 focus:outline-none focus:border-[#D48D2A] focus:bg-white transition-all placeholder:text-gray-400"
                                placeholder="Search system..."
                            />
                        </div>
                        <div className="w-px h-8 bg-gray-100 mx-2 hidden sm:block"></div>
                        <button className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all">
                            <FiBell className="text-gray-500" />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-10">
                    {activeTab === 'overview' && stats && (
                        <div className="animate-in fade-in duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <KPICard
                                    title="Total Revenue"
                                    value={`$${numberWithCommas(stats.revenue)}`}
                                    growth={`+${stats.revenueGrowth}%`}
                                    icon={FiDollarSign}
                                    colorClass="bg-emerald-500"
                                    iconColorClass="bg-emerald-50 text-emerald-600"
                                />
                                <KPICard
                                    title="Total Users"
                                    value={numberWithCommas(stats.totalUsers)}
                                    growth="--"
                                    icon={FiUsers}
                                    colorClass="bg-blue-500"
                                    iconColorClass="bg-blue-50 text-blue-600"
                                />
                                <KPICard
                                    title="Partner Stores"
                                    value={stats.partnerStores}
                                    growth="--"
                                    icon={FiShoppingBag}
                                    colorClass="bg-purple-500"
                                    iconColorClass="bg-purple-50 text-purple-600"
                                />
                                <KPICard
                                    title="Platform Views"
                                    value={`${(stats.views / 1000000).toFixed(1)}M`}
                                    growth={`+${stats.viewsGrowth}%`}
                                    icon={FiPieChart}
                                    colorClass="bg-[#D48D2A]"
                                    iconColorClass="bg-[#FFF4E5] text-[#D48D2A]"
                                />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 font-playfair">Revenue Analytics</h3>
                                    {/* Simple CSS Bar Chart */}
                                    <div className="flex items-end gap-3 h-64 mt-4 px-4 pb-2">
                                        {analyticsData?.monthlyRevenue.map((item, index) => (
                                            <div key={index} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                                <div
                                                    className="w-full bg-blue-50 rounded-t-lg relative group-hover:bg-[#D48D2A] transition-all duration-300"
                                                    style={{ height: `${(item.value / 10000) * 100}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                                                        ${numberWithCommas(item.value)}
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase group-hover:text-[#D48D2A] transition-colors">{item.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                    <h3 className="text-lg font-bold text-gray-900 mb-8 self-start font-playfair">Platform Wallet</h3>
                                    <div className="bg-gray-900 p-6 rounded-[2rem] mb-6 shadow-xl shadow-gray-200">
                                        <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center p-2">
                                            {/* QR Placeholder */}
                                            <div className="w-full h-full border-4 border-black border-dashed opacity-20 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OtuliaPlatform')] bg-cover"></div>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Scan to receive payments</p>
                                    <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl">
                                        Download QR Code
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'partners' && (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                            <div className="p-4 sm:p-8 border-b border-gray-100 flex-col sm:flex-row flex justify-between items-start sm:items-end">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 font-playfair">Partners Management</h3>
                                    <p className="text-sm text-gray-400 font-medium">Manage and verify dealer accounts</p>
                                </div>
                                <div className="flex gap-2 mt-4 sm:mt-0">
                                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-100">Export</button>
                                    <button className="px-4 py-2 bg-[#D48D2A] text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#B5751C] shadow-md shadow-[#D48D2A]/20">Add Partner</button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className='hidden md:table-header-group'>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partner Name</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metrics</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</th>
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {partners.map(partner => (
                                            <tr key={partner.id} className="block md:table-row hover:bg-gray-50/50 transition-colors group">
                                                <td className="block md:table-cell px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#F2E8DB] flex-shrink-0 items-center justify-center text-xs font-black text-[#D48D2A] border border-[#E5DAC8] hidden sm:flex">
                                                            {partner.name.substring(0, 2).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{partner.name}</p>
                                                            <p className="text-xs text-gray-400 font-medium">{partner.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="block md:table-cell px-6 py-5" data-label="Category">
                                                    <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-tight">
                                                        {partner.category}
                                                    </span>
                                                </td>
                                                <td className="block md:table-cell px-6 py-5" data-label="Status">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${partner.verificationStatus === 'Verified' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                                        partner.verificationStatus === 'Pending' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                            'bg-red-50 text-red-600 border border-red-100'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${partner.verificationStatus === 'Verified' ? 'bg-emerald-500' : partner.verificationStatus === 'Pending' ? 'bg-blue-500' : 'bg-red-500'}`}></span>
                                                        {partner.verificationStatus || 'Unknown'}
                                                    </div>
                                                </td>
                                                <td className="block md:table-cell px-6 py-5" data-label="Metrics">
                                                    <p className="text-sm font-bold text-gray-900">${numberWithCommas(partner.totalSales)}</p>
                                                    <p className="text-xs text-gray-400 font-bold uppercase">Lifetime Sales</p>
                                                </td>
                                                <td className="block md:table-cell px-6 py-5" data-label="Location">
                                                    <span className="text-sm text-gray-500 font-medium">{partner.location}</span>
                                                </td>
                                                <td className="block md:table-cell px-8 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => viewDocs(partner)}
                                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all text-xs font-bold uppercase border border-blue-100"
                                                        >
                                                            View Docs
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerification(partner.id, 'approve')}
                                                            disabled={actionLoading === partner.id}
                                                            className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold uppercase disabled:opacity-50 border border-emerald-100"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            onClick={() => handleVerification(partner.id, 'reject')}
                                                            disabled={actionLoading === partner.id}
                                                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all text-xs font-bold uppercase disabled:opacity-50 border border-red-100"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                            <div className="p-4 sm:p-8 border-b border-gray-100 flex-col sm:flex-row flex justify-between items-start sm:items-end">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-1 font-playfair">User Management</h3>
                                    <p className="text-sm text-gray-400 font-medium">View and manage all registered platform users</p>
                                </div>
                                <div className="flex gap-2 mt-4 sm:mt-0">
                                    <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-100">Export CSV</button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className='hidden md:table-header-group'>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">User Profile</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Plan</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Revenue</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {usersList.map(u => (
                                            <tr key={u.id} className="block md:table-row hover:bg-gray-50/50 transition-colors">
                                                <td className="block md:table-cell px-8 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 items-center justify-center text-gray-500 font-bold text-xs hidden sm:flex">
                                                            {u.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900">{u.name}</p>
                                                            <p className="text-xs text-gray-400">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="block md:table-cell px-6 py-5" data-label="Plan">
                                                    <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-tight ${u.plan === 'Business VIP' ? 'bg-[#F2E8DB] text-[#D48D2A]' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {u.plan}
                                                    </span>
                                                </td>
                                                <td className="block md:table-cell px-6 py-5" data-label="Status">
                                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{u.status}</span>
                                                </td>

                                                <td className="block md:table-cell px-6 py-5" data-label="Est. Revenue">
                                                    <p className="text-sm font-bold text-gray-900">${numberWithCommas(u.revenue)}</p>
                                                </td>
                                                <td className="block md:table-cell px-6 py-5" data-label="Joined">
                                                    <span className="text-xs text-gray-500">{new Date(u.joinDate).toLocaleDateString()}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analytics' && (
                        <div className="grid grid-cols-1 gap-8 animate-in fade-in duration-500">
                            <div className="bg-white p-4 sm:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 font-playfair">Growth Analytics</h3>
                                <p className="text-gray-400 text-sm mb-10">Platform user growth over the last 6 months</p>

                                <div className="h-64 flex items-end gap-4">
                                    {analyticsData?.userGrowth.map((item, index) => (
                                        <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
                                            <div
                                                className="w-full bg-gradient-to-t from-gray-900 to-gray-700 rounded-t-xl relative transition-all duration-300 group-hover:to-[#D48D2A] group-hover:from-[#B5751C]"
                                                style={{ height: `${(item.users / 3500) * 100}%` }}
                                            >
                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-lg px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center z-10">
                                                    <span>{item.users} Users</span>
                                                    <div className="w-2 h-2 bg-white rotate-45 absolute -bottom-1 border-r border-b border-gray-100"></div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'payouts' && (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
                            <div className="p-4 sm:p-8 border-b border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-1 font-playfair">Payout Management</h3>
                                <p className="text-sm text-gray-400 font-medium">Manage partner withdrawals and payments</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className='hidden md:table-header-group'>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Partner</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</th>
                                            <th className="px-6 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {payouts.map(payout => (
                                            <tr key={payout.id} className="block md:table-row hover:bg-gray-50/50 transition-colors">
                                                <td className="block md:table-cell px-8 py-5 font-bold text-gray-900" data-label="Partner">{payout.partner}</td>
                                                <td className="block md:table-cell px-6 py-5 font-medium text-gray-600" data-label="Amount">${numberWithCommas(payout.amount)}</td>
                                                <td className="block md:table-cell px-6 py-5 text-sm text-gray-500" data-label="Date">{new Date(payout.date).toLocaleDateString()}</td>
                                                <td className="block md:table-cell px-6 py-5" data-label="Status">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${payout.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                                                        payout.status === 'Pending' ? 'bg-amber-50 text-amber-600' :
                                                            'bg-blue-50 text-blue-600'
                                                        }`}>
                                                        {payout.status}
                                                    </span>
                                                </td>
                                                <td className="block md:table-cell px-8 py-5 text-right" data-label="Actions">
                                                    {payout.status === 'Pending' && (
                                                        <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors">
                                                            Process
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-4 sm:p-10 animate-in fade-in duration-500">
                            <h3 className="text-xl font-bold text-gray-900 mb-8 font-playfair">Admin Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform Name</label>
                                        <input type="text" defaultValue="Otulia Luxury" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D48D2A]" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Support Email</label>
                                        <input type="email" defaultValue="support@otulia.com" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D48D2A]" />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Platform Fee (%)</label>
                                        <input type="number" defaultValue="5" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:border-[#D48D2A]" />
                                    </div>
                                    <div className="pt-6">
                                        <button
                                            onClick={handleSaveSettings}
                                            disabled={savingSettings}
                                            className="px-6 py-3 bg-[#D48D2A] text-white rounded-xl font-bold text-sm hover:bg-[#B5751C] shadow-lg shadow-[#D48D2A]/20 transition-all w-full disabled:opacity-70 flex justify-center items-center gap-2"
                                        >
                                            {savingSettings ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Saving...
                                                </>
                                            ) : 'Save Changes'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* DOCUMENT VIEWER MODAL */}
            {selectedPartnerDocs && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeDocsModal}></div>
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 font-playfair">{selectedPartnerDocs.name}'s Documents</h3>
                                <p className="text-sm text-gray-400">Review submitted verification files</p>
                            </div>
                            <button onClick={closeDocsModal} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100">
                                <FiXCircle className="text-xl text-gray-400" />
                            </button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            {!selectedPartnerDocs.verificationDocuments || Object.keys(selectedPartnerDocs.verificationDocuments).length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <p>No documents found for this user.</p>
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {Object.entries(selectedPartnerDocs.verificationDocuments).map(([type, url]) => (
                                        <div key={type} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-[#D48D2A] hover:bg-[#FDF8F0] transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl group-hover:bg-white group-hover:text-[#D48D2A]">
                                                    📄
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 capitalize">{type.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                    <p className="text-xs text-gray-400">Document</p>
                                                </div>
                                            </div>
                                            <a
                                                href={url.startsWith('http') ? url : `/${url.replace(/^server\//, '').replace(/^\//, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-lg hover:bg-black transition-colors"
                                            >
                                                View File
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
                            <button onClick={closeDocsModal} className="px-6 py-3 bg-white border border-gray-200 text-gray-600 font-bold text-sm rounded-xl hover:bg-gray-50">
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    handleVerification(selectedPartnerDocs.id, 'reject');
                                    closeDocsModal();
                                }}
                                className="px-6 py-3 bg-red-50 text-red-600 border border-red-100 font-bold text-sm rounded-xl hover:bg-red-600 hover:text-white transition-all"
                            >
                                Reject Partner
                            </button>
                            <button
                                onClick={() => {
                                    handleVerification(selectedPartnerDocs.id, 'approve');
                                    closeDocsModal();
                                }}
                                className="px-6 py-3 bg-emerald-500 text-white font-bold text-sm rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
                            >
                                Approve Partner
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default AdminDashboard;
