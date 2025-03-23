
/**
 * Redux slice for direct messaging functionality.
 * This module handles the state management for DM chats, messages, and related operations.
 * 
 * @module dmSlice
 * 
 * State management:
 * - Tracks DM chats for the current user
 * - Maintains current active DM chat
 * - Stores messages for the current chat
 * - Handles loading states and errors
 * 
 * Async operations:
 * - Fetching user's DM chats
 * - Fetching messages for a specific DM chat
 * - Sending new DM messages
 * - Creating new DM chats
 * - Marking messages as read
 * 
 * Synchronous actions:
 * - Setting the current DM chat
 * - Adding new DM messages
 * - Updating existing DM chats
 * - Setting the messages for the current chat
 */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    fetchUserDMChats,
    fetchDMMessages,
    sendDMMessage,
    createDMChat,
    markMessagesAsRead
} from './dmApi';
import { DMChatRef, DMMessageRef } from '../../type/DM';

interface DMState {
    dmChats: DMChatRef[];
    currentDMChatId: string | null;
    messages: DMMessageRef[];
    loading: boolean;
    error: string | null;
}

const initialState: DMState = {
    dmChats: [],
    currentDMChatId: null,
    messages: [],
    loading: false,
    error: null
}

export const fetchDMChatsAsync = createAsyncThunk(
    "dm/fetchChats",
    async (userId: string) => {
        return await fetchUserDMChats(userId);
    }
)

export const fetchDMMessagesAsync = createAsyncThunk(
    "dm/fetchMessages",
    async (dmChatId: string) => {
        return await fetchDMMessages(dmChatId);
    }
)

export const sendMessageAsync = createAsyncThunk(
    "dm/sendMessage",
    async ({dmChatId, senderId, receiverId, text}: {
        dmChatId: string,
        senderId: string,
        receiverId: string,
        text: string
    }) => {
        return await sendDMMessage(dmChatId, senderId, receiverId, text);
    })

export const createOrGetDMChatAsync = createAsyncThunk(
    "dm/createOrGetChat",
    async ({currentUserId, receiverId}: {
        currentUserId: string,
        receiverId: string
    }) => {
        return await createDMChat(currentUserId, receiverId);
    }
);

export const markMessagesAsReadAsync = createAsyncThunk(
    "dm/markAsRead",
    async (messageIds: string[]) => {
        await markMessagesAsRead(messageIds);
        return messageIds;
    }
);

const dmSlice = createSlice({
  name: "dm",
  initialState,
  reducers: {
    setCurrentDMChat: (state, action) => {
      state.currentDMChatId = action.payload;
    },
    addDMMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    updateDMChat: (state, action) => {
      const index = state.dmChats.findIndex(
        (chat) => chat.id === action.payload.id
      );
      if (index !== -1) {
        state.dmChats[index] = action.payload;
      }
    },
    setDMMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDMChatsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDMChatsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.dmChats = action.payload;
        state.error = null;
      })
      .addCase(fetchDMChatsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch DM chats";
      })
      .addCase(createOrGetDMChatAsync.fulfilled, (state, action) => {
        state.currentDMChatId = action.payload.id;
      });
  },
});

export const { setCurrentDMChat, addDMMessage, updateDMChat, setDMMessages } = dmSlice.actions;
export default dmSlice.reducer;