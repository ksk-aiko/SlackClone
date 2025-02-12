// TODO: fix textarea styling
/**
 * MessageArea component is responsible for rendering the chat interface.
 * It allows users to type and send messages, and displays the list of messages in the current channel.
 *
 * @component
 * @example
 * return (
 *   <MessageArea />
 * )
 *
 * @returns {JSX.Element} The rendered MessageArea component.
 *
 * @remarks
 * This component uses the following hooks:
 * - `useState` to manage the state of the message being typed and the list of message references.
 * - `useEffect` to subscribe to messages in the current channel.
 * - `useAppSelector` to access the user ID and current channel ID from the Redux store.
 *
 * The component also includes the following functions:
 * - `handleInputChange` to update the message state when the user types in the textarea.
 * - `sendMessage` to send a message when the user clicks the send button or presses the Enter key.
 * - `handleKeyDown` to detect when the user presses the Enter key and send the message.
 *
 * The component renders a list of `MessageTile` components for each message reference and a textarea for typing messages.
 */
import React, {ChangeEvent, KeyboardEvent, useEffect, useState} from 'react';
import { TextareaAutosize } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import {MessageRef} from "../../../type/Message.ts";
import {useAppSelector} from "../../../app/hook.ts";
import {createMessage, subscribeMessages, postMessage} from "../../../features/message/messageAPI.ts";
import MessageTile from "./MessageTile.tsx";

const MessageArea = () => {
  // State to hold the list of message references
  const [messageRefs, setMessageRefs] = useState<MessageRef[]>([]);
  const userId = useAppSelector((state) => state.user.userId);
  const channelId :string = useAppSelector(state => state.channel.currentChannelId);

  // State to hold the message being typed
  const [message, setMessage] = useState('');
  const handleInputChange = (e:ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  // Function to send a message
  const sendMessage = async () => {
    if(userId) {
      try {
        await postMessage(createMessage(userId, channelId, message));
        console.log('Message sent:', message);
        setMessage("");
      } catch (e) {
        console.error('Error sending message: ', e);
      }
    }
  }

  // Function to send a message when the user presses the Enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if((e.metaKey || e.ctrlKey) && e.code === "Enter") {
      sendMessage();
    }
  }

  // Subscribe to messages in the current channel
  useEffect(() => {
    const unsubscribe = subscribeMessages(channelId, (messageRefs) => {
      console.log('Messages received:', messageRefs);
      setMessageRefs(messageRefs);
    });
    return () => unsubscribe();
  }, [channelId]);

  // Render the message area
  return (
    <div className="flex flex-1 flex-col bg-gray-500 text-white">
      <div className="p-4 m-3 overflow-auto">
        {messageRefs.map((messageRef) => (
          <MessageTile message={messageRef.message} key={messageRef.id}/>
        ))}
      </div>

      <div className="mt-auto px-4 py-2 bottom-0 bg-gray-900">
        <div className="flex items-center">
          <TextareaAutosize
            placeholder="Type a message" 
            className="flex-1 bg-gray-700 text-white p-2 mx-2 rounded-lg focus:outline-none"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={message}
          />
          <button 
            className="text-gray-400 hover:text-white"
            onClick={sendMessage}
          >
            <SendIcon />
          </button> 
        </div>
      </div>
    </div>
  );
}

export default MessageArea;