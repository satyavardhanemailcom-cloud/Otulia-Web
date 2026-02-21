import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar'
import { GoogleLogin } from '@react-oauth/google';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const { success, error } = await login(email, password);
        if (success) {
            navigate('/');
        } else {
            setError(error || 'Failed to login');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const { success, error } = await googleLogin(credentialResponse.credential);
        if (success) {
            navigate('/');
        } else {
            setError(error || 'Google login failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google login failed. Please try again.');
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black font-sans overflow-hidden space-y-10">

            {/* Full Screen Background */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/login_bg.png"
                    alt="Luxury Background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/90"></div>
            </div>

            {/* Navbar Overlay - It will handle its own transparency */}
            <div className="absolute top-0 left-0 w-full z-50">
                <Navbar hideSearch={true} hideLogin={true} forceTransparent={true} customLogo="/logos/otulia_logo_white.png" />
            </div>

            {/* Centered Glass Card */}
            <div className="relative z-10 w-full max-w-xl p-1 px-4 animate-in zoom-in-95 duration-700">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl p-8 md:p-12 overflow-hidden">

                    {/* Decorative Top Line */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-1 bg-[#D48D2A]/80 rounded-b-full shadow-[0_0_15px_rgba(212,141,42,0.5)]"></div>

                    <div className="text-center mb-10 mt-2">
                        <h2 className="text-3xl md:text-4xl font-bold playfair-display text-white mb-3">Welcome Back</h2>
                        <p className="text-gray-300 text-xs md:text-sm montserrat uppercase tracking-[0.2em] font-light">Access your personal sanctuary</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded-xl text-sm text-center mb-6 backdrop-blur-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4 mb-8">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="filled_black"
                            size="large"
                            width="100%"
                            text="continue_with"
                            shape="pill"
                        />
                    </div>

                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-white/10"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-medium">Or via email</span>
                        <div className="flex-grow border-t border-white/10"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-[#D48D2A] transition-colors">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full px-5 py-4 bg-black/20 border border-white/10 text-white rounded-xl focus:outline-none focus:border-[#D48D2A] focus:bg-black/40 transition-all text-sm font-medium placeholder-white/20 hover:border-white/20"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="group">
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest group-focus-within:text-[#D48D2A] transition-colors">Password</label>
                                    <a href="#" className="text-[10px] text-gray-400 hover:text-white transition-colors uppercase tracking-wider font-bold">Forgot?</a>
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-5 py-4 bg-black/20 border border-white/10 text-white rounded-xl focus:outline-none focus:border-[#D48D2A] focus:bg-black/40 transition-all text-sm font-medium placeholder-white/20 hover:border-white/20 pr-12" // Added pr-12 for icon spacing
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white focus:outline-none"
                                    >
                                        {showPassword ? (
                                            <FaEye className="w-5 h-5" />
                                        ) : (
                                            <FaEyeSlash className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-[#D48D2A] text-white font-bold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-[#B5751C] hover:shadow-[0_0_20px_rgba(212,141,42,0.4)] transition-all duration-300 transform active:scale-[0.98] mt-4"
                        >
                            Log In
                        </button>
                    </form>

                    <div className="text-center mt-10">
                        <p className="text-gray-400 text-xs">
                            Not a member yet?{' '}
                            <Link to="/signup" className="font-bold text-white hover:text-[#D48D2A] transition-colors ml-1 uppercase tracking-wider text-[10px]">
                                Apply for Access
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-center text-white/20 text-[10px] mt-6 uppercase tracking-[0.3em]">
                    Otulia &copy; 2026
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
