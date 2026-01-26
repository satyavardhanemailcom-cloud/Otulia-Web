import React from 'react';
import Navbar from '../../components/Navbar';

const CookiePolicy = () => {
    return (
        <div className="w-full bg-white pt-40 pb-16">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 text-center">Cookie Policy</h1>

                <div className="prose prose-lg max-w-none text-gray-600 font-sans">
                    <p>
                        Otulia uses cookies and similar technologies to provide you with a personalized and premium user experience. This policy explains what cookies are, how we use them, and your choices regarding their use.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">What Are Cookies?</h2>
                    <p>
                        Cookies are small text files that are stored on your device when you visit a website. They help us remember your preferences, understand how you interact with our platform, and enhance your browsing experience.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">How We Use Cookies</h2>
                    <p>
                        We use cookies for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 mb-4">
                        <li><strong>Essential Cookies:</strong> Necessary for the operation of the website, such as secure login and transaction processing.</li>
                        <li><strong>Analytics Cookies:</strong> Help us analyze traffic and user behavior to improve our services and layout.</li>
                        <li><strong>Functional Cookies:</strong> innovative features like saving your search preferences and "Favorite" lists.</li>
                        <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and offers tailored to your interests in luxury assets.</li>
                    </ul>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Managing Cookies</h2>
                    <p>
                        You can control and manage cookies through your browser settings. Please note that disabling certain cookies may impact the functionality of the Otulia platform and limit your access to specific features.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
