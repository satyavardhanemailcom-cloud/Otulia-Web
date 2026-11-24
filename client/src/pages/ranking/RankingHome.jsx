import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  useLocation,
  Link,
  NavLink,
} from "react-router-dom";
import {
  FaBolt,
  FaHome,
  FaTree,
  FaBed,
  FaBath,
  FaUsers,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTrophy,
  FaArrowRight,
  FaTimes,
} from "react-icons/fa";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

import Navbar_Ranking from "../../components/ranking_page/Navbar_Ranking";
import Sidebar from "../../components/ranking_page/DashboardRanking";
import HeaderRanking from "../../components/ranking_page/HeaderRanking";
import RankingCard from "../../components/ranking_page/CardRanking";
import RankingScaleWrapper from "../../components/ranking_page/RankingScaleWrapper";

import SEO from "../../components/SEO";
import { useAuth } from "../../contexts/AuthContext";
import { rankings as staticRankings } from "../../data/rankings";

const KNOWN_RANKING_TYPES = new Set([
  "car",
  "automotive",
  "realestate",
  "yacht",
  "bike",
  "contentcreator",
  "other",
]);

function RankingHome() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackSlug, setFallbackSlug] = useState(null);

  // Nominate Modal State (Mobile)
  const [showNominateModal, setShowNominateModal] = useState(false);
  const [nomineeName, setNomineeName] = useState("");
  const [nomineeReason, setNomineeReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const getCategoryDisplayName = (catParam, allCategories = []) => {
    if (!catParam) return "Automotive";
    const p = catParam.toLowerCase().replace(/[-_]/g, " ").trim();

    const matched = allCategories.find((c) => {
      if (!c || !c.type) return false;
      const t = c.type.toLowerCase().replace(/\s+/g, "").replace(/s$/, "");
      const paramClean = p.replace(/\s+/g, "").replace(/s$/, "");
      return t === paramClean;
    });

    if (matched && matched.type) {
      if (matched.type.toLowerCase() === "cars") return "Automotive";
      return matched.type;
    }

    if (p === "cars" || p === "car" || p === "automotive") return "Automotive";
    if (p.includes("real") || p.includes("estate")) return "Real Estate";
    if (p.includes("creator") || p.includes("influencer"))
      return "Content Creator";
    if (p.includes("yacht")) return "Yachts";
    if (p.includes("bike")) return "Bikes";

    return p
      .split(/\s+/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Fetch all active categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/rankings/categories");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
          if (!slug) {
            setLoading(false);
          }
        } else {
          if (!slug) {
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        if (!slug) {
          setLoading(false);
        }
      }
    };
    fetchCategories();
  }, [slug]);

  const isTypeMatching = (type, param) => {
    if (!type || !param) return false;
    const t = type.toLowerCase().replace(/\s+/g, "").replace(/s$/, ""); // remove trailing 's'
    const p = param.toLowerCase().replace(/\s+/g, "").replace(/s$/, ""); // remove trailing 's'
    if (p === "car" && t === "automotive") return true;
    if (p === "automotive" && t === "car") return true;
    return t === p || t.includes(p) || p.includes(t);
  };

  const filteredCategories = categories.filter((cat) =>
    isTypeMatching(cat.type, category || "cars"),
  );

  // Determine active slug
  let activeSlug = slug;
  if (!activeSlug && filteredCategories.length > 0) {
    activeSlug = filteredCategories[0].slug;
  }
  if (!activeSlug) {
    activeSlug = "hypercars";
  }

  // Fetch detailed category details (nominees)
  const fetchCategoryDetails = async (targetSlug) => {
    setLoading(true);
    setError(null);
    let notFound = false;
    try {
      const res = await fetch(`/api/rankings/category/${targetSlug}`);
      if (!res.ok) {
        notFound = res.status === 404;
        throw new Error("Category not found in database");
      }
      const data = await res.json();
      setActiveCategory(data);
      setFallbackSlug(null);
    } catch (err) {
      console.warn(
        "DB Category fetch failed, falling back to static mockup data:",
        err.message,
      );
      // Fallback to static data. Only a genuine 404 means the slug is unknown;
      // a transient API failure must not make a real ranking page noindex.
      setFallbackSlug(
        notFound && !staticRankings[targetSlug] ? targetSlug : null,
      );
      const staticData =
        staticRankings[targetSlug] || staticRankings["hypercars"];
      if (staticData) {
        setActiveCategory({
          _id: targetSlug,
          id: targetSlug,
          title: staticData.header.titleMain,
          slug: targetSlug,
          detailedDescription: staticData.header.description,
          votes: staticData.header.votes,
          nominees: staticData.cards.map((card, idx) => ({
            ...card,
            _id: card.name + idx,
            id: card.name + idx,
          })),
        });
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchCategoryDetails(slug);
    } else {
      setActiveCategory(null);
      setLoading(false);
    }
  }, [slug]);

  // Scroll to nominee if hash exists in URL
  useEffect(() => {
    if (!loading && activeCategory && location.hash) {
      const targetId = location.hash.substring(1);
      if (targetId) {
        const timer = setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            element.classList.add(
              "ring-2",
              "ring-[#D6A125]",
              "scale-[1.01]",
              "z-10",
            );
            setTimeout(() => {
              element.classList.remove(
                "ring-2",
                "ring-[#D6A125]",
                "scale-[1.01]",
                "z-10",
              );
            }, 2500);
          }
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [loading, activeCategory, location.hash]);

  const [votesRemaining, setVotesRemaining] = useState(3);
  const [votesToday, setVotesToday] = useState(0);

  const saveLocalDailyVotes = (count) => {
    try {
      const todayStr = new Date().toISOString().split("T")[0];
      localStorage.setItem(
        "otulia_daily_votes",
        JSON.stringify({ date: todayStr, votesToday: count }),
      );
    } catch (e) {
      console.error("localStorage error:", e);
    }
  };

  const fetchVotesToday = async () => {
    const todayStr = new Date().toISOString().split("T")[0];
    let localVotesToday = 0;
    try {
      const saved = JSON.parse(
        localStorage.getItem("otulia_daily_votes") || "{}",
      );
      if (saved.date === todayStr) {
        localVotesToday = Number(saved.votesToday) || 0;
      }
    } catch (e) {}

    if (token) {
      try {
        const res = await fetch("/api/rankings/votes-today", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const rem =
            data.votesRemaining !== undefined
              ? data.votesRemaining
              : Math.max(0, 3 - (data.votesToday || 0));
          const tod = data.votesToday !== undefined ? data.votesToday : 3 - rem;
          setVotesRemaining(rem);
          setVotesToday(tod);
          saveLocalDailyVotes(tod);
          return;
        }
      } catch (err) {
        console.error("Error fetching votes today:", err);
      }
    }

    setVotesToday(localVotesToday);
    setVotesRemaining(Math.max(0, 3 - localVotesToday));
  };

  useEffect(() => {
    fetchVotesToday();
  }, [token]);

  // Handle voting action
  const handleVote = async (nomineeId, catId) => {
    if (votesRemaining <= 0) {
      return;
    }

    // Optimistic real-time vote counter update (no page reload, no unmounting)
    setActiveCategory((prevCat) => {
      if (!prevCat || !prevCat.nominees) return prevCat;
      const updatedNominees = prevCat.nominees.map((nominee) => {
        if (nominee._id === nomineeId || nominee.id === nomineeId) {
          const currentVotes = nominee.votes || 0;
          const numericVotes =
            typeof currentVotes === "number"
              ? currentVotes
              : parseInt(currentVotes.toString().replace(/[^0-9]/g, "")) || 0;

          const newVotes = numericVotes + 1;
          return {
            ...nominee,
            votes: newVotes,
            rawVotes: newVotes,
          };
        }
        return nominee;
      });
      return {
        ...prevCat,
        nominees: updatedNominees,
      };
    });

    const newRem = Math.max(0, votesRemaining - 1);
    const newToday = votesToday + 1;
    setVotesRemaining(newRem);
    setVotesToday(newToday);
    saveLocalDailyVotes(newToday);

    if (!token) {
      return;
    }

    setIsVoting(true);
    try {
      const res = await fetch("/api/rankings/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoryId: catId, nomineeId }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.votesRemaining !== undefined) {
          setVotesRemaining(data.votesRemaining);
          setVotesToday(data.votesToday || 3 - data.votesRemaining);
          saveLocalDailyVotes(data.votesToday || 3 - data.votesRemaining);
        }
      } else {
        console.warn("Vote API warning:", data.error);
        if (data.votesRemaining !== undefined) {
          setVotesRemaining(data.votesRemaining);
          setVotesToday(data.votesToday || 3);
          saveLocalDailyVotes(data.votesToday || 3);
        }
      }
    } catch (err) {
      console.error("Error casting vote:", err);
    } finally {
      setIsVoting(false);
    }
  };

  // Map database details to Sidebar, Header, and Cards shape
  const getMappedHeaderData = () => {
    if (!activeCategory) return null;
    const catDisplayName =
      activeCategory.type || getCategoryDisplayName(category, categories);
    return {
      breadcrumbs: ["Home", "Rankings", catDisplayName, activeCategory.title],
      titleMain: activeCategory.title,
      titleHighlight: "",
      type: activeCategory.type,
      description:
        activeCategory.detailedDescription ||
        activeCategory.shortDescription ||
        "",
      nominees: activeCategory.nominees
        ? activeCategory.nominees.length.toString()
        : "0",
      votes: activeCategory.votes || "0",
      updated: activeCategory.updatedAt
        ? new Date(activeCategory.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "May 2026",
      categoryImage: activeCategory.categoryImage || "",
      bannerImage: activeCategory.bannerImage || "",
      coverImage:
        activeCategory.bannerImage || activeCategory.categoryImage || "",
    };
  };

  const getMappedCardsData = () => {
    if (!activeCategory || !activeCategory.nominees) return [];

    // Sum up votes for progress calculation
    const totalVotesVal = activeCategory.nominees.reduce(
      (acc, curr) => acc + (curr.votes || 0),
      0,
    );

    return activeCategory.nominees.map((nominee) => {
      // Map stats dynamically
      const stats = [];
      const keyDetails = nominee.keyDetails || {};

      const isEstate =
        activeCategory.type === "Real Estate" ||
        activeCategory.type === "realestate";
      const isContentCreator =
        activeCategory.type === "Content Creator" ||
        activeCategory.type === "Content Creators" ||
        activeCategory.type === "contentcreators";

      if (isEstate) {
        if (keyDetails.livingArea)
          stats.push({
            icon: FaHome,
            value: keyDetails.livingArea,
            label: "Living Area",
          });
        if (keyDetails.landSize)
          stats.push({
            icon: FaTree,
            value: keyDetails.landSize,
            label: "Land Size",
          });
        if (keyDetails.bedroom)
          stats.push({
            icon: FaBed,
            value: keyDetails.bedroom,
            label: "Bedrooms",
          });
        if (keyDetails.bathroom)
          stats.push({
            icon: FaBath,
            value: keyDetails.bathroom,
            label: "Bathrooms",
          });
      } else if (isContentCreator) {
        if (keyDetails.subscribers)
          stats.push({
            icon: FaUsers,
            value: keyDetails.subscribers,
            label: "Subscribers",
          });
        if (keyDetails.views)
          stats.push({
            icon: FaEye,
            value: keyDetails.views,
            label: "Total Views",
          });
        if (keyDetails.location)
          stats.push({
            icon: FaMapMarkerAlt,
            value: keyDetails.location,
            label: "Location",
          });
        if (keyDetails.joinDate)
          stats.push({
            icon: FaCalendarAlt,
            value: keyDetails.joinDate,
            label: "Joined",
          });
      } else {
        if (keyDetails.power)
          stats.push({ icon: FaBolt, value: keyDetails.power, label: "Power" });
        if (keyDetails.acceleration)
          stats.push({
            icon: LuTimerReset,
            value: keyDetails.acceleration,
            label: "0-100 km/h",
          });
        if (keyDetails.topSpeed)
          stats.push({
            icon: MdOutlineSpeed,
            value: keyDetails.topSpeed,
            label: "Top Speed",
          });
        if (keyDetails.engine)
          stats.push({
            icon: TbEngine,
            value: keyDetails.engine,
            label: "Engine",
          });
      }

      // Format votes with clean comma formatting
      const votesVal =
        typeof nominee.votes === "number"
          ? nominee.votes
          : parseInt(nominee.votes?.toString().replace(/[^0-9]/g, "") || "0");
      const formattedVotes =
        votesVal >= 1000
          ? `${(votesVal / 1000).toFixed(1)}K`
          : votesVal.toString();

      // Collect active social links
      const socialLinks = {};
      if (nominee.instagram || keyDetails.instagram)
        socialLinks.instagram = nominee.instagram || keyDetails.instagram;
      if (nominee.youtube || keyDetails.youtube)
        socialLinks.youtube = nominee.youtube || keyDetails.youtube;
      if (nominee.tiktok || keyDetails.tiktok)
        socialLinks.tiktok = nominee.tiktok || keyDetails.tiktok;
      if (nominee.twitter || keyDetails.twitter || nominee.x)
        socialLinks.twitter =
          nominee.twitter || keyDetails.twitter || nominee.x;
      if (nominee.facebook || keyDetails.facebook)
        socialLinks.facebook = nominee.facebook || keyDetails.facebook;

      // Extract metadata tag chips
      const meta = [];
      if (keyDetails.genre) meta.push(keyDetails.genre);
      if (keyDetails.category && !meta.includes(keyDetails.category))
        meta.push(keyDetails.category);
      if (keyDetails.platform) meta.push(keyDetails.platform);
      if (keyDetails.propertyType) meta.push(keyDetails.propertyType);
      if (keyDetails.availabilityStatus)
        meta.push(keyDetails.availabilityStatus);
      if (keyDetails.country) meta.push(keyDetails.country);

      return {
        rank: nominee.rank || 1,
        rankColor:
          nominee.rank === 1
            ? "#D6A125"
            : nominee.rank === 2
              ? "#C0C0C0"
              : "#CD7F32",
        name: nominee.name || nominee.model || "Unnamed Nominee",
        detail:
          nominee.detail ||
          (isEstate
            ? keyDetails.propertyType
            : isContentCreator
              ? keyDetails.category
              : nominee.engine) ||
          "",
        description:
          nominee.description ||
          (isEstate
            ? "An ultra-luxurious premier real estate asset representing exceptional architecture and privacy."
            : isContentCreator
              ? ""
              : "A masterwork of automotive engineering, combining sheer track performance with bespoke luxury."),
        image:
          nominee.image ||
          nominee.mainImage ||
          "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop",
        avatar:
          nominee.avatar || nominee.profilePic || nominee.profilePicture || "",
        stats,
        meta,
        category: activeCategory.title,
        brand:
          keyDetails.brand ||
          nominee.brand ||
          (nominee.name ? nominee.name.split(" ")[0] : "Bugatti"),
        model:
          keyDetails.model ||
          nominee.model ||
          (nominee.name
            ? nominee.name.split(" ").slice(1).join(" ")
            : "Tourbillon"),
        year: keyDetails.year || nominee.year || "2026",
        productionUnits:
          keyDetails.productionUnits ||
          nominee.productionUnits ||
          keyDetails.productionLimit ||
          nominee.productionLimit ||
          "250",
        productionLimit:
          keyDetails.productionUnits ||
          nominee.productionUnits ||
          keyDetails.productionLimit ||
          nominee.productionLimit ||
          "250",
        country:
          keyDetails.country ||
          nominee.country ||
          keyDetails.origin ||
          nominee.origin ||
          nominee.brand ||
          "Global",
        origin:
          keyDetails.country ||
          nominee.country ||
          keyDetails.origin ||
          nominee.origin ||
          nominee.brand ||
          "Global",
        bodyType: nominee.model || "Coupe",
        price: isContentCreator
          ? keyDetails.subscribers
            ? `${keyDetails.subscribers} Subscribers`
            : ""
          : keyDetails.price || "",
        location: isContentCreator
          ? keyDetails.location || nominee.brand || ""
          : nominee.brand || "",
        showBadgeOnImage: nominee.rank === 1 && isEstate,
        badge: isEstate ? "NEW FOR 2026" : "",
        votes: formattedVotes,
        rawVotes: votesVal,
        sourcesCount: (nominee.sources || []).length.toString(),
        showTagOnHeader: nominee.rank === 1,
        tag:
          nominee.rank === 1 ? (isEstate ? "New for 2026" : "TOP RATED") : "",
        showTopRatedBadge: nominee.rank === 1,
        progress: `${Math.min(100, Math.max(5, (votesVal / Math.max(1, totalVotesVal)) * 100))}%`,
        progressColor: nominee.rank === 1 ? "#D6A125" : "#1F2937",
        status: nominee.rank === 1 ? "Leading" : "",
        statusIcon: nominee.rank === 1 ? "trophy" : "",
        statusColor: nominee.rank === 1 ? "#D6A125" : "transparent",
        _id: nominee._id,
        categoryId: activeCategory._id,
        socialLinks,
        isContentCreator,
        channelName: nominee.channelName || nominee.name,
        youtube: nominee.youtube || keyDetails.youtube || "",
        instagram: nominee.instagram || keyDetails.instagram || "",
        twitter: nominee.twitter || keyDetails.twitter || nominee.x || "",
        tiktok: nominee.tiktok || keyDetails.tiktok || "",
        youtubeFollowers:
          nominee.youtubeFollowers || keyDetails.youtubeFollowers || "",
        instagramFollowers:
          nominee.instagramFollowers || keyDetails.instagramFollowers || "",
        twitterFollowers:
          nominee.twitterFollowers ||
          keyDetails.twitterFollowers ||
          nominee.xFollowers ||
          keyDetails.xFollowers ||
          "",
        tiktokFollowers:
          nominee.tiktokFollowers || keyDetails.tiktokFollowers || "",
        totalFollowers:
          nominee.totalFollowers ||
          keyDetails.totalFollowers ||
          keyDetails.subscribers ||
          nominee.subscribers ||
          "",
        rawCounts: nominee.rawCounts,
        banner:
          nominee.banner ||
          nominee.bannerImage ||
          nominee.coverImage ||
          keyDetails.banner ||
          keyDetails.bannerImage ||
          "",
        bannerImage:
          nominee.banner ||
          nominee.bannerImage ||
          nominee.coverImage ||
          keyDetails.banner ||
          keyDetails.bannerImage ||
          "",
        profilePic:
          nominee.profilePic ||
          nominee.profilePicture ||
          nominee.avatar ||
          nominee.image ||
          keyDetails.profilePic ||
          keyDetails.profilePicture ||
          "",
        logo:
          nominee.profilePic ||
          nominee.profilePicture ||
          nominee.avatar ||
          nominee.image ||
          "",
        keyDetails: keyDetails,
        joinDate: keyDetails.joinDate || "",
        genre: keyDetails.category || "",
        views: keyDetails.views || "",
        subscribers: keyDetails.subscribers || "",
        isEstate,
        livingArea: keyDetails.livingArea || "",
        landSize: keyDetails.landSize || "",
        bedrooms: keyDetails.bedroom || "",
        bathrooms: keyDetails.bathroom || "",
        propertyType: keyDetails.propertyType || "Estate",
        availabilityStatus: keyDetails.availabilityStatus || "For Sale",
        isCar:
          activeCategory.type === "Cars" ||
          activeCategory.type === "cars" ||
          activeCategory.type === "Automotive" ||
          (!isEstate && !isContentCreator),
        engine: keyDetails.engine || "",
        power: keyDetails.power || "",
        topSpeed: keyDetails.topSpeed || "",
        acceleration: keyDetails.acceleration || "",
        listingLink: nominee.listingLink || keyDetails.listingLink || "",
      };
    });
  };

  const headerData = getMappedHeaderData();
  const cardsData = getMappedCardsData();

  const handleNominateSubmit = (e) => {
    e.preventDefault();
    if (!nomineeName.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setShowNominateModal(false);
      setSubmitted(false);
      setNomineeName("");
      setNomineeReason("");
    }, 2000);
  };

  const catParam = (category || "cars").toLowerCase();
  const isEstate = catParam.includes("estate") || catParam.includes("real");
  const isCreator = catParam.includes("creator");

  const catDisplayName = getCategoryDisplayName(category, categories);
  const seoTitle = activeCategory?.title
    ? `${activeCategory.title} | Otulia Rankings`
    : `${catDisplayName} Rankings`;
  const seoDescription =
    (activeCategory &&
      (activeCategory.shortDescription ||
        activeCategory.detailedDescription)) ||
    `Otulia ${catDisplayName} rankings: explore curated luxury ranking categories and see what's leading, based on verified votes and user popularity.`;
  const isKnownCategory = KNOWN_RANKING_TYPES.has(
    catParam.replace(/[\s_-]+/g, "").replace(/s$/, ""),
  );
  const seoNoindex =
    !isKnownCategory || (Boolean(slug) && fallbackSlug === slug);

  return (
    <RankingScaleWrapper>
      <SEO title={seoTitle} description={seoDescription} noindex={seoNoindex} />
      <Sidebar categories={filteredCategories} activeSlug={activeSlug} />

      <div className="min-h-screen bg-black text-white flex-1 flex flex-col lg:ml-[260px] transition-all duration-300">
        <Navbar_Ranking hideSearch={true} />

        <div className="flex-1 px-3.5 sm:px-6 lg:px-8 pt-[74px] sm:pt-[82px] lg:pt-[88px] pb-12 bg-black">
          {/* MOBILE CATEGORY PILLS BAR (< 1024px) */}
          <div className="flex lg:hidden flex-col gap-2.5 pb-4 mb-3 border-b border-black">
            {/* Primary Category Selector */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              <NavLink
                to="/ranking/cars"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold whitespace-nowrap transition ${
                    isActive
                      ? "bg-[#D6A125] text-black font-bold shadow-md shadow-[#D6A125]/20"
                      : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:text-white"
                  }`
                }
              >
                Automotive
              </NavLink>
              <NavLink
                to="/ranking/realestate"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold whitespace-nowrap transition ${
                    isActive
                      ? "bg-[#D6A125] text-black font-bold shadow-md shadow-[#D6A125]/20"
                      : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:text-white"
                  }`
                }
              >
                Real Estate
              </NavLink>
              <NavLink
                to="/ranking/contentcreators"
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase font-semibold whitespace-nowrap transition ${
                    isActive
                      ? "bg-[#D6A125] text-black font-bold shadow-md shadow-[#D6A125]/20"
                      : "bg-zinc-900 text-zinc-300 border border-zinc-800 hover:text-white"
                  }`
                }
              >
                Creators
              </NavLink>
            </div>

            {/* Subcategory Scrollable Chips */}
            {filteredCategories.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                <Link
                  to={`/ranking/${category || "cars"}`}
                  className={`px-3 py-1 rounded-lg text-[11.5px] font-medium whitespace-nowrap transition ${
                    !slug
                      ? "bg-[#D6A125]/20 text-[#D6A125] border border-[#D6A125]/60 font-bold"
                      : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-zinc-800/80"
                  }`}
                >
                  All Rankings
                </Link>
                {filteredCategories.map((cat) => {
                  const isActive = slug === cat.slug;
                  const catType = cat.type
                    ? cat.type.toLowerCase().replace(/\s+/g, "")
                    : category || "cars";
                  return (
                    <Link
                      key={cat._id || cat.slug}
                      to={`/ranking/${catType}/${cat.slug}`}
                      className={`px-3 py-1 rounded-lg text-[11.5px] font-medium whitespace-nowrap transition ${
                        isActive
                          ? "bg-[#D6A125]/20 text-[#D6A125] border border-[#D6A125]/60 font-bold"
                          : "text-zinc-400 hover:text-white bg-zinc-900/70 border border-zinc-800/80"
                      }`}
                    >
                      {cat.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-32 sm:py-40">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-[#D6A125]"></div>
            </div>
          ) : error ? (
            <div className="text-center py-32 sm:py-40 text-red-500 font-medium">
              {error}
            </div>
          ) : activeCategory ? (
            <>
              <HeaderRanking data={headerData} />
              {cardsData.length > 0 ? (
                <RankingCard
                  cars={cardsData}
                  onVote={handleVote}
                  isVoting={isVoting}
                  votesRemaining={votesRemaining}
                />
              ) : (
                <div className="text-center py-20 text-zinc-400 font-medium border border-dashed border-zinc-800 rounded-xl">
                  No nominees found in this category.
                </div>
              )}
            </>
          ) : !slug ? (
            <div className="pt-1 sm:pt-4">
              <div className="mb-6 sm:mb-10">
                <h1 className="text-[28px] sm:text-[38px] md:text-[56px] font-bold leading-[1.1] tracking-[-0.03em] text-white">
                  {getCategoryDisplayName(category, categories)}{" "}
                  <span className="text-[#C9920E]">Rankings</span>
                </h1>
                <p className="mt-2.5 sm:mt-4 max-w-[650px] text-[13.5px] sm:text-[16px] md:text-[18px] leading-[1.6] text-[#A1A1AA]">
                  Explore all our curated ranking categories. See what's leading
                  the industry based on verified votes and user popularity.
                </p>
              </div>

              {filteredCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredCategories.map((cat) => {
                    const nomineeCount =
                      cat.nomineeLimit || (cat.assetNominees || []).length;
                    const catType = cat.type
                      ? cat.type.toLowerCase().replace(/\s+/g, "")
                      : category || "cars";
                    const targetPath = `/ranking/${catType}/${cat.slug}`;
                    const fallbackImg =
                      (cat.type || "").toLowerCase().includes("estate") ||
                      (cat.type || "").toLowerCase().includes("real")
                        ? "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop"
                        : (cat.type || "").toLowerCase().includes("creator")
                          ? "https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=1200&auto=format&fit=crop"
                          : "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop";

                    return (
                      <div
                        key={cat._id || cat.slug}
                        onClick={() => navigate(targetPath)}
                        className="overflow-hidden rounded-[14px] border border-zinc-800 bg-[#161618] flex flex-col shadow-sm hover:shadow-lg hover:border-zinc-700 transition duration-300 cursor-pointer group"
                      >
                        <div className="h-[180px] sm:h-[300px] w-full bg-zinc-950 relative overflow-hidden">
                          <img
                            src={
                              cat.categoryImage ||
                              cat.bannerImage ||
                              fallbackImg
                            }
                            alt={cat.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          {/* <div className="absolute top-3 left-3 bg-black/70 text-white text-[10.5px] sm:text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
                            {cat.type}
                          </div> */}
                          {/* Disabled Tag ^ */}
                        </div>

                        <div className="p-4 sm:p-5 flex-1 flex flex-col">
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2 group-hover:text-[#D48D2A] transition duration-200">
                            {cat.title}
                          </h3>
                          <p className="text-[13px] sm:text-[14px] text-zinc-400 line-clamp-3 mb-4 sm:mb-6 flex-1 leading-relaxed">
                            {cat.shortDescription ||
                              "No description available."}
                          </p>

                          <div className="flex items-center justify-between border-t border-zinc-850 pt-3.5 sm:pt-4 mt-auto">
                            <div className="text-[12px] sm:text-[13px] text-zinc-400 font-medium">
                              <span className="font-bold text-white">
                                {nomineeCount}
                              </span>{" "}
                              Nominees
                            </div>
                            <span className="flex items-center gap-1.5 text-[13px] sm:text-[14px] font-semibold text-[#D48D2A] group-hover:text-[#F3B344] transition duration-200">
                              Explore Rankings &rsaquo;
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-20 text-zinc-400 font-medium border border-dashed border-zinc-800 rounded-xl">
                  No ranking categories found for this section.
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-32 sm:py-40 text-zinc-400 font-medium">
              No active rankings found.
            </div>
          )}

          {/* MOBILE NOMINATE BANNER (< 1024px) */}
          <div className="mt-8 sm:mt-12 lg:hidden rounded-2xl border border-zinc-800 bg-[#0F0F12] p-5 text-center shadow-lg relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#18181B] border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-[#D6A125]">
              <FaTrophy className="text-lg text-[#D6A125]" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Know an exceptional nominee?
            </h4>
            <p className="text-xs text-zinc-400 mb-4 max-w-md mx-auto">
              Submit your recommendation to our global luxury ranking editorial
              board.
            </p>
            <button
              onClick={() => setShowNominateModal(true)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B8812D] via-[#A37025] to-[#8C5E1D] text-white font-bold text-xs tracking-wider uppercase transition shadow active:scale-95 flex items-center justify-center gap-2 mx-auto"
            >
              <span>Nominate Now</span>
              <FaArrowRight className="text-[10px]" />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE NOMINATE MODAL */}
      {showNominateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#121214] border border-zinc-800 rounded-2xl p-5 sm:p-6 w-full max-w-md shadow-2xl relative">
            <button
              onClick={() => setShowNominateModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 transition"
            >
              <FaTimes className="text-lg" />
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#D6A125]/20 border border-[#D6A125] text-[#D6A125] flex items-center justify-center mx-auto mb-4">
                  <FaTrophy className="text-2xl" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Nomination Submitted!
                </h3>
                <p className="text-xs text-zinc-400">
                  Thank you! Our editorial team will review your submission.
                </p>
              </div>
            ) : (
              <form onSubmit={handleNominateSubmit} className="space-y-3.5">
                <div className="flex items-center gap-2">
                  <FaTrophy className="text-[#D6A125] text-lg" />
                  <h3 className="text-base font-bold text-white">
                    Nominate a Candidate
                  </h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Submit an exceptional nominee to be evaluated by our global
                  luxury ranking board.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Nominee Name / Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter candidate name..."
                    value={nomineeName}
                    onChange={(e) => setNomineeName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D6A125]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Why should it be ranked?
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Briefly state why this candidate stands out..."
                    value={nomineeReason}
                    onChange={(e) => setNomineeReason(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D6A125]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowNominateModal(false)}
                    className="px-4 py-2 rounded-lg border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#B8812D] to-[#8C5E1D] text-xs font-bold text-white hover:opacity-90"
                  >
                    Submit Nomination
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </RankingScaleWrapper>
  );
}

export default RankingHome;
