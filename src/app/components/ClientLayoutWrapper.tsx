'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current page is an admin page
  const isAdminPage = pathname.startsWith('/admin');
  // Check if current page is a spiritual module page
  const isSpiritualPage = pathname.startsWith('/spiritual');

  // Admin Layout
  if (isAdminPage) {
    return (
      <div className="min-h-screen font-inter">
        {children}
      </div>
    );
  }

  // Spiritual Module Layout - No global header/footer, full width
  if (isSpiritualPage) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  // Default User Layout
  return (
    <div className="min-h-screen flex flex-col animate-fade-in bg-spiritual-zen-surface font-sans antialiased">
      <Header />
      <main className="w-screen max-w-full pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}

