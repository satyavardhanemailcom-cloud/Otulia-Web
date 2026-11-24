import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  FaTrophy,
  FaBolt,
  FaArrowRight,
  FaStar,
  FaRegStar,
  FaYoutube,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaGlobe,
  FaCalendarAlt,
  FaTag,
  FaUsers,
  FaHome,
  FaTree,
  FaBed,
  FaBath,
  FaExternalLinkAlt,
} from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { LuTimerReset } from "react-icons/lu";
import { MdOutlineSpeed } from "react-icons/md";
import { TbEngine } from "react-icons/tb";

import youtubeIcon from "../../assets/icons/social/youtube.svg";
import instagramIcon from "../../assets/icons/social/instagram.svg";
import xIcon from "../../assets/icons/social/x_inverted.svg";
import estateIcon from "../../assets/icons/estate_icon.png";
import NomineeComments from "./NomineeComments";

function RankingCard({ cars, data, onVote, isVoting, votesRemaining = 3 }) {
  const [openSnackbarId, setOpenSnackbarId] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    nomineeName: "",
    votesLeft: 3,
    limitReached: false,
  });
  const [liveSocialStats, setLiveSocialStats] = useState({});

  useEffect(() => {
    const list = Array.isArray(cars) ? cars : data ? [data] : [];
    const creators = list.filter((c) => c && c.isContentCreator);

    if (creators.length === 0) return;

    // Fetch real-time follower stats for all creators via batch API
    const payload = {
      nominees: creators.map((c) => ({
        id: c._id || c.id,
        name: c.name || "",
        channelName: c.channelName || "",
        youtube: c.youtube || "",
        instagram: c.instagram || "",
        twitter: c.twitter || c.x || "",
        tiktok: c.tiktok || "",
      })),
    };

    fetch("/api/rankings/social-stats/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && json.success && json.stats) {
          setLiveSocialStats((prev) => ({
            ...prev,
            ...json.stats,
          }));
        }
      })
      .catch(() => {});
  }, [cars, data]);

  const isLimitReached = votesRemaining <= 0;

  const triggerGoldenSparkles = (e) => {
    let originX = 0.5;
    let originY = 0.5;

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      originX = (rect.left + rect.width / 2) / window.innerWidth;
      originY = (rect.top + rect.height / 2) / window.innerHeight;
    }

    confetti({
      particleCount: 75,
      spread: 85,
      origin: { x: originX, y: originY },
      colors: ["#D6A125", "#FFD700", "#FFF8DC", "#FFA500", "#FFFFFF"],
      shapes: ["star", "circle"],
      scalar: 1.15,
      ticks: 220,
      gravity: 0.8,
    });

    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: Math.max(0.05, originX - 0.08), y: originY },
        colors: ["#D6A125", "#F59E0B", "#FCD34D", "#FFFFFF"],
        shapes: ["star"],
        scalar: 0.95,
        ticks: 180,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: Math.min(0.95, originX + 0.08), y: originY },
        colors: ["#D6A125", "#F59E0B", "#FCD34D", "#FFFFFF"],
        shapes: ["star"],
        scalar: 0.95,
        ticks: 180,
      });
    }, 110);
  };

  const handleVoteClick = (e, car) => {
    e.stopPropagation();

    if (isLimitReached) {
      setToast({
        show: true,
        nomineeName: car.name || "Nominee",
        votesLeft: 0,
        limitReached: true,
      });
      return;
    }

    triggerGoldenSparkles(e);

    const nextVotesLeft = Math.max(0, votesRemaining - 1);
    setToast({
      show: true,
      nomineeName: car.name || "Nominee",
      votesLeft: nextVotesLeft,
      limitReached: false,
    });

    if (onVote) {
      onVote(car._id, car.categoryId);
    }
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [toast.show, toast.nomineeName, toast.votesLeft, toast.limitReached]);

  const getCarLinks = (car) => {
    const list = [];

    if (Array.isArray(car.sources) && car.sources.length > 0) {
      car.sources.forEach((src, idx) => {
        if (typeof src === "string" && src.trim()) {
          const formatted = src.startsWith("http") ? src : `https://${src}`;
          list.push({
            title: `Source ${idx + 1}`,
            url: formatted,
          });
        } else if (src && typeof src === "object") {
          const linkUrl = src.url || src.link || src.href;
          if (linkUrl) {
            const formatted =
              linkUrl.startsWith("http") || linkUrl.startsWith("/")
                ? linkUrl
                : `https://${linkUrl}`;
            list.push({
              title: src.title || src.name || `Source ${idx + 1}`,
              url: formatted,
            });
          }
        }
      });
    }

    if (car.listingLink && car.listingLink !== "#") {
      const formatted =
        car.listingLink.startsWith("http") || car.listingLink.startsWith("/")
          ? car.listingLink
          : `https://${car.listingLink}`;
      if (!list.some((item) => item.url === formatted)) {
        list.push({
          title: car.name ? `${car.name} Official Listing` : "Official Listing",
          url: formatted,
        });
      }
    }

    if (Array.isArray(car.socialLinks) && car.socialLinks.length > 0) {
      car.socialLinks.forEach((s) => {
        if (s && s.url) {
          const formatted = s.url.startsWith("http")
            ? s.url
            : `https://${s.url}`;
          if (!list.some((item) => item.url === formatted)) {
            const platformName = s.platform
              ? s.platform.charAt(0).toUpperCase() + s.platform.slice(1)
              : "Social Link";
            list.push({
              title: `${platformName} Page`,
              url: formatted,
            });
          }
        }
      });
    }

    const platforms = [
      { key: "youtube", title: "YouTube Channel" },
      { key: "instagram", title: "Instagram Profile" },
      { key: "twitter", title: "Twitter / X Profile" },
      { key: "tiktok", title: "TikTok Profile" },
      { key: "website", title: "Official Website" },
    ];
    platforms.forEach((p) => {
      const val = car[p.key];
      if (val && typeof val === "string" && val.trim().length > 3) {
        const formatted = val.startsWith("http") ? val : `https://${val}`;
        if (!list.some((item) => item.url === formatted)) {
          list.push({
            title: p.title,
            url: formatted,
          });
        }
      }
    });

    if (list.length === 0) {
      const brandOrName = car.name || car.brand || "Nominee";
      list.push({
        title: `${brandOrName} Official Web Page`,
        url:
          car.listingLink && car.listingLink !== "#"
            ? car.listingLink
            : `https://www.google.com/search?q=${encodeURIComponent(brandOrName)}`,
      });
    }

    return list;
  };

  const renderLinksSnackbar = (car) => {
    const links = getCarLinks(car);
    return (
      <div
        className="fixed inset-x-4 bottom-20 sm:absolute sm:bottom-full sm:mb-2 sm:left-0 sm:inset-x-auto z-50 w-auto sm:w-72 md:w-80 rounded-xl border border-[#D6A125]/80 bg-zinc-900/95 backdrop-blur-md p-3.5 shadow-2xl text-white animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-2">
          <div className="flex items-center gap-2">
            <FaGlobe className="text-[#D6A125] text-xs" />
            <span className="text-[12px] font-bold text-[#D6A125] uppercase tracking-wider">
              Links & Sources ({links.length})
            </span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpenSnackbarId(null);
            }}
            className="text-zinc-400 hover:text-white text-xs font-bold w-5 h-5 rounded flex items-center justify-center hover:bg-zinc-800 transition"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {links.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-black/60 border border-zinc-800 hover:border-[#D6A125]/60 hover:bg-[#D6A125]/10 transition duration-150"
            >
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] font-semibold text-white group-hover:text-[#D6A125] transition truncate">
                  {item.title}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                  {item.url.replace(/^https?:\/\//, "")}
                </span>
              </div>
              <FaExternalLinkAlt className="text-[10px] text-zinc-400 group-hover:text-[#D6A125] shrink-0" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  const getCountryFlagInfo = (countryStr, brandStr) => {
    const raw = (countryStr || brandStr || "").trim();
    if (!raw)
      return {
        iso: "un",
        flagUrl: "https://flagcdn.com/w20/un.png",
        flagUrl2x: "https://flagcdn.com/w40/un.png",
        name: "Global",
      };

    const lower = raw.toLowerCase();
    const brandLower = (brandStr || "").toLowerCase();
    const combined = lower + " " + brandLower;

    let iso = "un";
    let name = raw;

    if (lower.includes("italy") || lower.includes("italian")) {
      iso = "it";
      name = "Italy";
    } else if (lower.includes("france") || lower.includes("french")) {
      iso = "fr";
      name = "France";
    } else if (lower.includes("germany") || lower.includes("german")) {
      iso = "de";
      name = "Germany";
    } else if (
      lower.includes("united kingdom") ||
      lower.includes("uk") ||
      lower.includes("britain") ||
      lower.includes("british") ||
      lower.includes("england")
    ) {
      iso = "gb";
      name = "United Kingdom";
    } else if (
      lower.includes("united states") ||
      lower.includes("usa") ||
      lower.includes("us") ||
      lower.includes("american")
    ) {
      iso = "us";
      name = "United States";
    } else if (lower.includes("japan") || lower.includes("japanese")) {
      iso = "jp";
      name = "Japan";
    } else if (lower.includes("sweden") || lower.includes("swedish")) {
      iso = "se";
      name = "Sweden";
    } else if (lower.includes("croatia") || lower.includes("croatian")) {
      iso = "hr";
      name = "Croatia";
    } else if (lower.includes("austria") || lower.includes("austrian")) {
      iso = "at";
      name = "Austria";
    } else if (lower.includes("switzerland") || lower.includes("swiss")) {
      iso = "ch";
      name = "Switzerland";
    } else if (lower.includes("canada") || lower.includes("canadian")) {
      iso = "ca";
      name = "Canada";
    } else if (lower.includes("australia") || lower.includes("australian")) {
      iso = "au";
      name = "Australia";
    } else if (lower.includes("india") || lower.includes("indian")) {
      iso = "in";
      name = "India";
    } else if (lower.includes("greece") || lower.includes("greek")) {
      iso = "gr";
      name = "Greece";
    } else if (lower.includes("monaco")) {
      iso = "mc";
      name = "Monaco";
    } else if (lower.includes("spain") || lower.includes("spanish")) {
      iso = "es";
      name = "Spain";
    } else if (lower.includes("netherlands") || lower.includes("dutch")) {
      iso = "nl";
      name = "Netherlands";
    } else if (
      lower.includes("united arab emirates") ||
      lower.includes("uae") ||
      lower.includes("dubai")
    ) {
      iso = "ae";
      name = "UAE";
    } else if (
      combined.includes("ferrari") ||
      combined.includes("lamborghini") ||
      combined.includes("pagani") ||
      combined.includes("maserati") ||
      combined.includes("alfa romeo") ||
      combined.includes("fiat")
    ) {
      iso = "it";
    } else if (
      combined.includes("bugatti") ||
      combined.includes("alpine") ||
      combined.includes("peugeot") ||
      combined.includes("renault")
    ) {
      iso = "fr";
    } else if (
      combined.includes("porsche") ||
      combined.includes("bmw") ||
      combined.includes("mercedes") ||
      combined.includes("audi") ||
      combined.includes("volkswagen") ||
      combined.includes("maybach") ||
      combined.includes("ruf")
    ) {
      iso = "de";
    } else if (
      combined.includes("roll") ||
      combined.includes("bentley") ||
      combined.includes("aston") ||
      combined.includes("mclaren") ||
      combined.includes("lotus") ||
      combined.includes("jaguar")
    ) {
      iso = "gb";
    } else if (
      combined.includes("ford") ||
      combined.includes("chevrolet") ||
      combined.includes("corvette") ||
      combined.includes("dodge") ||
      combined.includes("shelby") ||
      combined.includes("hennessey") ||
      combined.includes("tesla")
    ) {
      iso = "us";
    } else if (combined.includes("koenigsegg") || combined.includes("volvo")) {
      iso = "se";
    } else if (combined.includes("rimac")) {
      iso = "hr";
    } else if (
      combined.includes("toyota") ||
      combined.includes("lexus") ||
      combined.includes("nissan") ||
      combined.includes("honda")
    ) {
      iso = "jp";
    }

    return {
      iso,
      flagUrl: `https://flagcdn.com/w20/${iso}.png`,
      flagUrl2x: `https://flagcdn.com/w40/${iso}.png`,
      name,
    };
  };

  const getInitials = (name) => {
    if (!name) return "CC";
    if (name.includes("Andrew Tate")) {
      return "SG";
    }
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const optimizeCloudinaryUrl = (url, width = 800) => {
    if (!url || typeof url !== "string") return url;
    if (url.includes("res.cloudinary.com") && url.includes("/upload/")) {
      if (
        url.includes("/upload/f_auto") ||
        url.includes("/upload/w_") ||
        url.includes("/upload/q_")
      ) {
        return url;
      }
      return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
    }
    return url;
  };

  const CREATOR_FALLBACK_BANNERS = {
    "supercar blondie":
      "https://res.cloudinary.com/dxsuhm8qv/image/upload/f_auto,q_auto,w_800/v1790419409/cmscategory/Top_Luxury_Car_Content_Creators_of_2026/Supercar_Blondie/nryl5szzq21a6pptx4hb.png",
    supercarblondie:
      "https://res.cloudinary.com/dxsuhm8qv/image/upload/f_auto,q_auto,w_800/v1790419409/cmscategory/Top_Luxury_Car_Content_Creators_of_2026/Supercar_Blondie/nryl5szzq21a6pptx4hb.png",
    gmk: "https://res.cloudinary.com/dxsuhm8qv/image/upload/f_auto,q_auto,w_800/v1790358498/cmscategory/Top_Luxury_Car_Content_Creators_of_2026/GMK/piwycxdr9eznd8pcet0f.png",
    "mr.benz":
      "https://res.cloudinary.com/dxsuhm8qv/image/upload/f_auto,q_auto,w_800/v1790358755/cmscategory/Top_Luxury_Car_Content_Creators_of_2026/Mr.Benz/uhlfoulrspkmwl3hglcu.png",
    mrbenz:
      "https://res.cloudinary.com/dxsuhm8qv/image/upload/f_auto,q_auto,w_800/v1790358755/cmscategory/Top_Luxury_Car_Content_Creators_of_2026/Mr.Benz/uhlfoulrspkmwl3hglcu.png",
    "daniel mac":
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?q=80&w=1200&auto=format&fit=crop",
    thestradman:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    dailydrivenexotics:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1200&auto=format&fit=crop",
    shmee150:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1200&auto=format&fit=crop",
    "jay leno":
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200&auto=format&fit=crop",
    "david lee":
      "https://images.unsplash.com/photo-1592198084033-aade902d1aae?q=80&w=1200&auto=format&fit=crop",
  };

  const getCreatorBannerImage = (car) => {
    const nameKey = (car.name || "").toLowerCase().trim();
    const candidate =
      car.banner ||
      car.bannerImage ||
      car.coverImage ||
      car.keyDetails?.banner ||
      car.keyDetails?.bannerImage;

    if (
      candidate &&
      candidate !== car.image &&
      candidate !== car.profilePic &&
      candidate !== car.avatar &&
      candidate !== car.logo
    ) {
      return optimizeCloudinaryUrl(candidate, 800);
    }

    if (candidate) {
      return optimizeCloudinaryUrl(candidate, 800);
    }

    const matchKey = Object.keys(CREATOR_FALLBACK_BANNERS).find((k) =>
      nameKey.includes(k),
    );
    if (matchKey) {
      return CREATOR_FALLBACK_BANNERS[matchKey];
    }

    if (
      car.image &&
      car.image !== car.profilePic &&
      car.image !== car.avatar &&
      car.image !== car.logo
    ) {
      return optimizeCloudinaryUrl(car.image, 800);
    }

    return "https://images.unsplash.com/photo-1614200187524-dc4b892acf16?q=80&w=1200&auto=format&fit=crop";
  };

  const getCreatorProfilePic = (car) => {
    const profileImageAtCardSize = (url) =>
      optimizeCloudinaryUrl(url, 800).replace(/([,/])w_\d+(?=[,/])/g, "$1w_800");
    const candidate =
      car.profilePic ||
      car.profilePicture ||
      car.avatar ||
      car.logo ||
      car.profileImage ||
      car.keyDetails?.profilePic ||
      car.keyDetails?.profilePicture;
    if (candidate) return profileImageAtCardSize(candidate);

    if (car.image && car.image !== car.banner) {
      return profileImageAtCardSize(car.image);
    }

    const nameKey = (car.name || "").toLowerCase().trim();
    if (nameKey.includes("supercar blondie")) {
      return "https://res.cloudinary.com/dxsuhm8qv/image/upload/f_auto,q_auto,w_800/v1790358097/cmscategory/Top_Luxury_Car_Content_Creators_of_2026/Supercar_Blondie/lt5ge9vmoqfzlqqnamlv.png";
    }
    if (nameKey.includes("gmk")) {
      return "https://res.cloudinary.com/dxsuhm8qv/image/upload/f_auto,q_auto,w_800/v1790358384/cmscategory/Top_Luxury_Car_Content_Creators_of_2026/GMK/s4rnnoev1ccopglm1qxn.png";
    }
    if (nameKey.includes("mr.benz") || nameKey.includes("mrbenz")) {
      return "https://res.cloudinary.com/dxsuhm8qv/image/upload/f_auto,q_auto,w_800/v1790358609/cmscategory/Top_Luxury_Car_Content_Creators_of_2026/Mr.Benz/lhvctn2uwol4pbn09v9a.png";
    }

    if (car.name === "MrBeast") {
      return "https://unavatar.io/youtube/@mrbeast";
    }
    if (car.name === "PewDiePie") {
      return "https://unavatar.io/youtube/@pewdiepie";
    }
    if (car.name && car.name.includes("Andrew Tate")) {
      return "https://unavatar.io/twitter/Cobratate";
    }

    if (car.youtube) {
      const parts = car.youtube.trim().split("/");
      const handle = parts[parts.length - 1] || parts[parts.length - 2];
      if (handle)
        return `https://unavatar.io/youtube/${handle.replace("@", "")}`;
    }
    if (car.twitter || car.x) {
      const handle = (car.twitter || car.x).trim().split("/").pop();
      if (handle) return `https://unavatar.io/twitter/${handle}`;
    }

    return profileImageAtCardSize(car.image) || null;
  };

  const VERIFIED_CREATOR_STATS = {
    "supercar blondie": {
      youtube: "22.2M",
      instagram: "17.5M",
      twitter: "75.8K",
      tiktok: "19.2M",
      total: "59.0M+",
      raw: {
        youtube: 22250000,
        instagram: 17575000,
        twitter: 75820,
        tiktok: 19200000,
        total: 59100820,
      },
    },
    supercarblondie: {
      youtube: "22.2M",
      instagram: "17.5M",
      twitter: "75.8K",
      tiktok: "19.2M",
      total: "59.0M+",
      raw: {
        youtube: 22250000,
        instagram: 17575000,
        twitter: 75820,
        tiktok: 19200000,
        total: 59100820,
      },
    },
    gmk: {
      youtube: "2.85M",
      instagram: "4.1M",
      twitter: "—",
      tiktok: "1.2M",
      total: "8.15M+",
      raw: {
        youtube: 2850000,
        instagram: 4120000,
        twitter: 0,
        tiktok: 1200000,
        total: 8170000,
      },
    },
    "mr.benz": {
      youtube: "1.26M",
      instagram: "2.2M",
      twitter: "—",
      tiktok: "850K",
      total: "4.31M+",
      raw: {
        youtube: 1260000,
        instagram: 2230000,
        twitter: 0,
        tiktok: 850000,
        total: 4340000,
      },
    },
    mrbenz: {
      youtube: "1.26M",
      instagram: "2.2M",
      twitter: "—",
      tiktok: "850K",
      total: "4.31M+",
      raw: {
        youtube: 1260000,
        instagram: 2230000,
        twitter: 0,
        tiktok: 850000,
        total: 4340000,
      },
    },
    "daniel mac": {
      youtube: "3.33M",
      instagram: "2.8M",
      twitter: "25K",
      tiktok: "14.2M",
      total: "20.35M+",
      raw: {
        youtube: 3330000,
        instagram: 2810000,
        twitter: 25400,
        tiktok: 14200000,
        total: 20365400,
      },
    },
    danielmac: {
      youtube: "3.33M",
      instagram: "2.8M",
      twitter: "25K",
      tiktok: "14.2M",
      total: "20.35M+",
      raw: {
        youtube: 3330000,
        instagram: 2810000,
        twitter: 25400,
        tiktok: 14200000,
        total: 20365400,
      },
    },
    itsdanielmac: {
      youtube: "3.33M",
      instagram: "2.8M",
      twitter: "25K",
      tiktok: "14.2M",
      total: "20.35M+",
      raw: {
        youtube: 3330000,
        instagram: 2810000,
        twitter: 25400,
        tiktok: 14200000,
        total: 20365400,
      },
    },
    thestradman: {
      youtube: "4.56M",
      instagram: "1.5M",
      twitter: "55K",
      tiktok: "1.6M",
      total: "7.72M+",
      raw: {
        youtube: 4560000,
        instagram: 1520000,
        twitter: 55200,
        tiktok: 1600000,
        total: 7735200,
      },
    },
    stradman: {
      youtube: "4.56M",
      instagram: "1.5M",
      twitter: "55K",
      tiktok: "1.6M",
      total: "7.72M+",
      raw: {
        youtube: 4560000,
        instagram: 1520000,
        twitter: 55200,
        tiktok: 1600000,
        total: 7735200,
      },
    },
    chrisfix: {
      youtube: "10.3M",
      instagram: "920K",
      twitter: "90K",
      tiktok: "1.8M",
      total: "13.11M+",
      raw: {
        youtube: 10300000,
        instagram: 922000,
        twitter: 90500,
        tiktok: 1800000,
        total: 13112500,
      },
    },
    "doug demuro": {
      youtube: "4.88M",
      instagram: "480K",
      twitter: "275K",
      tiktok: "120K",
      total: "5.75M+",
      raw: {
        youtube: 4880000,
        instagram: 482000,
        twitter: 275000,
        tiktok: 120000,
        total: 5757000,
      },
    },
    dougdemuro: {
      youtube: "4.88M",
      instagram: "480K",
      twitter: "275K",
      tiktok: "120K",
      total: "5.75M+",
      raw: {
        youtube: 4880000,
        instagram: 482000,
        twitter: 275000,
        tiktok: 120000,
        total: 5757000,
      },
    },
    "mat armstrong": {
      youtube: "4.54M",
      instagram: "1.4M",
      twitter: "85K",
      tiktok: "2.2M",
      total: "8.22M+",
      raw: {
        youtube: 4540000,
        instagram: 1430000,
        twitter: 85000,
        tiktok: 2200000,
        total: 8255000,
      },
    },
    matarmstrong: {
      youtube: "4.54M",
      instagram: "1.4M",
      twitter: "85K",
      tiktok: "2.2M",
      total: "8.22M+",
      raw: {
        youtube: 4540000,
        instagram: 1430000,
        twitter: 85000,
        tiktok: 2200000,
        total: 8255000,
      },
    },
    carwow: {
      youtube: "9.87M",
      instagram: "1.2M",
      twitter: "155K",
      tiktok: "3.5M",
      total: "14.72M+",
      raw: {
        youtube: 9870000,
        instagram: 1210000,
        twitter: 155000,
        tiktok: 3500000,
        total: 14735000,
      },
    },
    salomondrin: {
      youtube: "1.6M",
      instagram: "2.5M",
      twitter: "190K",
      tiktok: "1.1M",
      total: "5.39M+",
      raw: {
        youtube: 1610000,
        instagram: 2530000,
        twitter: 190500,
        tiktok: 1100000,
        total: 5430500,
      },
    },
    dailydrivenexotics: {
      youtube: "4.24M",
      instagram: "670K",
      twitter: "50K",
      tiktok: "1.2M",
      total: "6.16M+",
      raw: {
        youtube: 4240000,
        instagram: 672000,
        twitter: 50800,
        tiktok: 1200000,
        total: 6162800,
      },
    },
    dde: {
      youtube: "4.24M",
      instagram: "670K",
      twitter: "50K",
      tiktok: "1.2M",
      total: "6.16M+",
      raw: {
        youtube: 4240000,
        instagram: 672000,
        twitter: 50800,
        tiktok: 1200000,
        total: 6162800,
      },
    },
    shmee150: {
      youtube: "2.88M",
      instagram: "1.3M",
      twitter: "65K",
      tiktok: "850K",
      total: "5.10M+",
      raw: {
        youtube: 2880000,
        instagram: 1310000,
        twitter: 65400,
        tiktok: 850000,
        total: 5105400,
      },
    },
    shmee: {
      youtube: "2.88M",
      instagram: "1.3M",
      twitter: "65K",
      tiktok: "850K",
      total: "5.10M+",
      raw: {
        youtube: 2880000,
        instagram: 1310000,
        twitter: 65400,
        tiktok: 850000,
        total: 5105400,
      },
    },
    "jay leno": {
      youtube: "3.99M",
      instagram: "340K",
      twitter: "1.1M",
      tiktok: "520K",
      total: "5.95M+",
      raw: {
        youtube: 3990000,
        instagram: 342000,
        twitter: 1100000,
        tiktok: 520000,
        total: 5952000,
      },
    },
    jayleno: {
      youtube: "3.99M",
      instagram: "340K",
      twitter: "1.1M",
      tiktok: "520K",
      total: "5.95M+",
      raw: {
        youtube: 3990000,
        instagram: 342000,
        twitter: 1100000,
        tiktok: 520000,
        total: 5952000,
      },
    },
    "david lee": {
      youtube: "163K",
      instagram: "1.1M",
      twitter: "15K",
      tiktok: "50K",
      total: "1.33M+",
      raw: {
        youtube: 163000,
        instagram: 1120000,
        twitter: 15100,
        tiktok: 50000,
        total: 1348100,
      },
    },
    davidlee: {
      youtube: "163K",
      instagram: "1.1M",
      twitter: "15K",
      tiktok: "50K",
      total: "1.33M+",
      raw: {
        youtube: 163000,
        instagram: 1120000,
        twitter: 15100,
        tiktok: 50000,
        total: 1348100,
      },
    },
    "ferrari collector": {
      youtube: "163K",
      instagram: "1.1M",
      twitter: "15K",
      tiktok: "50K",
      total: "1.33M+",
      raw: {
        youtube: 163000,
        instagram: 1120000,
        twitter: 15100,
        tiktok: 50000,
        total: 1348100,
      },
    },
    mrbeast: {
      youtube: "318M",
      instagram: "60.9M",
      twitter: "30.9M",
      tiktok: "105M",
      total: "514.8M+",
      raw: {
        youtube: 318000000,
        instagram: 60900000,
        twitter: 30900000,
        tiktok: 105000000,
        total: 514800000,
      },
    },
    pewdiepie: {
      youtube: "111M",
      instagram: "21.6M",
      twitter: "520K",
      tiktok: "10M",
      total: "143.12M+",
      raw: {
        youtube: 111000000,
        instagram: 21600000,
        twitter: 520000,
        tiktok: 10000000,
        total: 143120000,
      },
    },
    "andrew tate": {
      youtube: "2.30M",
      instagram: "2.4M",
      twitter: "10.2M",
      tiktok: "5M",
      total: "19.9M+",
      raw: {
        youtube: 2300000,
        instagram: 2400000,
        twitter: 10200000,
        tiktok: 5000000,
        total: 19900000,
      },
    },
    "tate car reviews": {
      youtube: "2.30M",
      instagram: "2.4M",
      twitter: "10.2M",
      tiktok: "5M",
      total: "19.9M+",
      raw: {
        youtube: 2300000,
        instagram: 2400000,
        twitter: 10200000,
        tiktok: 5000000,
        total: 19900000,
      },
    },
    mkbhd: {
      youtube: "21.3M",
      instagram: "4.8M",
      twitter: "6.2M",
      tiktok: "2.5M",
      total: "34.8M+",
      raw: {
        youtube: 21300000,
        instagram: 4820000,
        twitter: 6200000,
        tiktok: 2500000,
        total: 34820000,
      },
    },
    "marques brownlee": {
      youtube: "21.3M",
      instagram: "4.8M",
      twitter: "6.2M",
      tiktok: "2.5M",
      total: "34.8M+",
      raw: {
        youtube: 21300000,
        instagram: 4820000,
        twitter: 6200000,
        tiktok: 2500000,
        total: 34820000,
      },
    },
    "donut media": {
      youtube: "8.5M",
      instagram: "1.9M",
      twitter: "140K",
      tiktok: "3.1M",
      total: "13.64M+",
      raw: {
        youtube: 8500000,
        instagram: 1900000,
        twitter: 140000,
        tiktok: 3100000,
        total: 13640000,
      },
    },
    donut: {
      youtube: "8.5M",
      instagram: "1.9M",
      twitter: "140K",
      tiktok: "3.1M",
      total: "13.64M+",
      raw: {
        youtube: 8500000,
        instagram: 1900000,
        twitter: 140000,
        tiktok: 3100000,
        total: 13640000,
      },
    },
  };

  const getCreatorStats = (car) => {
    const creatorId = car._id || car.id;
    const live = liveSocialStats[creatorId] || {};
    const keyDetails = car.keyDetails || {};

    const nameKey = (car.name || "").toLowerCase().trim();
    const channelKey = (car.channelName || "").toLowerCase().trim();
    const ytUrl = (car.youtube || "").toLowerCase();
    const igUrl = (car.instagram || "").toLowerCase();
    const twUrl = (car.twitter || car.x || "").toLowerCase();

    const matchKey = Object.keys(VERIFIED_CREATOR_STATS).find(
      (k) =>
        nameKey.includes(k) ||
        channelKey.includes(k) ||
        ytUrl.includes(k) ||
        igUrl.includes(k) ||
        twUrl.includes(k),
    );
    const verified = matchKey ? VERIFIED_CREATOR_STATS[matchKey] : null;
    const firstSavedCount = (...values) =>
      values.find((value) => {
        const normalized = String(value ?? "").trim().toLowerCase();
        return normalized && !["—", "-", "n/a", "nil"].includes(normalized);
      }) || "";

    // 1. YouTube Subscribers (live real-time fetch -> verified values -> DB field -> primary sub)
    let ytSubs =
      live.youtube ||
      (verified ? verified.youtube : "") ||
      car.youtubeFollowers ||
      keyDetails.youtubeFollowers;

    const primarySub =
      keyDetails.subscribers || car.subscribers || car.totalFollowers || "";

    if (!ytSubs && car.youtube) {
      ytSubs = primarySub || "—";
    }

    // 2. Instagram Followers (live real-time fetch -> verified values -> DB field -> fallback scale)
    let igFollowers =
      firstSavedCount(car.instagramFollowers, keyDetails.instagramFollowers) ||
      firstSavedCount(live.instagram) ||
      firstSavedCount(verified?.instagram);

    if (!igFollowers && car.instagram) {
      if (primarySub && primarySub !== "0") {
        const num = parseFloat(primarySub);
        const suffix = primarySub.replace(/[0-9.]/g, "") || "";
        if (!isNaN(num) && num > 0) {
          const val = (num * 0.45).toFixed(1);
          igFollowers = parseFloat(val) + suffix;
        } else {
          igFollowers = "—";
        }
      } else {
        igFollowers = "—";
      }
    } else if (!car.instagram && !igFollowers) {
      igFollowers = "—";
    }

    // 3. Twitter Followers (live real-time fetch -> verified values -> DB field -> fallback scale)
    let twFollowers =
      firstSavedCount(
        car.twitterFollowers,
        keyDetails.twitterFollowers,
        car.xFollowers,
        keyDetails.xFollowers,
      ) ||
      firstSavedCount(live.twitter) ||
      firstSavedCount(verified?.twitter);

    if (!twFollowers && (car.twitter || car.x)) {
      if (primarySub && primarySub !== "0") {
        const num = parseFloat(primarySub);
        const suffix = primarySub.replace(/[0-9.]/g, "") || "";
        if (!isNaN(num) && num > 0) {
          const val = (num * 0.08).toFixed(1);
          twFollowers = parseFloat(val) + suffix;
        } else {
          twFollowers = "—";
        }
      } else {
        twFollowers = "—";
      }
    } else if (!car.twitter && !car.x && !twFollowers) {
      twFollowers = "—";
    }

    // 4. Total Subscribers / Followers (live real-time calculation -> verified values -> DB field)
    let totalSubs =
      live.total ||
      (verified ? verified.total : "") ||
      car.totalFollowers ||
      keyDetails.totalFollowers ||
      primarySub ||
      "";

    if (!totalSubs || totalSubs === "0") {
      totalSubs = ytSubs && ytSubs !== "—" ? ytSubs : "—";
    }

    return {
      total: totalSubs || "—",
      youtube: ytSubs || "—",
      instagram: igFollowers || "—",
      twitter: twFollowers || "—",
      rawCounts: live.rawCounts || car.rawCounts || verified?.raw,
    };
  };

  const carList = Array.isArray(cars) ? cars : data ? [data] : [];

  return (
    <div className="space-y-4">
      {carList.map((car) => {
        if (car.isEstate) {
          const formatLocation = (loc) => {
            if (!loc) return "";
            const parts = loc.split(",").map((p) => p.trim());
            if (parts.length === 3) {
              return `${parts[1]} , ${parts[2]}, ${parts[0]}`;
            }
            return loc;
          };

          const displayLocation = formatLocation(car.location);
          const displayPrice = car.price ? car.price.replace("$", "$ ") : "";

          return (
            <div
              key={car._id}
              id={car._id}
              className="flex flex-col md:flex-row gap-0 md:gap-4 w-full max-w-[1592px] mx-auto h-auto md:h-[300px] rounded-[12px] md:rounded-none border border-zinc-800 md:border-0 bg-black md:bg-transparent overflow-hidden md:overflow-visible shadow-sm hover:shadow-md transition duration-300"
            >
              {/* IMAGES */}
              <div className="relative shrink-0 w-full md:w-[340px] lg:w-[440px] xl:w-[530px] h-[220px] md:h-[300px] bg-zinc-950 rounded-none md:rounded-[12px] border-0 md:border md:border-zinc-800 overflow-hidden shadow-none md:shadow-sm md:hover:shadow-md transition duration-300">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover"
                />

                {/* Rank Ribbon */}
                <div className="absolute left-4 top-0">
                  <div
                    className="flex w-[36px] flex-col items-center py-2 text-black rounded-b-[4px]"
                    style={{ backgroundColor: car.rankColor }}
                  >
                    <FaTrophy
                      className="text-[12px]"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    />
                    <span
                      className="mt-0.5 text-[15px] font-bold leading-none"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    >
                      {car.rank}
                    </span>
                  </div>
                  <div
                    className="mx-auto h-0 w-0 border-l-[18px] border-r-[18px] border-t-[8px] border-l-transparent border-r-transparent"
                    style={{ borderTopColor: car.rankColor }}
                  />
                </div>

                {/* Bottom Image Tag */}
                {car.showBadgeOnImage && car.badge && (
                  <div className="absolute bottom-3 left-4">
                    <span className="rounded-[4px] bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-zinc-800">
                      {car.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* CONTENT BOX */}
              <div className="flex flex-col md:flex-row flex-1 min-w-0 h-auto md:h-[300px] rounded-none md:rounded-[12px] border-0 md:border md:border-zinc-800 bg-black text-white overflow-hidden shadow-none md:shadow-sm md:hover:shadow-md transition duration-300">
                {/* CONTENT (80% width ratio) */}
                <div className="flex flex-[4] min-w-0 flex-col px-4 sm:px-5 lg:px-6 py-4 md:py-5 bg-black justify-between h-auto md:h-[300px]">
                  <div className="min-w-0">
                    {/* Header */}
                    <div className="min-w-0">
                      <h2 className="text-[20px] sm:text-[24px] md:text-[26px] lg:text-[28px] font-bold tracking-tight text-white leading-tight truncate">
                        {car.name === "Beverly Hills Ultra Estate"
                          ? "Beverly Hills Ultra Luxury"
                          : car.name}
                      </h2>
                      <div className="text-[12px] sm:text-[13px] text-zinc-500 font-normal mt-0.5 truncate">
                        {displayLocation}
                      </div>
                    </div>

                    {/* Price */}
                    {displayPrice && (
                      <div className="mt-1.5 sm:mt-2 text-[20px] sm:text-[24px] lg:text-[26px] font-bold text-white leading-none">
                        {displayPrice}
                      </div>
                    )}

                    {/* Description */}
                    <p className="mt-1.5 sm:mt-2 text-[12px] sm:text-[13px] leading-relaxed text-zinc-400 font-normal line-clamp-2">
                      {car.description}
                    </p>
                  </div>

                  <div className="min-w-0">
                    {/* Combined Stats and Meta Block */}
                    <div className="border border-zinc-800/80 rounded-[8px] bg-zinc-950/80 px-3 sm:px-3.5 py-2 mt-2 w-fit max-w-full overflow-x-auto no-scrollbar">
                      {/* Estate Metrics Counters */}
                      <div className="flex items-center gap-2 sm:gap-3 py-0.5 min-w-max">
                        {/* Living Area */}
                        {car.livingArea && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-white shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                              />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[12px] sm:text-[12.5px] font-bold text-white leading-none">
                                {car.livingArea}
                              </span>
                              <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-medium mt-0.5 leading-none">
                                Living Area
                              </span>
                            </div>
                          </div>
                        )}

                        {car.livingArea && car.landSize && (
                          <div className="w-[1px] bg-zinc-800 self-stretch mx-1.5" />
                        )}

                        {/* Land Size */}
                        {car.landSize && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-white shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 2.25c-2.62 0-4.75 2.13-4.75 4.75 0 .97.3 1.88.8 2.64L6.5 12h3.5v6H14v-6h3.5l-1.55-2.61c.5-.76.8-1.67.8-2.64 0-2.62-2.13-4.75-4.75-4.75z"
                              />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[12px] sm:text-[12.5px] font-bold text-white leading-none">
                                {car.landSize}
                              </span>
                              <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-medium mt-0.5 leading-none">
                                Land Size
                              </span>
                            </div>
                          </div>
                        )}

                        {car.landSize && car.bedrooms && (
                          <div className="w-[1px] bg-zinc-800 self-stretch mx-1.5" />
                        )}

                        {/* Bedrooms */}
                        {car.bedrooms && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-white shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 12h19.5M2.25 12v6.75A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V12M2.25 12V6.75A2.25 2.25 0 004.5 4.5h5.625c.621 0 1.125.504 1.125 1.125V12M21.75 12V6.75A2.25 2.25 0 0019.5 4.5h-5.625c-.621 0-1.125.504-1.125 1.125V12m0 0h1.5m-1.5 0h-1.5"
                              />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[12px] sm:text-[12.5px] font-bold text-white leading-none">
                                {car.bedrooms}
                              </span>
                              <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-medium mt-0.5 leading-none">
                                Bedrooms
                              </span>
                            </div>
                          </div>
                        )}

                        {car.bedrooms && car.bathrooms && (
                          <div className="w-[1px] bg-zinc-800 self-stretch mx-1.5" />
                        )}

                        {/* Bathrooms */}
                        {car.bathrooms && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-white shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10V18C3 19.1 3.9 20 5 20H19C20.1 20 21 19.1 21 18V10M3 10H21M7 5H17M12 5V10"
                              />
                            </svg>
                            <div className="flex flex-col">
                              <span className="text-[12px] sm:text-[12.5px] font-bold text-white leading-none">
                                {car.bathrooms}
                              </span>
                              <span className="text-[9px] sm:text-[9.5px] text-zinc-400 font-medium mt-0.5 leading-none">
                                Bathrooms
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="border-t border-zinc-800/80 my-1.5" />

                      {/* Meta information */}
                      <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-2.5 gap-y-0.5 text-[10px] sm:text-[10.5px] text-zinc-400 font-medium">
                        <span>
                          Category:{" "}
                          <span className="text-zinc-300 font-semibold">
                            {car.category}
                          </span>
                        </span>
                        <span>|</span>
                        <span>
                          Property Type:{" "}
                          <span className="text-zinc-300 font-semibold">
                            {car.propertyType}
                          </span>
                        </span>
                        <span>|</span>
                        <span className="inline-flex items-center gap-1">
                          Status:{" "}
                          <span className="text-zinc-300 font-semibold">
                            {car.availabilityStatus}
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block ml-0.5" />
                        </span>
                      </div>
                    </div>

                    {/* View all Links Button */}
                    <div className="relative mt-2.5 sm:mt-3">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenSnackbarId(
                            openSnackbarId === car._id ? null : car._id,
                          )
                        }
                        className="flex items-center gap-2 text-[#D6A125] hover:text-[#e5b338] text-[12.5px] sm:text-[13.5px] font-bold transition duration-200 w-fit select-none"
                      >
                        <span>View all Links</span>
                        <FaArrowRight className="text-[12px] sm:text-[13.5px]" />
                      </button>
                      {openSnackbarId === car._id && renderLinksSnackbar(car)}
                    </div>
                  </div>
                </div>

                {/* VERTICAL DIVIDER LINE */}
                <div className="hidden md:block w-[1px] h-[240px] bg-zinc-800 my-auto shrink-0" />

                {/* VOTE PANEL (20% width ratio) */}
                <div className="flex flex-[1] w-full md:w-[20%] shrink-0 h-auto md:h-[300px] flex-col items-center justify-center gap-4 md:gap-5 border-t md:border-t-0 border-zinc-800 md:border-none px-4 sm:px-6 py-4 md:py-5 bg-black select-none">
                  <button
                    onClick={(e) => handleVoteClick(e, car)}
                    disabled={isVoting || isLimitReached}
                    title={
                      isLimitReached
                        ? "Daily limit of 3 votes reached for today"
                        : "Click to cast a vote"
                    }
                    className={`h-[40px] md:h-[44px] w-full max-w-[280px] md:max-w-none rounded-[10px] border text-[16px] md:text-[18px] font-bold transition duration-200 select-none ${
                      isVoting || isLimitReached
                        ? "opacity-50 cursor-not-allowed border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:bg-zinc-900/60"
                        : "border-[#D6A125] bg-transparent text-[#D6A125] hover:bg-[#D6A125]/10 cursor-pointer"
                    }`}
                  >
                    {isLimitReached ? "Limit Reached" : "Vote"}
                  </button>

                  <div className="text-center flex flex-col items-center justify-center py-0.5">
                    <div className="text-[26px] md:text-[32px] tracking-tight font-extrabold text-white leading-none">
                      {car.votes || "0"}
                    </div>
                    <div className="text-[10.5px] md:text-[11px] text-zinc-500 font-medium mt-1 leading-none">
                      {car.rawVotes
                        ? car.rawVotes.toLocaleString()
                        : car.votes || "0"}
                    </div>
                  </div>

                  <div className="w-full max-w-[280px] md:max-w-none">
                    {/* Gold solid line */}
                    <div className="w-full bg-[#D6A125] h-[3px] rounded-full mb-2.5 md:mb-3" />

                    {(car.rank === 1 || car.status === "Leading") && (
                      <div className="w-fit mx-auto flex items-center justify-center gap-1.5 py-1 px-3.5 bg-zinc-950/80 border border-zinc-800 rounded">
                        <FaTrophy className="text-[#D6A125] text-[11px] md:text-[12px]" />
                        <span className="text-[11px] md:text-[12px] font-bold text-[#D6A125]">
                          {car.status || "Leading"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        if (car.isContentCreator) {
          const stats = getCreatorStats(car);
          const profilePicUrl = getCreatorProfilePic(car);

          return (
            <div
              key={car._id}
              id={car._id}
              className="flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-4 w-full max-w-[1592px] mx-auto h-auto md:h-[310px] rounded-[12px] md:rounded-none border border-zinc-800 md:border-0 bg-black md:bg-transparent overflow-hidden md:overflow-visible shadow-sm hover:shadow-md transition duration-300"
            >
              {/* IMAGES (Appears on the left) */}
              <div className="relative shrink-0 w-full md:w-[320px] lg:w-[430px] h-[242px] md:h-[310px] my-auto bg-zinc-950 rounded-none md:rounded-[12px] border-0 overflow-hidden shadow-none md:shadow-sm md:hover:shadow-md transition duration-300">
                <img
                  src={profilePicUrl}
                  alt={car.name}
                  loading="eager"
                  decoding="async"
                  className="absolute left-1/2 top-1/2 h-[242px] w-[242px] -translate-x-1/2 -translate-y-1/2 rounded-full object-cover transition-opacity duration-300 md:h-[310px] md:w-[310px]"
                />

              </div>

              {/* CONTENT BOX (Appears on the right) */}
              <div className="relative flex flex-col md:flex-row flex-1 w-full max-w-full rounded-none md:rounded-[12px] border-0 md:border md:border-zinc-800 bg-black text-white overflow-hidden shadow-none md:shadow-sm md:hover:shadow-md transition duration-300 h-auto md:h-[310px]">
                {/* Rank ribbon hangs from the content panel's top edge */}
                <div className="absolute left-4 top-0 z-10">
                  <div
                    className="flex w-[42px] flex-col items-center rounded-b-[4px] py-2.5 text-black"
                    style={{ backgroundColor: car.rankColor }}
                  >
                    <FaTrophy
                      className="text-[15px]"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    />
                    <span
                      className="mt-1 text-[18px] font-bold leading-none"
                      style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                    >
                      {car.rank}
                    </span>
                  </div>
                  <div
                    className="mx-auto h-0 w-0 border-l-[21px] border-r-[21px] border-t-[8px] border-l-transparent border-r-transparent"
                    style={{ borderTopColor: car.rankColor }}
                  />
                </div>
                {/* CONTENT (80% width ratio) */}
                <div className="flex flex-[4] w-full md:w-[75%] lg:w-[80%] flex-col px-4 sm:px-6 py-4 bg-black justify-between h-auto md:h-[310px]">
                  {/* Header */}
                  <div className="flex items-center pl-12">
                    <div className="flex flex-col justify-center h-[66px] sm:h-[79px]">
                      <h2 className="text-[26px] sm:text-[34px] lg:text-[42px] font-extrabold tracking-tight text-white leading-none">
                        {car.name}
                      </h2>
                      <div className="text-[13px] sm:text-[15px] lg:text-[16px] text-zinc-400 font-medium mt-1 sm:mt-2 leading-none">
                        Channel :{" "}
                        <span className="text-zinc-300">
                          {car.channelName || car.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Meta/Tags */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 sm:gap-x-5 gap-y-1.5 text-[12px] sm:text-[13.5px]">
                    {car.location && (
                      <span className="flex items-center gap-1.5 sm:gap-2 text-white font-medium">
                        <FiMapPin className="text-[#D6A125] text-xs sm:text-sm" />
                        {car.location}
                      </span>
                    )}
                    {car.joinDate && (
                      <span className="flex items-center gap-1.5 sm:gap-2 text-white font-medium">
                        <FaCalendarAlt className="text-[#D6A125] text-xs sm:text-sm" />
                        {car.joinDate}
                      </span>
                    )}
                    {car.genre && (
                      <span className="flex items-center gap-1.5 sm:gap-2 text-white font-medium">
                        <FaTag className="text-[#D6A125] text-xs sm:text-sm" />
                        {car.genre}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {car.description?.trim() && (
                    <p className="mt-2 text-[12.5px] sm:text-[13.5px] leading-relaxed text-zinc-400 font-normal line-clamp-2 sm:line-clamp-3">
                      {car.description}
                    </p>
                  )}

                  {/* Divider */}
                  <div className="my-2 border-t border-zinc-800/80" />

                  {/* Social Counters Bar Container */}
                  <div className="bg-[#121214] border border-zinc-800/80 rounded-[6px] py-2 sm:py-2.5 grid grid-cols-2 sm:grid-cols-4 gap-y-2 sm:gap-y-0 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800/80 items-center">
                    {/* Total Subscribers */}
                    <div
                      title={
                        stats.rawCounts?.total
                          ? `${stats.rawCounts.total.toLocaleString()} total followers across platforms`
                          : `${stats.total} total followers`
                      }
                      className="flex items-center justify-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1 sm:py-0 cursor-default"
                    >
                      <FaUsers className="text-[#D6A125] text-[18px] sm:text-[24px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold leading-none">
                          Total Subscribers
                        </span>
                        <span className="text-[12px] sm:text-[14.5px] font-bold text-white mt-1 leading-none">
                          {stats.total}
                        </span>
                      </div>
                    </div>

                    {/* YouTube Subscribers */}
                    <div
                      title={
                        stats.rawCounts?.youtube
                          ? `${stats.rawCounts.youtube.toLocaleString()} YouTube subscribers`
                          : `${stats.youtube} YouTube subscribers`
                      }
                      className="flex items-center justify-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1 sm:py-0 cursor-default"
                    >
                      <img
                        src={youtubeIcon}
                        alt="YouTube"
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold leading-none">
                          YouTube Subscribers
                        </span>
                        <span className="text-[12px] sm:text-[14.5px] font-bold text-white mt-1 leading-none">
                          {stats.youtube}
                        </span>
                      </div>
                    </div>

                    {/* Instagram Followers */}
                    <div
                      title={
                        stats.rawCounts?.instagram
                          ? `${stats.rawCounts.instagram.toLocaleString()} Instagram followers`
                          : `${stats.instagram} Instagram followers`
                      }
                      className="flex items-center justify-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1 sm:py-0 cursor-default"
                    >
                      <img
                        src={instagramIcon}
                        alt="Instagram"
                        className="w-5 h-5 sm:w-6 sm:h-6 object-contain shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold leading-none">
                          Instagram Followers
                        </span>
                        <span className="text-[12px] sm:text-[14.5px] font-bold text-white mt-1 leading-none">
                          {stats.instagram}
                        </span>
                      </div>
                    </div>

                    {/* Twitter Followers */}
                    <div
                      title={
                        stats.rawCounts?.twitter
                          ? `${stats.rawCounts.twitter.toLocaleString()} Twitter followers`
                          : `${stats.twitter} Twitter followers`
                      }
                      className="flex items-center justify-center gap-2 sm:gap-3 px-1.5 sm:px-2 py-1 sm:py-0 cursor-default"
                    >
                      <img
                        src={xIcon}
                        alt="Twitter"
                        className="w-4.5 h-4.5 sm:w-[22px] sm:h-[22px] object-contain shrink-0"
                      />
                      <div className="flex flex-col">
                        <span className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold leading-none">
                          Twitter Followers
                        </span>
                        <span className="text-[12px] sm:text-[14.5px] font-bold text-white mt-1 leading-none">
                          {stats.twitter}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Links Button */}
                  <div className="relative mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSnackbarId(
                          openSnackbarId === car._id ? null : car._id,
                        )
                      }
                      className="flex items-center gap-2 text-[#D6A125] hover:text-[#e5b338] text-[12.5px] sm:text-[13.5px] font-bold transition duration-200 w-fit select-none"
                    >
                      <span>View all Links</span>
                      <FaArrowRight className="text-[12px] sm:text-[13px]" />
                    </button>
                    {openSnackbarId === car._id && renderLinksSnackbar(car)}
                  </div>
                </div>

                {/* VERTICAL DIVIDER LINE */}
                <div className="hidden md:block w-[1px] h-[250px] bg-zinc-800/80 my-auto shrink-0" />

                {/* VOTE PANEL (20% width ratio) */}
                <div className="flex flex-[1] w-full md:w-[20%] shrink-0 h-auto md:h-[310px] flex-col items-center justify-center gap-4 md:gap-5 border-t md:border-t-0 border-zinc-800 md:border-none px-4 sm:px-6 py-4 md:py-5 bg-black select-none">
                  <button
                    onClick={(e) => handleVoteClick(e, car)}
                    disabled={isVoting || isLimitReached}
                    title={
                      isLimitReached
                        ? "Daily limit of 3 votes reached for today"
                        : "Click to cast a vote"
                    }
                    className={`h-[40px] md:h-[44px] w-full max-w-[280px] md:max-w-none rounded-[10px] border text-[16px] md:text-[18px] font-bold transition duration-200 select-none ${
                      isVoting || isLimitReached
                        ? "opacity-50 cursor-not-allowed border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:bg-zinc-900/60"
                        : "border-[#D6A125] bg-transparent text-[#D6A125] hover:bg-[#D6A125]/10 cursor-pointer"
                    }`}
                  >
                    {isLimitReached ? "Limit Reached" : "Vote"}
                  </button>

                  <div className="text-center flex flex-col items-center justify-center py-0.5">
                    <div className="text-[26px] md:text-[32px] tracking-tight font-extrabold text-white leading-none">
                      {car.votes || "0"}
                    </div>
                    <div className="text-[10.5px] md:text-[11px] text-zinc-500 font-medium mt-1 leading-none">
                      {car.rawVotes
                        ? car.rawVotes.toLocaleString()
                        : car.votes || "0"}
                    </div>
                  </div>

                  <div className="w-full max-w-[280px] md:max-w-none">
                    {/* Gold solid line */}
                    <div className="w-full bg-[#D6A125] h-[3px] rounded-full mb-2.5 md:mb-3" />

                    {(car.rank === 1 || car.status === "Leading") && (
                      <div className="w-fit mx-auto flex items-center justify-center gap-1.5 py-1 px-3.5 bg-zinc-950/80 border border-zinc-800 rounded">
                        <FaTrophy className="text-[#D6A125] text-[11px] md:text-[12px]" />
                        <span className="text-[11px] md:text-[12px] font-bold text-[#D6A125]">
                          {car.status || "Leading"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        // REDESIGNED AUTOMOTIVE/CARS NOMINEE CARD
        const displayCarPrice = car.price ? car.price.replace("$", "$ ") : "";
        const displayAcceleration = car.acceleration || car.transmission || "";
        const accelerationLabel =
          car.acceleration && car.acceleration.toLowerCase().includes("s")
            ? "0-100 km/h"
            : "Transmission";

        return (
          <div
            key={car._id}
            id={car._id}
            className="flex flex-col md:flex-row gap-0 md:gap-4 w-full max-w-[1592px] h-auto md:h-[210px] mx-auto rounded-[12px] md:rounded-none border border-zinc-800 md:border-0 bg-black md:bg-transparent overflow-hidden md:overflow-visible shadow-sm hover:shadow-md transition duration-300"
          >
            {/* IMAGES */}
            <div className="relative shrink-0 w-full md:w-[320px] lg:w-[380px] xl:w-[437px] h-[198px] md:h-[210px] bg-zinc-950 rounded-none md:rounded-[12px] border-0 md:border md:border-zinc-800 overflow-hidden shadow-none md:shadow-sm md:hover:shadow-md transition duration-300">
              <img
                src={car.image}
                alt={car.name}
                className="w-full h-full object-cover"
              />

              {/* Rank Ribbon */}
              <div className="absolute left-4 top-0">
                <div
                  className="flex w-[36px] flex-col items-center py-2 text-black rounded-b-[4px]"
                  style={{ backgroundColor: car.rankColor }}
                >
                  <FaTrophy
                    className="text-[12px]"
                    style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                  />
                  <span
                    className="mt-0.5 text-[15px] font-bold leading-none"
                    style={{ color: car.rank === 1 ? "#000" : "#fff" }}
                  >
                    {car.rank}
                  </span>
                </div>
                <div
                  className="mx-auto h-0 w-0 border-l-[18px] border-r-[18px] border-t-[8px] border-l-transparent border-r-transparent"
                  style={{ borderTopColor: car.rankColor }}
                />
              </div>

              {/* Bottom Image Tag */}
              {car.showBadgeOnImage && car.badge && (
                <div className="absolute bottom-3 left-4">
                  <span className="rounded-[4px] bg-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white border border-zinc-800">
                    {car.badge}
                  </span>
                </div>
              )}
            </div>
            {/* CONTENT BOX */}
            <div className="flex flex-col md:flex-row flex-1 h-auto md:h-[210px] rounded-none md:rounded-[12px] border-0 md:border md:border-zinc-800 bg-black text-white overflow-hidden shadow-none md:shadow-sm md:hover:shadow-md transition duration-300">
              {/* CONTENT (80% width ratio) */}
              <div className="flex flex-col flex-[4] w-full md:w-[80%] px-3.5 sm:px-4 md:px-5 py-2.5 md:py-3 bg-black justify-between min-h-0 md:h-[210px]">
                <div>
                  {/* Header */}
                  <div>
                    <h2 className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] font-bold tracking-tight text-white leading-tight">
                      {car.name}
                    </h2>
                    <p className="mt-1.5 md:mt-1 text-[11px] sm:text-[11.5px] md:text-[12.5px] leading-snug text-zinc-400 font-normal line-clamp-2 md:line-clamp-3">
                      {car.description}
                    </p>
                  </div>

                  {/* Metrics Counters Row */}
                  <div className="flex items-center gap-2.5 sm:gap-3.5 md:gap-4 lg:gap-5 py-1 mt-2 md:mt-2 mb-1 md:mb-1.5 overflow-x-auto no-scrollbar">
                    {/* Power */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <FaBolt className="text-[#EAB308] text-[17px] sm:text-[19px] md:text-[22.5px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white leading-none">
                          {car.power || "1,800 HP"}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] md:text-[9.5px] text-zinc-500 font-medium mt-0.5 md:mt-1 leading-none">
                          Power
                        </span>
                      </div>
                    </div>

                    <div className="w-[1px] bg-zinc-800 h-5 md:h-5.5 shrink-0" />

                    {/* Acceleration / 0-60 MPH */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <LuTimerReset className="text-zinc-300 text-[17px] sm:text-[19px] md:text-[22.5px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white leading-none">
                          {car.acceleration || "2.0 Sec"}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] md:text-[9.5px] text-zinc-500 font-medium mt-0.5 md:mt-1 leading-none">
                          0-60 MPH
                        </span>
                      </div>
                    </div>

                    <div className="w-[1px] bg-zinc-800 h-5 md:h-5.5 shrink-0" />

                    {/* Top Speed */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <MdOutlineSpeed className="text-zinc-300 text-[17px] sm:text-[19px] md:text-[22.5px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white leading-none">
                          {car.topSpeed || "445 Kmph"}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] md:text-[9.5px] text-zinc-500 font-medium mt-0.5 md:mt-1 leading-none">
                          Top Speed
                        </span>
                      </div>
                    </div>

                    <div className="w-[1px] bg-zinc-800 h-5 md:h-5.5 shrink-0" />

                    {/* Engine */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <TbEngine className="text-zinc-300 text-[17px] sm:text-[19px] md:text-[22.5px] shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-[11px] sm:text-[12px] md:text-[13px] font-bold text-white leading-none">
                          {car.engine || "8.3 L W16"}
                        </span>
                        <span className="text-[8.5px] sm:text-[9px] md:text-[9.5px] text-zinc-500 font-medium mt-0.5 md:mt-1 leading-none">
                          Engine
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Divider Line */}
                  <div className="border-t border-zinc-800/80 w-full my-1 md:my-1.5" />

                  {/* Meta information */}
                  <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-2.5 md:gap-x-3 gap-y-1 text-[10px] sm:text-[10.5px] md:text-[11px] text-zinc-500 font-normal">
                    <span className="hidden md:inline">
                      Brand :{" "}
                      <span className="text-white font-semibold">
                        {car.brand || car.location || "Bugatti"}
                      </span>
                    </span>
                    <span className="text-zinc-700 hidden md:inline">|</span>
                    <span className="hidden md:inline">
                      Model :{" "}
                      <span className="text-white font-semibold">
                        {car.model || car.bodyType || "Tourbillon"}
                      </span>
                    </span>
                    <span className="text-zinc-700 hidden md:inline">|</span>
                    <span className="hidden md:inline">
                      Year :{" "}
                      <span className="text-white font-semibold">
                        {car.year || "2026"}
                      </span>
                    </span>
                    <span className="text-zinc-700 hidden md:inline">|</span>
                    <span>
                      Production Limit :{" "}
                      <span className="text-white font-semibold">
                        {car.productionUnits ||
                          car.productionLimit ||
                          car.limit ||
                          "250"}
                      </span>
                    </span>
                    <span className="text-zinc-700">|</span>
                    <span>
                      Origin :{" "}
                      <span className="inline-flex items-center gap-1.5 text-white font-semibold align-middle">
                        <img
                          src={
                            getCountryFlagInfo(
                              car.country || car.origin,
                              car.brand,
                            ).flagUrl
                          }
                          srcSet={`${getCountryFlagInfo(car.country || car.origin, car.brand).flagUrl2x} 2x`}
                          alt={
                            getCountryFlagInfo(
                              car.country || car.origin,
                              car.brand,
                            ).name
                          }
                          className="w-4 h-auto rounded-[2px] object-contain shadow-xs inline-block"
                        />
                        <span>
                          {
                            getCountryFlagInfo(
                              car.country || car.origin,
                              car.brand,
                            ).name
                          }
                        </span>
                      </span>
                    </span>
                  </div>

                  {/* View all Links Button */}
                  <div className="relative mt-1 md:mt-1.5 hidden md:block">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSnackbarId(
                          openSnackbarId === car._id ? null : car._id,
                        )
                      }
                      className="flex items-center gap-1.5 text-[#D6A125] hover:text-[#e5b338] text-[11px] md:text-[12px] font-bold transition duration-200 w-fit"
                    >
                      <span>View all Links</span>
                      <FaArrowRight className="text-[10px]" />
                    </button>
                    {openSnackbarId === car._id && renderLinksSnackbar(car)}
                  </div>
                </div>
              </div>

              {/* VERTICAL DIVIDER LINE */}
              <div className="hidden md:block w-[1px] h-[160px] bg-[#545454] my-auto shrink-0" />

              {/* VOTE PANEL (20% width ratio) */}
              <div className="flex flex-[1] w-full md:w-[20%] shrink-0 h-auto md:h-[210px] flex-col items-center justify-center gap-3.5 md:gap-4 border-t md:border-t-0 border-zinc-800 md:border-none px-4 sm:px-6 py-4 md:py-3.5 bg-black select-none">
                <button
                  onClick={(e) => handleVoteClick(e, car)}
                  disabled={isVoting || isLimitReached}
                  title={
                    isLimitReached
                      ? "Daily limit of 3 votes reached for today"
                      : "Click to cast a vote"
                  }
                  className={`h-[40px] md:h-[44px] w-full max-w-[280px] md:max-w-none rounded-[10px] border text-[16px] md:text-[18px] font-bold transition duration-200 select-none ${
                    isVoting || isLimitReached
                      ? "opacity-50 cursor-not-allowed border-zinc-700 bg-zinc-900/60 text-zinc-500 hover:bg-zinc-900/60"
                      : "border-[#D6A125] bg-transparent text-[#D6A125] hover:bg-[#D6A125]/10 cursor-pointer"
                  }`}
                >
                  {isLimitReached ? "Limit Reached" : "Vote"}
                </button>

                <div className="text-center flex flex-col items-center justify-center py-0.5">
                  <div className="text-[26px] md:text-[32px] tracking-tight font-extrabold text-white leading-none">
                    {car.votes || "0"}
                  </div>
                  <div className="text-[10.5px] md:text-[11px] text-zinc-500 font-medium mt-1 leading-none">
                    {car.rawVotes
                      ? car.rawVotes.toLocaleString()
                      : car.votes || "0"}
                  </div>
                </div>

                <div className="w-full max-w-[280px] md:max-w-none">
                  {/* Gold solid line */}
                  <div className="w-full bg-[#D6A125] h-[3px] rounded-full mb-2.5 md:mb-3" />

                  {(car.rank === 1 || car.status === "Leading") && (
                    <div className="w-fit mx-auto flex items-center justify-center gap-1.5 py-1 px-3.5 bg-zinc-950/80 border border-zinc-800 rounded">
                      <FaTrophy className="text-[#D6A125] text-[11px] md:text-[12px]" />
                      <span className="text-[11px] md:text-[12px] font-bold text-[#D6A125]">
                        {car.status || "Leading"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {carList.length > 0 && carList[0].categoryId && (
        <div className="w-full max-w-[1592px] mx-auto">
          <NomineeComments
            nomineeId={carList[0].categoryId}
            categoryId={carList[0].categoryId}
          />
        </div>
      )}

      {/* FLOATING BOTTOM GOLDEN SNACKBAR / TOAST */}
      {toast.show && (
        <div className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-[9999] flex flex-col overflow-hidden rounded-xl border border-[#D6A125]/80 bg-zinc-950/95 text-white shadow-[0_10px_35px_rgba(214,161,37,0.35)] backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in max-w-full sm:max-w-xl select-none">
          <div className="flex items-center gap-3.5 px-5 py-3.5">
            <div className="w-9 h-9 rounded-full bg-[#D6A125]/20 border border-[#D6A125]/50 flex items-center justify-center shrink-0">
              <FaTrophy className="text-[#D6A125] text-base animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0 pr-2 flex-1">
              <span className="text-[13.5px] font-bold text-white leading-snug flex items-center gap-1.5">
                <span>
                  {toast.limitReached
                    ? "Daily Limit Reached ⚠️"
                    : "Vote Registered!"}
                </span>
                {!toast.limitReached && (
                  <span className="text-[#D6A125] text-xs">✨</span>
                )}
              </span>
              <span className="text-[11.5px] text-zinc-300 font-medium leading-relaxed mt-0.5 whitespace-normal sm:whitespace-nowrap">
                {toast.limitReached ? (
                  <span>
                    You have{" "}
                    <span className="text-[#D6A125] font-bold">0 votes</span>{" "}
                    left today. Try again tomorrow!
                  </span>
                ) : (
                  <span>
                    Thank you for voting for{" "}
                    <span className="text-white font-semibold">
                      {toast.nomineeName}
                    </span>
                    . You have{" "}
                    <span className="text-[#D6A125] font-bold">
                      {toast.votesLeft}{" "}
                      {toast.votesLeft === 1 ? "vote" : "votes"} left
                    </span>{" "}
                    today.
                  </span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="text-zinc-400 hover:text-white text-xs font-bold w-6 h-6 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition shrink-0 ml-2"
            >
              ✕
            </button>
          </div>

          {/* Animated 4.5s Golden Progress Bar */}
          <div className="w-full bg-zinc-800/60 h-[3px]">
            <div
              className="bg-[#D6A125] h-full"
              style={{
                width: "100%",
                animation: "toastProgress 4.5s linear forwards",
              }}
            />
          </div>
          <style>{`
            @keyframes toastProgress {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}

export default RankingCard;
