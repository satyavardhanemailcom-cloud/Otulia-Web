import React from 'react';
import Navbar from '../../components/Navbar';

const Terms = () => {
    return (
        <div className="w-full bg-white pt-40 pb-16">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 text-center">Terms & Conditions</h1>

                <div className="prose prose-lg max-w-none text-gray-600 font-sans">
                    <p className="mb-6">Last updated: January 26, 2026</p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
                    <p>
                        These Terms and Conditions constitute a legally binding agreement between you, whether personally or on behalf of an entity ("you") and Otulia ("we," "us," or "our"), regarding your access to and use of the Otulia website and our luxury asset marketplace services.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">2. Luxury Asset Services</h2>
                    <p>
                        Otulia provides a premium platform for the buying, selling, and renting of high-value assets including but not limited to supercars, luxury estates, yachts, and premium motorcycles. By using our services, you acknowledge that all transactions are subject to verification and availability.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">3. User Verification</h2>
                    <p>
                        To maintain the integrity of our exclusive community, all users interested in high-value transactions may be subject to identity verification and financial qualification processes. We reserve the right to deny service to any user who does not meet our strict verification standards.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
                    <p>
                        The content on Otulia, including text, graphics, logos, and images, is the property of Otulia or its licensors and is protected by copyright and other intellectual property laws. You may not use any content without our express written permission.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">5. Limitation of Liability</h2>
                    <p>
                        Otulia acts as a facilitator for luxury transactions. While we strive to ensure the accuracy of listings, we are not liable for any discrepancies in asset descriptions, condition reports, or availability provided by third-party sellers or dealers.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">6. Contact Us</h2>
                    <p>
                        If you have questions about these Terms, please contact our legal team at legal@otulia.com.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
