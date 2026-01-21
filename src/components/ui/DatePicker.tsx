import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { Calendar as CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  showTimeSelect?: boolean;
  disablePastDates?: boolean;
  className?: string;
  variant?: 'default' | 'admin';
  popperPlacement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end' | 'right-start' | 'right-end' | 'left-start' | 'left-end';
}

/**
 * Enhanced DatePicker Component using react-datepicker
 * 
 * Features:
 * - Calendar popup with month/year navigation
 * - Min/max date validation
 * - Past date prevention
 * - Time selection (optional)
 * - Custom styling to match design system
 * - React Hook Form compatible
 * 
 * @param label - Input label
 * @param error - Error message
 * @param helperText - Helper text
 * @param value - Selected date
 * @param onChange - Change handler
 * @param placeholder - Placeholder text
 * @param minDate - Minimum selectable date
 * @param maxDate - Maximum selectable date
 * @param disablePastDates - Prevent past date selection
 * @param showTimeSelect - Enable time picker
 */
const DatePicker = forwardRef<any, DatePickerProps>(
  ({
    label,
    error,
    helperText,
    value,
    onChange,
    placeholder = 'Select date',
    required = false,
    disabled = false,
    minDate,
    maxDate,
    showTimeSelect = false,
    disablePastDates = false,
    className = '',
    variant = 'default',
    popperPlacement = 'bottom-start',
  }, ref) => {
    // Set minDate to today if disablePastDates is true
    const effectiveMinDate = disablePastDates ? new Date() : minDate ? new Date(minDate) : undefined;
    const isAdmin = variant === 'admin';

    // Normalize date to avoid timezone issues
    // When a date is selected, ensure it's set to local midnight to avoid timezone shifts
    const normalizeDate = (date: Date | null | undefined): Date | null => {
      if (!date) return null;
      // Create a new date at local midnight to avoid timezone conversion issues
      // Use getFullYear, getMonth, getDate to extract local date components
      const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      normalized.setHours(0, 0, 0, 0);
      return normalized;
    };

    // Handle date change with normalization
    // react-datepicker may pass dates with time components, so we normalize to local midnight
    const handleDateChange = (date: Date | null) => {
      if (!date) {
        onChange?.(null);
        return;
      }
      // Extract local date components directly to avoid any timezone conversion
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      // Create a new date at local midnight
      const normalized = new Date(year, month, day, 0, 0, 0, 0);
      onChange?.(normalized);
    };

    return (
      <div className="w-full">
        {label && (
          <label className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${isAdmin ? 'text-heritage-textDark' : 'text-gray-700'}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          <ReactDatePicker
            ref={ref}
            selected={normalizeDate(value)}
            onChange={handleDateChange}
            placeholderText={placeholder}
            minDate={effectiveMinDate ? new Date(effectiveMinDate) : undefined}
            maxDate={maxDate ? new Date(maxDate) : undefined}
            showTimeSelect={showTimeSelect ? true : false}
            disabled={disabled}
            dateFormat={showTimeSelect ? 'dd-MM-yyyy h:mm aa' : 'dd-MM-yyyy'}
            adjustDateOnChange={true}
            fixedHeight={true}
            className={`
              w-full px-3 py-2 sm:px-4 sm:py-2.5 pl-10 sm:pl-11 rounded-lg border-2 transition-all duration-200 bg-white text-sm sm:text-base
              ${error
                ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                : isAdmin
                  ? 'border-heritage-gold/30 focus:border-heritage-primary focus:ring-2 focus:ring-heritage-primary/20 hover:border-heritage-gold/50'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 hover:border-gray-400'
              }
              ${isAdmin ? 'placeholder:text-heritage-text/50 text-heritage-textDark' : 'placeholder:text-gray-400'}
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${className}
            `}
            calendarClassName={isAdmin ? "custom-datepicker-calendar datepicker-admin" : "custom-datepicker-calendar"}
            wrapperClassName={isAdmin ? "w-full datepicker-admin-wrapper" : "w-full"}
            popperClassName="custom-datepicker-popper"
            showPopperArrow={false}
            popperPlacement={popperPlacement}
          />

          {/* Calendar Icon */}
          <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
            <CalendarIcon className={`w-4 h-4 sm:w-5 sm:h-5 ${isAdmin ? 'text-heritage-text/60' : 'text-gray-400'}`} />
          </div>
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-600 flex items-center animate-slide-down">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className={`mt-1.5 text-sm ${isAdmin ? 'text-heritage-text/70' : 'text-gray-500'}`}>{helperText}</p>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';

export default DatePicker;

