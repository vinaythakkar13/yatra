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
import { toast } from 'react-toastify';
import { useGetRoomAllottedDataQuery, RoomAllottedData } from '@/services/hotelApi';

// Dummy data for the event info (until API provides it)
const DUMMY_EVENT = {
    name: "Chardham Yatra 2026",
    dateRange: "May 15 - June 01",
};

interface GuestCardProps {
    guest: RoomAllottedData;
    index: number;
    isSelected: boolean;
    isSelectionMode: boolean;
    onToggleSelect: (id: string) => void;
}

export default function HotelBookings() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'arrived'>('all');
    const [hotelUser, setHotelUser] = useState<any>(null); // TODO: Replace any with proper user type
    const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const { data: guests = [], isLoading, error } = useGetRoomAllottedDataQuery();

    useEffect(() => {
        const user = userStorage.getUser();
        if (!user) {
            router.push('/hotel/login');
        }
        setHotelUser(user);
    }, [router]);

    const filteredGuests = guests.filter((guest: RoomAllottedData) => {
        const matchesSearch = guest.pnr.toLowerCase().includes(searchTerm.toLowerCase()) ||
            guest.name.toLowerCase().includes(searchTerm.toLowerCase());

        // For now status is simulated as arrived if there are assigned rooms, otherwise pending
        // Real status should come from registration_status or similar if needed
        const status = guest.assigned_rooms.length > 0 ? 'arrived' : 'pending';
        const matchesFilter = activeFilter === 'all' || status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const toggleGuestSelection = (id: string) => {
        setSelectedGuests(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkCheckIn = () => {
        // Simulation: Update status in local storage or state
        toast.success(`Successfully checked in ${selectedGuests.length} guests!`);
        setSelectedGuests([]);
        setIsSelectionMode(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#0F4C5C]/20 border-t-[#0F4C5C] rounded-full animate-spin"></div>
                    <p className="font-bold text-slate-500">Loading guests...</p>
                </div>
            </div>
        );
    }

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
                    <button
                        onClick={() => setIsSelectionMode(!isSelectionMode)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${isSelectionMode
                            ? 'bg-[#0F4C5C] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {isSelectionMode ? 'Cancel Selection' : 'Bulk Select'}
                    </button>
                    <button
                        onClick={() => {
                            userStorage.removeUser();
                            localStorage.clear();
                            router.push('/hotel/login');
                        }}
                        aria-label="Logout"
                        className="bg-red-500/10 text-red-500 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-red-500/20" >
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
                                <p className="text-[9px] sm:text-[10px] font-bold text-white/40 tracking-widest uppercase">Total Registered</p>
                                <p className="text-xl sm:text-3xl font-black tabular-nums">{guests.length}</p>
                            </div>
                            <div className="text-center space-y-0.5 sm:space-y-1">
                                <p className="text-[9px] sm:text-[10px] font-bold text-white/40 tracking-widest uppercase">Arrived</p>
                                <p className="text-xl sm:text-3xl font-black tabular-nums text-[#4ADE80] drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]">
                                    {guests.filter((g: RoomAllottedData) => g.assigned_rooms.length > 0).length}
                                </p>
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
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xxl:grid-cols-5 gap-6">
                        {filteredGuests.map((guest: RoomAllottedData, index: number) => (
                            <GuestCard
                                key={guest.registration_id}
                                guest={guest}
                                index={index}
                                isSelected={selectedGuests.includes(guest.registration_id)}
                                isSelectionMode={isSelectionMode}
                                onToggleSelect={toggleGuestSelection}
                            />
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

            {/* Floating Bulk Action Bar */}
            <AnimatePresence>
                {isSelectionMode && selectedGuests.length > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60] bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 flex items-center gap-6 min-w-[300px]"
                    >
                        <div className="px-4 py-2 bg-slate-100 rounded-xl">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                                {selectedGuests.length} Guests Selected
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setSelectedGuests([])}
                                className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={handleBulkCheckIn}
                                className="px-6 py-2 bg-[#0F4C5C] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-[#0F4C5C]/20"
                            >
                                Bulk Check-in
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function GuestCard({ guest, index, isSelected, isSelectionMode, onToggleSelect }: GuestCardProps) {
    const initials = guest.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    const hasRooms = guest.assigned_rooms.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => isSelectionMode && onToggleSelect(guest.registration_id)}
            className={`relative bg-white rounded-2xl p-5 border transition-all duration-300 group flex flex-col gap-6 shadow-sm overflow-hidden ${isSelected
                ? 'border-[#0F4C5C] ring-2 ring-[#0F4C5C]/10 shadow-lg'
                : 'border-slate-100 hover:border-[#0F4C5C]/30 hover:shadow-md'
                } ${isSelectionMode ? 'cursor-pointer' : ''}`}
        >
            {/* Selection Overlay */}
            {isSelectionMode && (
                <div className={`absolute top-4 right-4 w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${isSelected ? 'bg-[#0F4C5C] border-[#0F4C5C]' : 'border-slate-200 bg-white'
                    }`}>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
            )}

            <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shadow-inner transition-colors ${hasRooms ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                        {initials}
                    </div>
                    <div className="space-y-1">
                        <h4 className="font-black text-slate-800 tracking-tight leading-none group-hover:text-[#0F4C5C] transition-colors">
                            {guest.name}
                        </h4>
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">#{guest.pnr}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{guest.number_of_traveller} PAXS</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.15em]">Assigned Rooms</span>
                        <div className="flex flex-wrap gap-1.5">
                            {hasRooms ? (
                                guest.assigned_rooms.map((room, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded-lg uppercase tracking-tighter">
                                        R-{room.room_number} <span className="mx-1 text-white/30">|</span> F-{room.floor}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] font-bold text-orange-400/80 italic">Not Assigned</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${hasRooms ? 'bg-green-400 animate-pulse' : 'bg-orange-400'}`}></div>
                        <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${hasRooms ? 'text-green-500' : 'text-orange-400'}`}>
                            {hasRooms ? 'ARRIVED' : 'PENDING'}
                        </span>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-slate-300 hover:text-slate-500 transition-colors cursor-pointer" />
                </div>
            </div>

            {/* Subtle background pattern for sacred feel */}
            <div className="absolute -bottom-6 -right-6 w-16 h-16 opacity-[0.03] pointer-events-none">
                <svg viewBox="0 0 100 100" fill="currentColor">
                    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="2" fill="none" />
                    <circle cx=" 50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
            </div>
        </motion.div>
    );
}
