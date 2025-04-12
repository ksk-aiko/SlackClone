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

import React, { useState } from 'react';
import ChatList from "./ChatContainer/ChatList";
import MessageArea from "./ChatContainer/Message/MessageArea";
import DMList from "./ChatContainer/DM/DMList"
import DMMessageAria from "./ChatContainer/DM/DMMessageArea"

const ChatContainer = () => {
  const [activeTab, setActiveTab] = useState<'channels' | 'directMessages'>('channels');

  return (
    <div className="flex flex-col flex-grow h-screen">
      <div className="bg-gray-800 text-white flex border-b border-gray-700">
        <button
          className={`py-2 px-4 ${activeTab === 'channels' ? 'bg-gray-700' : ''}`}
          onClick={() => setActiveTab('channels')}
        >
          Channels
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'directMessages' ? 'bg-gray-700' : ''}`}
          onClick={() => setActiveTab('directMessages')}
        >
          Direct Messages
        </button>
      </div>

      <div className="flex flex-grow">
        {activeTab === 'channels' ? (
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