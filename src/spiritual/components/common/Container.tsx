/**
 * Container Component
 * Provides consistent max-width and padding across pages
 * Standard container widths for spiritual module
 */

import React, { ReactNode } from 'react';

interface ContainerProps {
    children: ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
}

export default function Container({
    children,
    className = '',
    maxWidth = '7xl',
}: ContainerProps) {
    const maxWidthClasses = {
        sm: 'max-w-screen-sm',      // 640px
        md: 'max-w-screen-md',      // 768px
        lg: 'max-w-screen-lg',      // 1024px
        xl: 'max-w-screen-xl',       // 1280px
        '2xl': 'max-w-screen-2xl',  // 1536px
        '7xl': 'max-w-7xl',         // 1280px (standard for content)
        full: 'max-w-full',
    };

    return (
        <div
            className={`mx-auto w-full ${maxWidthClasses[maxWidth] || maxWidthClasses['7xl']} px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 ${className}`}
        >
            {children}
        </div>
    );
}
