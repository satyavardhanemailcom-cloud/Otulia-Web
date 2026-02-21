import React from 'react';
import Navbar from '../../components/Navbar';

const About = () => {
    return (
        <div className="w-full bg-white pt-40 pb-16 montserrat">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-playfair font-bold text-gray-900 mb-8 text-center">About Otulia</h1>

                <div className="prose prose-lg max-w-none text-gray-600">
                    <p className="mb-6">
                        Otulia is the premier digital marketplace for the world's most exclusive assets. We bridge the gap between discerning collectors and verified sellers of luxury vehicles, premium estates, superyachts, and rare collectibles.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Our Mission</h2>
                    <p>
                        To create a seamless, trusted, and sophisticated ecosystem for high-value asset transactions. We believe that acquiring luxury should be as exceptional as the asset itself—transparent, secure, and effortless.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">What We Offer</h2>
                    <p>
                        From the roar of a V12 engine to the silence of a private island, Otulia curates a diverse portfolio of excellence. Our platform hosts verified listings for:
                    </p>
                    <ul className="list-disc pl-5 mt-4 space-y-2">
                        <li><strong>Supercars & Hypercars:</strong> Rare automotive masterpieces from around the globe.</li>
                        <li><strong>Luxury Real Estate:</strong> Iconic properties, from urban penthouses to coastal retreats.</li>
                        <li><strong>Yachts & Marine:</strong> Exceptional vessels for the open seas.</li>
                        <li><strong>Premium Motorcycles:</strong> High-performance bikes for the enthusiast.</li>
                    </ul>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Trust & Verification</h2>
                    <p>
                        Integrity is the cornerstone of our community. We employ rigorous verification processes for both sellers and assets to ensure that every listing on Otulia meets our high standards of authenticity and quality.
                    </p>

                    <h2 className="text-2xl font-playfair font-semibold text-gray-900 mt-8 mb-4">Join Our Community</h2>
                    <p>
                        Whether you are looking to acquire your next masterpiece or list an asset for a global audience, Otulia provides the tools and network to make it happen.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default About;
