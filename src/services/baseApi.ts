/**
 * Base API Configuration with RTK Query
 *
 * Features:
 * - Automatic request/response interceptors
 * - Authorization header management
 * - Centralized error handling
 * - Token refresh logic
 * - Request/response logging (development only)
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { tokenStorage, clearStorage } from '@/utils/storage';
import { toast } from 'react-toastify';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

/**
 * Base Query
 *
 * ✅ credentials: 'same-origin' — fixes Android Chrome CORS block.
 *
 * WHY: Using credentials: 'include' with a wildcard/open CORS origin
 * (origin: true) is blocked by ALL browsers per the CORS spec.
 * Android Chrome enforces this strictly — desktop Chrome is more lenient.
 *
 * Since auth is handled via Bearer token in the Authorization header,
 * we don't need cookies, so 'same-origin' is correct here.
 *
 * ❌ Removed: fetchWithCredentials wrapper — it was forcing credentials: 'include'
 *    and overriding this setting, causing the silent block on mobile.
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,

  // Prepare headers for every request (REQUEST INTERCEPTOR)
  prepareHeaders: (headers) => {
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

    // Add custom headers
    headers.set('X-Client-Version', '1.0.0');
    headers.set('X-Client-Platform', 'web');

    // Skip ngrok browser warning page on mobile/API clients
    headers.set('ngrok-skip-browser-warning', 'true');

    return headers;
  },

  // ✅ 'same-origin' — do NOT use 'include' with open/wildcard CORS origins
  credentials: 'same-origin',
});

/**
 * Base Query with Error Handling and Token Refresh (RESPONSE INTERCEPTOR)
 */
const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status, data } = result.error;

    switch (status) {
      case 401: {
        const requestUrl = typeof args === 'string' ? args : args.url;
        const isLoginRequest =
          requestUrl.includes('/login') || requestUrl.includes('/auth/login');

        if (isLoginRequest) {
          console.warn('[API] 401 Unauthorized - Invalid login credentials');
          break;
        }

        console.warn('[API] 401 Unauthorized - Token may be expired');

        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            const refreshResult = await baseQuery(
              {
                url: '/auth/refresh',
                method: 'POST',
                body: { refreshToken },
              },
              api,
              extraOptions,
            );

            if (refreshResult.data) {
              const { accessToken } = refreshResult.data as any;
              tokenStorage.setAccessToken(accessToken);
              // Retry original request with new token
              result = await baseQuery(args, api, extraOptions);
            } else {
              handleLogout();
            }
          } catch (error) {
            console.error('[API] Token refresh failed:', error);
            handleLogout();
          }
        } else {
          handleLogout();
        }
        break;
      }

      case 403:
        console.warn('[API] 403 Forbidden - Insufficient permissions');
        toast.error('You do not have permission to perform this action', {
          toastId: 'forbidden-error',
        });
        break;

      case 404:
        console.warn('[API] 404 Not Found');
        toast.error('The requested resource was not found', {
          toastId: 'not-found-error',
        });
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        console.error('[API] Server Error:', status);
        toast.error('Server error. Please try again later.', {
          toastId: `server-error-${status}`,
        });
        break;

      case 'FETCH_ERROR':
        // Network error or CORS error — request never reached server
        console.error('[API] FETCH_ERROR — request did not reach backend');
        console.error('[API] Possible causes:');
        console.error('  1. Backend server is not running');
        console.error('  2. CORS: credentials + wildcard origin conflict');
        console.error('  3. Wrong API URL:', API_BASE_URL);
        console.error('  4. ngrok tunnel expired or changed URL');
        toast.error('Unable to connect to server. Check console for details.', {
          position: 'top-center',
          autoClose: 10000,
          toastId: 'fetch-error',
        });
        break;

      case 'PARSING_ERROR':
        console.error('[API] Response Parsing Error');
        toast.error('Invalid response from server');
        break;

      case 'TIMEOUT_ERROR':
        console.error('[API] Request Timeout');
        toast.error('Request timed out. Please try again.');
        break;

      default: {
        const errorMessage =
          (data as any)?.message || 'An unexpected error occurred';
        console.error('[API] Error:', status, errorMessage);
        if (status !== 400) {
          toast.error(errorMessage);
        }
      }
    }
  }

  return result;
};

/**
 * Logout user and clear all stored data
 */
const handleLogout = () => {
  clearStorage();

  if (typeof window !== 'undefined') {
    const isAdminPage = window.location.pathname.includes('/admin');
    if (isAdminPage) {
      window.location.href = '/admin/login';
    }
  }
};

/**
 * Base API Definition
 * All API slices extend from this base API
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithInterceptor,

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

  endpoints: () => ({}),

  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: false,
  refetchOnReconnect: true,
});

export const { middleware: apiMiddleware, reducer: apiReducer } = baseApi;