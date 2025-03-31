/**
 * DMCell component displays a direct message chat reference in the sidebar.
 * 
 * This component:
 * - Fetches and displays information about the other user in the DM
 * - Shows online status with a colored indicator
 * - Highlights unread messages
 * - Shows the user's profile picture or a placeholder with first initial
 * - Marks the active chat with a different background color
 * - Handles selecting a DM chat to display its messages
 * 
 * @component
 * @param {Object} props - Component props
 * @param {DMChatRef} props.chatRef - The direct message chat reference object
 * 
 * @returns {React.ReactElement} A cell representing a direct message chat
 */

import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hook';
import { setCurrentDMChat, fetchDMMessagesAsync } from '../../../features/dm/dmSlice';
import { DMChatRef } from '../../../type/DM';
import { getUser } from '../../../features/users/userAPI';
import { User } from '../../../type/User';

interface DMCellProps {
    chatRef: DMChatRef;
}

    const DMCell: React.FC<DMCellProps> = ({chatRef}) => {
        const dispatch = useAppDispatch();
        const currentUserId = useAppSelector((state) => state.user.userId);
        const currentChatId = useAppSelector((state) => state.dm.currentDMChatId);
        const [otherUser, setOtherUser] = useState<User | null>(null);
        const isActive = currentChatId === chatRef.id;

        useEffect(() => {
            // Find the other user ID in the chat reference
            const otherUserId = chatRef.chat.participants.find(id => id !== currentUserId);

            // Fetch the user information for the other user
            if (otherUserId) {
                getUser(otherUserId).then((user) => {
                    setOtherUser(user || null);
                }).catch((error) => {
                    console.error("Error fetching user info:", error);
                });
            }
        }, [chatRef, currentUserId]);

        // Handle selecting a DM chat
        const handleSelectDM = () => {
            dispatch(setCurrentDMChat(chatRef));
            dispatch(fetchDMMessagesAsync(chatRef.id));
        }

        // Determine the online status class based on the other user's online status
        const onlineStatusClass = otherUser?.isOnline
            ? 'bg-green-500'
            : 'bg-gray-500';

        // Determine the unread messages class based on the chat reference
        const unreadClass = chatRef.hasUnread && !isActive
            ? 'font-bold'
            : 'font-normal';

        // Render the component
        // If the other user is not loaded yet, show a loading state
        if (!otherUser) {
            return <div className="px-4 py-2">Loading...</div>
        }

        // Render the DM cell with user information and online status
        return (
            <div
               className={`px-4 py-2 cursor-pointer flex items-center ${isActive ? 'bg-blue-700' : 'hover:bg-gray-700'}`} 
               onClick={handleSelectDM}
            >
                <div className="relative mr-2">
                    {otherUser.profile_picture ? (
                        <img
                            src={otherUser.profile_picture}
                            alt={otherUser.displayName}
                            className="w-6 h-6 rounded-full"
                        />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-sm">
                            {otherUser.displayName.charAt(0)}
                        </div>
                    )}
                <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${onlineStatusClass}`}>

                </div>
            </div>

            <span className={`text-gray-300 truncate ${unreadClass}`}>
                {otherUser.displayName}
            </span>
            
            {/* Show unread indicator if there are unread messages */}
            {chatRef.hasUnread && !isActive && (
                <div className="w-2 h-2 ml-auto bg-blue-500 rounder-full"></div>
            )}
        </div>
        )
    }

export default DMCell;