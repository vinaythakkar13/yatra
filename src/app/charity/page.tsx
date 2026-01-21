'use client';

import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
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

export default function CharityPage() {
    const donationLevels = [
        {
            title: "1 DAY LANGAR SEWA",
            price: "₹26,000",
            description: "Provide full-day meals to everyone visiting the Darbar.",
            icon: <Utensils className="w-8 h-8 text-spiritual-zen-forest" />,
            image: "https://images.unsplash.com/photo-1694286068611-d0c24cbc2cd5?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            tag: "Most Impactful"
        },
        {
            title: "1 TIME LANGAR SEWA",
            price: "₹19,000",
            description: "Sponsor a one-time nutritious meal for thousands.",
            icon: <Soup className="w-8 h-8 text-spiritual-zen-forest" />,
            image: "https://images.unsplash.com/photo-1714525287722-71ffa49a1aa3?q=80&w=1567&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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

    return (
        <div className="min-h-screen bg-spiritual-zen-surface">
            {/* Hero Section */}
            <section className="relative py-24 lg:py-44 overflow-hidden text-white">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80"
                        alt="Charity and Kindness"
                        className="w-full h-full object-cover scale-105"
                    />
                    <div className="absolute inset-0 bg-spiritual-zen-charcoal/70 backdrop-blur-[2px]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-spiritual-zen-charcoal/20 via-transparent to-spiritual-zen-surface" />
                </div>

                <Container className="relative z-10">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-spiritual-zen-accent/20 border border-spiritual-zen-accent/30 text-spiritual-zen-mist font-bold text-sm tracking-widest uppercase backdrop-blur-md">
                            <Heart className="w-4 h-4 text-spiritual-zen-accent" />
                            Spread Kindness
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight drop-shadow-2xl">
                            Your <span className="text-spiritual-zen-accent italic">Small Contribution</span> Can Bring a Smile to Those in Need
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed drop-shadow-lg font-inter">
                            Every act of kindness creates a ripple that can change someone's world. Join the Dhan Guru Nanak Shah Trust in our mission to feed millions and support the underserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 pt-4">
                            <Button
                                variant="primary"
                                className="bg-spiritual-zen-forest text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-spiritual-zen-accent transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 border-none"
                                onClick={() => document.getElementById('donation-plans')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Donate Now
                            </Button>
                            <Button
                                variant="outline"
                                className="border-2 border-white/80 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-spiritual-zen-charcoal transition-all backdrop-blur-sm transform hover:-translate-y-1 shadow-lg"
                                onClick={() => document.getElementById('payment-info')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                View Payment Methods
                            </Button>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Donation Plans Grid */}
            <section id="donation-plans" className="py-20 bg-spiritual-zen-surface">
                <Container>
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-spiritual-zen-charcoal">Available Sewa Programs</h2>
                        <div className="w-24 h-1 bg-spiritual-zen-accent mx-auto rounded-full" />
                        <p className="text-spiritual-textLight max-w-xl mx-auto">Select a program that resonates with you and help us continue our legacy of service.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {donationLevels.map((level, index) => (
                            <div
                                key={index}
                                className={`group relative rounded-3xl overflow-hidden border border-spiritual-zen-highlight bg-white hover:bg-spiritual-zen-highlight/30 transition-all duration-500 hover:shadow-2xl hover:border-spiritual-zen-accent/30 flex flex-col ${level.tag ? 'ring-2 ring-spiritual-zen-accent ring-inset' : ''}`}
                            >
                                {/* Card Image Area */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={(level as any).image}
                                        alt={level.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-4 left-6 right-6 flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
                                            {React.cloneElement(level.icon as React.ReactElement<any>, { className: "w-5 h-5 text-white" })}
                                        </div>
                                        <h3 className="text-lg font-bold text-white leading-tight">{level.title}</h3>
                                    </div>
                                    {level.tag && (
                                        <span className="absolute top-4 left-6 px-3 py-1 bg-spiritual-zen-accent text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
                                            {level.tag}
                                        </span>
                                    )}
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <p className="text-spiritual-textLight mb-8 flex-grow font-inter text-sm leading-relaxed">{level.description}</p>
                                    <div className="mt-auto pt-6 border-t border-spiritual-zen-highlight flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-spiritual-textLighter font-bold mb-1">Impact Price</p>
                                            <span className="text-2xl font-bold text-spiritual-zen-forest">{level.price}</span>
                                        </div>
                                        <Button className="rounded-full w-auto h-12 flex items-center justify-center bg-spiritual-zen-forest text-white hover:bg-spiritual-zen-charcoal p-0 transition-all shadow-md hover:shadow-lg border-none">
                                            <ChevronRight className="w-5 h-5 text-white fill-white" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Small Contributions Card */}
                        <div className="p-8 rounded-3xl bg-spiritual-zen-forest text-white flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10">
                                <div className="p-4 rounded-2xl bg-white/20 inline-block mb-6">
                                    <HandHeart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4 font-display">Langar Sewa</h3>
                                <p className="text-white/80 mb-8 font-inter text-sm leading-relaxed">Even the smallest contribution makes an impact. Help us reach one more person who needs a warm meal today.</p>
                                <div className="grid grid-cols-2 gap-3">
                                    {smallContributions.map((cont, idx) => (
                                        <button
                                            key={idx}
                                            className="py-3 px-4 rounded-xl border border-white/30 hover:bg-white hover:text-spiritual-zen-forest font-bold transition-all text-center text-sm shadow-sm"
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
            <section id="payment-info" className="py-24 bg-white">
                <Container>
                    <div className="max-w-6xl mx-auto bg-spiritual-zen-surface rounded-[2rem] shadow-2xl overflow-hidden border border-spiritual-zen-highlight flex flex-col lg:flex-row">
                        {/* Bank Details */}
                        <div className="flex-1 p-8 lg:p-16 space-y-10">
                            <div className="space-y-4">
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-spiritual-zen-charcoal">Support Us Today</h2>
                                <div className="w-16 h-1 bg-spiritual-zen-accent rounded-full" />
                                <p className="text-spiritual-textLight font-inter">You can make a direct bank transfer using the details provided below. Your contribution helps us maintain our daily Seva.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-spiritual-zen-highlight">
                                        <Building2 className="w-6 h-6 text-spiritual-zen-forest" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-spiritual-textLighter font-bold mb-1">Account Name</p>
                                        <p className="text-xl font-bold text-spiritual-zen-charcoal">Dhan Guru Nanak Shah Trust</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-spiritual-zen-highlight">
                                            <CreditCard className="w-6 h-6 text-spiritual-zen-forest" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-spiritual-textLighter font-bold mb-1">Account Number</p>
                                            <p className="text-lg font-bold text-spiritual-zen-charcoal tracking-wider">920020069624600</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-spiritual-zen-highlight">
                                            <Building2 className="w-6 h-6 text-spiritual-zen-forest" />
                                        </div>
                                        <div>
                                            <p className="text-xs uppercase tracking-widest text-spiritual-textLighter font-bold mb-1">IFSC Code</p>
                                            <p className="text-lg font-bold text-spiritual-zen-charcoal">UTIB0004255</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white rounded-xl shadow-sm border border-spiritual-zen-highlight">
                                        <QrCode className="w-6 h-6 text-spiritual-zen-forest" />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-spiritual-textLighter font-bold mb-1">Bank Branch</p>
                                        <p className="text-lg font-bold text-spiritual-zen-charcoal">Axis Bank, Netaji Branch, Ulhasnagar</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-spiritual-zen-highlight">
                                <div className="flex flex-col gap-6">
                                    <div className="text-xs font-bold text-spiritual-textLighter uppercase tracking-widest">Accepted Payment Methods:</div>
                                    <div className="flex flex-wrap items-center gap-8 md:gap-12">
                                        <div className="group h-8 md:h-10">
                                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" className="h-full object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                                <g transform="matrix(.6782 0 0 .6782 1.226 120.628)">
                                                    <clipPath id="prefix__a">
                                                        <path d="M0 0h752v400H0z" />
                                                    </clipPath>
                                                    <g clipPath="url(#prefix__a)">
                                                        <path d="M552 0H200C90 0 0 90 0 200s90 200 200 200h352c110 0 200-90 200-200S662 0 552 0z" fill="#fff" fillRule="nonzero" />
                                                        <path d="M552 16.2c24.7 0 48.7 4.9 71.3 14.5 21.9 9.3 41.5 22.6 58.5 39.5 16.9 16.9 30.2 36.6 39.5 58.5 9.6 22.6 14.5 46.6 14.5 71.3 0 24.7-4.9 48.7-14.5 71.3-9.3 21.9-22.6 41.5-39.5 58.5-16.9 16.9-36.6 30.2-58.5 39.5-22.6 9.6-46.6 14.5-71.3 14.5H200c-24.7 0-48.7-4.9-71.3-14.5-21.9-9.3-41.5-22.6-58.5-39.5-16.9-16.9-30.2-36.6-39.5-58.5-9.6-22.6-14.5-46.6-14.5-71.3 0-24.7 4.9-48.7 14.5-71.3 9.3-21.9 22.6-41.5 39.5-58.5 16.9-16.9 36.6-30.2 58.5-39.5 22.6-9.6 46.6-14.5 71.3-14.5h352M552 0H200C90 0 0 90 0 200s90 200 200 200h352c110 0 200-90 200-200S662 0 552 0z" fill="#3c4043" fillRule="nonzero" />
                                                        <g fillRule="nonzero">
                                                            <g fill="#3c4043">
                                                                <path d="M358.6 214.1v60.6h-19.2V125.3h50.9c12.9 0 23.9 4.3 32.9 12.9 9.2 8.6 13.8 19.1 13.8 31.5 0 12.7-4.6 23.2-13.8 31.7-8.9 8.5-19.9 12.7-32.9 12.7h-31.7zm0-70.4v52.1h32.1c7.6 0 14-2.6 19-7.7 5.1-5.1 7.7-11.3 7.7-18.3 0-6.9-2.6-13-7.7-18.1-5-5.3-11.3-7.9-19-7.9h-32.1v-.1zM487.2 169.1c14.2 0 25.4 3.8 33.6 11.4 8.2 7.6 12.3 18 12.3 31.2v63h-18.3v-14.2h-.8c-7.9 11.7-18.5 17.5-31.7 17.5-11.3 0-20.7-3.3-28.3-10-7.6-6.7-11.4-15-11.4-25 0-10.6 4-19 12-25.2 8-6.3 18.7-9.4 32-9.4 11.4 0 20.8 2.1 28.1 6.3v-4.4c0-6.7-2.6-12.3-7.9-17-5.3-4.7-11.5-7-18.6-7-10.7 0-19.2 4.5-25.4 13.6l-16.9-10.6c9.3-13.5 23.1-20.2 41.3-20.2zm-24.8 74.2c0 5 2.1 9.2 6.4 12.5 4.2 3.3 9.2 5 14.9 5 8.1 0 15.3-3 21.6-9 6.3-6 9.5-13 9.5-21.1-6-4.7-14.3-7.1-25-7.1-7.8 0-14.3 1.9-19.5 5.6-5.3 3.9-7.9 8.6-7.9 14.1zM637.5 172.4l-64 147.2h-19.8l23.8-51.5-42.2-95.7h20.9l30.4 73.4h.4l29.6-73.4h20.9z" />
                                                            </g>
                                                            <path d="M282.23 202c0-6.26-.56-12.25-1.6-18.01h-80.48v33l46.35.01c-1.88 10.98-7.93 20.34-17.2 26.58v21.41h27.59c16.11-14.91 25.34-36.95 25.34-62.99z" fill="#4285f4" />
                                                            <path d="M229.31 243.58c-7.68 5.18-17.57 8.21-29.14 8.21-22.35 0-41.31-15.06-48.1-35.36h-28.46v22.08c14.1 27.98 43.08 47.18 76.56 47.18 23.14 0 42.58-7.61 56.73-20.71l-27.59-21.4z" fill="#34a853" />
                                                            <path d="M149.39 200.05c0-5.7.95-11.21 2.68-16.39v-22.08h-28.46c-5.83 11.57-9.11 24.63-9.11 38.47s3.29 26.9 9.11 38.47l28.46-22.08a51.657 51.657 0 01-2.68-16.39z" fill="#fabb05" />
                                                            <path d="M200.17 148.3c12.63 0 23.94 4.35 32.87 12.85l24.45-24.43c-14.85-13.83-34.21-22.32-57.32-22.32-33.47 0-62.46 19.2-76.56 47.18l28.46 22.08c6.79-20.3 25.75-35.36 48.1-35.36z" fill="#e94235" />
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="group h-8 md:h-10">
                                            <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" strokeLinejoin="round" strokeMiterlimit="2" className="h-full object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                                <circle cx="-25.926" cy="41.954" r="29.873" fill="#5f259f" transform="rotate(-76.714 -48.435 5.641) scale(8.56802)" />
                                                <path d="M372.164 189.203c0-10.008-8.576-18.593-18.584-18.593h-34.323l-78.638-90.084c-7.154-8.577-18.592-11.439-30.03-8.577l-27.17 8.577c-4.292 1.43-5.723 7.154-2.862 10.007l85.8 81.508H136.236c-4.293 0-7.154 2.861-7.154 7.154v14.292c0 10.016 8.585 18.592 18.592 18.592h20.015v68.639c0 51.476 27.17 81.499 72.931 81.499 14.292 0 25.739-1.431 40.03-7.146v45.753c0 12.87 10.016 22.886 22.885 22.886h20.015c4.293 0 8.577-4.293 8.577-8.586V210.648h32.893c4.292 0 7.145-2.861 7.145-7.145v-14.3zM280.65 312.17c-8.576 4.292-20.015 5.723-28.591 5.723-22.886 0-34.324-11.438-34.324-37.176v-68.639h62.915v100.092z" fill="#fff" fillRule="nonzero" />
                                            </svg>
                                        </div>
                                        <div className="group h-5 md:h-7">
                                            <svg viewBox="0 0 122.88 38.52" xmlns="http://www.w3.org/2000/svg" className="h-full object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                                <g>
                                                    <path className="fill-[#00BAF2]" d="M122.47,11.36c-1.12-3.19-4.16-5.48-7.72-5.48h-0.08c-2.32,0-4.41,0.97-5.9,2.52 c-1.49-1.55-3.58-2.52-5.9-2.52h-0.07c-2.04,0-3.91,0.75-5.34,1.98V7.24c-0.05-0.63-0.56-1.12-1.2-1.12h-5.48 c-0.67,0-1.21,0.54-1.21,1.21v29.74c0,0.67,0.54,1.21,1.21,1.21h5.48c0.61,0,1.12-0.46,1.19-1.04l0-21.35c0-0.08,0-0.14,0.01-0.21 c0.09-0.95,0.79-1.74,1.89-1.83h1.01c0.46,0.04,0.85,0.2,1.15,0.45c0.48,0.38,0.74,0.96,0.74,1.6l0.02,21.24 c0,0.67,0.54,1.22,1.21,1.22h5.48c0.65,0,1.17-0.51,1.2-1.15l0-21.33c0-0.7,0.32-1.34,0.89-1.71c0.28-0.18,0.62-0.3,1.01-0.34h1.01 c1.19,0.1,1.9,1,1.9,2.05l0.02,21.22c0,0.67,0.54,1.21,1.21,1.21h5.48c0.64,0,1.17-0.5,1.21-1.13V13.91 C122.86,12.6,122.69,11.99,122.47,11.36L122.47,11.36z M85.39,6.2h-3.13V1.12c0-0.01,0-0.01,0-0.02C82.26,0.5,81.77,0,81.15,0 c-0.07,0-0.14,0.01-0.21,0.02c-3.47,0.95-2.78,5.76-9.12,6.17h-0.61c-0.09,0-0.18,0.01-0.27,0.03h-0.01l0.01,0 C70.41,6.35,70,6.83,70,7.41v5.48c0,0.67,0.54,1.21,1.21,1.21h3.3l-0.01,23.22c0,0.66,0.54,1.2,1.2,1.2h5.42 c0.66,0,1.2-0.54,1.2-1.2l0-23.22h3.07c0.66,0,1.21-0.55,1.21-1.21V7.41C86.6,6.74,86.06,6.2,85.39,6.2L85.39,6.2z" />
                                                    <path className="fill-[#20336B]" d="M65.69,6.2h-5.48C59.55,6.2,59,6.74,59,7.41v11.33c-0.01,0.7-0.58,1.26-1.28,1.26h-2.29 c-0.71,0-1.29-0.57-1.29-1.28L54.12,7.41c0-0.67-0.54-1.21-1.21-1.21h-5.48c-0.67,0-1.21,0.54-1.21,1.21v12.41 c0,4.71,3.36,8.08,8.08,8.08c0,0,3.54,0,3.65,0.02c0.64,0.07,1.13,0.61,1.13,1.27c0,0.65-0.48,1.19-1.12,1.27 c-0.03,0-0.06,0.01-0.09,0.02l-8.01,0.03c-0.67,0-1.21,0.54-1.21,1.21v5.47c0,0.67,0.54,1.21,1.21,1.21h8.95 c4.72,0,8.08-3.36,8.08-8.07V7.41C66.9,6.74,66.36,6.2,65.69,6.2L65.69,6.2z M34.53,6.23h-7.6c-0.67,0-1.22,0.51-1.22,1.13v2.13 c0,0.01,0,0.03,0,0.04c0,0.02,0,0.03,0,0.05v2.92c0,0.66,0.58,1.21,1.29,1.21h7.24c0.57,0.09,1.02,0.51,1.09,1.16v0.71 c-0.06,0.62-0.51,1.07-1.06,1.12h-3.58c-4.77,0-8.16,3.17-8.16,7.61v6.37c0,4.42,2.92,7.56,7.65,7.56h9.93 c1.78,0,3.23-1.35,3.23-3.01V14.45C43.34,9.41,40.74,6.23,34.53,6.23L34.53,6.23z M35.4,29.09v0.86c0,0.07-0.01,0.14-0.02,0.2 c-0.01,0.06-0.03,0.12-0.05,0.18c-0.17,0.48-0.65,0.83-1.22,0.83h-2.28c-0.71,0-1.29-0.54-1.29-1.21v-1.03c0-0.01,0-0.03,0-0.04 l0-2.75v-0.86l0-0.01c0-0.66,0.58-1.2,1.29-1.2h2.28c0.71,0,1.29,0.54,1.29,1.21V29.09L35.4,29.09z M13.16,6.19H1.19 C0.53,6.19,0,6.73,0,7.38v5.37c0,0.01,0,0.02,0,0.03c0,0.03,0,0.05,0,0.07v24.29c0,0.66,0.49,1.2,1.11,1.21h5.58 c0.67,0,1.21-0.54,1.21-1.21l0.02-8.32h5.24c4.38,0,7.44-3.04,7.44-7.45v-7.72C20.6,9.25,17.54,6.19,13.16,6.19L13.16,6.19z M12.68,16.23v3.38c0,0.71-0.57,1.29-1.28,1.29l-3.47,0v-6.77h3.47c0.71,0,1.28,0.57,1.28,1.28V16.23L12.68,16.23z" />
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="group h-5 md:h-7">
                                            <svg viewBox="0 0 512 305.67" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" className="h-full object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                                <g fillRule="nonzero">
                                                    <path fill="gray" d="M48.18 0h415.64c13.26 0 25.31 5.42 34.03 14.15C506.58 22.88 512 34.92 512 48.18V257.5c0 13.25-5.42 25.3-14.15 34.03s-20.77 14.15-34.03 14.15H48.18c-13.26 0-25.3-5.42-34.03-14.15S0 270.75 0 257.5V48.18c0-13.26 5.42-25.31 14.15-34.03C22.87 5.42 34.92 0 48.18 0zm415.64 16.6H48.18c-8.68 0-16.57 3.56-22.29 9.29-5.73 5.72-9.28 13.61-9.28 22.29V257.5c0 8.67 3.55 16.56 9.28 22.29 5.72 5.72 13.62 9.28 22.29 9.28h415.64c8.67 0 16.56-3.56 22.29-9.28 5.73-5.73 9.29-13.62 9.29-22.29V48.18c0-8.67-3.56-16.57-9.29-22.29-5.72-5.73-13.62-9.29-22.29-9.29z" />
                                                    <path fill="#1434CB" d="M303.27 102.24c-22.18 0-42 11.49-42 32.73 0 24.35 35.15 26.04 35.15 38.27 0 5.16-5.9 9.77-15.99 9.77-14.31 0-25-6.45-25-6.45L250.85 198s12.32 5.44 28.68 5.44c24.25 0 43.33-12.06 43.33-33.66 0-25.74-35.3-27.37-35.3-38.73 0-4.03 4.85-8.45 14.9-8.45 11.35 0 20.61 4.68 20.61 4.68l4.48-20.7s-10.08-4.34-24.28-4.34zm-202.91 1.56l-.53 3.12s9.33 1.71 17.73 5.12c10.82 3.9 11.59 6.18 13.41 13.24l19.86 76.55h26.62l41.01-98.03H191.9l-26.35 66.65-10.75-56.5c-.99-6.47-5.98-10.15-12.1-10.15H100.36zm128.78 0l-20.83 98.03h25.32l20.76-98.03h-25.25zm141.25 0c-6.11 0-9.35 3.27-11.72 8.98l-37.1 89.05h26.56l5.13-14.85h32.36l3.12 14.85h23.43l-20.44-98.03h-21.34zm3.45 26.48l7.87 36.79h-21.09l13.22-36.79z" />
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="group h-8 md:h-12">
                                            <svg viewBox="0 0 333333 199007" xmlns="http://www.w3.org/2000/svg" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" className="h-full object-contain grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                                <g fillRule="nonzero">
                                                    <path d="M115259 146065c-432-433-944-770-1538-1010-593-239-1243-360-1949-360-374 0-761 32-1164 97-403 63-796 178-1183 340-386 163-754 388-1102 676-348 287-652 650-909 1087-415-686-978-1224-1687-1615-710-389-1522-585-2435-585-307 0-624 28-953 83-328 56-654 152-977 289-324 138-633 324-928 560s-562 534-803 894v-1505h-2590v12324h2614v-6831c0-523 83-988 249-1396s389-748 667-1022c278-276 603-483 977-624s772-213 1195-213c880 0 1563 278 2048 837 485 557 728 1355 728 2392v6857h2615v-6831c0-523 83-988 249-1396s388-748 666-1022c278-276 604-483 977-624 374-141 772-213 1196-213 879 0 1562 278 2048 837 486 557 728 1355 728 2392v6857h2615v-7745c0-720-119-1380-355-1981-236-600-571-1117-1002-1550zm122765 10443v204h235c48 0 86-7 111-22 26-15 39-41 39-78s-13-63-39-79c-26-17-63-25-111-25h-235zm241-272c153 0 269 34 348 102s119 158 119 273c0 89-28 163-85 222-57 58-140 98-248 115l347 401h-375l-310-389h-36v389h-313v-1114h554zm-73 1467c125 0 243-24 353-72 109-48 206-113 287-194 81-82 145-179 193-289 46-110 69-228 69-356 0-125-23-243-69-354-47-111-111-207-193-288-80-81-177-146-287-193s-228-71-353-71c-129 0-248 24-359 71-111 48-208 112-290 193-81 81-147 177-193 288s-70 229-70 354c0 127 23 246 70 356 46 110 111 207 193 289 82 81 179 146 290 194s230 72 359 72zm0-2166c179 0 347 33 504 100 157 65 294 156 410 269 117 114 209 246 276 398 68 153 101 315 101 489 0 172-33 335-101 487-67 152-158 287-276 401-116 116-253 206-410 272-157 67-325 100-504 100-183 0-354-33-512-100-159-66-296-156-413-272-116-114-208-248-274-401-66-152-100-316-100-487 0-174 33-335 100-489 66-152 158-285 274-398 117-113 254-204 413-269 158-67 329-100 512-100zm-51855-7207c342-347 750-618 1222-811s982-290 1531-290c605 0 1165 96 1684 290 502 186 937 447 1306 778l1294-2153c-485-388-1032-706-1640-953-811-330-1691-495-2644-495-952 0-1833 165-2644 495s-1509 785-2097 1364c-587 578-1048 1263-1382 2052-335 789-503 1646-503 2572 0 927 167 1784 503 2574 334 789 795 1472 1382 2052 587 579 1286 1033 2097 1364 811 330 1692 495 2644 495 953 0 1833-165 2644-495 608-248 1155-565 1640-954l-1294-2153c-369 331-804 591-1306 778-519 193-1080 290-1684 290-548 0-1059-96-1531-290-472-193-880-463-1222-810-343-347-613-763-810-1247-197-486-295-1019-295-1603 0-583 98-1117 295-1601 197-486 468-901 811-1248zm43399 4419c-180 481-434 897-760 1248-326 352-716 628-1170 829-454 202-961 303-1517 303-584 0-1105-105-1563-315-459-210-847-493-1165-849-317-356-561-774-733-1254-172-481-257-990-257-1531 0-540 86-1050 257-1531 172-480 416-898 733-1254 318-356 706-639 1165-849 458-211 980-316 1563-316 556 0 1063 101 1517 303 455 201 845 478 1170 830 326 352 579 767 760 1248 180 480 269 1002 269 1569s-90 1090-269 1570zm103-12741v6502c-430-548-961-989-1596-1318-635-331-1394-496-2277-496-867 0-1673 160-2419 482s-1398 770-1956 1344-995 1258-1312 2052c-319 793-477 1661-477 2605s158 1812 477 2605c317 794 754 1478 1312 2053 557 574 1209 1022 1956 1344 746 322 1552 482 2419 482 882 0 1642-163 2277-489 634-325 1166-763 1596-1311v1479h2688v-17334h-2688zm-12559 4688c-756 0-1437 137-2046 411-609 275-1119 935-1530 1527v-1616h-2442v12324h2468v-6780c0-523 72-991 219-1402 146-412 347-759 604-1042s567-498 927-644c361-146 755-219 1183-219 327 0 678 39 1055 117 193 39 372 87 540 144l795-2572c-216-69-434-127-659-165-331-56-702-83-1113-83zm-37379 0c-754 0-1436 137-2045 411-609 275-1119 935-1531 1527v-1616h-2441v12324h2467v-6780c0-523 73-991 219-1402 146-412 347-759 605-1042s566-498 927-644c359-146 754-219 1183-219 327 0 678 39 1056 117 192 39 372 87 540 144l795-2572c-216-69-435-127-660-165-330-56-701-83-1113-83zm-24275 10189c-433 163-860 244-1280 244-275 0-530-43-766-129-236-85-441-220-618-405-176-184-315-422-418-714-104-291-155-644-155-1055v-5365h4319v-2444h-4319v-3731h-2701v3731h-2457v2444h2457v5416c0 1639 387 2845 1163 3622 777 776 1864 1164 3262 1164 781 0 1481-120 2103-360 411-159 792-341 1149-541l-919-2251c-260 139-533 264-821 373zm49266-2136c-180 481-433 897-759 1248-326 352-716 628-1171 829-454 202-960 303-1518 303-583 0-1104-105-1563-315s-847-493-1164-849c-318-356-562-774-733-1254-172-481-257-990-257-1531 0-540 86-1050 257-1531 172-480 416-898 733-1254s705-639 1164-849c459-211 980-316 1563-316 558 0 1065 101 1518 303 455 201 845 478 1171 830s579 767 759 1248c180 480 270 1002 270 1569s-90 1090-270 1570zm102-6239c-429-548-960-989-1595-1318-634-331-1394-496-2277-496-866 0-1673 160-2419 482s-1398 770-1955 1344c-558 574-996 1258-1313 2052-318 793-476 1661-476 2605s158 1812 476 2605c317 794 755 1478 1313 2053 557 574 1209 1022 1955 1344s1553 482 2419 482c883 0 1643-163 2277-489 635-325 1166-763 1595-1311v1479h2689v-12324h-2689v1492zm-43243 3615c69-445 189-856 361-1228 172-373 393-694 662-965 271-270 592-478 965-624 374-146 800-219 1280-219 857 0 1557 266 2097 798 541 532 883 1278 1029 2238h-6394zm7520-3634c-511-570-1124-1012-1839-1325-717-313-1503-470-2360-470-910 0-1740 156-2491 470-751 313-1396 754-1936 1325-541 570-960 1254-1261 2052-300 798-450 1677-450 2637 0 978 155 1865 463 2663 309 798 741 1479 1299 2045s1223 1004 1995 1312c771 309 1621 464 2547 464 935 0 1825-129 2670-386s1644-708 2400-1351l-1337-1917c-515 411-1084 731-1706 958-622 228-1242 341-1859 341-438 0-858-59-1261-180-403-120-768-306-1094-559s-605-577-837-972c-231-394-390-870-476-1428h9109c17-154 30-317 39-489 8-171 13-343 13-515 0-960-144-1837-431-2631-286-793-685-1475-1196-2046zm-25175 4670c-756-587-1806-979-3152-1176l-1274-194c-284-43-550-92-798-148s-463-131-643-225c-179-94-324-215-431-360-107-146-160-326-160-541 0-438 204-792 611-1062s980-404 1717-404c386 0 766 33 1139 103 373 69 726 154 1061 256 334 103 639 217 914 342 274 124 506 243 695 353l1157-2096c-643-412-1393-731-2251-959-857-227-1771-341-2741-341-789 0-1496 93-2123 277-625 184-1159 446-1601 784-442 340-781 753-1017 1242-237 490-353 1038-353 1647 0 995 353 1799 1060 2413 708 613 1749 1014 3120 1202l1287 168c738 102 1278 268 1622 495 343 227 514 516 514 869 0 462-236 829-708 1099s-1170 405-2097 405c-506 0-958-34-1357-103-398-69-764-160-1093-276-331-116-627-248-889-398-261-150-504-311-726-482l-1248 2019c446 334 914 605 1402 811 490 205 969 366 1441 481 472 117 918 193 1338 231 420 39 789 59 1106 59 883 0 1675-98 2374-296 700-198 1287-474 1763-831 477-356 840-780 1094-1273s379-1035 379-1627c0-1055-376-1876-1131-2464zm-15152 1589c-180 481-433 897-759 1248-326 352-716 628-1170 829-455 202-961 303-1518 303-583 0-1105-105-1563-315-459-210-847-493-1164-849-318-356-562-774-733-1254-172-481-257-990-257-1531 0-540 86-1050 257-1531 172-480 416-898 733-1254s706-639 1164-849c459-211 980-316 1563-316 558 0 1063 101 1518 303 454 201 844 478 1170 830s579 767 759 1248c180 480 270 1002 270 1569s-90 1090-270 1570zm103-6239c-429-548-961-989-1596-1318-635-331-1394-496-2277-496-866 0-1672 160-2419 482-746 322-1398 770-1955 1344-558 574-995 1258-1313 2052-317 793-476 1661-476 2605s159 1812 476 2605c318 794 755 1478 1313 2053 557 574 1209 1022 1955 1344 747 322 1553 482 2419 482 883 0 1643-163 2277-489 635-325 1167-763 1596-1311v1479h2689v-12324h-2689v1492z" fill="#141515" />
                                                    <path d="M147063 87405c0-14766 6898-27911 17638-36420-7920-6274-17924-10030-28812-10030-25653 0-46450 20797-46450 46449 0 25653 20796 46449 46450 46449 10888 0 20892-3755 28812-10029-10740-8508-17638-21654-17638-36420z" fill="#de2c1d" />
                                                    <path d="M147063 87405c0 14767 6898 27912 17638 36420 10740-8508 17637-21654 17637-36420s-6898-27911-17637-36420c-10740 8508-17638 21654-17638 36420z" fill="#ed6100" />
                                                    <path d="M193513 40955c-10888 0-20892 3756-28811 10030 10740 8508 17637 21654 17637 36420 0 14767-6898 27912-17637 36420 7919 6274 17923 10029 28811 10029 25653 0 46449-20796 46449-46449s-20796-46449-46449-46449zm49714 73260v-1972l-640 1702h-706l-640-1698v1968h-666v-2843h954l707 1820 700-1820h956v2843h-667zm-4775 0v-2230h-903v-613h2470v613h-902v2230h-666z" fill="#f79f06" />
                                                    <path d="M31366 0h270600c8631 0 16474 3528 22156 9210 5683 5683 9211 13526 9211 22156v136275c0 8629-3529 16472-9211 22155-5683 5682-13526 9211-22155 9211H31367c-8629 0-16473-3528-22156-9211C3529 184114 1 176272 1 167641V31366c0-8631 3528-16474 9210-22156S22737 0 31368 0zm270600 10811H31366c-5647 0-10785 2315-14513 6043s-6043 8866-6043 14513v136275c0 5646 2315 10784 6043 14512 3729 3729 8867 6044 14513 6044h270600c5645 0 10783-2315 14512-6044 3728-3729 6044-8867 6044-14511V31368c0-5645-2315-10784-6043-14513-3728-3728-8867-6043-14513-6043z" fill="gray" fillRule="nonzero" />
                                                </g>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* UPI Section */}
                        <div className="bg-spiritual-zen-forest p-8 lg:p-16 text-white flex flex-col justify-center items-center text-center space-y-8 lg:w-[40%] relative overflow-hidden">
                            <div className="absolute inset-0 z-0 bg-spiritual-zen-charcoal/10" />
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />

                            <div className="relative z-10 space-y-4">
                                <h3 className="text-2xl md:text-3xl font-display font-bold">Donate via UPI</h3>
                                <p className="text-white/70 max-w-xs font-inter text-sm">Scan the QR code or use the mobile number below to donate instantly through your preferred app.</p>
                            </div>

                            <div className="relative z-10 p-6 bg-white rounded-3xl shadow-2xl group transition-transform hover:scale-105 border-4 border-white/20">
                                <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center">
                                    <QrCode className="w-24 h-24 text-spiritual-zen-forest/40" />
                                </div>
                                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-spiritual-zen-accent text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg border-2 border-white">
                                    Scan to Pay
                                </div>
                            </div>

                            <div className="relative z-10 space-y-2">
                                <p className="text-white/60 uppercase text-xs tracking-[0.2em] font-bold">Mobile Number</p>
                                <p className="text-3xl font-bold tracking-tighter text-spiritual-zen-accent drop-shadow-sm">+91 7083 19 19 19</p>
                            </div>

                            <p className="relative z-10 text-xs text-white/50 max-w-[200px] font-inter">Securely powered by Paytm, Google Pay, PhonePe & BHIM UPI</p>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Legacy/Trust Section */}
            <section className="py-24 bg-spiritual-zen-surface">
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
            </section>
        </div>
    );
}
