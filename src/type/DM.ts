/**
 * Types related to direct messaging functionality
 */

/**
 * Interface representing a direct message chat between users
 * @interface DMChat
 * @property {string} [id] - Optional unique identifier for the chat
 * @property {string[]} participants - Array of user IDs participating in the chat
 * @property {Timestamp} created_at - When the chat was created
 * @property {Timestamp} updated_at - When the chat was last updated
 * @property {Object} [last_message] - Information about the last message in the chat
 * @property {string} [last_message.text] - Content of the last message
 * @property {string} [last_message.sender_id] - ID of the user who sent the last message
 * @property {Timestamp} [last_message.sent_at] - When the last message was sent
 */

/**
 * Interface representing a single direct message
 * @interface DMMessage
 * @property {string} user_id - ID of the user who sent the message
 * @property {string} dm_chat_id - ID of the chat this message belongs to
 * @property {string} text - Content of the message
 * @property {Timestamp} created_at - When the message was created
 * @property {boolean} is_edited - Whether the message has been edited
 * @property {Timestamp} updated_at - When the message was last updated
 * @property {boolean} is_read - Whether the message has been read by the recipient
 */

/**
 * Interface representing a direct message with its ID
 * @interface DMMessageRef
 * @property {string} id - Unique identifier for the message
 * @property {DMMessage} message - The message data
 */

/**
 * Interface representing a direct message chat with its ID
 * @interface DMChatRef
 * @property {string} id - Unique identifier for the chat
 * @property {DMChat} chat - The chat data
 */

import { Timestamp } from 'firebase/firestore';

export interface DMChat {
    id?: string;
    participants: string[];
    created_at: Timestamp;
    updated_at: Timestamp;
    last_message?: {
        text: string;
        sender_id: string;
        sent_at: Timestamp;
    }
}

export interface DMMessage {
    user_id: string;
    dm_chat_id: string;
    text: string;
    created_at: Timestamp;
    is_edited: boolean;
    updated_at: Timestamp;
    is_read: boolean; 
}

export interface DMMessageRef {
    id: string;
    message: DMMessage;
}

export interface DMChatRef {
    id: string;
    chat: DMChat;
}
