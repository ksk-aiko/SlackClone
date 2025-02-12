/**
 * Slice for managing messages in the application state.
 * @module messageSlice
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateMessage, deleteMessage } from './messageAPI.ts';

// Define a type for the slice state
interface MessageState {
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

// Define the initial state using that type
const initialState: MessageState = {
  status: 'idle',
  error: null
};

/**
 * Async thunk to update a message.
 * 
 * @async
 * @function updateMessageAsync
 * @param {Object} payload - The payload object containing message details.
 * @param {string} payload.messageId - The ID of the message to update.
 * @param {string} payload.text - The new text of the message.
 * @returns {Promise<Object>} The response from the updateMessage API.
 */
export const updateMessageAsync = createAsyncThunk(
  'message/updateMessage',
  async ({ messageId, text }: { messageId: string; text: string }) => {
    const response = await updateMessage(messageId, text);
    return response;
  }
);

/**
 * Async thunk to delete a message.
 * 
 * @async
 * @function deleteMessageAsync
 * @param {string} messageId - The ID of the message to delete.
 * @returns {Promise<Object>} The response from the deleteMessage API.
 */
export const deleteMessageAsync = createAsyncThunk(
  'message/deleteMessage',
  async (messageId: string) => {
    const response = await deleteMessage(messageId);
    return response;
  }
);

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateMessageAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateMessageAsync.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(updateMessageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'メッセージの更新に失敗しました';
      })
      .addCase(deleteMessageAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteMessageAsync.fulfilled, (state) => {
        state.status = 'idle';
      })
      .addCase(deleteMessageAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'メッセージの削除に失敗しました';
      });
  }
});

export default messageSlice.reducer;