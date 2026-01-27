'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar, Clock, ChevronLeft, ChevronRight, Ticket, MapPin } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Yatra } from '@/types';
import { useWindowSize } from '@/utils/useViewPort';

interface YatraCarouselProps {
  yatras: Yatra[];
}

/**
 * Yatra Carousel Component
 * Beautiful hero banner carousel with GSAP animations
 * Features: Navigation buttons, Register & Track buttons for each yatra
 * Mobile banner support for optimized mobile view
 */
export default function YatraCarousel({ yatras }: YatraCarouselProps) {
  const router = useRouter();
  const [imageFallbacks, setImageFallbacks] = useState<Record<string, string>>({});
  const { width } = useWindowSize();

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

  return (
    <section className="relative h-[85vh] min-h-[600px] max-h-[900px] overflow-hidden bg-spiritual-zen-charcoal">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination]}
        effect="fade"
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        fadeEffect={{
          crossFade: true,
        }}
        navigation={{
          prevEl: '.yatra-prev',
          nextEl: '.yatra-next',
        }}
        pagination={{
          clickable: true,
          el: '.yatra-pagination',
          bulletClass: 'swiper-pagination-bullet !bg-white/50 !opacity-100 !w-3 !h-3 !mx-1 transition-all duration-300',
          bulletActiveClass: '!bg-spiritual-saffron !w-8 !rounded-full ring-2 ring-white',
        }}
        loop={yatras.length > 1}
        className="h-full w-full"
      >
        {yatras.map((yatra, index) => (
          <SwiperSlide key={yatra.id} className="h-full w-full">
            {/* Slide Image */}
            <div className="absolute inset-0">
              {yatra.banner_image ? (
                <Image
                  src={width < 768 ? yatra.mobile_banner_image || yatra.banner_image : yatra.banner_image}
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
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-spiritual-zen-charcoal md:hidden z-10" />
              <div className="hidden md:block absolute inset-0 bg-gradient-to-b from-spiritual-zen-charcoal/85 via-spiritual-zen-charcoal/60 to-spiritual-zen-charcoal/80 z-10" />
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex md:items-center md:justify-center md:pt-20 flex-col justify-end">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full md:flex md:items-center md:justify-center">
                <div className="text-center md:text-center max-w-5xl mx-auto pb-16 md:pb-0 md:pt-0">
                  {/* Main Heading */}
                  <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-2 md:mb-6 leading-tight drop-shadow-2xl">
                    {yatra.name}
                  </h1>

                  {/* Dates Info */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-2 md:gap-6 mb-3 md:mb-8 text-white/95">
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
                      <Calendar className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base font-medium">
                        {formatDate(yatra.start_date)} - {formatDate(yatra.end_date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm md:text-base font-medium">
                        Reg: {formatDate(yatra.registration_start_date)} - {formatDate(yatra.registration_end_date)}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {yatra.description && (
                    <p className="text-xs sm:text-sm md:text-lg lg:text-xl text-white/95 mb-3 md:mb-10 max-w-3xl mx-auto leading-relaxed font-normal px-2 drop-shadow-lg hidden sm:block">
                      {yatra.description}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 justify-center items-center">
                    <button
                      onClick={() => {
                        router.push(`/register?yatraId=${yatra.id}`);
                      }}
                      className="group relative bg-spiritual-zen-forest hover:bg-spiritual-zen-charcoal text-white rounded-full px-5 sm:px-6 md:px-10 lg:px-12 py-2 sm:py-3 md:py-4 uppercase tracking-wider text-xs md:text-sm lg:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden whitespace-nowrap border-2 border-spiritual-zen-forest w-full sm:w-auto"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        <Ticket className="w-4 h-4 md:w-5 md:h-5" />
                        Register Now
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-charcoal opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>

                    <button
                      onClick={() => router.push('/history')}
                      className="group border-2 border-white/90 text-white hover:bg-white rounded-full px-5 sm:px-6 md:px-10 lg:px-12 py-2 sm:py-3 md:py-4 uppercase tracking-wider text-xs md:text-sm lg:text-base font-semibold backdrop-blur-sm hover:backdrop-blur-md transition-all duration-300 transform hover:scale-105 shadow-lg hover:text-spiritual-zen-charcoal whitespace-nowrap w-full sm:w-auto"
                    >
                      <span className="group-hover:text-spiritual-zen-charcoal transition-colors duration-300 flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                        Track Booking
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      {yatras.length > 1 && (
        <>
          <button
            className="yatra-prev absolute left-2 sm:left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-white/75 border border-spiritual-zen-charcoal text-spiritual-zen-charcoal transition-all duration-300 hover:scale-110 active:scale-90 group flex items-center justify-center cursor-pointer shadow-lg"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 group-hover:-translate-x-1 transition-transform stroke-[2.5]" />
          </button>

          <button
            className="yatra-next absolute right-2 sm:right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-white/75 border border-spiritual-zen-charcoal text-spiritual-zen-charcoal transition-all duration-300 hover:scale-110 active:scale-90 group flex items-center justify-center cursor-pointer shadow-lg"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {yatras.length > 1 && (
        <div className="yatra-pagination absolute bottom-4 sm:bottom-6 md:bottom-8 left-0 right-0 z-30 flex justify-center gap-2 sm:gap-4 !w-auto h-auto mx-auto" />
      )}
    </section>
  );
}

