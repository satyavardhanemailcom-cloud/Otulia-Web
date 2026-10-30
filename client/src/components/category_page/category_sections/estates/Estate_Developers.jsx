import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dealerUrl } from "../../../../utils/dealerUrl";

const Estate_Developers = ({ onDeveloperClick }) => {
  const navigate = useNavigate();
  const [developers, setDevelopers] = useState([
    {
      id: "damac",
      name: "DAMAC",
      subText: "LIVE THE LUXURY",
      fullName: "DAMAC Properties",
      companyName: "DAMAC Properties",
      email: "damac@otulia.com",
      tag: "Official Partner",
    },
    {
      id: "sobha",
      name: "SOBHA",
      subText: "REALTY",
      fullName: "Sobha Realty",
      companyName: "Sobha Realty",
      email: "sobha@otulia.com",
      tag: "Official Partner",
    },
    {
      id: "ellington",
      name: "ELLINGTON",
      subText: "PROPERTIES",
      fullName: "Ellington Properties",
      companyName: "Ellington Properties",
      email: "ellington@otulia.com",
      tag: "Official Partner",
    },
  ]);

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch("/api/assets/estate-developers");
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            setDevelopers(data);
          }
        }
      } catch (err) {
        console.error("Error fetching estate developers:", err);
      }
    };
    fetchDevelopers();
  }, []);

  const handleCardClick = (dev) => {
    const targetEmail = dev.email || `${dev.id || dev.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@otulia.com`;
    if (onDeveloperClick) {
      onDeveloperClick(dev.companyName || dev.fullName || dev.name, targetEmail);
    } else {
      navigate(dealerUrl(dev.companyName || dev.fullName || dev.name, targetEmail));
    }
  };

  const renderLogo = (dev) => {
    const photoUrl = dev.photo || dev.companyLogo || dev.logo;

    if (photoUrl) {
      return (
        <img
          src={photoUrl}
          alt={dev.companyName || dev.name}
          className="max-h-13 md:max-h-[60px] max-w-[145px] md:max-w-[165px] w-full object-contain"
        />
      );
    }

    const devNameUpper = (dev.name || dev.companyName || "").toUpperCase();

    if (dev.id === "damac" || devNameUpper.includes("DAMAC")) {
      return (
        <div className="flex flex-col items-center justify-center">
          <span
            className="text-[27.3px] md:text-[34.65px] font-black font-sans italic tracking-[0.12em] text-black leading-none"
            style={{ fontStyle: "italic", transform: "skewX(-6deg)" }}
          >
            DAMAC
          </span>
          <span className="text-[9.5px] md:text-[10.5px] font-sans font-black text-black tracking-[0.25em] uppercase mt-1.5">
            LIVE THE LUXURY
          </span>
        </div>
      );
    }

    if (dev.id === "sobha" || devNameUpper.includes("SOBHA")) {
      return (
        <div className="flex flex-col items-center justify-center">
          <span
            className="text-[27.3px] md:text-[34.65px] font-serif font-medium tracking-[0.25em] text-black leading-none ml-1"
            style={{ fontFamily: "'Kaisei Decol', Georgia, serif" }}
          >
            SOBHA
          </span>
          <span className="text-[10px] md:text-[11px] font-sans font-extrabold text-black tracking-[0.4em] uppercase mt-1.5 ml-1">
            REALTY
          </span>
        </div>
      );
    }

    if (dev.id === "ellington" || devNameUpper.includes("ELLINGTON")) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="mb-0.5 text-black">
            <svg className="w-[25.2px] h-[25.2px] md:w-[29.4px] md:h-[29.4px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3L5 12L12 21L19 12L12 3Z" />
              <path d="M12 7L8 12L12 17L16 12L12 7Z" />
            </svg>
          </div>
          <span className="text-[18.9px] md:text-[23.1px] font-serif font-bold tracking-[0.2em] text-black leading-none">
            ELLINGTON
          </span>
          <span className="text-[9px] md:text-[10px] font-sans font-bold text-black tracking-[0.25em] uppercase mt-1">
            PROPERTIES
          </span>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center">
        <span className="text-[25.2px] md:text-[31.5px] font-serif font-semibold tracking-wider text-black leading-none text-center">
          {dev.companyName || dev.name}
        </span>
        {dev.subText && (
          <span className="text-[9.5px] md:text-[10.5px] font-sans text-gray-500 tracking-widest uppercase mt-1">
            {dev.subText}
          </span>
        )}
      </div>
    );
  };

  return (
    <section className="w-full relative bg-white flex flex-col justify-center px-4 md:px-12 pt-[46px] md:pt-[65px] pb-10 md:pb-14 overflow-hidden">
      {/* Main Title & Subtitle Centered */}
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-10">
        <h2 className="text-3xl md:text-5xl canela text-black font-normal tracking-tight mb-3">
          Our Trusted Developers
        </h2>
        <p className="text-base md:text-lg text-[#6b7280] canela font-light">
          Exclusive partnerships with some of the world's most renowned developers.
        </p>
      </div>

      {/* Developers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5 md:gap-6.5 max-w-[1470px] mx-auto w-full">
        {developers.map((dev) => (
          <div
            key={dev.id || dev.email}
            onClick={() => handleCardClick(dev)}
            className="group flex items-center justify-between bg-white border border-[#e5e7eb] rounded-xl px-5.5 py-5.5 md:px-6.5 md:py-6.5 hover:shadow-lg hover:border-[#b38b46] transition-all duration-300 cursor-pointer min-h-[111px] w-full overflow-hidden"
          >
            {/* Developer Logo / Photo (Left) */}
            <div className="flex-1 min-w-0 flex items-center justify-center overflow-hidden px-1">
              {renderLogo(dev)}
            </div>

            {/* Vertical Divider Line (Middle) */}
            <div className="h-[46px] md:h-[50px] w-px bg-[#e5e7eb] mx-3.5 md:mx-4.5 shrink-0"></div>

            {/* Right Side: Partner Tag & Circle Arrow */}
            <div className="flex items-center gap-2.5 md:gap-3.5 shrink-0">
              <span className="text-[13px] md:text-[15.75px] font-sans text-[#71717a] font-normal tracking-wide whitespace-nowrap">
                Official Partner
              </span>
              <div className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] rounded-full border border-[#b38b46] flex items-center justify-center text-[#b38b46] group-hover:bg-[#b38b46] group-hover:text-white transition-all duration-300 shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-[19px] h-[19px] md:w-[21px] md:h-[21px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Estate_Developers;
