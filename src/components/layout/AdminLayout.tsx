'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  Hotel,
  Plane,
  LogOut,
  Loader2,
  Cloud,
  Plus,
  Menu,
  X,
  LayoutGrid,
  CheckSquare,
  Scan
} from 'lucide-react';

import { tokenStorage, userStorage, yatraStorage } from '@/utils/storage';
import { toast } from 'react-toastify';
import Tooltip from '@/components/ui/Tooltip';
import SelectYatra, { YatraOption } from '../admin/SelectYatra';

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Admin Layout Component with Sidebar Navigation
 * 
 * Features:
 * - Sidebar navigation matching reference design
 * - Authentication check and protection
 * - Responsive design with mobile menu
 * - Active route highlighting
 * - User profile display
 * - Logout functionality
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const prevPathRef = React.useRef<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [selectedYatraId, setSelectedYatraId] = useState<string | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      return yatraStorage.getSelectedYatraId();
    }
    return null;
  });


  // Skip auth check for login page
  const isLoginPage = pathname === '/admin/login';

  // Define NavItem interface
  interface NavItem {
    icon: any;
    label: string;
    href: string;
    exact?: boolean;
    allowedRoles?: string[]; // Optional array of allowed roles
  }

  // Navigation items matching reference design
  const navItems: NavItem[] = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      href: '/admin',
      exact: true,
      allowedRoles: ['super_admin', 'admin']
    },
    {
      icon: Users,
      label: 'Users',
      href: '/admin/users',
      allowedRoles: ['super_admin', 'admin']
    },
    {
      icon: CheckSquare,
      label: 'User Status',
      href: '/admin/user-status',
      allowedRoles: ['super_admin', 'admin']
    },
    {
      icon: Hotel,
      label: 'Hotels',
      href: '/admin/hotels',
      allowedRoles: ['super_admin', 'admin']
    },
    {
      icon: LayoutGrid,
      label: 'Allotment',
      href: '/admin/allotment',
      allowedRoles: ['super_admin', 'admin']
    },
    {
      icon: Plane,
      label: 'Yatras',
      href: '/admin/yatras',
      allowedRoles: ['super_admin', 'admin']
    },
    {
      icon: Plus,
      label: 'Registration',
      href: '/admin/register',
      allowedRoles: ['super_admin', 'admin',]
    },
    {
      icon: Scan,
      label: 'Prasadam Scanner',
      href: '/admin/prasadam-scanner',
      allowedRoles: ['super_admin', 'admin', 'staff']
    }
  ];


  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    const storedUser = userStorage.getUser();

    if (!token || !storedUser) {
      router.push('/admin/login');
      return;
    }

    // Check if current path is allowed for the user's role
    const currentNavItem = navItems.find(item => isActiveRoute(item.href, item.exact));
    
    // Default redirect for root /admin if navigation didn't found a match (or specifically for staff)
    if (pathname === '/admin' && storedUser.role === 'staff') {
      router.push('/admin/prasadam-scanner');
      return;
    }

    if (currentNavItem && currentNavItem.allowedRoles && !currentNavItem.allowedRoles.includes(storedUser.role)) {
      toast.error('You do not have permission to access this module', { position: 'top-center' });
      router.push('/admin');
      return;
    }

    setIsAuthenticated(true);
    setIsChecking(false);
    setUser(storedUser);
  }, [router, pathname]); // Added pathname as dependency

  const handleLogout = () => {
    // Clear all tokens and user data
    tokenStorage.clearTokens();
    userStorage.removeUser();
    yatraStorage.removeSelectedYatraId();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('yatra_access_token');

    toast.success('Logged out successfully', {
      position: 'top-center',
      autoClose: 2000,
    });

    router.push('/admin/login');
  };

  const handleYatraChange = (yatra: YatraOption | null) => {
    if (yatra) {
      setSelectedYatraId(yatra.id);
      yatraStorage.setSelectedYatra(yatra);
    } else {
      setSelectedYatraId(null);
      yatraStorage.removeSelectedYatraId();
    }
  };

  const isActiveRoute = (href: string, exact: boolean = false) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  // If on login page, render children without layout
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loader while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-heritage-bgMain">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-heritage-primary animate-spin mx-auto mb-4" />
          <p className="text-heritage-text font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after checking, don't render anything (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className="min-h-screen text-heritage-text flex w-full font-inter"
      style={{
        background:
          'linear-gradient(135deg, rgba(235,168,58,0.18) 0%, rgba(250,244,230,1) 45%, rgba(252,236,209,0.85) 100%)',
      }}
    >
      {/* Sidebar - Fixed Full Height */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        h-screen
        w-20 lg:w-20 flex-shrink-0
        bg-gradient-to-b from-heritage-maroon to-heritage-textDark
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo/Cloud Icon - Fixed at Top */}
          <div className="p-4 border-b border-white/10 flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-heritage-primary flex items-center justify-center mx-auto cursor-pointer hover:bg-heritage-secondary transition-colors">
              <Cloud className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Navigation Items - Scrollable Middle Section */}
          <nav className="
           flex flex-col flex-1 py-4 space-y-2 overflow-y-auto overflow-x-hidden min-h-0 admin-sidebar-scroll">
            {navItems
              .filter(item => {
                // If no user is logged in, show nothing (or default items, though layout usually redirects)
                if (!user) return false;

                // If item has no allowedRoles, it's accessible to everyone
                if (!item.allowedRoles) return true;

                // Check if user's role is in the allowedRoles array
                return item.allowedRoles.includes(user.role);
              })
              .map((item, index) => {
                const Icon = item.icon;
                const active = isActiveRoute(item.href, item.exact);

                return (
                  <Tooltip key={index} content={item.label} position="right">
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`
                      flex items-center justify-center
                      w-14 h-14 mx-auto rounded-xl
                      transition-all duration-200
                      ${active
                          ? 'bg-heritage-highlight text-heritage-text shadow-lg scale-105'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                        }
                    `}
                    >
                      <Icon className="w-6 h-6" />
                    </Link>
                  </Tooltip>
                );
              })}
          </nav>

          {/* Bottom Section - Profile & Add Button - Fixed at Bottom */}
          <div className="p-4 border-t border-white/10 space-y-3 flex-shrink-0">
            <Tooltip content="Quick Action" position="right">
              <button
                className="w-14 h-14 mx-auto rounded-full bg-heritage-primary text-heritage-text font-semibold flex items-center justify-center hover:bg-heritage-secondary transition-colors"
              >
                <Plus className="w-6 h-6" />
              </button>
            </Tooltip>

            <div className="w-14 h-14 mx-auto rounded-full bg-white/10 flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-heritage-gold transition-all">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area - Full Width */}
      <div className="flex-1 flex flex-col min-w-0 w-full lg:ml-20">
        {/* Top Header */}
        <header className="bg-white/70 backdrop-blur-xl border-b border-white/40 px-2 md:px-6 py-2.5 md:py-4 flex items-center justify-between sticky top-0 z-30 w-full shadow-glass transition-all">
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-heritage-highlight/60 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-heritage-text" />
              ) : (
                <Menu className="w-6 h-6 text-heritage-text" />
              )}
            </button>

            <h1 className="hidden sm:block text-lg md:text-2xl font-bold text-heritage-textDark truncate sm:max-w-none">
              {navItems.find(item => isActiveRoute(item.href, item.exact))?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-1.5 md:gap-4 flex-1 sm:flex-initial justify-end">
            <div className="flex-1 sm:flex-initial flex items-center gap-2 max-w-none sm:max-w-[360px]">
              <SelectYatra
                className="w-full"
                value={selectedYatraId || undefined}
                onChange={handleYatraChange}
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-white/70 border border-white/40 rounded-full shadow-glass-soft">

              <div className="hidden md:block">
                <p className="text-xs text-heritage-text/70 capitalize">{user?.role || 'Admin'}</p>
              </div>


            </div>

            <button
              onClick={handleLogout}
              className="p-2 md:p-2 rounded-full bg-heritage-secondary/20 text-heritage-textDark hover:bg-heritage-secondary/40 transition-all flex-shrink-0 active:scale-95"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content - Full Width with Scroll */}
        <main className="flex-1 p-6 overflow-y-auto w-full flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
