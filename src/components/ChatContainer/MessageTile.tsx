import React, {useEffect, useState} from 'react';
import {User} from "../../type/User.ts";
import {Message} from "../../type/Message.ts";
import {getUser} from "../../features/users/userAPI.ts"

interface MessageTileProps {
    message: Message;
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
        </div>
    );
};

export default MessageTile;