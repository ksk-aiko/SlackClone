/**
 * Configures the Redux store with the user and channel reducers.
 * 
 * @file store.ts
 * @module store
 * 
 * @requires @reduxjs/toolkit
 * @requires ../features/users/userSlice.ts
 * @requires ../features/channel/channelSlice.ts
 * 
 * @typedef {typeof store.dispatch} AppDispatch - The dispatch type inferred from the store.
 * @typedef {ReturnType<typeof store.getState>} RootState - The root state type inferred from the store.
 */
import {configureStore} from "@reduxjs/toolkit";
import userReducer from "../features/users/userSlice.ts";
import channelReducer from "../features/channel/channelSlice.ts";

export const store = configureStore({
    reducer: {
        user: userReducer,
        channel: channelReducer
    }
})
// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;