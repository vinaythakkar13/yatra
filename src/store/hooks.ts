/**
 * Typed Redux Hooks
 * 
 * Pre-typed versions of the React-Redux hooks for better TypeScript support
 * Use these hooks instead of the plain `useDispatch` and `useSelector`
 */

import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

