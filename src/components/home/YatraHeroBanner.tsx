'use client';
import { useState, useEffect } from 'react';
import { Yatra } from '@/types';
import YatraHeroBannerClient from '@/app/components/YatraHeroBannerClient';

export default function YatraHeroBanner() {
  const [yatras, setYatras] = useState<Yatra[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchActiveYatras() {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const response = await fetch(`${API_BASE_URL}/yatra/active-yatras`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
            'x-client-version': '1.0.0',
            'x-client-platform': 'web',
          },
        });

        if (!response.ok) {
          console.error(`Failed to fetch active yatras: ${response.status}`);
          setYatras([]);
          return;
        }

        const data = await response.json();
        
        // Handle array response - API returns array of yatras
        const yatrasArray: Yatra[] = Array.isArray(data?.data) 
          ? data.data 
          : (Array.isArray(data) ? data : []);
        
        // Remove duplicates based on id
        const uniqueYatras = Array.from(
          new Map(yatrasArray.map(yatra => [yatra.id, yatra])).values()
        );
        
        setYatras(uniqueYatras);
      } catch (error) {
        console.error('Error fetching active yatras:', error);
        setYatras([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchActiveYatras();
  }, []);

  // Don't render if loading or no yatras
  if (isLoading) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-2xl shadow-2xl mb-8 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!yatras || yatras.length === 0) {
    return null;
  }

  return <YatraHeroBannerClient yatras={yatras} />;
}

