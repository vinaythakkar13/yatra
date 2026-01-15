import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { AppProvider } from '@/contexts/AppContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  
  // Check if current page is an admin page (including admin login)
  const isAdminPage = router.pathname.startsWith('/admin');

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Component {...pageProps} />
        </main>
        {/* Hide footer on admin pages */}
        {!isAdminPage && <Footer />}
      </div>
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
      />
    </AppProvider>
  );
}

