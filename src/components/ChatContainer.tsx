/**
 * ChatContainer component that manages the chat interface of the application.
 * 
 * This component implements a tabbed interface that switches between channel chats
 * and direct messages. It maintains state for the active tab and renders the
 * appropriate list and message area components based on the selected tab.
 * 
 * @component
 * @example
 * ```tsx
 * <ChatContainer />
 * ```
 * 
 * @returns A responsive chat container with tabs for channels and direct messages,
 * showing either channel-related components or direct message components depending on the active tab.
 */

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ChatList from "./ChatContainer/ChatList";
import MessageArea from "./ChatContainer/Message/MessageArea";
import DMList from "./ChatContainer/DM/DMList"
import DMMessageAria from "./ChatContainer/DM/DMMessageArea"

type ChatContainerProps = {
  type?: 'dm';
}

const ChatContainer: React.FC<ChatContainerProps> = ({type}) => {
  const location = useLocation();
  const [activeMode, setActiveMode] = useState<'channels' | 'directMessages'>(type === 'dm' || location.pathname === '/dm' ? 'directMessages' : 'channels')

  useEffect(() => {
    if (type === 'dm' || location.pathname === '/dm') {
      setActiveMode('directMessages');
    } else {
      setActiveMode('channels');
    }
  }, [location.pathname, type]);

  return (
    <div className="flex flex-col flex-grow h-screen">
      <div className="bg-gray-800 text-white flex border-b border-gray-700">
        <div className="py-2 px-4 font-medium">
          {activeMode === 'channels' ? 'Channels' : 'Direct Messages'}
        </div>
      </div>

      <div className="flex flex-grow">
        {activeMode === 'channels' ? (
          <>
            <ChatList />
            <MessageArea />
          </>
        ) : (
          <>
            <DMList />
            <DMMessageAria />
          </>
        )}
      </div>
    </div>
  );
}

export default ChatContainer;