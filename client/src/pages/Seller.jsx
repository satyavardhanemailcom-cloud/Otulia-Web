import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const Seller = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    contactConsent: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/seller/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Thank you! Our luxury team will contact you shortly.');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          contactConsent: false,
        });
      } else {
        setMessage('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-white montserrat pb-20">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[300px] md:h-[450px] w-full flex items-center px-6 md:px-24 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=2070"
          alt="Start Selling With Us"
          className="absolute inset-0 w-full h-full object-cover object-center translate-y-12"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-white max-w-4xl pt-16">
          <h1 className="text-4xl md:text-7xl font-bold mb-4 tracking-tight">
            Start Selling <br /> With Us
          </h1>
          <p className="text-lg md:text-2xl font-normal tracking-wide opacity-90">
            Get Global Exposure for your Business
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="w-full py-24 px-6 md:px-24 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 items-start">
          <div className="lg:w-[45%] flex flex-col gap-8">
            <h2 className="text-3xl md:text-5xl font-bold text-black leading-tight">
              Sign up today for <br /> Global Exposure
            </h2>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-light max-w-lg">
              Our platform provides a premium experience, granting you access to connect with buyers all over the world, exclusive features, and security.
            </p>
            {message && (
              <div className={`p-5 rounded-sm inline-block text-sm font-medium ${message.includes('Thank') ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'}`}>
                {message}
              </div>
            )}
          </div>

          <div className="lg:w-[55%] w-full">
            <form onSubmit={handleSubmit} className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                <div className="relative border-b border-gray-300 focus-within:border-black transition-colors duration-300 py-2">
                  <label className="block text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">First Name *</label>
                  <input
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-transparent border-none focus:ring-0 text-black p-0 py-1 text-lg"
                  />
                </div>
                <div className="relative border-b border-gray-300 focus-within:border-black transition-colors duration-300 py-2">
                  <label className="block text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">Last Name *</label>
                  <input
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    className="w-full bg-transparent border-none focus:ring-0 text-black p-0 py-1 text-lg"
                  />
                </div>
              </div>
              <div className="relative border-b border-gray-300 focus-within:border-black transition-colors duration-300 py-2">
                <label className="block text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">Email *</label>
                <input
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  type="email"
                  className="w-full bg-transparent border-none focus:ring-0 text-black p-0 py-1 text-lg"
                />
              </div>
              <div className="relative border-b border-gray-300 focus-within:border-black transition-colors duration-300 py-2">
                <label className="block text-[11px] text-gray-500 uppercase tracking-[0.2em] font-bold mb-2">Phone</label>
                <div className="flex items-center gap-4">
                  <span className="text-xl grayscale opacity-70">🌐</span>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-transparent border-none focus:ring-0 text-black p-0 py-1 text-lg placeholder:text-gray-200"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 group cursor-pointer">
                <input
                  id="consent"
                  type="checkbox"
                  name="contactConsent"
                  checked={formData.contactConsent}
                  onChange={handleChange}
                  className="w-5 h-5 rounded-none border-gray-300 text-[#D90416] focus:ring-[#D90416] cursor-pointer"
                />
                <label htmlFor="consent" className="text-gray-400 text-sm italic font-light cursor-pointer group-hover:text-gray-600 transition-colors">
                  Yes, contact me
                </label>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D90416] hover:bg-black text-white px-12 py-5 rounded-full font-bold uppercase tracking-[0.2em] text-[12px] transition-all duration-500 shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Contact Me'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="w-full px-6 md:px-24 py-8 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Bordered Feature Grid */}
          <div className="border border-gray-200 grid grid-cols-1 md:grid-cols-3 md:divide-x divide-gray-200">

            {/* Feature 1 */}
            <div className="p-12 flex flex-col items-start gap-5">
              <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
              <h3 className="text-xl md:text-2xl font-bold text-black">Luxury Community</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                Connect with fellow luxury dealers, share experiences, and make connections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-12 flex flex-col items-start gap-5">
              <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
              <h3 className="text-xl md:text-2xl font-bold text-black">Networking Events</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                Participate in extravagant networking events, where you can build valuable connections within the luxury industry.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-12 flex flex-col items-start gap-5">
              <div className="w-2.5 h-2.5 rounded-full bg-black"></div>
              <h3 className="text-xl md:text-2xl font-bold text-black">Exclusive Galas</h3>
              <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base">
                Experience luxury at its finest through our exclusive galas and events, designed to elevate your lifestyle.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Seller;
