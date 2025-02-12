import React from 'react';
import ChatList from "./ChatContainer/ChatList.tsx";
import MessageArea from "./ChatContainer/Message/MessageArea.tsx";

const ChatContainer = () => {
  return (
    <div className="flex flex-grow h-screen">
      <ChatList />
      <MessageArea />
    </div>
  );
}

export default ChatContainer;