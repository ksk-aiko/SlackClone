import { TimeStamp } from 'firebase/firestore';

export interface DMChat {
    id?: string;
    participants: string[];
    created_at: TimeStamp;
    updated_at: TimeStamp;
    last_message?: {
        text: string;
        sender_id: string;
        sent_at: TimeStamp;
    }
}

export interface DMMessage {
    user_id: string;
    dm_chat_id: string;
    text: string;
    created_at: TimeStamp;
    is_edited: boolean;
    updated_at: TimeStamp;
    is_read: boolean; 
}

export interface DMMessageRef {
    id: string;
    message: DMMessage;
}

export interface DMChatRef {
    id: string;
    chat: DMChat;
    hasUnread: boolean;
}
