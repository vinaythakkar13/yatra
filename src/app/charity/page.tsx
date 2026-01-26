'use client';

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Langar1 from '../../assets/images/activites/langar_1.jpeg';
import Langar2 from '../../assets/images/activites/langar_2.jpeg';
import {
    Heart,
    Leaf,
    HandHeart,
    Utensils,
    Soup,
    Wheat,
    Sprout,
    CreditCard,
    Building2,
    QrCode,
    ArrowRight,
    ChevronRight
} from 'lucide-react';
import Container from '@/spiritual/components/common/Container';
import Button from '@/spiritual/components/common/Button';
import qrCode from '@/assets/images/UPI_QR.jpeg'
import GooglePayIcon from '@/spiritual/components/icons/GooglePayIcon';
import PhonePeIcon from '@/spiritual/components/icons/PhonePeIcon';
import PaytmIcon from '@/spiritual/components/icons/PaytmIcon';

export default function CharityPage() {
    const donationLevels = [
        {
            title: "1 DAY LANGAR SEWA",
            price: "₹26,000",
            description: "Provide full-day meals to everyone visiting the Darbar.",
            icon: <Utensils className="w-8 h-8 text-spiritual-zen-forest" />,
            image: Langar1,
            tag: "Most Impactful"
        },
        {
            title: "1 TIME LANGAR SEWA",
            price: "₹19,000",
            description: "Sponsor a one-time nutritious meal for thousands.",
            icon: <Soup className="w-8 h-8 text-spiritual-zen-forest" />,
            image: Langar2,
        },
        {
            title: "RICE SEWA",
            price: "₹13,000 / ₹7,100",
            description: "Contribution towards essential rice supply for Langar.",
            icon: <Sprout className="w-8 h-8 text-spiritual-zen-forest" />,
            image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80",
        },
        {
            title: "VEGETABLES SEWA",
            price: "₹5,100 / ₹3,100",
            description: "Support the daily requirement of fresh vegetables.",
            icon: <Leaf className="w-8 h-8 text-spiritual-zen-forest" />,
            image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&q=80",
        },
        {
            title: "WHEAT SEWA",
            price: "₹1,300",
            description: "Provide wheat for making fresh rotis in the kitchen.",
            icon: <Wheat className="w-8 h-8 text-spiritual-zen-forest" />,
            image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
        },
    ];

    const smallContributions = [
        { amount: "₹500", label: "Contribute" },
        { amount: "₹350", label: "Contribute" },
        { amount: "₹200", label: "Contribute" },
        { amount: "₹100", label: "Contribute" },
    ];

    const openUPIPayment = (amount: string, note: string) => {
        // Extract numeric value from "₹26,000 / ₹7,100"
        const numericAmount = amount
            .replace(/[₹,\s]/g, '')
            .split('/')[0];

        const upiId = '7083191919@okbizaxis'; // 🔴 replace with trust UPI ID
        const payeeName = 'Dhan Guru Nanak Shah Trust';

        const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(
            payeeName
        )}&am=${numericAmount}&cu=INR&tn=${encodeURIComponent(note)}`;

        window.location.href = upiUrl;
    };


    return (
        <div className="min-h-screen bg-spiritual-zen-surface">
            {/* Hero Section */}
            <section className="relative py-12 md:py-20 lg:py-48 overflow-hidden text-white">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80"
                        alt="Charity and Kindness"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-spiritual-zen-charcoal/75 via-spiritual-zen-charcoal/60 to-spiritual-zen-charcoal/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-spiritual-zen-surface via-transparent to-transparent opacity-70" />
                </div>

                {/* Animated decorative elements */}
                <div className="absolute top-10 right-10 w-20 h-20 bg-spiritual-zen-accent/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute bottom-20 left-10 w-32 h-32 bg-spiritual-zen-forest/10 rounded-full blur-3xl animate-pulse" />

                <Container className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-6 md:space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/10 border border-spiritual-zen-accent/40 text-white font-bold text-xs md:text-sm tracking-widest uppercase backdrop-blur-md hover:bg-white/15 transition-all duration-300">
                            <Heart className="w-4 h-4 text-spiritual-zen-accent animate-pulse" />
                            <span>Spread Kindness & Compassion</span>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-tight drop-shadow-2xl">
                                Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-spiritual-zen-accent to-spiritual-saffron italic">Small Contribution</span> Can Bring Joy to Those in Need
                            </h1>
                            <p className="text-base sm:text-lg md:text-xl text-white/95 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-inter px-4">
                                Every act of kindness creates a ripple of hope. Join the Dhan Guru Nanak Shah Trust in our sacred mission to nourish millions and uplift the underserved communities.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 pt-6 md:pt-8 px-4">
                            <Button
                                variant="primary"
                                className="bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-accent text-white px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-lg hover:shadow-2xl transition-all duration-300 shadow-xl transform hover:scale-105 border-none w-full sm:w-auto"
                                onClick={() => document.getElementById('donation-plans')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Donate Now
                                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                                </span>
                            </Button>
                            <Button
                                variant="outline"
                                className="border-2 border-white text-white px-6 sm:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-lg hover:bg-white/15 transition-all duration-300 backdrop-blur-sm transform hover:scale-105 shadow-lg w-full sm:w-auto"
                                onClick={() => document.getElementById('payment-info')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Payment Methods
                                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                                </span>
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Donation Plans Grid */}
            <section id="donation-plans" className="py-16 md:py-24 bg-gradient-to-b from-white via-spiritual-zen-surface/30 to-white">
                <Container>
                    <div className="text-center space-y-3 md:space-y-4 mb-12 md:mb-20">
                        <div className="inline-flex items-center gap-2 mb-4">
                            <div className="h-1 w-6 md:w-8 bg-gradient-to-r from-spiritual-zen-forest to-spiritual-saffron rounded-full" />
                            <span className="text-spiritual-zen-forest font-bold uppercase tracking-widest text-xs md:text-sm">
                                Ways to Serve
                            </span>
                            <div className="h-1 w-6 md:w-8 bg-gradient-to-r from-spiritual-saffron to-spiritual-zen-forest rounded-full" />
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-spiritual-zen-charcoal">
                            Choose Your Impact
                        </h2>
                        <p className="text-sm md:text-base text-spiritual-textLight max-w-2xl mx-auto leading-relaxed">
                            Select a sewa program that resonates with your heart. Every contribution, no matter the size, creates meaningful change in our community.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {donationLevels.map((level, index) => (
                            <div
                                key={index}
                                onClick={() => openUPIPayment(level.price, level.title)}
                                className={`group relative rounded-2xl md:rounded-3xl overflow-hidden border border-spiritual-zen-highlight/60 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:shadow-2xl hover:border-spiritual-zen-accent/50 hover:-translate-y-2 flex flex-col cursor-pointer ${level.tag ? 'ring-2 ring-offset-2 ring-spiritual-zen-accent/60' : ''}`}
                            >
                                {/* Card Image Area */}
                                <div className="h-40 md:h-48 overflow-hidden relative">
                                    <Image
                                        src={(level as any).image}
                                        alt={level.title}
                                        width={800}
                                        height={600}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                                    <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-white/25 backdrop-blur-md border border-white/40 group-hover:bg-white/40 transition-all">
                                            {React.cloneElement(level.icon as React.ReactElement<any>, { className: "w-5 h-5 md:w-6 md:h-6 text-white" })}
                                        </div>
                                        <h3 className="text-base md:text-lg font-bold text-white leading-tight line-clamp-2">{level.title}</h3>
                                    </div>
                                    {level.tag && (
                                        <span className="absolute top-4 right-4 px-3 py-1.5 bg-gradient-to-r from-spiritual-zen-accent to-spiritual-saffron text-white text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest shadow-lg transform group-hover:scale-110 transition-transform">
                                            ⭐ {level.tag}
                                        </span>
                                    )}
                                </div>

                                <div className="p-6 md:p-8 flex flex-col flex-grow">
                                    <p className="text-spiritual-textLight mb-6 md:mb-8 flex-grow font-inter text-xs md:text-sm leading-relaxed">{level.description}</p>
                                    <div className="mt-auto pt-6 border-t border-spiritual-zen-highlight/40 flex items-center justify-between">
                                        <div>
                                            <p className="text-[9px] md:text-[10px] uppercase tracking-widest text-spiritual-textLighter font-bold mb-1">Impact Price</p>
                                            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-accent bg-clip-text text-transparent">{level.price}</span>
                                        </div>
                                        <Button className="rounded-full !p-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-accent text-white hover:shadow-lg transition-all duration-300 shadow-md border-none group-hover:scale-110 transform">
                                            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Small Contributions Card */}
                        <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-gradient-to-br from-spiritual-zen-forest to-spiritual-zen-charcoal text-white flex flex-col justify-between shadow-xl hover:shadow-2xl relative overflow-hidden group transition-all duration-500 hover:-translate-y-2 border border-spiritual-zen-forest/50">
                            <div className="absolute top-0 right-0 w-40 h-40 md:w-48 md:h-48 bg-white/10 rounded-full -mr-20 -mt-20 md:-mr-24 md:-mt-24 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-spiritual-saffron/10 rounded-full -ml-16 -mb-16 blur-2xl" />

                            <div className="relative z-10">
                                <div className="p-3 md:p-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 inline-block mb-5 md:mb-6 group-hover:bg-white/30 transition-all">
                                    <HandHeart className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                </div>
                                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 font-display">Langar Sewa</h3>
                                <p className="text-white/80 mb-6 md:mb-8 font-inter text-xs md:text-sm leading-relaxed">Even a small gift brings warmth. Help us reach one more person today.</p>
                                <div className="grid grid-cols-2 gap-2 md:gap-3">
                                    {smallContributions.map((cont, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => openUPIPayment(cont.amount, 'Langar Sewa - small contribution')}
                                            className="py-2.5 md:py-3 px-3 md:px-4 rounded-lg md:rounded-xl border border-white/40 hover:bg-white hover:text-spiritual-zen-forest font-bold transition-all duration-300 text-center text-xs md:text-sm shadow-sm hover:shadow-lg transform hover:scale-105"
                                        >
                                            {cont.amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Payment Information */}
            <section id="payment-info" className="py-12 md:py-20 bg-white">
                <Container>
                    {/* Section Header */}
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-spiritual-zen-charcoal mb-2">Payment Details</h2>
                        <p className="text-sm text-spiritual-textLight">Choose your preferred method to contribute</p>
                    </div>

                    <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6 md:gap-8">
                        {/* Bank Transfer Card */}
                        <div className="bg-white rounded-xl border border-spiritual-zen-highlight/50 overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-accent p-4 md:p-5">
                                <div className="flex items-center gap-3">
                                    <Building2 className="w-5 h-5 text-white" />
                                    <h3 className="text-lg md:text-xl font-bold text-white">Bank Transfer</h3>
                                </div>
                                <p className="text-xs text-white/80 mt-1">Direct transfer to our trust account</p>
                            </div>

                            {/* Bank Details - Compact Layout */}
                            <div className="p-4 md:p-6 space-y-4">
                                {/* Account Name */}
                                <div className="pb-3 border-b border-spiritual-zen-highlight/30">
                                    <p className="text-[10px] uppercase tracking-wider text-spiritual-textLighter font-semibold mb-1">Account Name</p>
                                    <p className="text-sm md:text-base font-bold text-spiritual-zen-charcoal">Dhan Guru Nanak Shah Trust</p>
                                </div>

                                {/* Account Number & IFSC - Side by Side on Mobile */}
                                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-spiritual-zen-highlight/30">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-spiritual-textLighter font-semibold mb-1">Account No.</p>
                                        <p className="text-sm md:text-base font-bold text-spiritual-zen-charcoal font-mono break-all">920020069624600</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider text-spiritual-textLighter font-semibold mb-1">IFSC Code</p>
                                        <p className="text-sm md:text-base font-bold text-spiritual-zen-charcoal font-mono">UTIB0004255</p>
                                    </div>
                                </div>

                                {/* Bank Branch */}
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider text-spiritual-textLighter font-semibold mb-1">Bank & Branch</p>
                                    <p className="text-sm md:text-base font-semibold text-spiritual-zen-charcoal">Axis Bank, Netaji Branch, Ulhasnagar</p>
                                </div>

                                {/* Payment Logos - Compact */}
                                <div className="pt-3 border-t border-spiritual-zen-highlight/30">
                                    <p className="text-[9px] uppercase tracking-wider text-spiritual-textLighter font-semibold mb-2">Accepted Methods</p>
                                    <div className="flex flex-wrap items-center gap-3 md:gap-4">
                                        {/* Visa */}
                                        <div className="h-5 md:h-6">
                                            <svg viewBox="0 0 512 305.67" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" className="h-full object-contain opacity-60 hover:opacity-100 transition-opacity">
                                                <g fillRule="nonzero">
                                                    <path fill="gray" d="M48.18 0h415.64c13.26 0 25.31 5.42 34.03 14.15C506.58 22.88 512 34.92 512 48.18V257.5c0 13.25-5.42 25.3-14.15 34.03s-20.77 14.15-34.03 14.15H48.18c-13.26 0-25.3-5.42-34.03-14.15S0 270.75 0 257.5V48.18c0-13.26 5.42-25.31 14.15-34.03C22.87 5.42 34.92 0 48.18 0zm415.64 16.6H48.18c-8.68 0-16.57 3.56-22.29 9.29-5.73 5.72-9.28 13.61-9.28 22.29V257.5c0 8.67 3.55 16.56 9.28 22.29 5.72 5.72 13.62 9.28 22.29 9.28h415.64c8.67 0 16.56-3.56 22.29-9.28 5.73-5.73 9.29-13.62 9.29-22.29V48.18c0-8.67-3.56-16.57-9.29-22.29-5.72-5.73-13.62-9.29-22.29-9.29z" />
                                                    <path fill="#1434CB" d="M303.27 102.24c-22.18 0-42 11.49-42 32.73 0 24.35 35.15 26.04 35.15 38.27 0 5.16-5.9 9.77-15.99 9.77-14.31 0-25-6.45-25-6.45L250.85 198s12.32 5.44 28.68 5.44c24.25 0 43.33-12.06 43.33-33.66 0-25.74-35.3-27.37-35.3-38.73 0-4.03 4.85-8.45 14.9-8.45 11.35 0 20.61 4.68 20.61 4.68l4.48-20.7s-10.08-4.34-24.28-4.34zm-202.91 1.56l-.53 3.12s9.33 1.71 17.73 5.12c10.82 3.9 11.59 6.18 13.41 13.24l19.86 76.55h26.62l41.01-98.03H191.9l-26.35 66.65-10.75-56.5c-.99-6.47-5.98-10.15-12.1-10.15H100.36zm128.78 0l-20.83 98.03h25.32l20.76-98.03h-25.25zm141.25 0c-6.11 0-9.35 3.27-11.72 8.98l-37.1 89.05h26.56l5.13-14.85h32.36l3.12 14.85h23.43l-20.44-98.03h-21.34zm3.45 26.48l7.87 36.79h-21.09l13.22-36.79z" />
                                                </g>
                                            </svg>
                                        </div>
                                        {/* Mastercard */}
                                        <div className="h-6 md:h-8">
                                            <svg viewBox="0 0 333333 199007" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" className="h-full object-contain opacity-60 hover:opacity-100 transition-opacity">
                                                <g fillRule="nonzero">
                                                    <path d="M147063 87405c0-14766 6898-27911 17638-36420-7920-6274-17924-10030-28812-10030-25653 0-46450 20797-46450 46449 0 25653 20796 46449 46450 46449 10888 0 20892-3755 28812-10029-10740-8508-17638-21654-17638-36420z" fill="#de2c1d" />
                                                    <path d="M147063 87405c0 14767 6898 27912 17638 36420 10740-8508 17637-21654 17637-36420s-6898-27911-17637-36420c-10740 8508-17638 21654-17638 36420z" fill="#ed6100" />
                                                    <path d="M193513 40955c-10888 0-20892 3756-28811 10030 10740 8508 17637 21654 17637 36420 0 14767-6898 27912-17637 36420 7919 6274 17923 10029 28811 10029 25653 0 46449-20796 46449-46449s-20796-46449-46449-46449z" fill="#f79f06" />
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* UPI Card */}
                        <div className="bg-gradient-to-br from-spiritual-zen-forest to-spiritual-zen-charcoal rounded-xl overflow-hidden text-white">
                            {/* Card Header */}
                            <div className="p-4 md:p-5 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <QrCode className="w-5 h-5 text-white" />
                                    <h3 className="text-lg md:text-xl font-bold">UPI Payment</h3>
                                </div>
                                <p className="text-xs text-white/70 mt-1">Instant donation via UPI apps</p>
                            </div>

                            {/* UPI Content */}
                            <div className="p-4 md:p-6 flex flex-col items-center text-center space-y-4 w-full">
                                {/* QR Code */}
                                <div className="bg-white p-3 rounded-xl">
                                    <Image
                                        src={qrCode}
                                        alt="UPI QR Code"
                                        width={140}
                                        height={140}
                                        className="w-32 h-32 md:w-36 md:h-36"
                                    />
                                </div>

                                {/* Mobile Number */}
                                <div className="space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">UPI Mobile</p>
                                    <p className="text-xl md:text-2xl font-bold tracking-tight">+91 7083 19 19 19</p>
                                </div>

                                {/* UPI Apps */}
                                <div className="pt-2 space-y-2 w-full p-1.5 rounded-lg bg-white/50">
                                    <p className="text-[9px] uppercase tracking-wider text-white/50 font-semibold">Supported Apps</p>
                                    <div className="flex items-center justify-center gap-3">
                                        {/* Google Pay */}
                                        <div className="h-10">
                                            <GooglePayIcon className="h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
                                        </div>
                                        {/* PhonePe */}
                                        <div className="h-7">
                                            <PhonePeIcon className="h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
                                        </div>
                                        {/* Paytm */}
                                        <div className="h-5">
                                            <PaytmIcon className="h-full object-contain opacity-80 hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container >
            </section >

            {/* Legacy/Trust Section */}
            < section className="py-24 bg-spiritual-zen-surface" >
                <Container>
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-spiritual-zen-charcoal uppercase tracking-widest">DHAN GURU NANAK SHAH TRUST</h2>
                        <div className="w-16 h-0.5 bg-spiritual-zen-accent mx-auto opacity-50" />
                        <p className="text-2xl md:text-3xl text-spiritual-textLight leading-relaxed italic font-display px-4">
                            "Your small contribution can get a smile on needy."
                        </p>
                        <div className="pt-4">
                            <p className="text-spiritual-zen-forest font-bold tracking-[0.3em] uppercase text-sm border-b-2 border-spiritual-zen-accent inline-block pb-2">Sant Baba Thahirya Singh Sahib Ji Langer Sewa</p>
                        </div>
                    </div>
                </Container>
            </section >
        </div >
    );
}
