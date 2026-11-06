import React from "react";
import {
  FiSettings,
  FiPackage,
  FiActivity,
  FiMessageSquare,
  FiCalendar,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi";

const SubscriptionTab = ({
  user,
  data,
  companyInfo,
  setUpgradePlan,
  setIsUpgradeModalOpen,
}) => {
  return (
    <div className="md:h-[calc(100vh-6rem)] md:overflow-hidden flex flex-col p-1 md:p-4 animate-in fade-in duration-700">
      {/* Current Plan Block */}
      <div className="bg-[#FFF8F0] rounded-[1.5rem] border border-[#F2E8DB] shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-4 mb-2 shrink-0 flex flex-col md:flex-row gap-4 md:gap-0 justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 h-full w-1/3 pointer-events-none opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAwIDEwMDAiPjxwYXRoIGQ9Ik0wIDEwMDBDMzAwIDEwMDAgMzAwIDAgMTAwMCAwIiBzdHJva2U9IiNENDhEMkEiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==')] bg-cover bg-right bg-no-repeat w-1/2"></div>
        <div className="flex gap-4 md:gap-6 items-start relative z-10 w-full max-w-4xl">
          <div className="w-14 h-14 bg-[#D48D2A] rounded-[1rem] flex items-center justify-center shrink-0 shadow-lg shadow-[#D48D2A]/20">
            <FiSettings className="text-white text-2xl" />
          </div>
          <div className="flex flex-col flex-1">
            <h3 className="text-[12px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Current Plan
            </h3>
            <div className="flex items-center gap-3 mb-1.5">
              <h4 className="text-[26px] font-bold text-gray-900 canela leading-none">
                {user?.plan || "Premium Basic"}
              </h4>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black uppercase tracking-widest border border-emerald-100">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-medium mb-6">
              You're on the {user?.plan || "Premium Basic"} plan.
            </p>

            <div className="flex gap-8">
              <div className="flex gap-3 items-center">
                <FiPackage className="text-gray-400 text-lg shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none">
                    Active Listings
                  </span>
                  <span className="text-[12px] font-bold text-gray-900 mt-1">
                    {(data?.inventory || []).length || 1} of{" "}
                    {user?.plan === "Business VIP"
                      ? 150
                      : user?.plan === "Enterprise Elite"
                        ? "Unlimited"
                        : 25}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <FiActivity className="text-gray-400 text-lg shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none">
                    Analytics Level
                  </span>
                  <span className="text-[12px] font-bold text-gray-900 mt-1">
                    {user?.plan === "Business VIP"
                      ? "Full Suite"
                      : user?.plan === "Enterprise Elite"
                        ? "Insights & Reports"
                        : "Advanced"}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <FiMessageSquare className="text-gray-400 text-lg shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none">
                    Support
                  </span>
                  <span className="text-[12px] font-bold text-gray-900 mt-1">
                    {user?.plan === "Business VIP"
                      ? "Priority Phone & Email"
                      : user?.plan === "Enterprise Elite"
                        ? "24/7 Phone & Email"
                        : "Priority Email"}
                  </span>
                </div>
              </div>
              <div className="flex gap-3 items-center border-l border-gray-200 pl-8 ml-2">
                <FiCalendar className="text-gray-400 text-lg shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold text-gray-400 tracking-widest leading-none">
                    Next Renewal
                  </span>
                  <span className="text-[12px] font-bold text-gray-900 mt-1">
                    {companyInfo?.planExpiresAt
                      ? new Date(companyInfo.planExpiresAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )
                      : "May 24, 2026"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Comparison */}
      <div className="flex-1 min-h-0 bg-white rounded-[1.5rem] border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)] p-4 flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-0 mb-6 shrink-0">
          <div>
            <h4 className="inter text-sm font-bold text-gray-900 tracking-normal">
              Available Plans
            </h4>
            <p className="text-[10px] font-medium text-gray-400 mt-0.5 inter">
              Upgrade your presence and unlock powerful tools
            </p>
          </div>
          <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
            {["Monthly", "Yearly (-20%)"].map((t) => (
              <button
                key={t}
                className={`px-4 py-1 text-[9px] font-black uppercase tracking-widest rounded-[6px] transition-all ${t === "Monthly" ? "bg-white text-gray-900 shadow-sm border border-gray-100" : "text-gray-400"}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 min-h-0">
          {[
            {
              name: "Premium Basic",
              price: "99",
              features: [
                "25 Active Listings",
                "Advanced Analytics",
                "Priority Email Support",
                "Social Sharing Tools",
                "Standard Verification",
              ],
              current: user?.plan === "Premium Basic",
            },
            {
              name: "Business VIP",
              price: "249",
              features: [
                "150 Active Listings",
                "Full Analytics Suite",
                "Priority Phone Support",
                "Featured Listing Badge",
                "Verified Dealer Badge",
                "Bulk Asset Import",
              ],
              current: user?.plan === "Business VIP",
              popular: true,
            },
            {
              name: "Enterprise Elite",
              price: "Custom",
              features: [
                "Unlimited Listings",
                "Multi-user Access",
                "24/7 Dedicated Support",
                "Custom Branding",
                "API Access",
                "White-label Reports",
              ],
              current: user?.plan === "Enterprise Elite",
            },
          ].map((plan, pIdx) => (
            <div
              key={pIdx}
              className={`rounded-2xl border ${plan.current ? "border-emerald-500 bg-emerald-50/10" : "border-gray-100 hover:border-[#D48D2A]/30"} p-5 flex flex-col relative transition-all group overflow-y-auto custom-scrollbar`}
            >
              {plan.popular && (
                <div className="absolute top-5 right-8 -translate-y-1/2 bg-[#D48D2A] text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-[#D48D2A]/20">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h5 className="text-[13px] font-bold text-gray-900 canela mb-1">
                  {plan.name}
                </h5>
                <div className="flex items-baseline gap-1">
                  <span className="text-[24px] font-bold text-gray-900 kaisei">
                    {plan.price === "Custom" ? plan.price : `$${plan.price}`}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-[10px] text-gray-400 font-medium inter">
                      /month
                    </span>
                  )}
                </div>
              </div>
              <div className="flex-1 space-y-3 mb-6">
                {plan.features.map((f, fIdx) => (
                  <div key={fIdx} className="flex gap-2.5 items-start">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#FFF8F0] border border-[#F2E8DB] flex items-center justify-center shrink-0 mt-0.5">
                      <FiCheck className="text-[9px] text-[#D48D2A]" />
                    </div>
                    <span className="text-[11px] font-medium text-gray-600 leading-tight inter">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  if (!plan.current) {
                    setUpgradePlan(plan.name);
                    setIsUpgradeModalOpen(true);
                  }
                }}
                className={`w-full py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${plan.current ? "bg-emerald-100 text-emerald-600 cursor-default" : plan.popular ? "bg-[#D48D2A] text-white hover:bg-[#b5751c] shadow-lg shadow-[#D48D2A]/20" : "bg-gray-900 text-white hover:bg-black"}`}
              >
                {plan.current
                  ? "Current Plan"
                  : plan.price === "Custom"
                    ? "Contact Sales"
                    : "Upgrade Plan"}
                {!plan.current && <FiArrowRight className="text-xs" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
