import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import numberWithCommas from "../modules/numberwithcomma";
import { useAuth } from "../contexts/AuthContext";
import { FiHeart, FiMapPin, FiPlay, FiTrash2 } from "react-icons/fi";
import { optimizeCloudinaryUrl } from "../utils/imageUtils";
import { createAssetSlug } from "../utils/slugUtils";

const AssetCard = ({ item }) => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, refreshUser } = useAuth();
  const pathname = useLocation();

  // STATE
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  let category = "estate"; // Default fallback

  useEffect(() => {
    if (user && user.favorites) {
      const isFav = user.favorites.some(
        (fav) =>
          fav.assetId &&
          (fav.assetId === item._id || fav.assetId.toString() === item._id),
      );
      setIsLiked(isFav);
    }
  }, [user, item._id]);

  // CATEGORY INFERENCE
  if (item.category) {
    const cat = item.category.toLowerCase();
    if (cat === "vehicles" || cat === "car" || cat === "carasset")
      category = "car";
    else if (cat === "bikes" || cat === "bike" || cat === "bikeasset")
      category = "bike";
    else if (cat === "yachts" || cat === "yacht" || cat === "yachtasset")
      category = "yacht";
    else if (
      cat === "estates" ||
      cat === "estate" ||
      cat === "real estate" ||
      cat === "estateasset"
    )
      category = "estate";
  } else if (item.itemModel) {
    const model = item.itemModel.toLowerCase();
    if (model.includes("car")) category = "car";
    else if (model.includes("estate")) category = "estate";
    else if (model.includes("bike")) category = "bike";
    else if (model.includes("yacht")) category = "yacht";
  }

  // DETAILS EXTRACTION
  let specs_list = [];
  if (item.keySpecifications) {
    const specs = item.keySpecifications;
    if (category === "car") {
      specs_list = [
        specs.engineType,
        specs.power
          ? specs.power.toString().toLowerCase().includes("hp")
            ? specs.power
            : `${specs.power} HP`
          : null,
        specs.year || item.specification?.yearOfConstruction,
      ].filter(Boolean);
    } else if (category === "bike") {
      specs_list = [
        specs.year,
        specs.engineCapacity || specs.engineType,
        specs.seatingCapacity ? `${specs.seatingCapacity} Seats` : null,
      ].filter(Boolean);
    } else if (category === "estate") {
      let area = specs.builtUpArea || specs.landArea;
      if (area && !/[a-zA-Z]/.test(area.toString())) {
        area = `${area} Sqft`;
      }
      specs_list = [
        specs.bedrooms ? `${specs.bedrooms} Beds` : null,
        specs.bathrooms ? `${specs.bathrooms} Baths` : null,
        area,
      ].filter(Boolean);
    } else if (category === "yacht") {
      specs_list = [
        specs.length,
        specs.guests ? `${specs.guests} Guests` : null,
        specs.cabins ? `${specs.cabins} Cabins` : null,
      ].filter(Boolean);
    }
  }

  const handleHeartClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please log in to save favorites.");
      navigate("/login");
      return;
    }
    const previousState = isLiked;
    setIsLiked(!isLiked);
    try {
      const response = await fetch("/api/auth/toggle-favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assetId: item._id,
          assetModel:
            item.itemModel ||
            (category === "car"
              ? "CarAsset"
              : category === "bike"
                ? "BikeAsset"
                : category === "yacht"
                  ? "YachtAsset"
                  : "EstateAsset"),
        }),
      });
      if (!response.ok) throw new Error("Failed to toggle favorite");
      refreshUser();
    } catch (error) {
      console.error(error);
      setIsLiked(previousState);
    }
  };

  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this asset: "${item.title}"? This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/listings/${item._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete the asset");
      }

      alert("Asset deleted successfully.");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting asset:", error);
      alert(error.message || "An error occurred while deleting the asset.");
    }
  };

  return (
    <div
      onClick={() => {
        const slug = createAssetSlug(item.title, item._id);
        navigate(`/asset/${category}/${slug}`);
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white flex flex-col"
      style={{
        width: "100%",
        maxWidth: "595px",
        borderRadius: "1px",
        border: "1px solid rgba(0, 0, 0, 0.12)",
        containerType: "inline-size",
      }}
    >
      {/* IMAGE AREA */}
      <div className="relative overflow-hidden w-full aspect-[595/375]">
        <img
          src={optimizeCloudinaryUrl(item.images?.[0] || item.image, 800)}
          alt={item.title}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? "scale-105" : "scale-100"}`}
        />

        {/* TOP LEFT BADGES */}
        <div
          className="absolute z-10 flex flex-col"
          style={{
            top: "2.7cqi" /* top: 4 (16px) */,
            left: "2.7cqi" /* left: 4 (16px) */,
            gap: "1.3cqi" /* gap: 2 (8px) */,
          }}
        >
          {item.type === "Rent" && (
            <div
              className="bg-[#1a1a1a] text-white font-bold rounded-md uppercase tracking-[0.1em] shadow-lg text-center"
              style={{
                fontSize: "1.5cqi" /* text-[9px] */,
                padding: "1cqi 1.7cqi" /* px-2.5 py-1.5 */,
              }}
            >
              FOR RENT
            </div>
          )}
          {item.videoUrl && (
            <div
              className="bg-[#1a1a1a] text-white font-bold rounded-md uppercase tracking-[0.1em] shadow-lg flex items-center"
              style={{
                fontSize: "1.5cqi" /* text-[9px] */,
                padding: "1cqi 1.7cqi" /* px-2.5 py-1.5 */,
                gap: "0.7cqi" /* gap-1 (4px) */,
              }}
            >
              <FiPlay
                className="fill-white"
                style={{
                  width: "1.35cqi",
                  height: "1.35cqi" /* w-2 h-2 (8px) */,
                }}
              />
              VIDEO
            </div>
          )}
        </div>

        {/* TOP RIGHT FAVORITE */}
        <button
          onClick={handleHeartClick}
          className="absolute z-10 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all transform hover:scale-110 flex items-center justify-center"
          style={{
            top: "2.7cqi" /* top: 4 (16px) */,
            right: "2.7cqi" /* right: 4 (16px) */,
            padding: "1.35cqi" /* p-2 (8px) */,
          }}
        >
          <FiHeart
            className={`${isLiked ? "fill-red-500 stroke-red-500" : "text-[#666]"}`}
            style={{ width: "2.7cqi", height: "2.7cqi" /* w-4 h-4 (16px) */ }}
          />
        </button>

        {/* FLOATING DELETE BUTTON FOR ADMIN */}
        {user?.role === "admin" && (
          <button
            onClick={handleDeleteClick}
            className="absolute z-10 bg-white/90 hover:bg-red-600 group/btn rounded-full shadow-md transition-all duration-300 transform hover:scale-110 flex items-center justify-center border border-red-200"
            style={{
              bottom: "2.7cqi",
              right: "2.7cqi",
              padding: "1.5cqi",
            }}
            title="Delete Asset"
          >
            <FiTrash2
              className="text-red-600 group-hover/btn:text-white transition-colors duration-200"
              style={{ width: "3cqi", height: "3cqi" }}
            />
          </button>
        )}
      </div>

      {/* CONTENT AREA */}
      <div
        className="flex flex-col flex-1 bg-white"
        style={{
          width: "100%",
          padding: "3.4cqi 4cqi 1.2cqi" /* Reduced bottom padding */,
        }}
      >
        {/* Conditional Layout for Cars: Title above Price */}
        <div
          className="flex flex-col pb-[5px]"
          style={{ gap: "1.6cqi" /* Uniform gap */ }}
        >
          {category === "car" ? (
            <>
              {/* TITLE */}
              <div>
                <h4
                  className="truncate translate-y-px pb-1"
                  style={{
                    fontFamily: "'Kaisei Decol', serif",
                    fontWeight: 500,
                    fontSize: "3cqi",
                    lineHeight: "100%",
                    letterSpacing: "0%",
                    color: "#2A2A2A",
                  }}
                >
                  {item.title}
                </h4>
              </div>

              {/* PRICE */}
              <div>
                <h3
                  className="text-[#1a1a1a] tracking-tight lining-nums"
                  style={{
                    fontFamily: "'Konkhmer Sleokchher', cursive",
                    fontWeight: 200,
                    lineHeight: "100%",
                    fontSize: "4cqi" /* text-[24px] */,
                  }}
                >
                  {item.isPriceOnRequest
                    ? "Price on Demand"
                    : `$${numberWithCommas(item.price)}`}
                  {item.type === "Rent" && !item.isPriceOnRequest && (
                    <span
                      className="text-gray-500 font-normal montserrat"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "1.85cqi" /* text-[11px] */,
                        marginLeft: "1cqi" /* ml-1.5 (6px) */,
                      }}
                    >
                      / day
                    </span>
                  )}
                </h3>
              </div>

              {/* PROPERTY DETAILS */}
              <div>
                <div
                  className="flex items-center tracking-[0.1px]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "2.35cqi" /* fontSize: "14px" */,
                    lineHeight: "1.4",
                    color: "#999999",
                    gap: "1.35cqi" /* gap-2 (8px) */,
                  }}
                >
                  {specs_list.length > 0 ? (
                    specs_list.map((spec, index) => (
                      <React.Fragment key={index}>
                        <div>{spec}</div>
                        {index < specs_list.length - 1 && (
                          <div
                            style={{
                              color: "#999999",
                              fontWeight: "bold",
                              opacity: 0.5,
                            }}
                          >
                            ·
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <div>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* PRICE */}
              <div>
                <h3
                  className="text-[#1a1a1a] tracking-tight lining-nums"
                  style={{
                    fontFamily: "'Konkhmer Sleokchher', cursive",
                    fontWeight: 400,
                    lineHeight: "100%",
                    fontSize: "4cqi" /* text-[24px] */,
                  }}
                >
                  {item.isPriceOnRequest
                    ? "Price on Demand"
                    : `$${numberWithCommas(item.price)}`}
                  {item.type === "Rent" && !item.isPriceOnRequest && (
                    <span
                      className="text-gray-500 font-normal montserrat"
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        fontSize: "1.85cqi" /* text-[11px] */,
                        marginLeft: "1cqi" /* ml-1.5 (6px) */,
                      }}
                    >
                      / day
                    </span>
                  )}
                </h3>
              </div>

              {/* PROPERTY DETAILS */}
              <div>
                <div
                  className="flex items-center tracking-[0.1px]"
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 400,
                    fontSize: "2.35cqi" /* fontSize: "14px" */,
                    lineHeight: "1.4",
                    color: "#999999",
                    gap: "1.35cqi" /* gap-2 (8px) */,
                  }}
                >
                  {specs_list.length > 0 ? (
                    specs_list.map((spec, index) => (
                      <React.Fragment key={index}>
                        <div>{spec}</div>
                        {index < specs_list.length - 1 && (
                          <div
                            style={{
                              color: "#999999",
                              fontWeight: "bold",
                              opacity: 0.5,
                            }}
                          >
                            ·
                          </div>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <div>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                  )}
                </div>
              </div>

              {/* TITLE */}
              <div>
                <h4
                  className="truncate translate-y-px"
                  style={{
                    fontFamily: "'Kaisei Decol', serif",
                    fontWeight: 500,
                    fontSize: "12px",
                    lineHeight: "1.15",
                    color: "#2A2A2A",
                    paddingBottom: 2,
                  }}
                >
                  {item.title}
                </h4>
              </div>
            </>
          )}

          {/* LOCATION */}
          <div>
            <span
              className="truncate block"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "1.76cqi" /* fontSize: "10.5px" */,
                lineHeight: "100%",
                color: "#888888",
              }}
            >
              {item.location}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div
          className="mt-auto border-t border-[#eeeeee] flex items-center justify-between"
          style={{
            paddingTop: "1.6cqi",
          }}
        >
          {/* Logo / Initials */}
          <div className="flex items-center">
            {item.agent?.companyLogo ? (
              <img
                src={optimizeCloudinaryUrl(item.agent.companyLogo, 200)}
                alt="Company"
                className="w-auto object-contain shrink-0"
                style={{ height: "35px" /* h-7 (28px) */ }}
              />
            ) : (
              <div
                className="font-normal tracking-tight text-[#2a2a2a] canela"
                style={{ fontSize: "3.36cqi" /* text-[20px] */ }}
              >
                RH
              </div>
            )}
          </div>

          {/* Agent Section */}
          <div
            className="flex items-center"
            style={{ gap: "1.7cqi" /* gap-[10px] (10px) */ }}
          >
            <span
              className="font-normal text-[#9a9a9a] montserrat truncate"
              style={{
                fontSize: "1.68cqi" /* text-[10px] (10px) */,
                maxWidth: "20cqi" /* max-w-[120px] */,
              }}
            >
              Listed by{" "}
              <span className="text-[#5a5a5a] font-normal">
                {item.agent?.name?.split(" ")[0] || "Marshall"}
              </span>
            </span>
            <div
              className="rounded-full overflow-hidden border border-gray-50 shadow-sm shrink-0"
              style={{
                width: "7.9cqi" /* w-[47px] (47px) */,
                height: "7.9cqi" /* h-[47px] (47px) */,
              }}
            >
              <img
                src={optimizeCloudinaryUrl(
                  item.agent?.photo || "https://via.placeholder.com/100",
                  100,
                  100,
                )}
                alt="Agent"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
