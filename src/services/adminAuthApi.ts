/**
 * Admin Auth API Service
 * 
 * Handles admin-specific authentication endpoints:
 * - Admin Login with separate endpoint
 * - Admin-specific operations
 * 
 * Design Decisions:
 * - Separate from regular user auth for better security
 * - Uses /admin/login endpoint as per backend API
 * - Automatic token storage and user data persistence
 * - Type-safe with TypeScript interfaces
 */

import { baseApi } from './baseApi';
import { tokenStorage, userStorage } from '@/utils/storage';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Admin Login Request Payload
 * Matches the backend API structure
 */
export interface AdminLoginRequest {
  email: string;
  password: string;
}

/**
 * Admin Login Response
 * Structure based on actual backend API response
 */
export interface AdminLoginResponse {
  token: string;
}

/**
 * Admin Logout Response
 */
export interface AdminLogoutResponse {
  success: boolean;
  message: string;
}

// ============================================================================
// Admin Auth API Slice
// ============================================================================

/**
 * Admin Auth API
 * Extends the base API with admin-specific authentication endpoints
 * 
 * Features:
 * - Automatic token storage after successful login
 * - User data persistence in localStorage
 * - Cache invalidation on auth state changes
 * - Error handling with detailed logging
 */
export const adminAuthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Admin Login Endpoint
     * 
     * POST /admin/login
     * 
     * Process Flow:
     * 1. Send credentials to backend
     * 2. Receive tokens and user data
     * 3. Store tokens in localStorage (via tokenStorage)
     * 4. Store user data in localStorage (via userStorage)
     * 5. Invalidate auth-related cache
     * 
     * @param credentials - Email and password
     * @returns Admin user data and tokens
     */
    adminLogin: builder.mutation<AdminLoginResponse, AdminLoginRequest>({
      query: (credentials) => ({
        url: '/admin/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
      }),
      
      /**
       * Transform Response
       * Handle the actual backend response structure
       */
      transformResponse: (response: AdminLoginResponse) => {
        
        // The response is already in the correct format
        // Just log and return as-is
        
        return response;
      },
      
      /**
       * Side Effects Handler
       * Executes after successful mutation
       * 
       * This is where we:
       * - Store authentication tokens
       * - Store user profile data
       * - Log success/failure
       */
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Extract accessToken from response
          const accessToken = data.token;
          
          // Store token in localStorage
          if (accessToken) {
            tokenStorage.setAccessToken(accessToken);
          } else {
            console.warn('[Admin Auth API] No accessToken received in response');
          }
          
          // Note: This API only returns accessToken
          // User data will need to be fetched separately if needed
          
        } catch (error: any) {
          console.error('[Admin Auth API] Login failed:', error);
          
          // Log detailed error information
          if (error?.error) {
            console.error('[Admin Auth API] Error details:', {
              status: error.error.status,
              data: error.error.data,
              message: error.error.data?.message,
            });
          }
        }
      },
      
      /**
       * Cache Invalidation
       * Invalidate auth-related cache tags on successful login
       * This ensures fresh data is fetched after authentication
       */
      invalidatesTags: ['Auth', 'User'],
    }),
    
    /**
     * Admin Logout Endpoint
     * 
     * POST /admin/logout
     * 
     * Process Flow:
     * 1. Send logout request to backend
     * 2. Clear tokens from localStorage
     * 3. Clear user data from localStorage
     * 4. Invalidate cache
     * 
     * Note: Clears local data even if API call fails (fail-safe)
     */
    adminLogout: builder.mutation<AdminLogoutResponse, void>({
      query: () => ({
        url: '/admin/logout',
        method: 'POST',
      }),
      
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          
          // Clear all stored authentication data
          tokenStorage.clearTokens();
          userStorage.removeUser();
          
        } catch (error) {
          console.error('[Admin Auth API] Logout API failed:', error);
          
          // Clear data even if API call fails (fail-safe approach)
          tokenStorage.clearTokens();
          userStorage.removeUser();

        }
      },
      
      invalidatesTags: ['Auth', 'User'],
    }),
    
    /**
     * Get Current Admin User
     * 
     * GET /admin/me
     * 
     * Fetches current admin user profile
     * Note: This endpoint may need to be implemented on the backend
     * as the login response doesn't include user data
     */
    getCurrentAdmin: builder.query<{
      id: string;
      email: string;
      name: string;
      role: string;
      phone?: string;
      avatar?: string;
    }, void>({
      query: () => '/admin/me',
      
      // Provide cache tags for invalidation
      providesTags: ['User'],
      
      // Keep data fresh for 5 minutes
      keepUnusedDataFor: 300,
      
      // Transform error response
      transformErrorResponse: (error) => {
        console.error('[Admin Auth API] Failed to fetch admin user:', error);
        return error;
      },
    }),
  }),
  
  // Don't override existing endpoints
  overrideExisting: false,
});

// ============================================================================
// Export Hooks
// ============================================================================

/**
 * RTK Query Auto-generated Hooks
 * 
 * These hooks provide:
 * - Automatic loading states (isLoading, isSuccess, isError)
 * - Automatic error handling
 * - Automatic caching
 * - Automatic refetching
 * - TypeScript type safety
 * 
 * Usage in components:
 * ```tsx
 * const [adminLogin, { isLoading, isSuccess, error }] = useAdminLoginMutation();
 * 
 * const handleLogin = async () => {
 *   try {
 *     await adminLogin({ email, password }).unwrap();
 *   } catch (err) {
 *     console.error('Login failed:', err);
 *   }
 * };
 * ```
 */
export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useGetCurrentAdminQuery,
  useLazyGetCurrentAdminQuery,
} = adminAuthApi;

// ============================================================================
// Additional Notes
// ============================================================================

/**
 * Best Practices Implemented:
 * 
 * 1. Separation of Concerns
 *    - Admin auth is separate from regular user auth
 *    - Clear boundaries and responsibilities
 * 
 * 2. Type Safety
 *    - All interfaces properly typed
 *    - TypeScript inference for hooks
 * 
 * 3. Error Handling
 *    - Detailed error logging
 *    - Fail-safe data clearing
 * 
 * 4. State Management
 *    - Automatic cache invalidation
 *    - Optimized data retention
 * 
 * 5. Developer Experience
 *    - Comprehensive logging in development
 *    - Clear code comments
 *    - Type-safe hooks
 * 
 * 6. Security
 *    - Secure token storage
 *    - Proper header configuration
 *    - Token refresh support (via baseApi)
 */

