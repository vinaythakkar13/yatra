'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'admin';
  closeOnBackdropClick?: boolean;
}

// close on backdrop click

/**
 * Reusable Modal Component with animations and React Portal
 * 
 * Renders outside of parent DOM hierarchy using Portal for proper layering
 * 
 * @param isOpen - Control modal visibility
 * @param onClose - Close handler
 * @param title - Modal title
 * @param children - Modal content
 * @param footer - Modal footer content
 * @param size - Modal size
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  variant = 'default',
  closeOnBackdropClick = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Don't render on server or if not mounted
  if (!mounted || !isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
  };

  // Modal content to be rendered via Portal
  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop - Enhanced with darker overlay and smooth animation */}
      <div
        className={`absolute inset-0 backdrop-blur-md animate-fade-in ${variant === 'admin'
          ? 'bg-heritage-maroon/40 backdrop-blur-xl'
          : 'bg-black/70'
          }`}
        onClick={closeOnBackdropClick ? onClose : undefined}
        aria-hidden="true"
        style={{
          WebkitBackdropFilter: variant === 'admin' ? 'blur(12px)' : 'blur(8px)',
          backdropFilter: variant === 'admin' ? 'blur(12px)' : 'blur(8px)',
        }}
      />

      {/* Modal - Enhanced with better elevation and animation */}
      <div
        className={`
          relative w-full ${sizes[size]} mx-4
          ${variant === 'admin'
            ? 'bg-white/90 backdrop-blur-xl border-heritage-gold/30 rounded-glass shadow-glass overflow-hidden'
            : 'bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-gray-200'
          }
          animate-scale-in
          max-h-[96vh] sm:max-h-[90vh] flex flex-col
        `}
        style={{
          transform: 'translateZ(0)', // Hardware acceleration
          fontFamily: variant === 'admin' ? 'var(--font-inter), system-ui, sans-serif' : undefined,
        }}
      >
        {/* Header */}
        {title && (
          <div className={`flex items-center justify-between p-4 md:p-6 gap-2 ${variant === 'admin'
            ? 'border-b border-heritage-gold/20 bg-heritage-highlight/30'
            : 'border-b border-gray-200'
            }`}>
            <div
              id="modal-title"
              className={`flex-1 min-w-0 ${variant === 'admin'
                ? 'text-lg md:text-xl font-bold text-heritage-textDark'
                : 'text-base sm:text-lg md:text-2xl font-bold gradient-text'
                }`}
            >
              {title}
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className={`transition-colors p-1.5 md:p-2 rounded-lg flex-shrink-0 ${variant === 'admin'
                ? 'text-heritage-text hover:text-heritage-maroon hover:bg-heritage-highlight/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className={`p-4 md:p-6 overflow-y-auto flex-1 overflow-x-hidden scrollbar-thin scrollbar-thumb-heritage-primary/40 scrollbar-track-heritage-highlight/30 hover:scrollbar-thumb-heritage-primary/60 ${variant === 'admin' ? 'text-heritage-text' : ''
          }`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className={`p-4 md:p-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 ${variant === 'admin'
            ? 'border-t border-heritage-gold/20 bg-heritage-highlight/20'
            : 'border-t border-gray-200'
            }`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render modal using Portal to document.body
  return createPortal(modalContent, document.body);
}

