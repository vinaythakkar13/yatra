/**
 * Yatra API Service
 * 
 * Handles yatra-related API endpoints:
 * - Get all yatras
 * - Create yatra
 * - Update yatra
 * - Delete yatra
 */

import { baseApi } from './baseApi';
import { Yatra } from '@/types';

// Type Definitions
export interface GetAllYatrasResponse {
  success: boolean;
  message: string;
  data: Yatra[];
}

export interface CreateYatraRequest {
  name: string;
  banner_image?: string; // URL string after Cloudinary upload
  start_date: string;
  end_date: string;
  registration_start_date: string;
  registration_end_date: string;
}

export interface CreateYatraResponse {
  success: boolean;
  message: string;
  data: Yatra;
}

export interface UpdateYatraRequest {
  name?: string;
  banner_image?: string | null; // URL string after Cloudinary upload
  start_date?: string;
  end_date?: string;
  registration_start_date?: string;
  registration_end_date?: string;
  is_active?: boolean; // Optional: for toggling active status
}

export interface UpdateYatraResponse {
  success: boolean;
  message: string;
  data: Yatra;
}

export interface DeleteYatraResponse {
  success: boolean;
  message: string;
}

export interface GetYatraByIdResponse {
  success: boolean;
  message: string;
  data: Yatra;
}

/**
 * Yatra API Slice
 * Extends the base API with yatra endpoints
 * 
 * Note: All endpoints automatically include authentication token via baseApi's prepareHeaders.
 * The token is retrieved from tokenStorage and added as 'Authorization: Bearer <token>' header.
 */
export const yatraApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Get All Yatras Endpoint
     * GET /yatra/get-all-yatras
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     */
    getAllYatras: builder.query<Yatra[], void>({
      query: () => ({
        url: '/yatra/get-all-yatras',
        method: 'GET',
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Transform response to return just the yatras array
      transformResponse: (response: GetAllYatrasResponse) => {
        return response?.data || [];
      },

      // Provide tags for cache invalidation
      providesTags: ['Yatra'],
    }),

    /**
     * Create Yatra Endpoint
     * POST /create-yatra
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     * Payload uses snake_case format as required by backend API
     */
    createYatra: builder.mutation<CreateYatraResponse, CreateYatraRequest>({
      query: (yatraData) => ({
        url: '/yatra/create-yatra',
        method: 'POST',
        body: yatraData, // Already in snake_case format
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Invalidate yatras cache after creation
      invalidatesTags: ['Yatra'],
    }),

    /**
     * Update Yatra Endpoint
     * PUT /update-yatra/:id
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     * Payload uses snake_case format as required by backend API
     */
    updateYatra: builder.mutation<UpdateYatraResponse, { id: string; data: UpdateYatraRequest }>({
      query: ({ id, data }) => ({
        url: `/yatra/update-yatra/${id}`,
        method: 'PUT',
        body: data, // Already in snake_case format
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Invalidate yatras cache after update
      invalidatesTags: ['Yatra'],
    }),

    /**
     * Delete Yatra Endpoint
     * DELETE /delete-yatra/:id
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     */
    deleteYatra: builder.mutation<DeleteYatraResponse, string>({
      query: (id) => ({
        url: `/yatra/delete-yatra/${id}`,
        method: 'DELETE',
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Invalidate yatras cache after deletion
      invalidatesTags: ['Yatra'],
    }),

    /**
     * Get Yatra by ID Endpoint
     * GET /yatra/get-yatra/:id
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     * Fetches a single yatra by its ID
     */
    getYatraById: builder.query<Yatra, string>({
      query: (id) => ({
        url: `/yatra/get-yatra/${id}`,
        method: 'GET',
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Transform response to return just the yatra object
      transformResponse: (response: GetYatraByIdResponse) => {
        return response?.data;
      },

      // Provide tags for cache invalidation
      providesTags: (result, error, id) => [{ type: 'Yatra', id }],
    }),

    /**
     * Get Active Yatras Endpoint
     * GET /yatra/active-yatras
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     * Fetches only active yatras
     */
    getActiveYatras: builder.query<Yatra[], void>({
      query: () => ({
        url: '/yatra/active-yatras',
        method: 'GET',
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Transform response to return just the yatras array
      transformResponse: (response: GetAllYatrasResponse) => {
        return response?.data || [];
      },

      // Provide tags for cache invalidation
      providesTags: ['Yatra'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetAllYatrasQuery,
  useLazyGetAllYatrasQuery,
  useGetYatraByIdQuery,
  useLazyGetYatraByIdQuery,
  useGetActiveYatrasQuery,
  useCreateYatraMutation,
  useUpdateYatraMutation,
  useDeleteYatraMutation,
} = yatraApi;

