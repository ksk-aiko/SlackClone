/**
 * ChatList component that displays a list of chat channels.
 * 
 * This component subscribes to channel updates using the `subscribeChannels` function
 * and updates the state with the list of channels. It renders a list of `ChannelCell`
 * components for each channel and includes a button to add a new channel.
 * 
 * @component
 * @example
 * return (
 *   <ChatList />
 * )
 * 
 * @returns {JSX.Element} The rendered ChatList component.
 */
import React, { useEffect, useState } from "react";
import { subscribeChannels } from '../../features/channel/channelAPI.ts';
import { ChannelRef } from '../../type/Channel.ts';
import ChannelCell from './Channel/ChannelCell.tsx';
import ChannelAddModal from "./Channel/ChannelAddModal.tsx";
import { WorkplaceManagement } from '../../features/workplace/components/WorkplaceManagement.tsx';

const ChatList = () => {
  // State to store the list of channel references
  const [channelRefs, setChannelRefs] = useState<ChannelRef[]>([]);
  // State to control the visibility of the modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // Subscribe to channel updates when the component mounts
  useEffect(() => {
    const unsubscribe = subscribeChannels((channelRefs) => {
      setChannelRefs(channelRefs);
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  return (
    <div className="w-64 bg-gray-800">
      <div className="px-4 py-3 mb-4 border-b border-gray-700">
        <span className="font-bold text-gray-300">チャンネル</span>
      </div>
      <div className="overflow-y-auto">
        {channelRefs.map(({ channel, id}) => (
          <ChannelCell channel={channel} id={id} key={id}/>
        ))}
      </div>
      <div className="px-4 py-2">
        <button
          className="text-gray-300 hover:text-white"
          onClick={handleOpenModal}
          >
          + チャンネルを追加する
        </button>
        {showModal && <ChannelAddModal handleCloseModal={handleCloseModal}/>}
      </div>
      <div className="px-4 py-2">
        <WorkplaceManagement />
      </div>
    </div>
  );
}

export default ChatList;