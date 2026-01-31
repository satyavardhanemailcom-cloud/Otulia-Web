import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import numberWithCommas from '../modules/numberwithcomma';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const CartPage = () => {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();
    const { token, isAuthenticated, user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const navigate = useNavigate();

    const paypalOptions = {
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "GBP",
        intent: "capture",
    };

    const handleProceedToCheckout = () => {
        if (!isAuthenticated) {
            alert('Please login to checkout.');
            navigate('/login');
            return;
        }
        setIsCheckoutModalOpen(true);
    };

    const handlePayPalCreateOrder = async (data, actions) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems: cart })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || "Order creation failed");
            }

            const order = await response.json();
            return order.id;
        } catch (err) {
            console.error("Create Order Error: ", err);
            alert("Failed to create order: " + err.message);
            throw err;
        }
    };

    const handlePayPalApprove = async (data, actions) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/payment/capture-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderID: data.orderID,
                    cartItems: cart
                })
            });

            const details = await response.json();

            if (details.success) {
                // Payment successful
                setIsCheckoutModalOpen(false);
                clearCart();
                navigate('/profile');
            } else {
                alert("Payment failed: " + (details.error || 'Unknown error'));
            }
        } catch (err) {
            console.error("Capture Error: ", err);
            alert("Payment verification failed.");
        }
    };

    return (
        <div className="min-h-screen bg-white pt-24">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <h1 className="text-3xl font-bold font-playfair mb-8">Your Cart</h1>

                {cart.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500 mb-6">Your cart is empty.</p>
                        <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="flex-1">
                            {cart.map((item) => (
                                <div key={item.tempId} className="flex gap-4 border-b border-gray-100 py-6">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {item.image &&
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        }
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-lg">{item.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.type}</span>
                                                    {item.type === 'Rent' && (
                                                        <span className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
                                                            ({item.startDate} — {item.endDate})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.tempId)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>

                                        {item.type === 'Rent' ? (
                                            <>
                                                <div className="text-sm text-gray-500 mb-1">
                                                    Duration: {item.duration} days
                                                </div>
                                                <div className="font-medium">
                                                    £ {numberWithCommas(item.pricePerDay)} x {item.duration} = £ {numberWithCommas(item.totalPrice)}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="font-medium">
                                                Price: £ {numberWithCommas(item.totalPrice)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="w-full lg:w-96 shrink-0">
                            <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                                <h2 className="text-xl font-bold mb-6 font-playfair">Order Summary</h2>
                                <div className="flex justify-between mb-4">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">£ {numberWithCommas(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between mb-6">
                                    <span className="text-gray-600">Service Fee</span>
                                    <span className="font-medium">£ 0</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between mb-8">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-lg">£ {numberWithCommas(cartTotal)}</span>
                                </div>

                                <button
                                    onClick={handleProceedToCheckout}
                                    className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* PAYPAL COMPONENT MODAL */}
            {isCheckoutModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden relative animate-fade-in-up">

                        {/* Header */}
                        <div className="bg-gray-50 p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold font-playfair text-gray-800">Checkout</h3>
                                <p className="text-sm text-gray-500">Secure Payment</p>
                            </div>
                            <button
                                onClick={() => setIsCheckoutModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6">
                            <div className="mb-6 flex justify-between items-center">
                                <span className="text-gray-600 font-medium">Total Payable</span>
                                <span className="text-2xl font-bold text-black">£{numberWithCommas(cartTotal)}</span>
                            </div>

                            <div className="min-h-[150px] flex flex-col justify-center">
                                <PayPalScriptProvider options={paypalOptions}>
                                    <PayPalButtons
                                        style={{ layout: "vertical", shape: "rect", color: "gold", label: "pay" }}
                                        createOrder={handlePayPalCreateOrder}
                                        onApprove={handlePayPalApprove}
                                        onError={(err) => {
                                            console.error("PayPal Error:", err);
                                            alert("PayPal encountered an error. Please try again.");
                                        }}
                                    />
                                </PayPalScriptProvider>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 px-6 py-4 text-center text-xs text-gray-400">
                            Secure payment processed by PayPal
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
