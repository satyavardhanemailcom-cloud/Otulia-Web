import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiPhone, FiCreditCard, FiCalendar, FiLogOut, FiShoppingBag, FiClock, FiActivity, FiXCircle, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import UserPlaceholder from '../assets/user.png';

const Profile = () => {
  const { user, logout, refreshUser, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [cancelMessage, setCancelMessage] = useState('');

  // Edit state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdatePhone = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ phone: phoneNumber })
      });

      if (response.ok) {
        await refreshUser();
        setIsEditingPhone(false);
      } else {
        alert('Failed to update phone number');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription? You will lose premium benefits.")) return;

    try {
      const response = await fetch('http://127.0.0.1:8000/api/payment/cancel-subscription', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await refreshUser();
        setCancelMessage('Subscription cancelled successfully.');
      } else {
        setCancelMessage('Failed to cancel subscription.');
      }
    } catch (error) {
      console.error(error);
      setCancelMessage('Error cancelling subscription.');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FiActivity },
    { id: 'orders', label: 'Orders', icon: FiShoppingBag },
    { id: 'history', label: 'History', icon: FiClock },
  ];

  if (user.role === 'admin') {
    tabs.push({ id: 'admin', label: 'Admin Dashboard', icon: FiSettings });
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        {/* Header Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-gray-900 to-black relative">
            <div className="absolute -bottom-12 left-8 md:left-12">
              <div className="relative">
                <img
                  src={user.profilePicture || UserPlaceholder}
                  alt={user.name}
                  className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                />
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Online"></div>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 playfair-display mb-1">{user.name}</h1>
              <p className="text-gray-500 text-sm font-medium montserrat">Member since {new Date(user.createdAt || Date.now()).getFullYear()}</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all text-sm font-bold">
              <FiLogOut />
              <span className='montserrat'>Sign Out</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 montserrat">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    if (tab.id === 'admin') {
                      navigate('/admin');
                    } else {
                      setActiveTab(tab.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${activeTab === tab.id ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <tab.icon className="text-lg" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3 montserrat">

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Personal Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiUser /></div>
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase">Full Name</p><p className="text-sm font-semibold text-gray-900">{user.name}</p></div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiMail /></div>
                      <div><p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p><p className="text-sm font-semibold text-gray-900">{user.email}</p></div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiPhone /></div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="text-[10px] text-gray-400 font-bold uppercase">Phone Number</p>
                          {!isEditingPhone && (
                            <button onClick={() => { setIsEditingPhone(true); setPhoneNumber(user.phone || ''); }} className="text-[10px] text-blue-600 font-bold uppercase hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Edit</button>
                          )}
                        </div>

                        {isEditingPhone ? (
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full text-sm border-b border-gray-300 focus:border-black outline-none py-1 bg-transparent"
                              placeholder="Enter phone number"
                            />
                            <button onClick={handleUpdatePhone} className="text-green-600 font-bold uppercase text-[10px]">Save</button>
                            <button onClick={() => setIsEditingPhone(false)} className="text-red-500 font-bold uppercase text-[10px]">Cancel</button>
                          </div>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Plan */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Subscription Plan</h3>
                  <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black text-white overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm"><FiCreditCard className="text-xl" /></div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${user.plan === 'Freemium' ? 'bg-gray-700 text-gray-300' : 'bg-[#D90416] text-white'}`}>{user.plan || 'No Plan'}</span>
                      </div>
                      <h4 className="text-2xl font-bold mb-1">{user.plan || 'Freemium'} Plan</h4>
                      <p className="text-white/60 text-xs mb-6">{user.plan === 'Freemium' ? 'Upgrade to unlock premium features.' : 'Enjoying premium benefits.'}</p>

                      {user.plan !== 'Freemium' && (
                        <div className="flex gap-4">
                          <button onClick={handleCancelSubscription} className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/30 rounded-lg text-xs font-bold uppercase hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2">
                            <FiXCircle /> Cancel Subscription
                          </button>
                        </div>
                      )}
                      {cancelMessage && <p className="text-xs text-green-400 mt-2">{cancelMessage}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ORDERS (Unified Buy & Rent) */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px] montserrat">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Order History</h3>

                {(!user.boughtHistory || user.boughtHistory.length === 0) && (!user.rentedHistory || user.rentedHistory.length === 0) ? (
                  <div className="text-center py-20 text-gray-400">
                    <FiShoppingBag className="text-4xl mx-auto mb-4 opacity-50" />
                    <p>No transactions yet.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Combine and sort by date descending */}
                    {[
                      ...(user.boughtHistory || []).map(o => ({ ...o, type: 'Purchase', sortDate: o.date })),
                      ...(user.rentedHistory || []).map(r => ({ ...r, type: 'Rental', sortDate: r.rentedAt, price: r.totalPrice }))
                    ]
                      .sort((a, b) => new Date(b.sortDate) - new Date(a.sortDate))
                      .map((order, idx) => (
                        <div key={idx} className="p-5 border border-gray-100 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/20 hover:bg-gray-50/50 transition-colors">
                          <div className="flex gap-4 items-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shadow-sm border border-gray-200 shrink-0">
                              {order.item?.images?.[0] ? (
                                <img src={order.item.images[0]} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400"><FiShoppingBag /></div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-bold text-gray-900">{order.item?.title || 'Exclusive Asset'}</p>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${order.type === 'Rental' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                  {order.type}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">ID: {order.orderId || `ORD-${idx}`}</p>

                              {order.type === 'Rental' && order.startDate && (
                                <p className="text-[10px] text-gray-500 font-medium">
                                  Period: {new Date(order.startDate).toLocaleDateString()} — {new Date(order.endDate).toLocaleDateString()}
                                </p>
                              )}
                              <p className="text-[10px] text-gray-400">Ordered on {new Date(order.sortDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-black text-xl font-playfair">£ {order.price?.toLocaleString()}</span>
                            <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest mt-1">Confirmed</span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[400px] montserrat">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Activity History</h3>
                <div className="space-y-8">

                  {/* PURCHASED ITEMS */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-tighter">Purchase History</h4>
                    {user.boughtHistory && user.boughtHistory.length > 0 ? (
                      <div className="space-y-3">
                        {user.boughtHistory.map((order, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-center">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{order.item?.title || 'Exclusive Asset'}</p>
                              <p className="text-[10px] text-gray-500">Purchased on {new Date(order.date).toLocaleDateString()}</p>
                            </div>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Bought</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400 italic">No purchase history found.</p>}
                  </div>

                  {/* RENTED ITEMS */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-tighter montserrat">Rental History</h4>
                    {user.rentedHistory && user.rentedHistory.length > 0 ? (
                      <div className="space-y-3">
                        {user.rentedHistory.map((item, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{item.item?.title || 'Premium Asset'}</p>
                              <p className="text-[10px] text-gray-500">{new Date(item.startDate).toLocaleDateString()} &mdash; {new Date(item.endDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-1 inline-block uppercase tracking-widest">Leased</span>
                              <p className="text-[10px] text-gray-400">£ {item.totalPrice?.toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-xs text-gray-400 italic">No rental history found.</p>}
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
