import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { 
  FiUser, FiMail, FiPhone, FiCreditCard, FiCalendar, FiLogOut, FiShoppingBag, 
  FiClock, FiActivity, FiXCircle, FiSettings, FiCheckCircle, FiEdit, FiMessageSquare,
  FiChevronDown, FiInstagram, FiLinkedin, FiFacebook, FiYoutube, FiRefreshCw, FiBriefcase, FiGlobe, FiShield, FiUpload
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserPlaceholder from '../assets/user.png';
import VerificationModal from '../components/VerificationModal';
import ImageCropModal from '../components/ImageCropModal';
import SEO from '../components/SEO';

const languages = [
    'English', 'Spanish', 'French', 'Arabic', 'German', 
    'Chinese', 'Russian', 'Portuguese', 'Italian', 'Dutch'
];

const timezones = [
    '(GMT-08:00) Pacific Time (US & Canada)',
    '(GMT-05:00) Eastern Time (US & Canada)',
    '(GMT+00:00) London, Dublin, Lisbon',
    '(GMT+01:00) Paris, Berlin, Rome, Madrid',
    '(GMT+02:00) Athens, Istanbul, Jerusalem',
    '(GMT+03:00) Moscow, Riyadh, Nairobi',
    '(GMT+04:00) Dubai, UAE',
    '(GMT+05:30) Mumbai, New Delhi',
    '(GMT+08:00) Singapore, Hong Kong, Beijing',
    '(GMT+09:00) Tokyo, Seoul',
    '(GMT+10:00) Sydney, Melbourne'
];

const contactMethods = ['WhatsApp', 'Email', 'Phone Call', 'SMS'];

const Profile = () => {
  const { user, logout, refreshUser, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [cancelMessage, setCancelMessage] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cropTarget, setCropTarget] = useState(null); // 'profile' or 'agentCover'

  // Refs for focusing
  const nameRef = useRef(null);
  const jobRef = useRef(null);
  const phoneRef = useRef(null);
  const whatsappRef = useRef(null);
  const contactRef = useRef(null);
  const langRef = useRef(null);
  const tzRef = useRef(null);
  const descRef = useRef(null);
  const instaRef = useRef(null);
  const linkedRef = useRef(null);
  const xRef = useRef(null);
  const fbRef = useRef(null);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phoneCode: '+971',
    phone: '',
    whatsappCode: '+971',
    whatsapp: '',
    jobTitle: '',
    language: 'English',
    timezone: '(GMT+04:00) Dubai, UAE',
    preferredContact: 'WhatsApp',
    description: '',
    social: {
      instagram: '',
      linkedin: '',
      facebook: '',
      twitter: '',
      youtube: ''
    }
  });

  useEffect(() => {
    if (user) {
      // Parse phone
      let pCode = '+971';
      let pNum = '';
      if (user.phone) {
        const parts = user.phone.split(' ');
        if (parts.length > 1) {
          pCode = parts[0];
          pNum = parts.slice(1).join(' ');
        } else {
          pNum = user.phone;
        }
      }

      // Parse whatsapp
      let wCode = '+971';
      let wNum = '';
      if (user.whatsapp) {
        const parts = user.whatsapp.split(' ');
        if (parts.length > 1) {
          wCode = parts[0];
          wNum = parts.slice(1).join(' ');
        } else {
          wNum = user.whatsapp;
        }
      }

      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phoneCode: pCode,
        phone: pNum,
        whatsappCode: wCode,
        whatsapp: wNum,
        jobTitle: user.jobTitle || '',
        language: user.language || 'English',
        timezone: user.timezone || '(GMT+04:00) Dubai, UAE',
        preferredContact: user.preferredContact || 'WhatsApp',
        description: user.agentDescription || '',
        social: {
          instagram: user.social?.instagram || '',
          linkedin: user.social?.linkedin || '',
          facebook: user.social?.facebook || '',
          twitter: user.social?.twitter || user.social?.x || '',
          youtube: user.social?.youtube || ''
        }
      });
    }
  }, [user]);

  const handleUploadSuccess = async () => {
    setShowVerificationModal(false);
    await refreshUser();
    alert("Documents submitted successfully! Your account is now Pending Verification.");
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: `${profileData.phoneCode} ${profileData.phone}`,
          whatsapp: `${profileData.whatsappCode} ${profileData.whatsapp}`,
          jobTitle: profileData.jobTitle,
          language: profileData.language,
          timezone: profileData.timezone,
          preferredContact: profileData.preferredContact,
          agentDescription: profileData.description,
          social: profileData.social
        })
      });

      if (response.ok) {
        await refreshUser();
        alert("Profile updated successfully!");
      } else {
        const err = await response.json();
        alert(err.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureUpload = async (blob) => {
    let endpoint = '';
    let fieldName = '';

    if (cropTarget === 'profile') {
      setIsUploading(true);
      endpoint = '/api/auth/upload-profile-picture';
      fieldName = 'profilePicture';
    } else {
      setIsUploadingCover(true);
      endpoint = '/api/auth/upload-cover-photo';
      fieldName = 'coverPhoto';
    }

    const formData = new FormData();
    formData.append(fieldName, blob, 'image.png');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        await refreshUser();
        setShowCropModal(false);
        setImageToCrop(null);
        alert(`${cropTarget === 'profile' ? 'Profile picture' : 'Cover photo'} updated successfully!`);
      } else {
        const err = await response.json();
        alert(err.error || `Failed to upload ${cropTarget === 'profile' ? 'profile picture' : 'cover photo'}.`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading image.');
    } finally {
      setIsUploading(false);
      setIsUploadingCover(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your subscription? You will lose premium benefits.")) return;

    try {
      const response = await fetch('/api/payment/cancel-subscription', {
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
      <SEO title="My Profile" description="Manage your Otulia profile, view your order history, and update your account details." />
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-6xl mx-auto">
        {/* Header Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="h-48 bg-gray-100 relative group">
            {user.coverPhoto ? (
              <img src={user.coverPhoto} className="w-full h-full object-cover" alt="Cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-gray-900 to-black"></div>
            )}
            
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <div className="flex flex-col items-center text-white gap-2">
                <FiUpload className="text-2xl" />
                <span className="text-sm font-bold uppercase tracking-widest">Update Cover Photo</span>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCropTarget('agentCover');
                    const reader = new FileReader();
                    reader.onload = () => {
                      setImageToCrop(reader.result?.toString() || '');
                      setShowCropModal(true);
                    };
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }} 
              />
            </label>

            {isUploadingCover && (
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                <FiRefreshCw className="text-white text-3xl animate-spin" />
              </div>
            )}

            <div className="absolute -bottom-12 left-8 md:left-12">
              <div className="relative">
                <label className="relative cursor-pointer group/avatar block">
                  <img
                    src={user.profilePicture || UserPlaceholder}
                    alt={user.name}
                    className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <FiEdit className="text-white text-2xl" />
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setCropTarget('profile');
                        const reader = new FileReader();
                        reader.addEventListener('load', () =>
                          setImageToCrop(reader.result?.toString() || ''),
                        );
                        reader.readAsDataURL(e.target.files[0]);
                        setShowCropModal(true);
                        e.target.value = null; // Reset input value
                      }
                    }}
                  />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full" title="Online"></div>
                </label>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-8 px-8 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 canela mb-1">{user.name}</h1>
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
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Personal Details</h3>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all disabled:bg-gray-400"
                    >
                      {isSaving ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
                      {isSaving ? 'Saving...' : 'Save Details'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiUser /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Full Name</p>
                        <input
                          ref={nameRef}
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b border-transparent focus:border-gray-300 outline-none"
                        />
                      </div>
                      <button onClick={() => nameRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-blue-600 hover:text-blue-700 p-1"><FiEdit className="text-[10px]"/></button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiBriefcase /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Job Title / Role</p>
                        <input
                          ref={jobRef}
                          type="text"
                          value={profileData.jobTitle}
                          onChange={(e) => setProfileData({...profileData, jobTitle: e.target.value})}
                          className="w-full text-sm font-semibold text-gray-900 bg-transparent border-b border-transparent focus:border-gray-300 outline-none"
                        />
                      </div>
                      <button onClick={() => jobRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-blue-600 hover:text-blue-700 p-1"><FiEdit className="text-[10px]"/></button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiMail /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                        <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                      </div>
                      <div className="absolute top-3 right-3"><FiShield className="text-[10px] text-emerald-500" title="Verified Primary Email"/></div>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiPhone /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Phone Number</p>
                        <div className="flex gap-2">
                          <select 
                            value={profileData.phoneCode}
                            onChange={(e) => setProfileData({...profileData, phoneCode: e.target.value})}
                            className="text-sm font-semibold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-gray-300"
                          >
                            <option value="+971">+971</option>
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                          </select>
                          <input
                            ref={phoneRef}
                            type="text"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            className="flex-1 text-sm font-semibold text-gray-900 bg-transparent border-b border-transparent focus:border-gray-300 outline-none"
                          />
                        </div>
                      </div>
                      <button onClick={() => phoneRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-blue-600 hover:text-blue-700 p-1"><FiEdit className="text-[10px]"/></button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 shadow-sm"><FaWhatsapp /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">WhatsApp Number</p>
                        <div className="flex gap-2">
                          <select 
                            value={profileData.whatsappCode}
                            onChange={(e) => setProfileData({...profileData, whatsappCode: e.target.value})}
                            className="text-sm font-semibold text-gray-900 bg-transparent outline-none border-b border-transparent focus:border-gray-300"
                          >
                            <option value="+971">+971</option>
                            <option value="+91">+91</option>
                            <option value="+1">+1</option>
                            <option value="+44">+44</option>
                          </select>
                          <input
                            ref={whatsappRef}
                            type="text"
                            value={profileData.whatsapp}
                            onChange={(e) => setProfileData({...profileData, whatsapp: e.target.value})}
                            className="flex-1 text-sm font-semibold text-gray-900 bg-transparent border-b border-transparent focus:border-gray-300 outline-none"
                          />
                        </div>
                      </div>
                      <button onClick={() => whatsappRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-blue-600 hover:text-blue-700 p-1"><FiEdit className="text-[10px]"/></button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiMessageSquare /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Preferred Contact Method</p>
                        <div className="relative">
                          <select 
                            ref={contactRef}
                            value={profileData.preferredContact}
                            onChange={(e) => setProfileData({...profileData, preferredContact: e.target.value})}
                            className="w-full text-sm font-semibold text-gray-900 bg-transparent appearance-none outline-none border-b border-transparent focus:border-gray-300 pr-6 cursor-pointer"
                          >
                            {contactMethods.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                          <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <button onClick={() => contactRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-blue-600 hover:text-blue-700 p-1"><FiEdit className="text-[10px]"/></button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiGlobe /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Language</p>
                        <div className="relative">
                          <select 
                            ref={langRef}
                            value={profileData.language}
                            onChange={(e) => setProfileData({...profileData, language: e.target.value})}
                            className="w-full text-sm font-semibold text-gray-900 bg-transparent appearance-none outline-none border-b border-transparent focus:border-gray-300 pr-6 cursor-pointer"
                          >
                            {languages.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <button onClick={() => langRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-blue-600 hover:text-blue-700 p-1"><FiEdit className="text-[10px]"/></button>
                    </div>

                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 relative group">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-500 shadow-sm"><FiClock /></div>
                      <div className="flex-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Time Zone</p>
                        <div className="relative">
                          <select 
                            ref={tzRef}
                            value={profileData.timezone}
                            onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                            className="w-full text-sm font-semibold text-gray-900 bg-transparent appearance-none outline-none border-b border-transparent focus:border-gray-300 pr-6 cursor-pointer"
                          >
                            {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                          </select>
                          <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <button onClick={() => tzRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-3 text-blue-600 hover:text-blue-700 p-1"><FiEdit className="text-[10px]"/></button>
                    </div>
                  </div>

                  <div className="mt-6 relative group">
                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Agent Description</p>
                    <textarea 
                      ref={descRef}
                      value={profileData.description}
                      onChange={(e) => setProfileData({...profileData, description: e.target.value})}
                      rows="4"
                      className="w-full p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm font-medium text-gray-900 focus:border-gray-300 outline-none resize-none"
                      placeholder="Tell us about yourself..."
                    ></textarea>
                    <button onClick={() => descRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-0 right-0 text-blue-600 hover:text-blue-700 p-1"><FiEdit className="text-[10px]"/></button>
                    <div className="flex justify-end mt-1">
                      <span className="text-[10px] text-gray-400 font-bold">{profileData.description?.length || 0}/1000</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Social Profiles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 relative group">
                        <FiInstagram className="text-pink-500" />
                        <input
                          ref={instaRef}
                          type="text"
                          placeholder="Instagram Profile URL"
                          value={profileData.social.instagram}
                          onChange={(e) => setProfileData({...profileData, social: {...profileData.social, instagram: e.target.value}})}
                          className="flex-1 bg-transparent text-xs font-semibold text-gray-900 outline-none"
                        />
                        <button onClick={() => instaRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-3 text-blue-600 hover:text-blue-700"><FiEdit className="text-[10px]"/></button>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 relative group">
                        <FiLinkedin className="text-blue-600" />
                        <input
                          ref={linkedRef}
                          type="text"
                          placeholder="LinkedIn Profile URL"
                          value={profileData.social.linkedin}
                          onChange={(e) => setProfileData({...profileData, social: {...profileData.social, linkedin: e.target.value}})}
                          className="flex-1 bg-transparent text-xs font-semibold text-gray-900 outline-none"
                        />
                        <button onClick={() => linkedRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-3 text-blue-600 hover:text-blue-700"><FiEdit className="text-[10px]"/></button>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 relative group">
                        <span className="font-black text-black text-xs">X</span>
                        <input
                          ref={xRef}
                          type="text"
                          placeholder="X (Twitter) Profile URL"
                          value={profileData.social.twitter}
                          onChange={(e) => setProfileData({...profileData, social: {...profileData.social, twitter: e.target.value}})}
                          className="flex-1 bg-transparent text-xs font-semibold text-gray-900 outline-none"
                        />
                        <button onClick={() => xRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-3 text-blue-600 hover:text-blue-700"><FiEdit className="text-[10px]"/></button>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 relative group">
                        <FiFacebook className="text-blue-500" />
                        <input
                          ref={fbRef}
                          type="text"
                          placeholder="Facebook Profile URL"
                          value={profileData.social.facebook}
                          onChange={(e) => setProfileData({...profileData, social: {...profileData.social, facebook: e.target.value}})}
                          className="flex-1 bg-transparent text-xs font-semibold text-gray-900 outline-none"
                        />
                        <button onClick={() => fbRef.current?.focus()} className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-1/2 -translate-y-1/2 right-3 text-blue-600 hover:text-blue-700"><FiEdit className="text-[10px]"/></button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Partner Verification Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Partner Status</h3>

                    {user.verificationStatus === 'Verified' ? (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <FiCheckCircle /> Verified Partner
                      </span>
                    ) : user.verificationStatus === 'Pending' ? (
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                        <FiClock /> Verification Pending
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-50 text-gray-500 border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                        Unverified
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 mb-2 canela">
                        {user.verificationStatus === 'Verified' ? 'You are a Certified Partner' : 'Become a Certified Partner'}
                      </h4>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        {user.verificationStatus === 'Verified'
                          ? 'Your account is fully verified. You have access to detailed seller analytics, priority support, and the "Verified" badge on all your listings.'
                          : user.verificationStatus === 'Pending'
                            ? 'We have received your documents and are currently reviewing your application. This process usually takes 24-48 hours.'
                            : 'Upload your business documents to unlock selling privileges, gain the "Verified" badge, and access premium seller tools.'}
                      </p>
                    </div>

                    {user.verificationStatus !== 'Verified' && user.verificationStatus !== 'Pending' && (
                      <button
                        onClick={() => setShowVerificationModal(true)}
                        className="px-6 py-3 bg-[#D48D2A] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#B5751C] shadow-lg shadow-[#D48D2A]/20 transition-all whitespace-nowrap"
                      >
                        Verify Now
                      </button>
                    )}
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
                            <span className="font-bold text-black text-xl canela">${order.price?.toLocaleString()}</span>
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
                              <p className="text-[10px] text-gray-400">${item.totalPrice?.toLocaleString()}</p>
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
      {showVerificationModal && (
        <VerificationModal
          onClose={() => setShowVerificationModal(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
      {showCropModal && imageToCrop && (
        <ImageCropModal
          src={imageToCrop}
          onCropComplete={handleProfilePictureUpload}
          onClose={() => {
            setShowCropModal(false);
            setImageToCrop(null);
          }}
          isUploading={cropTarget === 'profile' ? isUploading : isUploadingCover}
        />
      )}
    </div>
  );
};

export default Profile;
