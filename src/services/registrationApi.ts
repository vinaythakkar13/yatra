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

export interface SplitRegistrationRequest {
  originalPnr: string;
  ticketType?: string;
  name: string;
  whatsappNumber: string;
  numberOfPersons: number;
  yatraId: string;
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
}

export interface CreateRegistrationResponse {
  success: boolean;
  data?: {
    id: string;
    pnr: string;
    internalPnr?: string | null;
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

export interface User {
  id: string;
  name: string;
  contact_number: string;
  email: string | null;
  gender: "male" | "female" | "other";
  age: number;
  number_of_persons: number;
  pnr: string;
  boarding_state: string;
  boarding_city: string;
  boarding_point: string;
  arrival_date: string;
  return_date: string;
  assigned_room_id: string | null;
  ticket_images: string[];
  registration_status: "pending" | "approved" | "rejected";
  is_room_assigned: boolean;
  room_assignment_status: "draft" | "finalized";
  created_at: string;
  updated_at: string;

  assignedRooms: AssignedRoom[];
  hotel: Hotel;
}

export interface Person {
  id: string;
  registration_id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  is_handicapped: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssignedRoom {
  id: string;
  room_number: string;
  floor: string;
}

export interface Hotel {
  id: string;
  name: string;
  address: string;
  manager_name: string;
  manager_contact: string;
  map_link: string;
}

export interface Yatra {
  id: string;
  name: string;
  banner_image: string;
  mobile_banner_image: string;
  start_date: string;
  end_date: string;
  registration_start_date: string;
  registration_end_date: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}


export interface Registration {
  id: string;
  user_id: string;
  yatra_id: string;
  pnr: string;
  split_pnr: string | null;
  original_pnr: string | null;
  ticket_type: string | null;
  name: string;
  whatsapp_number: string;
  number_of_persons: number;
  boarding_city: string;
  boarding_state: string;
  arrival_date: string;
  return_date: string;
  ticket_images: string[];
  status: "pending" | "approved" | "rejected" | "cancelled";
  cancellation_reason: string | null;
  admin_comments: string | null;
  rejection_reason: string | null;
  document_status: "pending" | "approved" | "rejected" | "cancelled";
  document_rejection_reason: string | null;
  approved_by_admin_id: string | null;
  rejected_by_admin_id: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;
  cancelled_by_admin_id: string | null;
  created_at: string;
  updated_at: string;
  user: User;
  yatra: Yatra;
  persons: Person[];
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
      document_status?: 'pending' | 'approved' | 'rejected';
      document_rejection_reason?: string | null;
      created_at: string;
      updated_at: string;
      split_pnr?: string;
      original_pnr?: string;
      ticketType: string | null;
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
  original_pnr?: string | null;
  split_pnr?: string | null;
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
  ticket_type?: string;
  document_status?: 'pending' | 'approved' | 'rejected';
  document_rejection_reason?: string | null;
  hotel?: any;
  assignedRooms?: any[];
  registration_status?: string;
  is_room_assigned?: boolean;
  room_assignment_status?: string;
}
// ...
export interface GetRegistrationsResponse {
  success: boolean;
  data?: Registration[]; // Transformed to frontend format (camelCase)
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

export interface FrontendRegistrationDetails {
  id: string;
  pnr: string;
  name: string;
  whatsappNumber: string;
  contactNumber: string;
  numberOfPersons: number;
  boardingPoint: {
    city: string;
    state: string;
  };
  arrivalDate: string;
  returnDate: string;
  ticketImages: string[];
  yatraId: string;
  roomStatus: string;
  documentStatus: string;
  createdAt: string;
  splitPnr: string | null;
  originalPnr: string | null;
  assignedRooms: Array<{
    id: string;
    room_number: string;
    floor: string;
  }>;
  cancellationReason?: string | null;
  rejectionReason?: string | null;
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
     * GET /registrations?yatraId={yatraId}&pnr={pnr}&page={page}&limit={limit}&search={search}&filterMode={filterMode}
     * 
     * Fetches all registrations for a specific yatra or by PNR with pagination, search and filtering
     */
    getRegistrations: builder.query<GetRegistrationsResponse, {
      yatraId?: string;
      pnr?: string;
      page?: number;
      limit?: number;
      search?: string;
      filterMode?: 'all' | 'general' | 'cancelled';
      ticketType?: string;
      state?: string;
      documentStatus?: string;
    }>({
      query: ({ yatraId, pnr, page, limit, search, filterMode, ticketType, state, documentStatus }) => {
        const params: Record<string, string | number> = {};
        if (yatraId) params.yatraId = yatraId;
        if (pnr) params.pnr = pnr;
        if (page) params.page = page;
        if (limit) params.limit = limit;
        if (search) params.search = search;
        if (filterMode) params.filterMode = filterMode;
        if (ticketType) params.ticketType = ticketType;
        if (state) params.state = state;
        if (documentStatus) params.documentStatus = documentStatus;

        return {
          url: '/registrations',
          method: 'GET',
          params,
        };
      },
      transformResponse: (response: any): GetRegistrationsResponse => {
        // API returns: { success: true, data: [...], pagination: {...} }
        if (response.success && response.data && Array.isArray(response.data)) {
          const registrations: Registration[] = response.data.map((apiReg: ApiRegistration) => {
            return {
              id: apiReg.id,
              user_id: apiReg.user_id,
              yatra_id: apiReg.yatra_id,
              pnr: apiReg.pnr,
              split_pnr: apiReg.split_pnr || null,
              original_pnr: apiReg.original_pnr || null,
              ticket_type: apiReg.ticket_type || null,
              name: apiReg.name,
              whatsapp_number: apiReg.whatsapp_number,
              number_of_persons: apiReg.number_of_persons,
              boarding_city: apiReg.boarding_city,
              boarding_state: apiReg.boarding_state,
              arrival_date: apiReg.arrival_date,
              return_date: apiReg.return_date,
              ticket_images: apiReg.ticket_images || [],
              status: apiReg.status,
              cancellation_reason: apiReg.cancellation_reason || null,
              admin_comments: apiReg.admin_comments || null,
              rejection_reason: apiReg.rejection_reason || null,
              document_status: apiReg.document_status || 'pending',
              document_rejection_reason: apiReg.document_rejection_reason || null,
              approved_by_admin_id: apiReg.approved_by_admin_id || null,
              rejected_by_admin_id: apiReg.rejected_by_admin_id || null,
              approved_at: apiReg.approved_at || null,
              rejected_at: apiReg.rejected_at || null,
              cancelled_at: apiReg.cancelled_at || null,
              cancelled_by_admin_id: (apiReg as any).cancelled_by_admin_id || null,
              created_at: apiReg.created_at,
              updated_at: apiReg.updated_at,

              user: {
                id: apiReg.user?.id || apiReg.user_id,
                name: apiReg.user?.name || apiReg.name,
                contact_number: apiReg.user?.contact_number || apiReg.whatsapp_number,
                email: apiReg.user?.email || null,
                gender: apiReg.user?.gender || 'male',
                age: apiReg.user?.age || 0,
                number_of_persons: apiReg.user?.number_of_persons || apiReg.number_of_persons,
                pnr: apiReg.user?.pnr || apiReg.pnr,
                boarding_state: apiReg.user?.boarding_state || apiReg.boarding_state,
                boarding_city: apiReg.user?.boarding_city || apiReg.boarding_city,
                boarding_point: apiReg.user?.boarding_point || `${apiReg.boarding_city}, ${apiReg.boarding_state}`,
                arrival_date: apiReg.user?.arrival_date || apiReg.arrival_date,
                return_date: apiReg.user?.return_date || apiReg.return_date,
                assigned_room_id: apiReg.user?.assigned_room_id || null,
                ticket_images: apiReg.user?.ticket_images || apiReg.ticket_images || [],
                registration_status: apiReg.user?.registration_status || (apiReg.status as any),
                is_room_assigned: apiReg.user?.is_room_assigned || apiReg.is_room_assigned || false,
                room_assignment_status: apiReg.user?.room_assignment_status || (apiReg.room_assignment_status as any) || 'draft',
                created_at: apiReg.user?.created_at || apiReg.created_at,
                updated_at: apiReg.user?.updated_at || apiReg.updated_at,
                assignedRooms: apiReg.user?.assignedRooms || apiReg.assignedRooms || [],
                hotel: apiReg.user?.hotel || apiReg.hotel || null,
              },
              yatra: {
                id: apiReg.yatra?.id || apiReg.yatra_id,
                name: apiReg.yatra?.name || '',
                banner_image: apiReg.yatra?.banner_image || '',
                mobile_banner_image: apiReg.yatra?.mobile_banner_image || '',
                start_date: apiReg.yatra?.start_date || apiReg.arrival_date,
                end_date: apiReg.yatra?.end_date || apiReg.return_date,
                registration_start_date: apiReg.yatra?.registration_start_date || '',
                registration_end_date: apiReg.yatra?.registration_end_date || '',
                description: apiReg.yatra?.description || null,
                created_at: apiReg.yatra?.created_at || apiReg.created_at,
                updated_at: apiReg.yatra?.updated_at || apiReg.updated_at,
              },
              persons: (apiReg.persons || []).map(person => ({
                id: person.id,
                registration_id: person.registration_id || apiReg.id,
                name: person.name,
                age: person.age,
                gender: person.gender,
                is_handicapped: person.is_handicapped,
                created_at: person.created_at,
                updated_at: person.updated_at,
              })),
            };
          });

          return {
            success: true,
            data: registrations, // Return array directly, not wrapped
            pagination: response.pagination,
            message: response.message,
          };
        }

        // Return error format if response is not successful
        return {
          success: false,
          data: [],
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
        registration: FrontendRegistrationDetails;
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
          registration: FrontendRegistrationDetails;
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

          const frontendRegistration: FrontendRegistrationDetails = {
            id: registration.id,
            pnr: registration.pnr,
            name: registration.name,
            whatsappNumber: registration.whatsapp_number,
            contactNumber: registration.whatsapp_number,
            numberOfPersons: registration.number_of_persons,
            boardingPoint: {
              city: registration.boarding_city,
              state: registration.boarding_state,
            },
            arrivalDate: formatDate(registration.arrival_date),
            returnDate: formatDate(registration.return_date),
            ticketImages: registration.ticket_images || [],
            yatraId: yatra.id,
            roomStatus: room ? 'Assigned' : 'Pending',
            documentStatus: registration.document_status || 'pending',
            createdAt: registration.created_at,
            splitPnr: registration.split_pnr || null,
            originalPnr: registration.original_pnr || null,
            assignedRooms: room ? [{ id: room.id, room_number: room.roomNumber, floor: room.floor }] : [],
            cancellationReason: registration.cancellation_reason || null,
            rejectionReason: registration.rejection_reason || null,
          };

          return {
            success: true,
            data: {
              registration: frontendRegistration,
              persons: persons.map(p => ({
                name: p.name,
                age: p.age,
                gender: p.gender,
                isHandicapped: p.is_handicapped,
              })),
              yatra: {
                id: yatra.id,
                name: yatra.name,
                bannerImage: yatra.bannerImage,
                description: yatra.description || undefined,
                startDate: yatra.startDate,
                endDate: yatra.endDate,
                registrationStartDate: yatra.registrationStartDate,
                registrationEndDate: yatra.registrationEndDate,
                createdAt: yatra.createdAt,
                updatedAt: yatra.updatedAt,
              },
              hotel: hotel,
              room: room,
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

    /**
     * Update Ticket Type Endpoint
     * PATCH /registrations/:id/ticket-type
     * 
     * Updates the ticket type for a registration
     */
    updateTicketType: builder.mutation<{
      success: boolean;
      message?: string;
      error?: string;
      data?: any;
    }, { id: string; ticketType: string }>({
      query: ({ id, ticketType }) => ({
        url: `/registrations/${id}/ticket-type`,
        method: 'PATCH',
        body: { ticketType },
      }),
    }),

    /**
     * Split Registration Endpoint
     * POST /registrations/split
     * 
     * Creates a new registration for manual entry (admin use)
     */
    splitRegistration: builder.mutation<CreateRegistrationResponse, SplitRegistrationRequest>({
      query: (registrationData) => ({
        url: '/registrations/split',
        method: 'POST',
        body: registrationData,
      }),
      invalidatesTags: ['Registration'],
    }),

    /**
     * Approve Document Endpoint
     * POST /registrations/:id/approve-document
     */
    approveDocument: builder.mutation<{
      success: boolean;
      message?: string;
      error?: string;
    }, string>({
      query: (registrationId) => ({
        url: `/registrations/${registrationId}/approve-document`,
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Registration'],
    }),

    /**
     * Reject Document Endpoint
     * POST /registrations/:id/reject-document
     */
    rejectDocument: builder.mutation<{
      success: boolean;
      message?: string;
      error?: string;
    }, { registrationId: string; reason: string; comments?: string }>({
      query: ({ registrationId, reason, comments }) => ({
        url: `/registrations/${registrationId}/reject-document`,
        method: 'POST',
        body: { reason, comments: comments || '' },
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
  useUpdateTicketTypeMutation,
  useSplitRegistrationMutation,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
} = registrationApi;
