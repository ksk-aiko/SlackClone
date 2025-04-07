import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hook';
import { DMMessageRef } from '../../../type/DM';
import {TextareaAutosize } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { fetchDMMessagesAsync, sendMessageAsync} from '../../../features/dm/dmSlice';
import DMMessageTile from './DMMessageTile';

const DMMessageArea: React.FC = () => {
    const dispatch = useAppDispatch();
    const [message, setMessage] = useState('')
    const currentUserId = useAppSelector((state) => state.user.userId);
    const currentDMChatId = useAppSelector((state) => state.dm.currentDMChatId);
    const messages = useAppSelector((state) => state.dm.messages);

    useEffect(() => {
        if (currentDMChatId) {
            dispatch(fetchDMMessagesAsync(currentDMChatId));
        }
    }, [currentDMChatId, dispatch]);

    if (!currentDMChatId) {
        return (
            <div className="flex flex-1 items-center justify-center bg-gray-700 text-white">
                <p>Select DM conversation or start a new message</p>
            </div>
        );
    }

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
}