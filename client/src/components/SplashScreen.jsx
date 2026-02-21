import React, { useEffect, useState } from 'react';

const SplashScreen = ({ onFinish }) => {
    const [opacity, setOpacity] = useState(1);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Animation timeline
        // 0ms: Render (Opacity 1)
        // 1500ms: Start Fade Out
        // 2500ms: Remove from DOM (onFinish)

        const fadeTimer = setTimeout(() => {
            setOpacity(0);
        }, 2000);

        const removeTimer = setTimeout(() => {
            setIsVisible(false);
            if (onFinish) onFinish();
        }, 3000);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, [onFinish]);

    if (!isVisible) return null;

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-1000 ease-in-out pointer-events-none"
            style={{ opacity: opacity }}
        >
            <div className="flex flex-col items-center animate-pulse justify-center text-center">
                {/* White Logo */}
                <img
                    src="/logos/otulia_logo_white.png"
                    alt="Otulia"
                    className="w-64 md:w-96 h-auto object-contain mb-6 drop-shadow-2xl"
                />
                <p className="text-white text-sm md:text-base uppercase tracking-[0.4em] font-medium montserrat animate-fade-in text-center w-full pl-[0.4em]">
                    Luxury Redefined
                </p>
            </div>
        </div>
    );
};

export default SplashScreen;
