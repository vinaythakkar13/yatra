/**
 * Cloudinary API Service
 * 
 * Handles Cloudinary image upload endpoints:
 * - Upload base64 image
 * 
 * Uses backend API URL from NEXT_PUBLIC_API_URL environment variable
 */

import { baseApi } from './baseApi';

// Type Definitions
export interface UploadBase64Request {
  base64Image: string;
  folder?: string;
  public_id?: string;
  tags?: string[];
}

export interface UploadBase64Response {
  success: boolean;
  data?: {
    secure_url: string;
    public_id: string;
    format: string;
    width: number;
    height: number;
    bytes: number;
  };
  message?: string;
  error?: string;
}

/**
 * Cloudinary API Slice
 * Extends baseApi with Cloudinary endpoints
 * Uses backend API URL (NEXT_PUBLIC_API_URL) instead of Next.js API routes
 */
export const cloudinaryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Upload Ticket Image Endpoint
     * POST /cloudinary/upload-ticket
     * 
     * Uses backend API endpoint for yatra registration ticket uploads.
     */
    uploadBase64: builder.mutation<UploadBase64Response, UploadBase64Request>({
      query: (uploadData) => ({
        url: '/cloudinary/upload-ticket',
        method: 'POST',
        body: uploadData,
      }),
    }),
  }),
});

// Export hooks for usage in components
export const {
  useUploadBase64Mutation,
} = cloudinaryApi;

