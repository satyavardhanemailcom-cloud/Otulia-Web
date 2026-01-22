import React from 'react';
import freemiumUrl from '../../assets/pricing/freemium.jpg'
import premiumUrl from '../../assets/pricing/premium.jpg'
import businessUrl from '../../assets/pricing/business_plan.jpg'

const PricingSection = () => {
  const plans = [
    {
      id: 1,
      name: 'Freemium',
      price: '0',
      frequency: '', // No frequency for free
      image: freemiumUrl, // White/Grey Abstract
      buttonColor: 'bg-[#D90416]', // Red from image
    },
    {
      id: 2,
      name: 'Premium Basic',
      price: '99',
      frequency: 'Every month',
      image: premiumUrl, // Blue/Purple Abstract
      buttonColor: 'bg-[#D90416]',
    },
    {
      id: 3,
      name: 'Business VIP',
      price: '299',
      frequency: 'Every month',
      image: businessUrl, // Gold/Black Abstract
      buttonColor: 'bg-[#D90416]',
    }
  ];

  return (
    <div className="w-full py-16 px-4 bg-white montserrat">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">
          Choose your pricing plan
        </h2>
        <p className="text-gray-500 text-sm md:text-base">
          Find one that works for you
        </p>
      </div>

      {/* CARDS GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className="flex flex-col bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-shadow duration-300"
          >
            
            {/* CARD IMAGE HEADER */}
            <div className="h-40 w-full overflow-hidden">
              <img 
                src={plan.image} 
                alt={plan.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* CARD CONTENT */}
            <div className="flex flex-col items-center p-8 flex-1">
              
              {/* Plan Name */}
              <h3 className="text-lg font-bold text-black mb-6">
                {plan.name}
              </h3>

              {/* Price */}
              <div className="flex items-start mb-1">
                <span className="text-xl font-bold text-black mt-2">£</span>
                <span className="text-6xl font-bold text-black tracking-tight">
                  {plan.price}
                </span>
              </div>

              {/* Frequency Text (Hidden for Freemium if empty) */}
              <div className="h-6 mb-12">
                 {plan.frequency && (
                   <span className="text-xs text-gray-500 font-medium">
                     {plan.frequency}
                   </span>
                 )}
              </div>

              {/* Footer Note */}
              <p className="text-[10px] text-gray-500 mb-3 mt-auto">
                Valid until canceled
              </p>

              {/* Action Button */}
              <button 
                className={`
                  w-full py-3 
                  ${plan.buttonColor} hover:bg-red-700 
                  text-white font-medium text-sm
                  transition-colors duration-300
                `}
              >
                Select
              </button>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default PricingSection;