import {Timestamp} from "firebase/firestore";

/**
 * Represents a message in the SlackClone application.
 * 
 * @interface Message
 * @property {string} user_id - The ID of the user who sent the message.
 * @property {string} channel_id - The ID of the channel where the message was sent.
 * @property {string} text - The content of the message.
 * @property {Timestamp} create_at - The timestamp when the message was created.
 * @property {boolean} is_edited - Indicates whether the message has been edited.
 * @property {Timestamp} update_at - The timestamp when the message was last updated.
 */

export interface Message {
    user_id: string;
    channel_id: string;
    text: string;
    create_at: Timestamp;
    is_edited: boolean;
    update_at: Timestamp;
}

/**
 * Represents a reference to a message in the SlackClone application.
 * 
 * @interface MessageRef
 * @property {string} id - The unique identifier for the message reference.
 * @property {Message} message - The message object associated with this reference.
 */
export interface MessageRef {
    id: string;
    message: Message;
}