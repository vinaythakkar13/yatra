/**
 * Skeleton Image Loader
 * Shows a shimmer effect while images load
 * Fixed hydration issues by ensuring consistent server/client rendering
 */

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface SkeletonImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    fill?: boolean;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    sizes?: string;
}

export default function SkeletonImage({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    fill = false,
    objectFit = 'cover',
    sizes,
}: SkeletonImageProps) {

     const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    // Ensure component is mounted before showing loading state (prevents hydration mismatch)
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Handle image load completion
    const handleLoad = () => {
        setIsLoading(false);
    };

    // Handle image errors
    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
    };

    // Object fit mapping to Tailwind classes
    const objectFitClasses = {
        contain: 'object-contain',
        cover: 'object-cover',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down',
    };

    if (fill) {
        return (
            <div className={`relative ${className}`}>
                {/* Skeleton shimmer effect - only show after mount to prevent hydration mismatch */}
                {isMounted && isLoading && (
                    <div className="absolute inset-0 bg-spiritual-neutral animate-pulse z-10">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    </div>
                )}

                {/* Error placeholder */}
                {hasError && (
                    <div className="absolute inset-0 bg-spiritual-neutral flex items-center justify-center z-10">
                        <span className="text-spiritual-textLight text-sm">Image not available</span>
                    </div>
                )}

                {/* Actual image */}
                {!hasError && (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        priority={priority}
                        sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
                        className={`transition-opacity duration-500 ${objectFitClasses[objectFit]} ${
                            isLoading && isMounted ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={handleLoad}
                        onError={handleError}
                        unoptimized={src?.startsWith('http') || src?.startsWith('https')}
                    />
                )}
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Skeleton shimmer effect - only show after mount to prevent hydration mismatch */}
            {isMounted && isLoading && (
                <div className="absolute inset-0 bg-spiritual-neutral animate-pulse z-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
            )}

            {/* Error placeholder */}
            {hasError && (
                <div className="absolute inset-0 bg-spiritual-neutral flex items-center justify-center z-10">
                    <span className="text-spiritual-textLight text-sm">Image not available</span>
                </div>
            )}

            {/* Actual image */}
            {!hasError && width && height && (
                <Image
                    src={src}
                    alt={alt}
                    width={width}
                    height={height}
                    priority={priority}
                    className={`transition-opacity duration-500 ${objectFitClasses[objectFit]} ${
                        isLoading && isMounted ? 'opacity-0' : 'opacity-100'
                    }`}
                    onLoad={handleLoad}
                    onError={handleError}
                    unoptimized={src?.startsWith('http') || src?.startsWith('https')}
                />
            )}
        </div>
    );
}
