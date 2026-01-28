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
        '0-18': number;
        '19-35': number;
        '36-50': number;
        '50+': number;
    };
    handicappedCount: number;
}

export interface StateData {
    state: string;
    totalCount: number;
    cities: CityData[];
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
    }),
});

export const {
    useGetDashboardDataQuery,
    useLazyGetDashboardDataQuery,
} = dashboardApi;
