import React from 'react';
import { MapPin, ExternalLink, Building2, Phone, XCircle, AlertTriangle } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  id?: string;
  // Hotel-specific props
  hotelAddress?: string;
  hotelMapLink?: string;
  floorNumber?: number;
  // Contact details
  mobileNumber?: string;
  phoneNumber?: string;
  // Cancellation props
  isCancelled?: boolean;
  cancellationReason?: string;
  cancelledAt?: string;
  showCancelButton?: boolean;
  onCancelClick?: () => void;
  showRebookButton?: boolean;
  onRebookClick?: () => void;
}

/**
 * Enhanced Reusable Card Component with glass morphism effect
 * 
 * @param children - Card content
 * @param title - Card title
 * @param subtitle - Card subtitle
 * @param footer - Card footer content
 * @param hoverable - Add hover effect
 * @param onClick - Click handler
 * @param hotelAddress - Hotel address (optional)
 * @param hotelMapLink - Google Maps link (optional)
 * @param floorNumber - Floor number (optional)
 * @param mobileNumber - Mobile/Phone number (optional)
 * @param phoneNumber - Alternative phone number (optional)
 * @param isCancelled - Whether the booking is cancelled
 * @param cancellationReason - Reason for cancellation
 * @param cancelledAt - Cancellation date
 * @param showCancelButton - Show cancel booking button
 * @param onCancelClick - Cancel button click handler
 * @param showRebookButton - Show rebook button
 * @param onRebookClick - Rebook button click handler
 */
export default function Card({
  children,
  title,
  subtitle,
  footer,
  className = '',
  hoverable = false,
  onClick,
  id,
  hotelAddress,
  hotelMapLink,
  floorNumber,
  mobileNumber,
  phoneNumber,
  isCancelled = false,
  cancellationReason,
  cancelledAt,
  showCancelButton = false,
  onCancelClick,
  showRebookButton = false,
  onRebookClick,
}: CardProps) {
  return (
    <div
      id={id}
      className={`
        relative z-[2]
        bg-white/90 backdrop-blur-lg
        border border-white/30 shadow-xl
        rounded-xl sm:rounded-2xl
        p-4 sm:p-5 md:p-6
        transition-all duration-300
        ${hoverable ? 'hover:shadow-2xl hover:-translate-y-1 cursor-pointer hover:border-primary-300' : ''}
        ${isCancelled ? 'opacity-75 border-red-300' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Cancellation Banner */}
      {isCancelled && (
        <div className="mb-4 bg-gradient-to-r from-red-50 via-orange-50 to-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-red-800 mb-1">
                Booking Cancelled
              </h4>
              {cancelledAt && (
                <p className="text-xs sm:text-sm text-red-700 mb-2">
                  Cancelled on: {new Date(cancelledAt).toLocaleDateString()} at {new Date(cancelledAt).toLocaleTimeString()}
                </p>
              )}
              <p className="text-xs text-red-600">
                Note: Your room assignment has been released and is no longer reserved.
              </p>
              {cancellationReason && (
                <div className="mt-2 bg-white/60 rounded p-2 sm:p-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                    Cancellation Reason:
                  </p>
                  <p className="text-xs sm:text-sm text-gray-800 italic">
                    "{cancellationReason}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Decorative gradient overlay */}  
      {(title || subtitle || hotelAddress || floorNumber || mobileNumber || phoneNumber) && (
        <div className="mb-4 border-b border-gradient-to-r from-gray-200 via-primary-200 to-gray-200 pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                  {subtitle}
                </p>
              )}
              
              {/* Contact information */}
              {(mobileNumber || phoneNumber) && (
                <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-gray-700">
                  <Phone className="w-4 h-4 text-primary-600 flex-shrink-0" />
                  <a 
                    href={`tel:${mobileNumber || phoneNumber}`}
                    className="hover:text-primary-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {mobileNumber || phoneNumber}
                  </a>
                </div>
              )}
              
              {/* Hotel-specific information */}
              {hotelAddress && (
                <div className="flex items-start gap-2 mt-2 text-xs sm:text-sm text-gray-700">
                  <MapPin className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="flex-1">{hotelAddress}</span>
                </div>
              )}
              
              {hotelMapLink && (
                <a
                  href={hotelMapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  View on Map
                </a>
              )}
            </div>
            
            {floorNumber !== undefined && (
              <div className="flex-shrink-0 bg-gradient-to-br from-primary-500 to-primary-600 text-white px-3 py-2 rounded-lg shadow-lg">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <div className="text-center">
                    <div className="text-xs font-medium opacity-90">Floor</div>
                    <div className="text-lg font-bold leading-none">{floorNumber}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      <div className="card-content">{children}</div>
      
      {/* Cancel/Rebook Buttons */}
      {(showCancelButton || showRebookButton) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            {showRebookButton && onRebookClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRebookClick();
                }}
                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Rebook This Yatra
              </button>
            )}
            {showCancelButton && onCancelClick && !isCancelled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancelClick();
                }}
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border-2 border-red-300 hover:border-red-400 font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm sm:text-base"
              >
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      )}
      
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
}

