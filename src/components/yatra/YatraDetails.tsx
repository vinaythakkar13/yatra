'use client';

import { useGetYatraByIdQuery } from '@/services/yatraApi';
import { Calendar, MapPin, Clock, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

interface YatraDetailsProps {
  yatraId: string;
}

/**
 * YatraDetails Component
 * 
 * Example usage of RTK Query with loading and error states
 * Fetches yatra details by ID using the getYatraById endpoint
 */
export default function YatraDetails({ yatraId }: YatraDetailsProps) {
  // RTK Query hook - automatically handles loading, error, and data states
  const {
    data: yatra,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useGetYatraByIdQuery(yatraId, {
    // Skip query if no ID provided
    skip: !yatraId,
    // Refetch options
    refetchOnMountOrArgChange: true,
  });

  // Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
        <p className="text-gray-600 text-lg">Loading yatra details...</p>
        {isFetching && (
          <p className="text-sm text-gray-500 mt-2">Refreshing data...</p>
        )}
      </div>
    );
  }

  // Error State
  if (isError) {
    const errorMessage = 
      (error as any)?.data?.message || 
      (error as any)?.message || 
      'Failed to load yatra details';

    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Yatra
              </h3>
              <p className="text-red-700 mb-4">{errorMessage}</p>
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No Data State
  if (!yatra) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <p className="text-gray-600 text-lg">No yatra found with this ID</p>
      </div>
    );
  }

  // Success State - Display Yatra Details
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner Image */}
      {yatra.banner_image && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={yatra.banner_image}
            alt={yatra.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Yatra Information */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {yatra.name}
        </h1>

        {yatra.description && (
          <p className="text-gray-600 text-lg mb-6 leading-relaxed">
            {yatra.description}
          </p>
        )}

        {/* Date Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Start Date</p>
              <p className="text-gray-900 font-medium">{formatDate(yatra.start_date)}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
            <Calendar className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">End Date</p>
              <p className="text-gray-900 font-medium">{formatDate(yatra.end_date)}</p>
            </div>
          </div>
        </div>

        {/* Registration Dates */}
        {(yatra.registration_start_date || yatra.registration_end_date) && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Registration Period</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {yatra.registration_start_date && (
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Registration Opens</p>
                    <p className="text-gray-900 font-medium">{formatDate(yatra.registration_start_date)}</p>
                  </div>
                </div>
              )}

              {yatra.registration_end_date && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Registration Closes</p>
                    <p className="text-gray-900 font-medium">{formatDate(yatra.registration_end_date)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>Yatra ID: {yatra.id}</span>
          </div>
          {yatra.createdAt && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
              <Clock className="w-4 h-4" />
              <span>Created: {formatDate(yatra.createdAt)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

