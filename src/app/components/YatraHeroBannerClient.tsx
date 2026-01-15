'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Yatra } from '@/types';
import Button from '@/components/ui/Button';

interface YatraHeroBannerClientProps {
  yatras: Yatra[];
}

export default function YatraHeroBannerClient({ yatras }: YatraHeroBannerClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying && yatras.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % yatras.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, yatras.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + yatras.length) % yatras.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % yatras.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentYatra = yatras[currentIndex];

  if (!currentYatra) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl shadow-2xl mb-8 group">
      {/* Background Image */}
      <div className="absolute inset-0">
        {currentYatra.banner_image ? (
          <Image
            src={currentYatra.banner_image}
            alt={currentYatra.name}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4 border border-white/30">
            <span className="text-white text-sm font-semibold uppercase tracking-wider">
              Active Yatra
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            {currentYatra.name}
          </h1>

          {/* Description */}
          {currentYatra.description && (
            <p className="text-lg md:text-xl text-white/90 mb-6 line-clamp-2">
              {currentYatra.description}
            </p>
          )}

          {/* Date Info */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 text-white">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">
                {formatDate(currentYatra.start_date)} - {formatDate(currentYatra.end_date)}
              </span>
            </div>
            {currentYatra.registration_start_date && currentYatra.registration_end_date && (
              <div className="flex items-center gap-2 text-white/80">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">
                  Registration: {formatDate(currentYatra.registration_start_date)} - {formatDate(currentYatra.registration_end_date)}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => router.push('/register')}
              className="bg-white text-primary-600 hover:bg-white/90 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Register Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/history')}
              className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-semibold px-6 py-3 rounded-lg transition-all duration-300"
            >
              Track Booking
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {yatras.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {yatras.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {yatras.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {yatras.length > 1 && isAutoPlaying && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-5000 ease-linear"
            style={{
              width: `${((currentIndex + 1) / yatras.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

