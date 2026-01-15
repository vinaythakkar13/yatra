import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface NumberInputProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  variant?: 'default' | 'admin';
  showButtons?: boolean;
  inputClassName?: string;
  prefix?: string;
}

/**
 * Custom Number Input Component with Increment/Decrement Buttons
 * 
 * Features:
 * - Visual increment/decrement buttons
 * - Keyboard support (arrow keys)
 * - Min/max validation
 * - Custom step value
 * - Appealing gradient buttons
 * - Matches design system
 * 
 * @param label - Input label
 * @param value - Current number value
 * @param onChange - Change handler
 * @param min - Minimum value (default: 1)
 * @param max - Maximum value (default: 100)
 * @param step - Increment/decrement step (default: 1)
 * @param helperText - Helper text below input
 * @param error - Error message
 * @param disabled - Disable input
 * @param required - Show required indicator
   */
export default function NumberInput({
  label,
  value,
  onChange,
  min = 1,
  max = 100,
  step = 1,
  helperText,
  error,
  disabled = false,
  required = false,
  className = '',
  variant = 'default',
  showButtons = true,
  inputClassName = '',
  prefix = '',
}: NumberInputProps) {
  const isAdmin = variant === 'admin';
  const handleIncrement = () => {
    if (value < max) {
      onChange(value + step);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      onChange(value - step);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Remove leading zeros and non-numeric characters (except empty string)
    if (inputValue === '') {
      // Allow empty input temporarily, but set to min on blur
      return;
    }

    // Remove leading zeros and parse as integer
    // Convert "010000" to "10000" by removing leading zeros
    const cleanedValue = inputValue.replace(/^0+/, '') || '0';
    const newValue = parseInt(cleanedValue, 10);

    // Check if it's a valid number
    if (isNaN(newValue)) {
      // If invalid, revert to current value
      return;
    }

    // Ensure value is within bounds
    if (newValue >= min && newValue <= max) {
      onChange(newValue);
    } else if (newValue < min) {
      onChange(min);
    } else if (newValue > max) {
      onChange(max);
    }
  };

  const handleBlur = () => {
    // Ensure value is set to min if empty or invalid
    if (isNaN(value) || value < min) {
      onChange(min);
    } else if (value > max) {
      onChange(max);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
      return;
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
      return;
    }

    // Allow: backspace, delete, tab, escape, enter, home, end, and arrow keys
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'Home', 'End', 'ArrowLeft', 'ArrowRight'];
    if (allowedKeys.includes(e.key)) {
      return;
    }

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if ((e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase())) {
      return;
    }

    // Only allow numeric digits (0-9)
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    // Prevent leading zeros
    const input = e.currentTarget;
    const currentValue = input.value;
    const selectionStart = input.selectionStart || 0;

    // If typing '0' at the start and min > 0, prevent it
    if (e.key === '0' && selectionStart === 0 && (currentValue === '' || currentValue.startsWith('0'))) {
      if (min > 0) {
        e.preventDefault();
        return;
      }
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={`block text-sm font-semibold mb-2 ${isAdmin ? 'text-heritage-textDark' : 'text-gray-700'}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="flex items-stretch gap-2">
        {/* Decrement Button */}
        {showButtons && <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          className={`
            flex items-center justify-center
            w-11 rounded-lg
            transition-all duration-200
            ${disabled || value <= min
              ? isAdmin
                ? 'bg-heritage-highlight/40 text-heritage-text/40 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : isAdmin
                ? 'bg-gradient-to-br from-heritage-maroon/80 to-heritage-maroon hover:from-heritage-maroon hover:to-heritage-maroon/90 text-white shadow-md hover:shadow-lg active:scale-95'
                : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl active:scale-95'
            }
          `}
          title="Decrease"
        >
          <Minus className="w-4 h-4" />
        </button>}

        {/* Number Display */}
        <div className="flex-1 relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-xl font-bold text-gray-700">
              {prefix}
            </span>
          )}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            min={min || undefined}
            max={max || undefined}
            step={step}
            disabled={disabled}
            className={`
              w-full h-full px-4 py-3 
              text-center text-lg md:text-xl font-bold
              rounded-lg transition-all duration-200
              focus:outline-none
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
              bg-white
 
              ${inputClassName || ""}
              ${prefix && "pl-10"}

              ${isAdmin
                ? `border ${error
                  ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                  : 'border-heritage-highlight/60 focus:border-heritage-primary focus:ring-2 focus:ring-heritage-primary/20'
                } ${disabled
                  ? 'bg-heritage-highlight/30 cursor-not-allowed text-heritage-text/40'
                  : 'bg-heritage-highlight/20 text-heritage-textDark hover:bg-heritage-highlight/30 hover:border-heritage-highlight'
                }`
                : `border-2 ${error
                  ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
                  : 'border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200'
                } ${disabled
                  ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                  : 'bg-white text-gray-800 hover:border-gray-400'
                }`
              }
            `}
          />
        </div>

        {/* Increment Button */}
        {showButtons && <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          className={`
            flex items-center justify-center
            w-11 rounded-lg
            transition-all duration-200
            ${disabled || value >= max
              ? isAdmin
                ? 'bg-heritage-highlight/40 text-heritage-text/40 cursor-not-allowed'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : isAdmin
                ? 'bg-gradient-to-br from-heritage-primary to-heritage-secondary hover:from-heritage-secondary hover:to-heritage-primary text-white shadow-md hover:shadow-lg active:scale-95'
                : 'bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl active:scale-95'
            }
          `}
          title="Increase"
        >
          <Plus className="w-4 h-4" />
        </button>}
      </div>

      {/* Helper Text / Error */}
      {error && (
        <p className={`mt-2 text-sm flex items-center animate-slide-down ${isAdmin ? 'text-red-600' : 'text-red-600'}`}>
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
        <p className={`mt-2 text-sm ${isAdmin ? 'text-heritage-text/70' : 'text-gray-500'}`}>{helperText}</p>
      )}
    </div>
  );
}
