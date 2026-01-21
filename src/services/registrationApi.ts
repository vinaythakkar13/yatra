/**
 * Registration API Service
 * 
 * Handles registration endpoints:
 * - Create registration
 * 
 * Uses backend API URL from NEXT_PUBLIC_API_URL environment variable
 */

import { baseApi } from './baseApi';
import { formatDate } from '@/utils/dateUtils';

// Type Definitions
export interface CreateRegistrationRequest {
  pnr: string;
  name: string;
  whatsappNumber: string;
  numberOfPersons: number;
  persons: Array<{
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    isHandicapped: boolean;
  }>;
  boardingPoint: {
    city: string;
    state: string;
  };
  arrivalDate: string; // ISO 8601 format
  returnDate: string; // ISO 8601 format
  ticketImages: string[]; // Array of image URLs
  yatraId: string; // Yatra ID
}

export interface CreateRegistrationResponse {
  success: boolean;
  data?: {
    id: string;
    pnr: string;
    name: string;
    whatsappNumber: string;
    numberOfPersons: number;
    persons: Array<{
      name: string;
      age: number;
      gender: 'male' | 'female' | 'other';
      isHandicapped: boolean;
    }>;
    boardingPoint: {
      city: string;
      state: string;
    };
    arrivalDate: string;
    returnDate: string;
    ticketImages: string[];
    yatraId: string;
    createdAt: string;
  };
  message?: string;
  error?: string;
}

export interface Registration {
  id: string;
  pnr: string;
  name: string;
  whatsappNumber: string;
  contactNumber?: string; // For backward compatibility
  numberOfPersons: number;
  persons: Array<{
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    isHandicapped: boolean;
  }>;
  boardingPoint: {
    city: string;
    state: string;
  };
  arrivalDate: string;
  returnDate: string;
  ticketImages: string[];
  yatraId: string;
  roomStatus?: 'Assigned' | 'Pending';
  roomNumber?: string;
  documentStatus?: 'approved' | 'rejected' | 'pending' | 'cancelled';
  rejectionReason?: string;
  cancellationReason?: string;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  mapLink?: string;
  distanceFromBhavan?: string;
  hotelType: string;
  managerName: string;
  managerContact: string;
  numberOfDays: number;
  startDate: string;
  endDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  hasElevator: boolean;
  totalFloors: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: string;
  toiletType: string;
  numberOfBeds: number;
  chargePerDay: number;
  isOccupied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface YatraDetails {
  id: string;
  name: string;
  bannerImage?: string;
  description?: string;
  startDate: string;
  endDate: string;
  registrationStartDate: string;
  registrationEndDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegistrationByPnrResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    registration: {
      id: string;
      pnr: string;
      name: string;
      whatsapp_number: string;
      number_of_persons: number;
      boarding_city: string;
      boarding_state: string;
      arrival_date: string;
      return_date: string;
      ticket_images: string[];
      status: 'pending' | 'approved' | 'rejected' | 'cancelled';
      cancellation_reason?: string | null;
      admin_comments?: string | null;
      rejection_reason?: string | null;
      created_at: string;
      updated_at: string;
    };
    persons: Array<{
      id: string;
      name: string;
      age: number;
      gender: 'male' | 'female' | 'other';
      is_handicapped: boolean;
      created_at: string;
      updated_at: string;
    }>;
    yatra: YatraDetails;
    hotel: Hotel | null;
    room: Room | null;
  };
}

export interface ApiRegistration {
  id: string;
  user_id: string;
  yatra_id: string;
  pnr: string;
  name: string;
  whatsapp_number: string;
  number_of_persons: number;
  boarding_city: string;
  boarding_state: string;
  arrival_date: string;
  return_date: string;
  ticket_images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  cancellation_reason?: string | null;
  admin_comments?: string | null;
  rejection_reason?: string | null;
  approved_by_admin_id?: string | null;
  rejected_by_admin_id?: string | null;
  approved_at?: string | null;
  rejected_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  updated_at: string;
  user?: any;
  yatra?: any;
  persons?: Array<{
    id: string;
    registration_id: string;
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    is_handicapped: boolean;
    created_at: string;
    updated_at: string;
  }>;
  logs?: any[];
}

export interface GetRegistrationsResponse {
  success: boolean;
  data?: ApiRegistration[]; // API returns array directly
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

/**
 * Registration API Slice
 * Extends baseApi with registration endpoints
 */
export const registrationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Create Registration Endpoint
     * POST /registrations
     */
    createRegistration: builder.mutation<CreateRegistrationResponse, CreateRegistrationRequest>({
      query: (registrationData) => ({
        url: '/registrations',
        method: 'POST',
        body: registrationData,
      }),
      invalidatesTags: ['Registration'],
    }),

