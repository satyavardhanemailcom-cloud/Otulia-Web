import React from 'react';
import Navbar from '../../components/Navbar';

const Returns = () => {
    return (
        <div className="w-full bg-white pt-40 pb-16">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 text-center">Returns & Refund Policy</h1>

                <div className="prose prose-lg max-w-none text-gray-600 font-sans">
                    <p>
                        Due to the exclusive and high-value nature of the assets listed on Otulia, our return and refund policies are specific to each asset category and transaction type.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Asset Purchases</h2>
                    <p>
                        <strong>Vehicles & Yachts:</strong> All sales are generally final once the title transfer process has been initiated. We strongly recommend comprehensive pre-purchase inspections. In the rare event of a significant discrepancy between the listing and the delivered asset, please contact our concierge team within 48 hours of delivery to initiate a dispute resolution process.
                    </p>
                    <p className="mt-4">
                        <strong>Real Estate:</strong> Real estate transactions are subject to the specific terms and conditions of the purchase agreement and local property laws. Refunds of earnest money deposits are governed by the contract contingencies.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Rentals & Experiences</h2>
                    <p>
                        Cancellations for rentals and booked experiences are subject to the following standard policy, unless otherwise stated in your booking agreement:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>More than 30 days prior:</strong> Full refund minus a processing fee.</li>
                        <li><strong>14-30 days prior:</strong> 50% refund.</li>
                        <li><strong>Less than 14 days prior:</strong> Non-refundable.</li>
                    </ul>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Resolution Center</h2>
                    <p>
                        We are dedicated to ensuring your satisfaction. If you believe a refund is warranted, please submit a claim through our Support Center. Each case is reviewed by a senior case manager.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Returns;
