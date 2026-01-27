/**
 * Hero Slider Component
 * Professional full-width interactive slider with GSAP animations
 * Enhanced with modern UI/UX and Sikhism-themed content
 * Fixed: Image loading, height, spacing, and visibility issues
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGSAP } from '../../hooks/useGSAP';
import Button from '../common/Button';
import Container from '../common/Container';

const slides = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1920&q=80',
        title: 'Serving Humanity',
        subtitle: '150 Years of Selfless Seva',
        description: 'Since 1874, Sant Seva Charitable Trust has been dedicated to serving humanity through free medical care, langar seva, education, and community support. Join us in our mission to make a difference.',
        ctaText: 'Join Our Mission',
        ctaLink: '/spiritual/volunteer',
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1920&q=80',
        title: 'Free Medical Care',
        subtitle: 'Healing with Compassion',
        description: 'Our charitable hospital provides free medical treatment to thousands of patients annually. From emergency care to specialized treatments, we ensure quality healthcare reaches those who need it most.',
        ctaText: 'Support Healthcare',
        ctaLink: '/spiritual/charity',
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
        title: 'Langar Seva',
        subtitle: 'Feeding the Community',
        description: 'Every day, we serve nutritious meals to thousands through our langar program. No one goes hungry when we come together as a community to share and care.',
        ctaText: 'Donate Now',
        ctaLink: '/spiritual/charity',
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1920&q=80',
        title: 'Education for All',
        subtitle: 'Empowering Through Knowledge',
        description: 'We believe education is the foundation of progress. Our scholarship programs and free schools help underprivileged children access quality education and build brighter futures.',
        ctaText: 'Support Education',
        ctaLink: '/spiritual/charity',
    },
];

export default function HeroSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageFallbacks, setImageFallbacks] = useState<Record<number, string>>({});
    const slideRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const { gsap, isLoaded } = useGSAP();

    // Auto-slide functionality
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const timer = window.setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 7000);
        return () => window.clearInterval(timer);
    }, []);

    // GSAP animations on slide change
    useEffect(() => {
        if (!gsap || !isLoaded || !textRef.current) return;

        const ctx = gsap.context(() => {
            // Get all hero text elements and buttons
            const heroTexts = Array.from(textRef.current?.querySelectorAll('.hero-text') || []);
            const heroButtons = Array.from(textRef.current?.querySelectorAll('.hero-button') || []);

            // Fade out current text and buttons
            gsap.to([...heroTexts, ...heroButtons], {
                opacity: 0,
                y: -20,
                scale: 0.95,
                duration: 0.4,
                ease: 'power2.in',
            });

            // After fade out, reset and animate new content
            gsap.delayedCall(0.4, () => {
                // Reset text positions
                gsap.set(heroTexts, {
                    y: 40,
                    opacity: 0,
                    clearProps: 'scale'
                });

                // Reset button positions
                gsap.set(heroButtons, {
                    scale: 0.8,
                    opacity: 0,
                    y: 20,
                    clearProps: 'x'
                });

                // Animate text with stagger
                gsap.to(heroTexts, {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.12,
                    ease: 'power3.out',
                });

                // Animate buttons with scale and bounce effect
                gsap.to(heroButtons, {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.5,
                    stagger: 0.1,
                    ease: 'back.out(1.4)',
                });
            });
        }, textRef);

        return () => ctx.revert();
    }, [currentSlide, gsap, isLoaded]);

    // Initial page load animation
    useEffect(() => {
        if (!gsap || !isLoaded || !textRef.current) return;

        const ctx = gsap.context(() => {
            // Animate background image
            gsap.from('.hero-slide-image', {
                scale: 1.1,
                duration: 1.5,
                ease: 'power2.out',
            });

            // Initial animation for text and buttons on page load
            const heroTexts = Array.from(textRef.current?.querySelectorAll('.hero-text') || []);
            const heroButtons = Array.from(textRef.current?.querySelectorAll('.hero-button') || []);

            // Set initial state
            gsap.set(heroTexts, { y: 40, opacity: 0 });
            gsap.set(heroButtons, { scale: 0.8, opacity: 0, y: 20 });

            // Animate text on load
            gsap.to(heroTexts, {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.12,
                delay: 0.3,
                ease: 'power3.out',
            });

            // Animate buttons on load
            gsap.to(heroButtons, {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.8,
                delay: 0.8,
                stagger: 0.1,
                ease: 'back.out(1.4)',
            });
        }, textRef);

        return () => ctx.revert();
    }, [gsap, isLoaded]);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <section ref={slideRef} className="relative h-[85vh] min-h-[600px] max-h-[800px] overflow-hidden bg-spiritual-zen-charcoal">
            {/* Slides Container */}
            {slides.map((slide, index) => (
                <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10 active-slide' : 'opacity-0 z-0 pointer-events-none'
                        }`}
                >
                    {/* Background Image */}
                    <div className="hero-slide-image absolute inset-0">
                        <img
                            src={imageFallbacks[slide.id] ?? slide.image}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            onError={(event) => {
                                const target = event.currentTarget;
                                if (target.src.includes('dummyimage')) return;
                                setImageFallbacks((prev) => ({
                                    ...prev,
                                    [slide.id]: `https://dummyimage.com/1920x1080/0f172a/ffffff&text=${encodeURIComponent(slide.title)}`,
                                }));
                            }}
                        />
                    </div>

                    {/* Gradient Overlay - Enhanced for better text visibility */}
                    <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-spiritual-zen-charcoal/85 via-spiritual-zen-charcoal/60 to-spiritual-zen-charcoal/80 z-10" />
                </div>
            ))}

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex items-center justify-center pt-20">
                <Container maxWidth="2xl">
                    <div ref={textRef} className="text-center max-w-5xl mx-auto px-4">
                        {/* Title Badge */}
                        <div className="hero-text mb-4 md:mb-6">
                            <span className="inline-block px-4 md:px-6 py-2 bg-spiritual-zen-forest/30 backdrop-blur-sm border border-spiritual-zen-forest/50 rounded-full text-white font-semibold text-xs md:text-sm uppercase tracking-wider shadow-lg">
                                {slides[currentSlide].title}
                            </span>
                        </div>

                        {/* Main Heading - Using professional display font */}
                        <h1 className="hero-text font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
                            {slides[currentSlide].subtitle}
                        </h1>

                        {/* Description - Using professional sans font */}
                        <p className="hero-text font-sans text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-6 md:mb-10 max-w-3xl mx-auto leading-relaxed font-normal px-2 drop-shadow-lg">
                            {slides[currentSlide].description}
                        </p>

                        {/* CTA Buttons */}
                        <div ref={buttonsRef} className="hero-text flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center">
                            <Link href={slides[currentSlide].ctaLink} className="hero-button inline-flex">
                                <Button
                                    variant="primary"
                                    className="group relative bg-spiritual-zen-forest hover:bg-spiritual-zen-charcoal text-white rounded-full px-6 md:px-10 lg:px-12 py-3 md:py-4 uppercase tracking-wider text-xs md:text-sm lg:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden whitespace-nowrap border-2 border-spiritual-zen-forest"
                                >
                                    <span className="relative z-10">{slides[currentSlide].ctaText}</span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-charcoal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </Button>
                            </Link>
                            <Link href="/charity" className="hero-button inline-flex">
                                <Button
                                    variant="outline"
                                    className="group border-2 border-white/90 text-white hover:bg-white rounded-full px-6 md:px-10 lg:px-12 py-3 md:py-4 uppercase tracking-wider text-xs md:text-sm lg:text-base font-semibold backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:text-spiritual-zen-charcoal whitespace-nowrap"
                                >
                                    <span className="group-hover:text-spiritual-zen-charcoal transition-colors duration-300">Learn More</span>
                                </Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
                aria-label="Previous slide"
            >
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
                aria-label="Next slide"
            >
                <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 z-30 flex justify-center gap-2 sm:gap-3">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative transition-all duration-500 ease-out ${index === currentSlide
                            ? 'w-8 sm:w-10 md:w-12 h-2 sm:h-3 md:h-4'
                            : 'w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 opacity-60 hover:opacity-100'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    >
                        <div
                            className={`absolute inset-0 rounded-full transition-all duration-500 ${index === currentSlide
                                ? 'bg-spiritual-zen-forest shadow-lg shadow-spiritual-zen-forest/50'
                                : 'bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    </button>
                ))}
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-16 sm:bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-30 animate-bounce hidden md:block">
                <div className="flex flex-col items-center gap-2 text-white/70">
                    <span className="text-xs uppercase tracking-wider font-medium">Scroll</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
