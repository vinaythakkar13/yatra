/**
 * Dashboard API Service
 * 
 * Handles dashboard-related API endpoints:
 * - Get dashboard metrics and analytics
 */

import { baseApi } from './baseApi';

export interface DashboardStats {
    totalRegistrations: number;
    totalPeople: number;
    allottedRegistrations: number;
    pendingAllotment: number;
    pendingPeoplestobealloted: number;
    cancelledRegistrations: number;
    availableRooms: number;
    availableBeds: number;
}

export interface CityData {
    city: string;
    totalCount: number;
    gender: {
        male: number;
        female: number;
    };
    ageRanges: {
        '0-20': number;
        '21-40': number;
        '41-60': number;
        '60+': number;
    };
    handicappedCount: number;
}

export interface StateData {
    state: string;
    totalCount: number;
    cities: CityData[];
    totalRegistrations: number | null;
}

export interface registrationsAnalytics {
    stateData: StateData[];
    genderData: { name: string; value: number }[];
    ageData: { range: string; count: number }[];
    handicapCount: number;
}

export interface HotelAvailability {
    name: string;
    totalRooms: number;
    availableRooms: number;
    totalBeds: number;
    availableBeds: number;
}

export interface GetDashboardDataResponse {
    success: boolean;
    message?: string;
    data: {
        stats: DashboardStats;
        registrationsAnalytics: registrationsAnalytics;
        hotelAnalytics: HotelAvailability[];
    };
}

export interface UserStatusData {
    statistics: {
        total: number;
        acquired: number;
        notAcquired: number;
        allotted: number;
        pendingAllotment: number;
    };
    data: any[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface GetUserStatusResponse {
    success: boolean;
    message?: string;
    data: UserStatusData;
}


export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Get Dashboard Data
         * GET /admin/dashboard
         * 
         * Fetches all dashboard metrics for a specific yatra
         */
        getDashboardData: builder.query<GetDashboardDataResponse['data'], string>({
            query: (yatraId) => ({
                url: '/admin/dashboard',
                method: 'GET',
                params: { yatraId },
            }),
            transformResponse: (response: GetDashboardDataResponse) => {
                return response.data;
            },
            providesTags: ['Registration', 'Yatra', 'Hotel'],
        }),
        /**
         * Get User Status Data
         * GET /admin/dashboard/user-status
         * 
         * Fetches user status checking data with filtering and pagination
         */
        getUserStatus: builder.query<GetUserStatusResponse['data'], {
            yatraId: string;
            hotelId?: string;
            status?: string;
            search?: string;
            page?: number;
            limit?: number;
        }>({
            query: ({ yatraId, hotelId, status, search, page, limit }) => {
                const params: Record<string, string | number> = { yatraId };
                if (hotelId) params.hotelId = hotelId;
                if (status) params.status = status;
                if (search) params.search = search;
                if (page) params.page = page;
                if (limit) params.limit = limit;

                return {
                    url: '/admin/dashboard/user-status',
                    method: 'GET',
                    params,
                };
            },
            transformResponse: (response: GetUserStatusResponse) => {
                return response.data;
            },
            providesTags: ['Registration', 'Hotel'],
        }),
    }),
});

export const {
    useGetDashboardDataQuery,
    useLazyGetDashboardDataQuery,
    useGetUserStatusQuery,
    useLazyGetUserStatusQuery,
} = dashboardApi;
