import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import numberWithCommas from "../modules/numberwithcomma";
import wavingHand from "../assets/icons/waving-hand.webp";

// Import New Components
import Sidebar from "../components/inventory_dashboard/Sidebar";
import Header from "../components/inventory_dashboard/Header";
import DashboardTab from "../components/inventory_dashboard/DashboardTab";
import InventoryTab from "../components/inventory_dashboard/InventoryTab";
import LeadsTab from "../components/inventory_dashboard/LeadsTab";
import AnalyticsTab from "../components/inventory_dashboard/AnalyticsTab";
import MarketplaceTab from "../components/inventory_dashboard/MarketplaceTab";
import SubscriptionTab from "../components/inventory_dashboard/SubscriptionTab";
import SettingsTab from "../components/inventory_dashboard/SettingsTab";

// Modals & Utils
import AddAssetModal from "../components/inventory/AddAssetModal";
import VerificationModal from "../components/VerificationModal";
import ContactModal from "../components/ContactModal";
import UpgradeModal from "../components/UpgradeModal";
import AddLeadModal from "../components/inventory/AddLeadModal";
import ScheduleMeetingModal from "../components/inventory/ScheduleMeetingModal";
import ImageCropModal from "../components/ImageCropModal";

import inventoryHubSound from "../assets/sounds/inventory_hub.mp3";

