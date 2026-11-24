import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

// CMS Modular Components
import ContentManagementSidebar from '../components/admin/ContentManagementSidebar';
import ContentManagementHeader from '../components/admin/ContentManagementHeader';
import RankingCategoryForm from '../components/admin/RankingCategoryForm';
import RankingCategoryTable from '../components/admin/RankingCategoryTable';
import RankingsDashboardTab from '../components/admin/RankingsDashboardTab';
import { FiAward, FiLayers, FiChevronRight, FiTrash2, FiSearch, FiImage } from 'react-icons/fi';

import carIcon from '../assets/icons/car_icon.png';
import estateIcon from '../assets/icons/estate_icon.png';
import yachtIcon from '../assets/icons/yacht_icon.png';

const ContentManagement = () => {
    const getTypeColor = (type) => {
        switch (type) {
            case 'Cars': return 'bg-[#6366F1]/10 text-[#818CF8] border border-[#6366F1]/30';
            case 'Real Estate': return 'bg-[#D48D2A]/10 text-[#F59E0B] border border-[#D48D2A]/30';
            case 'Yachts': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30';
            case 'Bikes': return 'bg-purple-500/10 text-purple-400 border border-purple-500/30';
            case 'Content Creator': return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
            default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/30';
        }
    };
    const { token, user, loading } = useAuth();
    const navigate = useNavigate();
    
    // Layout states
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Core Categories State (Loaded from backend DB)
    const [categories, setCategories] = useState([]);
    const [fetchingCategories, setFetchingCategories] = useState(false);

    // Currently editing record state
    const [editingCategory, setEditingCategory] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // Inline Nominee Editing & Reordering States
    const [viewingCategory, setViewingCategory] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSubmittingInline, setIsSubmittingInline] = useState(false);
    const [editingNomineeInlineIndex, setEditingNomineeInlineIndex] = useState(null);
    const [editNomineeInlineData, setEditNomineeInlineData] = useState(null);

    // Sync categories with local viewingCategory state
    useEffect(() => {
        if (activeTab.startsWith('listings-')) {
            const categoryId = activeTab.split('listings-')[1];
            const cat = categories.find(c => c.id === categoryId || c._id === categoryId);
            if (cat) {
                setViewingCategory(JSON.parse(JSON.stringify(cat)));
            }
        } else {
            setViewingCategory(null);
            setSearchQuery('');
            setSearchResults([]);
            setEditingNomineeInlineIndex(null);
            setEditNomineeInlineData(null);
        }
    }, [activeTab, categories]);

    const loadCategories = async () => {
        if (!token) return;
        setFetchingCategories(true);
        try {
            const response = await fetch('/api/admin/ranking-categories', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Load Categories Error:", error);
        } finally {
            setFetchingCategories(false);
        }
    };

    // Route Gate Guarding & Notifications Fetch
    useEffect(() => {
        if (!loading) {
            if (!token || !user || user.role !== 'admin') {
                navigate('/');
            } else {
                fetchNotifications();
                loadCategories();
            }
        }
    }, [token, user, loading, navigate]);

    const fetchNotifications = async () => {
        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const statsRes = await fetch('/api/admin/stats', { headers });
            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setNotifications(statsData.notifications || []);
            }
        } catch (error) {
            console.error("CMS Notifications Fetch Error:", error);
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

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleSubmitCategory = async (formData) => {
        try {
            const isEdit = !!(editingCategory || formData._id || formData.id);
            const method = isEdit ? 'PUT' : 'POST';
            const catId = (editingCategory?._id || editingCategory?.id) || (formData?._id || formData?.id);
            const endpoint = isEdit 
                ? `/api/admin/ranking-categories/${catId}` 
                : '/api/admin/ranking-categories';

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert(isEdit ? 'Ranking Category updated successfully!' : 'New Ranking Category created successfully!');
                setEditingCategory(null);
                loadCategories();
            } else {
                const err = await response.json();
                alert(err.message || 'Failed to save ranking category.');
            }
        } catch (error) {
            console.error("Submit Category Error:", error);
            alert('Error saving ranking category.');
        }
    };

    const handleEditTrigger = (category) => {
        setEditingCategory(category);
        setActiveTab('categories');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteTrigger = async (id) => {
        if (confirm('Are you sure you want to delete this ranking category? All its nominees will be deleted too.')) {
            try {
                const response = await fetch(`/api/admin/ranking-categories/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    alert('Ranking Category deleted successfully!');
                    loadCategories();
                    if (activeTab === `listings-${id}`) {
                        setActiveTab('listings');
                    }
                } else {
                    const err = await response.json();
                    alert(err.message || 'Failed to delete category.');
                }
            } catch (error) {
                console.error("Delete Category Error:", error);
                alert('Error deleting category.');
            }
        }
    };

    // Inline Nominees Drag and Drop handlers
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, hoverIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === hoverIndex) return;

        setViewingCategory(prev => {
            if (!prev) return prev;
            const newNominees = [...prev.nominees];
            const draggedNominee = newNominees[draggedIndex];
            
            newNominees.splice(draggedIndex, 1);
            newNominees.splice(hoverIndex, 0, draggedNominee);
            
            setDraggedIndex(hoverIndex);
            
            return {
                ...prev,
                nominees: newNominees
            };
        });
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Search and Add Nominees
    const handleNomineeSearch = async (val) => {
        setSearchQuery(val);
        if (!val.trim()) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const categoryMap = {
                'Cars': 'cars|vehicles',
                'Real Estate': 'estates',
                'Yachts': 'yachts',
                'Bikes': 'bikes'
            };
            const queryCategory = categoryMap[viewingCategory.type] || '';
            const url = `/api/assets/combined?q=${encodeURIComponent(val)}&category=${queryCategory}&limit=10`;
            const response = await fetch(url);
            if (response.ok) {
                const resData = await response.json();
                if (resData && Array.isArray(resData.data)) {
                    const formatted = resData.data.map(asset => {
                        const detailParts = [];
                        if (asset.brand) detailParts.push(asset.brand);
                        if (asset.specification?.model) detailParts.push(asset.specification.model);
                        if (asset.location) detailParts.push(asset.location);
                        
                        const priceStr = asset.isPriceOnRequest 
                            ? 'Price on Request' 
                            : (asset.price ? `$${Number(asset.price).toLocaleString()}` : '');
                        if (priceStr) detailParts.push(priceStr);

                        const isEstate = viewingCategory.type === 'Real Estate';
                        return {
                            id: asset._id || asset.id,
                            name: asset.title || 'Unnamed Asset',
                            detail: detailParts.join(' · '),
                            image: asset.images && asset.images[0] ? asset.images[0] : '',
                            votes: 0,
                            brand: isEstate 
                                ? (asset.keySpecifications?.propertyType || asset.specification?.propertyType || '')
                                : (asset.brand || ''),
                            model: isEstate 
                                ? (asset.location || '')
                                : (asset.specification?.model || asset.variant || ''),
                            description: asset.description || '',
                            listingLink: `/assets/${asset._id || asset.id}`,
                            keyDetails: isEstate ? {
                                 ownership: asset.specification?.ownership || '',
                                 zoning: asset.specification?.zoning || '',
                                 availabilityStatus: asset.specification?.availabilityStatus || asset.availability || '',
                                 listingId: asset.specification?.listingId || asset.referenceId || '',
                                 livingArea: asset.keySpecifications?.builtUpArea || asset.specification?.builtUpArea || '',
                                 landSize: asset.keySpecifications?.landArea || asset.specification?.landArea || '',
                                 bedroom: asset.keySpecifications?.bedrooms?.toString() || asset.specification?.bedrooms?.toString() || '',
                                 bathroom: asset.keySpecifications?.bathrooms?.toString() || asset.specification?.bathrooms?.toString() || '',
                                 propertyType: asset.keySpecifications?.propertyType || asset.specification?.propertyType || '',
                                 yearBuilt: asset.specification?.yearOfConstruction?.toString() || '',
                                 architect: asset.specification?.architectureStyle || '',
                                 interiorDesign: asset.specification?.interiorMaterial || '',
                                 garageCapacity: asset.keySpecifications?.garageCapacity?.toString() || asset.specification?.garageCapacity?.toString() || '',
                                 floors: asset.keySpecifications?.floors?.toString() || asset.specification?.floors?.toString() || '',
                                 prestigeScore: '',
                                 architectureScore: '',
                                 locationScore: '',
                                 amenitiesScore: '',
                                 investmentScore: '',
                                 exclusivityScore: '',
                                 annualAppreciation: ''
                             } : {},
                             sources: [
                                 { title: 'Listing Link', url: `https://otulia.com/assets/${asset._id || asset.id}` }
                             ]
                        };
                    });
                    setSearchResults(formatted);
                }
            }
        } catch (err) {
            console.error("Search error in inline details:", err);
        } finally {
            setIsSearching(false);
        }
    };

    const addNomineeInline = (asset) => {
        setViewingCategory(prev => {
            if (!prev) return prev;
            if (prev.nominees.some(n => n.id === asset.id || n._id === asset.id || n._id === asset._id)) {
                alert("Nominee already added to this category.");
                return prev;
            }
            return {
                ...prev,
                nominees: [...prev.nominees, asset]
            };
        });
        setSearchQuery('');
        setSearchResults([]);
    };

    const addCustomNomineeInline = () => {
        const customId = 'custom-' + Date.now();
        const isContentCreator = viewingCategory.type === 'Content Creator';
        const slugType = isContentCreator 
            ? 'contentcreators' 
            : (viewingCategory.type === 'Real Estate' ? 'real-estate' : (viewingCategory.type ? viewingCategory.type.toLowerCase() : 'cars'));
        const newNominee = {
            id: customId,
            name: isContentCreator ? 'New Creator Nominee' : 'New Custom Nominee',
            detail: isContentCreator ? 'Content Creator' : 'Custom Nominee',
            image: '',
            banner: '',
            channelName: '',
            votes: 0,
            fakeVotes: 0,
            brand: '',
            model: '',
            description: '',
            listingLink: '',
            keyDetails: isContentCreator ? {
                subscribers: '',
                views: '',
                category: '',
                location: '',
                joinDate: '',
                youtubeFollowers: '',
                instagramFollowers: '',
                twitterFollowers: '',
                tiktokFollowers: '',
                totalFollowers: ''
            } : {},
            sources: [
                { title: 'Listing Link', url: `https://otulia.com/ranking/${slugType}/` }
            ],
            youtube: '',
            instagram: '',
            twitter: '',
            tiktok: '',
            youtubeFollowers: '',
            instagramFollowers: '',
            twitterFollowers: '',
            tiktokFollowers: '',
            totalFollowers: ''
        };
        setViewingCategory(prev => ({
            ...prev,
            nominees: [...prev.nominees, newNominee]
        }));
    };

    const removeNomineeInline = (id) => {
        setViewingCategory(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                nominees: prev.nominees.filter(n => n.id !== id && n._id !== id)
            };
        });
    };

    const handleSaveChangesInline = async () => {
        if (!viewingCategory) return;
        setIsSubmittingInline(true);
        try {
            await handleSubmitCategory(viewingCategory);
        } catch (err) {
            console.error("Inline save error:", err);
        } finally {
            setIsSubmittingInline(false);
        }
    };

    const handleAddNewTrigger = () => {
        setEditingCategory(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderTabContent = () => {
        if (activeTab === 'dashboard') {
            return (
                <RankingsDashboardTab 
                    onTabChange={setActiveTab} 
                    categories={categories}
                    onCreateCategoryClick={() => {
                        setEditingCategory(null);
                        setActiveTab('categories');
                    }} 
                />
            );
        }
        
        if (activeTab === 'categories') {
            return (
                <>
                    {/* Add/Edit Section Header */}
                    <div className="flex justify-between items-center text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-normal tracking-wide text-white canela">
                                {editingCategory ? 'Edit Ranking Category' : 'Add New Ranking Category'}
                            </h2>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                Rankings <span className="text-gray-600 font-semibold">&gt;</span> Categories <span className="text-gray-600 font-semibold">&gt;</span> {editingCategory ? 'Edit' : 'Add New'}
                            </p>
                        </div>
                    </div>

                    {/* Stepper Form Block */}
                    <RankingCategoryForm 
                        initialData={editingCategory} 
                        onSubmit={handleSubmitCategory} 
                        onCancel={() => setEditingCategory(null)} 
                    />

                    {/* Existing Categories Table View */}
                    <RankingCategoryTable 
                        categories={categories} 
                        onEdit={handleEditTrigger} 
                        onDelete={handleDeleteTrigger} 
                        onAddNew={handleAddNewTrigger} 
                    />
                </>
            );
        }
        
        if (activeTab === 'listings') {
            return (
                <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex justify-between items-center text-left">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-normal tracking-wide text-white canela">
                                Listings Management
                            </h2>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                Listings <span className="text-gray-600 font-semibold">&gt;</span> Overview
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        {categories.length === 0 ? (
                            <div className="col-span-full bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                                <p className="text-xs text-gray-400 font-medium">No categories found in the database. Go to Rankings &gt; Categories to add some.</p>
                            </div>
                        ) : (
                            categories.map((c) => {
                                const nomineeCount = c.nominees ? c.nominees.length : 0;
                                return (
                                    <div key={c.id || c._id} className="bg-[#111726]/60 border border-[#1C253B] rounded-[2.5rem] overflow-hidden group hover:border-[#2C3B5E] transition-all duration-300 backdrop-blur-md flex flex-col">
                                        {/* Cover image banner */}
                                        <div className="h-44 relative overflow-hidden border-b border-[#1C253B]/50 shrink-0">
                                            {c.categoryImage ? (
                                                <img src={c.categoryImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                            ) : (
                                                <div className="w-full h-full bg-[#0B0F19] flex items-center justify-center text-gray-700 font-bold">No Image</div>
                                            )}
                                            {/* Overlay with type badge */}
                                            <div className="absolute top-4 left-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${getTypeColor(c.type)}`}>
                                                    {c.type}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Body */}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div className="space-y-2">
                                                <h3 className="text-base font-normal text-white canela tracking-wide truncate" title={c.title}>{c.title}</h3>
                                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed h-10">{c.shortDescription || 'No description provided.'}</p>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-[#1B243B]/50 flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                                <div>
                                                    <span className="block text-gray-400 text-xs font-normal mb-0.5">{nomineeCount}</span>
                                                    <span>Nominees</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block text-white text-xs font-normal mb-0.5">{c.votes || '0'}</span>
                                                    <span>Total Votes</span>
                                                </div>
                                            </div>

                                            <div className="mt-5 flex gap-2 w-full">
                                                <button 
                                                    onClick={() => setActiveTab(`listings-${c.id || c._id}`)}
                                                    className="flex-1 py-3 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] text-gray-200 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300"
                                                >
                                                    View Nominees
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteTrigger(c.id || c._id)}
                                                    className="px-4 py-3 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-xl transition-all duration-300"
                                                    title="Delete Category Listing"
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            );
        }
        
        if (activeTab.startsWith('listings-')) {
            const categoryId = activeTab.split('listings-')[1];
            const category = categories.find(c => c.id === categoryId || c._id === categoryId);
            
            if (!category || !viewingCategory) {
                return (
                    <div className="bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                        <p className="text-xs text-gray-400 font-medium">Category not found.</p>
                    </div>
                );
            }

            const displayNominees = viewingCategory.nominees || [];

            return (
                <div className="space-y-8 animate-in fade-in duration-500 pb-24">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                        <div>
                            <button 
                                onClick={() => setActiveTab('listings')}
                                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white mb-2 transition-colors"
                            >
                                &larr; Back to Listings
                            </button>
                            <h2 className="text-xl sm:text-2xl font-normal tracking-wide text-white canela">
                                {viewingCategory.title}
                            </h2>
                            <p className="text-[10px] sm:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                                Listings <span className="text-gray-600 font-semibold">&gt;</span> Category Rankings <span className="text-gray-600 font-semibold">&gt;</span> {viewingCategory.title}
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-wider ${getTypeColor(viewingCategory.type)}`}>
                                {viewingCategory.type}
                            </span>
                            <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                viewingCategory.status === 'Active' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            }`}>
                                {viewingCategory.status}
                            </span>
                            <button 
                                onClick={() => handleEditTrigger(category)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366F1]/10 hover:bg-[#6366F1]/20 border border-[#6366F1]/30 hover:border-[#6366F1]/50 text-[#818CF8] hover:text-[#A5B4FC] rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300"
                            >
                                Edit Category Details
                            </button>
                            <button
                                onClick={() => handleDeleteTrigger(viewingCategory.id || viewingCategory._id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all duration-300"
                                title="Delete Category Listing"
                            >
                                <FiTrash2 className="text-[10px]" /> Delete Category
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#111726]/60 border border-[#1C253B] p-6 sm:p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-md text-left flex flex-col md:flex-row gap-6 items-start md:items-center">
                        {viewingCategory.categoryImage && (
                            <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0 border border-[#1C253B]">
                                <img src={viewingCategory.categoryImage} alt={viewingCategory.title} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="space-y-2 flex-1">
                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                {viewingCategory.detailedDescription || viewingCategory.shortDescription || 'No description provided.'}
                            </p>
                            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                <div>
                                    <span className="text-gray-400">Voting Period: </span>
                                    <span className="text-white font-mono">{viewingCategory.votingPeriodStart ? `${new Date(viewingCategory.votingPeriodStart).toLocaleDateString()} - ${new Date(viewingCategory.votingPeriodEnd).toLocaleDateString()}` : 'N/A'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Total Votes: </span>
                                    <span className="text-[#D48D2A]">{viewingCategory.votes || '0'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400">Nominee Limit: </span>
                                    <span className="text-white">{viewingCategory.nomineeLimit || 10}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add Nominees Section */}
                    <div className="bg-[#111726]/60 border border-[#1C253B] p-6 rounded-[2.5rem] relative overflow-hidden backdrop-blur-md text-left flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Add Nominees to Leaderboard</h4>
                            <p className="text-xs text-gray-500 mt-1">Create and configure a new nominee manually for this category.</p>
                        </div>
                        
                        <button 
                            type="button"
                            onClick={addCustomNomineeInline}
                            className="py-2.5 px-4 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] hover:bg-[#6366F1]/10 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 animate-in fade-in whitespace-nowrap"
                        >
                            + Add Custom Nominee
                        </button>
                    </div>

                    {/* Rankings & Leaderboard Draggable List */}
                    <div className="space-y-4 text-left">
                        <div className="flex justify-between items-center px-4">
                            <h3 className="text-base font-normal text-white canela tracking-wide flex items-baseline gap-2">
                                Rankings & Leaderboard 
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">(Drag nominees to reorder)</span>
                            </h3>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{displayNominees.length} Nominees registered</p>
                        </div>

                        {displayNominees.length === 0 ? (
                            <div className="bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                                <p className="text-xs text-gray-400 font-medium">No nominees have been added to this category yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3.5">
                                {displayNominees.map((nominee, idx) => {
                                    const rank = idx + 1;
                                    const rankColors = {
                                        1: { border: 'border-[#D48D2A]/50 bg-[#D48D2A]/5', badge: 'bg-[#D48D2A]/20 text-[#D48D2A]' },
                                        2: { border: 'border-slate-400/40 bg-slate-400/5', badge: 'bg-slate-400/20 text-slate-300' },
                                        3: { border: 'border-amber-700/40 bg-amber-700/5', badge: 'bg-amber-700/20 text-amber-600' }
                                    };

                                    const currentRankStyle = rankColors[rank] || { 
                                        border: 'border-[#1C253B]/50 bg-[#151D30]/20', 
                                        badge: 'bg-[#1C253B] text-gray-400' 
                                    };

                                    return (
                                        <div 
                                            key={nominee.id || nominee._id || idx} 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, idx)}
                                            onDragOver={(e) => handleDragOver(e, idx)}
                                            onDragEnd={handleDragEnd}
                                            className={`flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:border-[#2C3B5E] ${currentRankStyle.border} ${draggedIndex === idx ? 'opacity-40 border-dashed border-[#6366F1]' : ''} cursor-grab active:cursor-grabbing group`}
                                        >
                                            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-gray-600 hover:text-white cursor-grab mr-1">
                                                        <FiLayers className="text-sm" />
                                                    </span>
                                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black uppercase tracking-wider ${currentRankStyle.badge}`}>
                                                        #{rank}
                                                    </span>
                                                </div>

                                                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-900 border border-[#2B395B]/40 overflow-hidden shrink-0">
                                                    {nominee.image ? (
                                                        <img src={nominee.image} alt={nominee.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 font-bold">No Image</div>
                                                    )}
                                                </div>

                                                <div className="text-center sm:text-left space-y-1">
                                                    <h4 className="text-sm font-bold text-white tracking-wide">{nominee.name}</h4>
                                                    <p className="text-xs text-gray-400 font-medium line-clamp-1">{nominee.detail || 'No extra details available.'}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-4 sm:gap-6 shrink-0 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-[#1C253B]/50 pt-3 sm:pt-0">
                                                <div className="text-center sm:text-right min-w-[65px]">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Real Votes</p>
                                                    <p className="text-base font-normal text-white canela tracking-wide">{nominee.votes || 0}</p>
                                                </div>

                                                <div className="text-center sm:text-right" onClick={(e) => e.stopPropagation()}>
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Enter Fake Votes</p>
                                                    <input 
                                                        type="number"
                                                        min="0"
                                                        value={nominee.fakeVotes !== undefined && nominee.fakeVotes !== null ? nominee.fakeVotes : ''}
                                                        onChange={(e) => {
                                                            const val = e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0);
                                                            setViewingCategory(prev => {
                                                                if (!prev || !prev.nominees) return prev;
                                                                const updatedNominees = [...prev.nominees];
                                                                updatedNominees[idx] = {
                                                                    ...updatedNominees[idx],
                                                                    fakeVotes: val
                                                                };
                                                                return {
                                                                    ...prev,
                                                                    nominees: updatedNominees
                                                                };
                                                            });
                                                        }}
                                                        className="w-24 sm:w-28 bg-[#151D30] border border-[#222E4A] focus:border-[#6366F1] rounded-xl px-3 py-1.5 text-sm font-bold text-white text-center focus:outline-none transition-all"
                                                        placeholder="0"
                                                    />
                                                </div>

                                                <div className="text-center sm:text-right min-w-[65px]">
                                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Votes Cast</p>
                                                    <p className="text-base font-normal text-white canela tracking-wide">{(Number(nominee.votes) || 0) + (Number(nominee.fakeVotes) || 0)}</p>
                                                </div>

                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                    rank === 1 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                                                }`}>
                                                    {rank === 1 ? 'Leader' : 'Nominee'}
                                                </span>

                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingNomineeInlineIndex(idx);
                                                        const nomineeData = JSON.parse(JSON.stringify(nominee));
                                                        const keyDetails = nomineeData.keyDetails || {};
                                                        nomineeData.instagramFollowers =
                                                            nomineeData.instagramFollowers ||
                                                            keyDetails.instagramFollowers ||
                                                            keyDetails.instaFollowers ||
                                                            nomineeData.instaFollowers ||
                                                            '';
                                                        nomineeData.twitterFollowers =
                                                            nomineeData.twitterFollowers ||
                                                            keyDetails.twitterFollowers ||
                                                            keyDetails.xFollowers ||
                                                            nomineeData.xFollowers ||
                                                            '';
                                                        setEditNomineeInlineData(nomineeData);
                                                    }}
                                                    className="px-2.5 py-1.5 bg-[#1C253B] hover:bg-[#253252] border border-[#2B395B] text-gray-300 hover:text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors"
                                                >
                                                    Edit Details
                                                </button>

                                                <button 
                                                    type="button" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeNomineeInline(nominee.id || nominee._id);
                                                    }}
                                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                    title="Remove Nominee"
                                                >
                                                    <FiTrash2 className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Inline Nominee Editor Modal */}
                    {editingNomineeInlineIndex !== null && editNomineeInlineData && (
                        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                            <div className="bg-[#101622] border border-[#1B243B] rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-left shadow-2xl">
                                <div className="flex justify-between items-center border-b border-[#1C253B] pb-4">
                                    <h3 className="text-xl font-normal text-white canela">Edit Nominee Details</h3>
                                    <button 
                                        onClick={() => {
                                            setEditingNomineeInlineIndex(null);
                                            setEditNomineeInlineData(null);
                                        }}
                                        className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer"
                                    >
                                        &times;
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Nominee Name</label>
                                        <input 
                                            type="text"
                                            value={editNomineeInlineData.name || ''}
                                            onChange={(e) => setEditNomineeInlineData({ ...editNomineeInlineData, name: e.target.value })}
                                            className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Enter Fake Votes</label>
                                        <input 
                                            type="number"
                                            min="0"
                                            value={editNomineeInlineData.fakeVotes !== undefined && editNomineeInlineData.fakeVotes !== null ? editNomineeInlineData.fakeVotes : ''}
                                            onChange={(e) => setEditNomineeInlineData({ ...editNomineeInlineData, fakeVotes: e.target.value === '' ? 0 : Math.max(0, parseInt(e.target.value, 10) || 0) })}
                                            className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                            placeholder="e.g. 500"
                                        />
                                    </div>

                                    {viewingCategory.type === 'Content Creator' ? (
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Channel Name</label>
                                            <input 
                                                type="text"
                                                value={editNomineeInlineData.channelName || ''}
                                                onChange={(e) => setEditNomineeInlineData({ ...editNomineeInlineData, channelName: e.target.value })}
                                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                placeholder="e.g. MrBeast"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                                    {viewingCategory.type === 'Real Estate' ? 'Property Type' : 'Brand'}
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={editNomineeInlineData.brand || ''}
                                                    onChange={(e) => setEditNomineeInlineData({ ...editNomineeInlineData, brand: e.target.value })}
                                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                    placeholder={viewingCategory.type === 'Real Estate' ? 'e.g. Mansion' : 'e.g. Bugatti'}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                                    {viewingCategory.type === 'Real Estate' ? 'Location' : 'Model'}
                                                </label>
                                                <input 
                                                    type="text"
                                                    value={editNomineeInlineData.model || ''}
                                                    onChange={(e) => setEditNomineeInlineData({ ...editNomineeInlineData, model: e.target.value })}
                                                    className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                    placeholder={viewingCategory.type === 'Real Estate' ? 'e.g. Beverly Hills' : 'e.g. Tourbillon'}
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Listing Link</label>
                                        <input 
                                            type="text"
                                            value={editNomineeInlineData.listingLink || ''}
                                            onChange={(e) => setEditNomineeInlineData({ ...editNomineeInlineData, listingLink: e.target.value })}
                                            className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                            placeholder="https://otulia.com/..."
                                        />
                                    </div>

                                    {viewingCategory.type === 'Real Estate' && (
                                        <div>
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Price</label>
                                            <input 
                                                type="text"
                                                value={editNomineeInlineData.keyDetails?.price || ''}
                                                onChange={(e) => setEditNomineeInlineData({ 
                                                    ...editNomineeInlineData, 
                                                    keyDetails: { ...(editNomineeInlineData.keyDetails || {}), price: e.target.value } 
                                                })}
                                                className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs font-bold text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                placeholder="e.g. $12,500,000"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Image upload section */}
                                {viewingCategory.type === 'Content Creator' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Channel Logo */}
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Channel Logo</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl bg-gray-900 border border-[#2B395B]/40 overflow-hidden shrink-0">
                                                    {editNomineeInlineData.image ? (
                                                        <img src={editNomineeInlineData.image} alt="Logo" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 font-bold">No Logo</div>
                                                    )}
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const fileInput = document.createElement('input');
                                                        fileInput.type = 'file';
                                                        fileInput.accept = 'image/*';
                                                        fileInput.onchange = async (e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const uploadData = new FormData();
                                                                uploadData.append('image', file, file.name);
                                                                let url = `/api/upload/nominee-image?category=${encodeURIComponent(viewingCategory.title)}&nominee=${encodeURIComponent(editNomineeInlineData.name || 'nominee')}`;
                                                                if (editNomineeInlineData.image) {
                                                                    url += `&oldUrl=${encodeURIComponent(editNomineeInlineData.image)}`;
                                                                }
                                                                try {
                                                                    const res = await fetch(url, {
                                                                        method: 'POST',
                                                                        headers: { 'Authorization': `Bearer ${token}` },
                                                                        body: uploadData
                                                                    });
                                                                    const data = await res.json();
                                                                    if (data.success && data.url) {
                                                                        setEditNomineeInlineData(prev => ({ ...prev, image: data.url }));
                                                                    } else {
                                                                        alert("Failed to upload channel logo.");
                                                                    }
                                                                } catch (err) {
                                                                    console.error("Nominee logo upload error:", err);
                                                                    alert("Error uploading channel logo.");
                                                                }
                                                            }
                                                        };
                                                        fileInput.click();
                                                    }}
                                                    className="py-2 px-3 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                                                >
                                                    Change Logo
                                                </button>
                                            </div>
                                        </div>

                                        {/* Banner Image */}
                                        {viewingCategory.type !== 'Content Creator' && (
                                        <div className="space-y-3">
                                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Banner Image</label>
                                            <div className="flex items-center gap-4">
                                                <div className="w-24 h-16 rounded-xl bg-gray-900 border border-[#2B395B]/40 overflow-hidden shrink-0">
                                                    {editNomineeInlineData.banner ? (
                                                        <img src={editNomineeInlineData.banner} alt="Banner" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 font-bold">No Banner</div>
                                                    )}
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => {
                                                        const fileInput = document.createElement('input');
                                                        fileInput.type = 'file';
                                                        fileInput.accept = 'image/*';
                                                        fileInput.onchange = async (e) => {
                                                            const file = e.target.files[0];
                                                            if (file) {
                                                                const uploadData = new FormData();
                                                                uploadData.append('image', file, file.name);
                                                                let url = `/api/upload/nominee-image?category=${encodeURIComponent(viewingCategory.title)}&nominee=${encodeURIComponent(editNomineeInlineData.name || 'nominee')}`;
                                                                if (editNomineeInlineData.banner) {
                                                                    url += `&oldUrl=${encodeURIComponent(editNomineeInlineData.banner)}`;
                                                                }
                                                                try {
                                                                    const res = await fetch(url, {
                                                                        method: 'POST',
                                                                        headers: { 'Authorization': `Bearer ${token}` },
                                                                        body: uploadData
                                                                    });
                                                                    const data = await res.json();
                                                                    if (data.success && data.url) {
                                                                        setEditNomineeInlineData(prev => ({ ...prev, banner: data.url }));
                                                                    } else {
                                                                        alert("Failed to upload banner.");
                                                                    }
                                                                } catch (err) {
                                                                    console.error("Nominee banner upload error:", err);
                                                                    alert("Error uploading banner.");
                                                                }
                                                            }
                                                        };
                                                        fileInput.click();
                                                    }}
                                                    className="py-2 px-3 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] text-white rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all"
                                                >
                                                    Change Banner
                                                </button>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nominee Image</label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-xl bg-gray-900 border border-[#2B395B]/40 overflow-hidden shrink-0">
                                                {editNomineeInlineData.image ? (
                                                    <img src={editNomineeInlineData.image} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-700 font-bold">No Image</div>
                                                )}
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => {
                                                    const fileInput = document.createElement('input');
                                                    fileInput.type = 'file';
                                                    fileInput.accept = 'image/*';
                                                    fileInput.onchange = async (e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const uploadData = new FormData();
                                                            uploadData.append('image', file, file.name);
                                                            
                                                            let url = `/api/upload/nominee-image?category=${encodeURIComponent(viewingCategory.title)}&nominee=${encodeURIComponent(editNomineeInlineData.name || 'nominee')}`;
                                                            if (editNomineeInlineData.image) {
                                                                url += `&oldUrl=${encodeURIComponent(editNomineeInlineData.image)}`;
                                                            }

                                                            try {
                                                                const res = await fetch(url, {
                                                                    method: 'POST',
                                                                    headers: { 'Authorization': `Bearer ${token}` },
                                                                    body: uploadData
                                                                });
                                                                const data = await res.json();
                                                                if (data.success && data.url) {
                                                                    setEditNomineeInlineData(prev => ({ ...prev, image: data.url }));
                                                                } else {
                                                                    alert("Failed to upload image.");
                                                                }
                                                            } catch (err) {
                                                                console.error("Nominee image upload error:", err);
                                                                alert("Error uploading image.");
                                                            }
                                                        }
                                                    };
                                                    fileInput.click();
                                                }}
                                                className="py-2.5 px-4 bg-[#151D30]/80 border border-[#2B395B] hover:border-[#6366F1] hover:bg-[#6366F1]/10 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer"
                                            >
                                                Change Image
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {viewingCategory.type === 'Content Creator' && (
                                    <div className="space-y-4 pt-2 border-t border-[#1C253B]">
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Creator Metrics</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Subscribers', key: 'subscribers', placeholder: '10M+' },
                                                { label: 'Total Views', key: 'views', placeholder: '500M+' },
                                                { label: 'Category', key: 'category', placeholder: 'Tech / Lifestyle' },
                                                { label: 'Location', key: 'location', placeholder: 'United States' },
                                                { label: 'Joined Date', key: 'joinDate', placeholder: '2018' }
                                            ].map((field) => (
                                                <div key={field.key}>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{field.label}</label>
                                                    <input 
                                                        type="text"
                                                        value={editNomineeInlineData.keyDetails?.[field.key] || ''}
                                                        onChange={(e) => setEditNomineeInlineData({
                                                            ...editNomineeInlineData,
                                                            keyDetails: { ...(editNomineeInlineData.keyDetails || {}), [field.key]: e.target.value }
                                                        })}
                                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                        placeholder={field.placeholder}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                         <h4 className="text-xs font-bold text-white uppercase tracking-wider pt-2">Exact Follower Counts</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'YouTube Subscribers', key: 'youtubeFollowers', placeholder: 'e.g. 318M' },
                                                { label: 'Instagram Followers', key: 'instagramFollowers', placeholder: 'e.g. 60.9M' },
                                                { label: 'Twitter Followers', key: 'twitterFollowers', placeholder: 'e.g. 30.9M' },
                                                { label: 'TikTok Followers', key: 'tiktokFollowers', placeholder: 'e.g. 105M' }
                                            ].map((follower) => (
                                                <div key={follower.key}>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{follower.label}</label>
                                                    <input 
                                                        type="text"
                                                        value={editNomineeInlineData[follower.key] || editNomineeInlineData.keyDetails?.[follower.key] || ''}
                                                        onChange={(e) => setEditNomineeInlineData({
                                                            ...editNomineeInlineData,
                                                            [follower.key]: e.target.value,
                                                            keyDetails: { ...(editNomineeInlineData.keyDetails || {}), [follower.key]: e.target.value }
                                                        })}
                                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                        placeholder={follower.placeholder}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider pt-2">Social Links</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[
                                                { label: 'Youtube Channel', key: 'youtube', placeholder: 'https://youtube.com/...' },
                                                { label: 'Instagram Link', key: 'instagram', placeholder: 'https://instagram.com/...' },
                                                { label: 'Twitter Link', key: 'twitter', placeholder: 'https://twitter.com/...' },
                                                { label: 'TikTok Link', key: 'tiktok', placeholder: 'https://tiktok.com/...' }
                                            ].map((social) => (
                                                <div key={social.key}>
                                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{social.label}</label>
                                                    <input 
                                                        type="text"
                                                        value={editNomineeInlineData[social.key] || ''}
                                                        onChange={(e) => setEditNomineeInlineData({
                                                            ...editNomineeInlineData,
                                                            [social.key]: e.target.value
                                                        })}
                                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all"
                                                        placeholder={social.placeholder}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Description</label>
                                    <textarea 
                                        rows="3"
                                        value={editNomineeInlineData.description || ''}
                                        onChange={(e) => setEditNomineeInlineData({ ...editNomineeInlineData, description: e.target.value })}
                                        className="w-full bg-[#151D30] border border-[#222E4A] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#6366F1] transition-all resize-none"
                                        placeholder="Describe this nominee candidate..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 border-t border-[#1C253B] pt-4">
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setEditingNomineeInlineIndex(null);
                                            setEditNomineeInlineData(null);
                                        }}
                                        className="px-4 py-2 border border-[#2B395B] hover:border-gray-500 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-transparent cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => {
                                            setViewingCategory(prev => {
                                                const updatedNominees = [...prev.nominees];
                                                const updatedNominee = { ...editNomineeInlineData };
                                                
                                                const parts = [];
                                                if (viewingCategory.type === 'Content Creator') {
                                                    if (updatedNominee.channelName) parts.push(updatedNominee.channelName);
                                                    if (updatedNominee.keyDetails?.category) parts.push(updatedNominee.keyDetails.category);
                                                    updatedNominee.detail = parts.join(' · ') || 'Content Creator';
                                                } else {
                                                    if (updatedNominee.brand) parts.push(updatedNominee.brand);
                                                    if (updatedNominee.model) parts.push(updatedNominee.model);
                                                    updatedNominee.detail = parts.join(' · ') || 'Custom Nominee';
                                                }
                                                
                                                updatedNominees[editingNomineeInlineIndex] = updatedNominee;
                                                return { ...prev, nominees: updatedNominees };
                                            });
                                            setEditingNomineeInlineIndex(null);
                                            setEditNomineeInlineData(null);
                                        }}
                                        className="px-5 py-2 bg-[#251BF5] hover:bg-[#3D33FF] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#251BF5]/20 cursor-pointer"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Floating changes banner */}
                    {JSON.stringify(viewingCategory.nominees) !== JSON.stringify(category.nominees) && (
                        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#111726]/95 border border-[#2B395B] px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-6 z-50 animate-in slide-in-from-bottom duration-300 backdrop-blur-md">
                            <span className="text-xs text-gray-300 font-bold uppercase tracking-wider">Unsaved changes to nominees order/list</span>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setViewingCategory(JSON.parse(JSON.stringify(category)))}
                                    className="px-4 py-2 border border-[#2B395B] hover:border-gray-500 text-gray-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all bg-transparent"
                                >
                                    Discard
                                </button>
                                <button 
                                    onClick={handleSaveChangesInline}
                                    disabled={isSubmittingInline}
                                    className="px-5 py-2 bg-[#251BF5] hover:bg-[#3D33FF] disabled:bg-gray-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-[#251BF5]/20 flex items-center gap-1.5"
                                >
                                    {isSubmittingInline ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // Mock Fallback
        return (
            <div className="bg-[#111726]/60 border border-[#1C253B] p-12 rounded-[2.5rem] text-center backdrop-blur-md">
                <FiAward className="text-4xl text-[#D48D2A] mx-auto mb-4 animate-bounce" />
                <h3 className="text-lg font-normal text-white canela tracking-wide capitalize">{activeTab.replace('-', ' ')} Component</h3>
                <p className="text-xs text-gray-400 font-medium max-w-sm mx-auto mt-2 leading-relaxed">
                    The {activeTab.replace('-', ' ')} management interface is under active deployment. Data is currently live-syncing to the ranking server.
                </p>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
                <SEO title="Rankings CMS" description="Manage and organize rankings categories" noindex />
                <div className="w-12 h-12 border-4 border-[#6366F1] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!token || !user || user.role !== 'admin') {
        return <SEO title="Rankings CMS" description="Manage and organize rankings categories" noindex />; // Gate redirects to home
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] text-white flex select-none montserrat antialiased">
            <SEO title="Rankings CMS" description="Manage and organize rankings categories" noindex />
            
            {/* Dark Theme Sidebar */}
            <ContentManagementSidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                isMobileOpen={isSidebarOpen} 
                toggleSidebar={toggleSidebar} 
                categories={categories}
            />

            {/* Main Area */}
            <div className="flex-1 min-w-0 flex flex-col min-h-screen lg:ml-[260px]">
                
                {/* CMS Premium Header */}
                <ContentManagementHeader 
                    toggleSidebar={toggleSidebar} 
                    user={user} 
                    isNotificationDropdownOpen={isNotificationDropdownOpen}
                    setIsNotificationDropdownOpen={setIsNotificationDropdownOpen}
                    notifications={notifications}
                    handleRemoveNotification={handleRemoveNotification}
                />

                {/* Sub-body CMS Workspace */}
                <div className="flex-1 p-6 sm:p-8 space-y-8 bg-[#0B0F19]">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
};

export default ContentManagement;
