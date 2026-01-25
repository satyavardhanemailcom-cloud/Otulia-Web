import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiCheckCircle } from 'react-icons/fi';

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { refreshUser, token } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('Verifying payment...');

    useEffect(() => {
        const verifyPayment = async () => {
            if (!sessionId) {
                setStatus('No session ID found.');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:8000/api/payment/verify-payment?session_id=${sessionId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    await refreshUser();
                    setStatus('Payment Successful! Redirecting...');
                    setTimeout(() => {
                        navigate('/profile');
                    }, 2000);
                } else {
                    const data = await response.json();
                    setStatus(`Verification Failed: ${data.error}`);
                }
            } catch (error) {
                console.error("Verification Error", error);
                setStatus('An error occurred during verification.');
            }
        };

        if (sessionId) {
            verifyPayment();
        }
    }, [sessionId, token, navigate, refreshUser]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
            <div className="bg-white p-10 rounded-2xl shadow-xl flex flex-col items-center max-w-md text-center">
                <FiCheckCircle className="text-6xl text-green-500 mb-4 animate-bounce" />
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Status</h1>
                <p className="text-gray-600">{status}</p>
            </div>
        </div>
    );
};

export default Success;
