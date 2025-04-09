/**
 * DMMessageTile Component
 * 
 * Renders an individual direct message in a chat interface, displaying the sender's avatar,
 * name, message content, and timestamp.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {DMMessageRef} props.messageRef - Reference to the direct message data
 * 
 * @remarks
 * The component adjusts its layout based on whether the message was sent by the current user:
 * - Current user messages are right-aligned with blue bubbles
 * - Other users' messages are left-aligned with gray bubbles and include sender avatar and name
 * - All messages include a formatted timestamp
 * 
 * Uses Redux state to determine the current user and fetch user information.
 */

import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hook';
import { DMMessageRef} from '../../../type/DM';
import { Avatar } from '@mui/material'
import { formatMessageTime } from '../../../utils/formatters';

interface DMMessageTileProps {
    messageRef: DMMessageRef;
}

const DMMessageTile: React.FC<DMMessageTileProps> = ({ messageRef }) => {
    const currentUserId = useAppSelector((state) => state.user.userId);
    const users = useAppSelector((state) => state.user.users);

    const sender = users.find(user => user.uid === messageRef.message.user_id);
    const isCurrentUser = messageRef.message.user_id === currentUserId;

    const formatedTime = formatMessageTime(messageRef.message.created_at);

    return (
        <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex ${isCurrentUser ? 'flex-row-revers' : 'flex-row'} max-w-[80%]`}>
                {!isCurrentUser && (
                    <div className="mr-2">
                        <Avatar
                            src={sender?.user.profile_picture || ''}
                            alt={sender?.user.displayName || ''}
                            sx={{width: 36, height: 36}}
                        >
                            {sender?.user.displayName.charAt(0) || 'U'}
                        </Avatar>
                    </div>
                )}
                <div>
                    {!isCurrentUser && (
                        <div className="text-sm font-semibold mb-1">
                            {sender?.user.displayName || 'User'}
                        </div>
                    )}
                    <div className="flex items-end">
                        <div className={`rounded-lg px-4 py-2 max-w-full break-words ${
                            isCurrentUser
                                ? 'bg-blue-600 text-white rounded-tr-none'
                                : 'bg-gray-600 text-white rounded-tl-none'
                        }`}>
                            {messageRef.message.text}
                        </div>
                        <div className={`text-xs text-gray-400 mx-2 mb-1`}>
                            {formatedTime}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DMMessageTile;