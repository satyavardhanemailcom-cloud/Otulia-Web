import React from 'react';
import { FiGrid, FiSearch, FiBell, FiShield } from 'react-icons/fi';
import ThemeToggle from '../navbar/ThemeToggle';
import { useSnackbar } from '../../contexts/SnackbarContext';

const AdminNavbar = ({
    activeTab,
    setActiveTab,
    toggleSidebar,
    isNotificationDropdownOpen,
    setIsNotificationDropdownOpen,
    notifications,
    handleRemoveNotification
}) => {
    const { showSnackbar } = useSnackbar();
    const getTabTitle = () => {
        if (activeTab === 'overview') return 'Dashboard Overview';
        if (activeTab === 'partners') return 'Partner Verification';
        return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    };

    return (
        <header className="h-20 px-4 sm:px-8 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-40">
            <div className="flex items-center gap-4">
                <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-900 lg:hidden">
                    <FiGrid className="h-6 w-6" />
                </button>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 canela">
                    {getTabTitle()}
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
                <ThemeToggle className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-all focus:outline-none cursor-pointer" />
                <div className="relative">
                    <button 
                        onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                        className="relative w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-all focus:outline-none"
                    >
                        <FiBell className="text-gray-500" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2 right-2.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] text-white font-bold flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {isNotificationDropdownOpen && (
                        <div 
                            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-3 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]"
                            onMouseLeave={() => setIsNotificationDropdownOpen(false)}
                        >
                            <div className="px-4 pb-2 border-b border-gray-50 flex justify-between items-center">
                                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recent Alerts</h4>
                                <span className="text-[10px] font-bold text-[#D48D2A]">{notifications.length} New</span>
                            </div>
                            <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                {notifications.length === 0 ? (
                                    <div className="py-8 px-4 text-center">
                                        <FiBell className="mx-auto text-gray-200 text-3xl mb-2" />
                                        <p className="text-xs text-gray-400 font-medium">No new notifications</p>
                                    </div>
                                ) : (
                                    notifications.map((notif) => (
                                        <div 
                                            key={notif._id} 
                                            onClick={() => {
                                                handleRemoveNotification(notif._id);
                                                if (notif.targetTab) {
                                                    if (notif.targetTab === 'users' || notif.targetTab === 'partners') {
                                                        showSnackbar("COMING SOON");
                                                    } else {
                                                        setActiveTab(notif.targetTab);
                                                    }
                                                }
                                                setIsNotificationDropdownOpen(false);
                                            }}
                                            className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 cursor-pointer transition-colors group relative"
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#D48D2A] shrink-0">
                                                    <FiShield className="text-sm" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-900 leading-tight mb-1">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium">
                                                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Click to view
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
