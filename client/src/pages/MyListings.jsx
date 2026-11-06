import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import AssetCard from "../components/AssetCard";
import AddAssetModal from "../components/inventory/AddAssetModal";
import ConfirmationModal from "../components/ConfirmationModal";
import DealerVerificationModal from "../components/inventory/DealerVerificationModal";
import {
  FiGrid,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArrowRight,
  FiZap,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import UpgradeModal from "../components/UpgradeModal";
import SEO from "../components/SEO";

const MyListings = () => {
  const { token, isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();

  // Automatically redirect Premium/Business users to the full Inventory Dashboard
  useEffect(() => {
    if (
      isAuthenticated &&
      (user?.plan === "Premium Basic" || user?.plan === "Business VIP")
    ) {
      navigate("/inventory", { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchListings = async (showLoading = true) => {
    if (!isAuthenticated) return;
    if (showLoading) setLoading(true);

    try {
      const response = await fetch("/api/auth/my-listings", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setListings(data);
      } else {
        setError("Failed to fetch listings");
      }
    } catch (err) {
      console.error(err);
      setError("Connection error");
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();

    // Real-time updates: Refetch on window focus or visibility change
    const handleActivity = () => {
      if (document.visibilityState === "visible") {
        fetchListings(false); // Silent update
      }
    };

    window.addEventListener("focus", handleActivity);
    document.addEventListener("visibilitychange", handleActivity);

    // Optional: Poll every 30 seconds
    const interval = setInterval(() => fetchListings(false), 30000);

    return () => {
      window.removeEventListener("focus", handleActivity);
      document.removeEventListener("visibilitychange", handleActivity);
      clearInterval(interval);
    };
  }, [isAuthenticated, token]);

  const handleListingCreated = (item, isUpdate) => {
    if (isUpdate) {
      setListings(listings.map((l) => (l._id === item._id ? item : l)));
    } else {
      setListings([item, ...listings]);
    }
  };

  const handleVerificationSubmit = async (documents) => {
    try {
      const formData = new FormData();
      Object.keys(documents).forEach((key) => {
        if (documents[key]) formData.append(key, documents[key]);
      });

      const response = await fetch("/api/auth/submit-verification", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        alert(
          "Verification documents submitted successfully! Status updated to Pending.",
        );
        if (login) login(token, updatedUser);
        setIsVerificationModalOpen(false);
        window.location.reload();
      } else {
        const data = await response.json();
        alert(`Failed to submit: ${data.error || "Please try again."}`);
      }
    } catch (error) {
      console.error("Verification error:", error);
      alert("An error occurred during submission.");
    }
  };

  const handleCreateClick = () => {
    // Verification check commented out for Freemium users - No longer required to submit docs before adding assets
    /*
        if (user?.verificationStatus === 'Pending') {
            alert("Your dealer verification is currently pending approval. You will be notified once approved.");
            return;
        }

        if (user?.verificationStatus === 'None' || user?.verificationStatus === 'Rejected') {
            const msg = user?.verificationStatus === 'Rejected' 
                ? "Your previous verification was rejected. Please re-submit valid documents to continue."
                : "Please complete dealer verification before creating a listing.";
            alert(msg);
            setIsVerificationModalOpen(true);
            return;
        }
        */

    const currentCount = listings.length;
    const currentPlan = user?.plan || "Freemium";

    const limits = {
      Freemium: 5,
      "Premium Basic": 25,
      "Business VIP": 150,
    };

    const limit = limits[currentPlan] || 5;

    if (currentCount >= limit) {
      if (currentPlan === "Business VIP") {
        alert(
          `You have reached the absolute maximum listing capacity for Business VIP (${limit} listings).`,
        );
      } else {
        setShowUpgradeModal(true);
      }
    } else {
      setEditingListing(null);
      setIsModalOpen(true);
    }
  };

  const handleEditClick = (item) => {
    setEditingListing(item);
    setIsModalOpen(true);
  };

  const getLimitText = () => {
    if (!user) return "";
    const limits = { Freemium: 5, "Premium Basic": 25, "Business VIP": 150 };
    const limit = limits[user.plan] || 5;
    return `(${listings.length}/${limit} used)`;
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
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setListings(listings.filter((item) => item._id !== id));
        setDeleteModalOpen(false);
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete listing");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Connection error while deleting");
    } finally {
      setIsDeleting(false);
      setListingToDelete(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="pt-24 px-4 text-center">
        <SEO
          title="My Listings"
          description="Manage your luxury asset listings on Otulia."
          noindex
        />
        <Navbar />
        <h2 className="text-2xl font-bold mb-4">
          Please log in to view your listings
        </h2>
        <Link to="/login" className="text-blue-600 underline">
          Login here
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="My Listings"
        description="Manage your luxury asset listings on Otulia."
        noindex
      />
      <Navbar />
      <AddAssetModal
        isOpen={isModalOpen}
        editData={editingListing}
        onClose={() => {
          setIsModalOpen(false);
          setEditingListing(null);
        }}
        onCreated={(item, isUpdate) => {
          handleListingCreated(item, isUpdate);
          setIsModalOpen(false);
          setEditingListing(null);
        }}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
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

      <div className="pt-28 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 border-b border-gray-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold text-gray-900 canela">
                My Assets
              </h1>
              {(user?.plan === "Premium Basic" ||
                user?.plan === "Business VIP") && (
                <Link
                  to="/inventory"
                  className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors"
                >
                  Open Dashboard
                </Link>
              )}
            </div>
            <p className="text-gray-500 text-sm">
              Manage and view all your active listings {getLimitText()}
            </p>
          </div>

          <button
            onClick={handleCreateClick}
            disabled={loading}
            className={`flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider hover:bg-gray-800 transition-all mt-4 md:mt-0 shadow-lg shadow-black/10 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <FiPlus className="text-lg" />
            <span>{loading ? "Syncing..." : "Create Listing"}</span>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-200 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : listings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <FiGrid className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No listings found
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              You haven't listed any assets yet. Start selling your premium
              assets today.
            </p>
            <button
              onClick={handleCreateClick}
              className="text-[#D90416] font-bold uppercase text-sm tracking-widest hover:underline"
            >
              Create your first listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center pb-10">
            {listings.map((item) => (
              <div
                key={item._id}
                className="relative group overflow-hidden rounded-2xl"
              >
                <AssetCard item={item} />

                {/* Overlay Controls */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(item);
                    }}
                    className="bg-white/90 backdrop-blur-md text-black p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-all transform hover:scale-110"
                    title="Edit Listing"
                  >
                    <FiEdit2 className="text-lg" />
                  </button>
                  {(user?.role === 'admin' || user?.myListings?.some(entry => (entry.item?._id || entry.item) === item._id)) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        confirmDelete(item._id);
                      }}
                      className="bg-white/90 backdrop-blur-md text-red-600 p-2.5 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                      title="Delete Listing"
                    >
                      <FiTrash2 className="text-lg" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Upgrade Card for Freemium Users */}
            {user?.plan === "Freemium" && (
              <div
                onClick={() => navigate("/pricing")}
                className="relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 hover:bg-white hover:border-[#D90416] transition-all cursor-pointer group min-h-[350px]"
              >
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <FiZap className="text-3xl text-[#D90416]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                  Unlock Full Potential
                </h3>
                <p className="text-gray-500 text-sm text-center mb-6">
                  Increase your listing limit and get premium exposure for your
                  assets.
                </p>
                <div className="flex items-center gap-2 text-[#D90416] font-bold text-sm tracking-widest uppercase">
                  <span>Upgrade Now</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Benefits Section for Freemium Users */}
        {user?.plan === "Freemium" && (
          <div className="mb-20 mt-10 p-8 md:p-12 rounded-3xl bg-black text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-600/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-10 canela">
                Why upgrade to a Premium Plan?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <FiZap className="text-xl text-yellow-400" />
                  </div>
                  <h4 className="text-lg font-bold">Increased Limits</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    List up to 150 assets with our Business VIP plan. Never worry
                    about reaching your capacity again.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <FiTrendingUp className="text-xl text-green-400" />
                  </div>
                  <h4 className="text-lg font-bold">Priority Exposure</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Get your listings featured at the top of search results and
                    on the homepage for maximum visibility.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <FiShield className="text-xl text-blue-400" />
                  </div>
                  <h4 className="text-lg font-bold">Advanced Analytics</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Access detailed insights about your listing performance,
                    views, and lead engagement statistics.
                  </p>
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row items-center gap-6 border-t border-white/10 pt-10">
                <div>
                  <p className="text-white font-medium text-lg">
                    Ready to take your dealership to the next level?
                  </p>
                  <p className="text-gray-400 text-sm">
                    Plans starting from just $99/month
                  </p>
                </div>
                <button
                  onClick={() => navigate("/pricing")}
                  className="px-8 py-4 bg-white text-black rounded-full font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-all sm:ml-auto whitespace-nowrap"
                >
                  Explore Plans
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
