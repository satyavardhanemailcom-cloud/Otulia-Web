import React from 'react';
import Navbar from '../components/Navbar';

import { FiUsers, FiStar, FiCalendar, FiShield, FiArrowRight, FiMessageSquare, FiGlobe } from 'react-icons/fi';
import CommunityHeroImg from '../assets/community_hero.png';

const Community = () => {
  const pillars = [
    {
      icon: FiUsers,
      title: "Elite Networking",
      desc: "Connect with high-net-worth individuals, collectors, and luxury enthusiasts worldwide."
    },
    {
      icon: FiStar,
      title: "Exclusive Perks",
      desc: "Early access to rare listings, priority viewings, and invitation-only club benefits."
    },
    {
      icon: FiGlobe,
      title: "Global Reach",
      desc: "Our community spans across continents, bringing you insights from the world's most vibrant markets."
    }
  ];

  const upcomingEvents = [
    {
      date: "OCT 15",
      title: "Monaco Yacht Show Reception",
      location: "Port Hercule, Monaco",
      category: "Gala"
    },
    {
      date: "NOV 02",
      title: "Vintage Car Concours",
      location: "Pebble Beach, CA",
      category: "Exhibition"
    },
    {
      date: "DEC 10",
      title: "Luxury Real Estate Summit",
      location: "Dubai, UAE",
      category: "Conference"
    }
  ];

  const insights = [
    {
      title: "The Future of Sustainable Supercars",
      author: "Julian Vance",
      time: "5 min read",
      image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Investing in Classic Watch Collections",
      author: "Sarah Chen",
      time: "8 min read",
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800"
    },
    {
      title: "Modern Minimalist Estate Trends",
      author: "Marcus Thorne",
      time: "6 min read",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={CommunityHeroImg}
            alt="Join the Community"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <span className="inline-block px-4 py-1 border border-white/30 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] mb-6 shadow-sm">
            The Inner Circle
          </span>
          <h1 className="text-5xl md:text-7xl font-bold playfair-display mb-6 leading-tight">
            Experience Luxury <br /> <span className="text-[#D90416]">Beyond Ownership</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Join a global network of visionaries and elite collectors. Otulia Community is where passion meets prestige.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#D90416] text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-white hover:text-black transition-all duration-300">
              Apply for Membership
            </button>
            <button className="bg-transparent border border-white text-white px-8 py-4 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-white/10 transition-all duration-300">
              Explore Perks
            </button>
          </div>
        </div>
      </section>

      {/* WHY JOIN SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-[#D90416] uppercase tracking-[0.4em] mb-4">Values</h2>
          <h3 className="text-3xl md:text-5xl font-bold playfair-display text-gray-900">Built on Trust and Excellence</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="group p-8 border border-gray-100 rounded-3xl hover:border-black transition-all duration-500 hover:shadow-2xl">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-black text-2xl mb-8 group-hover:bg-black group-hover:text-white transition-colors">
                <pillar.icon />
              </div>
              <h4 className="text-xl font-bold mb-4">{pillar.title}</h4>
              <p className="text-gray-500 leading-relaxed font-light">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-xs font-bold text-[#D90416] uppercase tracking-[0.4em] mb-4">Calendar</h2>
              <h3 className="text-3xl md:text-5xl font-bold playfair-display text-gray-900">Upcoming Gatherings</h3>
            </div>
            <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest hover:text-[#D90416] transition-colors">
              View Full Schedule <FiArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 flex flex-col justify-between h-[300px] hover:translate-y-[-10px] transition-transform duration-500 shadow-sm hover:shadow-xl group">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-black text-white p-3 rounded-2xl text-center min-w-[60px]">
                      <p className="text-[10px] font-bold opacity-60 uppercase">{event.date.split(' ')[0]}</p>
                      <p className="text-xl font-bold">{event.date.split(' ')[1]}</p>
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D90416] py-1 px-3 bg-[#D90416]/5 rounded-full">{event.category}</span>
                  </div>
                  <h4 className="text-xl font-bold pr-10">{event.title}</h4>
                  <p className="text-gray-400 mt-2 text-sm italic">{event.location}</p>
                </div>
                <button className="mt-8 flex items-center gap-2 text-xs font-bold uppercase tracking-widest group-hover:underline">
                  RSVP Interest
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY VOICES (INSIGHTS) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-xs font-bold text-[#D90416] uppercase tracking-[0.4em] mb-4">Insights</h2>
          <h3 className="text-3xl md:text-5xl font-bold playfair-display text-gray-900">Curated Wisdom</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {insights.map((article, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-[16/10] overflow-hidden rounded-3xl mb-6 relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
              </div>
              <h4 className="text-xl font-bold mb-3 hover:text-[#D90416] transition-colors">{article.title}</h4>
              <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                <span>{article.author}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span>{article.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* JOIN THE CONVERSATION - CTA */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-black rounded-[4rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D90416]/20 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <h3 className="text-3xl md:text-6xl font-bold playfair-display mb-8">Join the Conversation</h3>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Apply now for exclusive access to our community portal, discussion forums, and member-only events.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your elite email"
                className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-gray-500 outline-none focus:border-[#D90416] transition-colors"
              />
              <button className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#D90416] hover:text-white transition-all">
                Request Invite
              </button>
            </form>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Community;
