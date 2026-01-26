import React from 'react';
import Navbar from '../../components/Navbar';

const PrivacyPolicy = () => {
    return (
        <div className="w-full bg-white pt-40 pb-16">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>

                <div className="prose prose-lg max-w-none text-gray-600 font-sans">
                    <p className="mb-6">Effective Date: January 26, 2026</p>

                    <p>
                        At Otulia, we are committed to protecting the privacy and security of our discerning clients. This Privacy Policy outlines how we collect, use, and safeguard your personal information.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information necessary to provide our premium services, including:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Personal identification information (Name, email address, phone number)</li>
                        <li>Financial information for transaction processing (securely handled by our payment partners)</li>
                        <li>Asset preferences and transaction history</li>
                        <li>Verification documents for high-value inquiries</li>
                    </ul>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
                    <p>
                        Your information is used to:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li>Facilitate the purchase, sale, or rental of luxury assets</li>
                        <li>Verify your identity and eligibility for exclusive listings</li>
                        <li>Provide personalized concierge services</li>
                        <li>Improve our platform and user experience</li>
                    </ul>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">3. Data Security</h2>
                    <p>
                        We employ state-of-the-art security measures to protect your data. All sensitive financial information is encrypted and transmitted securely. We do not sell your personal data to third parties.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">4. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or delete your personal information. To exercise these rights, please contact our privacy officer at privacy@otulia.com.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
