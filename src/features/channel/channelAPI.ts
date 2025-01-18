/**
 * Subscribes to the "channels" collection in Firestore and listens for real-time updates.
 * 
 * @param onChannelsUpdated - A callback function that is called whenever the channels are updated.
 *                            It receives an array of `ChannelRef` objects representing the updated channels.
 * 
 * @returns A function that can be called to unsubscribe from the channel updates.
 * 
 * @example
 * ```typescript
 * const unsubscribe = subscribeChannels((channels) => {
 *     console.log("Updated channels:", channels);
 * });
 * 
 * // To unsubscribe from the updates
 * unsubscribe();
 * ```
 */

import {
    getFirestore,
    query,
    collection,
    onSnapshot,
    Timestamp,
    addDoc,
} from "firebase/firestore";
import { firebaseApp } from "../../firebase/firebaseConfig.ts";
import { Channel, ChannelRef} from "../../type/Channel.ts";

const db = getFirestore(firebaseApp); 

export const subscribeChannels = (
    onChannelsUpdated: (channels: ChannelRef[]) => void
) => {
    const q = query(collection(db, "channels"));

    return onSnapshot(
        q,
        (querySnapshot) => {
            const channelRefs: ChannelRef[] = [];
            querySnapshot.forEach((doc) => {
                channelRefs.push({
                    id: doc.id,
                    channel: doc.data() as Channel,
                });
            });
            onChannelsUpdated(channelRefs);
        },
        (error) => {
            console.error("Failed to subscribe to channels:", error);
        }
    );
};

/**
 * Posts a new channel to the "channels" collection in Firestore.
 * 
 * @param channel - The channel object to post.
 * 
 * @example
 * ```typescript
 * const channel = createChannel("general");
 * postChannel(channel);
 * ```
 */
export const postChannel = async (channel: Channel) => {
    await addDoc(collection(db, "channels"), channel);
};

export const createChannel = (name: string): Channel => {
    const timestamp = Timestamp.fromDate(new Date());
    return {
        name: name,
        create_at: timestamp,
    };
};