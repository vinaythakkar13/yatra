/**
 * Enhanced Features Section Component
 * Professional three-column layout with icons, hover effects, and GSAP animations
 * Matches the reference design with yellow background and white cards
 */

'use client';

import React, { useRef, useEffect } from 'react';
import Container from '../common/Container';
import { useGSAP } from '../../hooks/useGSAP';
import AnimatedSection from '../ui/AnimatedSection';

const features = [
    {
        id: 1,
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
        ),
        title: 'Donation',
        subtitle: 'Collect fund over the world',
        description:
            'Your generous donations help us provide free medical care, education, and essential services to thousands of families in need. Every contribution, big or small, makes a meaningful difference in someone\'s life.',
    },
    {
        id: 2,
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
        ),
        title: 'Fundraising',
        subtitle: 'Collect fund over the world',
        description:
            'Our fundraising initiatives bring together communities worldwide to support our mission. Through events, campaigns, and partnerships, we raise awareness and resources to expand our charitable programs.',
    },
    {
        id: 3,
        icon: (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
        ),
        title: 'Volunteer',
        subtitle: 'Collect fund over the world',
        description:
            'Join our dedicated team of volunteers who selflessly serve the community. Whether it\'s helping at the hospital, serving langar, or organizing events, your time and skills create lasting positive impact.',
    },
];

export default function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { gsap, ScrollTrigger, isLoaded } = useGSAP();

    useEffect(() => {
        if (!gsap || !ScrollTrigger || !isLoaded || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Animate cards on scroll
            gsap.from('.feature-card', {
                y: 60,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });

            // Hover animation setup
            const cards = sectionRef.current?.querySelectorAll('.feature-card');
            if (cards) {
                cards.forEach((card) => {
                    card.addEventListener('mouseenter', () => {
                        gsap.to(card, {
                            y: -10,
                            scale: 1.02,
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                    });

                    card.addEventListener('mouseleave', () => {
                        gsap.to(card, {
                            y: 0,
                            scale: 1,
                            duration: 0.3,
                            ease: 'power2.out',
                        });
                    });
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [gsap, ScrollTrigger, isLoaded]);

    return (
        <section ref={sectionRef} className="bg-spiritual-saffron py-16 md:py-24 -mt-2 relative z-20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-64 h-64 bg-spiritual-navy rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-spiritual-navy rounded-full blur-3xl" />
            </div>

            <Container>
                {/* Section Header */}
                <AnimatedSection animation="fadeInUp" className="text-center mb-12 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                        We are non-profit Charity & NGO Organization
                    </h2>
                    <div className="w-24 h-1 bg-white/30 mx-auto mt-4" />
                </AnimatedSection>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 md:gap-8 relative z-10">
                    {features.map((feature, index) => (
                        <AnimatedSection
                            key={feature.id}
                            animation="fadeInUp"
                            delay={index * 0.1}
                            className="feature-card"
                        >
                            <div className="bg-spiritual-yellow-lemonChiffon rounded-2xl p-8 md:p-10 text-center transition-all duration-300 shadow-xl hover:shadow-2xl h-full flex flex-col">
                                {/* Icon Container */}
                                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center text-spiritual-saffron border-4 border-spiritual-saffron/20 rounded-full bg-spiritual-saffron/5 transition-all duration-300 group-hover:border-spiritual-saffron group-hover:bg-spiritual-saffron/10 group-hover:scale-110">
                                    {feature.icon}
                                </div>

                                {/* Title */}
                                <h3 className="text-xl md:text-2xl font-bold text-spiritual-navy mb-3">
                                    {feature.title}
                                </h3>

                                {/* Subtitle */}
                                <p className="text-xs md:text-sm text-spiritual-textLight mb-6 uppercase tracking-wider font-semibold">
                                    {feature.subtitle}
                                </p>

                                {/* Description */}
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base flex-grow">
                                    {feature.description}
                                </p>

                                {/* Decorative Element */}
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <div className="w-12 h-0.5 bg-spiritual-saffron mx-auto" />
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </Container>
        </section>
    );
}
