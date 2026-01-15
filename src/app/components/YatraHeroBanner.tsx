import { Yatra } from '@/types';
import YatraHeroBannerClient from './YatraHeroBannerClient';

async function getActiveYatras(): Promise<Yatra[]> {
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
      cache: 'no-store', // Ensure fresh data on each request
    });

    if (!response.ok) {
      console.error(`Failed to fetch active yatras: ${response.status}`);
      return [];
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
    
    return uniqueYatras;
  } catch (error) {
    console.error('Error fetching active yatras:', error);
    return [];
  }
}

export default async function YatraHeroBanner() {
  const yatras = await getActiveYatras();

  // Don't render if no yatras
  if (!yatras || yatras.length === 0) {
    return null;
  }

  return <YatraHeroBannerClient yatras={yatras} />;
}

