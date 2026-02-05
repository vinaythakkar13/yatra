/**
 * Hotel API Service
 * 
 * Handles hotel-related API endpoints:
 * - Create hotel
 * - Get all hotels
 * - Update hotel
 * - Delete hotel
 * - Get hotel by ID
 */

import { baseApi } from './baseApi';
import { Hotel } from '@/types';

// Type Definitions
export interface CreateHotelRequest {
  name: string;
  address: string;
  hotelType: 'A' | 'B' | 'C' | 'D';
  managerName: string;
  managerContact: string;
  hasElevator: boolean;
  // Optional fields that might be needed
  mapLink?: string;
  distanceFromBhavan?: number;
  numberOfDays?: number;
  startDate?: string;
  endDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  visitingCardImage?: string | null;
  advancePaidAmount?: number; // Changed from advance_paid_amount
  yatraId?: string; // Made optional since it's not included in updates
}

export interface FloorRequest {
  floorNumber: string;
  numberOfRooms: number;
  roomNumbers: string[];
  rooms?: RoomConfigRequest[];
}

export interface RoomConfigRequest {
  roomNumber: string;
  toiletType: 'indian' | 'western';
  numberOfBeds: number;
  chargePerDay: number;
}

export interface RoomRequest {
  roomNumber: string;
  floor: number;
  toiletType: 'indian' | 'western';
  numberOfBeds: number;
  chargePerDay: number;
  isOccupied?: boolean;
}

export interface CreateHotelResponse {
  success: boolean;
  message: string;
  data: Hotel;
}

export interface GetAllHotelsResponse {
  success: boolean;
  message: string;
  data: Hotel[];
}

export interface GetHotelByIdResponse {
  success: boolean;
  message: string;
  data: Hotel;
}

export interface UpdateHotelRequest {
  yatra?: string;
  name?: string;
  address?: string;
  hotelType?: 'A' | 'B' | 'C' | 'D';
  managerName?: string;
  managerContact?: string;
  hasElevator?: boolean;
  totalFloors?: number;
  floors?: FloorRequest[];
  rooms?: RoomRequest[];
  mapLink?: string;
  distanceFromBhavan?: number;
  numberOfDays?: number;
  startDate?: string;
  endDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  visitingCardImage?: string | null;
  advancePaidAmount?: number;
}

export interface UpdateHotelResponse {
  success: boolean;
  message: string;
  data: Hotel;
}

export interface DeleteHotelResponse {
  success: boolean;
  message: string;
}

/**
 * Hotel API Slice
 * Extends the base API with hotel endpoints
 * 
 * Note: All endpoints automatically include authentication token via baseApi's prepareHeaders.
 * The token is retrieved from tokenStorage and added as 'Authorization: Bearer <token>' header.
 */
export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create Hotel Endpoint
     * POST /hotels
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     */
    createHotel: builder.mutation<CreateHotelResponse, CreateHotelRequest>({
      query: (hotelData) => ({
        url: '/hotels',
        method: 'POST',
        body: hotelData,
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Invalidate hotels cache after creation
      invalidatesTags: ['Hotel'],
    }),

    /**
     * Get All Hotels Endpoint
     * GET /hotels?yatra={yatraId}
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     * Optionally filters hotels by yatra ID
     */
    getAllHotels: builder.query<Hotel[], string | undefined>({
      query: (yatraId) => {
        const params = new URLSearchParams();
        if (yatraId) {
          params.append('yatra', yatraId);
        }
        const queryString = params.toString();
        return {
          url: `/hotels${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
          // Token is automatically added via baseApi's prepareHeaders
        };
      },

      // Transform response to return just the hotels array
      transformResponse: (response: GetAllHotelsResponse) => {
        return response?.data || [];
      },

      // Provide tags for cache invalidation
      providesTags: ['Hotel'],
    }),

    /**
     * Get Hotel by ID Endpoint
     * GET /hotels/:id
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     */
    getHotelById: builder.query<Hotel, string>({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: 'GET',
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Transform response to return just the hotel object
      transformResponse: (response: GetHotelByIdResponse) => {
        return response?.data;
      },

      // Provide tags for cache invalidation
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),

    /**
     * Update Hotel Endpoint
     * PUT /hotels/:id
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     */
    updateHotel: builder.mutation<UpdateHotelResponse, { id: string; data: UpdateHotelRequest }>({
      query: ({ id, data }) => ({
        url: `/hotels/${id}`,
        method: 'PUT',
        body: data,
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Invalidate hotels cache after update
      invalidatesTags: ['Hotel'],
    }),

    /**
     * Delete Hotel Endpoint
     * DELETE /hotels/:id
     * 
     * Automatically includes Authorization header with Bearer token from baseApi
     */
    deleteHotel: builder.mutation<DeleteHotelResponse, string>({
      query: (id) => ({
        url: `/hotels/${id}`,
        method: 'DELETE',
        // Token is automatically added via baseApi's prepareHeaders
      }),

      // Invalidate hotels cache after deletion
      invalidatesTags: ['Hotel'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateHotelMutation,
  useGetAllHotelsQuery,
  useGetHotelByIdQuery,
  useLazyGetHotelByIdQuery,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;

/**
 * Transform HotelFormData to API payload format
 * Converts form data structure to API payload format
 */
export function transformHotelFormDataToApiPayload(
  formData: any,
  yatraId: string,
  isUpdate: boolean = false,

): CreateHotelRequest | UpdateHotelRequest {
  // Build base API payload
  const basePayload = {
    name: formData.name,
    address: formData.address,
    hotelType: formData.hotelType,
    managerName: formData.managerName,
    managerContact: formData.managerContact,
    hasElevator: formData.hasElevator,
    ...(yatraId && !isUpdate && { yatra: yatraId })
  };

  // Add optional fields if they exist
  const optionalFields: any = {};

  if (formData.mapLink) {
    optionalFields.mapLink = formData.mapLink;
  }
  if (formData.distanceFromBhavan !== undefined && formData.distanceFromBhavan !== null) {
    optionalFields.distanceFromBhavan = formData.distanceFromBhavan;
  }
  if (formData.numberOfDays) {
    optionalFields.numberOfDays = formData.numberOfDays;
  }
  if (formData.startDate) {
    optionalFields.startDate = formData.startDate;
  }
  if (formData.endDate) {
    optionalFields.endDate = formData.endDate;
  }
  if (formData.checkInTime) {
    optionalFields.checkInTime = formData.checkInTime;
  }
  if (formData.checkOutTime) {
    optionalFields.checkOutTime = formData.checkOutTime;
  }
  if (formData.advance_paid_amount !== undefined && formData.advance_paid_amount !== null) {
    optionalFields.advancePaidAmount = formData.advance_paid_amount;
  }

  if (isUpdate) {
    // For updates, return UpdateHotelRequest (without yatraId)
    return {
      ...basePayload,
      ...optionalFields,
    } as UpdateHotelRequest;
  } else {
    // For creates, return CreateHotelRequest (with yatraId)
    return {
      ...basePayload,
      ...optionalFields,
    } as CreateHotelRequest;
  }
}
