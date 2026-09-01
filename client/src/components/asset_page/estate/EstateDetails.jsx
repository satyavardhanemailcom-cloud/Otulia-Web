import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import numberWithCommas from "../../../modules/numberwithcomma";
import { useCart } from "../../../contexts/CartContext";
import DescriptionSidebar from "../DescriptionSidebar";
import {
  FiPhoneCall,
  FiShoppingCart,
  FiHeart,
  FiMapPin,
  FiCalendar,
  FiChevronRight,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const EstateDetails = ({ item, modelName = "EstateAsset" }) => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [activityLoading, setActivityLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Rental State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Destructure with fallbacks
  const {
    _id,
    title = "Untitled Asset",
    brand_logo = "",
    location = "Unknown Location",
    description = "No description available.",
    price = 0,
    type = "Sale",
    images = [],
    agent = {},
  } = item || {};

  const handleCallAgent = async () => {
    if (!isAuthenticated) {
      alert("Please login to contact our agents.");
      navigate("/login");
      return;
    }

    if (!message.trim()) {
      alert("Please enter a message.");
      return;
    }

    setActivityLoading(true);
    try {
      const response = await fetch("/api/leads/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          agentId: agent.id,
          assetId: _id,
          assetModel: modelName,
          assetTitle: title,
          message: message,
          agentEmail: agent.email,
          agentName: agent.name,
        }),
      });

      if (response.ok) {
        alert(`Message sent! Agent ${agent.name} will be notified.`);
        setMessage("");
      } else {
        throw new Error("Failed to send lead");
      }
    } catch (error) {
      console.error("Failed to send lead:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setActivityLoading(false);
    }
  };

  const handleWhatsapp = async () => {
    const phoneNumber = agent?.phone;
    if (!phoneNumber) {
      alert("Agent phone number not available.");
      return;
    }

    // Generate Lead in background
    if (isAuthenticated) {
      try {
        await fetch("/api/leads/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            agentId: agent.id,
            assetId: _id,
            assetModel: modelName,
            assetTitle: title,
            message: "Inquiry via WhatsApp click",
            agentEmail: agent.email,
            agentName: agent.name,
            source: "WhatsApp",
          }),
        });
      } catch (error) {
        console.error("Failed to generate WhatsApp lead:", error);
      }
    }

    const currentUrl = window.location.href;
    const refId = item?.listingReference || "N/A";
    const dealerName = agent?.name || "the agent";
    const text = `Hello! I'm interested in this listing advertised by ${dealerName} on Otulia.com.

Link: ${currentUrl}
Reference ID: #${refId}

*Kindly do not edit this message to ensure your inquiry is sent to the agent.`;

    let cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
    if (!cleanPhone.startsWith("+")) {
      cleanPhone = "+" + cleanPhone;
    }
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please login to proceed.");
      navigate("/login");
      return;
    }

    if (type === "Rent") {
      if (!startDate || !endDate) {
        alert("Please select both start and end dates.");
        return;
      }

      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        alert("End date must be after start date.");
        return;
      }

      addToCart({
        itemId: _id,
        itemModel: modelName,
        tempId: Date.now() + Math.random().toString(),
        title,
        image: images.length > 0 ? images[0] : null,
        pricePerDay: price,
        startDate,
        endDate,
        duration: diffDays,
        totalPrice: diffDays * price,
        type: "Rent",
      });
    } else {
      addToCart({
        itemId: _id,
        itemModel: modelName,
        tempId: Date.now() + Math.random().toString(),
        title,
        image: images.length > 0 ? images[0] : null,
        price: price,
        totalPrice: price,
        type: "Sale",
      });
    }
  };

  function getTimeSinceJoined(createdAt) {
    if (!createdAt) return "Recently";
    const joinedDate = new Date(createdAt);
    const now = new Date();
    const diffInMonths =
      (now.getFullYear() - joinedDate.getFullYear()) * 12 +
      (now.getMonth() - joinedDate.getMonth());

    if (diffInMonths < 12) {
      return diffInMonths <= 0 ? "this month" : `${diffInMonths} months ago`;
    }
    const years = Math.floor(diffInMonths / 12);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }

  const isLongDescription = description && description.length > 400;

  return (
    <>
      <DescriptionSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        description={description}
      />
      <div className="w-full px-[2%] py-10 bg-white font-sans">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
          {/* LEFT COLUMN: Details */}
          <div className="w-full lg:w-[60%]">
            {item.listingReference && (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">
                  Listing Reference ID
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 border border-gray-100 rounded shadow-sm">
                  <span className="text-[10px] font-bold font-mono text-gray-700">
                    {item.listingReference}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.listingReference);
                      alert("Reference ID copied to clipboard!");
                    }}
                    className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-400 hover:text-black"
                    title="Copy ID"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-3 h-3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-4">
              <h1
                className="text-2xl md:text-3xl font-normal text-black leading-snug"
                style={{
                  fontFamily: '"Times New Roman", Times, serif',
                }}
              >
                {title}
              </h1>
              {brand_logo && (
                <img
                  src={brand_logo}
                  alt="Brand"
                  className="h-8 md:h-10 w-auto object-contain"
                />
              )}
              {type === "Rent" && (
                <span className="bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm">
                  Premium Lease
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-1.5 mb-10 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span className="text-xs font-medium montserrat">{location}</span>
            </div>

            <div className="mb-8">
              <h2 className="text-[10px] md:text-xs font-bold text-[#B58252] uppercase tracking-[0.2em] mb-4">
                ABOUT THE PROPERTY
              </h2>
              <div className="text-gray-700 leading-relaxed text-sm montserrat whitespace-pre-wrap">
                {isLongDescription
                  ? `${description.substring(0, 400)}...`
                  : description}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-[10px] md:text-xs font-bold text-[#B58252] uppercase tracking-[0.2em] mb-4">
                PROPERTY DETAILS
              </h2>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-600 montserrat">
                {Object.entries(item.specification || {})
                  .slice(0, 8)
                  .map(([key, val]) => {
                    if (!val || val === "-" || val === "0") return null;
                    return (
                      <div className="flex items-start gap-2" key={key}>
                        <span className="text-[#B58252] font-medium">-</span>
                        <span className="capitalize">
                          {key.replace(/([A-Z])/g, " $1").trim()}:{" "}
                          <span className="font-medium text-black">{val}</span>
                        </span>
                      </div>
                    );
                  })}
              </div>
              {isLongDescription && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="mt-6 text-sm text-[#B58252] font-medium montserrat hover:text-[#9A6B41] transition-colors"
                >
                  Read Description &rsaquo;
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Price & Card */}
          <div className="w-full lg:w-[35%] flex flex-col gap-6">
            <div className="w-full flex items-center justify-between gap-4 pt-1">
              <div>
                <span className="text-[10px] font-bold text-[#B58252] uppercase tracking-widest block mb-1">
                  PRICE
                </span>
                <h2
                  className="text-3xl md:text-4xl font-poppins-light text-black"
                  style={{
                    fontFamily: 'Canela, "Times New Roman", Times, serif',
                  }}
                >
                  {item.isPriceOnRequest
                    ? "Price on Demand"
                    : `$${numberWithCommas(price)}`}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-700 font-medium shadow-sm shrink-0">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Inclusion of all fees.</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-gray-400 cursor-pointer ml-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </div>
            </div>

            {/* RENTAL BOOKING BOX */}
            {type === "Rent" && (
              <div className="mt-10 border border-[#E5E5E5] rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B58252] mb-5">
                  Book Your Charter
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1F2937] mb-2">
                      Start Date
                    </label>

                    <div className="relative">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-[44px] border border-[#D9D9D9] rounded-md px-3 text-sm outline-none bg-white"
                      />
                    </div>
                  </div>

                  {/* End Date */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1F2937] mb-2">
                      End Date
                    </label>

                    <div className="relative">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-[44px] border border-[#D9D9D9] rounded-md px-3 text-sm outline-none bg-white"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#1F2937] mb-2">
                      Guests
                    </label>

                    <select
                      className="w-full h-[44px] border border-[#D9D9D9] rounded-md px-3 text-sm outline-none bg-white"
                      defaultValue="8"
                    >
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="8">8 Guests</option>
                      <option value="10">10 Guests</option>
                      <option value="12">12 Guests</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full h-[44px] bg-black text-[#D4A548] text-[12px] font-bold uppercase tracking-[0.18em] rounded-md hover:bg-[#111] transition"
                >
                  Send Booking Request
                </button>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-3.5 h-3.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-1.5 0h12a.75.75 0 01.75.75v7.5a.75.75 0 01-.75.75h-12a.75.75 0 01-.75-.75v-7.5a.75.75 0 01.75-.75z"
                    />
                  </svg>

                  <span>
                    Your details are secure and will only be shared with the
                    seller.
                  </span>
                </div>
              </div>
            )}

            {/* Expanded Agent Box */}
            <div className="border border-gray-200 rounded-2xl shadow-sm p-6 bg-white flex flex-col gap-4">
              {/* Agent Profile & Company Logo Header */}
              <div className="flex items-center justify-between gap-3 pb-1">
                {/* Left: Avatar & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={agent?.photo}
                    alt={agent?.name || "Agent"}
                    className="w-14 h-14 rounded-full object-cover border border-gray-100 shrink-0"
                  />
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-base font-bold text-black truncate">
                      {agent?.name || "Agent Name"}
                    </h3>
                    <span className="inline-block bg-[#FFF8E7] text-[#B58252] text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mt-0.5 w-fit">
                      {agent?.badge || agent?.plan || "BUSINESS VIP"}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1.5">
                      <FiMapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">
                        {location
                          ? location.split(",").pop().trim()
                          : "Location"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <FiCalendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{`Joined ${getTimeSinceJoined(agent?.createdAt)}`}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Company Logo */}
                <div className="flex items-center justify-center shrink-0 max-w-[110px]">
                  {agent?.companyLogo && agent.companyLogo !== agent?.photo ? (
                    <img
                      src={agent.companyLogo}
                      alt={agent.company || "Company"}
                      className="max-h-20 w-auto object-contain"
                    />
                  ) : item?.brand_logo ? (
                    <img
                      src={item.brand_logo}
                      alt="Brand"
                      className="max-h-12 w-auto object-contain"
                    />
                  ) : (
                    <div className="h-12 w-12 bg-gray-50 flex items-center justify-center rounded-lg border border-gray-100">
                      <span className="text-gray-300 font-bold text-sm">
                        {agent?.company?.[0] || "A"}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Banner */}
              <div className="flex items-center gap-2.5 px-4 py-3 bg-[#F4FAF6] border border-[#E1F2E8] rounded-xl text-xs text-gray-700 font-medium">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 text-emerald-600 shrink-0"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z"
                  />
                </svg>
                <span>
                  All sellers are thoroughly verified by{" "}
                  <span className="text-[#B58252] font-semibold">Otulia</span>
                </span>
              </div>

              {/* Quick Action Buttons: Call Now & WhatsApp */}
              <div className="grid grid-cols-2 gap-3 w-full">
                <button
                  onClick={() => setShowPhone(!showPhone)}
                  className="bg-[#111827] text-white p-3.5 rounded-xl flex items-center justify-between hover:bg-black transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FiPhoneCall className="w-5 h-5 text-white shrink-0 ml-0.5" />
                    <div className="flex flex-col items-start leading-tight text-left">
                      <span className="font-bold text-sm">Call Now</span>
                      <span className="text-[10px] text-gray-300 font-medium">
                        Speak directly
                      </span>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={handleWhatsapp}
                  className="bg-[#008744] text-white p-3.5 rounded-xl flex items-center justify-between hover:bg-[#00753a] transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FaWhatsapp className="w-6 h-6 text-white shrink-0 ml-0.5" />
                    <div className="flex flex-col items-start leading-tight text-left">
                      <span className="font-bold text-sm">WhatsApp</span>
                      <span className="text-[10px] text-green-100 font-medium">
                        Chat on WhatsApp
                      </span>
                    </div>
                  </div>
                  <FiChevronRight className="w-4 h-4 text-green-200 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* Send Message Input */}
              <div className="flex gap-2 montserrat w-full">
                <input
                  type="text"
                  placeholder="What can we help you with?"
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-400 transition-colors bg-white"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  onClick={handleCallAgent}
                  disabled={activityLoading}
                  className="bg-black text-white px-5 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50 shrink-0"
                >
                  <span>{activityLoading ? "..." : "Send"}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>

              {/* Show Phone Number Button */}
              <button
                onClick={() => setShowPhone(!showPhone)}
                className="w-full flex items-center justify-center gap-2 border border-black text-black py-3.5 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all montserrat"
              >
                <FiPhoneCall className="w-4 h-4" />
                {showPhone
                  ? agent?.phone || "Not Available"
                  : "Show phone number"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EstateDetails;
