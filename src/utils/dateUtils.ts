import { format } from 'date-fns';

/**
 * Formats a date to DD-MM-YYYY
 * @param date - Date object or ISO string
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string | undefined | null): string => {
    if (!date) return 'N/A';

    // If it's already in DD-MM-YYYY format, return it as is
    if (typeof date === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(date)) {
        return date;
    }

    try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        // Check if date is valid
        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
            // Try parsing YYYY-MM-DD manually if it fails
            if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
                const [y, m, d] = date.split('-').map(Number);
                const manualDate = new Date(y, m - 1, d);
                return format(manualDate, 'dd-MM-yyyy');
            }
            return 'Invalid Date';
        }

        return format(dateObj, 'dd-MM-yyyy');
    } catch (error) {
        return 'Invalid Date';
    }
};
