/**
 * Slice for managing the current channel ID in the application state.
 * 
 * @module channelSlice
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    /**
     * The ID of the currently selected channel.
     * @type {string}
     */
    currentChannelId: ''
}

export const channelSlice = createSlice({
    /**
     * The name of the slice.
     * @type {string}
     */
    name: "channelId",
    reducers: {
        /**
         * Action to select a channel by setting the current channel ID.
         * 
         * @param {Object} state - The current state of the slice.
         * @param {Object} action - The action object containing the payload.
         * @param {string} action.payload - The ID of the channel to select.
         */
        selectChannel: (state, action) => {
            state.currentChannelId = action.payload;
        },
        /**
         * Action to clear the current channel ID.
         * 
         * @param {Object} state - The current state of the slice.
         */
        clearChannel: (state) => {
            state.currentChannelId = '';
        } 
    }
})

export const { selectChannel, clearChannel } = channelSlice.actions;
export default channelSlice.reducer;