'use client';

import { useState } from 'react';
import { useGetYatraByIdQuery, useLazyGetYatraByIdQuery } from '@/services/yatraApi';
import YatraDetails from './YatraDetails';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/**
 * Example Component showing different ways to use getYatraById
 * 
 * This demonstrates:
 * 1. Automatic query (useGetYatraByIdQuery) - fetches on mount
 * 2. Lazy query (useLazyGetYatraByIdQuery) - fetches on demand
 * 3. Loading and error state handling
 */
export default function YatraDetailsExample() {
  const [yatraId, setYatraId] = useState('');
  const [selectedYatraId, setSelectedYatraId] = useState('');

  // Example 1: Automatic Query (fetches when component mounts if yatraId is provided)
  const {
    data: autoYatra,
    isLoading: isAutoLoading,
    isError: isAutoError,
    error: autoError,
  } = useGetYatraByIdQuery(selectedYatraId, {
    skip: !selectedYatraId, // Skip if no ID provided
  });

  // Example 2: Lazy Query (fetches only when triggered manually)
  const [
    triggerLazyQuery,
    {
      data: lazyYatra,
      isLoading: isLazyLoading,
      isError: isLazyError,
      error: lazyError,
      isFetching: isLazyFetching,
    },
  ] = useLazyGetYatraByIdQuery();

  const handleAutoFetch = () => {
    if (yatraId.trim()) {
      setSelectedYatraId(yatraId.trim());
    }
  };

  const handleLazyFetch = async () => {
    if (yatraId.trim()) {
      try {
        await triggerLazyQuery(yatraId.trim()).unwrap();
      } catch (error) {
        console.error('Lazy fetch error:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Yatra Details Examples</h2>
        
        {/* Input for Yatra ID */}
        <div className="mb-6">
          <Input
            label="Enter Yatra ID"
            placeholder="e.g., yatra-123"
            value={yatraId}
            onChange={(e) => setYatraId(e.target.value)}
            className="mb-4"
          />
          <div className="flex gap-4">
            <Button onClick={handleAutoFetch} disabled={!yatraId.trim()}>
              Fetch (Auto Query)
            </Button>
            <Button onClick={handleLazyFetch} disabled={!yatraId.trim() || isLazyLoading}>
              Fetch (Lazy Query)
            </Button>
          </div>
        </div>

        {/* Example 1: Automatic Query Results */}
        {selectedYatraId && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Automatic Query Result:</h3>
            {isAutoLoading && <p className="text-blue-600">Loading...</p>}
            {isAutoError && (
              <p className="text-red-600">
                Error: {(autoError as any)?.data?.message || 'Failed to fetch'}
              </p>
            )}
            {autoYatra && (
              <div className="mt-2">
                <p className="font-medium">Name: {autoYatra.name}</p>
                <p className="text-sm text-gray-600">ID: {autoYatra.id}</p>
              </div>
            )}
          </div>
        )}

        {/* Example 2: Lazy Query Results */}
        {lazyYatra && (
          <div className="mb-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Lazy Query Result:</h3>
            {isLazyLoading && <p className="text-green-600">Loading...</p>}
            {isLazyFetching && <p className="text-green-600 text-sm">Refreshing...</p>}
            {isLazyError && (
              <p className="text-red-600">
                Error: {(lazyError as any)?.data?.message || 'Failed to fetch'}
              </p>
            )}
            {lazyYatra && (
              <div className="mt-2">
                <p className="font-medium">Name: {lazyYatra.name}</p>
                <p className="text-sm text-gray-600">ID: {lazyYatra.id}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Example 3: Using YatraDetails Component */}
      {selectedYatraId && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Full Yatra Details Component</h2>
          <YatraDetails yatraId={selectedYatraId} />
        </div>
      )}
    </div>
  );
}

