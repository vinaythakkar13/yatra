import type { Metadata } from 'next';
import { Outfit, Inter, Playfair_Display } from 'next/font/google';
import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker-custom.css';
import { ReduxProvider } from '@/store/Provider';
import { AppProvider } from '@/contexts/AppContext';
import { ToastContainer } from 'react-toastify';
import ClientLayoutWrapper from './components/ClientLayoutWrapper';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yatra Management System - Manage your pilgrimage journey',
  description: 'Manage your pilgrimage journey with Yatra Management System',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="en" 
      className={`${outfit.variable} ${inter.variable} ${playfairDisplay.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ReduxProvider>
          <AppProvider>
            <ClientLayoutWrapper>
              {children}
            </ClientLayoutWrapper>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              style={{ zIndex: 99999 }}
            />
          </AppProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

