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
  yatra: string; // UUID string
  name: string;
  address: string;
  hotelType: 'A' | 'B' | 'C' | 'D';
  managerName: string;
  managerContact: string;
  hasElevator: boolean;
  totalFloors: number;
  floors: FloorRequest[];
  rooms: RoomRequest[];
  // Optional fields that might be needed
  mapLink?: string;
  distanceFromBhavan?: number;
  numberOfDays?: number;
  startDate?: string;
  endDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
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
 * Transform HotelFormData to CreateHotelRequest format
 * Converts form data structure to API payload format
 */
export function transformHotelFormDataToApiPayload(
  formData: any,
  yatraId: string
): CreateHotelRequest {
  // Generate rooms array from floors configuration
  const rooms: RoomRequest[] = [];
  
  formData.floors.forEach((floor: any) => {
    const floorRooms = floor.rooms || [];
    const floorNumber = floor.floorNumber === 'G' ? 0 : parseInt(floor.floorNumber, 10);
    
    floor.roomNumbers.forEach((roomNumber: string, index: number) => {
      if (roomNumber && roomNumber.trim()) {
        const roomConfig = floorRooms[index] || {};
        rooms.push({
          roomNumber: roomNumber.trim(),
          floor: floorNumber,
          toiletType: roomConfig.toiletType || 'western',
          numberOfBeds: roomConfig.numberOfBeds || 1,
          chargePerDay: roomConfig.chargePerDay || 0,
          isOccupied: false,
        });
      }
    });
  });

  // Transform floors data
  const floors: FloorRequest[] = formData.floors.map((floor: any) => ({
    floorNumber: floor.floorNumber,
    numberOfRooms: floor.numberOfRooms,
    roomNumbers: floor.roomNumbers.filter((r: string) => r && r.trim() !== ''),
    rooms: floor.rooms || [],
  }));

  // Build API payload
  const payload: CreateHotelRequest = {
    yatra: yatraId, // Map yatraId to yatra
    name: formData.name,
    address: formData.address,
    hotelType: formData.hotelType,
    managerName: formData.managerName,
    managerContact: formData.managerContact,
    hasElevator: formData.hasElevator,
    totalFloors: formData.totalFloors,
    floors,
    rooms,
  };

  // Add optional fields if they exist
  if (formData.mapLink) {
    payload.mapLink = formData.mapLink;
  }
  if (formData.distanceFromBhavan !== undefined && formData.distanceFromBhavan !== null) {
    payload.distanceFromBhavan = formData.distanceFromBhavan;
  }
  if (formData.numberOfDays) {
    payload.numberOfDays = formData.numberOfDays;
  }
  if (formData.startDate) {
    payload.startDate = formData.startDate;
  }
  if (formData.endDate) {
    payload.endDate = formData.endDate;
  }
  if (formData.checkInTime) {
    payload.checkInTime = formData.checkInTime;
  }
  if (formData.checkOutTime) {
    payload.checkOutTime = formData.checkOutTime;
  }

  return payload;
}
