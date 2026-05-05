import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {
    FiGrid, FiPackage, FiUsers, FiPieChart,
    FiGlobe, FiCreditCard, FiSettings, FiBell,
    FiArrowUpRight, FiTrendingUp, FiTrendingDown, FiDownload, FiHome, FiAnchor,
    FiMail, FiPhone, FiShield, FiLock, FiKey,
    FiBriefcase, FiCheckCircle, FiUpload, FiCalendar, FiMapPin, FiMap,
    FiSearch, FiFilter, FiPlus, FiChevronDown, FiHeart, FiEdit2, FiTrash2, FiEye,
    FiUser, FiLogOut, FiClock, FiLoader, FiMoreVertical, FiActivity,
    FiMessageSquare, FiPlayCircle, FiImage, FiDroplet, FiLayout, FiExternalLink, FiShare2, FiMoreHorizontal,
    FiArrowRight, FiChevronRight, FiX, FiInstagram, FiLinkedin, FiFacebook, FiYoutube, FiMonitor, FiRefreshCw
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, BarChart, Bar } from 'recharts';
import Navbar from '../components/Navbar';
import AddAssetModal from '../components/inventory/AddAssetModal';
import AddLeadModal from '../components/inventory/AddLeadModal';
import ConfirmationModal from '../components/ConfirmationModal';
import DealerVerificationModal from '../components/inventory/DealerVerificationModal';
import ImageCropModal from '../components/ImageCropModal';
import numberWithCommas from '../modules/numberwithcomma';
import SEO from '../components/SEO';
import ContactModal from '../components/ContactModal';


const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "USD",
    intent: "capture"
};

const languages = [
    'English', 'Spanish', 'French', 'Arabic', 'German', 
    'Chinese', 'Russian', 'Portuguese', 'Italian', 'Dutch'
];

const timezones = [
    '(GMT-08:00) Pacific Time (US & Canada)',
    '(GMT-05:00) Eastern Time (US & Canada)',
    '(GMT+00:00) London, Dublin, Lisbon',
    '(GMT+01:00) Paris, Berlin, Rome, Madrid',
    '(GMT+02:00) Athens, Istanbul, Jerusalem',
    '(GMT+03:00) Moscow, Riyadh, Nairobi',
    '(GMT+04:00) Dubai, UAE',
    '(GMT+05:30) Mumbai, New Delhi',
    '(GMT+08:00) Singapore, Hong Kong, Beijing',
    '(GMT+09:00) Tokyo, Seoul',
    '(GMT+10:00) Sydney, Melbourne'
];

const contactMethods = ['WhatsApp', 'Email', 'Phone Call', 'SMS'];

