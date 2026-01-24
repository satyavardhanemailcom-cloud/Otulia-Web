import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { GoogleLogin } from '@react-oauth/google';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const { success, error } = await signup(name, email, password);
        if (success) {
            navigate('/');
        } else {
            setError(error || 'Failed to sign up');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const { success, error } = await googleLogin(credentialResponse.credential);
        if (success) {
            navigate('/');
        } else {
            setError(error || 'Google signup failed');
        }
    };

    const handleGoogleError = () => {
        setError('Google signup failed. Please try again.');
    };

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen bg-gray-100 pt-24 montserrat">
                <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold playfair-display text-center text-gray-900">Sign Up</h2>
                    {error && <p className="text-red-500 text-center text-sm">{error}</p>}

                    <div className="flex flex-col items-center justify-center w-full py-2">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            size="large"
                            width="100%"
                            text="signup_with"
                            shape="rectangular"
                        />
                    </div>

                    <div className="relative flex items-center py-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-400 text-xs uppercase">Or sign up with email</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 font-bold text-white bg-black rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                    <p className="text-sm text-center text-gray-600">
                        Already have an account? <Link to="/login" className="font-medium text-gray-800 hover:text-gray-700">Log in</Link>
                    </p>
                </div>
            </div>
        </>

    );
};

export default SignupPage;
