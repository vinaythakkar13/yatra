'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Calendar,
    Camera,
    LayoutGrid,
    Menu,
    X,
    LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { userStorage } from '@/utils/storage';
import { useRouter } from 'next/navigation';

const navItems = [
    { name: 'Bookings', href: '/hotel/bookings', icon: Calendar },
    { name: 'Scanner', href: '/hotel/scanner', icon: Camera },
];

export default function HotelSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        userStorage.removeUser();
        localStorage.clear();
        router.push('/hotel/login');
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-[100] p-2 bg-[#0F4C5C] text-white rounded-lg shadow-lg"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar Container */}
            <aside
                className={`fixed top-0 left-0 h-full bg-[#0F4C5C] text-white z-[90] transition-all duration-300 ease-in-out flex flex-col
                    ${isOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20 lg:hover:w-64'}
                `}
                onMouseEnter={() => !isOpen && setIsOpen(false)} // This is just for structural consistency
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-[#0F4C5C] font-black shrink-0">
                        G
                    </div>
                    <span className={`font-black tracking-tighter text-xl whitespace-nowrap overflow-hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
                        YATRA GUEST
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-4 px-6 py-4 transition-all group relative
                                    ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-[#4ADE80]"
                                    />
                                )}
                                <Icon className={`w-6 h-6 shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className={`font-bold transition-opacity duration-300 whitespace-nowrap ${isOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-2 py-4 text-white/60 hover:text-red-400 transition-colors group"
                    >
                        <LogOut className="w-6 h-6 shrink-0" />
                        <span className={`font-bold opacity-0 transition-opacity duration-300 whitespace-nowrap ${isOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[85]"
                    />
                )}
            </AnimatePresence>
        </>
    );
}
