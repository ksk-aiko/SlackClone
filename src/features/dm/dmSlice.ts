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