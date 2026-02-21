'use client';

import React from 'react';
import { Outfit, Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    return (
        <div className={`${outfit.variable} ${inter.variable} font-sans min-h-screen bg-slate-50`}>
            <main className="w-full">
                {children}
            </main>
        </div>
    );
}
