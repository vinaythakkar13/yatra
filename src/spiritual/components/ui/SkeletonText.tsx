/**
 * Skeleton Text Loader
 * Shows a shimmer effect for text placeholders
 */

import React from 'react';

interface SkeletonTextProps {
    lines?: number;
    className?: string;
    width?: 'full' | 'short' | 'medium' | 'long';
}

export default function SkeletonText({
    lines = 3,
    className = '',
    width = 'full',
}: SkeletonTextProps) {
    const widthClasses = {
        full: 'w-full',
        short: 'w-1/4',
        medium: 'w-1/2',
        long: 'w-3/4',
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {Array.from({ length: lines }).map((_, index) => (
                <div
                    key={index}
                    className={`h-4 bg-spiritual-neutral rounded animate-pulse ${index === lines - 1 ? widthClasses[width] : 'w-full'
                        }`}
                >
                    <div className="h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
            ))}
        </div>
    );
}
