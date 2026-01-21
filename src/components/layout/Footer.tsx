/**
 * Footer Component for Spiritual Module
 * Redesigned to match spiritual module theme with proper Container wrapper
 * Follows standard UI/UX best practices: proper hierarchy, spacing, accessibility, and responsive design
 */

import React from 'react';
import Link from 'next/link';
import Container from '@/spiritual/components/common/Container';
import Button from '@/spiritual/components/common/Button';
import {
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaHeart,
    FaArrowRight,
} from 'react-icons/fa';
import contactData from '@/spiritual/data/contact.json';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    // Social media links with spiritual theme colors
    const socialLinks = [
        { icon: FaFacebookF, href: contactData.socialMedia?.facebook || '#', label: 'Facebook' },
        { icon: FaInstagram, href: contactData.socialMedia?.instagram || '#', label: 'Instagram' },
        { icon: FaYoutube, href: contactData.socialMedia?.youtube || '#', label: 'YouTube' },
        // { icon: FaTwitter, href: '#', label: 'Twitter' },
        // { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    ];

    const quickLinks = [
        { name: 'Home', href: '/' },
        { name: 'Our Causes', href: '/charity' },
        { name: 'Our Mission', href: '/charity' },
        { name: 'Medical Seva', href: '/charity' },
        { name: 'Contact Us', href: '/charity' },
    ];

    const services = [
        { name: 'Daily Langar Seva', href: '/charity' },
        { name: 'Free Medical Care', href: '/charity' },
        { name: 'Education Support', href: '/charity' },
        { name: 'Wheat & Rice Sewa', href: '/charity' },
        { name: 'Disaster Relief', href: '/charity' },
    ];

    const legalLinks = [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookie Policy', href: '#' },
    ];

    return (
        <footer className="relative bg-spiritual-navy text-white">
            {/* Main Footer Content with Container wrapper */}
            <Container className="relative z-10">
                <div className="py-12 md:py-16 lg:py-20">
                    {/* Main Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-12 lg:mb-16">
                        {/* Brand & About Section */}
                        <div className="lg:col-span-1 space-y-6">
                            <Link href="/spiritual" className="flex flex-col gap-2 group">
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl md:text-4xl font-display font-bold text-white group-hover:text-spiritual-saffron transition-colors duration-300">
                                        DGNST
                                    </span>
                                </div>
                                <span className="text-xs uppercase tracking-widest text-spiritual-saffron font-semibold">
                                    Dhan Guru Nanak Shah Trust
                                </span>
                            </Link>
                            <p className="text-spiritual-zen-mist leading-relaxed text-sm md:text-base">
                                For over 150 years, Sant Seva Charitable Trust has been dedicated to serving humanity through
                                free medical care, langar seva, education, and community support. Join us in our mission to make
                                a difference.
                            </p>

                            {/* Social Media Icons */}
                            <div className="flex items-center gap-3 pt-2">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon;
                                    return (
                                        <a
                                            key={social.label}
                                            href={social.href}
                                            className="group w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 hover:bg-spiritual-saffron hover:scale-110 hover:shadow-lg border border-white/20 hover:border-spiritual-saffron"
                                            aria-label={social.label}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Icon className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" />
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Links Section */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-base md:text-lg font-display font-bold mb-6 text-white relative inline-block">
                                    Quick Links
                                    <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-spiritual-saffron rounded-full" />
                                </h3>
                                <ul className="space-y-3">
                                    {quickLinks.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="group flex items-center gap-3 text-spiritual-zen-mist hover:text-white transition-all duration-300 text-sm md:text-base"
                                            >
                                                <FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-spiritual-saffron flex-shrink-0" />
                                                <span className="relative">
                                                    {link.name}
                                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-spiritual-saffron transition-all duration-300 group-hover:w-full" />
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-base md:text-lg font-display font-bold mb-6 text-white relative inline-block">
                                    Our Mission
                                    <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-spiritual-saffron rounded-full" />
                                </h3>
                                <ul className="space-y-3">
                                    {services.map((service) => (
                                        <li key={service.name}>
                                            <Link
                                                href={service.href}
                                                className="group flex items-center gap-3 text-spiritual-zen-mist hover:text-white transition-all duration-300 text-sm md:text-base"
                                            >
                                                <FaArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-spiritual-saffron flex-shrink-0" />
                                                <span className="relative">
                                                    {service.name}
                                                    <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-spiritual-saffron transition-all duration-300 group-hover:w-full" />
                                                </span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Contact & Newsletter Section */}
                        <div className="space-y-6">

                            <div>
                                <h3 className="text-base md:text-lg font-display font-bold mb-6 text-white relative inline-block">
                                    Contact Us
                                    <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-spiritual-saffron rounded-full" />
                                </h3>
                                <ul className="space-y-4 text-sm md:text-base">
                                    <li className="flex items-start gap-4 group">
                                        <div className="mt-1 w-5 h-5 flex-shrink-0">
                                            <FaMapMarkerAlt className="w-5 h-5 text-spiritual-saffron group-hover:scale-110 transition-transform" />
                                        </div>
                                        <a
                                            href={contactData.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-spiritual-zen-mist hover:text-white transition-colors leading-relaxed"
                                        >
                                            {contactData.address}
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-4 group">
                                        <div className="w-5 h-5 flex-shrink-0">
                                            <FaPhone className="w-5 h-5 text-spiritual-saffron group-hover:scale-110 transition-transform" />
                                        </div>
                                        <a
                                            href={`tel:${contactData.phone}`}
                                            className="text-spiritual-zen-mist hover:text-white transition-colors"
                                        >
                                            {contactData.phone}
                                        </a>
                                    </li>
                                    {/* <li className="flex items-center gap-4 group">
                                        <div className="w-5 h-5 flex-shrink-0">
                                            <FaEnvelope className="w-5 h-5 text-spiritual-saffron group-hover:scale-110 transition-transform" />
                                        </div>
                                        <a
                                            href={`mailto:${contactData.email}`}
                                            className="text-spiritual-zen-mist hover:text-white transition-colors break-all"
                                        >
                                            {contactData.email}
                                        </a>
                                    </li> */}
                                </ul>
                            </div>

                            {/* Newsletter */}
                            {/* <div className="mt-8">
                                <h3 className="text-base md:text-lg font-display font-bold mb-4 text-white relative inline-block">
                                    Newsletter
                                    <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-spiritual-saffron rounded-full" />
                                </h3>
                                <p className="text-spiritual-zen-mist text-sm mb-4 leading-relaxed">
                                    Subscribe to our newsletter to get the latest news & updates about our seva initiatives.
                                </p>
                                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            className="w-full px-4 py-3 pr-12 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:border-spiritual-saffron focus:ring-2 focus:ring-spiritual-saffron/50 outline-none text-white text-sm transition-all placeholder:text-spiritual-zen-mist/60"
                                            aria-label="Email address for newsletter subscription"
                                        />
                                        <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-spiritual-zen-mist/60" />
                                    </div>
                                    <Button
                                        variant="primary"
                                        className="w-full bg-spiritual-saffron text-spiritual-zen-charcoal hover:bg-spiritual-saffronDark hover:text-white font-bold uppercase tracking-wider text-xs py-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        Subscribe
                                        <FaArrowRight className="w-3 h-3" />
                                    </Button>
                                </form>
                            </div> */}
                        </div>
                    </div>

                    {/* Bottom Bar - Copyright and Legal Links */}
                    <div className="border-t border-white/10 pt-8 mt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            {/* Copyright */}
                            <div className="flex flex-col sm:flex-row items-center gap-2 text-sm md:text-base text-spiritual-zen-mist">
                                <p>
                                    © {currentYear} <span className="font-semibold text-white">Dhan Guru Nanak Shah Trust</span>. All
                                    rights reserved.
                                </p>
                                <span className="hidden sm:inline-flex items-center gap-1 text-spiritual-saffron">
                                    Made with <FaHeart className="w-3 h-3 text-red-500 animate-pulse" /> for humanity
                                </span>
                            </div>

                            {/* Legal Links */}
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                                {/* {legalLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="relative text-spiritual-zen-mist hover:text-white transition-colors duration-300 group"
                                    >
                                        {link.name}
                                        <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-spiritual-saffron transition-all duration-300 group-hover:w-full" />
                                    </a>
                                ))} */}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
