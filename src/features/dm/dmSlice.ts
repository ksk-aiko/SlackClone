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

