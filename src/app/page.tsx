import type { Metadata } from 'next';
import { Yatra } from '@/types';
import HomeClient from './components/HomeClient';

export const metadata: Metadata = {
  title: 'Yatra Management - Home',
  description: 'Manage your pilgrimage journey with Yatra Management System. Check registration status or register for your Yatra.',
};

// Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
// Equivalent to getStaticProps with revalidate in Pages Router
export const revalidate = 60;

/**
 * Fetch active yatras - Static Generation with ISR
 * Equivalent to getStaticProps in Pages Router
 * 
 * In Pages Router:
 * export async function getStaticProps() {
 *   const yatras = await getActiveYatras();
 *   return {
 *     props: { yatras },
 *     revalidate: 60, // Revalidate every 60 seconds
 *   };
 * }
 * 
 * In App Router:
 * - Use fetch with revalidate option OR
 * - Use export const revalidate = 60 (page-level)
 * - Data is statically generated at build time
 * - Revalidated every 60 seconds (ISR)
 */
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
      // Static Generation with ISR (Incremental Static Regeneration)
      // Revalidates every 60 seconds (set by export const revalidate above)
      // Equivalent to getStaticProps with revalidate: 60
      next: { revalidate: 60 },
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

/**
 * Home Page - Static Generation with ISR
 * 
 * This page is:
 * - Statically generated at build time
 * - Revalidated every 60 seconds (ISR)
 * - Equivalent to Pages Router getStaticProps pattern
 */
export default async function Home() {
  // Data is fetched at build time and revalidated every 60 seconds
  const yatras = await getActiveYatras();

  return <HomeClient yatras={yatras} />;
}


