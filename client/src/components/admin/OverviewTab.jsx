import React from 'react';
import { FiDollarSign, FiUsers, FiShoppingBag } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import numberWithCommas from '../../modules/numberwithcomma';

const KPICard = ({ title, value, growth, icon: Icon, colorClass, iconColorClass }) => (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-[4rem] opacity-5 transition-transform group-hover:scale-110 ${colorClass}`}></div>
        <div className="flex justify-between items-start mb-6 z-10 relative">
            <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 canela">{value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColorClass}`}>
                <Icon className="text-xl" />
            </div>
        </div>
        <div className="flex items-center gap-2 z-10 relative">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${growth.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {growth}
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">vs last month</span>
        </div>
    </div>
);

const OverviewTab = ({ stats, analyticsData }) => {
    if (!stats) return null;

    return (
        <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                    title="Total Revenue"
                    value={`$${numberWithCommas(stats.revenue)}`}
                    growth={`+${stats.revenueGrowth}%`}
                    icon={FiDollarSign}
                    colorClass="bg-emerald-500"
                    iconColorClass="bg-emerald-50 text-emerald-600"
                />
                <KPICard
                    title="Total Users"
                    value={numberWithCommas(stats.totalUsers)}
                    growth="--"
                    icon={FiUsers}
                    colorClass="bg-blue-500"
                    iconColorClass="bg-blue-50 text-blue-600"
                />
                <KPICard
                    title="Partner Stores"
                    value={stats.partnerStores}
                    growth="--"
                    icon={FiShoppingBag}
                    colorClass="bg-purple-500"
                    iconColorClass="bg-purple-50 text-purple-600"
                />
                <KPICard
                    title="Active Users"
                    value={stats.activeUsers}
                    growth="Real-time"
                    icon={FiUsers}
                    colorClass="bg-[#D48D2A]"
                    iconColorClass="bg-[#FFF4E5] text-[#D48D2A]"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-4 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 canela">Revenue Analytics</h3>
                    <div className="h-64 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={analyticsData?.monthlyRevenue || []}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D48D2A" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D48D2A" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fontWeight: 700, fill: '#9ca3af'}}
                                    tickFormatter={(value) => `$${value}`}
                                />
                                <Tooltip 
                                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                                    formatter={(value) => [`$${numberWithCommas(value)}`, 'Revenue']}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="value" 
                                    stroke="#D48D2A" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorValue)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-8 self-start canela">Platform Wallet</h3>
                    <div className="bg-gray-900 p-6 rounded-[2rem] mb-6 shadow-xl shadow-gray-200 dark:bg-[#242428] dark:shadow-black/40">
                        <div className="w-32 h-32 bg-white dark:!bg-white rounded-xl flex items-center justify-center p-2">
                            {/* QR Placeholder */}
                            <div className="w-full h-full border-4 border-black border-dashed opacity-20 bg-[url('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OtuliaPlatform')] bg-cover"></div>
                        </div>
                    </div>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Scan to receive payments</p>
                    <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg hover:shadow-xl dark:bg-white dark:text-[#0e0e0f] dark:hover:bg-gray-200">
                        Download QR Code
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OverviewTab;
