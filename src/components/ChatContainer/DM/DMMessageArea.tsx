/**
 * DMMessageArea component for displaying direct message conversations
 * 
 * This component handles the display of direct message conversations between users.
 * It shows the message history and provides an input area for sending new messages.
 * 
 * Features:
 * - Loads message history when a conversation is selected
 * - Displays a placeholder when no conversation is selected
 * - Shows a message when the conversation has no messages yet
 * - Allows sending messages with a button or keyboard shortcut (Ctrl/Cmd + Enter)
 * - Automatically scrolls to show the latest messages
 * 
 */

import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hook';
import { DMMessageRef } from '../../../type/DM';
import {TextareaAutosize } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { fetchDMMessagesAsync, sendMessageAsync, setDMMessages} from '../../../features/dm/dmSlice';
import DMMessageTile from './DMMessageTile';
import { subscribeToDMMessages } from '../../../features/dm/dmApi'

const DMMessageArea: React.FC = () => {
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState('')
    const currentUserId = useAppSelector((state) => state.user.userId);
    const currentDMChatId = useAppSelector((state) => state.dm.currentDMChatId);
    const messages = useAppSelector((state) => state.dm.messages);

    // Fetch messages when the current DM chat ID changes
    // This effect runs when the component mounts and whenever the currentDMChatId changes
    useEffect(() => {
        if (currentDMChatId) {
            dispatch(fetchDMMessagesAsync(currentDMChatId));

            const unsubscribe = subscribeToDMMessages(currentDMChatId, (messages) => {
                dispatch(setDMMessages(messages));
            });

            return () => unsubscribe();
        }
    }, [currentDMChatId, dispatch]);


    if (!currentDMChatId) {
        return (
            <div className="flex flex-1 items-center justify-center bg-gray-700 text-white">
                <p>Select DM conversation or start a new message</p>
            </div>
        );
    }

    // Handle sending messages
    // This function is called when the user clicks the send button or presses Ctrl/Cmd + Enter
    const handleSendMessage = async () => {
        if (!message.trim() || !currentUserId || !currentDMChatId) return;
        
        const receiverId = currentDMChatId.split('_').find(id => id !== currentUserId);
        if (!receiverId) return;

        try {
            await dispatch(
                sendMessageAsync({
                    dmChatId: currentDMChatId,
                    senderId: currentUserId,
                    receiverId,
                    text: message,
                })
            );
            setMessage('');
        } catch (error) {
            console.error('Faited to send message:', error);
    }
};

 const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSendMessage();
    }
 }

    return (
        <div className="flex flex-1 flex-col bg-gray-700 text-white">
            {/* // Area for displaying messages */}
            <div className="p-4 flex-1 overflow-auto">
                {messages.length === 0 ? (
                    <div className="text-center py-6 text-gray-400">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((messageRef: DMMessageRef) => (
                        <DMMessageTile 
                            key={messageRef.id}
                            messageRef={messageRef}
                        />  
                    ))
                )}
            </div>

            {/* // Area for sending messages */}
            <div className="p-4 border-t border-gray-600">
                <div className="flex items-center">
                    <TextareaAutosize 
                        placeholder="Type a message..."
                        className="flex-1 bg-gray-600 text-white p-2 rounded resize-none"
                        minRows={1}
                        maxRows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <button
                        className="ml-2 p-2 bg-blue-500 rounded hover:bg-blue-600 disabled:opacity-50"
                        onClick={handleSendMessage}
                        disabled={!message.trim()}
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DMMessageArea;