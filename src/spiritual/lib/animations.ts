/**
 * GSAP animation presets for consistent animations across the site
 */

import { gsap } from 'gsap';

export const animationPresets = {
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

    staggerChildren: {
        stagger: 0.1,
        duration: 0.6,
    },
};

export const slideTransition = {
    duration: 1,
    ease: 'power2.inOut',
};

export function createScrollAnimation(
    element: HTMLElement | string,
    animation: gsap.TweenVars,
    triggerOptions?: ScrollTrigger.Vars
) {
    return gsap.from(element, {
        ...animation,
        scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none none',
            ...triggerOptions,
        },
    });
}
