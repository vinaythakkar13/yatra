/**
 * Auth API Service
 * 
 * Handles authentication-related API endpoints:
 * - Login
 * - Logout
 * - Register
 * - Token refresh
 * - Password reset
 */

import { baseApi } from './baseApi';
import { tokenStorage, userStorage } from '@/utils/storage';

// Type Definitions
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      phone?: string;
      avatar?: string;
    };
   token: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

/**
 * Auth API Slice
 * Extends the base API with authentication endpoints
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Login Endpoint
     * POST /auth/login
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      
      // Transform response before caching
      transformResponse: (response: LoginResponse) => {
        return response;
      },
      
      // Handle side effects on successful login
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store tokens and user data
          if (data.success && data.data) {
            tokenStorage.setAccessToken(data.data.token);
            userStorage.setUser(data.data.user);
          }
        } catch (error) {
          console.error('[Auth API] Login failed:', error);
        }
      },
      
      // Invalidate cache tags on successful login
      invalidatesTags: ['Auth', 'User'],
    }),
    
    /**
     * Register Endpoint
     * POST /auth/register
     */
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
      
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          
          // Store tokens and user data after registration
          if (data.success && data.data) {
            tokenStorage.setAccessToken(data.data.token);
            userStorage.setUser(data.data.user);
          }
        } catch (error) {
          console.error('[Auth API] Registration failed:', error);
        }
      },
      
      invalidatesTags: ['Auth', 'User'],
    }),
    
    /**
     * Logout Endpoint
     * POST /auth/logout
     */
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          
          // Clear all stored data
          tokenStorage.clearTokens();
          userStorage.removeUser();
          
        } catch (error) {
          console.error('[Auth API] Logout failed:', error);
          
          // Clear data even if API call fails
          tokenStorage.clearTokens();
          userStorage.removeUser();
        }
      },
      
      invalidatesTags: ['Auth', 'User'],
    }),
    
    /**
     * Get Current User Profile
     * GET /auth/me
     */
    getCurrentUser: builder.query<LoginResponse['data']['user'], void>({
      query: () => '/auth/me',
      
      // Provide cache tags
      providesTags: ['User'],
      
      // Keep fresh for 5 minutes
      keepUnusedDataFor: 300,
    }),
    
    /**
     * Forgot Password Endpoint
     * POST /auth/forgot-password
     */
    forgotPassword: builder.mutation<{ success: boolean; message: string }, ForgotPasswordRequest>({
      query: (body) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body,
      }),
    }),
    
    /**
     * Reset Password Endpoint
     * POST /auth/reset-password
     */
    resetPassword: builder.mutation<{ success: boolean; message: string }, ResetPasswordRequest>({
      query: (body) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body,
      }),
      
      invalidatesTags: ['Auth'],
    }),
    
    /**
     * Change Password Endpoint
     * POST /auth/change-password
     */
    changePassword: builder.mutation<{ success: boolean; message: string }, ChangePasswordRequest>({
      query: (body) => ({
        url: '/auth/change-password',
        method: 'POST',
        body,
      }),
      
      invalidatesTags: ['Auth'],
    }),
    
    /**
     * Verify Email Endpoint
     * POST /auth/verify-email
     */
    verifyEmail: builder.mutation<{ success: boolean; message: string }, { token: string }>({
      query: (body) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body,
      }),
      
      invalidatesTags: ['User'],
    }),
  }),
  
  overrideExisting: false,
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useVerifyEmailMutation,
} = authApi;

