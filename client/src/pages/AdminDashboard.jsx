import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from '../contexts/SnackbarContext';
import { useNavigate, useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

// Modular Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import OverviewTab from '../components/admin/OverviewTab';
import UsersTab from '../components/admin/UsersTab';
import AnalyticsTab from '../components/admin/AnalyticsTab';
import PayoutsTab from '../components/admin/PayoutsTab';
import PartnersTab from '../components/admin/PartnersTab';
import CouponsTab from '../components/admin/CouponsTab';
import SettingsTab from '../components/admin/SettingsTab';
import DocumentViewerModal from '../components/admin/DocumentViewerModal';
import CouponModal from '../components/admin/CouponModal';
import JournalCms from './journal/JournalCms';

const AdminDashboard = () => {
    const { token, user, loading: authLoading } = useAuth();
    const { showSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'users' || tab === 'partners') return 'overview';
        return tab || 'overview';
    });
    const [statusFilter, setStatusFilter] = useState('All');
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
    const [notifications, setNotifications] = useState([]);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    
    // Coupon States
    const [coupons, setCoupons] = useState([]);
    const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);
    const [couponFormData, setCouponFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        expiresAt: '',
        usageLimit: '',
        usageLimitPerUser: 1,
        isActive: true
    });

    const handleCouponAction = async (e) => {
        e.preventDefault();
        const method = editingCoupon ? 'PUT' : 'POST';
        const url = editingCoupon ? `/api/admin/coupons/${editingCoupon._id}` : '/api/admin/coupons';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(couponFormData)
            });

            if (response.ok) {
                const data = await response.json();
                if (editingCoupon) {
                    setCoupons(prev => prev.map(c => c._id === data._id ? data : c));
                } else {
                    setCoupons(prev => [data, ...prev]);
                }
                setIsCouponModalOpen(false);
                setEditingCoupon(null);
                setCouponFormData({
                    code: '',
                    discountType: 'percentage',
                    discountValue: '',
                    expiresAt: '',
                    usageLimit: '',
                    usageLimitPerUser: 1,
                    isActive: true
                });
            } else {
                const err = await response.json();
                alert(err.error || 'Operation failed');
            }
        } catch (error) {
            console.error("Coupon Action Error:", error);
        }
    };

    const deleteCoupon = async (id) => {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
            const response = await fetch(`/api/admin/coupons/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setCoupons(prev => prev.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error("Delete Coupon Error:", error);
        }
    };

    const handleRemoveNotification = async (notificationId) => {
        try {
            const response = await fetch(`/api/leads/notification/${notificationId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setNotifications(prev => prev.filter(n => n._id !== notificationId));
            }
        } catch (error) {
            console.error("Remove Notification Error:", error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSaveSettings = () => {
        setSavingSettings(true);
        // Simulate API call for platform settings
        setTimeout(() => {
            setSavingSettings(false);
            alert('Admin settings saved successfully!');
        }, 1000);
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

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab === 'users' || tab === 'partners') {
            showSnackbar("COMING SOON");
            setActiveTab('overview');
        } else if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [location.search]);

    useEffect(() => {
        if (activeTab === 'users' || activeTab === 'partners') {
            showSnackbar("COMING SOON");
            setActiveTab('overview');
        }
    }, [activeTab]);

    // Admins only: once the session has loaded, send everyone else to the homepage
    const isAdmin = user?.role === 'admin';
    useEffect(() => {
        if (!authLoading && !isAdmin) navigate('/', { replace: true });
    }, [authLoading, isAdmin, navigate]);

    const fetchData = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const [statsRes, partnersRes, usersRes, analyticsRes, payoutsRes, couponsRes] = await Promise.all([
                fetch('/api/admin/stats', { headers }),
                fetch('/api/admin/partners', { headers }),
                fetch('/api/admin/users', { headers }),
                fetch('/api/admin/analytics', { headers }),
                fetch('/api/admin/payouts', { headers }),
                fetch('/api/admin/coupons', { headers })
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
                setNotifications(statsData.notifications || []);
            }
            if (partnersRes.ok) setPartners(await partnersRes.json());
            if (usersRes.ok) setUsersList(await usersRes.json());
            if (analyticsRes.ok) setAnalyticsData(await analyticsRes.json());
            if (payoutsRes.ok) setPayouts(await payoutsRes.json());
            if (couponsRes.ok) setCoupons(await couponsRes.json());
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
                alert(`Partner ${action} successfully`);
            } else {
                alert('Action failed');
            }
        } catch (error) {
            console.error("Action Error:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (authLoading || !isAdmin || loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <SEO title="Admin Dashboard" description="Otulia System Administration" noindex />
            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex montserrat">
            <SEO title="Admin Dashboard" description="Otulia System Administration" noindex />
            
            {/* SIDEBAR */}
            <AdminSidebar 
                isSidebarOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                user={user} 
            />

            {/* MAIN CONTENT */}
            <main className="flex-1 min-w-0 md:min-w-auto bg-[#F9FAFB] transition-all duration-300 ease-in-out lg:ml-[240px]">
                {/* HEADER/NAVBAR */}
                <AdminNavbar 
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    toggleSidebar={toggleSidebar}
                    isNotificationDropdownOpen={isNotificationDropdownOpen}
                    setIsNotificationDropdownOpen={setIsNotificationDropdownOpen}
                    notifications={notifications}
                    handleRemoveNotification={handleRemoveNotification}
                />

                <div className="p-4 sm:p-10">
                    {activeTab === 'overview' && (
                        <OverviewTab stats={stats} analyticsData={analyticsData} />
                    )}

                    {activeTab === 'users' && (
                        <UsersTab usersList={usersList} />
                    )}

                    {activeTab === 'analytics' && (
                        <AnalyticsTab analyticsData={analyticsData} />
                    )}

                    {activeTab === 'payouts' && (
                        <PayoutsTab payouts={payouts} />
                    )}

                    {activeTab === 'partners' && (
                        <PartnersTab 
                            partners={partners}
                            statusFilter={statusFilter}
                            setStatusFilter={setStatusFilter}
                            viewDocs={viewDocs}
                            handleVerification={handleVerification}
                            actionLoading={actionLoading}
                        />
                    )}

                    {activeTab === 'coupons' && (
                        <CouponsTab 
                            coupons={coupons}
                            setEditingCoupon={setEditingCoupon}
                            setCouponFormData={setCouponFormData}
                            setIsCouponModalOpen={setIsCouponModalOpen}
                            deleteCoupon={deleteCoupon}
                        />
                    )}

                    {activeTab === 'journal' && <JournalCms />}

                    {activeTab === 'settings' && (
                        <SettingsTab 
                            handleSaveSettings={handleSaveSettings}
                            savingSettings={savingSettings}
                        />
                    )}
                </div>
            </main>

            {/* DOCUMENT VIEWER MODAL */}
            <DocumentViewerModal 
                selectedPartnerDocs={selectedPartnerDocs}
                closeDocsModal={closeDocsModal}
                handleVerification={handleVerification}
            />

            {/* COUPON MODAL */}
            <CouponModal 
                isCouponModalOpen={isCouponModalOpen}
                setIsCouponModalOpen={setIsCouponModalOpen}
                editingCoupon={editingCoupon}
                couponFormData={couponFormData}
                setCouponFormData={setCouponFormData}
                handleCouponAction={handleCouponAction}
            />
        </div>
    );
};

export default AdminDashboard;
