/**
 * Base API Configuration with RTK Query
 * 
 * Features:
 * - Automatic request/response interceptors
 * - Authorization header management
 * - Centralized error handling
 * - Token refresh logic
 * - Request/response logging (development only)
 * - Retry logic for failed requests
 */

import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { tokenStorage, clearStorage } from '@/utils/storage';
import { toast } from 'react-toastify';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/**
 * Base Query with Interceptors
 */
/**
 * Custom fetch wrapper that forces credentials/cookies to be sent with every request.
 * Adds `withCredentials = true` to appease backend expectations (mostly relevant for
 * axios-based servers) even though the native fetch API relies on `credentials`.
 */
const fetchWithCredentials: typeof fetch = async (input, init = {}) => {
  const config: RequestInit & { withCredentials?: boolean } = {
    ...init,
    credentials: init.credentials ?? 'include',
  };

  // Some backends check this flag, so set it explicitly.
  config.withCredentials = true;

  return fetch(input, config);
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  fetchFn: fetchWithCredentials,
  
  // Prepare headers for every request (REQUEST INTERCEPTOR)
  prepareHeaders: (headers, { getState, endpoint }) => {
    // Get token from storage
    const token = tokenStorage.getAccessToken();
    
    // Add authorization header if token exists
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Add content type if not already set
    if (!headers.has('content-type')) {
      headers.set('content-type', 'application/json');
    }
    
    // Add accept header
    if (!headers.has('accept')) {
      headers.set('accept', 'application/json');
    }
    
    // Add custom headers (e.g., API version, client info)
    headers.set('X-Client-Version', '1.0.0');
    headers.set('X-Client-Platform', 'web');    
    return headers;
  },
  
  // Credentials configuration
  credentials: 'include', // Include cookies for cross-origin requests
});

/**
 * Base Query with Error Handling and Token Refresh (RESPONSE INTERCEPTOR)
 */
const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Execute the base query
  let result = await baseQuery(args, api, extraOptions);
  
  
  // Handle different response statuses
  if (result.error) {
    const { status, data } = result.error;
    
    switch (status) {
      case 401:
        // Get the request URL to check if it's a login endpoint
        const requestUrl = typeof args === 'string' ? args : args.url;
        const isLoginRequest = requestUrl.includes('/login') || requestUrl.includes('/auth/login');
        
        // If 401 is from login endpoint, don't logout (invalid credentials)
        if (isLoginRequest) {
          console.warn('[API] 401 Unauthorized - Invalid login credentials');
          // Don't call handleLogout for login requests
          // Let the component handle the error display
          break;
        }
        
        // Unauthorized - Try to refresh token or logout
        console.warn('[API] 401 Unauthorized - Token may be expired');
        
        // Attempt token refresh
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            // Try to refresh the access token
            const refreshResult = await baseQuery(
              {
                url: '/auth/refresh',
                method: 'POST',
                body: { refreshToken },
              },
              api,
              extraOptions
            );
            
            if (refreshResult.data) {
              // Store new token and retry original request
              const { accessToken } = refreshResult.data as any;
              tokenStorage.setAccessToken(accessToken);
              
              // Retry the original query with new token
              result = await baseQuery(args, api, extraOptions);
            } else {
              // Refresh failed - logout user
              handleLogout();
            }
          } catch (error) {
            console.error('[API] Token refresh failed:', error);
            handleLogout();
          }
        } else {
          // No refresh token - logout
          handleLogout();
        }
        break;
        
      case 403:
        // Forbidden - User doesn't have permission
        console.warn('[API] 403 Forbidden - Insufficient permissions');
        toast.error('You do not have permission to perform this action', {
          toastId: 'forbidden-error',
        });
        break;
        
      case 404:
        // Not Found
        console.warn('[API] 404 Not Found');
        toast.error('The requested resource was not found', {
          toastId: 'not-found-error',
        });
        break;
        
      case 500:
      case 502:
      case 503:
      case 504:
        // Server errors
        console.error('[API] Server Error:', status);
        toast.error('Server error. Please try again later.', {
          toastId: `server-error-${status}`,
        });
        break;
        
      case 'FETCH_ERROR':
        // Network error or CORS error
        console.error('[API] Network/CORS Error - Unable to connect to server');
        console.error('[API] This is likely a CORS issue. Make sure:');
        console.error('[API] 1. Backend server is running');
        console.error('[API] 2. CORS is configured on backend');
        console.error('[API] 3. API_URL is correct:', API_BASE_URL);
        
        // Show toast with toastId to prevent duplicates
        toast.error(
          'Unable to connect to server. Check console for CORS fix guide.',
          { 
            position: 'top-center',
            autoClose: 10000,
            toastId: 'fetch-error', // Prevent duplicate toasts
          }
        );
        break;
        
      case 'PARSING_ERROR':
        // Response parsing error
        console.error('[API] Response Parsing Error');
        toast.error('Invalid response from server');
        break;
        
      case 'TIMEOUT_ERROR':
        // Request timeout
        console.error('[API] Request Timeout');
        toast.error('Request timed out. Please try again.');
        break;
        
      default:
        // Handle other errors
        const errorMessage = (data as any)?.message || 'An unexpected error occurred';
        console.error('[API] Error:', status, errorMessage);
        
        // Only show toast for non-validation errors
        if (status !== 400) {
          toast.error(errorMessage);
        }
    }
  }
  
  return result;
};

/**
 * Logout user and clear all data
 */
const handleLogout = () => {
  clearStorage();
  // toast.warning('Session expired. Please login again.');
  
  // Redirect to login page
  if (typeof window !== 'undefined') {
    window.location.href = '/admin/login';
  }
};

/**
 * Base Query WITHOUT Retry Logic
 * Retry disabled to prevent infinite loops with CORS errors
 * 
 * Note: Retry logic was causing infinite API calls on CORS errors.
 * Re-enable with proper configuration once backend CORS is fixed.
 */
const baseQueryWithRetry = baseQueryWithInterceptor;

// Uncomment below to re-enable retry after CORS is fixed
/*
const baseQueryWithRetry = retry(
  baseQueryWithInterceptor,
  {
    maxRetries: 1,
  }
);
*/

/**
 * Base API Definition
 * All API slices will extend from this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithRetry,
  
  // Tag types for cache invalidation
  tagTypes: [
    'Auth',
    'User',
    'Hotel',
    'Yatra',
    'Registration',
    'Room',
    'Document',
    'Cloudinary',
  ],
  
  // Endpoints will be injected by individual API slices
  endpoints: () => ({}),
  
  // Keep unused data in cache for 60 seconds
  keepUnusedDataFor: 60,
  
  // Refetch data when component remounts
  refetchOnMountOrArgChange: 30,
  
  // Refetch on window focus (useful for real-time data)
  refetchOnFocus: false,
  
  // Refetch on network reconnection
  refetchOnReconnect: true,
});

// Export hooks for usage in functional components
export const { middleware: apiMiddleware, reducer: apiReducer } = baseApi;

