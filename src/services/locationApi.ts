/**
 * Location API Service
 * 
 * Service for fetching Indian location data
 * Uses a local Next.js API proxy to bypass CORS restrictions from the third-party API
 */

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types for location data (matching actual API response)
export interface State {
    name: string;
    code: string;
    districts: string;
    talukas: string;
    villages: string;
}

export interface LocationResponse {
    success: boolean;
    states: State[];
    total: number;
}

/**
 * Location API
 * Uses local Next.js API proxy to access third-party location data
 */
export const locationApi = createApi({
    reducerPath: 'locationApi',

    baseQuery: fetchBaseQuery({
        baseUrl: '/api/locations',
        prepareHeaders: (headers) => {
            headers.set('accept', 'application/json');
            return headers;
        },
    }),

    tagTypes: ['States'],

    endpoints: (builder) => ({
        // Get all Indian states
        getIndianStates: builder.query<State[], void>({
            query: () => '/states',

            // Transform response to return just the states array
            transformResponse: (response: LocationResponse) => {
                return response?.states || [];
            },

            // Cache states for 1 hour (they rarely change)
            keepUnusedDataFor: 3600,

            providesTags: ['States'],
        }),
    }),
});

// Export hooks for usage in components
export const {
    useGetIndianStatesQuery,
} = locationApi;