    /**
     * Get Registrations Endpoint
     * GET /registrations?yatraId={yatraId}&pnr={pnr}
     * 
     * Fetches all registrations for a specific yatra or by PNR
     */
    getRegistrations: builder.query<{ success: boolean; data: { registrations: Registration[]; total: number; page?: number; limit?: number; totalPages?: number }; message?: string; error?: string }, { yatraId?: string; pnr?: string; page?: number; limit?: number }>({
      query: ({ yatraId, pnr, page, limit }) => {
        const params: Record<string, string | number> = {};
        if (yatraId) params.yatraId = yatraId;
        if (pnr) params.pnr = pnr;
        if (page) params.page = page;
        if (limit) params.limit = limit;

        return {
          url: '/registrations',
          method: 'GET',
          params,
        };
      },
      transformResponse: (response: any): { success: boolean; data: { registrations: Registration[]; total: number; page?: number; limit?: number; totalPages?: number }; message?: string; error?: string } => {
        // Transform API response (snake_case) to frontend format (camelCase)
        // API returns: { success: true, data: [...], pagination: {...} }
        if (response.success && response.data && Array.isArray(response.data)) {
          const registrations: Registration[] = response.data.map((apiReg: ApiRegistration) => {
            // Map status to roomStatus with proper capitalization
            const roomStatusMap: Record<string, 'Assigned' | 'Pending'> = {
              'pending': 'Pending',
              'approved': 'Assigned',
              'rejected': 'Pending',
              'cancelled': 'Pending',
            };

            return {
              id: apiReg.id,
              pnr: apiReg.pnr,
              name: apiReg.name,
              whatsappNumber: apiReg.whatsapp_number,
              contactNumber: apiReg.whatsapp_number, // Map for backward compatibility
              numberOfPersons: apiReg.number_of_persons,
              persons: (apiReg.persons || []).map(person => ({
                name: person.name,
                age: person.age,
                gender: person.gender,
                isHandicapped: person.is_handicapped,
              })),
              boardingPoint: {
                city: apiReg.boarding_city,
                state: apiReg.boarding_state,
              },
              arrivalDate: formatDate(apiReg.arrival_date),
              returnDate: formatDate(apiReg.return_date),
              ticketImages: apiReg.ticket_images || [],
              yatraId: apiReg.yatra_id,
              roomStatus: roomStatusMap[apiReg.status] || 'Pending',
              documentStatus: apiReg.status === 'approved' ? 'approved' : apiReg.status === 'rejected' ? 'rejected' : apiReg.status === 'cancelled' ? 'cancelled' : 'pending',
              rejectionReason: apiReg.rejection_reason || undefined,
              cancellationReason: apiReg.cancellation_reason || undefined,
              createdAt: apiReg.created_at,
            };
          });

          return {
            success: true,
            data: {
              registrations,
              total: response.pagination?.total || registrations.length,
              page: response.pagination?.page,
              limit: response.pagination?.limit,
              totalPages: response.pagination?.totalPages,
            },
            message: response.message,
          };
        }

        // Return error format if response is not successful
        return {
          success: false,
          data: {
            registrations: [],
            total: 0,
          },
          error: response.error || response.message || 'Failed to fetch registrations',
        };
      },
      providesTags: ['Registration'],
    }),

