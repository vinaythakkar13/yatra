/**
 * Donation Banner Component
 * Dismissible banner promoting donations
 */

'use client';

import React from 'react';
import Link from 'next/link';
import Container from '../common/Container';
import { useLocalStorage } from '../../hooks/useLocalStorage';

export default function DonationBanner() {
    const [isDismissed, setIsDismissed] = useLocalStorage('donation-banner-dismissed', false);

    if (isDismissed) return null;

    const handleDismiss = () => {
        setIsDismissed(true);
    };

    return (
        <div className="bg-gradient-to-r from-spiritual-zen-forest to-spiritual-zen-accent text-white shadow-lg animate-slide-up">
            <Container className="py-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">🙏</span>
                        <div>
                            <p className="font-semibold">Support Our Seva</p>
                            <p className="text-sm text-white/90">Your donation helps us serve those in need</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/spiritual/donate"
                            className="px-4 py-2 bg-white text-spiritual-zen-forest rounded-lg font-medium hover:bg-spiritual-zen-highlight transition-colors whitespace-nowrap"
                        >
                            Donate Now
                        </Link>
                        <button
                            onClick={handleDismiss}
                            className="p-1 hover:bg-white/20 rounded transition-colors"
                            aria-label="Dismiss banner"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </Container>
        </div>
    );
}
