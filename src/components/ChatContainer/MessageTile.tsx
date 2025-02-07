/**
 * MessageTile component displays a single message along with the user information.
 * 
 * @component
 * @param {MessageTileProps} message - The message object containing the message details.
 * 
 * @typedef {Object} MessageTileProps
 * @property {Message} message - The message object containing the message details.
 * 
 * @typedef {Object} User
 * @property {string} id - The unique identifier of the user.
 * @property {string} displayName - The display name of the user.
 * @property {string} profile_picture - The URL of the user's profile picture.
 * 
 * @typedef {Object} Message
 * @property {string} id - The unique identifier of the message.
 * @property {string} user_id - The unique identifier of the user who sent the message.
 * @property {Date} create_at - The timestamp when the message was created.
 * @property {string} content - The content of the message.
 * 
 * @returns {JSX.Element} The rendered MessageTile component.
 */
import React, {useEffect, useState} from 'react';
import {User} from "../../type/User.ts";
import {Message} from "../../type/Message.ts";
import {getUser} from "../../features/users/userAPI.ts"

interface MessageTileProps {
    message: Message;
    key: string;
}
const MessageTile = (message: MessageTileProps) => {
    const [owner, setUser] = useState<User | null>(null);
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const ownerData = await getUser(message.message.user_id);
            if(ownerData) {
                setUser(ownerData);
            }
        } catch (error) {
            setUser(null);
        }
    };

    fetchUser();
    }, []);

    return (
        <div className="bg-gray-700 p-3 m-3 rounded-lg">
            <div className="flex items-center mb-2">
                <img src={owner?.profile_picture || './default-user-icon.webp'} alt="profile picture" className="w-10 h-10 rounded-full mr-2" />
                <div className="text-sm font-semibold">{owner?.displayName || "unKnown"}</div>
                <div className="text-xs text-gray-400">{message.message.create_at.toDate().toLocaleString() || ""}</div>
            </div>
            <p className="text-gray-300">{message.message.text}</p>
        </div>
    );
};

export default MessageTile;