    /**
     * Get Registration by PNR Endpoint
     * GET /registrations/by-pnr/:pnr
     * 
     * Fetches registration details by PNR number including yatra, hotel, and room information
     */
    getRegistrationByPnr: builder.query<{
      success: boolean;
      data?: {
        registration: Registration;
        persons: Array<{
          name: string;
          age: number;
          gender: 'male' | 'female' | 'other';
          isHandicapped: boolean;
        }>;
        yatra: YatraDetails;
        hotel: Hotel | null;
        room: Room | null;
      };
      message?: string;
      error?: string;
    }, string>({
      query: (pnr) => ({
        url: `/registrations/by-pnr/${pnr}`,
        method: 'GET',
      }),
      transformResponse: (response: RegistrationByPnrResponse): {
        success: boolean;
        data?: {
          registration: Registration;
          persons: Array<{
            name: string;
            age: number;
            gender: 'male' | 'female' | 'other';
            isHandicapped: boolean;
          }>;
          yatra: YatraDetails;
          hotel: Hotel | null;
          room: Room | null;
        };
        message?: string;
        error?: string;
      } => {
        if (response.success && response.data) {
          const { registration, persons, yatra, hotel, room } = response.data;

          return {
            success: true,
            data: {
              registration: {
                id: registration.id,
                pnr: registration.pnr,
                name: registration.name,
                whatsappNumber: registration.whatsapp_number,
                contactNumber: registration.whatsapp_number,
                numberOfPersons: registration.number_of_persons,
                persons: persons.map(person => ({
                  name: person.name,
                  age: person.age,
                  gender: person.gender,
                  isHandicapped: person.is_handicapped,
                })),
                boardingPoint: {
                  city: registration.boarding_city,
                  state: registration.boarding_state,
                },
                arrivalDate: formatDate(registration.arrival_date),
                returnDate: formatDate(registration.return_date),
                ticketImages: registration.ticket_images || [],
                yatraId: yatra.id,
                documentStatus: registration.status === 'approved' ? 'approved' : registration.status === 'rejected' ? 'rejected' : registration.status === 'cancelled' ? 'cancelled' : 'pending',
                rejectionReason: registration.rejection_reason || undefined,
                cancellationReason: registration.cancellation_reason || undefined,
                roomStatus: room ? 'Assigned' : 'Pending',
                roomNumber: (room as any)?.room_number || (room as any)?.roomNumber,
                createdAt: registration.created_at,
              },
              persons: persons.map(person => ({
                name: person.name,
                age: person.age,
                gender: person.gender,
                isHandicapped: person.is_handicapped,
              })),
              yatra: {
                id: yatra.id,
                name: yatra.name,
                bannerImage: (yatra as any).banner_image || yatra.bannerImage,
                description: yatra.description,
                startDate: (yatra as any).start_date || yatra.startDate,
                endDate: (yatra as any).end_date || yatra.endDate,
                registrationStartDate: (yatra as any).registration_start_date || yatra.registrationStartDate,
                registrationEndDate: (yatra as any).registration_end_date || yatra.registrationEndDate,
                createdAt: (yatra as any).created_at || yatra.createdAt,
                updatedAt: (yatra as any).updated_at || yatra.updatedAt,
              },
              hotel: hotel ? {
                id: (hotel as any).id,
                name: (hotel as any).name,
                address: (hotel as any).address,
                mapLink: (hotel as any).map_link || (hotel as any).mapLink,
                distanceFromBhavan: (hotel as any).distance_from_bhavan || (hotel as any).distanceFromBhavan,
                hotelType: (hotel as any).hotel_type || (hotel as any).hotelType,
                managerName: (hotel as any).manager_name || (hotel as any).managerName,
                managerContact: (hotel as any).manager_contact || (hotel as any).managerContact,
                numberOfDays: (hotel as any).number_of_days || (hotel as any).numberOfDays,
                startDate: (hotel as any).start_date || (hotel as any).startDate,
                endDate: (hotel as any).end_date || (hotel as any).endDate,
                checkInTime: (hotel as any).check_in_time || (hotel as any).checkInTime,
                checkOutTime: (hotel as any).check_out_time || (hotel as any).checkOutTime,
                hasElevator: (hotel as any).has_elevator !== undefined ? (hotel as any).has_elevator : (hotel as any).hasElevator,
                totalFloors: (hotel as any).total_floors || (hotel as any).totalFloors,
                isActive: (hotel as any).is_active !== undefined ? (hotel as any).is_active : (hotel as any).isActive,
                createdAt: (hotel as any).created_at || (hotel as any).createdAt,
                updatedAt: (hotel as any).updated_at || (hotel as any).updatedAt,
              } : null,
              room: room ? {
                id: (room as any).id,
                roomNumber: (room as any).room_number || (room as any).roomNumber,
                floor: (room as any).floor,
                toiletType: (room as any).toilet_type || (room as any).toiletType,
                numberOfBeds: (room as any).number_of_beds || (room as any).numberOfBeds,
                chargePerDay: (room as any).charge_per_day || (room as any).chargePerDay,
                isOccupied: (room as any).is_occupied !== undefined ? (room as any).is_occupied : (room as any).isOccupied,
                createdAt: (room as any).created_at || (room as any).createdAt,
                updatedAt: (room as any).updated_at || (room as any).updatedAt,
              } : null,
            },
            message: response.message,
          };
        }

        return {
          success: false,
          error: response.error || response.message || 'Failed to fetch registration details',
        };
      },
      providesTags: ['Registration'],
    }),

    /**
     * Cancel Registration Endpoint
     * PATCH /registrations/:id/cancel
     * 
     * Cancels a registration with optional cancellation reason
     */
    cancelRegistration: builder.mutation<{
      success: boolean;
      message?: string;
      error?: string;
    }, { registrationId: string; reason?: string }>({
      query: ({ registrationId, reason }) => ({
        url: `/registrations/${registrationId}/cancel`,
        method: 'POST',
        body: {
          reason: reason || null,
        },
      }),
      invalidatesTags: ['Registration'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useCreateRegistrationMutation,
  useGetRegistrationsQuery,
  useLazyGetRegistrationsQuery,
  useGetRegistrationByPnrQuery,
  useLazyGetRegistrationByPnrQuery,
  useCancelRegistrationMutation,
} = registrationApi;
