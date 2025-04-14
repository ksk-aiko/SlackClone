/**
 * Direct Message API for Slack Clone
 * 
 * This module provides functions for interacting with direct messages in Firestore.
 * It includes functionality for creating DM chats, sending messages, fetching 
 * messages and chats, and handling real-time subscriptions.
 */

import { firebaseApp } from "../../firebase/firebaseConfig";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    orderBy,
    serverTimestamp,
    onSnapshot,
    Timestamp,
    DocumentReference,
    writeBatch
} from "firebase/firestore";
import { DMChat, DMMessage, DMMessageRef, DMChatRef } from "../../type/DM";
import { User } from "../../type/User";

const db = getFirestore(firebaseApp);

/**
 * Creates a new direct message chat between two users or returns an existing one
 * @param currentUserId - The ID of the current user
 * @param receiverId - The ID of the user to chat with
 * @returns Promise resolving to the DM chat ID
 * @throws Error if the operation fails
 */

export const createDMChat = async (currentUserId: string, receiverId: string): Promise<string> => {
    try {
        const existingChat = await findExistingDMChat(currentUserId, receiverId);
        if (existingChat) {
            return existingChat.id;
        }

        const dmChatRef = await addDoc(collection(db, "dm_chats"), {
            participants: [currentUserId, receiverId],
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        });

        return dmChatRef.id;
    } catch (error) {
        console.error("Failed to create DMChat:.", error);
        throw error;
    }
}

/**
 * Searches for an existing DM chat between two users
 * @param userId - The ID of the first user
 * @param user2Id - The ID of the second user
 * @returns Promise resolving to the DMChatRef object if found, null otherwise
 * @throws Error if the search fails
 */

    export const findExistingDMChat = async (userId: string, user2Id: string): Promise<DMChatRef | null> => {
        try {
            const q = query(
                collection(db, "dm_chats"),
                where("participants", "array-contains", userId)
            );

            const querySnapshot = await getDocs(q);

            let existingChat: DMChatRef | null = null;

            querySnapshot.forEach((doc) => {
                const chatData = doc.data() as DMChat;
                if (chatData.participants.includes(user2Id)) {
                    existingChat = {
                        id: doc.id,
                        chat: chatData
                    };
                }
            });

            return existingChat;
        } catch (error) {
            console.error("Search for existing DM chat failed:", error);
            throw error;
        }
    };

/**
 * Retrieves all DM chats for a specific user
 * @param userId - The ID of the user whose chats to fetch
 * @returns Promise resolving to an array of DMChatRef objects
 * @throws Error if the fetch operation fails
 */

    export const fetchUserDMChats = async (userId: string): Promise<DMChatRef[]> => {
        try {
            const q = query(
                collection(db, "dm_chats"),
                where("participants", "array-contains", userId),
                orderBy("updated_at", "desc")
            );

            const querySnapshot = await getDocs(q);

            const dmChats: DMChatRef[] = [];

            querySnapshot.forEach((doc) => {
                    const chatData = doc.data() as DMChat;
                    dmChats.push({
                        id: doc.id,
                        chat: chatData
                    });
                });

                return dmChats;
            } catch (error) {
                console.error("Failed to fetch user DM chats:", error);
                throw error;
            }
        };

/**
 * Sends a direct message in a specific DM chat
 * @param dmChatId - The ID of the DM chat
 * @param senderId - The ID of the message sender
 * @param receiverId - The ID of the message receiver
 * @param text - The message text content
 * @returns Promise resolving to the new message ID
 * @throws Error if sending the message fails
 */

    export const sendDMMessage = async (dmChatId: string, senderId: string, receiverId: string, text: string): Promise<string> => {
        try {
            const messageData: DMMessage = {
                user_id: senderId,
                dm_chat_id: dmChatId,
                text,
                created_at: serverTimestamp() as Timestamp,
                updated_at: serverTimestamp() as Timestamp,
                is_edited: false,
                is_read: false
            };

            const messageRef = await addDoc(collection(db, "dm_messages"), messageData);

            const dmChatRef = doc(db, "dm_chats", dmChatId);
            await updateDoc(dmChatRef, {
                updated_at: serverTimestamp(),
                last_message: {
                    text,
                    sender_id: senderId,
                    sent_at: serverTimestamp()
                }
            });

            return messageRef.id;
        } catch (error) {
            console.error("Failed to send DM message:", error);
            throw error;
        }
    };

/**
 * Retrieves all messages from a specific DM chat
 * @param dmChatId - The ID of the DM chat
 * @returns Promise resolving to an array of DMMessageRef objects
 * @throws Error if the fetch operation fails
 */

    export const fetchDMMessages = async (dmChatId: string): Promise<DMMessageRef[]> =>{
        try {
            const q = query(
                collection(db, "dm_messages"),
                where("dm_chat_id", "==", dmChatId),
                orderBy("created_at", "asc")
            );

            const querySnapshot = await getDocs(q);

            const messages: DMMessageRef[] = [];

            querySnapshot.forEach((doc) => {
                const messageData = doc.data() as DMMessage;
                messages.push({
                    id: doc.id,
                    message: messageData
                });
                });

                return messages;
            } catch (error) {
                console.error("Failed to fetch DM messages:", error);
                throw error;
            }
        }

/**
 * Sets up a real-time listener for messages in a specific DM chat
 * @param dmChatId - The ID of the DM chat to subscribe to
 * @param callback - Function to call with updated messages array whenever changes occur
 * @returns Unsubscribe function to stop listening for changes
 */

    const subscribeToDMMessages = (
        dmChatId: string,
        callback: (messages: DMMessageRef[]) => void
    ) => {
        const q = query(
            collection(db, "dm_messages"),
            where("dm_chat_id", "==", dmChatId),
            orderBy("created_at", "asc")
        );

        return onSnapshot(q, (querySnapshot) => {
            const messages: DMMessageRef[] = [];
            querySnapshot.forEach((doc) => {
                messages.push({
                    id: doc.id,
                    message: doc.data() as DMMessage
                });
            });
            callback(messages);
        })
    }

/**
 * Marks multiple messages as read
 * @param messageIds - Array of message IDs to mark as read
 * @returns Promise that resolves when the operation completes
 * @throws Error if the operation fails
 */
    export const markMessagesAsRead = async (messageIds: string[]): Promise<void> => {
        try {
            const batch = writeBatch(db);

            messageIds.forEach((id) => {
                const messageRef = doc(db, "dm_messages", id);
                batch.update(messageRef, { is_read: true});
            });

            await batch.commit();
        } catch (error) {
            console.error("Failed to mark messages as read:", error);
            throw error;
        }
    };

/**
 * Sets up a real-time listener for a user's DM chats
 * @param userId - The ID of the user whose chats to subscribe to
 * @param callback - Function to call with updated chats array whenever changes occur
 * @returns Unsubscribe function to stop listening for changes
 */

    export const subscribeToDMChats = (
        userId: string,
        callback: (chats: DMChatRef[]) => void
    ) => {
        const q = query(
            collection(db, "dm_chats"),
            where("participants", "array-contains", userId),
            orderBy("updated_at", "desc")
        );

        return onSnapshot(q, (querySnapshot) => {
            const chats: DMChatRef[] = [];
            querySnapshot.forEach((doc) => {
                chats.push({
                    id: doc.id,
                    chat: doc.data() as DMChat
                });
            });
            callback(chats);
        });
    }
    
    
