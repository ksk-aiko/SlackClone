import { Timestamp } from 'firebase/firestore';
/**
 * Represents a communication channel in the application.
 */
export interface Channel {
    /**
     * The name of the channel.
     */
    name: string;

    /**
     * The timestamp when the channel was created.
     */
    create_at: Timestamp;
}

/**
 * Represents a reference to a channel with its unique identifier.
 */
export interface ChannelRef {
    /**
     * The unique identifier of the channel.
     */
    id: string;

    /**
     * The channel details.
     */
    channel: Channel;
}