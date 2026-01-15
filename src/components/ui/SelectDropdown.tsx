import { Loader } from 'lucide-react';
import React, { forwardRef } from 'react';
import ReactSelect from 'react-dropdown-select';

interface SelectDropdownProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  className?: string;
  dropdownPosition?: 'top' | 'bottom' | 'auto';
  variant?: 'default' | 'admin';
  loading?: boolean;
}

/**
 * Enhanced Select Component using react-dropdown-select
 * 
 * Features:
 * - Searchable dropdown
 * - Clearable selection
 * - Custom styling to match design system
 * - React Hook Form compatible
 * 
 * @param label - Select label
 * @param error - Error message
 * @param helperText - Helper text
 * @param options - Array of options
 * @param value - Selected value
 * @param onChange - Change handler
 * @param placeholder - Placeholder text
 * @param searchable - Enable search functionality
 * @param clearable - Enable clear button
 */
const SelectDropdown = forwardRef<any, SelectDropdownProps>(
  ({
    label,
    error,
    helperText,
    options,
    value,
    onChange,
    placeholder = 'Select...',
    required = false,
    disabled = false,
    searchable = true,
    clearable = true,
    className = '',
    dropdownPosition = 'bottom',
    variant = 'default',
    loading = false,
  }, ref) => {
    const selectedOption = options.find(opt => opt.value === value);
    const isAdmin = variant === 'admin';

    return (
      <div className="w-full">
        {label && (
          <label className={`block text-xs sm:text-sm font-semibold mb-1.5 sm:mb-2 ${isAdmin ? 'text-heritage-textDark' : 'text-gray-700'}`}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <ReactSelect
        dropdownPosition={dropdownPosition}
          closeOnClickInput={true}
          options={options}
          values={selectedOption ? [selectedOption] : []}
          onChange={(values) => {
            if (onChange) {
              onChange(values.length > 0 ? values[0].value : '');
            }
          }}
          loading={loading}
          placeholder={loading ? 'Loading...' : placeholder}
          searchable={searchable}
          clearable={clearable}
          disabled={disabled}
          labelField="label"
          valueField="value"
          className={className}
          style={{
            border: error 
              ? '2px solid #ef4444' 
              : isAdmin 
                ? '2px solid rgba(200, 165, 92, 0.3)' 
                : '2px solid #d1d5db',
            borderRadius: '0.5rem',
            minHeight: '40px',
            fontSize: '14px',
            backgroundColor: 'white',
          }}
          contentRenderer={({ props, state }) => (
            <div className="px-2 py-1">
              {state.values.length > 0 ? (
                <span className={`font-medium ${isAdmin ? 'text-heritage-textDark' : 'text-gray-800'}`}>
                  {state.values[0].label}
                </span>
              ) : (
                <span className={isAdmin ? 'text-heritage-text/50' : 'text-gray-400'}>{placeholder}</span>
              )}
            </div>
          )}
          dropdownRenderer={({ props, state, methods }) => {
            const regexp = new RegExp(state.search, 'i');
            const filtered = props.options.filter((item: any) =>
              regexp.test(item.label)
            );

            return (
              <div className={`${isAdmin ? 'bg-white/95 backdrop-blur-sm border-heritage-gold/20' : 'bg-white border-gray-200'} rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto`}>
                {searchable && (
                  <div className={`p-2 border-b ${isAdmin ? 'border-heritage-gold/20 bg-white/95' : 'border-gray-200 bg-white'} sticky top-0`}>
                    <input
                      type="text"
                      value={state.search}
                      onChange={methods.setSearch}
                      placeholder="Search..."
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none text-sm ${
                        isAdmin 
                          ? 'border-heritage-gold/30 focus:border-heritage-primary text-heritage-textDark' 
                          : 'border-gray-300 focus:border-primary-500'
                      }`}
                    />
                  </div>
                )}

                {filtered.length > 0 ? (
                  <div>
                    {filtered.map((option: any) => (
                      <div
                        key={option.value}
                        onClick={() => methods.addItem(option)}
                        className={`px-4 py-3 cursor-pointer transition-colors text-sm ${
                          isAdmin
                            ? 'text-heritage-textDark hover:bg-heritage-highlight/50 hover:text-heritage-primary'
                            : 'text-gray-700 hover:bg-primary-50 hover:text-primary-700'
                        }`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`px-4 py-8 text-center text-sm ${isAdmin ? 'text-heritage-text/60' : 'text-gray-500'}`}>
                    No options found
                  </div>
                )}
              </div>
            );
          }}
        />

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

SelectDropdown.displayName = 'SelectDropdown';

export default SelectDropdown;

