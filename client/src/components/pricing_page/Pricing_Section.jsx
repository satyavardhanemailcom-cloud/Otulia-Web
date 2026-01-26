import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import freemiumUrl from '../../assets/pricing/freemium.jpg'
import premiumUrl from '../../assets/pricing/premium.jpg'
import businessUrl from '../../assets/pricing/business_plan.jpg'
import { loadRazorpay } from '../../modules/razorpay';

const PricingSection = () => {
  const { user, token, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ text: '', type: '' });

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

  const handlePlanSelection = async (plan) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.plan === plan.name) {
      setStatusMessage({ text: `You are already on the ${plan.name} plan.`, type: 'info' });
      return;
    }

    const res = await loadRazorpay();
    if (!res) {
      setStatusMessage({ text: 'Razorpay SDK failed to load. Are you online?', type: 'error' });
      return;
    }

    setLoadingPlanId(plan.id);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: plan.name })
      });

      const data = await response.json();

      if (data.error) {
        setStatusMessage({ text: data.error, type: 'error' });
        setLoadingPlanId(null);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Otulia",
        description: `Upgrade to ${plan.name}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('http://127.0.0.1:8000/api/payment/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan: data.plan
              })
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              setStatusMessage({ text: 'Plan upgraded successfully!', type: 'success' });
              await refreshUser();
            } else {
              setStatusMessage({ text: 'Payment verification failed: ' + verifyData.error, type: 'error' });
            }
          } catch (err) {
            setStatusMessage({ text: 'Payment verification error.', type: 'error' });
          }
        },
        prefill: {
          name: user?.name,
          email: user?.email,
          contact: user?.phone || ''
        },
        theme: {
          color: "#D90416"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Plan upgrade error:', error);
      setStatusMessage({ text: 'A connection error occurred.', type: 'error' });
    } finally {
      setLoadingPlanId(null);
    }
    return;
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

              {/* Plan Name */}
              <h3 className="text-xl font-bold text-black mb-8 uppercase tracking-widest">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="flex items-start mb-2">
                <span className="text-2xl font-bold text-black mt-2">£</span>
                <span className="text-7xl font-bold text-black tracking-tighter">
                  {plan.price}
                </span>
              </div>

              {/* Frequency Text */}
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
                    {/* Horizontal Divider */}
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
                {/* Final bottom divider */}
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
                  {loadingPlanId === plan.id ? 'Processing...' : user?.plan === plan.name ? 'Active' : 'Get Started'}
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default PricingSection;