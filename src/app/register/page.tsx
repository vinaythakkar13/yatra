import { Suspense } from 'react';
import type { Metadata } from 'next';
import RegisterClient from './components/RegisterClient';
import RegisterLoading from './components/RegisterLoading';

export const metadata: Metadata = {
  title: 'Yatra Registration',
  description: 'Register for your spiritual journey with Yatra Management System.',
};

/**
 * Register Page - Server Component
 * 
 * Uses RTK Query via RegisterClient component for data fetching
 * RTK Query handles loading and error states automatically
 * 
 * The getYatraById function has been moved to src/services/yatraApi.ts
 * and is accessed via useGetYatraByIdQuery hook in RegisterClient
 */
export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterLoading />}>
      <RegisterClient />
    </Suspense>
  );
}
