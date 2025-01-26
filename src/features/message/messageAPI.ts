import {getFirestore, query, collection, where, addDoc, onSnapshot, Timestamp} from "firebase/firestore";
import {firebaseApp} from "../../firebase/firebaseConfig.ts";
import {Message, MessageRef} from "../../type/Message.ts";

const db = getFirestore(firebaseApp);

/**
 * Subscribes to messages in a specific channel and invokes a callback when messages are updated.
 * 
 * @param channelId - The ID of the channel to subscribe to.
 * @param onMessageUpdated - A callback function that is called with the updated messages.
 * @returns A function to unsubscribe from the messages.
 */

export const subscribeMessages = (channelId: string, onMessageUpdated: (messages: MessageRef[]) => void) => {
    // Get documents with matching channelId from the Firestore's messages collection
    const q = query(collection(db, "messages"), where("channelId", "==", channelId));

    // Subscribe to the query
    return onSnapshot(q, (querySnapshot) => {
        const messageRefs: MessageRef[] = [];
        querySnapshot.forEach((doc) => {
            messageRefs.push({
                id: doc.id,
                message: doc.data() as Message
            });
        });
        onMessageUpdated(messageRefs);
    }, (error) => {
        console.error("Failed to subscribe messages:", error);
    });
}

/**
 * Posts a new message to the Firestore messages collection.
 * 
 * @param message - The message object to be posted.
 * @returns A promise that resolves when the message is successfully posted.
 */

export const postMessage = async (message: Message) => {
    await addDoc(collection(db, "messages"), message)
}

/**
 * Creates a new message object.
 * 
 * @param userId - The ID of the user creating the message.
 * @param channelId - The ID of the channel where the message is being posted.
 * @param messageText - The text content of the message.
 * @returns A new message object.
 */

export const createMessage = (
    userId: string,
    channelId: string,
    messageText: string
): Message => {
    const timestamp = Timestamp.fromDate(new Date());
    return {
        user_id: userId,
        channel_id: channelId,
        text: messageText,
        create_at: timestamp,
        is_edited: false,
        update_at: timestamp,
    };
};