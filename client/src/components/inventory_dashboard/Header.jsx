import React from 'react';
import ThemeToggle from '../navbar/ThemeToggle';
import { FiCalendar, FiChevronDown, FiBell, FiTrash2, FiUsers, FiUser, FiShield, FiCreditCard, FiSettings, FiLogOut } from 'react-icons/fi';

const Header = ({ 
    activeTab, 
    navItems, 
    data, 
    user, 
    wavingHand, 
    timeframe, 
    setTimeframe, 
    isNotificationDropdownOpen, 
    setIsNotificationDropdownOpen, 
    handleRemoveNotification, 
    setActiveTab, 
    isHeaderDropdownOpen, 
    setIsHeaderDropdownOpen, 
    navigate, 
    logout,
    chartInterval,
    setChartInterval
}) => {
    return (
        <header className="min-h-[56px] md:min-h-auto md:h-[clamp(50px,8vh,80px)] border-b flex flex-wrap md:flex-nowrap items-center justify-between gap-x-3 gap-y-2 md:gap-0 py-2 md:py-0 px-[clamp(12px,2vw,40px)] sticky top-0 z-[40] transition-colors duration-300 bg-white border-gray-100">
            <div className="mr-auto md:mr-0 flex items-center gap-[clamp(8px,1vw,20px)]">
                <div className="flex flex-col">
                    <h2 className="text-[clamp(16px,2.2vh,28px)] font-bold text-gray-900 flex items-center gap-[clamp(4px,0.5vw,12px)] leading-none inter">
                        {activeTab === 'settings' ? 'Profile & Company Settings' : navItems.find(n => n.id === activeTab)?.label}
                        {activeTab === 'inventory' && (
                            <span className="text-[clamp(10px,1.4vh,18px)] font-medium text-gray-400 montserrat ml-1">
                                ({data?.inventory?.length || 0}/{user?.plan === 'Business VIP' ? 150 : user?.plan === 'Premium Basic' ? 25 : 5} used)
                            </span>
                        )}
                    </h2>
                    {activeTab === 'dashboard' && (
                        <p className="text-[clamp(9px,1.2vh,16px)] font-normal text-[#999999] inter leading-none mt-[clamp(2px,0.4vh,6px)] flex items-center gap-1">
                            Welcome back, {user?.name?.split(' ')[0] || user?.name || 'Md Riyaz'} 
                            <img src={wavingHand} alt="👋" className="w-[clamp(10px,1.5vh,18px)] h-[clamp(10px,1.5vh,18px)] object-contain" />
                        </p>
                    )}
                </div>
            </div>

            <div className="contents md:flex items-center gap-[clamp(12px,1.5vw,32px)]">
                {activeTab === 'dashboard' && (
                    <>
                        {/* Last 30 Days Dropdown */}
                        <div className="order-last md:order-none relative w-[clamp(120px,10vw,180px)] h-[clamp(30px,4vh,44px)]">
                            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 text-[clamp(10px,1.2vh,16px)] pointer-events-none" />
                            <select 
                                value={chartInterval}
                                onChange={(e) => setChartInterval(e.target.value)}
                                className="w-full h-full appearance-none bg-white border border-gray-100 rounded-[clamp(4px,0.8vh,10px)] pl-8 pr-8 text-[clamp(10px,1.4vh,18px)] font-bold text-gray-700 inter focus:outline-none focus:border-[#D48D2A] cursor-pointer leading-none"
                            >
                                <option value="Month">Last 30 days</option>
                                <option value="Week">Last 7 days</option>
                                <option value="Year">This year</option>
                            </select>
                            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none text-[clamp(9px,1.2vh,16px)]" />
                        </div>

                        {/* Day/Week/Month Tabs */}
                        <div className="order-last md:order-none flex items-center rounded-[clamp(4px,0.8vh,10px)] bg-gray-50 p-[clamp(2px,0.4vh,6px)] h-[clamp(30px,4vh,44px)]">
                            {['Day', 'Week', 'Month'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setTimeframe(t)}
                                    className={`px-[clamp(12px,1.5vw,24px)] h-full flex items-center justify-center text-[clamp(10px,1.4vh,18px)] font-bold inter leading-none transition-all rounded-[clamp(3px,0.6vh,8px)] ${timeframe === t
                                        ? 'bg-black text-white shadow-sm'
                                        : 'text-gray-700 hover:text-gray-900'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'analytics' && (
                    <div className="order-last md:order-none flex flex-wrap md:flex-nowrap items-center gap-[clamp(8px,1vw,20px)]">
                        {/* Date Range Picker Placeholder */}
                        <div className="flex items-center gap-2 px-[clamp(10px,1.2vh,20px)] h-[clamp(30px,4vh,44px)] bg-white border border-gray-100 rounded-[clamp(8px,1vh,12px)] shadow-sm cursor-pointer hover:bg-gray-50 transition-colors">
                            <FiCalendar className="text-gray-500 text-[clamp(12px,1.6vh,24px)]" />
                            <span className="inter text-[clamp(10px,1.3vh,18px)] font-semibold text-gray-700">24 Apr - 24 May 2026</span>
                            <FiChevronDown className="text-gray-400 text-[clamp(10px,1.2vh,18px)]" />
                        </div>

                        {/* Timeframe Selectors */}
                        <div className="flex items-center bg-white border border-gray-100 rounded-[clamp(8px,1vh,12px)] shadow-sm h-[clamp(30px,4vh,44px)] p-[clamp(2px,0.4vh,6px)] gap-1">
                            {[
                                { label: '7D', value: 'Day' },
                                { label: '30D', value: 'Week' },
                                { label: '90D', value: 'Month' },
                                { label: '1Y', value: 'Year' }
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={() => setChartInterval(item.value)}
                                    className={`px-[clamp(8px,1vh,16px)] h-full flex items-center justify-center text-[clamp(10px,1.3vh,18px)] font-bold inter rounded-[clamp(4px,0.6vh,8px)] transition-all ${chartInterval === item.value 
                                        ? 'bg-[#FFB75E] text-white shadow-sm' 
                                        : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                            <div className="w-px h-4 bg-gray-100 mx-1" />
                            <button className="flex items-center gap-1 px-[clamp(8px,1vh,16px)] h-full text-[clamp(10px,1.3vh,18px)] font-bold text-gray-700 hover:bg-gray-50 rounded-[clamp(4px,0.6vh,8px)] transition-all">
                                Custom <FiChevronDown className="text-gray-400 text-[clamp(10px,1.2vh,18px)]" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Icons Section */}
                <div className="flex items-center">
                    <div className="relative">
                        <button
                            onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                            className="w-[clamp(32px,4.5vh,60px)] h-[clamp(32px,4.5vh,60px)] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-all focus:outline-none border border-gray-100"
                        >
                            <FiBell className="text-gray-400 text-[clamp(16px,2vh,30px)]" />
                            {data?.notifications?.length > 0 && (
                                <span className="absolute top-[15%] right-[15%] w-[clamp(6px,1vh,12px)] h-[clamp(6px,1vh,12px)] bg-red-500 rounded-full border border-white" />
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {isNotificationDropdownOpen && (
                            <div
                                className="absolute right-0 top-full mt-2 w-[clamp(280px,25vw,400px)] bg-white rounded-xl shadow-xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]"
                                onMouseLeave={() => setIsNotificationDropdownOpen(false)}
                            >
                                <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center">
                                    <h4 className="text-[clamp(10px,1.2vh,14px)] font-bold text-gray-900 uppercase tracking-widest">Recent Notifications</h4>
                                    <span className="text-[clamp(9px,1.1vh,13px)] font-bold text-[#D48D2A]">{data?.notifications?.length || 0} New</span>
                                </div>
                                <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                    {(!data?.notifications || data.notifications.length === 0) ? (
                                        <div className="py-8 px-4 text-center">
                                            <FiBell className="mx-auto text-gray-200 text-3xl mb-2" />
                                            <p className="text-[clamp(11px,1.4vh,16px)] text-gray-400 font-medium">No new lead notifications</p>
                                        </div>
                                    ) : (
                                        data.notifications.map((notif) => (
                                            <div
                                                key={notif._id}
                                                onClick={() => {
                                                    handleRemoveNotification(notif._id);
                                                    if (notif.targetTab) {
                                                        setActiveTab(notif.targetTab);
                                                    } else {
                                                        setActiveTab(notif.type === 'LEAD' ? 'leads' : 'dashboard');
                                                    }
                                                    setIsNotificationDropdownOpen(false);
                                                }}
                                                className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors group relative"
                                            >
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                                        <FiUsers className="text-sm" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[clamp(11px,1.4vh,16px)] font-bold text-gray-900 leading-tight mb-1">{notif.message}</p>
                                                        <p className="text-[clamp(9px,1.2vh,14px)] text-gray-400 font-medium">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Click to view</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveNotification(notif._id);
                                                    }}
                                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 hover:text-red-500 rounded text-gray-300 transition-all"
                                                >
                                                    <FiTrash2 className="text-xs" />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {data?.notifications?.length > 0 && (
                                    <div className="px-4 pt-2 text-center">
                                        <button
                                            onClick={() => {
                                                setActiveTab('leads');
                                                setIsNotificationDropdownOpen(false);
                                            }}
                                            className="text-[clamp(9px,1.2vh,14px)] font-bold text-gray-400 hover:text-[#D48D2A] uppercase tracking-widest transition-colors"
                                        >
                                            View Lead Management
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* User Profile Section */}
                <div className="relative">
                    <button
                        onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
                        onBlur={() => setTimeout(() => setIsHeaderDropdownOpen(false), 200)}
                        className="flex items-center gap-[clamp(8px,1vw,16px)] hover:opacity-80 transition-opacity focus:outline-none"
                    >
                        <img src={user?.profilePicture || '/assets/user.png'} className="w-[clamp(30px,4vh,54px)] h-[clamp(30px,4vh,54px)] rounded-full border border-gray-200 object-cover" alt="Profile" />
                        <div className="hidden md:block text-left">
                            <p className="text-[clamp(10px,1.4vh,18px)] font-semibold text-gray-900 inter leading-none mb-1">{user?.name || 'Prestige Motors'}</p>
                            <p className="text-[clamp(8px,1vh,14px)] text-[#999999] font-normal inter leading-none">{user?.plan || 'Professional'} Plan</p>
                        </div>
                        <FiChevronDown className={`text-gray-400 text-[clamp(10px,1.2vh,18px)] transition-transform duration-200 ${isHeaderDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isHeaderDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-[clamp(200px,18vw,280px)] bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="px-4 py-3 border-b border-gray-50">
                                <p className="text-[clamp(12px,1.6vh,18px)] font-bold text-gray-900 inter leading-none mb-1">{user?.name || 'Prestige Motors'}</p>
                                <p className="text-[clamp(10px,1.4vh,16px)] text-[#999999] inter truncate leading-none">{user?.email || 'contact@prestigemotors.com'}</p>
                            </div>
                            <div className="py-1">
                                <button
                                    onClick={() => navigate('/profile')}
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                >
                                    <FiUser className="text-[clamp(16px,2.2vh,24px)]" /> My Profile
                                </button>
                                {user?.role === 'admin' && (
                                    <button
                                        onClick={() => navigate('/admin')}
                                        className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                    >
                                        <FiShield className="text-[clamp(16px,2.2vh,24px)]" /> Admin Dashboard
                                    </button>
                                )}
                                <button
                                    onClick={() => setActiveTab('subscription')}
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                >
                                    <FiCreditCard className="text-[clamp(16px,2.2vh,24px)]" /> Subscription
                                </button>
                                <button
                                    onClick={() => setActiveTab('settings')}
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors"
                                >
                                    <FiSettings className="text-[clamp(16px,2.2vh,24px)]" /> Settings
                                </button>
                                <ThemeToggle
                                    variant="menu"
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-gray-600 inter hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2 transition-colors cursor-pointer"
                                />
                            </div>
                            <div className="border-t border-gray-50 py-1">
                                <button
                                    onClick={() => {
                                        logout();
                                        navigate('/login');
                                    }}
                                    className="w-full text-left px-4 py-2.5 text-[clamp(12px,1.6vh,18px)] font-medium text-red-600 inter hover:bg-red-50 flex items-center gap-2 transition-colors"
                                >
                                    <FiLogOut className="text-[clamp(16px,2.2vh,24px)]" /> Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
