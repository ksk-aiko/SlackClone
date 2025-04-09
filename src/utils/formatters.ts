/**
 * Formats a timestamp into a human-readable string representation.
 * 
 * The function handles different timestamp formats:
 * - Firestore timestamps (with toDate method)
 * - JavaScript Date objects
 * - Timestamp values that can be parsed by the Date constructor
 * 
 * The formatted output depends on when the message was sent:
 * - Today: "today HH:MM"
 * - Yesterday: "yesterday HH:MM"
 * - Older messages: "MM/DD HH:MM"
 * 
 * @param timestamp - The timestamp to format (Firestore timestamp, Date object, or parseable date string/number)
 * @returns A formatted string representing when the message was sent
 */

export const formatMessageTime = (timestamp: any): string => {
    if (!timestamp) return '';

    let date;

    if (timestamp && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
    } elseif (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    // today message
    if (messageDate.getTime() === today.getTime()) {
        return `today ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    // yesterday message
    if (messageDate.getTime() === yesterday.getTime()) {
        return `yesterday ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
    // older message
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}