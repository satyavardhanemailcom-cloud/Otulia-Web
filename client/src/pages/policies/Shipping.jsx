import React from 'react';
import Navbar from '../../components/Navbar';

const Shipping = () => {
    return (
        <div className="w-full bg-white pt-40 pb-16">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 text-center">Shipping & Delivery Information</h1>

                <div className="prose prose-lg max-w-none text-gray-600 font-sans">
                    <p>
                        Otulia facilitates the global transport of luxury assets with white-glove service. Whether it's a supercar, a yacht, or a timepiece, we ensure your asset arrives safely and discreetly.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Global Logistics Partners</h2>
                    <p>
                        We partner with top-tier logistics providers specializing in high-value transport. Our network covers air, sea, and enclosed ground transport to ensure the utmost care for your assets.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Vehicle Transport</h2>
                    <p>
                        All vehicles are transported in fully enclosed, climate-controlled carriers. We offer door-to-door service, including handling of all customs documentation for international shipments.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Yacht Delivery</h2>
                    <p>
                        Yacht delivery is managed by professional crews or specialized transport ships. We coordinate all logistics, including route planning, insurance, and port handling.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Insurance</h2>
                    <p>
                        Every shipment is fully insured against all risks during transit. Coverage details will be provided prior to shipment confirmation.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Delivery Timelines</h2>
                    <p>
                        Delivery times vary based on origin, destination, and asset type. Your dedicated concierge will provide you with a detailed timeline and real-time tracking updates once your transaction is finalized.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Shipping;
