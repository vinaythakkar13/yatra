import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  prefix?: string;
  containerClassName?: string;
  variant?: 'default' | 'admin';
}

/**
 * Reusable Input Component with support for React Hook Form
 * 
 * @param label - Input label text
 * @param error - Error message to display
 * @param helperText - Helper text below input
 * @param leftIcon - Icon to display on left side
 * @param rightIcon - Icon to display on right side
 * @param prefix - Text prefix to display on left side (e.g., "+91")
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, prefix, className = '', containerClassName = '', variant = 'default', value, maxLength, onChange, ...props }, ref) => {
    const isAdmin = variant === 'admin';
    const isNumberType = props.type === 'number';

    // Normalize value to ensure controlled component consistency
    // Since we extract 'value' from props, if it exists (even as undefined/null), we treat it as controlled
    // Convert null/undefined to empty string to maintain controlled state
    const normalizedValue = value != null ? String(value) : '';

    // Prevent typing 'e', 'E', '+', '-' in number inputs and enforce maxLength
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (isNumberType) {
        // Prevent 'e', 'E', '+', '-' keys
        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
          e.preventDefault();
          return;
        }

        // Enforce maxLength for number inputs
        if (maxLength && e.currentTarget.value) {
          const currentLength = e.currentTarget.value.toString().length;
          // Allow backspace, delete, arrow keys, tab, etc.
          const isAllowedKey = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'].includes(e.key);
          // Allow Ctrl/Cmd + A, C, V, X
          const isCtrlKey = (e.ctrlKey || e.metaKey) && ['a', 'c', 'v', 'x'].includes(e.key.toLowerCase());

          if (!isAllowedKey && !isCtrlKey && currentLength >= maxLength) {
            // Allow if text is selected (will be replaced)
            const selectionStart = e.currentTarget.selectionStart || 0;
            const selectionEnd = e.currentTarget.selectionEnd || 0;
            const hasSelection = selectionStart !== selectionEnd;

            if (!hasSelection) {
              e.preventDefault();
              return;
            }
          }
        }
      }
      // Call original onKeyDown if provided
      if (props.onKeyDown) {
        props.onKeyDown(e);
      }
    };

    // Handle onChange to enforce maxLength for number inputs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (isNumberType && maxLength) {
        const inputValue = e.target.value.toString();
        if (inputValue.length > maxLength) {
          // Truncate value and create synthetic event with truncated value
          const truncatedValue = inputValue.slice(0, maxLength);
          const syntheticEvent = {
            ...e,
            target: { ...e.target, value: truncatedValue },
            currentTarget: { ...e.currentTarget, value: truncatedValue },
          } as React.ChangeEvent<HTMLInputElement>;

          // Call original onChange with truncated value
          if (onChange) {
            onChange(syntheticEvent);
          }
          return; // Don't call original onChange with full value
        }
      }
      // Call original onChange if provided
      if (onChange) {
        onChange(e);
      }
    };

    // Filter out non-numeric characters when pasting in number inputs and enforce maxLength
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (isNumberType) {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        // Remove all non-numeric characters (including 'e', 'E', '+', '-')
        const numericText = pastedText.replace(/[^0-9.]/g, '');
        // If there's a valid numeric value, set it
        if (numericText) {
          const input = e.currentTarget;
          const start = input.selectionStart || 0;
          const end = input.selectionEnd || 0;
          const currentValue = normalizedValue !== undefined ? String(normalizedValue) : (input.value || '');
          let newValue = currentValue.substring(0, start) + numericText + currentValue.substring(end);

          // Enforce maxLength if specified
          if (maxLength && newValue.length > maxLength) {
            newValue = newValue.slice(0, maxLength);
          }

          // Use onChange to update controlled value instead of direct DOM manipulation
          if (onChange) {
            const syntheticEvent = {
              ...e,
              target: { ...input, value: newValue },
              currentTarget: { ...input, value: newValue },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
          }
        }
      } else {
        // Call original onPaste if provided
        if (props.onPaste) {
          props.onPaste(e);
        }
      }
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${isAdmin ? 'text-heritage-textDark' : 'text-gray-700'}`}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {/* Prefix - displayed first, before leftIcon */}
          {prefix && (
            <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none z-10">
              <span className={`text-sm sm:text-base font-medium ${isAdmin ? 'text-heritage-textDark' : 'text-gray-700'}`}>
                {prefix}
              </span>
            </div>
          )}
          {/* Left Icon - displayed after prefix if prefix exists */}
          {leftIcon && (
            <div className={`absolute inset-y-0 left-0 flex items-center pointer-events-none z-10 ${prefix ? 'pl-10 sm:pl-12' : 'pl-2.5 sm:pl-3'}`}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg border-2 transition-all duration-200 bg-white text-sm sm:text-base
              ${prefix ? (leftIcon ? 'pl-16 sm:pl-20' : 'pl-12 sm:pl-14') : leftIcon ? 'pl-9 sm:pl-10' : ''}
              ${rightIcon ? 'pr-9 sm:pr-10' : ''}
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
            {...props}
            value={normalizedValue}
            maxLength={isNumberType ? undefined : maxLength}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onChange={handleChange}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
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

Input.displayName = 'Input';

export default Input;

