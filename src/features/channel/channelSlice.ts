/**
 * Slice for managing the current channel ID in the application state.
 * @module channelSlice
 */

import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import { updateChannel, deleteChannel} from './channelAPI.ts';

const initialState = {
    /**
     * The ID of the currently selected channel.
     * @type {string}
     */
    currentChannelId: ''
}

/**
 * Async thunk to update a channel.
 * 
 * @async
 * @function updateChannelAsync
 * @param {Object} payload - The payload object containing channel details.
 * @param {string} payload.channelId - The ID of the channel to update.
 * @param {string} payload.name - The new name of the channel.
 * @returns {Promise<Object>} The response from the updateChannel API.
 */

export const updateChannelAsync = createAsyncThunk(
    'channel/updateChannel',
    async ({channelId, name}: {channelId: string, name: string}) => {
        const response = await updateChannel(channelId, name);
        return response;
    }
);

/**
 * Async thunk to delete a channel.
 * 
 * @async
 * @function deleteChannelAsync
 * @param {string} channelId - The ID of the channel to delete.
 * @returns {Promise<Object>} The response from the deleteChannel API.
 */

export const deleteChannelAsync = createAsyncThunk(
    'channel/deleteChannel',
    async (channelId: string) => {
        const response = await deleteChannel(channelId);
        return response;
    }
);

/**
 * Slice for managing the current channel ID in the application state.
 * This slice includes actions for selecting and clearing the current channel,
 * as well as async thunks for updating and deleting channels.
 * 
 * The state includes:
 * - currentChannelId: The ID of the currently selected channel.
 * - status: The status of the async operations (e.g., 'idle', 'loading', 'failed').
 * 
 * Actions:
 * - selectChannel: Sets the current channel ID.
 * - clearChannel: Clears the current channel ID.
 * 
 * Async Thunks:
 * - updateChannelAsync: Updates a channel's details.
 * - deleteChannelAsync: Deletes a channel.
 * 
 * Extra Reducers handle the state changes for the async thunks.
 */

export const channelSlice = createSlice({
    /**
     * The name of the slice.
     * @type {string}
     */
    name: "channelId",
    initialState,
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
    },
    extraReducers: (builder) => {
        builder
           .addCase(updateChannelAsync.pending, (state) => {
            state.status = 'loading';
           })
           .addCase(updateChannelAsync.fulfilled, (state, action) => {
            state.status = 'idle';
           })
           .addCase(updateChannelAsync.rejected, (state, action) => {
            state.status = 'failed';
           })
           .addCase(deleteChannelAsync.pending, (state) => {
            state.status = 'loading';
           })
           .addCase(deleteChannelAsync.fulfilled, (state, action) => {
            state.status = 'idle';
           })
           .addCase(deleteChannelAsync.rejected, (state, action) => {
            state.status = 'failed';
           })
    }
})


export const { selectChannel, clearChannel } = channelSlice.actions;
export default channelSlice.reducer;