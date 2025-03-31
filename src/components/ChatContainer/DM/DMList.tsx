/**
 * DMList Component
 * 
 * This component renders a list of direct message conversations for the current user.
 * It manages fetching and displaying direct message chats, subscribing to real-time updates,
 * and provides functionality to start new conversations.
 * 
 * Features:
 * - Fetches direct message chats when the component mounts
 * - Subscribes to real-time updates of the user's DM chats
 * - Displays a list of existing DM conversations using DMCell components
 * - Provides a button to initiate new direct message conversations
 * - Manages the visibility of the user search modal for starting new conversations
 * 
 * @returns A sidebar component displaying direct message conversations
 */

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppSelector, useAppDispatch } from "../../../app/hook";
import { fetchDMChatsAsync } from "../../../features/dm/dmSlice";
import { DMChatRef } from "../../../type/DM";
import { subscribeToDMChats } from "../../../features/dm/dmApi";
import DMCell from "./DMCell";
import DMUserSearch from "./DMUserSearch";

const DMList: React.FC = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userId);
  const dmChats = useAppSelector((state) => state.dm.dmChats);
  const [showUserSearch, setShowUserSearch] = useState(false);

  useEffect(() => {
    if (userId) {
      // Fetch DM chats when the component mounts
      dispatch(fetchDMChatsAsync(userId));

      // Subscribe to real-time updates for DM chats
      const unsubscribe = subscribeToDMChats(userId, (chats) => {
        dispatch({ type: "dm/updateDMChats", payload: chats });
      });

      return () => unsubscribe();
    }
  }, [userId, dispatch]);

  // Function to handle the new message button click
  const handleNewChat = () => {
    setShowUserSearch(true);
  };

  // Function to close the user search modal
  const handleCloseUserSearch = () => {
    setShowUserSearch(false);
  };

  return (
    <div className="w-64 bg-gray-800">
      <div className="px-4 py-3 mb-4 border-b border-gray-700">
        <span className="font-bold text-gray-300">Direct Message</span>
      </div>

      <div className="overflow-y-auto">
        {dmChats.map((chatRef) => (
          <DMCell key={chatRef.id} chatRef={chatRef} />
        ))}
      </div>

      <div className="px-4 py-2">
        <button
          className="text-gray-300 hover:text-white"
          onClick={handleNewChat}
        >
          + New message
        </button>

        {showUserSearch && <DMUserSearch onClose={handleCloseUserSearch} />}
      </div>
    </div>
  );
};

export default DMList;
