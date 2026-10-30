import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import SEO from "../components/SEO";
import AssetCard from "../components/AssetCard";
import Pagination from "../components/Pagination";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiMessageSquare,
  FiStar,
  FiChevronRight,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import UserPlaceholder from "../assets/user.png";
import numberWithCommas from "../modules/numberwithcomma";

import facebookIcon from "../assets/icons/social/facebook.svg";
import instagramIcon from "../assets/icons/social/instagram.svg";
import linkedinIcon from "../assets/icons/social/linkedin.svg";
import youtubeIcon from "../assets/icons/social/youtube.svg";
import xIcon from "../assets/icons/social/x.svg";

const DealerProfile = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("listings");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/auth/public-profile/${encodeURIComponent(identifier)}`);
        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else if (response.status === 403) {
          setError(
            "This user does not have a public profile enabled. Public profiles are only available for Premium and Business members.",
          );
        } else {
          setError(result.message || "User not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [identifier]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <SEO
          title="Dealer Profile"
          description="Explore luxury assets from verified dealers and private sellers on Otulia."
        />
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  if (error || !data)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <SEO
          title="Dealer Not Found"
          description="This dealer profile could not be found."
          noindex
        />
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">{error}</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-black text-white rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );

  const { user, listings } = data;
  const isPremium =
    user.plan === "Premium Basic" || user.plan === "Business VIP";

  const displayName = isPremium
    ? user.company?.companyName || user.name
    : user.name;
  const displayLogo = isPremium
    ? user.company?.companyLogo || user.profilePicture
    : user.profilePicture;
  const displayCover = isPremium
    ? user.company?.coverPhoto || user.coverPhoto
    : user.coverPhoto;
  const displayDesc = isPremium
    ? user.company?.description || user.agentDescription
    : user.agentDescription;
  const displayAddress = isPremium
    ? user.company?.address
    : user.company?.address || "";
  const displayWebsite = isPremium
    ? user.company?.website
    : user.company?.website || "";
  const displayPhone = isPremium
    ? user.company?.phone || user.phone
    : user.phone;
  const displayEmail = isPremium
    ? user.company?.email || user.email
    : user.email;
  const displaySocial = isPremium
    ? user.company?.social || user.social
    : user.social;
  const displayLanguages = user.company?.languagesKnown || [];
  const displayLanguage = user.language || "English";

  // Mocked/Calculated data for UI matching
  const joinedYear = new Date(user.createdAt || Date.now()).getFullYear();
  const medianPrice =
    listings.length > 0
      ? listings.reduce((acc, curr) => acc + curr.price, 0) / listings.length
      : 0;

  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={displayName}
        description={`Explore luxury assets from ${displayName} on Otulia.`}
      />
      <Navbar />

      {/* Banner Section */}
      <div className="relative w-full h-[500px] pt-20">
        <div className="w-full h-full overflow-hidden">
          {displayCover ? (
            <img
              src={displayCover}
              className="w-full h-full object-cover"
              alt="Banner"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-gray-900 to-black"></div>
          )}
        </div>

        {/* Logo Overlap - Positioned relative to banner but not clipped */}
        <div className="absolute bottom-0 left-0 w-full px-6 md:px-16 lg:px-20 pointer-events-none">
          <div className="bg-white p-1.5 shadow-2xl inline-block rounded-2xl pointer-events-auto border border-gray-100 transform translate-y-[40%] relative z-30">
            <div className="w-20 h-20 md:w-32 md:h-32 flex items-center justify-center overflow-hidden bg-white rounded-xl border border-gray-50">
              {displayLogo ? (
                <img
                  src={displayLogo}
                  className="w-full h-full object-contain"
                  alt="Logo"
                />
              ) : (
                <span className="text-3xl font-black canela uppercase tracking-tighter text-gray-200 pl-50">
                  O
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Info Header */}
      <div className="w-full px-6 md:px-16 lg:px-20 pt-16 pb-10">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-normal text-gray-900 canela leading-tight">
                {displayName}
              </h1>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-12 py-4 bg-black text-white font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-800 transition-all shadow-lg">
                Message
              </button>
              <button className="flex-1 md:flex-none px-12 py-4 border border-black text-black font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-gray-50 transition-all">
                Call
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-x-12 gap-y-6 pb-8 border-b border-gray-100 mb-8">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Listings
            </span>
            <span className="text-lg font-medium text-gray-900 montserrat">
              {listings.length}
            </span>
          </div>
          <div className="flex flex-col border-l border-gray-100 pl-12">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Joined
            </span>
            <span className="text-lg font-medium text-gray-900 montserrat">
              {joinedYear}
            </span>
          </div>
          <div className="flex flex-col border-l border-gray-100 pl-12">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
              Median listing price
            </span>
            <span className="text-lg font-medium text-gray-900 montserrat">
              ${listings.length > 0 ? (medianPrice / 1000000).toFixed(1) : "0"}M
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col">
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4">
              Address
            </h4>
            <p className="text-xs font-medium text-gray-600 leading-relaxed max-w-[200px]">
              {displayAddress || "Contact dealer for office address"}
            </p>
          </div>

          <div className="flex flex-col">
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4">
              Website
            </h4>
            {displayWebsite ? (
              <a
                href={
                  displayWebsite.startsWith("http")
                    ? displayWebsite
                    : `https://${displayWebsite}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-gray-600 hover:text-black transition-colors break-all underline underline-offset-4"
              >
                {displayWebsite.replace("https://", "").replace("http://", "")}
              </a>
            ) : (
              <span className="text-xs font-medium text-gray-400 italic">
                Not available
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4">
              Social
            </h4>
            <div className="flex items-center gap-3">
              {displaySocial?.instagram && (
                <a
                  href={`https://${displaySocial.instagram.replace("https://", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:opacity-70 transition-opacity"
                >
                  <img
                    src={instagramIcon}
                    className="h-4 w-4"
                    alt="Instagram"
                  />
                </a>
              )}
              {displaySocial?.linkedin && (
                <a
                  href={`https://${displaySocial.linkedin.replace("https://", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:opacity-70 transition-opacity"
                >
                  <img src={linkedinIcon} className="h-4 w-4" alt="LinkedIn" />
                </a>
              )}
              {displaySocial?.facebook && (
                <a
                  href={`https://${displaySocial.facebook.replace("https://", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:opacity-70 transition-opacity"
                >
                  <img src={facebookIcon} className="h-4 w-4" alt="Facebook" />
                </a>
              )}
              {displaySocial?.youtube && (
                <a
                  href={`https://${displaySocial.youtube.replace("https://", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:opacity-70 transition-opacity"
                >
                  <img src={youtubeIcon} className="h-4 w-5" alt="YouTube" />
                </a>
              )}
              {displaySocial?.x && (
                <a
                  href={`https://${displaySocial.x.replace("https://", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:opacity-70 transition-opacity"
                >
                  <img src={xIcon} className="h-4 w-4" alt="X" />
                </a>
              )}
            </div>
          </div>

          {displayLanguages.length > 0 && (
            <div className="flex flex-col">
              <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-[0.2em] mb-4">
                Languages
              </h4>
              <div className="flex flex-wrap gap-2">
                {displayLanguages.map((lang) => (
                  <span
                    key={lang}
                    className="text-[10px] font-bold text-gray-900 border border-gray-200 px-3 py-1 rounded-full uppercase tracking-tighter"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* About Section */}
        <div className="mb-24">
          <h2 className="text-2xl font-normal text-gray-900 canela mb-8 tracking-tight">
            About
          </h2>
          <div className="max-w-4xl text-sm md:text-[15px] font-medium text-gray-600 montserrat leading-[1.8] tracking-normal">
            {displayDesc ? (
              <p className="whitespace-pre-wrap">{displayDesc}</p>
            ) : (
              <p className="italic text-gray-400">
                No description available for this business.
              </p>
            )}
          </div>
        </div>

        {/* Listings Grid */}
        <div className="pt-24 border-t border-gray-100">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-normal text-gray-900 canela tracking-tight">
              {listings.length} Listings for sale
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              <span>Sort by: Newest</span>
              <FiChevronRight className="rotate-90" />
            </div>
          </div>

          {listings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                {listings
                  .slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage,
                  )
                  .map((item) => (
                    <AssetCard
                      key={item._id}
                      item={{
                        ...item,
                        agent: {
                          name: user.name,
                          photo: user.profilePicture,
                          companyLogo: user.company?.companyLogo,
                        },
                      }}
                    />
                  ))}
              </div>

              <div className="mt-20">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(listings.length / itemsPerPage)}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({
                      top: document.querySelector(".pt-24").offsetTop - 100,
                      behavior: "smooth",
                    });
                  }}
                />
              </div>
            </>
          ) : (
            <div className="py-32 text-center border border-dashed border-gray-200 rounded-3xl">
              <p className="text-gray-400 font-medium montserrat">
                No active listings found for this dealer.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerProfile;
