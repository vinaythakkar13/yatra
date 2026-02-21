'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Camera,
    User,
    CheckCircle2,
    Clock,
    Calendar,
    Users,
    X,
    Bell,
    Moon,
    UserPlus,
    MoreHorizontal
} from 'lucide-react';
import { userStorage } from '@/utils/storage';
import LogoutIcon from '@/components/ui/svg/LogoutIcon';

// Dummy data for the initial implementation
const DUMMY_EVENT = {
    name: "Chardham Yatra 2026",
    dateRange: "May 15 - June 01",
    totalGuests: 250,
    checkedIn: 142
};

const DUMMY_GUESTS = [
    { id: '1', pnr: 'PNR789234', name: 'Alok Sharma', status: 'checked_in', initials: 'AS', avatarColor: 'bg-blue-50 text-blue-600' },
    { id: '2', pnr: 'PNR123456', name: 'Rajesh Kumar', status: 'pending', initials: 'RK', avatarColor: 'bg-slate-100 text-slate-600' },
    { id: '3', pnr: 'PNR456789', name: 'Suresh Patel', status: 'pending', initials: 'SP', avatarColor: 'bg-slate-900 text-white' },
    { id: '4', pnr: 'PNR334455', name: 'Meera Iyer', status: 'checked_in', initials: 'MI', avatarColor: 'bg-blue-50 text-blue-600' },
    { id: '5', pnr: 'PNR102938', name: 'Vikram Singh', status: 'checked_in', initials: 'VS', avatarColor: 'bg-blue-50 text-blue-600' },
    { id: '6', pnr: 'PNR556677', name: 'Anita Desai', status: 'pending', initials: 'AD', avatarColor: 'bg-slate-100 text-slate-600' },
    { id: '7', pnr: 'PNR882233', name: 'Rohan Mehta', status: 'checked_in', initials: 'RM', avatarColor: 'bg-blue-50 text-blue-600' },
    { id: '8', pnr: 'PNR190011', name: 'Sita Ram', status: 'checked_in', initials: 'SR', avatarColor: 'bg-blue-50 text-blue-600' },
    { id: '9', pnr: 'PNR221144', name: 'Priya Verma', status: 'pending', initials: 'PV', avatarColor: 'bg-slate-100 text-slate-600' },
];

export default function HotelBookings() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'arrived'>('all');
    const [hotelUser, setHotelUser] = useState<any>(null);

    useEffect(() => {
        const user = userStorage.getUser();
        if (!user) {
            router.push('/hotel/login');
        }
        setHotelUser(user);
    }, [router]);

    const filteredGuests = DUMMY_GUESTS.filter(guest => {
        const matchesSearch = guest.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.name.toLowerCase().includes(searchTerm.toLowerCase());

        const rtkStatus = guest.status === 'checked_in' ? 'arrived' : 'pending';
        const matchesFilter = activeFilter === 'all' || rtkStatus === activeFilter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center flex-1">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#0F4C5C] rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            G
                        </div>
                        <span className="font-bold text-slate-800 text-lg hidden sm:block">Ganga View Grand</span>
                    </div>

                    <div className="relative flex-1 max-w-2xl px-4">
                        <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search guests..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#F1F5F9] border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-[#0F4C5C]/20 transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* add logout button with red variant */}
                    <button
                        aria-label="Logout"
                        className="bg-red-500/10 text-red-500 w-10 h-10 rounded-full flex items-center justify-center" >
                        <LogoutIcon fill="currentColor" size={24} />
                    </button>
                </div>
            </header >

            <main className="flex-1 p-6 space-y-6">
                {/* Control Bar (Teal Banner) */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="relative overflow-hidden bg-gradient-to-br from-[#0F4C5C] via-[#0D4452] to-[#083B4C] rounded-2xl p-4 sm:p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 shadow-xl shadow-[#0F4C5C]/20"
                >
                    {/* Decorative elements for premium feel */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-40 h-40 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 w-full md:w-auto text-center md:text-left relative z-10">
                        <div className="space-y-0.5 sm:space-y-1">
                            <h2 className="text-lg sm:text-2xl font-black tracking-tight drop-shadow-sm">Chardham Yatra 2026</h2>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl flex items-center gap-2 text-xs sm:text-sm border border-white/10 shadow-inner">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/60" />
                            <span className="font-semibold text-white/90">{DUMMY_EVENT.dateRange}</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto relative z-10">
                        <div className="flex items-center justify-center gap-10 w-full sm:w-auto py-4 sm:py-0 border-y sm:border-y-0 sm:border-l border-white/10 sm:pl-8">
                            <div className="text-center space-y-0.5 sm:space-y-1">
                                <p className="text-[9px] sm:text-[10px] font-bold text-white/40 tracking-widest uppercase">Total Guests</p>
                                <p className="text-xl sm:text-3xl font-black tabular-nums">{DUMMY_EVENT.totalGuests}</p>
                            </div>
                            <div className="text-center space-y-0.5 sm:space-y-1">
                                <p className="text-[9px] sm:text-[10px] font-bold text-white/40 tracking-widest uppercase">Checked In</p>
                                <p className="text-xl sm:text-3xl font-black tabular-nums text-[#4ADE80] drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">{DUMMY_EVENT.checkedIn}</p>
                            </div>
                        </div>

                        {/* Segmented Filter */}
                        <div className="bg-black/20 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl flex w-full sm:w-auto gap-1 border border-white/5 shadow-2xl">
                            {(['all', 'pending', 'arrived'] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black transition-all uppercase tracking-widest ${activeFilter === filter
                                        ? 'bg-white text-[#0F4C5C] shadow-lg scale-[1.02] translate-y-[-1px]'
                                        : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                                        }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Guest Manifest Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">GUEST MANIFEST</h3>
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                            Showing {filteredGuests.length} of {DUMMY_EVENT.totalGuests}
                            <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-slate-600 transition-colors" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {filteredGuests.map((guest, index) => (
                            <motion.div
                                key={guest.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03 }}
                                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group flex flex-col justify-between gap-6"
                                onClick={() => router.push(`/hotel/verification/${guest.pnr}`)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${guest.avatarColor}`}>
                                            {guest.initials}
                                        </div>
                                        <div className="space-y-0.5">
                                            <h4 className="font-bold text-slate-800 group-hover:text-[#0F4C5C] transition-colors">{guest.name}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 tracking-wider">#{guest.pnr}</p>
                                        </div>
                                    </div>
                                    <div className={`mt-1 p-1 rounded-full ${guest.status === 'checked_in' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                                        {guest.status === 'checked_in' ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${guest.status === 'checked_in' ? 'text-[#34D399]' : 'text-orange-400'}`}>
                                        {guest.status === 'checked_in' ? 'CHECKED IN' : 'PENDING'}
                                    </span>
                                    <span className="text-slate-200 flex items-center">
                                        <div className="w-4 h-[2px] bg-slate-100 rounded-full"></div>
                                        <div className="w-2 h-[2px] bg-slate-100 rounded-full ml-1"></div>
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>

            {/* Floating Action Button */}
            <motion.button
                whileHover={{ scale: 1.1, translateY: -4 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push('/hotel/scanner')}
                className="fixed bottom-8 right-8 w-16 h-16 bg-[#0F4C5C] text-white rounded-full shadow-2xl flex items-center justify-center z-50 group overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <Camera className="w-8 h-8 relative z-10" />
            </motion.button>
        </div >
    );
}
