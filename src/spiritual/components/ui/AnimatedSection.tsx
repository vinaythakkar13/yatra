/**
 * Animated Section Component
 * Wrapper that triggers GSAP animations on scroll
 */

'use client';

import React, { useEffect, useRef, ReactNode } from 'react';
import { useGSAP } from '../../hooks/useGSAP';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'scaleIn';
    delay?: number;
}

export default function AnimatedSection({
    children,
    className = '',
    animation = 'fadeInUp',
    delay = 0,
}: AnimatedSectionProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { gsap, ScrollTrigger, isLoaded } = useGSAP();

    useEffect(() => {
        if (!isLoaded || !gsap || !ScrollTrigger || !sectionRef.current) return;

        const animations = {
            fadeIn: {
                opacity: 0,
                duration: 0.6,
                ease: 'power2.out',
            },
            fadeInUp: {
                opacity: 0,
                y: 30,
                duration: 0.8,
                ease: 'power3.out',
            },
            fadeInDown: {
                opacity: 0,
                y: -30,
                duration: 0.8,
                ease: 'power3.out',
            },
            scaleIn: {
                opacity: 0,
                scale: 0.9,
                duration: 0.6,
                ease: 'back.out(1.7)',
            },
        };

        const ctx = gsap.context(() => {
            gsap.from(sectionRef.current, {
                ...animations[animation],
                delay,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    end: 'top 20%',
                    toggleActions: 'play none none none',
                },
            });
        });

        return () => ctx.revert();
    }, [isLoaded, gsap, ScrollTrigger, animation, delay]);

    return (
        <div ref={sectionRef} className={className}>
            {children}
        </div>
    );
}
