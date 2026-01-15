'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, ChevronLeft, ChevronRight, Ticket, MapPin } from 'lucide-react';
import { Yatra } from '@/types';

interface YatraCarouselProps {
  yatras: Yatra[];
}

/**
 * Yatra Carousel Component
 * Beautiful hero banner carousel with GSAP animations
 * Features: Navigation buttons, Register & Track buttons for each yatra
 */
export default function YatraCarousel({ yatras }: YatraCarouselProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageFallbacks, setImageFallbacks] = useState<Record<string, string>>({});
  const slideRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  // Dynamically import GSAP
  const [gsap, setGsap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setIsLoaded(false);
      return;
    }

    // Dynamically import GSAP
    import('gsap').then((gsapModule) => {
      setGsap(gsapModule.gsap);
      setIsLoaded(true);
    });
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (yatras.length <= 1) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % yatras.length);
    }, 10000);
    
    return () => clearInterval(timer);
  }, [yatras.length]);

  // GSAP animations on slide change
  useEffect(() => {
    if (!gsap || !isLoaded || !textRef.current || yatras.length === 0) return;

    const ctx = gsap.context(() => {
      const heroTexts = Array.from(textRef.current?.querySelectorAll('.hero-text') || []);
      const heroButtons = Array.from(textRef.current?.querySelectorAll('.hero-button') || []);

      // Fade out current content
      gsap.to([...heroTexts, ...heroButtons], {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
      });

      // After fade out, reset and animate new content
      gsap.delayedCall(0.4, () => {
        gsap.set(heroTexts, { y: 40, opacity: 0, clearProps: 'scale' });
        gsap.set(heroButtons, { scale: 0.8, opacity: 0, y: 20, clearProps: 'x' });

        // Animate text with stagger
        gsap.to(heroTexts, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power3.out',
        });

        // Animate buttons with bounce
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
  }, [currentSlide, gsap, isLoaded, yatras.length]);

  // Initial page load animation
  useEffect(() => {
    if (!gsap || !isLoaded || !textRef.current || yatras.length === 0) return;

    const ctx = gsap.context(() => {
      // Animate background image
      gsap.from('.yatra-slide-image', {
        scale: 1.1,
        duration: 1.5,
        ease: 'power2.out',
      });

      const heroTexts = Array.from(textRef.current?.querySelectorAll('.hero-text') || []);
      const heroButtons = Array.from(textRef.current?.querySelectorAll('.hero-button') || []);

      gsap.set(heroTexts, { y: 40, opacity: 0 });
      gsap.set(heroButtons, { scale: 0.8, opacity: 0, y: 20 });

      gsap.to(heroTexts, {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        delay: 0.3,
        ease: 'power3.out',
      });

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
  }, [gsap, isLoaded, yatras.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % yatras.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + yatras.length) % yatras.length);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isRegistrationOpen = (yatra: Yatra) => {
    const now = new Date();
    const regStart = new Date(yatra.registration_start_date);
    const regEnd = new Date(yatra.registration_end_date);
    return now >= regStart && now <= regEnd;
  };

  if (yatras.length === 0) return null;

  const currentYatra = yatras[currentSlide];

  return (
    <section ref={slideRef} className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-spiritual-zen-charcoal">
      {/* Slides Container */}
      {yatras.map((yatra, index) => (
        <div
          key={yatra.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          {/* Background Image */}
          <div className="yatra-slide-image absolute inset-0">
            {yatra.banner_image ? (
              <Image
                src={imageFallbacks[yatra.id] || yatra.banner_image}
                alt={yatra.name}
                fill
                className="object-cover"
                priority={index === 0}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src.includes('dummyimage')) return;
                  setImageFallbacks((prev) => ({
                    ...prev,
                    [yatra.id]: `https://dummyimage.com/1920x1080/3D6A54/ffffff&text=${encodeURIComponent(yatra.name)}`,
                  }));
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-spiritual-zen-forest to-spiritual-zen-charcoal flex items-center justify-center">
                <Ticket className="w-32 h-32 text-white/20" />
              </div>
            )}
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-spiritual-zen-charcoal/85 via-spiritual-zen-charcoal/60 to-spiritual-zen-charcoal/80 z-10" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div ref={textRef} className="text-center max-w-5xl mx-auto">
            
            {/* Main Heading */}
            <h1 className="hero-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight drop-shadow-2xl">
                {currentYatra.name}
            </h1>

            {/* Dates Info */}
            <div className="hero-text flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6 md:mb-8 text-white/95">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-medium">
                  {formatDate(currentYatra.start_date)} - {formatDate(currentYatra.end_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-sm md:text-base font-medium">
                  Registration: {formatDate(currentYatra.registration_start_date)} - {formatDate(currentYatra.registration_end_date)}
                </span>
              </div>
            </div>

            {/* Description */}
            {currentYatra.description && (
              <p className="hero-text text-sm sm:text-base md:text-lg lg:text-xl text-white/95 mb-6 md:mb-10 max-w-3xl mx-auto leading-relaxed font-normal px-2 drop-shadow-lg">
                {currentYatra.description}
              </p>
            )}

            {/* Action Buttons */}
            <div ref={buttonsRef} className="hero-button flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center">
              <button
                onClick={() => {
                  router.push(`/register?yatraId=${currentYatra.id}`);
                }}
                className="group relative bg-spiritual-zen-forest hover:bg-spiritual-zen-charcoal text-white rounded-full px-6 md:px-10 lg:px-12 py-3 md:py-4 uppercase tracking-wider text-xs md:text-sm lg:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden whitespace-nowrap border-2 border-spiritual-zen-forest"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Ticket className="w-4 h-4 md:w-5 md:h-5" />
                  Register Now
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-charcoal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <button
                onClick={() => router.push('/history')}
                className="group border-2 border-white/90 text-white hover:bg-white rounded-full px-6 md:px-10 lg:px-12 py-3 md:py-4 uppercase tracking-wider text-xs md:text-sm lg:text-base font-semibold backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:text-spiritual-zen-charcoal whitespace-nowrap"
              >
                <span className="group-hover:text-spiritual-zen-charcoal transition-colors duration-300 flex items-center gap-2">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  Track Booking
                </span>
              </button>
            </div>

            {/* Registration Status */}
            {/* {!isRegistrationOpen(currentYatra) && (
              <div className="hero-text mt-6">
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 backdrop-blur-sm border border-yellow-400/50 px-4 py-2 rounded-full text-yellow-100 text-xs md:text-sm">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date() < new Date(currentYatra.registration_start_date)
                      ? `Registration opens on ${formatDate(currentYatra.registration_start_date)}`
                      : `Registration closed on ${formatDate(currentYatra.registration_end_date)}`
                    }
                  </span>
                </div>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {yatras.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 group"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 group-hover:translate-x-1 transition-transform" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {yatras.length > 1 && (
        <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 z-30 flex justify-center gap-2 sm:gap-3">
          {yatras.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative transition-all duration-500 ease-out ${
                index === currentSlide
                  ? 'w-8 sm:w-10 md:w-12 h-2 sm:h-3 md:h-4'
                  : 'w-2 sm:w-3 md:w-4 h-2 sm:h-3 md:h-4 opacity-60 hover:opacity-100'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500 ${
                  index === currentSlide
                    ? 'bg-spiritual-zen-forest shadow-lg shadow-spiritual-zen-forest/50'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

