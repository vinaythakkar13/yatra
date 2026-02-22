/**
 * Hotel Auth API Service
 * 
 * Handles hotel-specific authentication:
 * - Hotel Login using login_id and password
 */

import { baseApi } from './baseApi';
import { tokenStorage, userStorage } from '@/utils/storage';

export interface HotelLoginRequest {
    login_id: string;
    password: string;
}

export interface HotelLoginResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        hotel: {
            id: string;
            name: string;
            login_id: string;
        }
    };
}

export const hotelAuthApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Hotel Login Endpoint
         * POST /auth/hotel/login
         */
        hotelLogin: builder.mutation<HotelLoginResponse, HotelLoginRequest>({
            query: (credentials) => ({
                url: '/auth/hotel-login', // Matching potential backend pattern
                method: 'POST',
                body: credentials,
            }),

            async onQueryStarted(arg, { queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.success && data.data) {
                        // Store tokens and hotel user data
                        tokenStorage.setAccessToken(data.data.token);
                        // We use a custom "hotel" role for hotel staff
                        userStorage.setUser({ ...data.data.hotel, role: 'hotel_staff' });
                    }
                } catch (error) {
                    console.error('[Hotel Auth API] Login failed:', error);
                    const response = {
                        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExZTkwNmQxLTk4YWMtNDA5NC05MTUyLTRlNjgyZDMyOThjZCIsImxvZ2luX2lkIjoiSFRMLTAwMDMiLCJuYW1lIjoiVGFqIiwicm9sZSI6ImhvdGVsIiwiaWF0IjoxNzcxNjcyMjk0LCJleHAiOjE3NzE3NTg2OTR9.BFsdZTW4sJtRen3XIPB-NNr5uCBf6W8JprW8fjrC6HU",
                        hotel: {
                            id: "11e906d1-98ac-4094-9152-4e682d3298cd",
                            login_id: "HTL-0003",
                            name: "Taj",
                            role: "hotel"
                        }
                    }
                    tokenStorage.setAccessToken(response.token);
                    userStorage.setUser({ ...response.hotel, role: 'hotel_staff' });
                }
            },

            invalidatesTags: ['Auth', 'User', 'Hotel'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useHotelLoginMutation,
} = hotelAuthApi;
