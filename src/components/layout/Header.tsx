/**
 * Enhanced Navbar Component for Spiritual Module
 * Professional navigation with smooth transitions, GSAP animations, and modern mobile menu
 * Based on Header component structure with spiritual module adaptations
 */

'use client';

'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Container from '@/spiritual/components/common/Container';
import Button from '@/spiritual/components/common/Button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // Dynamically import GSAP
  const [gsap, setGsap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsLoaded(false);
      return;
    }

    // Dynamically import GSAP
    import('gsap').then((gsapModule) => {
      setGsap(gsapModule.gsap);
      setIsLoaded(true);
    });
  }, []);

  // Handle scroll effect
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsScrolled(window.scrollY > 20);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // GSAP animations for navbar
  useEffect(() => {
    if (!gsap || !isLoaded || !navRef.current) return;

    const ctx = gsap.context(() => {
      // Animate navbar on load using fromTo to explicitly set both start and end states
      gsap.fromTo('.nav-logo',
        {
          opacity: 0,
          x: -30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
        }
      );

      gsap.fromTo('.nav-link',
        {
          opacity: 0,
          y: -20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
        }
      );

      gsap.fromTo('.nav-actions',
        {
          opacity: 0,
          x: 30,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.5,
          ease: 'power3.out',
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, [gsap, isLoaded]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    // { name: 'Home', href: '/spiritual' },
    // { name: 'About Us', href: '/spiritual/about' },
    // { name: 'Charity', href: '/spiritual/charity' },
    // { name: 'Gallery', href: '/spiritual/gallery' },
    // { name: 'Medical', href: '/spiritual/medical' },
    { name: 'Contact', href: '/spiritual/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/spiritual') {
      return pathname === '/spiritual';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b  ${isScrolled
          ? 'bg-spiritual-zen-surface/95 backdrop-blur-md shadow-lg border-spiritual-zen-highlight/60 py-2 md:py-3'
          : 'backdrop-blur-sm border-transparent py-3 md:py-5 bg-spiritual-zen-forest'
        }`}
    >
      <Container maxWidth="full">
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link
            href="/"
            className="nav-logo flex items-center gap-2 group z-50"
            style={{
              opacity: isLoaded ? undefined : 1,
              transform: isLoaded ? undefined : 'translateX(0)',
            }}
          >
            <span
              className={`text-2xl sm:text-3xl md:text-4xl font-bold transition-colors duration-300 ${isScrolled ? 'text-spiritual-navy' : 'text-white drop-shadow-2xl'
                } group-hover:text-spiritual-saffron`}
            >
              Ollo
            </span>
            <span
              className={`text-[10px] sm:text-xs md:text-sm uppercase tracking-widest mt-1 transition-colors duration-300 ${isScrolled ? 'text-spiritual-textLight' : 'text-white drop-shadow-lg'
                }`}
            >
              Fundraising & Charity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link relative px-3 xl:px-4 py-2 text-xs xl:text-sm font-semibold uppercase tracking-wide transition-all duration-300 group ${isActive(link.href)
                    ? 'text-spiritual-saffron'
                    : isScrolled
                      ? 'text-spiritual-navy hover:text-spiritual-saffron'
                      : 'text-white drop-shadow-lg hover:text-spiritual-zen-highlight'
                  }`}
                style={{
                  opacity: isLoaded ? undefined : 1,
                  transform: isLoaded ? undefined : 'translateY(0)',
                }}
              >
                {link.name}
                {/* Active indicator */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-spiritual-saffron transition-all duration-300 ${isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div
            className="hidden lg:flex nav-actions items-center gap-2 xl:gap-3"
            style={{
              opacity: isLoaded ? undefined : 1,
              transform: isLoaded ? undefined : 'translateX(0)',
            }}
          >
            {/* Donate Button */}
            <Link href="/spiritual/charity">
              <Button
                variant="primary"
                className={`rounded-full px-4 xl:px-6 py-2 xl:py-2.5 text-xs xl:text-sm font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 whitespace-nowrap ${isScrolled
                    ? 'bg-spiritual-zen-forest text-white hover:bg-spiritual-zen-charcoal shadow-lg'
                    : 'bg-white !text-spiritual-zen-charcoal hover:bg-spiritual-zen-highlight shadow-2xl drop-shadow-2xl'
                  }`}
              >
                Donate
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-2.5 rounded-lg transition-all duration-300 z-50 ${isScrolled ? 'text-spiritual-navy' : 'text-white drop-shadow-2xl'
              } ${isMenuOpen ? 'bg-spiritual-saffron/10' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden absolute top-full left-0 right-0 bg-spiritual-zen-surface shadow-2xl border-t border-spiritual-zen-highlight transition-all duration-500 overflow-hidden ${isMenuOpen
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0 pointer-events-none'
            }`}
        >
          <div className="px-4 py-6 space-y-2">
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-semibold uppercase text-sm transition-all duration-300 transform hover:translate-x-2 ${isActive(link.href)
                    ? 'bg-spiritual-saffron text-white shadow-md'
                    : 'text-spiritual-navy hover:bg-spiritual-neutral hover:text-spiritual-saffron'
                  }`}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/spiritual/charity"
                className="block w-full text-center px-4 py-3 bg-spiritual-saffron text-white rounded-lg font-bold uppercase tracking-wider text-sm hover:bg-spiritual-saffronDark transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Donate Now
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </nav>
  );
}
