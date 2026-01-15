import React from 'react';

interface Column {
  key: string;
  header: string;
  render?: (row: any) => React.ReactNode;
  className?: string;
}

interface TableProps {
  columns: Column[];
  data: any[];
  emptyMessage?: string;
  isLoading?: boolean;
  onRowClick?: (row: any) => void;
  className?: string;
}

/**
 * Reusable Table Component with sorting and styling
 * 
 * @param columns - Array of column definitions
 * @param data - Array of data rows
 * @param emptyMessage - Message when no data
 * @param isLoading - Loading state
 * @param onRowClick - Row click handler
 * @param className - Additional CSS classes
 */
export default function Table({
  columns,
  data,
  emptyMessage = 'No data available',
  isLoading = false,
  onRowClick,
  className = '',
}: TableProps) {
  if (isLoading) {
    return (
      <div className={`w-full glass-effect rounded-xl p-8 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`w-full glass-effect rounded-xl p-12 text-center ${className}`}>
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <p className="mt-4 text-gray-600 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto glass-effect rounded-xl ${className}`}>
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-primary-50 to-secondary-50">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider ${column.className || ''
                  }`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data?.length > 0 && data?.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`
                transition-colors hover:bg-primary-50/50
                ${onRowClick ? 'cursor-pointer' : ''}
              `}
            >
              {columns?.length > 0 && columns?.map((column) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  className={`px-6 py-4 text-sm text-gray-700 ${column.className || ''
                    }`}
                >
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          )) || (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  {emptyMessage || 'No data available'}
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  );
}

