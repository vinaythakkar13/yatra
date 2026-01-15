'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Odometer to avoid SSR issues
const Odometer = dynamic(() => import('react-odometerjs').then((mod) => mod.default || mod), {
  ssr: false,
  loading: () => <span className="inline-block">0</span>,
});

interface CounterProps {
  value: string;
  duration?: number;
  className?: string;
}

export default function Counter({ value, duration = 2, className = '' }: CounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isOdometerReady, setIsOdometerReady] = useState(false);

  const counterRef = useRef<HTMLSpanElement>(null);

  // Ensure component is mounted before rendering Odometer
  useEffect(() => {
    setIsMounted(true);
    // Small delay to ensure Odometer is loaded
    const timer = setTimeout(() => {
      setIsOdometerReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ----------------------------------------------------
  // Parse numeric + suffix
  // ----------------------------------------------------
  const parseValue = (val: string) => {
    const cleaned = val.replace(/,/g, '').replace(/\+/g, '');
    const hasPlus = val.includes('+');
    const hasComma = val.includes(',');

    if (cleaned.includes('M')) {
      return {
        numeric: parseFloat(cleaned.replace('M', '')) * 1_000_000,
        suffix: 'M',
        hasPlus,
        hasComma,
      };
    }

    if (cleaned.includes('K')) {
      return {
        numeric: parseFloat(cleaned.replace('K', '')) * 1_000,
        suffix: 'K',
        hasPlus,
        hasComma,
      };
    }

    return {
      numeric: parseFloat(cleaned),
      suffix: '',
      hasPlus,
      hasComma,
    };
  };

  const { numeric, suffix, hasPlus } = parseValue(value);

  // ----------------------------------------------------
  // Intersection Observer → Trigger animation once
  // ----------------------------------------------------
  useEffect(() => {
    if (!counterRef.current || !isMounted || !isOdometerReady) return;

    // Function to trigger animation
    const triggerAnimation = () => {
      if (!hasAnimated) {
        setHasAnimated(true);
        // Small delay to ensure Odometer is fully initialized
        setTimeout(() => {
          setDisplayValue(numeric);
        }, 50);
      }
    };

    // Check if element is already visible (for elements above the fold)
    const checkVisibility = () => {
    if (!counterRef.current) return;
      const rect = counterRef.current.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      if (isVisible) {
        triggerAnimation();
        return true;
      }
      return false;
    };

    // Check immediately if already visible
    if (checkVisibility()) {
      return;
    }

    // Set up IntersectionObserver for elements not yet visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerAnimation();
            observer.disconnect(); // Disconnect after triggering
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(counterRef.current);

    // Fallback: trigger after 1 second if still not visible
    const fallbackTimer = setTimeout(() => {
      if (!hasAnimated) {
        triggerAnimation();
      }
      observer.disconnect();
    }, 1000);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [numeric, hasAnimated, isMounted, isOdometerReady]);

  // Show loading state during SSR
  if (!isMounted || !isOdometerReady) {
    return (
      <span ref={counterRef} className={`inline-flex items-center ${className}`}>
        0{suffix}
        {hasPlus && '+'}
      </span>
    );
  }

  return (
    <span ref={counterRef} className={`inline-flex items-center ${className}`}>
      {/* Animate only number */}
      {isOdometerReady && (
      <Odometer
        value={displayValue}
        duration={duration * 1000}
        format="(,ddd)" // comma formatting built in
        theme="default"
      />
      )}

      {/* Static suffixes just like your original component */}
      {suffix}
      {hasPlus && '+'}
    </span>
  );
}
