'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardStats from '@/components/admin/dashboard/DashboardStats';
import RegistrationInfographics from '@/components/admin/dashboard/RegistrationInfographics';
import HotelInfographics from '@/components/admin/dashboard/HotelInfographics';
import { yatraStorage } from '@/utils/storage';
import { useGetDashboardDataQuery } from '@/services/dashboardApi';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const [selectedYatraId, setSelectedYatraId] = useState<string | null>(null);

  useEffect(() => {
    // Sync with localStorage
    const interval = setInterval(() => {
      const id = yatraStorage.getSelectedYatraId();
      if (id !== selectedYatraId) {
        setSelectedYatraId(id);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedYatraId]);

  // Fetch real data from API
  const { data, isLoading, error, refetch } = useGetDashboardDataQuery(selectedYatraId!, {
    skip: !selectedYatraId,
  });

  const dashboardData = data || null;

  if (!selectedYatraId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-heritage-primary/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl text-heritage-primary">📍</span>
        </div>
        <h3 className="text-2xl font-bold text-heritage-textDark mb-3">Please select a Yatra</h3>
        <p className="text-heritage-text/70 max-w-sm">
          Please select a specific Yatra from the dropdown above to view its detailed dashboard and analytics.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-heritage-primary animate-spin mb-4" />
        <p className="text-heritage-text font-medium animate-pulse">Loading dashboard insights...</p>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-8 bg-orange-50 border border-orange-200 rounded-glass text-center animate-fade-in shadow-glass-soft">
        <h3 className="text-orange-800 font-bold text-lg mb-2">Notice: Data Unavailable</h3>
        <p className="text-orange-600 mb-6 max-w-md mx-auto">
          We couldn't fetch the latest data for this Yatra.
          Please check your connection or try again.
        </p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-heritage-primary text-white rounded-xl font-bold hover:bg-heritage-secondary transition-colors shadow-lg"
        >
          Check API Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedYatraId || 'default'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top Summary Stats */}
          <DashboardStats stats={dashboardData?.stats} />

          {/* Registration Insights */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-heritage-textDark mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-heritage-primary rounded-full"></span>
              Registration Insights
            </h2>
            <RegistrationInfographics
              stateData={dashboardData?.registrationsAnalytics?.stateData}
              genderData={dashboardData?.registrationsAnalytics?.genderData}
              ageData={dashboardData?.registrationsAnalytics?.ageData}
              handicapCount={dashboardData?.registrationsAnalytics?.handicapCount}
            />
          </div>

          {/* Accommodation Status */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-heritage-textDark mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-heritage-secondary rounded-full"></span>
              Accommodation Status
            </h2>
            <HotelInfographics hotelAvailability={dashboardData.hotelAnalytics} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;