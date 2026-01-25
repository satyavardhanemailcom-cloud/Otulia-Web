import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import numberWithCommas from '../modules/numberwithcomma';

const CartPage = () => {
    const { cart, removeFromCart, cartTotal } = useCart();
    const { token, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            alert('Please login to checkout.');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/payment/create-cart-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cartItems: cart }) // this works for both rent and buy now
            });

            const data = await response.json();

            if (data.url) {
                // Redirect to Stripe
                window.location.href = data.url;
            } else {
                alert('Checkout failed: ' + (data.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('An error occurred during checkout.');
        } finally {
            setLoading(false);
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
                                                    ₹ {numberWithCommas(item.pricePerDay)} x {item.duration} = ₹ {numberWithCommas(item.totalPrice)}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="font-medium">
                                                Price: ₹ {numberWithCommas(item.totalPrice)}
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
                                    <span className="font-medium">₹ {numberWithCommas(cartTotal)}</span>
                                </div>
                                <div className="flex justify-between mb-6">
                                    <span className="text-gray-600">Service Fee</span>
                                    <span className="font-medium">₹ 0</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between mb-8">
                                    <span className="font-bold text-lg">Total</span>
                                    <span className="font-bold text-lg">₹ {numberWithCommas(cartTotal)}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
