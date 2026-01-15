/**
 * Enhanced Welcome Section Component
 * Professional two-column layout with image grid and content
 * Includes GSAP animations and modern styling
 */

'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import Container from '../common/Container';
import Button from '../common/Button';
import SkeletonImage from '../ui/SkeletonImage';
import { useGSAP } from '../../hooks/useGSAP';

export default function WelcomeSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageGridRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const paragraph1Ref = useRef<HTMLParagraphElement>(null);
    const paragraph2Ref = useRef<HTMLParagraphElement>(null);
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const bgDecor1Ref = useRef<HTMLDivElement>(null);
    const bgDecor2Ref = useRef<HTMLDivElement>(null);
    const { gsap, ScrollTrigger, isLoaded } = useGSAP();

    useEffect(() => {
        if (!gsap || !ScrollTrigger || !isLoaded || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Register ScrollTrigger plugin
            gsap.registerPlugin(ScrollTrigger);

            // Parallax effect for background decorations
            if (bgDecor1Ref.current) {
                gsap.to(bgDecor1Ref.current, {
                    y: -50,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                });
            }

            if (bgDecor2Ref.current) {
                gsap.to(bgDecor2Ref.current, {
                    y: 50,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                });
            }

            // Animate image grid with staggered entrance from different directions
            const images = imageGridRef.current?.querySelectorAll('.welcome-image');
            if (images && images.length > 0) {
                images.forEach((img, index) => {
                    const direction = index % 2 === 0 ? -50 : 50;
                    const delay = index * 0.15;
                    
                    gsap.from(img, {
                        y: direction,
                        x: index % 2 === 0 ? -30 : 30,
                        scale: 0.8,
                        opacity: 0,
                        rotation: index % 2 === 0 ? -5 : 5,
                        duration: 1.2,
                        delay: delay,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: img,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    });

                    // Hover animation with GSAP
                    img.addEventListener('mouseenter', () => {
                        gsap.to(img, {
                            scale: 1.05,
                            y: -10,
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                    });

                    img.addEventListener('mouseleave', () => {
                        gsap.to(img, {
                            scale: 1,
                            y: 0,
                            duration: 0.4,
                            ease: 'power2.out',
                        });
                    });
                });
            }

            // Animate badge/label
            if (badgeRef.current) {
                gsap.from(badgeRef.current, {
                    x: -30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: badgeRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                });
            }

            // Animate title with smooth reveal
            if (titleRef.current) {
                gsap.from(titleRef.current, {
                    y: 50,
                opacity: 0,
                    duration: 1.2,
                    delay: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 85%',
                    toggleActions: 'play none none none',
                },
            });

                // Animate the highlighted span separately with scale effect
                const highlightSpan = titleRef.current.querySelector('span');
                if (highlightSpan) {
                    gsap.from(highlightSpan, {
                        scale: 0.5,
                        opacity: 0,
                        duration: 0.8,
                        delay: 0.8,
                        ease: 'back.out(1.7)',
                        scrollTrigger: {
                            trigger: titleRef.current,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    });
                }
            }

            // Animate paragraphs with fade and slide
            if (paragraph1Ref.current) {
                gsap.from(paragraph1Ref.current, {
                    y: 30,
                    opacity: 0,
                    duration: 1,
                    delay: 0.4,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: paragraph1Ref.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                });
            }

            if (paragraph2Ref.current) {
                gsap.from(paragraph2Ref.current, {
                    y: 30,
                opacity: 0,
                duration: 1,
                    delay: 0.6,
                ease: 'power3.out',
                scrollTrigger: {
                        trigger: paragraph2Ref.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                });
            }

            // Animate button with scale and bounce
            if (buttonRef.current) {
                gsap.from(buttonRef.current, {
                    scale: 0.8,
                    opacity: 0,
                    y: 20,
                    duration: 0.8,
                    delay: 0.8,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: buttonRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    },
                });

                // Button hover animation
                buttonRef.current.addEventListener('mouseenter', () => {
                    gsap.to(buttonRef.current, {
                        scale: 1.05,
                        y: -3,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                });

                buttonRef.current.addEventListener('mouseleave', () => {
                    gsap.to(buttonRef.current, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: 'power2.out',
                    });
                });
            }

            // Animate decorative circle
            const decorativeCircle = imageGridRef.current?.parentElement?.querySelector('.decorative-circle');
            if (decorativeCircle) {
                gsap.from(decorativeCircle, {
                    scale: 0,
                    opacity: 0,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: imageGridRef.current,
                        start: 'top 80%',
                    toggleActions: 'play none none none',
                },
            });

                // Continuous rotation animation
                gsap.to(decorativeCircle, {
                    rotation: 360,
                    duration: 20,
                    repeat: -1,
                    ease: 'none',
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, [gsap, ScrollTrigger, isLoaded]);

    return (
        <section ref={sectionRef} className="py-16 md:py-24 lg:py-32 bg-spiritual-zen-surface relative overflow-hidden">
            {/* Background Decoration */}
            <div ref={bgDecor1Ref} className="absolute top-0 right-0 w-96 h-96 bg-spiritual-saffron/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div ref={bgDecor2Ref} className="absolute bottom-0 left-0 w-96 h-96 bg-spiritual-navy/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <Container>
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
                    {/* Image Grid */}
                    <div ref={imageGridRef} className="relative">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-4 md:space-y-6 mt-8">
                                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden welcome-image shadow-xl group cursor-pointer transition-transform duration-700 hover:scale-105">
                                    <SkeletonImage
                                        src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&q=80"
                                        alt="Community volunteers serving together"
                                        fill
                                        className="rounded-2xl h-full w-full"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                                </div>
                                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden welcome-image shadow-xl group cursor-pointer transition-transform duration-700 hover:scale-105">
                                    <SkeletonImage
                                        src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
                                        alt="Children receiving education and care"
                                        fill
                                        className="rounded-2xl h-full w-full"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                                </div>
                            </div>
                            <div className="space-y-4 md:space-y-6">
                                <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden welcome-image shadow-xl group cursor-pointer transition-transform duration-700 hover:scale-105">
                                    <SkeletonImage
                                        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80"
                                        alt="Langar seva - community kitchen"
                                        fill
                                        className="rounded-2xl h-full w-full"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                                </div>
                                <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden welcome-image shadow-xl group cursor-pointer transition-transform duration-700 hover:scale-105">
                                    <SkeletonImage
                                        src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80"
                                        alt="Medical care and support services"
                                        fill
                                        className="rounded-2xl h-full w-full"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                                </div>
                            </div>
                        </div>
                        {/* Decorative Circle */}
                        <div className="decorative-circle absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-spiritual-saffron/10 rounded-full blur-3xl" />
                    </div>

                    {/* Content */}
                    <div ref={contentRef} className="welcome-content">
                        <div ref={badgeRef} className="flex items-center gap-4 mb-4">
                            <span className="h-1 w-12 bg-spiritual-saffron rounded-full" />
                            <span className="text-spiritual-saffron font-bold uppercase tracking-wider text-sm">
                                About Us
                            </span>
                        </div>
                        <h2 ref={titleRef} className="text-4xl md:text-5xl lg:text-6xl font-bold text-spiritual-navy mb-6 leading-tight">
                            Welcome to <span className="text-spiritual-saffron">Ollo</span> Charity
                        </h2>
                        <p ref={paragraph1Ref} className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
                            For over 150 years, Sant Seva Charitable Trust has been a beacon of hope and service in our
                            community. We are confident to confirm that all members in our organization are professionals
                            dedicated to charity work, bringing extensive experience in the field with expert consultation
                            and community-focused events for those in need.
                        </p>
                        <p ref={paragraph2Ref} className="text-base md:text-lg text-gray-600 mb-10 leading-relaxed">
                            Our long-term working experience effectively brings us achievement. Our mission is to provide
                            great results for those we serve, on time and with compassion. If you have any questions
                            relating to our services, please reach out to us and we will try our best to address your
                            concerns and help you get involved in our mission.
                        </p>

                        <Link ref={buttonRef} href="/spiritual/about">
                            <Button
                                variant="primary"
                                className="group bg-spiritual-saffron text-white hover:bg-spiritual-saffronDark rounded-full px-10 py-4 md:px-12 md:py-5 uppercase tracking-wider font-bold text-sm md:text-base shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                More About Us
                                <svg
                                    className="w-5 h-5 ml-2 inline-block transform group-hover:translate-x-1 transition-transform"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    );
}
