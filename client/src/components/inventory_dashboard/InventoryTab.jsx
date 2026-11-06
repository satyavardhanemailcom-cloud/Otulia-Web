import React from "react";
import {
  FiSearch,
  FiChevronDown,
  FiPlus,
  FiLock,
  FiEye,
  FiUser,
  FiMoreHorizontal,
  FiEdit2,
  FiTrash2,
  FiChevronRight,
} from "react-icons/fi";
import numberWithCommas from "../../modules/numberwithcomma";

const InventoryTab = ({
  data,
  user,
  inventorySearchQuery,
  setInventorySearchQuery,
  inventoryCategoryFilter,
  setInventoryCategoryFilter,
  inventoryStatusFilter,
  setInventoryStatusFilter,
  isVerifiedDealer,
  setIsAddModalOpen,
  setIsVerificationModalOpen,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  handleTogglePublic,
  updatingId,
  setEditingItem,
  confirmDelete,
}) => {
  const filtered = (data.inventory || []).filter((item) => {
    const matchesSearch =
      !inventorySearchQuery ||
      (item.title &&
        item.title
          .toLowerCase()
          .includes(inventorySearchQuery.toLowerCase())) ||
      (item.make &&
        item.make.toLowerCase().includes(inventorySearchQuery.toLowerCase())) ||
      (item.model &&
        item.model
          .toLowerCase()
          .includes(inventorySearchQuery.toLowerCase())) ||
      (item.name &&
        item.name.toLowerCase().includes(inventorySearchQuery.toLowerCase())) ||
      (item.propertyName &&
        item.propertyName
          .toLowerCase()
          .includes(inventorySearchQuery.toLowerCase())) ||
      (item.yachtName &&
        item.yachtName
          .toLowerCase()
          .includes(inventorySearchQuery.toLowerCase()));

    const matchesCategory =
      inventoryCategoryFilter === "All Categories" ||
      ((item.category === "CarAsset" || item.category === "vehicles") &&
        inventoryCategoryFilter === "Cars") ||
      ((item.category === "YachtAsset" || item.category === "yachts") &&
        inventoryCategoryFilter === "Yachts") ||
      ((item.category === "EstateAsset" || item.category === "estates") &&
        inventoryCategoryFilter === "Real Estate") ||
      ((item.category === "BikeAsset" || item.category === "bikes") &&
        inventoryCategoryFilter === "Bikes");

    const matchesStatus =
      inventoryStatusFilter === "All Status" ||
      (inventoryStatusFilter === "Active" && item.status === "Active") ||
      item.status === inventoryStatusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-[1.5rem] border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] mb-6">
        <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:max-w-xs">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={inventorySearchQuery}
              onChange={(e) => setInventorySearchQuery(e.target.value)}
              placeholder="Search assets..."
              className="w-full bg-gray-50 border border-transparent rounded-[1.25rem] py-3 pl-11 pr-4 text-sm font-medium text-gray-900 focus:bg-white focus:border-[#D48D2A] focus:ring-0 transition-all outline-none"
            />
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
            const limit =
              user?.plan === "Business VIP"
                ? 150
                : user?.plan === "Premium Basic"
                  ? 25
                  : 5;
            if (isVerifiedDealer) {
              if ((data?.inventory?.length || 0) >= limit) {
                alert(
                  `You have reached your limit of ${limit} listings. Please upgrade your plan.`,
                );
                return;
              }
              setIsAddModalOpen(true);
            } else {
              if (user?.verificationStatus === "Pending") {
                alert(
                  "Your dealer verification is currently pending approval. You will be notified once approved.",
                );
              } else if (user?.verificationStatus === "Rejected") {
                alert(
                  "Your previous verification documents were rejected. Please re-submit valid documents.",
                );
                setIsVerificationModalOpen(true);
              } else {
                alert(
                  "Please complete dealer verification to start listing assets.",
                );
                setIsVerificationModalOpen(true);
              }
            }
          }}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold text-sm transition-all whitespace-nowrap ${
            isVerifiedDealer
              ? "bg-gray-900 text-white hover:bg-black shadow-[0_2px_10px_rgba(0,0,0,0.1)]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-300"
          }`}
        >
          <FiPlus className="text-base" /> Add New Asset
          {!isVerifiedDealer && <FiLock className="text-xs ml-1" />}
        </button>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pb-3 max-w-[1040px] mx-auto w-full">
        {paginated.map((item) => {
          const categoryName =
            item.category === "CarAsset" || item.category === "vehicles"
              ? "CARS"
              : item.category === "YachtAsset" || item.category === "yachts"
                ? "YACHTS"
                : item.category === "BikeAsset" || item.category === "bikes"
                  ? "BIKES"
                  : item.category === "EstateAsset" ||
                      item.category === "estates"
                    ? "REAL ESTATE"
                    : item.category?.replace("Asset", "S")?.toUpperCase() ||
                      "ASSET";

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-[#E9ECF1] shadow-[0_1px_4px_rgba(17,24,39,0.04)] overflow-hidden group hover:border-[#D4A63A]/30 transition-all flex flex-col w-full max-w-[340px] mx-auto"
            >
              {/* Card Image Header */}
              <div className="relative h-[220px] bg-gray-100 w-full overflow-hidden rounded-t-xl">
                <img
                  src={
                    item.images?.[0] ||
                    "https://placehold.co/400x400?text=No+Image"
                  }
                  className="w-full h-full object-cover object-center group-hover:scale-[1.015] transition-transform duration-700"
                  alt={item.title}
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="bg-[#F6EEDC] text-[#111827] px-1.5 py-0.5 rounded-[4px] text-[8px] font-medium uppercase tracking-[0.14em] inter">
                    {item.type || "SALE"}
                  </span>
                </div>
                <div className="absolute top-2.5 right-2.5 flex gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#667085] hover:bg-gray-50 transition-colors shadow-[0_1px_3px_rgba(15,23,42,0.08)] border border-[#E9ECF1]"
                  >
                    <FiMoreHorizontal className="text-[15px]" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-3.5 pt-2.5 pb-0 flex-1 flex flex-col">
                <p className="text-[9px] text-[#D4A63A] uppercase font-medium tracking-[0.18em] mb-0.5 inter">
                  {categoryName}
                </p>
                <div className="flex items-baseline justify-between gap-2 mb-1.5">
                  <h3
                    className="flex-1 min-w-0 text-[15px] font-normal text-[#111827] leading-snug tracking-[-0.01em] truncate inter"
                    title={
                      item.propertyName ||
                      item.yachtName ||
                      item.name ||
                      item.title ||
                      `${item.make || ""} ${item.model || ""}`.trim()
                    }
                  >
                    {item.propertyName ||
                      item.yachtName ||
                      item.name ||
                      item.title ||
                      `${item.make || ""} ${item.model || ""}`.trim() ||
                      "Unnamed Asset"}
                  </h3>
                  <div className="shrink-0 text-right pl-1">
                    <p className="text-[14px] font-medium text-[#111827] inter leading-none tabular-nums">
                      ${numberWithCommas(item.price || 0)}
                    </p>
                    <p className="text-[9px] font-normal text-[#667085] inter mt-0.5">
                      Est. Value
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full w-fit mb-2 border inter ${item.status === "Active" || item.status === "Live" ? "bg-[#ECFDF5] border-[#D1FAE5]/80" : "bg-[#F9FAFB] border-[#E9ECF1]"}`}
                >
                  <div
                    className={`w-[5px] h-[5px] rounded-full shrink-0 ${item.status === "Active" || item.status === "Live" ? "bg-[#22C55E]" : "bg-[#94A3B8]"}`}
                  ></div>
                  <span className="text-[10px] font-medium text-[#111827] leading-none">
                    {item.status === "Active" || item.status === "Live"
                      ? "Live"
                      : item.status || "Draft"}
                  </span>
                </div>

                <div className="flex items-center -mx-3.5 px-3.5 py-1.5">
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[32px] inter">
                    <FiEye className="text-[#667085] text-[13px] shrink-0 mb-[2px]" />
                    <span className="text-[11px] font-normal text-[#667085] whitespace-nowrap leading-none">
                      {item.views || 0} Views
                    </span>
                  </div>
                  <div className="w-px h-4 bg-[#E9ECF1] shrink-0 self-center" />
                  <div className="flex-1 flex flex-col items-center justify-center min-h-[32px] inter">
                    <FiUser className="text-[#667085] text-[13px] shrink-0 mb-[2px]" />
                    <span className="text-[11px] font-normal text-[#667085] whitespace-nowrap leading-none">
                      {String(item.leads || 0).padStart(2, "0")} Leads
                    </span>
                  </div>
                </div>

                <div className="py-1.5 flex items-center justify-between mt-auto inter mb-1">
                  <div className="flex items-center gap-1 text-[12px] font-medium text-[#667085]">
                    Public
                  </div>
                  <div
                    onClick={() => handleTogglePublic(item)}
                    className={`w-[34px] h-[18px] rounded-full relative cursor-pointer shrink-0 transition-colors duration-300 ${item.status === "Active" || item.status === "Live" ? "bg-[#D4A63A]" : "bg-[#E9ECF1]"}`}
                  >
                    {updatingId &&
                    item.id &&
                    String(updatingId) === String(item.id) ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div
                        className={`absolute top-[2px] w-3.5 h-3.5 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all duration-300 ${item.status === "Active" || item.status === "Live" ? "left-[18px]" : "left-[2px]"}`}
                      ></div>
                    )}
                  </div>
                </div>

                <div className="w-full border-t border-[#E9ECF1] mt-3 mb-2"></div>

                <div className="flex items-stretch -mx-3.5">
                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setIsAddModalOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors py-1.5 inter"
                  >
                    <FiEdit2 className="text-[13px] text-[#667085]" /> Edit
                  </button>
                  {(user?.role === 'admin' || user?.myListings?.some(entry => (entry.item?._id || entry.item) === item.id)) && (
                    <>
                      <div className="w-px self-stretch bg-[#E9ECF1] my-1 shrink-0" />
                      <button
                        onClick={() => confirmDelete(item.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#374151] hover:bg-[#F9FAFB] transition-colors py-1.5 inter"
                      >
                        <FiTrash2 className="text-[13px] text-[#667085]" /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Pagination */}
      <div className="sticky bottom-0 z-30 grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-4 mt-1 border-t border-[#E9ECF1] bg-[#F9FAFB]/95 backdrop-blur-sm -mx-3 md:-mx-8 px-3 md:px-8 shadow-[0_-4px_16px_rgba(15,23,42,0.04)]">
        <div />
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-0.5 bg-white rounded-full border border-[#E9ECF1] shadow-[0_1px_4px_rgba(17,24,39,0.05)] px-1.5 py-1 inter">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F9FAFB] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <FiChevronRight className="text-lg rotate-180" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              if (
                p === 1 ||
                p === totalPages ||
                (p >= currentPage - 1 && p <= currentPage + 1)
              ) {
                return (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`min-w-[2.25rem] h-9 px-2 rounded-lg flex items-center justify-center font-semibold text-xs transition-colors ${currentPage === p ? "text-[#D4A63A] bg-white border border-[#D4A63A] shadow-sm" : "text-[#667085] hover:text-[#111827] border border-transparent"}`}
                  >
                    {p}
                  </button>
                );
              } else if (p === currentPage - 2 || p === currentPage + 2) {
                return (
                  <span
                    key={p}
                    className="text-[#D1D5DB] font-semibold px-1.5 text-xs"
                  >
                    ...
                  </span>
                );
              }
              return null;
            })}
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#9CA3AF] hover:text-[#1F2937] hover:bg-[#F9FAFB] transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              <FiChevronRight className="text-lg" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end relative z-10">
          <div className="relative">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="appearance-none bg-white border border-[#E9ECF1] rounded-xl py-2 pl-3.5 pr-9 text-[11px] font-medium text-[#667085] focus:outline-none focus:border-[#D4A63A] hover:border-[#D1D5DB] shadow-[0_1px_4px_rgba(17,24,39,0.05)] cursor-pointer inter min-w-[124px]"
            >
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none text-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTab;
