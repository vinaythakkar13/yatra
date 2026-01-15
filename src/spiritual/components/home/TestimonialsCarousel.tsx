/**
 * Professional Testimonials Carousel Component
 * Center-focused slider with smooth scaling and opacity effects
 * Matches reference design with theme-appropriate styling
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import Container from '../common/Container';
import AnimatedSection from '../ui/AnimatedSection';
import SkeletonImage from '../ui/SkeletonImage';
import { useWindowSize } from '@/utils/useViewPort';

// Passport-size profile photos from Unsplash
const dummyImages = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
];

const testimonials = [
    {
        quote:
            'Waheguru! This organization is truly doing God\'s work. When my father needed emergency heart surgery, they not only provided free treatment but also ensured our family had langar every day. The doctors here treat patients with such compassion and respect. This is real seva.',
        name: 'Gurpreet Singh',
    },
    {
        quote:
            'I started receiving The Inside Track during my final semester of university, and it transformed how I approached the job market. The tips on networking, market insights, and interview prep gave me a serious advantage. Within weeks, I landed an interview at a top-tier finance firm.',
        name: 'Emily R.',
    },
    {
        quote:
            'Sat Sri Akal! The Ayurveda wing here is a blessing. They treat not just the body but the soul. After years of chronic pain, their holistic approach—medication, meditation, and proper nutrition—has given me a new lease on life. The volunteers here are angels.',
        name: 'Amita Sharma',
    },
    {
        quote:
            'I am the first in my family to go to college, all thanks to this organization\'s scholarship program. They didn\'t just give me money—they mentored me, believed in me, and showed me that dreams can come true. I am now an engineer, and I will forever be grateful.',
        name: 'Rajesh Kumar',
    },
    {
        quote:
            'Langar seva here has transformed my life. Every Sunday, I come here to serve, and I leave with a heart full of gratitude. The sense of community, the prayers, the selfless service—this is what humanity should be. I have found my purpose here.',
        name: 'Harpreet Kaur',
    },
    {
        quote:
            'When the medical camp came to our remote village, I thought my daughter wouldn\'t survive. But these doctors saved her life, and they did it for free. They even arranged follow-up care. This organization reaches places where government services don\'t. They are true heroes.',
        name: 'Priya Devi',
    },
    {
        quote:
            'As a regular donor, I have seen firsthand how transparent and impactful this organization is. Every rupee I donate goes directly to those in need. They send detailed reports, photos, and stories. This is how charity should work—with complete transparency and accountability.',
        name: 'Amit Patel',
    },
    {
        quote:
            'My children were struggling in school because we couldn\'t afford books or a smartphone. This organization provided everything—books, tablets, and even free tutoring. Now my children are top performers. Education is a right, not a privilege, and they make it accessible.',
        name: 'Sunita Mehta',
    },
];

export default function TestimonialsCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);
    const { width } = useWindowSize();

    // Responsive items per slide: 1 on mobile (< 768px), 2 on tablet (768px - 1169px), 3 on desktop (>= 1170px)
    const getItemsPerSlide = () => {
        if (width === 0) return 3; // Default during SSR
        if (width < 768) return 1; // Mobile
        if (width < 1170) return 2; // Tablet
        return 3; // Desktop
    };

    const itemsPerSlide = getItemsPerSlide();
    const totalItems = testimonials.length;

    // Calculate which items to display based on center-focused design
    const getDisplayItems = () => {
        const items: Array<{ index: number; isCenter: boolean }> = [];
        
        if (itemsPerSlide === 1) {
            // Mobile: show only center item
            items.push({ index: currentIndex, isCenter: true });
        } else if (itemsPerSlide === 2) {
            // Tablet: show center and next
            items.push({ index: currentIndex, isCenter: true });
            items.push({ index: (currentIndex + 1) % totalItems, isCenter: false });
        } else {
            // Desktop: show previous, center, and next
            items.push({ index: (currentIndex - 1 + totalItems) % totalItems, isCenter: false });
            items.push({ index: currentIndex, isCenter: true });
            items.push({ index: (currentIndex + 1) % totalItems, isCenter: false });
        }
        
        return items;
    };

    // Auto-slide functionality with infinite loop
    useEffect(() => {
        if (isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => {
                const next = prev + 1;
                // Infinite loop: when reaching the end, go back to start
                return next >= totalItems ? 0 : next;
            });
        }, 8500); // Match reference timing

        return () => clearInterval(timer);
    }, [isPaused, totalItems]);

    // Reset to first slide when itemsPerSlide changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [itemsPerSlide]);

    // Touch/swipe handlers for mobile
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        
        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            // Swipe left - next (infinite loop)
            setCurrentIndex((prev) => {
                const next = prev + 1;
                return next >= totalItems ? 0 : next;
            });
        } else if (distance < -minSwipeDistance) {
            // Swipe right - previous (infinite loop)
            setCurrentIndex((prev) => {
                const prevIndex = prev - 1;
                return prevIndex < 0 ? totalItems - 1 : prevIndex;
            });
        }

        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const goToSlide = (index: number) => {
        if (index >= 0 && index < totalItems) {
            setCurrentIndex(index);
        }
    };

    const displayItems = getDisplayItems();

    return (
        <section className="py-16 md:py-20 lg:py-24 bg-spiritual-zen-surface relative overflow-hidden">
            <Container className="relative z-10">
                <AnimatedSection animation="fadeInUp" className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-spiritual-navy mb-4">
                        Voices from Our Community
                    </h2>
                </AnimatedSection>

                {/* Carousel Container */}
                <div
                    ref={carouselRef}
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Carousel Wrapper */}
                    <div className="overflow-hidden w-full px-4 md:px-8 lg:px-12">
                        <div className="flex items-center justify-center gap-4 md:gap-6 lg:gap-8 w-full">
                            {displayItems.map(({ index, isCenter }) => {
                                const testimonial = testimonials[index];
                                const imageSrc = dummyImages[index % dummyImages.length];
                                
                                return (
                                    <div
                                        key={`${testimonial.name}-${index}`}
                                        className={`flex-shrink-0 transition-all duration-500 ease-in-out ${
                                            isCenter
                                                ? 'opacity-100 scale-100 z-10'
                                                : 'opacity-20 scale-80 z-0'
                                        }`}
                                        style={{
                                            width: itemsPerSlide === 1 
                                                ? '100%' 
                                                : itemsPerSlide === 2 
                                                    ? 'calc(50% - 12px)' 
                                                    : 'calc(33.333% - 21.33px)',
                                            maxWidth: itemsPerSlide === 1 ? '100%' : '400px',
                                            flexBasis: itemsPerSlide === 1 
                                                ? '100%' 
                                                : itemsPerSlide === 2 
                                                    ? 'calc(50% - 12px)' 
                                                    : 'calc(33.333% - 21.33px)',
                                        }}
                                    >
                                        <div className="text-center px-2 md:px-4 lg:px-6 pb-16 md:pb-20 lg:pb-24">
                                            {/* Shadow Effect Card */}
                                            <div className="bg-white rounded-lg border border-spiritual-zen-highlight shadow-[0_19px_38px_rgba(0,0,0,0.10),0_15px_12px_rgba(0,0,0,0.02)] p-5 md:p-6 lg:p-8">
                                                {/* Profile Image */}
                                                <div className="flex justify-center mb-4 md:mb-5">
                                                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0">
                                                        <SkeletonImage
                                                            src={imageSrc || dummyImages[0]}
                                                            alt={testimonial.name}
                                                            width={96}
                                                            height={96}
                                                            className="rounded-full object-cover w-full h-full"
                                                            objectFit="cover"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Testimonial Text */}
                                                <p className="font-sans text-base md:text-lg lg:text-xl text-spiritual-text leading-relaxed mb-4 md:mb-5 font-light">
                                                    {testimonial.quote}
                                                </p>
                                            </div>

                                            {/* Testimonial Name Badge */}
                                            <div className="mt-[-17px] mx-auto inline-block bg-spiritual-saffron px-6 md:px-8 lg:px-10 py-2 md:py-2.5 rounded-xl text-white text-sm md:text-base font-semibold shadow-[0_9px_18px_rgba(0,0,0,0.12),0_5px_7px_rgba(0,0,0,0.05)]">
                                                {testimonial.name.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className="flex justify-center items-center gap-2 mt-8 md:mt-12">
                    {testimonials.map((_, index) => {
                        const isActive = index === currentIndex;
                        return (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className="inline-block transition-all duration-250 ease-out rounded-full bg-spiritual-saffron hover:bg-spiritual-saffronDark"
                                style={{
                                    width: '20px',
                                    height: '20px',
                                    transform: isActive 
                                        ? 'translate3d(0px, -50%, 0px) scale(0.7)' 
                                        : 'translate3d(0px, -50%, 0px) scale(0.3)',
                                    transformOrigin: '50% 50% 0',
                                }}
                                aria-label={`Go to testimonial ${index + 1}`}
                            />
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}

