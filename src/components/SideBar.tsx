import React from 'react';
import {Home, ChatBubble} from "@mui/icons-material";

const SideBar = () => {
  return (
    <div className="w-16 h-screen bg-gray-900 text-white">
      <div className="py-5 flex flex-col items-center">
        <div className="bg-gray-700 p-2 rounded-lg">
          <Home/>
        </div>
      </div>
      <div className="py-5 flex flex-col items-center">
        <div className="bg-gray-700 p-2 rounded-lg">
          <ChatBubble/>
        </div>
        <span className="text-xs">DM</span>
      </div>
      <div className="py-5 mt-auto mx-2 flex flex-col items-center">
        <div className="bg-gray-700 p-2 rounded-lg">
          <img src={"/default-user-icon.webp"} alt="" />
        </div>
      </div>
    </div>
  );
}

export default SideBar;