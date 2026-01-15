/**
 * Custom hook for GSAP animations with reduced motion support
 */

import { useEffect, useRef } from 'react';

export function useGSAP() {
    const gsapRef = useRef<typeof import('gsap').gsap | null>(null);
    const ScrollTriggerRef = useRef<typeof import('gsap/ScrollTrigger').ScrollTrigger | null>(null);

    useEffect(() => {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            return; // Don't load GSAP if user prefers reduced motion
        }

        // Dynamically import GSAP only when needed
        import('gsap').then((gsapModule) => {
            gsapRef.current = gsapModule.gsap;

            // Also import ScrollTrigger
            import('gsap/ScrollTrigger').then((scrollModule) => {
                ScrollTriggerRef.current = scrollModule.ScrollTrigger;
                gsapRef.current?.registerPlugin(scrollModule.ScrollTrigger);
            });
        });

        return () => {
            // Cleanup
            if (ScrollTriggerRef.current) {
                ScrollTriggerRef.current.killAll();
            }
        };
    }, []);

    return {
        gsap: gsapRef.current,
        ScrollTrigger: ScrollTriggerRef.current,
        isLoaded: gsapRef.current !== null,
    };
}
