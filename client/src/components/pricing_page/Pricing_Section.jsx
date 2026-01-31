import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import freemiumUrl from '../../assets/pricing/freemium.jpg'
import premiumUrl from '../../assets/pricing/premium.jpg'
import businessUrl from '../../assets/pricing/business_plan.jpg'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";


const PricingSection = () => {
  const { user, token, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });
  const [selectedPlan, setSelectedPlan] = useState(null);

  const paypalOptions = {
    "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
    currency: "GBP",
    intent: "capture",
  };

  const plans = [
    {
      id: 1,
      name: 'Freemium',
      price: '0',
      frequency: '',
      image: freemiumUrl,
      buttonColor: 'bg-[#D90416]',
      features: [
        'Upto 5 Listings',
        'No Extra Listings Allowed',
        'No Promotional Features',
        'Basic Inventory Management System',
        'Standard visibility in search',
        'Email Support'
      ]
    },
    {
      id: 2,
      name: 'Premium Basic',
      price: '99',
      frequency: 'Every month',
      image: premiumUrl,
      buttonColor: 'bg-[#D90416]',
      features: [
        'Upto 25 listings',
        '£25 extra per listing',
        '5 Days of Featured Placement',
        'Full Inventory Management System',
        'Priority Placement Across Categories',
        'Priority Email Support'
      ]
    },
    {
      id: 3,
      name: 'Business VIP',
      price: '299',
      frequency: 'Every month',
      image: businessUrl,
      buttonColor: 'bg-[#D90416]',
      features: [
        'Upto 50 listings',
        '£20 per extra listing',
        '13 Days Of Featured Listing',
        'Advanced Inventory Management System',
        'Priority Placement Across Categories',
        'Dedicated Account Manager'
      ]
    }
  ];

  const handlePlanSelection = (plan) => {
    if (!isAuthenticated) {
      if (window.confirm("Please login to upgrade your plan.")) {
        navigate('/login');
      }
      return;
    }

    if (user && user.plan === plan.name) {
      setStatusMessage({ text: `You are already on the ${plan.name} plan.`, type: 'info' });
      return;
    }

    // If plan is Freemium, maybe handle downgrade directly? 
    // Usually downgrades are handled via "Cancel Subscription" or just setting it.
    // The previous code didn't handle Freemium selection explicitly other than maybe via Razorpay (which would be 0 amount? Razorpay creates order for > 0).
    // Let's assume Freemium is handled via Cancel Subscription route or is just not selectable if already on it.
    // But if they select Freemium, we should probably just call the cancel endpoint or similar.
    // For now, I will treat paid plans with PayPal. 

    if (plan.price === '0') {
      // Handle free plan downgrade/switch logic if needed. 
      // Assuming "Cancel Subscription" handles return to Freemium.
      // Or if they want to switch to free, we call cancel-subscription
      if (window.confirm("Switching to Freemium will cancel your current subscription immediately. Continue?")) {
        fetch('http://127.0.0.1:8000/api/payment/cancel-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        })
          .then(res => res.json())
          .then(data => {
            if (data.error) setStatusMessage({ text: data.error, type: 'error' });
            else {
              setStatusMessage({ text: data.message, type: 'success' });
              refreshUser();
            }
          });
      }
      return;
    }

    // Open Modal for PayPal Payment
    setSelectedPlan(plan);
    setStatusMessage({ text: '', type: '' });
  };

  return (
    <div className="w-full py-16 px-4 bg-white montserrat">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl playfair-display text-black mb-4">
          Choose your pricing plan
        </h2>
        <p className="text-gray-500 text-sm md:text-lg max-w-xl mx-auto mb-6">
          Find the perfect plan for your luxury assets. Elevate your presence with Otulia's premium listing features.
        </p>

        {statusMessage.text && (
          <div className={`max-w-md mx-auto p-4 rounded-md mb-8 ${statusMessage.type === 'success' ? 'bg-green-50 text-green-700' :
            statusMessage.type === 'info' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'
            }`}>
            {statusMessage.text}
          </div>
        )}
      </div>

      {/* CARDS GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col bg-white border shadow-sm hover:shadow-2xl transition-all duration-500 rounded-sm overflow-hidden 
                ${user?.plan === plan.name ? 'border-[#D90416]' : 'border-gray-100'}
            `}
          >
            {/* CURRENT PLAN BADGE */}
            {user?.plan === plan.name && (
              <div className="bg-[#D90416] text-white text-[10px] font-bold uppercase tracking-widest text-center py-1">
                Your Current Plan
              </div>
            )}

            {/* CARD IMAGE HEADER */}
            <div className="h-44 w-full overflow-hidden">
              <img
                src={plan.image}
                alt={plan.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* CARD CONTENT */}
            <div className="flex flex-col items-center p-8 flex-1">
              <h3 className="text-xl font-bold text-black mb-8 uppercase tracking-widest">
                {plan.name}
              </h3>

              <div className="flex items-start mb-2">
                <span className="text-2xl font-bold text-black mt-2">£</span>
                <span className="text-7xl font-bold text-black tracking-tighter">
                  {plan.price}
                </span>
              </div>

              <div className="h-6 mb-12">
                {plan.frequency ? (
                  <span className="text-sm text-gray-500 font-medium">
                    {plan.frequency}
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 font-medium italic">
                    Always Free
                  </span>
                )}
              </div>

              {/* FEATURES LIST WITH SEPARATORS */}
              <div className="w-full flex flex-col items-center mb-12">
                {plan.features.map((feature, index) => (
                  <React.Fragment key={index}>
                    <div className="w-full h-px bg-gray-200"></div>
                    <div className="py-5 flex items-center justify-center gap-3 w-full px-4 text-center">
                      <div className="shrink-0">
                        <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-[13px] text-gray-600 font-medium leading-relaxed">
                        {feature}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
                <div className="w-full h-px bg-gray-200"></div>
              </div>

              {/* Action Button */}
              <div className="w-full mt-auto">
                <p className="text-[10px] text-gray-400 mb-4 text-center">
                  Valid until canceled • Tax included
                </p>
                <button
                  onClick={() => handlePlanSelection(plan)}
                  disabled={loadingPlanId === plan.id || user?.plan === plan.name}
                  className={`
                    w-full py-4 rounded-full
                    ${plan.buttonColor} hover:brightness-110 
                    text-white font-bold text-sm tracking-widest uppercase
                    transition-all duration-300 shadow-md active:scale-95
                    ${(loadingPlanId === plan.id || user?.plan === plan.name) ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {user?.plan === plan.name ? 'Active' : 'Get Started'}
                </button>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* PAYPAL MODAL */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative animate-fade-in-up">

            {/* Header */}
            <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-playfair text-gray-800">Complete Upgrade</h3>
                <p className="text-sm text-gray-500">Upgrade to {selectedPlan.name}</p>
              </div>
              <button
                onClick={() => setSelectedPlan(null)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="mb-6 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total Amount</span>
                <span className="text-2xl font-bold text-black">£{selectedPlan.price}</span>
              </div>

              <div className="min-h-[150px] flex flex-col justify-center">
                <PayPalScriptProvider options={paypalOptions}>
                  <PayPalButtons
                    style={{ layout: "vertical", shape: "rect", color: "gold", label: "pay" }}
                    createOrder={async (data, actions) => {
                      try {
                        const response = await fetch('http://127.0.0.1:8000/api/payment/create-order', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({ plan: selectedPlan.name })
                        });
                        if (!response.ok) {
                          const err = await response.json();
                          throw new Error(err.error || "Order failed");
                        }
                        const order = await response.json();
                        return order.id;
                      } catch (err) {
                        console.error("Create Order Error:", err);
                        // setStatusMessage will render behind modal, so maybe alert or just log
                        alert("Failed to initialize payment: " + err.message);
                        throw err;
                      }
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        const response = await fetch('http://127.0.0.1:8000/api/payment/capture-order', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                          },
                          body: JSON.stringify({
                            orderID: data.orderID,
                            plan: selectedPlan.name
                          })
                        });
                        const details = await response.json();
                        if (details.success) {
                          setStatusMessage({ text: `Successfully upgraded to ${selectedPlan.name}!`, type: 'success' });
                          await refreshUser();
                          setSelectedPlan(null); // Close modal
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                          alert("Payment failed: " + details.error);
                        }
                      } catch (err) {
                        console.error("Capture Error:", err);
                        alert("Payment verification failed.");
                      }
                    }}
                    onError={(err) => {
                      console.error("PayPal Error:", err);
                      alert("PayPal encountered an error. Please try again.");
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-400">
              Secure payment processed by PayPal
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default PricingSection;