const Inventory = () => {
  const { user, logout, updateUserLocal, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const audio = new Audio(inventoryHubSound);

    audio.volume = 0.5; // 0.0 to 1.0

    audio.play().catch((err) => {
      console.log("Audio autoplay blocked:", err);
    });

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  // UI States
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [timeframe, setTimeframe] = useState("Week");
  const [chartInterval, setChartInterval] = useState("Week");
  const [convInterval, setConvInterval] = useState("Week");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    stats: {},
    inventory: [],
    leads: [],
    notifications: [],
    analytics: {},
  });

  // Filtering & Pagination States
  const [inventorySearchQuery, setInventorySearchQuery] = useState("");
  const [inventoryCategoryFilter, setInventoryCategoryFilter] =
    useState("All Categories");
  const [inventoryStatusFilter, setInventoryStatusFilter] =
    useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [leadCurrentPage, setLeadCurrentPage] = useState(1);
  const [leadItemsPerPage, setLeadItemsPerPage] = useState(10);
  const [leadSearchQuery, setLeadSearchQuery] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("All Status");
  const [leadSourceFilter, setLeadSourceFilter] = useState("All Source");
  const [leadAssetFilter, setLeadAssetFilter] = useState("All Assets");
  const [activeLeadDropdown, setActiveLeadDropdown] = useState(null);

  // Reset lead pagination when filters change
  useEffect(() => {
    setLeadCurrentPage(1);
  }, [
    leadSearchQuery,
    leadStatusFilter,
    leadSourceFilter,
    leadAssetFilter,
    leadItemsPerPage,
  ]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactType, setContactType] = useState("Support");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [upgradePlan, setUpgradePlan] = useState(null);
  const [viewLead, setViewLead] = useState(null);
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedLeadForSchedule, setSelectedLeadForSchedule] = useState(null);

  // Settings States
  const [agentInfo, setAgentInfo] = useState({
    fullName: "",
    jobTitle: "",
    email: "",
    phoneCode: "+971",
    phone: "",
    whatsappCode: "+971",
    whatsapp: "",
    contactMethod: "WhatsApp",
    language: "English",
    timezone: "(GMT+4) Dubai, UAE",
    bio: "",
    photo: "",
    interests: [],
    social: {
      instagram: "",
      linkedin: "",
      x: "",
      facebook: "",
    },
  });
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    website: "",
    email: "",
    businessType: "Luxury Cars & Supercars Dealer",
    establishedYear: "",
    address: "",
    phoneCode: "+971",
    phone: "",
    description: "",
    logo: "",
    coverImage: "",
    languagesKnown: [],
    social: {
      instagram: "",
      linkedin: "",
      facebook: "",
      youtube: "",
    },
    planExpiresAt: null,
  });

  const formatPhoneWithCode = (val, code) => {
    if (!val) return "";
    const selectedCode = code || "+971";
    const cleanDigits = val.replace(/^\+\d+\s*/, "").trim();
    if (!cleanDigits) return "";
    return `${selectedCode} ${cleanDigits}`;
  };

  const extractPhoneCode = (fullPhone, savedCode) => {
    if (savedCode) return savedCode;
    if (!fullPhone) return "+971";
    const match = fullPhone.match(/^(\+\d+)/);
    return match ? match[1] : "+971";
  };

  useEffect(() => {
    if (refreshUser) {
      refreshUser();
    }
  }, []);

  useEffect(() => {
    if (user) {
      const pCode = extractPhoneCode(user.phone, user.phoneCode);
      const wCode = extractPhoneCode(user.whatsapp, user.whatsappCode);
      const cCode = extractPhoneCode(
        user.company?.phone,
        user.company?.phoneCode,
      );

      setAgentInfo({
        fullName: user.name || "",
        jobTitle: user.jobTitle || "",
        email: user.email || "",
        phoneCode: pCode,
        phone: user.phone ? formatPhoneWithCode(user.phone, pCode) : "",
        whatsappCode: wCode,
        whatsapp: user.whatsapp
          ? formatPhoneWithCode(user.whatsapp, wCode)
          : "",
        contactMethod: user.contactMethod || "WhatsApp",
        language: user.language || "English",
        timezone: user.timezone || "(GMT+4) Dubai, UAE",
        bio: user.agentDescription || "",
        photo: user.profilePicture || "",
        interests: user.interests || [],
        social: {
          instagram: user.social?.instagram || "",
          linkedin: user.social?.linkedin || "",
          x: user.social?.twitter || user.social?.x || "",
          facebook: user.social?.facebook || "",
        },
      });
      setCompanyInfo({
        name: user.company?.companyName || user.company?.name || "",
        website: user.company?.website || "",
        email:
          user.company?.email || user.company?.companyEmail || user.email || "",
        businessType:
          user.company?.businessType || "Luxury Cars & Supercars Dealer",
        establishedYear: user.company?.establishedYear || "",
        address: user.company?.address || "",
        phoneCode: cCode,
        phone: user.company?.phone
          ? formatPhoneWithCode(user.company.phone, cCode)
          : "",
        description: user.company?.description || "",
        logo: user.company?.companyLogo || user.company?.logo || "",
        coverImage:
          user.company?.coverPhoto ||
          user.company?.coverImage ||
          user.coverPhoto ||
          "",
        languagesKnown: user.company?.languagesKnown || user.languages || [],
        social: {
          instagram: user.company?.social?.instagram || "",
          linkedin: user.company?.social?.linkedin || "",
          facebook: user.company?.social?.facebook || "",
          youtube: user.company?.social?.youtube || "",
        },
        planExpiresAt: user.planExpiresAt,
      });
    }
  }, [user]);

  const [logoLoading, setLogoLoading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSavingPersonal, setIsSavingPersonal] = useState(false);
  const [isSavingCompany, setIsSavingCompany] = useState(false);

  // Image Cropping States
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [cropType, setCropType] = useState(null); // 'profile', 'logo', 'cover'
  const [isCropping, setIsCropping] = useState(false);

  const isVerifiedDealer = user?.role === "admin" || user?.isVerified;

  useEffect(() => {
    fetchDashboardData();
  }, [timeframe, chartInterval]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log(
        `[Inventory] Fetching data with timeframe=${timeframe}, interval=${chartInterval}...`,
      );
      const response = await fetch(
        `/api/inventory/dashboard?timeframe=${timeframe}&interval=${chartInterval}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const result = await response.json();
      console.log("[Inventory] API Result:", result);
      if (result.success) {
        setData(result.data);
        console.log(
          "[Inventory] State updated with:",
          result.data.inventory?.length,
          "assets",
        );
      } else {
        console.error("[Inventory] API Error:", result.error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveNotification = async (id) => {
    try {
      await fetch(`/api/leads/notification/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setData((prev) => ({
        ...prev,
        notifications: prev.notifications.filter((n) => n._id !== id),
      }));
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const [updatingId, setUpdatingId] = useState(null);
  const handleTogglePublic = async (item) => {
    setUpdatingId(item.id);
    const isPublic = item.status !== "Active";
    try {
      const response = await fetch("/api/inventory/toggle-visibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          itemId: item.id,
          model: item.category,
          isPublic,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setData((prev) => ({
          ...prev,
          inventory: prev.inventory.map((i) =>
            i.id === item.id ? { ...i, status: result.status } : i,
          ),
        }));
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (response.ok) {
        setData((prev) => ({
          ...prev,
          inventory: prev.inventory.filter((i) => i.id !== id),
        }));
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleStatusChange = async (leadId, newStatus, isActivity) => {
    try {
      const endpoint = isActivity
        ? `/api/activity/status/${leadId}`
        : `/api/leads/status/${leadId}`;
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        setData((prev) => ({
          ...prev,
          leads: prev.leads.map((l) =>
            l.id === leadId ? { ...l, status: newStatus } : l,
          ),
        }));
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Asset",
      "Status",
      "Date",
      "Source",
    ];
    const rows = data.leads.map((l) => [
      l.name,
      l.email,
      l.phone,
      l.assetName,
      l.status,
      new Date(l.date).toLocaleDateString(),
      l.source || "Website",
    ]);
    const content = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `otulia-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const handleSavePersonalDetails = async () => {
    setIsSavingPersonal(true);
    try {
      const formattedPhone = formatPhoneWithCode(
        agentInfo.phone,
        agentInfo.phoneCode,
      );
      const formattedWhatsapp = formatPhoneWithCode(
        agentInfo.whatsapp,
        agentInfo.whatsappCode,
      );

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name: agentInfo.fullName,
          jobTitle: agentInfo.jobTitle,
          phone: formattedPhone,
          phoneCode: agentInfo.phoneCode,
          whatsapp: formattedWhatsapp,
          whatsappCode: agentInfo.whatsappCode,
          contactMethod: agentInfo.contactMethod,
          language: agentInfo.language,
          timezone: agentInfo.timezone,
          agentDescription: agentInfo.bio,
          profilePicture: agentInfo.photo,
          social: {
            instagram: agentInfo.social.instagram,
            linkedin: agentInfo.social.linkedin,
            twitter: agentInfo.social.x, // Map x to twitter for backend
            facebook: agentInfo.social.facebook,
          },
        }),
      });
      const result = await response.json();
      if (result.success !== false) {
        const updatedUser = result.user || result;
        updateUserLocal(updatedUser);
        alert("Personal details saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSavingPersonal(false);
    }
  };

  const handleSaveCompanyDetails = async () => {
    setIsSavingCompany(true);
    try {
      const formattedCompanyPhone = formatPhoneWithCode(
        companyInfo.phone,
        companyInfo.phoneCode,
      );

      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          company: {
            companyName: companyInfo.name,
            website: companyInfo.website,
            email: companyInfo.email,
            businessType: companyInfo.businessType,
            establishedYear: companyInfo.establishedYear,
            address: companyInfo.address,
            phone: formattedCompanyPhone,
            phoneCode: companyInfo.phoneCode,
            description: companyInfo.description,
            companyLogo: companyInfo.logo,
            coverPhoto: companyInfo.coverImage,
            languagesKnown: companyInfo.languagesKnown,
            social: {
              instagram: companyInfo.social.instagram,
              linkedin: companyInfo.social.linkedin,
              facebook: companyInfo.social.facebook,
              youtube: companyInfo.social.youtube,
            },
          },
        }),
      });
      const result = await response.json();
      if (result.success !== false) {
        const updatedUser = result.user || result;
        updateUserLocal(updatedUser);
        alert("Company details saved successfully!");
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setIsSavingCompany(false);
    }
  };

  // Generic function to handle file selection and open crop modal
  const onFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setCropType(type);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfilePicUpload = (e) => onFileSelect(e, "profile");
  const handleCompanyLogoUpload = (e) => onFileSelect(e, "logo");
  const handleCompanyCoverUpload = (e) => onFileSelect(e, "cover");

  const handleCropComplete = async (blob) => {
    setIsCropping(true);
    if (cropType === "logo") setLogoLoading(true);
    if (cropType === "cover") setIsUploadingCover(true);

    const formData = new FormData();

    let endpoint = "";
    let fieldName = "";

    if (cropType === "profile") {
      endpoint = "/api/auth/upload-profile-picture";
      fieldName = "profilePicture";
    } else if (cropType === "logo") {
      endpoint = "/api/auth/upload-company-logo";
      fieldName = "companyLogo";
    } else if (cropType === "cover") {
      endpoint = "/api/auth/upload-company-cover";
      fieldName = "coverPhoto";
    }

    formData.append(fieldName, blob, `cropped_${Date.now()}.png`);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      const result = await response.json();

      if (result.user) {
        if (cropType === "profile") {
          setAgentInfo((p) => ({ ...p, photo: result.user.profilePicture }));
        } else if (cropType === "logo") {
          setCompanyInfo((p) => ({
            ...p,
            logo: result.user.company?.companyLogo,
          }));
        } else if (cropType === "cover") {
          setCompanyInfo((p) => ({
            ...p,
            coverImage: result.user.company?.coverPhoto,
          }));
        }
        updateUserLocal(result.user);
        setCropModalOpen(false);
      } else {
        alert(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An unexpected error occurred during upload.");
    } finally {
      setIsCropping(false);
      setLogoLoading(false);
      setIsUploadingCover(false);
    }
  };

  const generateSparkline = (trends = [], key = "views") => {
    const subset = trends.slice(
      chartInterval === "Day" ? -3 : chartInterval === "Week" ? -7 : -30,
    );
    if (subset.length < 2) return "M 0,10 L 100,10";
    const maxVal = Math.max(...subset.map((d) => d[key] || 0), 10);
    const points = subset.map((d, i) => {
      const x = (i / (subset.length - 1)) * 100;
      const y = 20 - ((d[key] || 0) / maxVal) * 15;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  };

  const getSparklineData = (rawData, key, width, height, padding) => {
    if (!rawData || rawData.length < 2)
      return { path: `M 0,${height / 2} L ${width},${height / 2}`, points: [] };
    const maxVal = Math.max(...rawData.map((d) => d[key] || 0), 10);
    const points = rawData.map((d, i) => ({
      x: (i / (rawData.length - 1)) * (width - padding * 2) + padding,
      y: height - padding - ((d[key] || 0) / maxVal) * (height - padding * 2),
    }));
    const path =
      `M ${points[0].x},${points[0].y} ` +
      points
        .slice(1)
        .map((p) => `L ${p.x},${p.y}`)
        .join(" ");
    return { path, points };
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "inventory", label: "My Assets" },
    { id: "leads", label: "Leads" },
    { id: "analytics", label: "Analytics & Insights" },
    { id: "marketplace", label: "Public Marketplace" },
    { id: "subscription", label: "Subscription" },
    { id: "settings", label: "Settings" },
  ];

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/logos/O_logo_inverted.png"
            className="w-12 h-12 animate-pulse"
            alt="Loading"
          />
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#D48D2A] animate-progress-fast"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#FDFDFD] overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        navigate={navigate}
        logout={logout}
        isProfileDropdownOpen={isProfileDropdownOpen}
        setIsProfileDropdownOpen={setIsProfileDropdownOpen}
      />

      <main className="flex-1 ml-[clamp(180px,14vw,320px)] flex flex-col h-screen overflow-hidden transition-all duration-300">
        <Header
          activeTab={activeTab}
          navItems={navItems}
          data={data}
          user={user}
          wavingHand={wavingHand}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          chartInterval={chartInterval}
          setChartInterval={setChartInterval}
          isNotificationDropdownOpen={isNotificationDropdownOpen}
          setIsNotificationDropdownOpen={setIsNotificationDropdownOpen}
          handleRemoveNotification={handleRemoveNotification}
          setActiveTab={setActiveTab}
          isHeaderDropdownOpen={isHeaderDropdownOpen}
          setIsHeaderDropdownOpen={setIsHeaderDropdownOpen}
          navigate={navigate}
          logout={logout}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-[clamp(12px,2vw,32px)] pt-4 pb-0 transition-all">
          {activeTab === "dashboard" && (
            <DashboardTab
              data={data}
              generateSparkline={generateSparkline}
              chartInterval={chartInterval}
              setChartInterval={setChartInterval}
              getSparklineData={getSparklineData}
              convInterval={convInterval}
              setConvInterval={setConvInterval}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === "inventory" && (
            <InventoryTab
              data={data}
              user={user}
              inventorySearchQuery={inventorySearchQuery}
              setInventorySearchQuery={setInventorySearchQuery}
              inventoryCategoryFilter={inventoryCategoryFilter}
              setInventoryCategoryFilter={setInventoryCategoryFilter}
              inventoryStatusFilter={inventoryStatusFilter}
              setInventoryStatusFilter={setInventoryStatusFilter}
              isVerifiedDealer={isVerifiedDealer}
              setIsAddModalOpen={setIsAddModalOpen}
              setIsVerificationModalOpen={setIsVerificationModalOpen}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              handleTogglePublic={handleTogglePublic}
              updatingId={updatingId}
              setEditingItem={setEditingItem}
              confirmDelete={confirmDelete}
            />
          )}

          {activeTab === "leads" && (
            <LeadsTab
              data={data}
              setIsAddLeadModalOpen={setIsAddLeadModalOpen}
              setIsScheduleModalOpen={setIsScheduleModalOpen}
              setSelectedLeadForSchedule={setSelectedLeadForSchedule}
              handleExportCSV={handleExportCSV}
              leadSearchQuery={leadSearchQuery}
              setLeadSearchQuery={setLeadSearchQuery}
              leadStatusFilter={leadStatusFilter}
              setLeadStatusFilter={setLeadStatusFilter}
              leadSourceFilter={leadSourceFilter}
              setLeadSourceFilter={setLeadSourceFilter}
              leadAssetFilter={leadAssetFilter}
              setLeadAssetFilter={setLeadAssetFilter}
              activeLeadDropdown={activeLeadDropdown}
              setActiveLeadDropdown={setActiveLeadDropdown}
              handleStatusChange={handleStatusChange}
              setViewLead={setViewLead}
              leadCurrentPage={leadCurrentPage}
              setLeadCurrentPage={setLeadCurrentPage}
              leadItemsPerPage={leadItemsPerPage}
              setLeadItemsPerPage={setLeadItemsPerPage}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsTab
              data={data}
              generateSparkline={generateSparkline}
              getSparklineData={getSparklineData}
              chartInterval={chartInterval}
              setChartInterval={setChartInterval}
              setActiveTab={setActiveTab}
            />
          )}
          {activeTab === "marketplace" && (
            <MarketplaceTab
              data={data}
              handleTogglePublic={handleTogglePublic}
            />
          )}

          {activeTab === "subscription" && (
            <SubscriptionTab
              user={user}
              data={data}
              companyInfo={companyInfo}
              setUpgradePlan={setUpgradePlan}
              setIsUpgradeModalOpen={setIsUpgradeModalOpen}
            />
          )}

          {activeTab === "settings" && (
            <SettingsTab
              agentInfo={agentInfo}
              setAgentInfo={setAgentInfo}
              companyInfo={companyInfo}
              setCompanyInfo={setCompanyInfo}
              user={user}
              handleProfilePicUpload={handleProfilePicUpload}
              handleCompanyLogoUpload={handleCompanyLogoUpload}
              handleCompanyCoverUpload={handleCompanyCoverUpload}
              logoLoading={logoLoading}
              isUploadingCover={isUploadingCover}
              isSavingPersonal={isSavingPersonal}
              isSavingCompany={isSavingCompany}
              handleSavePersonalDetails={handleSavePersonalDetails}
              handleSaveCompanyDetails={handleSaveCompanyDetails}
              setIsVerificationModalOpen={setIsVerificationModalOpen}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
        }}
        onCreated={() => {
          setIsAddModalOpen(false);
          setEditingItem(null);
          fetchDashboardData();
        }}
        editData={editingItem}
      />
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
      />
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        type={contactType}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        plan={upgradePlan}
      />
      <AddLeadModal
        isOpen={isAddLeadModalOpen}
        onClose={() => setIsAddLeadModalOpen(false)}
        onCreated={() => fetchDashboardData()}
        token={localStorage.getItem("token")}
        inventory={data.inventory}
      />
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedLeadForSchedule(null);
        }}
        lead={selectedLeadForSchedule}
        agentName={user?.name}
        token={localStorage.getItem("token")}
      />

      {cropModalOpen && (
        <ImageCropModal
          src={imageToCrop}
          onCropComplete={handleCropComplete}
          onClose={() => {
            setCropModalOpen(false);
            setImageToCrop(null);
          }}
          isUploading={isCropping}
        />
      )}
    </div>
  );
};

export default Inventory;
