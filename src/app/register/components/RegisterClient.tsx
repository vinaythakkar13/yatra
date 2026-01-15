'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetYatraByIdQuery } from '@/services/yatraApi';
import RegistrationForm from '@/components/register/RegistrationForm';
import RegisterLoading from './RegisterLoading';
import RegisterError from './RegisterError';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react';
import { Yatra } from '@/types';

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function RegisterClient() {
  const searchParams = useSearchParams();
  const yatraId = searchParams.get('yatraId');
  const initialPnr = searchParams.get('pnr') || '';

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Use RTK Query to fetch yatra details
  const {
    data: yatraDetails,
    isLoading,
    isError,
    error,
  } = useGetYatraByIdQuery(yatraId!, {
    skip: !yatraId, // Skip query if no yatraId
  });

  // No yatraId provided
  if (!yatraId) {
    return <RegisterError />;
  }

  // Loading state
  if (isLoading) {
    return <RegisterLoading />;
  }

  // Error state
  if (isError || !yatraDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-spiritual-zen-surface p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-red-200 p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-spiritual-zen-charcoal mb-3">
            Error Loading Yatra
          </h2>
          <p className="text-spiritual-textLight mb-6">
            {error && 'data' in error
              ? (error.data as { message?: string })?.message || 'Failed to load yatra details'
              : 'Failed to load yatra details'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render registration form
  return (
    <div className="min-h-screen bg-spiritual-zen-surface">
      {/* Hero Banner Section with Yatra Image */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden">
        {/* Banner Image */}
        {yatraDetails.banner_image ? (
          <Image
            src={yatraDetails.banner_image}
            alt={yatraDetails.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-spiritual-zen-forest via-spiritual-zen-accent to-spiritual-zen-forest" />
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4 sm:pt-6">
            {/* Back Button */}
            <Link href="/" className="inline-flex items-center mb-4 sm:mb-6 group">
              <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/30 group-hover:scale-105">
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </Link>
          </div>

          {/* Yatra Name and Dates */}
          <div className="flex-1 flex items-end pb-6 sm:pb-8 md:pb-10">
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
              <div className="space-y-4">
                {/* Yatra Name */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight">
                  {yatraDetails.name}
                </h1>

                {/* Yatra Dates */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  {yatraDetails.start_date && (
                    <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 border border-white/20">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm text-white/80 font-medium">Start Date</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-white">
                          {formatDate(yatraDetails.start_date)}
                        </p>
                      </div>
                    </div>
                  )}

                  {yatraDetails.end_date && (
                    <div className="flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-md rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 border border-white/20">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                      <div>
                        <p className="text-xs sm:text-sm text-white/80 font-medium">End Date</p>
                        <p className="text-sm sm:text-base md:text-lg font-bold text-white">
                          {formatDate(yatraDetails.end_date)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 md:py-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-spiritual-zen-accent/20 p-4 sm:p-6 md:p-8">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-spiritual-zen-charcoal mb-1">
              Registration Form
            </h2>
            <p className="text-sm text-spiritual-textLight">
              Fill in all required details
            </p>
          </div>

          <RegistrationForm
            yatraDetails={yatraDetails as Yatra}
            initialPnr={initialPnr}
          />
        </div>
      </div>
    </div>
  );
}

