/**
 * Redux Store Configuration
 * 
 * Configures the Redux store with:
 * - RTK Query API middleware
 * - Redux DevTools (development only)
 * - Type-safe hooks
 * - Middleware configuration
 */

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/services/baseApi';
import { locationApi } from '@/services/locationApi';

// Import all API services that use injectEndpoints to ensure they're initialized
// This ensures all endpoints are injected before the store accesses baseApi.middleware
import '@/services/authApi';
import '@/services/adminAuthApi';
import '@/services/yatraApi';
import '@/services/cloudinaryApi';
import '@/services/registrationApi';

/**
 * Configure Redux Store
 */
export const store = configureStore({
  reducer: {
    // Add the API reducers
    [baseApi.reducerPath]: baseApi.reducer, // Includes cloudinaryApi endpoints via injectEndpoints
    [locationApi.reducerPath]: locationApi.reducer,
  },

  // Add the API middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for API-related actions
      serializableCheck: {
        ignoredActions: [
          baseApi.reducerPath + '/executeQuery/pending',
          baseApi.reducerPath + '/executeQuery/fulfilled',
          baseApi.reducerPath + '/executeQuery/rejected',
          baseApi.reducerPath + '/executeMutation/pending',
          baseApi.reducerPath + '/executeMutation/fulfilled',
          baseApi.reducerPath + '/executeMutation/rejected',
          locationApi.reducerPath + '/executeQuery/pending',
          locationApi.reducerPath + '/executeQuery/fulfilled',
          locationApi.reducerPath + '/executeQuery/rejected',
        ],
        ignoredPaths: [baseApi.reducerPath, locationApi.reducerPath],
      },
    })
      .concat(baseApi.middleware)
      .concat(locationApi.middleware), // Separate concat calls to avoid duplicate middleware detection

  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

