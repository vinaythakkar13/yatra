'use client';

import React from 'react';
import { Outfit, Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HotelSidebar from '@/components/layout/HotelSidebar';
import { usePathname } from 'next/navigation';

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export default function HotelLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/hotel/login';

    return (
        <div className={`${outfit.variable} ${inter.variable} font-sans min-h-screen bg-slate-50 flex`}>
            {!isLoginPage && <HotelSidebar />}
            <main className={`flex-1 w-full ${!isLoginPage ? 'lg:ml-20' : ''}`}>
                {children}
            </main>
        </div>
    );
}