const businessTypes = [
    'Car Dealership',
    'Real Estate Agency',
    'Bike Company',
    'Yacht Company'
];

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
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [leadStatusFilter, setLeadStatusFilter] = useState('All Status');
    const [leadSourceFilter, setLeadSourceFilter] = useState('All Source');
    const [leadAssetFilter, setLeadAssetFilter] = useState('All Assets');
    const [leadSearchQuery, setLeadSearchQuery] = useState('');
    const [inventoryStatusFilter, setInventoryStatusFilter] = useState('All Status');
    const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('All Categories');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactType, setContactType] = useState('Sales');
    const [isVerifiedDealer, setIsVerifiedDealer] = useState(user?.isVerified || false);
    const [upgradePlan, setUpgradePlan] = useState(null); // 'Premium Basic' or 'Business VIP'
    const [logoLoading, setLogoLoading] = useState(false);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [showCropModal, setShowCropModal] = useState(false);
    const [cropSrc, setCropSrc] = useState(null);
    const [cropTarget, setCropTarget] = useState(null); // 'logo' or 'companyCover'
    const [leadEmailNotifications, setLeadEmailNotifications] = useState(user?.leadEmailNotifications !== false);
    
    // Actions Dropdown & Lead View Modal States
    const [activeLeadDropdown, setActiveLeadDropdown] = useState(null);
    const [viewLead, setViewLead] = useState(null);

    const [savingPersonal, setSavingPersonal] = useState(false);
    const [savingCompany, setSavingCompany] = useState(false);

    // Delete Confirmation State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [listingToDelete, setListingToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [billingCycle, setBillingCycle] = useState('Monthly');

    const handleRemoveNotification = async (notificationId) => {
        try {
            const response = await fetch(`/api/leads/notification/${notificationId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                // Remove from local state immediately for snappy feel
                setData(prev => ({
                    ...prev,
                    notifications: prev.notifications.filter(n => n._id !== notificationId)
                }));
            }
        } catch (error) {
            console.error("Remove Notification Error:", error);
        }
    };

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

                    const comp = resData.userProfile.company || {};
                    
                    let pCode = '+971';
                    let pNum = '';
                    if (resData.userProfile.phone) {
                        const parts = resData.userProfile.phone.split(' ');
                        if (parts.length > 1) {
                            pCode = parts[0];
                            pNum = parts.slice(1).join(' ');
                        } else {
                            pNum = resData.userProfile.phone;
                        }
                    }

                    let cpCode = '+971';
                    let cpNum = '';
                    if (comp.phone) {
                        const parts = comp.phone.split(' ');
                        if (parts.length > 1) {
                            cpCode = parts[0];
                            cpNum = parts.slice(1).join(' ');
                        } else {
                            cpNum = comp.phone;
                        }
                    }

                    let wCode = '+971';
                    let wNum = '';
                    if (resData.userProfile.whatsapp) {
                        const parts = resData.userProfile.whatsapp.split(' ');
                        if (parts.length > 1) {
                            wCode = parts[0];
                            wNum = parts.slice(1).join(' ');
                        } else {
                            wNum = resData.userProfile.whatsapp;
                        }
                    }

                    setAgentInfo(prev => ({
                        ...prev,
                        photo: resData.userProfile.profilePicture || prev.photo,
                        coverPhoto: resData.userProfile.coverPhoto || prev.coverPhoto,
                        fullName: resData.userProfile.name || prev.fullName,
                        email: resData.userProfile.email || prev.email,
                        phoneCode: pCode,
                        phone: pNum,
                        whatsappCode: wCode,
                        whatsapp: wNum,
                        jobTitle: resData.userProfile.jobTitle || prev.jobTitle,
                        language: resData.userProfile.language || prev.language,
                        timezone: resData.userProfile.timezone || prev.timezone,
                        preferredContact: resData.userProfile.preferredContact || prev.preferredContact,
                        description: resData.userProfile.agentDescription || prev.description,
                        social: {
                            ...prev.social,
                            ...(resData.userProfile.social || {})
                        }
                    }));

                    setCompanyInfo(prev => ({
                        ...prev,
                        name: comp.companyName || '',
                        email: comp.email || resData.userProfile.email || '',
                        phoneCode: cpCode,
                        phone: cpNum,
                        address: comp.address || '',
                        website: comp.website || '',
                        logo: comp.companyLogo || null,
                        coverPhoto: comp.coverPhoto || null,
                        description: comp.description || '',
                        businessType: comp.businessType || prev.businessType,
                        establishedYear: comp.establishedYear || prev.establishedYear,
                        social: {
                            ...prev.social,
                            ...(comp.social || {})
                        }
                    }));
                    setLeadEmailNotifications(resData.userProfile.leadEmailNotifications !== false);
                }
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus, isActivity) => {
        try {
            const response = await fetch(`/api/leads/status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus, isActivity })
            });

            if (response.ok) {
                // Refresh data to reflect change
                fetchDashboard();
            } else {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error("Status Update Error:", error);
            alert("Failed to update status.");
        }
    };

    useEffect(() => {
        if (user) {
            setIsVerifiedDealer(user.isVerified);
            // If verification is pending, we can optionally show a banner or status
        }
    }, [user]);

    const [companyInfo, setCompanyInfo] = useState({
        name: '',
        email: '',
        phoneCode: '+971',
        phone: '',
        address: '',
        website: '',
        logo: null,
        description: '',
        businessType: 'Car Dealership',
        establishedYear: '2019',
        social: {
            instagram: '',
            linkedin: '',
            facebook: '',
            youtube: ''
        }
    });

    const [agentInfo, setAgentInfo] = useState({
        photo: null,
        fullName: user?.name || '',
        jobTitle: 'Luxury Asset Consultant',
        email: user?.email || '',
        phoneCode: '+971',
        phone: '',
        whatsappCode: '+971',
        whatsapp: '',
        preferredContact: 'WhatsApp',
        language: 'English',
        timezone: '(GMT+04:00) Dubai, UAE',
        description: '',
        social: {
            instagram: '',
            linkedin: '',
            x: '',
            facebook: ''
        }
    });

    useEffect(() => {
        fetchDashboard();
    }, [token]);

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCropTarget('logo');
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setCropSrc(reader.result);
            setShowCropModal(true);
        });
        reader.readAsDataURL(file);
    };

    const handleCoverUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setCropTarget('companyCover');
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            setCropSrc(reader.result);
            setShowCropModal(true);
        });
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (blob) => {
        const formData = new FormData();
        let endpoint = '';
        let fieldName = '';

        if (cropTarget === 'logo') {
            setLogoLoading(true);
            endpoint = '/api/auth/upload-company-logo';
            fieldName = 'companyLogo';
        } else if (cropTarget === 'companyCover') {
            setIsUploadingCover(true);
            endpoint = '/api/auth/upload-company-cover';
            fieldName = 'coverPhoto';
        } else if (cropTarget === 'agentCover') {
            setIsUploadingCover(true);
            endpoint = '/api/auth/upload-cover-photo';
            fieldName = 'coverPhoto';
        }

        formData.append(fieldName, blob, 'image.png');

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                if (cropTarget === 'logo') {
                    setCompanyInfo(prev => ({ ...prev, logo: result.companyLogo }));
                    alert("Company logo updated successfully!");
                } else if (cropTarget === 'companyCover') {
                    setCompanyInfo(prev => ({ ...prev, coverPhoto: result.user.company.coverPhoto }));
                    alert("Company cover photo updated successfully!");
                } else if (cropTarget === 'agentCover') {
                    setAgentInfo(prev => ({ ...prev, coverPhoto: result.user.coverPhoto }));
                    alert("Agent cover photo updated successfully!");
                }
                if (refreshUser) refreshUser();
                setShowCropModal(false);
            } else {
                const err = await response.json();
                alert(err.error || "Failed to upload image");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error uploading image");
        } finally {
            setLogoLoading(false);
            setIsUploadingCover(false);
        }
    };

    const handleProfilePicUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('profilePicture', file);

        try {
            const response = await fetch('/api/auth/upload-profile-picture', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                setAgentInfo(prev => ({ ...prev, photo: result.user.profilePicture }));
                alert("Profile photo updated successfully!");
                if (refreshUser) refreshUser();
            } else {
                const err = await response.json();
                alert(err.error || "Failed to upload photo");
            }
        } catch (error) {
            console.error("Photo upload error:", error);
            alert("Error uploading photo");
        }
    };

    const handleTogglePublic = async (item) => {
        if (updatingId) return; // Prevent multiple clicks
        
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
                    model: item.itemModel || item.category,
                    isPublic: !isCurrentPublic
                })
            });

            if (response.ok) {
                await fetchDashboard();
            } else {
                const errorData = await response.json();
                alert(errorData.error || "Failed to update visibility");
            }
        } catch (error) {
            console.error("Toggle Error:", error);
            alert("Connection error while updating visibility");
        } finally {
            setUpdatingId(null);
        }
    };

    const handleToggleLeadNotifications = () => {
        setLeadEmailNotifications(!leadEmailNotifications);
    };

    const handleSavePersonalDetails = async () => {
        setSavingPersonal(true);
        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: agentInfo.fullName,
                    phone: `${agentInfo.phoneCode} ${agentInfo.phone}`,
                    whatsapp: `${agentInfo.whatsappCode} ${agentInfo.whatsapp}`,
                    jobTitle: agentInfo.jobTitle,
                    language: agentInfo.language,
                    timezone: agentInfo.timezone,
                    preferredContact: agentInfo.preferredContact,
                    agentDescription: agentInfo.description,
                    social: agentInfo.social
                })
            });

            if (response.ok) {
                alert("Personal details saved successfully!");
                await fetchDashboard();
                if (refreshUser) refreshUser();
            } else {
                const err = await response.json();
                alert(err.error || "Failed to save personal details");
            }
        } catch (error) {
            console.error("Save personal details error:", error);
            alert("Error saving personal details");
        } finally {
            setSavingPersonal(false);
        }
    };

    const handleSaveCompanyDetails = async () => {
        setSavingCompany(true);
        try {
            const response = await fetch('/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    company: {
                        companyName: companyInfo.name,
                        companyLogo: companyInfo.logo,
                        address: companyInfo.address,
                        website: companyInfo.website,
                        description: companyInfo.description,
                        businessType: companyInfo.businessType,
                        establishedYear: companyInfo.establishedYear,
                        phone: `${companyInfo.phoneCode} ${companyInfo.phone}`,
                        email: companyInfo.email,
                        social: companyInfo.social
                    }
                })
            });

            if (response.ok) {
                alert("Company details saved successfully!");
                await fetchDashboard();
                if (refreshUser) refreshUser();
            } else {
                const err = await response.json();
                alert(err.error || "Failed to save company details");
            }
        } catch (error) {
            console.error("Save company details error:", error);
            alert("Error saving company details");
        } finally {
            setSavingCompany(false);
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

                // Sync latest data
                await fetchDashboard();

                setIsVerificationModalOpen(false);
                setActiveTab('settings'); // Redirect to settings to see status
            } else {
                const data = await response.json();
                alert(`Failed to submit verification documents: ${data.details || data.error || 'Please try again.'}`);
            }
        } catch (error) {
            console.error("Verification Submit Error:", error);
            alert(`An error occurred: ${error.message}`);
        }
    };

    const handlePlanChange = (newPlan) => {
        setUpgradePlan(newPlan);
    };

    const confirmDelete = (id) => {
        setListingToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleDelete = async () => {
        if (!listingToDelete) return;
        const id = listingToDelete;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/listings/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                await fetchDashboard();
                setDeleteModalOpen(false);
            } else {
                const errData = await response.json();
                alert(errData.error || "Failed to delete listing");
            }
        } catch (error) {
            console.error("Delete error:", error);
            alert("Connection error while deleting");
        } finally {
            setIsDeleting(false);
            setListingToDelete(null);
        }
    };

    const handleExportCSV = () => {
        const leadsToExport = data?.leads;
        if (!leadsToExport || leadsToExport.length === 0) {
            alert("No leads available to export.");
            return;
        }

        const headers = ['Name', 'Email', 'Phone', 'Type', 'Inquiry/Subject', 'Status', 'Date Received'];
        const csvRows = leadsToExport.map(lead => {
            return [
                `"${(lead.name || '').replace(/"/g, '""')}"`,
                `"${(lead.email || '').replace(/"/g, '""')}"`,
                `"${(lead.phone || '').replace(/"/g, '""')}"`,
                `"${(lead.userType === 'Guest' ? lead.guestType || 'Guest' : lead.userType || 'Registered').replace(/"/g, '""')}"`,
                `"${(lead.type === 'General Inquiry' ? lead.subject || 'General Inquiry' : lead.inquiryType || 'Specific Listing').replace(/"/g, '""')}"`,
                `"${(lead.status || 'New').replace(/"/g, '""')}"`,
                `"${new Date(lead.createdAt).toLocaleDateString()}"`
            ].join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `otulia_leads_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            <SEO title="Inventory Dashboard" description="Manage your dealership inventory and leads on Otulia." />
            <SEO title="Inventory Dashboard" description="Manage your dealership inventory and leads on Otulia." />


            {/* SIDEBAR */}
            <div className={`w-72 border-r flex flex-col fixed inset-y-0 z-50 transition-colors duration-300 bg-white border-gray-100`}>
                <div className="p-8 pb-10">
                    <img src="/logos/otulia_logo_black.png" alt="Otulia" className="h-[42px] cursor-pointer" onClick={() => navigate('/')} />
                </div>

                <nav className="flex-1 px-5 space-y-2 overflow-y-auto custom-scrollbar pb-8">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === item.id
                                ? 'bg-[#FFF7ED] text-gray-900 border-l-[3px] border-[#D48D2A] shadow-sm'
                                : 'text-gray-500 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className={`text-lg ${activeTab === item.id ? 'text-gray-900' : 'text-gray-400'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="px-6 pb-6 mt-auto">
                    {/* User Profile Snippet */}
                    <div 
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors mb-4 relative"
                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img src={user?.profilePicture || '/assets/user.png'} className="w-10 h-10 rounded-full border border-gray-200 shrink-0" alt="Profile" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Md Riyaz'}</p>
                                <p className="text-[10px] text-gray-400 font-medium truncate">{user?.plan || 'Premium Basic Plan'}</p>
                            </div>
                        </div>
                        <FiChevronDown className="text-gray-400 text-sm shrink-0" />

                        {/* Profile Dropdown positioned above */}
                        {isProfileDropdownOpen && (
                            <div className="absolute left-0 bottom-full mb-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
                                <div className="py-1">
                                    <button onClick={(e) => { e.stopPropagation(); navigate('/profile'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#D48D2A] flex items-center gap-2">
                                        <FiUser className="text-lg" /> Profile Settings
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); logout(); navigate('/login'); }} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <FiLogOut className="text-lg" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Premium Card */}
                    <div className="bg-[#FFF8F0] border border-[#F2E8DB] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#FFF4E5] transition-colors mb-6 shadow-sm" onClick={() => setActiveTab('subscription')}>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D48D2A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-[#D48D2A]">Premium Member</p>
                                <p className="text-[9px] font-medium text-gray-500">Access exclusive features</p>
                            </div>
                        </div>
                        <FiChevronDown className="text-[#D48D2A] text-sm -rotate-90" />
                    </div>

                    <p className="text-[10px] text-gray-400 font-bold tracking-wider leading-relaxed px-2">
                        © 2026 OTULIA <br /> All rights reserved.
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
                        {activeTab === 'dashboard' && (
                            <>
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
                            </>
                        )}

                        {/* Icons Section */}
                        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                            <div className="relative">
                                <button
                                    onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all focus:outline-none"
                                >
                                    <FiBell className="text-gray-400 text-lg" />
                                    {data?.notifications?.length > 0 && (
                                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[9px] text-white font-bold flex items-center justify-center">
                                            {data.notifications.length}
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
                                            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-widest">Recent Notifications</h4>
                                            <span className="text-[10px] font-bold text-[#D48D2A]">{data?.notifications?.length || 0} New</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto custom-scrollbar">
                                            {(!data?.notifications || data.notifications.length === 0) ? (
                                                <div className="py-8 px-4 text-center">
                                                    <FiBell className="mx-auto text-gray-200 text-3xl mb-2" />
                                                    <p className="text-xs text-gray-400 font-medium">No new lead notifications</p>
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
                                                                <p className="text-xs font-bold text-gray-900 leading-tight mb-1">{notif.message}</p>
                                                                <p className="text-[10px] text-gray-400 font-medium">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Click to view</p>
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
                                                    className="text-[10px] font-bold text-gray-400 hover:text-[#D48D2A] uppercase tracking-widest transition-colors"
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
                <main className={`p-8 pt-6 h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar ${activeTab === 'dashboard' ? 'overflow-hidden' : ''}`}>

                    {/* DASHBOARD TAB */}
                    {activeTab === 'dashboard' && (
                        <div className="h-full flex flex-col gap-4 animate-in fade-in duration-700 pb-2">
                            {/* Header Row */}
                            <div className="flex justify-between items-end shrink-0 mb-0">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-400 font-medium mb-0 leading-tight">Welcome back, <span className="text-gray-900 canela font-bold">{user?.name?.split(' ')[0] || user?.name || 'Md Riyaz'}</span> 👋</h2>
                                </div>
                            </div>

                            {/* Top 4 KPI Cards */}
                            <div className="grid grid-cols-4 gap-5 shrink-0 h-[105px]">
                                {/* Card 1 */}
                                <div className="bg-white rounded-2xl p-4 px-5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                                    <div className="flex justify-between items-start z-10 w-full hover:-translate-y-0.5 transition-transform">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Total Views</span>
                                            <span className="text-[28px] font-medium text-gray-900 leading-none mt-1.5 tracking-tight">{numberWithCommas(data?.stats?.totalViews || 2456)}</span>
                                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1.5"><FiTrendingUp className="text-[11px]" /> 12.5% <span className="text-gray-400 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0"><FiEye className="text-[18px]" /></div>
                                    </div>
                                    <svg className="absolute bottom-0 left-0 w-full h-[35px] select-none pointer-events-none opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0,15 L10,12 L20,18 L30,8 L40,14 L50,6 L60,12 L70,4 L80,10 L90,2 L100,6" fill="none" stroke="#D48D2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {/* Card 2 */}
                                <div className="bg-white rounded-2xl p-4 px-5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                                    <div className="flex justify-between items-start z-10 w-full hover:-translate-y-0.5 transition-transform">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Total Leads</span>
                                            <span className="text-[28px] font-medium text-gray-900 leading-none mt-1.5 tracking-tight">{numberWithCommas(data?.stats?.totalLeads || 142)}</span>
                                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1.5"><FiTrendingUp className="text-[11px]" /> 8.2% <span className="text-gray-400 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 justify-center flex items-center shrink-0"><FiUser className="text-[18px]" /></div>
                                    </div>
                                    <svg className="absolute bottom-0 left-0 w-full h-[35px] select-none pointer-events-none opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0,12 L10,15 L20,5 L30,10 L40,4 L50,12 L60,3 L70,8 L80,2 L90,6 L100,4" fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {/* Card 3 */}
                                <div className="bg-white rounded-2xl p-4 px-5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                                    <div className="flex justify-between items-start z-10 w-full hover:-translate-y-0.5 transition-transform">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Saved / Shortlisted</span>
                                            <span className="text-[28px] font-medium text-gray-900 leading-none mt-1.5 tracking-tight">{data?.stats?.savedCount || 48}</span>
                                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1.5"><FiTrendingUp className="text-[11px]" /> 5.1% <span className="text-gray-400 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 justify-center flex items-center shrink-0"><FiHeart className="text-[18px]" /></div>
                                    </div>
                                    <svg className="absolute bottom-0 left-0 w-full h-[35px] select-none pointer-events-none opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0,18 L15,10 L30,14 L45,6 L60,16 L75,8 L90,4 L100,6" fill="none" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                {/* Card 4 */}
                                <div className="bg-white rounded-2xl p-4 px-5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden group">
                                    <div className="flex justify-between items-start z-10 w-full hover:-translate-y-0.5 transition-transform">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF]">Est. Lead Value</span>
                                            <span className="text-[28px] font-medium text-gray-900 leading-none mt-1.5 tracking-tight">${((data?.stats?.estLeadValue || 2450000)/1000000).toFixed(2)}M</span>
                                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-1.5"><FiTrendingUp className="text-[11px]" /> 15.3% <span className="text-gray-400 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 justify-center flex items-center shrink-0"><FiTrendingUp className="text-[18px]" /></div>
                                    </div>
                                    <svg className="absolute bottom-0 left-0 w-full h-[35px] select-none pointer-events-none opacity-80" viewBox="0 0 100 20" preserveAspectRatio="none">
                                        <path d="M0,15 L20,10 L40,6 L60,4 L80,2 L100,5" fill="none" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>

                            {/* Middle Row (Flex-1 for expansion) */}
                            <div className="flex flex-[1.1] gap-5 min-h-[240px]">
                                {/* Left Line Chart */}
                                <div className="flex-[2] bg-white rounded-2xl p-5 flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-2 shrink-0 relative z-10">
                                        <div className="flex flex-col gap-2">
                                            <h4 className="text-[16px] font-bold text-gray-900 canela tracking-wide leading-none">Views vs Leads Over Time</h4>
                                            <div className="flex gap-4">
                                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 rounded-full bg-[#D48D2A]"></div><span className="text-[9px] font-bold text-gray-500 capitalize">Views</span></div>
                                                <div className="flex items-center gap-1.5"><div className="w-2.5 h-0.5 rounded-full bg-[#1E3B70]"></div><span className="text-[9px] font-bold text-gray-500 capitalize">Leads</span></div>
                                            </div>
                                        </div>
                                        <div className="border border-gray-200 rounded-lg px-3 py-1 flex items-center gap-1 text-[11px] font-bold text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
                                            Week <FiChevronDown className="text-[12px]"/>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 relative mt-[1px] min-h-0 w-full">
                                        <div className="absolute inset-0 pb-6 pl-8 flex flex-col justify-between border-b border-gray-50 pointer-events-none pr-2">
                                            {[300, 225, 150, 75, 0].map((val, i) => (
                                                <div key={i} className="w-full border-t border-gray-50 flex items-center h-0 relative">
                                                    <span className="absolute -left-[30px] text-[10px] text-gray-400 font-medium w-[24px] text-right mt-0 bg-white leading-none">{val}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 pl-10 pr-4 h-6 flex justify-between items-end text-[10px] font-medium text-gray-400 pb-1">
                                            <span>24 Apr</span><span>27 Apr</span><span>30 Apr</span><span>03 May</span><span>06 May</span><span>09 May</span><span>12 May</span><span>15 May</span><span>21 May</span>
                                        </div>
                                        <div className="absolute inset-0 pb-6 pl-10 pr-4 mt-2">
                                            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                                                <path d="M0,70 L12.5,45 L25,48 L37.5,30 L50,50 L62.5,40 L75,55 L87.5,45 L100,50" fill="none" stroke="#D48D2A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                {[0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map((cx, i) => <circle key={`o-${i}`} cx={cx} cy={[70,45,48,30,50,40,55,45,50][i]} r="2.5" fill="#D48D2A" stroke="white" strokeWidth="1"/>)}
                                                
                                                <path d="M0,90 L12.5,85 L25,65 L37.5,70 L50,85 L62.5,75 L75,85 L87.5,80 L100,82" fill="none" stroke="#1E3B70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                {[0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100].map((cx, i) => <circle key={`b-${i}`} cx={cx} cy={[90,85,65,70,85,75,85,80,82][i]} r="2.5" fill="#1E3B70" stroke="white" strokeWidth="1"/>)}
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Donut */}
                                <div className="flex-1 bg-white rounded-2xl p-5 flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] min-w-[320px]">
                                    <h4 className="text-[16px] font-bold text-gray-900 canela tracking-wide mb-3 shrink-0">Leads by Asset Category</h4>
                                    <div className="flex-1 flex items-center justify-between min-h-0 pl-1 pr-3">
                                        <div className="w-[140px] h-full flex items-center justify-center relative shrink-0">
                                            <svg viewBox="0 0 100 100" className="w-[125%] transform -rotate-90">
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#F3F4F6" strokeWidth="14" />
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#D48D2A" strokeWidth="14" strokeDasharray="238.7" strokeDashoffset={238.7 * (1 - 0.472)} />
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#1E3B70" strokeWidth="14" strokeDasharray="238.7" strokeDashoffset={238.7 * (1 - 0.317)} style={{strokeDashoffset: 238.7 * (1 - 0.317) + 238.7 * (1 - 0.472)}}/>
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" strokeWidth="14" strokeDasharray="238.7" strokeDashoffset={238.7 * (1 - 0.155)} style={{strokeDashoffset: 238.7 * (1 - 0.155) + 238.7 * (1 - (0.472+0.317))}}/>
                                                <circle cx="50" cy="50" r="38" fill="none" stroke="#9CA3AF" strokeWidth="14" strokeDasharray="238.7" strokeDashoffset={238.7 * (1 - 0.056)} style={{strokeDashoffset: 238.7 * (1 - 0.056) + 238.7 * (1 - (0.472+0.317+0.155))}}/>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-1">
                                                <span className="text-[26px] font-medium text-gray-900 leading-none">{data?.stats?.totalLeads || 142}</span>
                                                <span className="text-[9px] capitalize text-gray-500 font-medium tracking-wide mt-1">Total Leads</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center gap-3 pl-4 flex-1">
                                            {[ 
                                                {n:'Cars', v: 67, p:'47.2%', c:'#D48D2A'}, 
                                                {n:'Yachts', v: 45, p:'31.7%', c:'#1E3B70'},
                                                {n:'Real Estate', v: 22, p:'15.5%', c:'#10B981'},
                                                {n:'Others', v: 8, p:'5.6%', c:'#9CA3AF'}
                                            ].map((r,i) => (
                                                <div key={i} className="flex items-center justify-between text-[11px] font-bold text-gray-600">
                                                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor:r.c}}></span>{r.n}</span>
                                                    <span className="text-gray-900 truncate pl-1 flex gap-1.5"><span className="w-4 text-right">{r.v}</span> <span className="text-gray-400 font-medium w-10 text-right">({r.p})</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-2 shrink-0">
                                        <button onClick={() => setActiveTab('analytics')} className="text-[11px] font-black text-gray-500 border border-gray-200 shadow-sm px-4 py-1.5 rounded-[10px] transition-colors flex items-center gap-1.5 hover:bg-gray-50 tracking-wide hover:text-gray-900">View Full Report <FiChevronRight/></button>
                                    </div>
                                </div>
                            </div>

                            {/* Third Row */}
                            <div className="flex gap-5 flex-1 min-h-[190px]">
                                {/* Top Assets Table */}
                                <div className="flex-1 min-w-0 bg-white rounded-2xl p-4 flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-[15px] font-bold text-gray-900 canela tracking-wide leading-none">Top Performing Assets</h4>
                                        <button onClick={() => setActiveTab('inventory')} className="text-[10px] font-bold text-gray-500 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] bg-white px-2.5 py-1 rounded-[8px] transition-colors hover:bg-gray-50 whitespace-nowrap">View all</button>
                                    </div>
                                    <div className="flex-1 overflow-auto custom-scrollbar pr-1 -mx-2 px-2">
                                        <table className="w-full text-left table-fixed">
                                            <thead className="sticky top-0 bg-white z-10 w-full">
                                                <tr>
                                                    <th className="pb-2 pt-1 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 w-6/12">Asset</th>
                                                    <th className="pb-2 pt-1 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 w-3/12 text-center">Views</th>
                                                    <th className="pb-2 pt-1 text-[9px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 w-3/12 text-right pr-2">Change</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50 text-[11px] font-bold text-gray-600">
                                                {[
                                                    {n: 'Ferrari SF90', v: 892, c: '↗ 18.2%', im: ''},
                                                    {n: 'Sunseeker 88 Yacht', v: 673, c: '↗ 12.8%', im: ''},
                                                    {n: 'Dubai Marina Penthouse', v: 512, c: '↗ 9.4%', im: ''}
                                                ].map((item, i) => (
                                                    <tr key={i} className="hover:bg-gray-50/50">
                                                        <td className="py-2.5 flex items-center gap-3 truncate">
                                                            <div className="w-10 h-8 rounded-lg object-cover shadow-[0_2px_5px_rgba(0,0,0,0.1)] shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
                                                                <FiImage className="text-gray-300 transform scale-125"/>
                                                            </div>
                                                            <span className="text-gray-900 truncate overflow-hidden whitespace-nowrap text-[12px] font-medium">{item.n}</span>
                                                        </td>
                                                        <td className="py-2.5 text-center text-gray-900 font-bold">{item.v}</td>
                                                        <td className="py-2.5 text-right text-emerald-500 font-bold tracking-tight pr-2">{item.c}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                {/* Leads Source Donut */}
                                <div className="flex-1 min-w-0 bg-white rounded-2xl p-4 flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-0">
                                        <h4 className="text-[15px] font-bold text-gray-900 canela tracking-wide leading-none">Leads Source</h4>
                                        <button onClick={() => setActiveTab('analytics')} className="text-[10px] font-bold text-gray-500 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] bg-white px-2.5 py-1 rounded-[8px] transition-colors hover:bg-gray-50 whitespace-nowrap">View all</button>
                                    </div>
                                    <div className="flex-1 flex items-center justify-between z-10 px-0 mt-3 -ml-1">
                                        <div className="w-1/2 h-full flex items-center justify-center relative pb-3 -ml-2">
                                            <svg viewBox="0 0 100 100" className="w-[115%] transform -rotate-90">
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#F3F4F6" strokeWidth="20" />
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#D48D2A" strokeWidth="20" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - 0.437)} />
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#1E3B70" strokeWidth="20" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - 0.338)} style={{strokeDashoffset: 219.9 * (1 - 0.338) + 219.9 * (1 - 0.437)}}/>
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - 0.155)} style={{strokeDashoffset: 219.9 * (1 - 0.155) + 219.9 * (1 - (0.437+0.338))}}/>
                                                <circle cx="50" cy="50" r="35" fill="none" stroke="#8B5CF6" strokeWidth="20" strokeDasharray="219.9" strokeDashoffset={219.9 * (1 - 0.07)} style={{strokeDashoffset: 219.9 * (1 - 0.07) + 219.9 * (1 - (0.437+0.338+0.155))}}/>
                                            </svg>
                                        </div>
                                        <div className="w-1/2 flex flex-col justify-center gap-2.5 pl-3 z-10 pb-2">
                                            {[
                                                {n:'Direct', v: 62, p:'43.7%', c:'#D48D2A'}, 
                                                {n:'Website', v: 48, p:'33.8%', c:'#1E3B70'}, 
                                                {n:'Public Marketplace', v: 22, p:'15.5%', c:'#10B981'}, 
                                                {n:'Social Media', v: 10, p:'7.0%', c:'#8B5CF6'}, 
                                                {n:'Others', v: 0, p:'0%', c:'#9CA3AF'}
                                            ].map((r,i) => (
                                                <div key={i} className="flex items-center justify-between text-[10px] font-bold text-gray-600 w-[140px]">
                                                    <span className="flex items-center gap-2 truncate mr-1" title={r.n}><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{backgroundColor:r.c}}></span><span className="truncate">{r.n}</span></span>
                                                    <span className="text-gray-900 text-right flex shrink-0 whitespace-nowrap"><span className="w-[16px]">{r.v}</span> <span className="text-gray-400 font-medium w-[32px] tracking-tight text-right">({r.p})</span></span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Conversion Rate Bars */}
                                <div className="flex-[1.2] min-w-0 bg-white rounded-2xl p-4 px-5 flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start mb-2 shrink-0">
                                        <div className="flex flex-col">
                                            <h4 className="text-[15px] font-bold text-gray-900 canela tracking-wide leading-none">Conversion Rate</h4>
                                            <span className="text-[32px] font-medium text-gray-900 mt-2 tracking-tight leading-none">5.8%</span>
                                            <span className="text-[10px] font-bold text-emerald-500 mt-2 flex items-center gap-1"><FiTrendingUp className="text-[11px]"/> 2.3% <span className="text-gray-400 font-medium">vs last 30 days</span></span>
                                        </div>
                                        <div className="border border-gray-200 rounded-lg px-2.5 py-1.5 flex items-center gap-1 text-[10px] font-bold text-gray-600 shadow-sm cursor-pointer hover:bg-gray-50">
                                            Week <FiChevronDown className="text-[12px]"/>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between px-1 mt-1 relative min-h-0">
                                        {/* Axes */}
                                        <div className="absolute inset-y-0 left-0 flex flex-col justify-between pt-1 pb-[18px] text-[9px] text-gray-400 font-medium z-10 w-4 pr-1 text-right">
                                            <span>9%</span><span>6%</span><span>3%</span><span>0%</span>
                                        </div>
                                        {/* Bars Container */}
                                        <div className="flex-1 flex justify-between items-end h-full ml-6 pb-5 pt-3">
                                            {[40, 40, 50, 48, 85, 50].map((h, i) => (
                                                <div key={i} className="flex flex-col items-center justify-end h-full group cursor-default relative w-full px-1.5">
                                                    {i === 4 && (
                                                        <div className="absolute -top-6 bg-gray-900 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow-md z-20 tooltip-arrow">5.8%</div>
                                                    )}
                                                    <div className={`w-3.5 rounded-t group-hover:bg-gray-800 transition-colors relative z-10 ${i === 4 ? 'bg-gray-900' : 'bg-[#D48D2A]'}`} style={{height: `${h}%`}}></div>
                                                </div>
                                            ))}
                                        </div>
                                        {/* X Axis */}
                                        <div className="absolute inset-x-0 bottom-0 flex justify-between ml-[32px] text-[9px] font-medium text-gray-400 pb-0.5 pointer-events-none pr-1">
                                            <span>24 Apr</span><span>01 May</span><span>08 May</span><span>15 May</span><span>21 May</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fourth Row */}
                            <div className="flex gap-5 flex-[0.8] min-h-[140px] shrink-0">
                                <div className="flex-[2] min-w-0 bg-white rounded-2xl p-4 px-5 flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] justify-between h-full relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-1 pb-1">
                                        <h4 className="text-[16px] font-bold text-gray-900 canela tracking-wide leading-none mt-1">Recent Activity</h4>
                                        <button onClick={() => setActiveTab('inventory')} className="text-[10px] font-bold text-gray-500 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] bg-white px-3 py-1.5 rounded-[8px] transition-colors hover:bg-gray-50 uppercase tracking-widest whitespace-nowrap mt-1">View all activity</button>
                                    </div>
                                    <div className="space-y-[8px] flex-1 overflow-auto custom-scrollbar pr-2 mt-2">
                                        {[
                                            {m: 'New view on Ferrari SF90', icon: FiEye, t: '2 minutes ago'},
                                            {m: <span>New lead from <strong>Website</strong></span>, icon: FiUser, t: '15 minutes ago'},
                                            {m: <span>Asset <strong>Sunseeker 88 Yacht</strong> shortlisted</span>, icon: FiHeart, t: '1 hour ago'}
                                        ].map((notif, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-[12px] group hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors">
                                                <div className="flex items-center gap-3 text-gray-600 truncate"><notif.icon className="text-[#D48D2A] shrink-0 text-[14px]"/> <span className="font-normal text-gray-800 truncate">{notif.m}</span></div>
                                                <span className="text-gray-400 font-medium shrink-0 ml-2">{notif.t}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex-[1.1] min-w-0 bg-white rounded-2xl p-4 px-5 flex flex-col border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] justify-between h-full relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-1 pb-1 mt-1">
                                        <h4 className="text-[16px] font-bold text-gray-900 canela tracking-wide leading-none">Assets Overview</h4>
                                        <button onClick={() => setActiveTab('inventory')} className="text-[10px] font-bold text-gray-500 border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.05)] bg-white px-3 py-1.5 rounded-[8px] transition-colors hover:bg-gray-50 uppercase whitespace-nowrap">Manage Assets</button>
                                    </div>
                                    <div className="flex justify-between items-start mt-4 px-1 pb-2">
                                        <div className="flex flex-col text-left flex-1 border-r border-gray-100 pr-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1.5 whitespace-nowrap">Total Assets</span>
                                            <span className="text-[26px] font-medium text-gray-900 leading-none">25</span>
                                            <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 mt-2 tracking-tight"><FiTrendingUp className="text-[10px]" /> 3 new</span>
                                        </div>
                                        <div className="flex flex-col text-left flex-1 pl-4 border-r border-gray-100 pr-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1.5 whitespace-nowrap">Live Assets</span>
                                            <span className="text-[26px] font-medium text-gray-900 leading-none mt-2">18</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-3.5 shadow-sm shadow-emerald-500/20"></div>
                                        </div>
                                        <div className="flex flex-col text-left flex-[0.8] pl-4 border-r border-gray-100 pr-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1.5">Drafts</span>
                                            <span className="text-[26px] font-medium text-gray-900 leading-none mt-2">4</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#D48D2A] mt-3.5 shadow-sm shadow-[#D48D2A]/20"></div>
                                        </div>
                                        <div className="flex flex-col text-left flex-[0.8] pl-4">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] mb-1.5">Sold</span>
                                            <span className="text-[26px] font-medium text-gray-900 leading-none mt-2">3</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-3.5 border border-gray-200"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* INVENTORY TAB */}
                    {activeTab === 'inventory' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                            {/* Control Bar */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6">
                                <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
                                    <div className="relative flex-1 md:max-w-xs">
                                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input type="text" placeholder="Search assets..." className="w-full bg-gray-50 border border-transparent rounded-[1.25rem] py-3 pl-11 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-[#D48D2A] focus:ring-0 transition-all outline-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={inventoryCategoryFilter}
                                            onChange={(e) => setInventoryCategoryFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 border border-transparent rounded-[1.25rem] py-3 pl-5 pr-10 text-sm font-bold text-gray-600 focus:bg-white focus:border-[#D48D2A] cursor-pointer outline-none transition-all"
                                        >
                                            <option>All Categories</option>
                                            <option>Cars</option>
                                            <option>Yachts</option>
                                            <option>Real Estate</option>
                                            <option>Bikes</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    <div className="relative">
                                        <select
                                            value={inventoryStatusFilter}
                                            onChange={(e) => setInventoryStatusFilter(e.target.value)}
                                            className="appearance-none bg-gray-50 border border-transparent rounded-[1.25rem] py-3 pl-5 pr-10 text-sm font-bold text-gray-600 focus:bg-white focus:border-[#D48D2A] cursor-pointer outline-none transition-all"
                                        >
                                            <option>All Status</option>
                                            <option>Active</option>
                                            <option>Draft</option>
                                            <option>Sold</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
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
                                    className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap ${isVerifiedDealer
                                        ? 'bg-gray-900 text-white hover:bg-black shadow-[0_2px_10px_rgba(0,0,0,0.1)]'
                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300'
                                        }`}
                                >
                                    <FiPlus className="text-base" /> Add New Asset
                                    {!isVerifiedDealer && <FiLock className="text-xs ml-1" />}
                                </button>
                            </div>

                            {/* Asset Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                { (() => {
                                    const filtered = (data.inventory || []).filter(item => {
                                        const matchesCategory = inventoryCategoryFilter === 'All Categories' ||
                                            ((item.category === 'CarAsset' || item.category === 'vehicles') && inventoryCategoryFilter === 'Cars') ||
                                            ((item.category === 'YachtAsset' || item.category === 'yachts') && inventoryCategoryFilter === 'Yachts') ||
                                            ((item.category === 'EstateAsset' || item.category === 'estates') && inventoryCategoryFilter === 'Real Estate') ||
                                            ((item.category === 'BikeAsset' || item.category === 'bikes') && inventoryCategoryFilter === 'Bikes');
        
                                        const matchesStatus = inventoryStatusFilter === 'All Status' ||
                                            (inventoryStatusFilter === 'Active' && item.status === 'Active') ||
                                            item.status === inventoryStatusFilter;
        
                                        return matchesCategory && matchesStatus;
                                    });
                                    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
                                    return paginated.map((item) => {
                                    const categoryName = (item.category === 'CarAsset' || item.category === 'vehicles') ? 'CARS' :
                                        (item.category === 'YachtAsset' || item.category === 'yachts') ? 'YACHTS' :
                                        (item.category === 'BikeAsset' || item.category === 'bikes') ? 'BIKES' :
                                            (item.category === 'EstateAsset' || item.category === 'estates') ? 'REAL ESTATE' :
                                                item.category?.replace('Asset', 'S')?.toUpperCase() || 'ASSET';

                                    return (
                                        <div key={item.id} className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] overflow-hidden group hover:border-[#D48D2A]/30 transition-all flex flex-col">
                                            {/* Card Image Header */}
                                            <div className="relative h-48 bg-gray-100 w-full overflow-hidden">
                                                <img src={item.images?.[0] || '/assets/placeholder.jpg'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
                                                <div className="absolute top-4 left-4">
                                                    <span className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{item.type || 'SALE'}</span>
                                                </div>
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    <button className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-gray-900 hover:bg-white transition-colors shadow-sm">
                                                        <FiMoreVertical className="text-sm" />
                                                    </button>
                                                </div>
                                            </div>
                                            
                                            {/* Card Body */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <p className="text-[10px] text-[#D48D2A] uppercase font-black tracking-widest mb-1">{categoryName}</p>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate canela" title={item.propertyName || item.yachtName || item.name || item.title || `${item.make || ''} ${item.model || ''}`.trim()}>{item.propertyName || item.yachtName || item.name || item.title || `${item.make || ''} ${item.model || ''}`.trim() || 'Unnamed Asset'}</h3>
                                                <div className="flex justify-between items-end mb-5">
                                                    <p className="text-xl font-black text-gray-900">${numberWithCommas(item.price)}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Value</p>
                                                </div>
                                                
                                                <div className="border-t border-gray-100/80 py-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full shadow-inner">
                                                        <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`}></div>
                                                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{item.status === 'Active' ? 'Live' : item.status}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-gray-400 text-xs font-bold">
                                                        <span className="flex items-center gap-1.5"><FiEye className="text-[#D48D2A]" /> {item.views || 0}</span>
                                                        <span className="flex items-center gap-1.5"><FiUsers className="text-[#D48D2A]" /> {item.leads || 0}</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="border-t border-gray-100/80 py-4 flex items-center justify-between mt-auto">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                                                        Public <FiActivity className="inline text-gray-400 ml-0.5" />
                                                    </div>
                                                    <div
                                                        onClick={() => handleTogglePublic(item)}
                                                        className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${item.status === 'Active' ? 'bg-emerald-500 border border-emerald-600' : 'bg-gray-200 border border-gray-300'}`}
                                                    >
                                                        {updatingId === item.id ? (
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                            </div>
                                                        ) : (
                                                            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${item.status === 'Active' ? 'left-6' : 'left-0.5'}`}></div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="border-t border-gray-100/80 pt-4 flex items-center justify-between gap-4">
                                                    <button onClick={() => { setEditingItem(item); setIsAddModalOpen(true); }} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors py-2 bg-gray-50 hover:bg-gray-100 rounded-xl">
                                                        <FiEdit2 /> Edit
                                                    </button>
                                                    <button onClick={() => confirmDelete(item.id)} className="flex-1 flex items-center justify-center gap-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors py-2 bg-gray-50 hover:bg-red-50 rounded-xl">
                                                        <FiTrash2 /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }); })()}
                            </div>

                            {/* Dynamic Pagination */}
                            {(() => {
                                const filtered = (data.inventory || []).filter(item => {
                                    const matchesCategory = inventoryCategoryFilter === 'All Categories' ||
                                        ((item.category === 'CarAsset' || item.category === 'vehicles') && inventoryCategoryFilter === 'Cars') ||
                                        ((item.category === 'YachtAsset' || item.category === 'yachts') && inventoryCategoryFilter === 'Yachts') ||
                                        ((item.category === 'EstateAsset' || item.category === 'estates') && inventoryCategoryFilter === 'Real Estate') ||
                                        ((item.category === 'BikeAsset' || item.category === 'bikes') && inventoryCategoryFilter === 'Bikes');
    
                                    const matchesStatus = inventoryStatusFilter === 'All Status' ||
                                        (inventoryStatusFilter === 'Active' && item.status === 'Active') ||
                                        item.status === inventoryStatusFilter;
    
                                    return matchesCategory && matchesStatus;
                                });
                                const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
                                
                                return (
                                    <div className="flex justify-between items-center py-6 mt-4 border-t border-gray-100 relative">
                                        <div className="w-1/3"></div>
                                        <div className="flex items-center gap-1.5 justify-center w-1/3">
                                            <button 
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                &lt;
                                            </button>
                                            
                                            {Array.from({ length: totalPages }).map((_, i) => {
                                                const p = i + 1;
                                                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                                                    return (
                                                        <button 
                                                            key={p} 
                                                            onClick={() => setCurrentPage(p)}
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${currentPage === p ? 'text-[#D48D2A] bg-[#FFF8F0] border border-[#F2E8DB] shadow-sm' : 'text-gray-500 hover:text-gray-900 border border-transparent'}`}
                                                        >
                                                            {p}
                                                        </button>
                                                    );
                                                } else if (p === currentPage - 2 || p === currentPage + 2) {
                                                    return <span key={p} className="text-gray-300 font-bold px-1 text-xs">...</span>;
                                                }
                                                return null;
                                            })}
                                            
                                            <button 
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                            >
                                                &gt;
                                            </button>
                                        </div>
                                        
                                        <div className="flex items-center justify-end w-1/3 relative z-10">
                                            <div className="relative">
                                                <select 
                                                    value={itemsPerPage} 
                                                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                                    className="appearance-none bg-white border border-gray-200 rounded-xl py-2 pl-4 pr-10 text-[11px] font-bold text-gray-600 focus:outline-none hover:border-gray-300 shadow-sm cursor-pointer"
                                                >
                                                    <option value={10}>10 per page</option>
                                                    <option value={20}>20 per page</option>
                                                    <option value={50}>50 per page</option>
                                                </select>
                                                <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* LEADS TAB */}
                    {activeTab === 'leads' && (
                        <div className="h-[calc(100vh-6rem-5rem)] flex flex-col gap-4 animate-in fade-in duration-700 pb-2">
                            {/* Header Row with Date Dropdown and Buttons */}
                            <div className="flex justify-between items-end shrink-0 mb-1">
                                <div className="flex items-center gap-2 text-[11px] font-bold text-gray-700 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 cursor-pointer shadow-sm">
                                    <FiCalendar className="text-gray-400" /> Last 30 days <FiChevronDown className="ml-1 text-gray-400" />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setIsAddLeadModalOpen(true)} className="px-5 py-2 rounded-xl text-[11px] font-bold bg-gray-900 text-white shadow-sm flex items-center gap-2 hover:opacity-90 transition-opacity"><FiPlus className="text-white"/> Add Lead</button>
                                    <button onClick={handleExportCSV} className="px-5 py-2 rounded-xl text-[11px] font-bold border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 flex items-center gap-2 transition-colors">Export</button>
                                </div>
                            </div>

                            {/* 4 KPI Cards */}
                            <div className="grid grid-cols-4 gap-4 shrink-0 h-[85px]">
                                {/* Total Leads */}
                                <div className="bg-white rounded-[1rem] p-3.5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Total Leads</span>
                                            <span className="text-2xl font-bold text-gray-900 canela leading-none mt-1">{numberWithCommas(data?.stats?.totalLeads || 0)}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0 border border-[#F2E8DB]"><FiUsers className="text-sm" /></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-auto tracking-wide"><FiTrendingUp className="text-[10px]" /> 8.2% <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span></span>
                                </div>
                                {/* New Leads */}
                                <div className="bg-white rounded-[1rem] p-3.5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">New Leads</span>
                                            <span className="text-2xl font-bold text-gray-900 canela leading-none mt-1">{(data?.leads || []).filter(l=>l.status==='New').length}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-[#FFF8F0] justify-center text-[#D48D2A] flex items-center shrink-0 border border-[#F2E8DB]"><FiUser className="text-sm" /></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-auto tracking-wide"><FiTrendingUp className="text-[10px]" /> 12.5% <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span></span>
                                </div>
                                {/* Qualified Leads */}
                                <div className="bg-white rounded-[1rem] p-3.5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Qualified Leads</span>
                                            <span className="text-2xl font-bold text-gray-900 canela leading-none mt-1">{(data?.leads || []).filter(l=>l.status==='Qualified').length}</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-emerald-50 justify-center text-emerald-600 flex items-center shrink-0 border border-emerald-100"><FiCheckCircle className="text-sm" /></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-auto tracking-wide"><FiTrendingUp className="text-[10px]" /> 6.1% <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span></span>
                                </div>
                                {/* Conversion Rate */}
                                <div className="bg-white rounded-[1rem] p-3.5 flex flex-col justify-between border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                    <div className="flex justify-between items-start">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Conversion Rate</span>
                                            <span className="text-2xl font-bold text-gray-900 canela leading-none mt-1">{data?.stats?.totalViews ? ((data?.stats?.totalLeads / data?.stats?.totalViews) * 100).toFixed(1) : '0.0'}%</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-lg bg-purple-50 justify-center text-purple-600 flex items-center shrink-0 border border-purple-100"><FiActivity className="text-sm" /></div>
                                    </div>
                                    <span className="text-[9px] font-bold text-emerald-500 flex items-center gap-1 mt-auto tracking-wide"><FiTrendingUp className="text-[10px]" /> 3.4% <span className="text-gray-400 font-medium whitespace-nowrap">vs last 30 days</span></span>
                                </div>
                            </div>

                            {/* Filter Bar */}
                            <div className="flex justify-between gap-3 shrink-0 py-2">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FiSearch className="text-gray-400 text-sm" />
                                    </div>
                                    <input
                                        type="text"
                                        value={leadSearchQuery}
                                        onChange={e => setLeadSearchQuery(e.target.value)}
                                        placeholder="Search leads by name, email, phone..."
                                        className="w-full bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-9 pr-4 text-[11px] font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#D48D2A] focus:ring-1 focus:ring-[#D48D2A] transition-all shadow-sm"
                                    />
                                </div>
                                <div className="flex gap-3 shrink-0">
                                    <div className="relative w-[130px]">
                                        <select value={leadStatusFilter} onChange={e => setLeadStatusFilter(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-4 pr-8 text-[11px] font-bold text-gray-600 focus:outline-none cursor-pointer hover:border-gray-300 shadow-sm">
                                            <option value="All Status">All Status</option>
                                            <option value="New">New</option>
                                            <option value="Contacted">Contacted</option>
                                            <option value="Qualified">Qualified</option>
                                            <option value="Proposal Sent">Proposal Sent</option>
                                            <option value="Negotiating">Negotiating</option>
                                            <option value="Closed">Closed</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                    </div>
                                    <div className="relative w-[130px]">
                                        <select value={leadSourceFilter} onChange={e => setLeadSourceFilter(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-4 pr-8 text-[11px] font-bold text-gray-600 focus:outline-none cursor-pointer hover:border-gray-300 shadow-sm">
                                            <option value="All Source">All Source</option>
                                            <option value="Website">Website</option>
                                            <option value="WhatsApp">WhatsApp</option>
                                            <option value="Instagram">Instagram</option>
                                            <option value="Facebook">Facebook</option>
                                            <option value="Email">Email</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                    </div>
                                    <div className="relative w-[130px]">
                                        <select value={leadAssetFilter} onChange={e => setLeadAssetFilter(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-[1rem] py-2.5 pl-4 pr-8 text-[11px] font-bold text-gray-600 focus:outline-none cursor-pointer hover:border-gray-300 shadow-sm">
                                            <option value="All Assets">All Assets</option>
                                            <option value="CarAsset">Cars</option>
                                            <option value="EstateAsset">Real Estate</option>
                                            <option value="YachtAsset">Yachts</option>
                                            <option value="BikeAsset">Bikes</option>
                                        </select>
                                        <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                    </div>
                                    <button className="px-4 py-2.5 rounded-[1rem] border border-gray-200 bg-white text-gray-700 font-bold text-[11px] shadow-sm flex items-center gap-2 hover:bg-gray-50 transition-colors">
                                        <FiFilter className="text-gray-400"/> More Filters
                                    </button>
                                </div>
                            </div>

                            {/* Table Area */}
                            <div className="bg-white rounded-[1.25rem] border border-gray-100 shadow-sm overflow-hidden flex-1 flex flex-col relative">
                                <div className="overflow-auto flex-1 custom-scrollbar">
                                    <table className="w-full text-left table-fixed min-w-[1000px]">
                                        <thead className="sticky top-0 bg-white z-20 border-b border-gray-50 shadow-[0_4px_10px_-4px_rgba(0,0,0,0.02)]">
                                            <tr>
                                                <th className="w-10 px-4 py-3"><input type="checkbox" className="rounded border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A]"/></th>
                                                <th className="w-2/12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">LEAD</th>
                                                <th className="w-[18%] px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">ASSET INTERESTED</th>
                                                <th className="w-2/12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">SOURCE</th>
                                                <th className="w-1/12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">STATUS</th>
                                                <th className="w-1/12 px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">VALUE</th>
                                                <th className="w-[12%] px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">DATE ADDED <FiChevronDown className="inline ml-0.5"/></th>
                                                <th className="w-[18%] px-2 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">MESSAGE</th>
                                                <th className="w-20 px-4 py-3 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-[10px] font-bold">
                                            {(() => {
                                                let leads = (data?.leads || []);
                                                if (leadStatusFilter !== 'All Status') leads = leads.filter(l => l.status === leadStatusFilter);
                                                if (leadSourceFilter !== 'All Source') {
                                                    // Since some have missing sources, check matching string (ignoring case for safety)
                                                    leads = leads.filter(l => {
                                                        const source = l.source || 'Website';
                                                        return source.toLowerCase().includes(leadSourceFilter.toLowerCase());
                                                    });
                                                }
                                                if (leadAssetFilter !== 'All Assets') {
                                                    leads = leads.filter(l => l.category === leadAssetFilter);
                                                }
                                                if (leadSearchQuery) {
                                                    const q = leadSearchQuery.toLowerCase();
                                                    leads = leads.filter(l => (l.buyerName && l.buyerName.toLowerCase().includes(q)) || (l.buyerPhone && l.buyerPhone.toLowerCase().includes(q)) || (l.customerContact && l.customerContact.toLowerCase().includes(q)));
                                                }

                                                if (leads.length === 0) {
                                                    return <tr><td colSpan="9" className="py-8 text-center text-xs text-gray-400">No leads found</td></tr>;
                                                }
                                                return leads.slice(0, 10).map((lead, i) => (
                                                    <tr key={i} className="hover:bg-gray-50/50 group bg-white">
                                                        <td className="px-4 py-2.5"><input type="checkbox" className="rounded border-gray-300 text-[#D48D2A] focus:ring-[#D48D2A]"/></td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden shrink-0"><img src="/assets/placeholder.jpg" className="w-full h-full object-cover"/></div>
                                                                <div className="flex flex-col truncate">
                                                                    <span className="text-gray-900 font-bold truncate">{lead.name}</span>
                                                                    <span className="text-gray-400 font-medium text-[9px] truncate">{lead.email}</span>
                                                                    <span className="text-gray-400 font-medium text-[9px] truncate">{lead.phone}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex items-center gap-2">
                                                                {(() => {
                                                                    const asset = (data?.inventory || []).find(a => a._id === lead.assetId || a.id === lead.assetId);
                                                                    const assetName = asset ? (asset.propertyName || asset.yachtName || asset.name || asset.title || `${asset.make || ''} ${asset.model || ''}`.trim() || 'Unnamed Asset') : 'Unknown Asset';
                                                                    const assetPrice = (lead.assetPrice || asset?.price) ? `$${numberWithCommas(lead.assetPrice || asset?.price)}` : 'Price on request';
                                                                    const assetImage = lead.assetImage || asset?.images?.[0];
                                                                    return (
                                                                        <>
                                                                            <div className="w-8 h-8 rounded shrink-0 bg-gray-100 border border-gray-200/50 overflow-hidden shadow-sm flex items-center justify-center">
                                                                                {assetImage ? <img src={assetImage} className="w-full h-full object-cover"/> : <img src="/assets/placeholder.jpg" className="w-full h-full object-cover opacity-50"/>}
                                                                            </div>
                                                                            <div className="flex flex-col truncate">
                                                                                <span className="text-gray-900 truncate font-bold">{assetName}</span>
                                                                                <span className="text-gray-400 font-medium text-[9px] truncate">{assetPrice}</span>
                                                                            </div>
                                                                        </>
                                                                    );
                                                                })()}
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex flex-col gap-1">
                                                                <span className="flex items-center gap-1.5 text-gray-700 capitalize font-medium"><FiGlobe className="text-[10px]"/> {lead.source || 'Website'}</span>
                                                                <span className="flex items-center gap-1.5 text-emerald-500 font-medium"><FiMessageSquare className="text-[10px]"/> WhatsApp</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${lead.status === 'New' ? 'bg-emerald-50' : lead.status === 'Contacted' ? 'bg-blue-50' : lead.status === 'Qualified' ? 'bg-[#FFF8F0]' : 'bg-purple-50'}`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${lead.status === 'New' ? 'bg-emerald-500' : lead.status === 'Contacted' ? 'bg-blue-500' : lead.status === 'Qualified' ? 'bg-[#D48D2A]' : 'bg-purple-500'}`}></div>
                                                                <span className={`text-[10px] font-bold ${lead.status === 'New' ? 'text-emerald-600' : lead.status === 'Contacted' ? 'text-blue-600' : lead.status === 'Qualified' ? 'text-[#D48D2A]' : 'text-purple-600'}`}>{lead.status}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5 text-gray-900 font-black">
                                                            {(lead.assetPrice) ? `$${(lead.assetPrice / 1000000).toFixed(1)}M` : '$6.6M'}
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <div className="flex flex-col text-gray-600">
                                                                <span>{lead.date ? new Date(lead.date).toLocaleDateString() : 'Unknown Date'}</span>
                                                                <span className="text-[9px] text-gray-400 font-medium">{lead.date ? new Date(lead.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 py-2.5">
                                                            <p className="text-[9px] text-gray-500 font-medium line-clamp-2 leading-snug w-full whitespace-normal">
                                                                {lead.message || "I'm interested in this asset. Is it available?"}
                                                            </p>
                                                        </td>
                                                        <td className="px-4 py-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <div className="flex items-center justify-end gap-2 relative">
                                                                <button onClick={() => setViewLead(lead)} className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#D48D2A] hover:bg-[#FFF8F0] transition-colors shadow-sm bg-white"><FiEye className="text-[10px]"/></button>
                                                                <div className="relative">
                                                                    <button onClick={() => setActiveLeadDropdown(activeLeadDropdown === lead.id ? null : lead.id)} className={`w-6 h-6 flex items-center justify-center rounded transition-colors ${activeLeadDropdown === lead.id ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-900'}`}><FiMoreVertical/></button>
                                                                    {activeLeadDropdown === lead.id && (
                                                                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 py-1 z-[100]">
                                                                            {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiating', 'Closed'].map(s => (
                                                                                <button key={s} onClick={() => { handleStatusChange(lead.id, s, lead.isActivity); setActiveLeadDropdown(null); }} className={`w-full text-left px-4 py-1.5 text-[10px] font-bold ${lead.status === s ? 'text-[#D48D2A] bg-[#FFF8F0]' : 'text-gray-600 hover:bg-gray-50'}`}>{s}</button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ));
                                            })()}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination Base */}
                                <div className="h-10 border-t border-gray-100 flex justify-between items-center px-4 shrink-0 bg-white">
                                    <span className="text-[10px] font-bold text-gray-400">Showing 1 to 5 of {(data?.leads || []).length} leads</span>
                                    <div className="flex items-center gap-1.5 justify-center">
                                        <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">&lt;</button>
                                        <button className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-[#D48D2A] bg-[#FFF8F0] border border-[#F2E8DB] shadow-sm">1</button>
                                        <button className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-gray-500 hover:text-gray-900 border border-transparent">2</button>
                                        <button className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-gray-500 hover:text-gray-900 border border-transparent">3</button>
                                        <span className="text-gray-300 font-bold px-1 text-[10px]">...</span>
                                        <button className="w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] text-gray-500 hover:text-gray-900 border border-transparent">29</button>
                                        <button className="w-6 h-6 rounded flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors">&gt;</button>
                                    </div>
                                    <div className="relative">
                                        <select className="appearance-none bg-white border border-gray-200 rounded-lg py-1 pl-3 pr-8 text-[10px] font-bold text-gray-600 focus:outline-none hover:border-gray-300 shadow-sm cursor-pointer">
                                            <option>10 per page</option>
                                            <option>20 per page</option>
                                            <option>50 per page</option>
                                        </select>
                                        <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[9px]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS TAB */}
                    {activeTab === 'analytics' && (
                        <div className="h-full max-h-[calc(100vh-9.5rem)] flex flex-col gap-4 animate-in fade-in duration-700">
                            
                            {/* Toolbar */}
                            <div className="flex justify-between items-center shrink-0">
                                <div>
                                    <p className="text-gray-500 font-medium text-xs">Track performance and get actionable insights</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center border border-gray-200 bg-white rounded-[10px] shadow-sm overflow-hidden h-[34px] mr-2">
                                        <div className="flex items-center px-4 border-r border-gray-100 h-full text-[11px] font-bold text-gray-700 cursor-pointer hover:bg-gray-50"><FiCalendar className="mr-2 text-gray-400"/> 24 Apr - 24 May 2026 <FiChevronDown className="ml-2 text-gray-400"/></div>
                                        <div className="flex h-full">
                                            {['7D', '30D', '90D', '1Y'].map(d => (
                                                <button key={d} className={`px-3 text-[10px] font-bold border-r border-gray-100 ${d==='30D'?'bg-[#FFF8F0] text-[#D48D2A]':'bg-white text-gray-500 hover:bg-gray-50'}`}>{d}</button>
                                            ))}
                                            <button className="px-3 text-[10px] font-bold bg-white text-gray-500 flex items-center hover:bg-gray-50">Custom <FiChevronDown className="ml-1"/></button>
                                        </div>
                                    </div>
                                    <button className="h-[34px] px-4 border border-gray-200 rounded-[10px] text-[11px] font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors"><FiFilter className="text-gray-400"/> Filters</button>
                                    <button className="h-[34px] px-4 border border-[#F2E8DB] rounded-[10px] text-[11px] font-bold text-[#D48D2A] bg-[#FFF8F0] hover:bg-[#faeedd] flex items-center gap-2 shadow-sm transition-colors"><FiDownload /> Export Report</button>
                                </div>
                            </div>
                            
                            {/* KPI Row */}
                            <div className="flex gap-4 shrink-0 h-[100px]">
                                {[
                                    {label: 'TOTAL VIEWS', val: data?.stats?.totalViews ? numberWithCommas(data.stats.totalViews) : '0', chg: '+0.0%', icon: FiEye, col: '#D48D2A', bg: '#FFF8F0'},
                                    {label: 'TOTAL LEADS', val: data?.stats?.totalLeads ? numberWithCommas(data.stats.totalLeads) : '0', chg: '+0.0%', icon: FiUsers, col: '#3B82F6', bg: '#EFF6FF'},
                                    {label: 'CONVERSION RATE', val: data?.stats?.avgConversion ? `${Number(data.stats.avgConversion).toFixed(2)}%` : '0.00%', chg: '+0.0%', icon: FiTrendingUp, col: '#10B981', bg: '#ECFDF5'},
                                    {label: 'AVG LEAD VALUE', val: data?.stats?.estLeadValue ? `$${numberWithCommas(data.stats.estLeadValue)}` : '$0', chg: '+0.0%', icon: FiCreditCard, col: '#8B5CF6', bg: '#F5F3FF'}
                                ].map((kpi, idx) => (
                                    <div key={idx} className="flex-1 bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden group">
                                        <div className="flex justify-between items-start z-10 relative">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{kpi.label}</span>
                                                <span className="text-[28px] font-medium text-gray-900 leading-none mt-1.5 tracking-tight">{kpi.val}</span>
                                            </div>
                                            <div className="w-[34px] h-[34px] rounded-[10px] justify-center flex items-center shrink-0 border border-gray-100 shadow-sm" style={{backgroundColor: kpi.bg, color: kpi.col}}>
                                                <kpi.icon className="text-[15px]" />
                                            </div>
                                        </div>
                                        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 z-10 relative mt-auto tracking-wide"><FiTrendingUp className="text-[11px]" /> {kpi.chg} <span className="text-gray-400 font-medium whitespace-nowrap normal-case text-[9px]">from last 30 days</span></span>
                                        <div className="absolute bottom-0 left-0 right-0 h-[35%] opacity-20 pointer-events-none transition-opacity duration-300 group-hover:opacity-30">
                                            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full fill-current" style={{color: kpi.col}}><path d={idx%2===0?"M0,30 L0,20 Q15,10 30,25 T60,15 T85,25 T100,5 L100,30 Z":"M0,30 L0,15 Q10,25 20,10 T40,15 T60,5 T80,20 T100,10 L100,30 Z"}/></svg>
                                            <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full absolute bottom-0 left-0 outline-none"><path d={idx%2===0?"M0,20 Q15,10 30,25 T60,15 T85,25 T100,5":"M0,15 Q10,25 20,10 T40,15 T60,5 T80,20 T100,10"} fill="none" stroke={kpi.col} strokeWidth="1.5"/></svg>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Middle Row (Trend + Map) */}
                            <div className="flex flex-1 gap-4 min-h-0">
                                {/* Performance Trend */}
                                <div className="flex-[1.5] bg-white rounded-[1.25rem] p-5 pb-3 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden">
                                    <div className="flex justify-between items-center mb-1 z-10 shrink-0">
                                        <h3 className="text-[16px] font-bold text-gray-900 canela">Performance Trend</h3>
                                        <div className="flex items-center gap-8">
                                            <div className="flex items-center gap-5 text-[10px] font-black uppercase tracking-widest text-gray-500">
                                                <div className="flex items-center gap-1.5"><div className="w-[12px] h-[3px] rounded-full bg-[#D48D2A]"></div>VIEWS</div>
                                                <div className="flex items-center gap-1.5"><div className="w-[12px] h-[3px] rounded-full bg-blue-500"></div>LEADS</div>
                                                <div className="flex items-center gap-1.5"><div className="w-[12px] h-[3px] rounded-full bg-emerald-500"></div>CONVERSIONS</div>
                                            </div>
                                            <div className="relative">
                                                <select className="appearance-none bg-white border border-gray-200 rounded-[8px] py-1 pl-3 pr-8 text-[11px] font-bold text-gray-700 shadow-sm cursor-pointer hover:border-gray-300">
                                                    <option>Daily</option>
                                                    <option>Weekly</option>
                                                </select>
                                                <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 min-h-0 relative -ml-2 z-10 pt-1 shrink-0 w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={[
                                                { name: '24 Apr', views: 5000, leads: 2000, conv: 500 },
                                                { name: '28 Apr', views: 10000, leads: 3000, conv: 800 },
                                                { name: '02 May', views: 15000, leads: 2800, conv: 1000 },
                                                { name: '06 May', views: 11000, leads: 3200, conv: 1200 },
                                                { name: '10 May', views: 16000, leads: 2900, conv: 1100 },
                                                { name: '14 May', views: 12000, leads: 3500, conv: 900 },
                                                { name: '18 May', views: 18000, leads: 3800, conv: 1400 },
                                                { name: '22 May', views: 14000, leads: 3100, conv: 1200 },
                                                { name: '24 May', views: 9000, leads: 2500, conv: 800 },
                                            ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 700 }} dy={5} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#9ca3af', fontWeight: 700 }} tickFormatter={val => val>=1000 ? `${val/1000}K` : val} />
                                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '11px', fontWeight: 'bold' }} />
                                                <Area type="monotone" dataKey="views" fill="#FFF8F0" stroke="none" activeDot={false} />
                                                <Line type="monotone" dataKey="views" stroke="#D48D2A" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} activeDot={{ r: 5, strokeWidth: 0 }} />
                                                <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} activeDot={{ r: 5, strokeWidth: 0 }} />
                                                <Line type="monotone" dataKey="conv" stroke="#10B981" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: "#fff" }} activeDot={{ r: 5, strokeWidth: 0 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                    
                                    <div className="flex gap-16 mt-1 pt-3 shrink-0">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Views</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16px] font-medium text-gray-900 leading-none tracking-tight">24,856</span>
                                                <span className="text-[10px] font-bold text-emerald-500 tracking-wide"><FiTrendingUp className="inline -mt-0.5" /> 18.2%</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Leads</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16px] font-medium text-gray-900 leading-none tracking-tight">1,248</span>
                                                <span className="text-[10px] font-bold text-emerald-500 tracking-wide"><FiTrendingUp className="inline -mt-0.5" /> 12.5%</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Conversions</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[16px] font-medium text-gray-900 leading-none tracking-tight">68</span>
                                                <span className="text-[10px] font-bold text-emerald-500 tracking-wide"><FiTrendingUp className="inline -mt-0.5" /> 8.6%</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Conversion Rate</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[15px] font-bold text-gray-900 leading-none">5.48%</span>
                                                <span className="text-[10px] font-bold text-emerald-500 tracking-wide"><FiTrendingUp className="inline -mt-0.5" /> 0.3%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Leads by Location */}
                                <div className="flex-1 bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col min-w-[380px]">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-[16px] font-bold text-gray-900 canela">Leads by Location</h3>
                                        <button className="px-3 py-1.5 text-[10px] rounded-lg border border-gray-200 bg-white flex items-center gap-2 font-bold text-gray-600 hover:bg-gray-50 shadow-sm"><FiMap className="text-gray-400"/> View Map</button>
                                    </div>
                                    
                                    <div className="flex flex-1 overflow-hidden relative gap-6">
                                        {/* Left List */}
                                        <div className="w-[45%] flex flex-col z-10 shrink-0">
                                            <div className="flex justify-between mb-3 text-[9px] font-black uppercase text-gray-400 tracking-widest">
                                                <span>LOCATION</span>
                                                <div className="flex gap-4 pr-1">
                                                    <span className="w-8 text-right">LEADS</span>
                                                    <span className="w-[4.5rem] text-right">PERCENTAGE</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col flex-1 gap-2.5 font-bold text-[11px] overflow-y-auto custom-scrollbar">
                                                {(() => {
                                                    const locations = data?.analytics?.leadsByLocation || [];
                                                    const total = locations.reduce((sum, loc) => sum + loc.count, 0) || 1;
                                                    
                                                    if (locations.length === 0) {
                                                        return <div className="text-gray-400 text-xs font-medium py-4">No location data available</div>;
                                                    }
                                                    
                                                    return locations.map((loc, i) => {
                                                        const pct = ((loc.count / total) * 100).toFixed(1);
                                                        return (
                                                            <div key={i} className="flex justify-between items-center">
                                                                <span className="text-gray-800 truncate pr-2">{loc.country}</span>
                                                                <div className="flex items-center justify-end gap-3 text-right">
                                                                    <span className="text-gray-900 w-8">{loc.count}</span>
                                                                    <div className="w-12 h-[5px] bg-gray-100 rounded-full overflow-hidden flex items-center shrink-0">
                                                                        <div className="h-full bg-[#D48D2A] rounded-full" style={{width: `${pct}%`}}></div>
                                                                    </div>
                                                                    <span className="text-gray-400 text-[10px] w-8">{pct}%</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </div>
                                        
                                        {/* Right Map Image (Placeholder Map) */}
                                        <div className="flex-1 flex flex-col justify-center items-center relative pl-4 opacity-90">
                                            <svg viewBox="0 0 400 200" fill="none" className="w-full h-auto">
                                                <path d="M70,30 Q90,10 110,40 T150,50 T180,20 T220,10 T250,50 T280,30 T320,80 T370,100 T360,150 T280,180 T200,160 T140,180 T60,150 T30,100 Z" fill="#e5e7eb" opacity="0.6" />
                                                <path d="M70,30 Q90,10 110,40 T150,50 T180,20" fill="#F2E8DB" />
                                                <circle cx="100" cy="50" r="5" fill="#D48D2A" />
                                                <circle cx="200" cy="80" r="4" fill="#D48D2A" opacity="0.6"/>
                                                <circle cx="280" cy="60" r="3" fill="#D48D2A" opacity="0.4"/>
                                            </svg>
                                            
                                            {(() => {
                                                const locations = data?.analytics?.leadsByLocation || [];
                                                const topLocation = locations[0] || { country: 'Unknown', count: 0 };
                                                const total = locations.reduce((sum, loc) => sum + loc.count, 0) || 1;
                                                const pct = topLocation.count ? ((topLocation.count / total) * 100).toFixed(1) : 0;
                                                
                                                // Quick flag map
                                                const getFlag = (country) => {
                                                    const m = { 'United States': '🇺🇸', 'United Kingdom': '🇬🇧', 'UAE': '🇦🇪', 'Canada': '🇨🇦', 'Australia': '🇦🇺', 'India': '🇮🇳' };
                                                    return m[country] || '🌐';
                                                };

                                                return (
                                                    <div className="absolute bottom-1 right-2 flex items-center gap-3 bg-white/80 p-2 rounded-xl backdrop-blur-sm border border-white/40 shadow-sm">
                                                         <div className="flex flex-col text-right">
                                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Top Country</span>
                                                            <span className="text-[13px] font-bold text-gray-900 leading-tight">{topLocation.country}</span>
                                                            <div className="flex items-center text-[10px] font-bold gap-1 mt-0.5 justify-end">
                                                                <span className="text-gray-900 text-[12px]">{numberWithCommas(topLocation.count)}</span> <span className="text-gray-400">Leads • {pct}% of total</span>
                                                            </div>
                                                        </div>
                                                        <div className="text-[28px] opacity-90 rounded shadow-sm leading-none bg-white w-9 h-9 flex items-center justify-center overflow-hidden">{getFlag(topLocation.country)}</div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-1 shrink-0">
                                        <button className="text-[#D48D2A] text-[11px] font-bold hover:underline flex items-center gap-1">View All Locations <FiChevronRight/></button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Bottom Row */}
                            <div className="flex gap-4 flex-1 min-h-0 pb-1 shrink-0">
                                {/* Leads by Source */}
                                <div className="flex-[1] bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col min-w-[260px]">
                                    <h3 className="text-[16px] font-bold text-gray-900 canela mb-3 leading-none">Leads by Source</h3>
                                    <div className="flex flex-col flex-1 relative items-center justify-center">
                                        <div className="w-full flex-1 relative flex items-center justify-center -mt-2">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={[
                                                        { name: 'WhatsApp', value: 458, color: '#68D391' },
                                                        { name: 'Website', value: 324, color: '#2B6CB0' },
                                                        { name: 'Instagram', value: 246, color: '#9F7AEA' },
                                                        { name: 'Facebook', value: 142, color: '#F6AD55' },
                                                        { name: 'Others', value: 78, color: '#CBD5E0' }
                                                    ]} innerRadius="65%" outerRadius="100%" dataKey="value" stroke="#fff" strokeWidth={2} isAnimationActive={false}>
                                                        {[
                                                            { color: '#68D391' }, { color: '#2B6CB0' }, { color: '#9F7AEA' }, { color: '#F6AD55' }, { color: '#CBD5E0' }
                                                        ].map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-[22px] font-bold text-gray-900 canela leading-none">1,248</span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-1">Total Leads</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col gap-3.5 font-bold text-[11px] ml-4 shrink-0">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#68D391]"></div>
                                                    <FaWhatsapp className="text-[#25D366] text-[13px]"/>
                                                    <span className="text-gray-700 font-medium">WhatsApp</span>
                                                </div>
                                                <div className="flex justify-end pr-2 pl-3">
                                                    <span className="text-gray-900 w-6 text-right font-bold mr-1">458</span>
                                                    <span className="text-gray-400 w-11 text-right font-medium">(36.7%)</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#2B6CB0]"></div>
                                                    <FiGlobe className="text-[#2B6CB0] text-[13px]"/>
                                                    <span className="text-gray-700 font-medium">Website</span>
                                                </div>
                                                <div className="flex justify-end pr-2 pl-3">
                                                    <span className="text-gray-900 w-6 text-right font-bold mr-1">324</span>
                                                    <span className="text-gray-400 w-11 text-right font-medium">(25.9%)</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#9F7AEA]"></div>
                                                    <FiInstagram className="text-[#E1306C] text-[13px]"/>
                                                    <span className="text-gray-700 font-medium">Instagram</span>
                                                </div>
                                                <div className="flex justify-end pr-2 pl-3">
                                                    <span className="text-gray-900 w-6 text-right font-bold mr-1">246</span>
                                                    <span className="text-gray-400 w-11 text-right font-medium">(19.7%)</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F6AD55]"></div>
                                                    <FiFacebook className="text-[#1877F2] text-[13px]"/>
                                                    <span className="text-gray-700 font-medium">Facebook</span>
                                                </div>
                                                <div className="flex justify-end pr-2 pl-3">
                                                    <span className="text-gray-900 w-6 text-right font-bold mr-1">142</span>
                                                    <span className="text-gray-400 w-11 text-right font-medium">(11.4%)</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#CBD5E0]"></div>
                                                    <FiMoreHorizontal className="text-gray-400 text-[13px]"/>
                                                    <span className="text-gray-700 font-medium">Others</span>
                                                </div>
                                                <div className="flex justify-end pr-2 pl-3">
                                                    <span className="text-gray-900 w-6 text-right font-bold mr-1">78</span>
                                                    <span className="text-gray-400 w-11 text-right font-medium">(6.3%)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button className="px-4 py-1.5 border border-gray-100/80 rounded-lg text-[#D48D2A] text-[11px] font-medium hover:bg-gray-50 flex items-center gap-1 transition-colors shadow-sm">
                                            View Full Report <FiChevronRight className="text-[10px] mt-px"/>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Top Performing Assets */}
                                <div className="flex-[1.5] bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden min-w-[340px]">
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="text-[16px] font-bold text-gray-900 canela">Top Performing Assets</h3>
                                        <button className="px-3 py-1 text-[10px] rounded-lg border border-gray-200 bg-white font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">View All</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                                        <table className="w-full text-left table-fixed">
                                            <thead>
                                                <tr className="border-b border-gray-100">
                                                    <th className="pb-3 pt-1 text-[9px] font-black uppercase tracking-widest text-gray-400">ASSET</th>
                                                    <th className="pb-3 pt-1 text-[9px] font-black uppercase tracking-widest text-gray-400 w-14 text-right">VIEWS</th>
                                                    <th className="pb-3 pt-1 text-[9px] font-black uppercase tracking-widest text-gray-400 w-14 text-right">LEADS</th>
                                                    <th className="pb-3 pt-1 text-[9px] font-black uppercase tracking-widest text-gray-400 w-[5rem] text-right">CONV RATE</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {[
                                                    {name: 'Ferrari SF90', img: data?.inventory?.[0]?.images?.[0] || "/assets/placeholder.jpg", v: '6,428', l: 265, r: '4.12%'},
                                                    {name: 'Sunseeker 88 Yacht', img: data?.inventory?.[1]?.images?.[0] || "/assets/placeholder.jpg", v: '4,256', l: 198, r: '4.65%'},
                                                    {name: 'Dubai Marina Penthouse', img: data?.inventory?.[2]?.images?.[0] || "/assets/placeholder.jpg", v: '3,842', l: 156, r: '4.06%'},
                                                    {name: 'Rolex Daytona', img: data?.inventory?.[3]?.images?.[0] || "/assets/placeholder.jpg", v: '2,985', l: 112, r: '3.75%'}
                                                ].map((a,i) => (
                                                <tr key={i} className="hover:bg-gray-50/50 group transition-colors">
                                                    <td className="py-2.5 flex items-center gap-3 pr-2">
                                                        <div className="w-[42px] h-[30px] rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200/50"><img src={a.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform"/></div>
                                                        <span className="text-[12px] font-bold text-gray-900 truncate max-w-[120px]" title={a.name}>{a.name}</span>
                                                    </td>
                                                    <td className="py-2.5 text-[12px] font-bold text-gray-700 text-right">{a.v}</td>
                                                    <td className="py-2.5 text-[12px] font-bold text-gray-700 text-right">{a.l}</td>
                                                    <td className="py-2.5 text-[12px] font-bold text-emerald-500 text-right">{a.r}</td>
                                                </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="text-[10px] text-gray-400 font-medium italic text-center mt-3 border-t border-gray-50 pt-2 shrink-0">
                                        All times are in (GMT +04:00) Dubai, UAE
                                    </div>
                                </div>
                                
                                {/* Lead Funnel */}
                                <div className="flex-[1.5] bg-white rounded-[1.25rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden min-w-[340px]">
                                    <div className="flex justify-between items-center mb-4 shrink-0 z-10">
                                        <h3 className="text-[16px] font-bold text-gray-900 canela leading-none">Lead Funnel</h3>
                                        <button className="px-3 py-1 text-[10px] rounded-lg border border-gray-200 bg-white font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">View Funnel</button>
                                    </div>
                                    <div className="flex-1 flex min-h-0 relative z-10 items-center justify-between">
                                        {/* Funnel SVG Graphic */}
                                        <div className="w-[40%] flex flex-col items-center justify-between h-[100%] shrink-0 relative mr-6 pt-2 pb-2">
                                            <div className="w-full h-[20%] bg-[#10B981] shadow-sm transform perspective-100" style={{clipPath: 'polygon(0% 0, 100% 0, 85% 100%, 15% 100%)'}}></div>
                                            <div className="w-[70%] h-[20%] bg-[#3B82F6] shadow-sm mt-[2%]" style={{clipPath: 'polygon(0% 0, 100% 0, 80% 100%, 20% 100%)'}}></div>
                                            <div className="w-[50%] h-[20%] bg-[#D946EF] shadow-sm mt-[2%]" style={{clipPath: 'polygon(0% 0, 100% 0, 75% 100%, 25% 100%)'}}></div>
                                            <div className="w-[35%] h-[20%] bg-[#D48D2A] shadow-sm mt-[2%]" style={{clipPath: 'polygon(0% 0, 100% 0, 95% 100%, 5% 100%)'}}></div>
                                        </div>
                                        <div className="flex-1 flex flex-col justify-around py-1 h-[100%] text-[10px] font-bold text-gray-500">
                                            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                <span>Total Views</span><span className="text-gray-900 font-black text-[12px]">24,856</span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                <span>Leads Captured</span><span className="text-gray-900 font-black flex gap-1.5 text-[12px] items-center">1,248 <span className="text-gray-400 font-medium text-[9px]">(5.02%)</span></span>
                                            </div>
                                            <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                                                <span>Qualified Leads</span><span className="text-gray-900 font-black flex gap-1.5 text-[12px] items-center">342 <span className="text-gray-400 font-medium text-[9px]">(27.4%)</span></span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span>Converted Leads</span><span className="text-gray-900 font-black flex gap-1.5 text-[12px] items-center">68 <span className="text-gray-400 font-medium text-[9px]">(5.48%)</span></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-50 text-center text-[12px] font-bold text-gray-500 shrink-0 z-10 w-full flex justify-center gap-2">
                                        Overall Conversion Rate: <span className="text-emerald-500 font-black">5.48%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* PUBLIC MARKETPLACE TAB */}
                    {activeTab === 'marketplace' && (
                        <div className="h-[calc(100vh-6rem)] overflow-hidden flex flex-col p-2 gap-4 animate-in fade-in duration-700">
                            
                            {/* Top Row: Visibility & Performance */}
                            <div className="flex gap-4 shrink-0 h-[38%] min-h-[220px]">
                                {/* Visibility Controls */}
                                <div className="flex-[3] bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col min-h-0 relative">
                                    <div className="flex justify-between items-start mb-4 shrink-0">
                                        <div>
                                            <h3 className="text-[15px] font-bold text-gray-900 mb-1 canela">Visibility Controls</h3>
                                            <p className="text-[10px] text-gray-400 font-medium border-l-[3px] border-[#D48D2A] pl-2 -ml-[3px]">Manage profile visibility.</p>
                                        </div>
                                        <button className="px-4 py-1.5 border border-gray-200 rounded-[8px] text-[9px] font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-colors uppercase tracking-widest"><FiLayout className="text-gray-400"/> Manage Listings</button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 pb-2 relative">
                                        {(data?.inventory || []).map(item => {
                                            const assetName = item.propertyName || item.yachtName || item.name || item.title || `${item.make || ''} ${item.model || ''}`.trim() || 'Unnamed Asset';
                                            const cat = item.category?.replace('Asset', 's')?.toUpperCase() || 'ASSET';
                                            return (
                                                <div key={item.id} className="flex gap-4 items-center p-3 rounded-[1rem] border border-gray-100/50 bg-gray-50/50 hover:bg-white hover:border-[#D48D2A]/30 transition-colors">
                                                    <div className="w-[80px] h-[60px] rounded-lg overflow-hidden shrink-0 bg-white border border-gray-200/50 shadow-sm">
                                                        {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><FiImage className="text-gray-300 text-lg"/></div>}
                                                    </div>
                                                    
                                                    <div className="flex-1 flex justify-between items-center pr-2">
                                                        <div className="flex flex-col">
                                                            <h4 className="text-[13px] font-bold text-gray-900 canela leading-none mb-1.5">{assetName}</h4>
                                                            <div className="flex items-center gap-2 text-[8px] font-black text-gray-500 uppercase tracking-widest">
                                                                <FiPackage/> {cat} <span className="text-gray-300 mx-0.5">•</span> ${numberWithCommas(item.price || 0)}
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4 items-center pl-4 ml-2">
                                                            <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                                                                <span className={`text-[8px] font-black uppercase tracking-widest ${item.status === 'Active' ? 'text-emerald-500' : 'text-gray-400'}`}>
                                                                    {item.status === 'Active' ? 'Public' : 'Hidden'}
                                                                </span>
                                                                <div 
                                                                    onClick={() => handleTogglePublic(item)}
                                                                    className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors duration-300 ${item.status === 'Active' ? 'bg-[#D48D2A]' : 'bg-gray-200'}`}
                                                                >
                                                                    <div className={`absolute top-[2px] w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${item.status === 'Active' ? 'left-[18px]' : 'left-[2px]'}`}></div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button className="px-3 py-1.5 rounded-[8px] text-[9px] font-bold border border-gray-200 bg-white text-gray-700 hover:border-[#D48D2A] flex items-center gap-1.5 transition-colors uppercase tracking-widest shadow-sm"><FiEye className="text-[#D48D2A] text-[11px]"/> Preview Listing</button>
                                                                <button className="w-[28px] h-[28px] rounded-[8px] border border-gray-200 flex items-center justify-center bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm text-gray-400">
                                                                    <FiMoreHorizontal />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                        {(!data?.inventory || data.inventory.length === 0) && (
                                            <div className="text-center py-6 text-[10px] font-medium text-gray-400 italic">No assets available.</div>
                                        )}
                                    </div>
                                    <div className="absolute top-[85%] bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent pointer-events-none rounded-b-[1.5rem]"></div>
                                </div>
                                
                                {/* Marketplace Performance Mini */}
                                <div className="flex-[1.5] bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col relative overflow-hidden">
                                     <div className="flex justify-between items-start mb-4 shrink-0">
                                         <div>
                                            <h3 className="text-[15px] font-bold text-gray-900 mb-1 canela">Performance</h3>
                                            <p className="text-[10px] text-gray-400 font-medium border-l-[3px] border-[#8B5CF6] pl-2 -ml-[3px]">Public listing insights.</p>
                                         </div>
                                     </div>
                                     <div className="grid grid-cols-2 gap-3 flex-1">
                                         {[
                                            {label: 'Total Views', value: numberWithCommas(data?.stats?.totalViews || 0), change: '+18.2%', icon: FiEye, color: 'text-gray-400'},
                                            {label: 'Total Inquiries', value: numberWithCommas(data?.stats?.totalLeads || 0), change: '+12.5%', icon: FiMessageSquare, color: 'text-gray-400'},
                                            {label: 'Saves', value: data?.stats?.savedCount || 0, change: '+9.8%', icon: FiHeart, color: 'text-gray-400'},
                                            {label: 'Conversion', value: data?.stats?.totalViews ? ((data?.stats?.totalLeads / data?.stats?.totalViews) * 100).toFixed(1)+'%' : '0.0%', change: '+7.4%', icon: FiTrendingUp, color: 'text-gray-400'}
                                         ].map((stat, i) => (
                                            <div key={i} className="bg-gray-50/70 rounded-xl p-3 border border-gray-100/80 flex flex-col justify-center relative group hover:border-[#D48D2A]/30 transition-colors">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">{stat.label}</span>
                                                    <stat.icon className="text-[12px] text-gray-300 group-hover:text-[#D48D2A] transition-colors" />
                                                </div>
                                                <span className="text-[18px] canela font-bold text-gray-900 leading-none my-1">{stat.value}</span>
                                                <span className="text-[8px] font-black flex items-center gap-0.5 tracking-widest mt-1 text-emerald-500 uppercase">
                                                    <FiTrendingUp className="text-[9px]"/> {stat.change}
                                                </span>
                                            </div>
                                         ))}
                                     </div>
                                </div>
                            </div>
                            
                            {/* Bottom Row: Public Preview */}
                            <div className="flex-1 bg-white rounded-[1.5rem] p-5 border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] flex flex-col min-h-0 relative">
                                <div className="flex justify-between items-start mb-4 shrink-0 px-1">
                                    <div>
                                        <h3 className="text-[16px] font-bold text-gray-900 mb-1 canela">Public Preview</h3>
                                        <p className="text-[10px] text-gray-400 font-medium border-l-[3px] border-[#10B981] pl-2 -ml-[3px]">This is how your listings appear to potential buyers on the marketplace.</p>
                                    </div>
                                    <button className="px-4 py-1.5 border border-gray-200 rounded-[8px] text-[9px] font-bold text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-1.5 shadow-sm transition-colors uppercase tracking-widest">View Public Profile <FiExternalLink className="text-[11px] text-gray-400"/></button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4 pb-4">
                                    {(data?.inventory || []).filter(i => i.status === 'Active').map((item, idx) => {
                                        const assetName = item.propertyName || item.yachtName || item.name || item.title || `${item.make || ''} ${item.model || ''}`.trim() || 'Unnamed Asset';
                                        const cat = item.category?.replace('Asset', 's')?.toUpperCase() || 'ASSET';
                                        return (
                                            <div key={idx} className="bg-white rounded-2xl border border-gray-100 shadow-sm flex overflow-hidden p-3 gap-6 relative group hover:border-[#D48D2A]/30 transition-colors w-full mx-auto">
                                                <div className="w-[35%] min-w-[280px] h-[220px] rounded-xl bg-gray-100 overflow-hidden relative shrink-0 shadow-inner">
                                                    {item.images?.[0] ? <img src={item.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/> : <div className="w-full h-full flex items-center justify-center"><FiImage className="text-gray-300 text-3xl"/></div>}
                                                    <div className="absolute top-4 left-4">
                                                        <span className="bg-white/95 backdrop-blur text-gray-900 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-sm border border-gray-200/50">{cat}</span>
                                                    </div>
                                                    <div className="absolute bottom-4 left-0 w-full flex justify-center gap-3">
                                                        <button className="bg-white/95 backdrop-blur text-gray-900 px-4 py-1.5 rounded-lg text-[9px] font-bold flex items-center gap-1.5 shadow-sm hover:bg-white transition-colors uppercase tracking-widest"><FiImage className="text-[#D48D2A]"/> {item.images?.length || 0} Photos</button>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-1 py-1 pr-1 flex">
                                                    <div className="flex-[2] flex flex-col border-r border-gray-100 pr-6">
                                                        <h2 className="text-[20px] font-bold text-gray-900 canela leading-tight mb-1 truncate" title={assetName}>{assetName}</h2>
                                                        <p className="text-[18px] font-black text-[#D48D2A] tracking-wider mb-4 leading-none">${numberWithCommas(item.price || 0)}</p>
                                                        
                                                        <div className="flex gap-4 mb-4">
                                                            <div className="flex gap-2 items-center pr-4 border-r border-gray-50">
                                                                <FiCalendar className="text-gray-400 text-[14px]"/>
                                                                <div className="flex flex-col mt-0.5">
                                                                    <span className="text-[11px] font-bold text-gray-900 leading-none">{item.year || '2023'}</span>
                                                                    <span className="text-[9px] text-gray-400 mt-0.5">Year</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 items-center pr-4 border-r border-gray-50">
                                                                <FiClock className="text-gray-400 text-[14px]"/>
                                                                <div className="flex flex-col mt-0.5">
                                                                    <span className="text-[11px] font-bold text-gray-900 leading-none">{numberWithCommas(item.mileage || 2500)} {cat==='VEHICLES'?'km':'hrs'}</span>
                                                                    <span className="text-[9px] text-gray-400 mt-0.5">{cat==='VEHICLES'?'Mileage':'Usage'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 items-center pr-4 border-r border-gray-50">
                                                                <FiDroplet className="text-gray-400 text-[14px]"/>
                                                                <div className="flex flex-col mt-0.5">
                                                                    <span className="text-[11px] font-bold text-gray-900 leading-none">{item.fuelType || 'Petrol'}</span>
                                                                    <span className="text-[9px] text-gray-400 mt-0.5">Fuel Type</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 items-center">
                                                                <FiSettings className="text-gray-400 text-[14px]"/>
                                                                <div className="flex flex-col mt-0.5">
                                                                    <span className="text-[11px] font-bold text-gray-900 leading-none">{item.transmission || 'Auto'}</span>
                                                                    <span className="text-[9px] text-gray-400 mt-0.5">Transmission</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-[11px] text-gray-500 mb-4 leading-relaxed line-clamp-2">
                                                            {item.description || `Experience the perfect blend of power, innovation, and design. The ${assetName} delivers unmatched performance and luxury across all aspects of ownership.`}
                                                        </p>
                                                        
                                                        <div className="flex flex-wrap gap-2 mt-auto">
                                                            {(item.tags || ['Hybrid', '4.0L V8', '2 Seater', 'AWD']).map((tag, tIdx) => (
                                                                <span key={tIdx} className="bg-[#FFF8F0] text-[#D48D2A] px-3 py-1 rounded-[6px] text-[9px] font-bold border border-[#F2E8DB]">{tag}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex-1 pl-6 flex flex-col justify-center">
                                                        <h4 className="text-[13px] font-bold text-gray-900 canela mb-0.5">Interested in this asset?</h4>
                                                        <p className="text-[9px] text-gray-400 font-medium mb-3 border-b border-gray-50 pb-3">Contact the seller directly.</p>
                                                        
                                                        <div className="space-y-2.5">
                                                            <button className="w-full py-2.5 bg-[#D48D2A] hover:bg-[#b5751c] text-white rounded-[0.75rem] font-bold text-[9px] uppercase tracking-widest shadow-[0_4px_15px_rgba(212,141,42,0.3)] transition-colors flex items-center justify-center gap-2"><FiMessageSquare className="text-sm"/> Send Inquiry</button>
                                                            <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 hover:border-[#D48D2A] hover:text-[#D48D2A] rounded-[0.75rem] font-bold text-[9px] uppercase tracking-widest shadow-sm transition-colors flex items-center justify-center gap-2"><FiHeart className="text-[12px] text-gray-400"/> Save Asset</button>
                                                            <button className="w-full py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-[0.75rem] font-bold text-[9px] uppercase tracking-widest shadow-sm transition-colors flex items-center justify-center gap-2"><FiShare2 className="text-[12px] text-gray-400"/> Share</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {(!data?.inventory || data.inventory.filter(i => i.status === 'Active').length === 0) && (
                                        <div className="text-center py-6 text-[11px] font-medium text-gray-400 bg-gray-50/50 border border-gray-100 rounded-3xl p-4 shadow-sm italic">No active public assets available. Set assets to Public to preview them here.</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SUBSCRIPTION TAB */}
                    {activeTab === 'subscription' && (
                        <div className="h-[calc(100vh-6rem)] overflow-hidden flex flex-col p-4 animate-in fade-in duration-700">
                            
                            {/* Current Plan Block */}
                            <div className="bg-[#FFF8F0] rounded-[1.5rem] border border-[#F2E8DB] shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-4 mb-2 shrink-0 flex justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 h-full w-1/3 pointer-events-none opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiPjxwYXRoIGQ9Ik0wIDEwMDBDMzAwIDEwMDAgMzAwIDAgMTAwMCAwIiBzdHJva2U9IiNENDhEMkEiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] bg-cover bg-right bg-no-repeat w-1/2"></div>
                                <div className="flex gap-6 items-start relative z-10 w-full max-w-4xl">
                                    <div className="w-14 h-14 bg-[#D48D2A] rounded-[1rem] flex items-center justify-center shrink-0 shadow-lg shadow-[#D48D2A]/20">
                                        <FiSettings className="text-white text-2xl" />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1">Current Plan</h3>
                                        <div className="flex items-center gap-3 mb-1.5">
                                            <h4 className="text-[26px] font-bold text-gray-900 canela leading-none">{user?.plan || 'Premium Basic'}</h4>
                                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-100">ACTIVE</span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-medium mb-6">You're on the {user?.plan || 'Premium Basic'} plan.</p>
                                        
                                        <div className="flex gap-8">
                                            <div className="flex gap-3 items-center">
                                                <FiPackage className="text-gray-400 text-lg shrink-0"/>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none">Active Listings</span>
                                                    <span className="text-[12px] font-bold text-gray-900 mt-1">{(data?.inventory || []).length || 1} of {user?.plan === 'Business VIP' ? 50 : user?.plan === 'Enterprise Elite' ? 'Unlimited' : 25}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <FiActivity className="text-gray-400 text-lg shrink-0"/>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none">Analytics Level</span>
                                                    <span className="text-[12px] font-bold text-gray-900 mt-1">{user?.plan === 'Business VIP' ? 'Full Suite' : user?.plan === 'Enterprise Elite' ? 'Insights & Reports' : 'Advanced'}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 items-center">
                                                <FiMessageSquare className="text-gray-400 text-lg shrink-0"/>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none">Support</span>
                                                    <span className="text-[12px] font-bold text-gray-900 mt-1">{user?.plan === 'Business VIP' ? 'Priority Phone & Email' : user?.plan === 'Enterprise Elite' ? '24/7 Phone & Email' : 'Priority Email'}</span>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 items-center border-l border-gray-200 pl-8 ml-2">
                                                <FiCalendar className="text-gray-400 text-lg shrink-0"/>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none">Next Renewal</span>
                                                    <span className="text-[12px] font-bold text-gray-900 mt-1">{companyInfo?.planExpiresAt ? new Date(companyInfo.planExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 24, 2026'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-start relative z-10 pl-8 ml-8">
                                    <span className="text-[11px] font-bold text-gray-500 mb-1">Renewal Date</span>
                                    <span className="text-[18px] font-bold text-gray-900 mb-4">{companyInfo?.planExpiresAt ? new Date(companyInfo.planExpiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'May 24, 2026'}</span>
                                    <button className="px-6 py-2.5 rounded-[0.75rem] border-2 border-[#D48D2A] bg-[#D48D2A] hover:bg-[#b5751c] text-white text-[11px] font-bold shadow-sm transition-colors flex items-center gap-2 tracking-wide"><FiCreditCard/> Manage Billing</button>
                                </div>
                            </div>
                            
                            {/* Nav Bar */}
                            <div className="flex gap-2 items-center text-xs font-bold pt-1 pb-2 border-b border-gray-100 shrink-0 mb-2">
                                <button className="px-5 py-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 uppercase tracking-widest"><FiClock className="text-[14px]"/> Billing History</button>
                                <button className="px-5 py-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 uppercase tracking-widest"><FiPackage className="text-[14px]"/> Invoices</button>
                                <button className="px-5 py-2 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2 uppercase tracking-widest"><FiCreditCard className="text-[14px]"/> Payment Methods</button>
                                <button className="px-5 py-2 text-gray-900 border-b-2 border-gray-900 transition-colors flex items-center gap-2 uppercase tracking-widest"><FiSettings className="text-[14px]"/> Update Plan</button>
                                <div className="flex-1"></div>
                                <button className="px-5 py-2 text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 uppercase tracking-widest"><FiX className="text-[14px]"/> Cancel Subscription</button>
                            </div>
                            
                            {/* Available Plans Section */}
                            <div className="flex-1 min-h-0 flex gap-4">
                                {/* Left Side: Plans Grid */}
                                <div className="flex-[3] flex flex-col min-h-0 relative">
                                    <div className="flex justify-between items-center mb-2 shrink-0 px-2 mt-1">
                                        <div className="flex flex-col gap-0.5">
                                            <h3 className="text-[18px] font-bold text-gray-900 canela">Available Plans</h3>
                                            <div className="text-[11px] text-gray-500 font-medium">Choose the best plan to grow your business.</div>
                                        </div>
                                        <div className="bg-white border border-gray-200 p-1 rounded-xl flex shadow-sm opacity-90 scale-90 origin-right transition-colors">
                                            <button 
                                                onClick={() => setBillingCycle('Monthly')}
                                                className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm min-w-[90px] ${billingCycle === 'Monthly' ? 'bg-[#FFF8F0] text-[#D48D2A]' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                Monthly
                                            </button>
                                            <button 
                                                onClick={() => setBillingCycle('Yearly')}
                                                className={`px-5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center gap-2 min-w-[130px] ${billingCycle === 'Yearly' ? 'bg-[#FFF8F0] text-[#D48D2A]' : 'text-gray-500 hover:text-gray-900'}`}
                                            >
                                                Yearly <span className={`${billingCycle === 'Yearly' ? 'text-[#D48D2A]/80' : 'text-gray-400'} font-medium normal-case tracking-normal`}>(Save 20%)</span>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-visible flex gap-3 pr-1 pb-2 pt-3 items-stretch h-full">
                                        {/* Premium Basic Plan */}
                                        <div className={`flex-1 min-w-0 p-4 rounded-[1.5rem] border-[1.5px] flex flex-col transition-all ${(user?.plan || 'Premium Basic') === 'Premium Basic' ? 'bg-[#FFF8F0]/30 border-[#D48D2A]/40 shadow-[0_4px_20px_rgba(212,141,42,0.06)] relative' : 'bg-white border-gray-100 hover:border-[#D48D2A]/30'}`}>
                                            {(user?.plan || 'Premium Basic') === 'Premium Basic' && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                    <span className="px-3 py-1 bg-[#D48D2A] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm">Current Plan</span>
                                                </div>
                                            )}
                                            <div className="flex justify-center mb-2 text-gray-400 mt-1 shrink-0">
                                                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shadow-sm">
                                                    <FiPackage className="text-sm" />
                                                </div>
                                            </div>
                                            <h4 className="text-[15px] font-bold text-gray-900 text-center canela mb-0.5 shrink-0">Premium Basic</h4>
                                            <div className="flex justify-center items-end gap-0.5 py-0.5 shrink-0">
                                                <span className="text-[26px] font-black text-gray-900 leading-none tracking-tight">${billingCycle === 'Monthly' ? '99' : '79'}</span>
                                                <span className="text-[9px] font-bold text-gray-400 mb-1.5">/month</span>
                                            </div>
                                            <ul className="space-y-1.5 mb-2 flex-1 mt-2 overflow-hidden">
                                                {['25 Active Listings', 'Advanced Analytics', 'Priority Email Support', 'Enhanced Visibility', 'Lead Management'].map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-gray-600">
                                                        <FiCheckCircle className="shrink-0 mt-[1px] text-emerald-500 text-[12px]" /> <span className="leading-tight">{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button 
                                                className={`w-full py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-sm transition-colors shrink-0 truncate ${(user?.plan || 'Premium Basic') === 'Premium Basic' ? 'bg-[#FFF8F0] border border-[#F2E8DB] text-[#D48D2A]' : 'bg-white border border-[#D48D2A] text-[#D48D2A] opacity-40 cursor-not-allowed'}`}
                                                disabled={true}
                                            >
                                                {(user?.plan || 'Premium Basic') === 'Premium Basic' ? 'Current Plan' : 'Downgrade'}
                                            </button>
                                        </div>
                                        
                                        {/* Business VIP Plan */}
                                        <div className={`flex-1 min-w-0 p-4 rounded-[1.5rem] border-[1.5px] flex flex-col transition-all ${(user?.plan || 'Premium Basic') === 'Business VIP' ? 'bg-purple-50/30 border-purple-400/40 shadow-[0_4px_20px_rgba(168,85,247,0.06)] relative' : 'bg-white border-gray-100 hover:border-[#D48D2A]/30'}`}>
                                            {(user?.plan || 'Premium Basic') === 'Business VIP' && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                    <span className="px-3 py-1 bg-[#D48D2A] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm">Current Plan</span>
                                                </div>
                                            )}
                                            <div className="flex justify-center mb-2 text-purple-500 mt-1 shrink-0">
                                                <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center shadow-sm">
                                                    <FiBriefcase className="text-sm" />
                                                </div>
                                            </div>
                                            <h4 className="text-[15px] font-bold text-gray-900 text-center canela mb-0.5 shrink-0">Business VIP</h4>
                                            <div className="flex justify-center items-end gap-0.5 py-0.5 shrink-0">
                                                <span className="text-[26px] font-black text-gray-900 leading-none tracking-tight">${billingCycle === 'Monthly' ? '299' : '239'}</span>
                                                <span className="text-[9px] font-bold text-gray-400 mb-1.5">/month</span>
                                            </div>
                                            <ul className="space-y-1.5 mb-3 flex-1 mt-2 overflow-auto custom-scrollbar">
                                                {['50 Active Listings', 'Full Analytics Suite', 'Priority Phone & Email Support', 'Premium Visibility', 'Lead Scoring', 'Dedicated Account Manager', 'API Access'].map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-gray-600">
                                                        <FiCheckCircle className="shrink-0 mt-[1px] text-emerald-500 text-[12px]" /> <span className="leading-tight">{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button 
                                                className={`w-full py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-sm transition-colors shrink-0 truncate ${(user?.plan || 'Premium Basic') === 'Business VIP' ? 'bg-[#FFF8F0] border border-[#F2E8DB] text-[#D48D2A]' : ((user?.plan || 'Premium Basic') === 'Enterprise Elite' ? 'bg-white border border-[#D48D2A] text-[#D48D2A] opacity-40 cursor-not-allowed' : 'bg-white border border-[#D48D2A] text-[#D48D2A] hover:bg-[#FFF8F0]')}`}
                                                disabled={(user?.plan || 'Premium Basic') === 'Business VIP' || (user?.plan || 'Premium Basic') === 'Enterprise Elite'}
                                            >
                                                {(user?.plan || 'Premium Basic') === 'Business VIP' ? 'Current Plan' : ((user?.plan || 'Premium Basic') === 'Enterprise Elite' ? 'Downgrade' : 'Upgrade')}
                                            </button>
                                        </div>
                                        
                                        {/* Enterprise Elite Plan */}
                                        <div className={`flex-1 min-w-0 p-4 rounded-[1.5rem] border-[1.5px] flex flex-col transition-all ${(user?.plan || 'Premium Basic') === 'Enterprise Elite' ? 'bg-blue-50/30 border-blue-400/40 shadow-[0_4px_20px_rgba(59,130,246,0.06)] relative' : 'bg-white border-gray-100 hover:border-[#D48D2A]/30'}`}>
                                            {(user?.plan || 'Premium Basic') === 'Enterprise Elite' && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                                    <span className="px-3 py-1 bg-[#D48D2A] text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm">Current Plan</span>
                                                </div>
                                            )}
                                            <div className="flex justify-center mb-2 text-blue-500 mt-1 shrink-0">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center shadow-sm">
                                                    <FiGlobe className="text-sm" />
                                                </div>
                                            </div>
                                            <h4 className="text-[15px] font-bold text-gray-900 text-center canela mb-0.5 shrink-0">Enterprise Elite</h4>
                                            <div className="flex justify-center items-end gap-0.5 py-0.5 shrink-0">
                                                <span className="text-[26px] font-black text-gray-900 leading-none tracking-tight">${billingCycle === 'Monthly' ? '599' : '479'}</span>
                                                <span className="text-[9px] font-bold text-gray-400 mb-1.5">/month</span>
                                            </div>
                                            <ul className="space-y-1.5 mb-3 flex-1 mt-2 overflow-auto custom-scrollbar">
                                                {['Unlimited Active Listings', 'Advanced Insights & Reports', '24/7 Phone & Email Support', 'Top Tier Visibility', 'Lead Scoring & CRM', 'Dedicated Success Manager', 'API Access & Integrations', 'Custom Solutions'].map((f, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-[10px] font-bold text-gray-600">
                                                        <FiCheckCircle className="shrink-0 mt-[1px] text-emerald-500 text-[12px]" /> <span className="leading-tight">{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                            <button 
                                                onClick={() => {
                                                    setContactType('Sales');
                                                    setIsContactModalOpen(true);
                                                }}
                                                className={`w-full py-2.5 bg-white border border-[#D48D2A] text-[#D48D2A] hover:bg-[#FFF8F0] rounded-xl font-bold text-[9px] uppercase tracking-widest shadow-sm transition-colors shrink-0 truncate ${(user?.plan || 'Premium Basic') === 'Enterprise Elite' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {(user?.plan || 'Premium Basic') === 'Enterprise Elite' ? 'Current Plan' : 'Contact Sales'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Right Side: Upgrades & Footer Information */}
                                <div className="flex-[1.2] flex flex-col gap-3 min-w-0">
                                     {/* Why Upgrade Block */}
                                     <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 flex-1 overflow-hidden flex flex-col">
                                         <h4 className="text-[15px] font-bold text-gray-900 canela mb-4 shrink-0">Why Upgrade?</h4>
                                         <div className="flex flex-col gap-3.5 flex-1 overflow-hidden justify-center">
                                             <div className="flex gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-[#FFF8F0] shrink-0 flex justify-center items-center shadow-sm border border-[#F2E8DB]"><FiTrendingUp className="text-[12px] text-[#D48D2A]"/></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-gray-900 leading-none mb-1">Increase Visibility</span>
                                                    <span className="text-[9px] text-gray-500 tracking-tight leading-tight">Get more exposure for your assets.</span>
                                                </div>
                                             </div>
                                             <div className="flex gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-teal-50 shrink-0 flex justify-center items-center shadow-sm border border-teal-100"><FiUsers className="text-[12px] text-teal-600"/></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-gray-900 leading-none mb-1">Generate More Leads</span>
                                                    <span className="text-[9px] text-gray-500 tracking-tight leading-tight">Advanced tools to capture quality leads.</span>
                                                </div>
                                             </div>
                                             <div className="flex gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-blue-50 shrink-0 flex justify-center items-center shadow-sm border border-blue-100"><FiActivity className="text-[12px] text-blue-500"/></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-gray-900 leading-none mb-1">Powerful Analytics</span>
                                                    <span className="text-[9px] text-gray-500 tracking-tight leading-tight">Actionable insights to grow faster.</span>
                                                </div>
                                             </div>
                                             <div className="flex gap-3">
                                                <div className="w-7 h-7 rounded-lg bg-emerald-50 shrink-0 flex justify-center items-center shadow-sm border border-emerald-100"><FiBell className="text-[12px] text-emerald-500"/></div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-gray-900 leading-none mb-1">Priority Support</span>
                                                    <span className="text-[9px] text-gray-500 tracking-tight leading-tight">Get help when you need it most.</span>
                                                </div>
                                             </div>
                                         </div>
                                     </div>
                                     
                                     {/* Need Help Choosing Block */}
                                     <div className="bg-white rounded-[1.5rem] p-5 shadow-[0_2px_15px_rgba(0,0,0,0.02)] border border-gray-100 shrink-0">
                                         <h4 className="text-[14px] font-bold text-gray-900 canela mb-1">Need help choosing?</h4>
                                         <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">Our team is here to help you find the perfect plan.</p>
                                         <button 
                                            onClick={() => {
                                                setContactType('Support');
                                                setIsContactModalOpen(true);
                                            }}
                                            className="w-full py-2.5 rounded-xl border border-[#D48D2A] text-[#D48D2A] hover:bg-[#FFF8F0] font-bold text-[9px] uppercase tracking-widest shadow-sm transition-colors flex justify-center items-center gap-2"
                                         >
                                            <FiMessageSquare className="text-[12px]"/> Contact Support
                                         </button>
                                     </div>
                                </div>
                            </div>
                            
                            {/* Static Bottom Footer */}
                            <div className="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center shrink-0">
                                <div className="flex gap-10">
                                    <div className="flex items-center gap-3">
                                        <FiShield className="text-gray-400 text-[18px]" />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-gray-900">Secure Payments</span>
                                            <span className="text-[9px] text-gray-400">Your payments are safe with us</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 border-l border-gray-200 pl-8">
                                        <FiLock className="text-gray-400 text-[18px]" />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-gray-900">Cancel Anytime</span>
                                            <span className="text-[9px] text-gray-400">No long-term commitments</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 border-l border-gray-200 pl-8">
                                        <FiActivity className="text-gray-400 text-[18px]" />
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-gray-900">Instant Upgrade</span>
                                            <span className="text-[9px] text-gray-400">Get access immediately</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-80">
                                    <span className="text-[14px] font-black italic text-blue-900">VISA</span>
                                    <div className="flex items-center -space-x-1.5"><div className="w-3.5 h-3.5 rounded-full bg-red-500 opacity-90"></div><div className="w-3.5 h-3.5 rounded-full bg-orange-400 opacity-90"></div></div>
                                    <div className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[9px] font-black">AMEX</div>
                                    <span className="text-[12px] font-bold flex items-center gap-0.5"><FiLayout/> Pay</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* SETTINGS TAB */}
                    {activeTab === 'settings' && (
                        <div className="h-[calc(100vh-6rem)] flex flex-col gap-3 animate-in fade-in duration-700 p-4">
                            {/* Verification Banner */}
                            {!Boolean(agentInfo.fullName && agentInfo.phone && agentInfo.email && companyInfo.name && companyInfo.address) && !user?.isVerified && (
                                <div className="bg-[#FFF8F0] border border-[#F2E8DB] rounded-2xl p-3 flex items-start justify-start gap-3 shrink-0 shadow-sm">
                                    <div className="w-5 h-5 rounded-full border border-[#D48D2A] text-[#D48D2A] flex items-center justify-center shrink-0 mt-0.5"><span className="text-xs font-bold font-serif">i</span></div>
                                    <div className="flex flex-col">
                                        <span className="text-[12px] font-bold text-gray-900 leading-tight">Complete both sections to get verified and start receiving high-quality leads.</span>
                                        <span className="text-[10px] text-gray-500 font-medium">Verified profiles get 3x more visibility and priority in lead distribution.</span>
                                    </div>
                                </div>
                            )}
                            
                            {/* 2 Main Columns */}
                            <div className="flex flex-1 gap-4 min-h-0">
                                {/* Personal Details */}
                                <div className="flex-1 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] p-4 flex flex-col relative h-full">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4 shrink-0">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-7 h-7 rounded-full bg-purple-50 text-purple-600 font-bold flex items-center justify-center text-[12px] shrink-0">1</div>
                                            <div className="flex flex-col">
                                                <h3 className="text-[13px] font-bold text-gray-900 leading-tight">Your Personal (Agent) Details</h3>
                                                <p className="text-[9px] text-gray-400 font-medium leading-tight mt-0.5">This information will be visible to clients and used for communication.</p>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 flex items-center gap-1 rounded-full text-[9px] font-bold shrink-0">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified
                                        </div>
                                    </div>
                                    
                                    {/* Form Fields container */}
                                    <div className="flex-1 overflow-auto custom-scrollbar pr-2 flex flex-col gap-3">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col gap-1.5 w-[30%]">
                                                <label className="text-[9px] font-bold text-gray-700 capitalize tracking-wide">Profile Photo</label>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0"><img src={agentInfo.photo || user?.profilePicture || "/assets/placeholder.jpg"} className="w-full h-full object-cover"/></div>
                                                    <div className="flex flex-col justify-center">
                                                        <label className="px-3 py-1.5 cursor-pointer bg-white border border-gray-200 rounded-lg text-[9px] font-bold text-gray-700 flex items-center gap-1 whitespace-nowrap hover:bg-gray-50 shadow-sm">
                                                            <FiUpload/> Upload Photo
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicUpload} />
                                                        </label>
                                                        <span className="text-[8px] text-gray-400 mt-1 font-medium">JPG, PNG up to 5MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 flex gap-3">
                                                <div className="flex-1">
                                                    <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Full Name</label>
                                                <input type="text" value={agentInfo.fullName} onChange={e => setAgentInfo(p => ({...p, fullName: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Job Title / Role</label>
                                                <input type="text" value={agentInfo.jobTitle} onChange={e => setAgentInfo(p => ({...p, jobTitle: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Email Address</label>
                                            <input type="email" value={agentInfo.email} onChange={e => setAgentInfo(p => ({...p, email: e.target.value}))} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Phone Number</label>
                                            <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                                                <div className="flex items-center bg-gray-50 border-r border-gray-200 text-[10px] relative">
                                                    <select 
                                                        className="appearance-none bg-transparent pl-2 pr-6 py-1.5 outline-none font-medium cursor-pointer"
                                                        value={agentInfo.phoneCode}
                                                        onChange={e => setAgentInfo(p => ({...p, phoneCode: e.target.value}))}
                                                    >
                                                        <option value="+1">🇺🇸 +1</option>
                                                        <option value="+44">🇬🇧 +44</option>
                                                        <option value="+971">🇦🇪 +971</option>
                                                        <option value="+61">🇦🇺 +61</option>
                                                        <option value="+91">🇮🇳 +91</option>
                                                        <option value="+49">🇩🇪 +49</option>
                                                        <option value="+33">🇫🇷 +33</option>
                                                        <option value="+39">🇮🇹 +39</option>
                                                        <option value="+81">🇯🇵 +81</option>
                                                        <option value="+86">🇨🇳 +86</option>
                                                    </select>
                                                    <FiChevronDown className="absolute right-1.5 text-[8px] text-gray-500 pointer-events-none"/>
                                                </div>
                                                <input type="text" value={agentInfo.phone} onChange={e => setAgentInfo(p => ({...p, phone: e.target.value}))} className="w-full bg-transparent px-3 py-1.5 text-[10px] font-medium focus:outline-none" placeholder="50 123 4567" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">WhatsApp Number</label>
                                            <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                                                <div className="flex items-center bg-gray-50 border-r border-gray-200 text-[10px] relative">
                                                    <select 
                                                        className="appearance-none bg-transparent pl-2 pr-6 py-1.5 outline-none font-medium cursor-pointer"
                                                        value={agentInfo.whatsappCode}
                                                        onChange={e => setAgentInfo(p => ({...p, whatsappCode: e.target.value}))}
                                                    >
                                                        <option value="+1">🇺🇸 +1</option>
                                                        <option value="+44">🇬🇧 +44</option>
                                                        <option value="+971">🇦🇪 +971</option>
                                                        <option value="+61">🇦🇺 +61</option>
                                                        <option value="+91">🇮🇳 +91</option>
                                                        <option value="+49">🇩🇪 +49</option>
                                                        <option value="+33">🇫🇷 +33</option>
                                                        <option value="+39">🇮🇹 +39</option>
                                                        <option value="+81">🇯🇵 +81</option>
                                                        <option value="+86">🇨🇳 +86</option>
                                                    </select>
                                                    <FiChevronDown className="absolute right-1.5 text-[8px] text-gray-500 pointer-events-none"/>
                                                </div>
                                                <input type="text" value={agentInfo.whatsapp} onChange={e => setAgentInfo(p => ({...p, whatsapp: e.target.value}))} className="w-full bg-transparent px-3 py-1.5 text-[10px] font-medium focus:outline-none" placeholder="50 123 4567" />
                                            </div>
                                        </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Preferred Contact Method</label>
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-emerald-500 pointer-events-none text-xs"><FiMessageSquare/></div>
                                                    <select 
                                                        value={agentInfo.preferredContact}
                                                        onChange={e => setAgentInfo(p => ({...p, preferredContact: e.target.value}))}
                                                        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-8 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer"
                                                    >
                                                        {contactMethods.map(m => <option key={m} value={m}>{m}</option>)}
                                                    </select>
                                                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Language</label>
                                                <div className="relative w-full">
                                                    <select 
                                                        value={agentInfo.language}
                                                        onChange={e => setAgentInfo(p => ({...p, language: e.target.value}))}
                                                        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer"
                                                    >
                                                        {languages.map(l => <option key={l} value={l}>{l}</option>)}
                                                    </select>
                                                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Time Zone</label>
                                                <div className="relative w-full">
                                                    <select 
                                                        value={agentInfo.timezone}
                                                        onChange={e => setAgentInfo(p => ({...p, timezone: e.target.value}))}
                                                        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer"
                                                    >
                                                        {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                                    </select>
                                                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"/>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between items-end mb-1.5">
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide">Agent Description</label>
                                            </div>
                                            <div className="relative">
                                                <textarea 
                                                    value={agentInfo.description}
                                                    onChange={e => setAgentInfo(p => ({...p, description: e.target.value}))}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm resize-none" 
                                                    rows="3"
                                                ></textarea>
                                                <span className="absolute bottom-1.5 right-2 text-[8px] text-gray-400 font-bold bg-white">{agentInfo.description?.length || 0} / 1000</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Social Profiles <span className="text-gray-400 font-medium normal-case">(Optional)</span></label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-pink-500 pointer-events-none text-[10px]"><FiInstagram/></div>
                                                    <input 
                                                        type="text" 
                                                        value={agentInfo.social.instagram}
                                                        onChange={e => setAgentInfo(p => ({...p, social: {...p.social, instagram: e.target.value}}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        placeholder="instagram.com/username"
                                                    />
                                                </div>
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-blue-600 pointer-events-none text-[10px]"><FiLinkedin/></div>
                                                    <input 
                                                        type="text" 
                                                        value={agentInfo.social.linkedin}
                                                        onChange={e => setAgentInfo(p => ({...p, social: {...p.social, linkedin: e.target.value}}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        placeholder="linkedin.com/in/username"
                                                    />
                                                </div>
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-gray-800 pointer-events-none text-[10px] font-serif font-black">X</div>
                                                    <input 
                                                        type="text" 
                                                        value={agentInfo.social.x || agentInfo.social.twitter}
                                                        onChange={e => setAgentInfo(p => ({...p, social: {...p.social, x: e.target.value, twitter: e.target.value}}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        placeholder="x.com/username"
                                                    />
                                                </div>
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-blue-500 pointer-events-none text-[10px]"><FiFacebook/></div>
                                                    <input 
                                                        type="text" 
                                                        value={agentInfo.social.facebook}
                                                        onChange={e => setAgentInfo(p => ({...p, social: {...p.social, facebook: e.target.value}}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        placeholder="facebook.com/username"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-3 mt-auto shrink-0 border-t border-gray-50 flex">
                                        <button 
                                            onClick={handleSavePersonalDetails}
                                            disabled={savingPersonal}
                                            className={`px-5 py-2 ${savingPersonal ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'} border border-transparent shadow-sm text-white rounded-[10px] text-[10px] font-bold transition-colors flex items-center gap-2`}
                                        >
                                            {savingPersonal && <FiRefreshCw className="animate-spin" />}
                                            {savingPersonal ? 'Saving...' : 'Save Personal Details'}
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Company Details */}
                                <div className="flex-1 bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] p-4 flex flex-col relative h-full">
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4 shrink-0">
                                        <div className="flex gap-3 items-center">
                                            <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center text-[12px] shrink-0">2</div>
                                            <div className="flex flex-col">
                                                <h3 className="text-[13px] font-bold text-gray-900 leading-tight">Your Dealer / Company Details</h3>
                                                <p className="text-[9px] text-gray-400 font-medium leading-tight mt-0.5">This information represents your business and will be visible to clients.</p>
                                            </div>
                                        </div>
                                        <div className="bg-emerald-50 text-emerald-600 px-2 py-1 flex items-center gap-1 rounded-full text-[9px] font-bold shrink-0">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified
                                        </div>
                                    </div>
                                    
                                    {/* Form Fields container */}
                                    <div className="flex-1 overflow-auto custom-scrollbar pr-2 flex flex-col gap-3">
                                        {/* Cover Photo Upload */}
                                        <div className="relative h-24 bg-gray-50 rounded-xl border border-dashed border-gray-200 overflow-hidden group shrink-0">
                                           {companyInfo.coverPhoto ? (
                                               <img src={companyInfo.coverPhoto} className="w-full h-full object-cover" alt="Company Cover" />
                                           ) : (
                                               <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-1">
                                                   <FiImage className="text-lg" />
                                                   <span className="text-[8px] font-bold uppercase tracking-wider">Upload Cover Photo</span>
                                               </div>
                                           )}
                                           <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                               <div className="flex flex-col items-center text-white gap-1">
                                                   <FiUpload className="text-sm" />
                                                   <span className="text-[9px] font-bold">Change Cover</span>
                                               </div>
                                               <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} disabled={isUploadingCover} />
                                           </label>
                                           {isUploadingCover && (
                                               <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                                                   <FiRefreshCw className="text-[#D48D2A] animate-spin text-sm" />
                                               </div>
                                           )}
                                        </div>

                                        <div className="flex justify-between gap-4">                                            <div className="flex-1 flex flex-col gap-3">
                                                <div>
                                                    <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Company / Dealership Name</label>
                                                    <input 
                                                       type="text" 
                                                       value={companyInfo.name}
                                                       onChange={e => setCompanyInfo(p => ({...p, name: e.target.value}))}
                                                       className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="col-span-2">
                                                        <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Website</label>
                                                        <input 
                                                           type="text" 
                                                           value={companyInfo.website}
                                                           onChange={e => setCompanyInfo(p => ({...p, website: e.target.value}))}
                                                           className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        />
                                                    </div>
                                                </div>                                            </div>
                                            <div className="flex flex-col gap-1.5 min-w-[140px]">
                                                <label className="text-[9px] font-bold text-gray-700 capitalize tracking-wide">Company Logo</label>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden shrink-0">
                                                        {companyInfo.logo ? (
                                                            <img src={companyInfo.logo} className="w-full h-full object-contain" alt="Company Logo" />
                                                        ) : (
                                                            <div className="text-[20px] font-black text-gray-300">V</div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col justify-center">
                                                        <label className={`px-2 py-1.5 bg-white border border-gray-200 rounded-lg text-[9px] font-bold ${logoLoading ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-50 cursor-pointer'} flex items-center gap-1 whitespace-nowrap shadow-sm`}>
                                                            {logoLoading ? <span className="animate-spin text-[10px]" /> : <FiUpload/>} 
                                                            {logoLoading ? 'Uploading...' : 'Upload Logo'}
                                                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={logoLoading} />
                                                        </label>
                                                        <span className="text-[8px] text-gray-400 mt-1 font-medium">JPG, PNG up to 5MB</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Company Email</label>
                                                <input 
                                                    type="email" 
                                                    value={companyInfo.email}
                                                    onChange={e => setCompanyInfo(p => ({...p, email: e.target.value}))}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Business Type</label>
                                                <div className="relative w-full">
                                                    <select 
                                                        value={companyInfo.businessType}
                                                        onChange={e => setCompanyInfo(p => ({...p, businessType: e.target.value}))}
                                                        className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm cursor-pointer"
                                                    >
                                                        {businessTypes.map(b => <option key={b} value={b}>{b}</option>)}
                                                    </select>
                                                    <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px] pointer-events-none"/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Established Year</label>
                                                <div className="relative w-full">
                                                    <div className="absolute right-2.5 inset-y-0 flex items-center text-gray-400 pointer-events-none text-[10px]"><FiCalendar/></div>
                                                    <input 
                                                        type="text" 
                                                        value={companyInfo.establishedYear}
                                                        onChange={e => setCompanyInfo(p => ({...p, establishedYear: e.target.value}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Office Address</label>
                                                <input 
                                                    type="text" 
                                                    value={companyInfo.address}
                                                    onChange={e => setCompanyInfo(p => ({...p, address: e.target.value}))}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Phone Number</label>
                                                <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm">
                                                    <div className="flex items-center bg-gray-50 border-r border-gray-200 text-[10px] relative">
                                                        <select 
                                                            className="appearance-none bg-transparent pl-2 pr-6 py-1.5 outline-none font-medium cursor-pointer"
                                                            value={companyInfo.phoneCode}
                                                            onChange={e => setCompanyInfo(p => ({...p, phoneCode: e.target.value}))}
                                                        >
                                                            <option value="+1">🇺🇸 +1</option>
                                                            <option value="+44">🇬🇧 +44</option>
                                                            <option value="+971">🇦🇪 +971</option>
                                                            <option value="+61">🇦🇺 +61</option>
                                                            <option value="+91">🇮🇳 +91</option>
                                                            <option value="+49">🇩🇪 +49</option>
                                                            <option value="+33">🇫🇷 +33</option>
                                                            <option value="+39">🇮🇹 +39</option>
                                                            <option value="+81">🇯🇵 +81</option>
                                                            <option value="+86">🇨🇳 +86</option>
                                                        </select>
                                                        <FiChevronDown className="absolute right-1.5 text-[8px] text-gray-500 pointer-events-none"/>
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={companyInfo.phone}
                                                        onChange={e => setCompanyInfo(p => ({...p, phone: e.target.value}))}
                                                        className="w-full bg-transparent px-3 py-1.5 text-[10px] font-medium focus:outline-none" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div className="flex justify-between items-end mb-1.5">
                                                <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide">Dealer / Agent Description</label>
                                            </div>
                                            <div className="relative">
                                                <textarea 
                                                    value={companyInfo.description}
                                                    onChange={e => setCompanyInfo(p => ({...p, description: e.target.value}))}
                                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-[10px] font-medium focus:border-[#D48D2A] outline-none shadow-sm resize-none" 
                                                    rows="3"
                                                ></textarea>
                                                <span className="absolute bottom-1.5 right-2 text-[8px] text-gray-400 font-bold bg-white">{companyInfo.description?.length || 0} / 1000</span>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-[9px] font-bold text-gray-700 capitalize tracking-wide mb-1.5">Company Social Media <span className="text-gray-400 font-medium normal-case">(Optional)</span></label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-pink-500 pointer-events-none text-[10px]"><FiInstagram/></div>
                                                    <input 
                                                        type="text" 
                                                        value={companyInfo.social.instagram}
                                                        onChange={e => setCompanyInfo(p => ({...p, social: {...p.social, instagram: e.target.value}}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        placeholder="instagram.com/username"
                                                    />
                                                </div>
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-blue-600 pointer-events-none text-[10px]"><FiLinkedin/></div>
                                                    <input 
                                                        type="text" 
                                                        value={companyInfo.social.linkedin}
                                                        onChange={e => setCompanyInfo(p => ({...p, social: {...p.social, linkedin: e.target.value}}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        placeholder="linkedin.com/company/username"
                                                    />
                                                </div>
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-blue-500 pointer-events-none text-[10px]"><FiFacebook/></div>
                                                    <input 
                                                        type="text" 
                                                        value={companyInfo.social.facebook}
                                                        onChange={e => setCompanyInfo(p => ({...p, social: {...p.social, facebook: e.target.value}}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        placeholder="facebook.com/username"
                                                    />
                                                </div>
                                                <div className="relative w-full">
                                                    <div className="absolute inset-y-0 left-2.5 flex items-center text-red-600 pointer-events-none text-[10px]"><FiYoutube/></div>
                                                    <input 
                                                        type="text" 
                                                        value={companyInfo.social.youtube}
                                                        onChange={e => setCompanyInfo(p => ({...p, social: {...p.social, youtube: e.target.value}}))}
                                                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 pl-7 text-[9px] font-medium focus:border-[#D48D2A] outline-none shadow-sm" 
                                                        placeholder="youtube.com/@username"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-3 mt-auto shrink-0 border-t border-gray-50 flex">
                                        <button 
                                            onClick={handleSaveCompanyDetails}
                                            disabled={savingCompany}
                                            className={`px-5 py-2 ${savingCompany ? 'bg-gray-400' : 'bg-gray-900 hover:bg-gray-800'} border border-transparent shadow-sm text-white rounded-[10px] text-[10px] font-bold transition-colors flex items-center gap-2`}
                                        >
                                            {savingCompany && <FiRefreshCw className="animate-spin" />}
                                            {savingCompany ? 'Saving...' : 'Save Company Details'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* 3 Bottom Cards */}
                            <div className="grid grid-cols-3 gap-4 shrink-0 mt-2">
                                {/* Card 1: Verification Status */}
                                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] flex flex-col justify-between overflow-hidden">
                                    <div className="p-3 pb-1 flex gap-2">
                                        <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100"><FiShield className="text-[10px]"/></div>
                                        <div className="flex flex-col">
                                            <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Verification Status</h4>
                                            <p className="text-[9px] text-gray-400 font-medium">Get verified to increase trust and lead priority.</p>
                                        </div>
                                    </div>
                                    <div className="px-3 flex justify-between items-center bg-white flex-1">
                                        <div className="flex flex-col gap-1 w-full mt-1">
                                            {['Identity Verification', 'Business Verification', 'Phone Verification'].map(v => (
                                                <div key={v} className="flex justify-between items-center text-[9px]">
                                                    <span className="flex items-center gap-1.5 text-gray-600 font-medium"><FiCheckCircle className="text-gray-400 text-[9px]"/> {v}</span>
                                                    <span className="text-emerald-500 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div> Verified</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 py-1.5 border-t border-gray-100 text-center">
                                        <button className="text-[9px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full" onClick={() => setIsVerificationModalOpen(true)}>View Verification Details</button>
                                    </div>
                                </div>
                                
                                {/* Card 2: Lead Preferences */}
                                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] flex flex-col justify-between overflow-hidden">
                                    <div className="p-3 pb-1 flex gap-2">
                                        <div className="w-6 h-6 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0 border border-purple-100"><FiFilter className="text-[10px]"/></div>
                                        <div className="flex flex-col">
                                            <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Lead Preferences</h4>
                                            <p className="text-[9px] text-gray-400 font-medium">Control how and when you receive leads.</p>
                                        </div>
                                    </div>
                                    <div className="px-3 flex gap-4 bg-white flex-1 pt-1.5">
                                        <div className="flex-1 flex flex-col justify-center gap-1.5">
                                            {['Lead Notifications', 'Email Notifications', 'WhatsApp Notifications'].map(n => (
                                                <div key={n} className="flex justify-between items-center text-[9px] font-medium text-gray-600">
                                                    <span>{n}</span>
                                                    <div className="w-6 h-3 bg-orange-400 rounded-full flex items-center p-0.5"><div className="w-2.5 h-2.5 bg-white rounded-full ml-auto shadow-sm"></div></div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center gap-1.5">
                                            <div>
                                                <span className="text-[8px] text-gray-400 font-bold mb-0.5 block">Preferred Lead Types</span>
                                                <div className="border border-gray-200 rounded flex justify-between items-center px-1.5 py-0.5">
                                                    <span className="text-[9px] text-gray-600 font-medium">All Categories</span><FiChevronDown className="text-gray-400 text-[8px]"/>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[8px] text-gray-400 font-bold mb-0.5 block">Preferred Locations</span>
                                                <div className="border border-gray-200 rounded flex justify-between items-center px-1.5 py-0.5">
                                                    <span className="text-[9px] text-gray-600 font-medium">All Locations</span><FiChevronDown className="text-gray-400 text-[8px]"/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 py-1.5 border-t border-gray-100 text-center">
                                        <button className="text-[9px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full">Manage Lead Preferences</button>
                                    </div>
                                </div>
                                
                                {/* Card 3: Account & Security */}
                                <div className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[1.2rem] flex flex-col justify-between overflow-hidden">
                                    <div className="p-3 pb-1 flex gap-2">
                                        <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 border border-blue-100"><FiLock className="text-[10px]"/></div>
                                        <div className="flex flex-col">
                                            <h4 className="text-[11px] font-bold text-gray-900 leading-tight">Account & Security</h4>
                                            <p className="text-[9px] text-gray-400 font-medium">Manage your account security and access.</p>
                                        </div>
                                    </div>
                                    <div className="px-3 flex flex-col gap-1.5 bg-white flex-1 justify-center relative -top-0.5">
                                        <div className="flex justify-between items-center text-[9px] font-medium text-gray-600">
                                            <span className="flex items-center gap-1.5 text-gray-700"><FiShield className="text-[10px] text-gray-400"/> Change Password</span>
                                            <FiChevronRight className="text-gray-400"/>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] font-medium text-gray-600">
                                            <span className="flex items-center gap-1.5 text-gray-700"><FiCheckCircle className="text-[10px] text-gray-400"/> Two-Factor Authentication</span>
                                            <span className="text-emerald-500 font-bold">Enabled</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[9px] font-medium text-gray-600">
                                            <span className="flex items-center gap-1.5 text-gray-700"><FiMonitor className="text-[10px] text-gray-400"/> Active Sessions</span>
                                            <span className="bg-gray-100 text-gray-600 px-1.5 rounded font-bold border border-gray-200">2</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 py-1.5 border-t border-gray-100 text-center">
                                        <button className="text-[9px] font-bold text-gray-600 hover:text-[#D48D2A] transition-colors w-full">Manage Security</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </main >
            </div >

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                type={contactType}
                token={token}
            />
            
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

            <AddLeadModal
                isOpen={isAddLeadModalOpen}
                onClose={() => setIsAddLeadModalOpen(false)}
                onCreated={() => fetchDashboard()}
                token={token}
                inventory={data?.inventory || []}
            />

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                message="Are you sure you want to delete this listing? This cannot be undone."
                isLoading={isDeleting}
            />

            <DealerVerificationModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onSubmit={handleVerificationSubmit}
                user={user}
            />

            {showCropModal && (
                <ImageCropModal
                    src={cropSrc}
                    onCropComplete={handleCropComplete}
                    onClose={() => setShowCropModal(false)}
                    isUploading={logoLoading || isUploadingCover}
                />
            )}

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
                            <h3 className="text-xl font-bold text-gray-900 canela mb-1">Upgrade to {upgradePlan}</h3>
                            <p className="text-gray-400 text-sm">
                                {upgradePlan === 'Business VIP' ? '$299.00 / month' : '$99.00 / month'}
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

            {/* View Lead Modal */}
            {viewLead && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-[16px] font-bold text-gray-900 canela">Lead Details</h2>
                            <button onClick={() => setViewLead(null)} className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"><FiX /></button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1">Contact Info</span>
                                <span className="text-[13px] font-bold text-gray-900">{viewLead.name}</span>
                                <span className="text-[11px] font-medium text-gray-500">{viewLead.email} • {viewLead.phone}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1">Source & Status</span>
                                <div className="flex gap-2">
                                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{viewLead.source || 'Website'}</span>
                                    <span className="text-[11px] font-bold text-[#D48D2A] bg-[#FFF8F0] px-2 py-0.5 rounded">{viewLead.status}</span>
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1">Date Received</span>
                                <span className="text-[12px] font-bold text-gray-700">{viewLead.date ? new Date(viewLead.date).toLocaleString() : 'Unknown'}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-1">Message Provided</span>
                                <div className="bg-gray-50 rounded-xl p-4 text-[12px] font-medium text-gray-700 border border-gray-100 whitespace-pre-wrap">
                                    {viewLead.message || "No specific message provided."}
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => setViewLead(null)} className="px-5 py-2 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Close View</button>
                        </div>
                    </div>
                </div>
            )}

        </div >
    );
};

const AnalyticsCard = ({ title, value, growth, icon, iconBgClass, chartColor, data }) => (
    <div className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:border-gray-200 transition-all">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-sm ${iconBgClass || 'bg-gray-50 text-gray-600'}`}>
                {icon}
            </div>
        </div>
        <div className="flex flex-col gap-1 mt-4">
            <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold flex items-center ${growth.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                    {growth.startsWith('+') ? <FiTrendingUp className="mr-0.5" /> : <FiTrendingDown className="mr-0.5" />} {growth}
                </span>
                <span className="text-[10px] text-gray-400 font-medium">vs last 30 days</span>
            </div>
            {data && data.length > 0 && (
                <div className="h-8 mt-2 w-full">
                   <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <Line type="monotone" dataKey="value" stroke={chartColor || '#D48D2A'} strokeWidth={2} dot={false} isAnimationActive={false} />
                        </LineChart>
                   </ResponsiveContainer>
                </div>
            )}
        </div>
    </div>
);

const SettingsInputField = ({ label, value, icon, readOnly, onChange }) => (
    <div>
        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            {icon && <span className="text-gray-400">{icon}</span>}
            {label}
            {readOnly && <span className="ml-auto text-[9px] text-emerald-600 font-black uppercase tracking-widest">Verified</span>}
        </label>
        <input
            type="text"
            value={value}
            readOnly={readOnly}
            onChange={onChange}
            className={`w-full border-transparent rounded-[1.25rem] px-6 py-4 text-sm font-bold focus:outline-none transition-all shadow-inner ${readOnly
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                : 'bg-[#E5E7EB]/30 text-gray-900 focus:border-[#D48D2A] focus:bg-white'
                }`}
        />
    </div>
);

const SettingsActionRow = ({ label, desc, btnText, isToggle, isOn, onToggle }) => (
    <div className="flex items-center justify-between p-8 rounded-[1.5rem] bg-[#E5E7EB]/10 border border-gray-50 group hover:border-gray-200 transition-all">
        <div>
            <h5 className="text-sm font-bold text-gray-900 mb-1">{label}</h5>
            <p className="text-xs text-gray-400 font-medium">{desc}</p>
        </div>
        {isToggle ? (
            <div
                onClick={onToggle}
                className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${isOn ? 'bg-[#D48D2A]' : 'bg-gray-300'
                    }`}
            >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-sm ${isOn ? 'left-8' : 'left-1'
                    }`}></div>
            </div>
        ) : (
            <button className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-600 shadow-sm hover:border-[#D48D2A] hover:text-[#D48D2A] transition-all">
                {btnText}
            </button>
        )}
    </div>
);

export default Inventory;
