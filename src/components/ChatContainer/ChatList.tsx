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
import ChannelCell from './ChannelCell.tsx';

const ChatList = () => {
  // State to store the list of channel references
  const [channelRefs, setChannelRefs] = useState<ChannelRef[]>([]);

  // Subscribe to channel updates when the component mounts
  useEffect(() => {
    const unsubscribe = subscribeChannels((channelRefs) => {
      setChannelRefs(channelRefs);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="w-64 bg-gray-800">
      <div className="px-4 py-3 mb-4 border-b border-gray-700">
        <span className="font-bold text-gray-300">チャンネル</span>
      </div>
      <div className="overflow-y-auto">
        {channelRefs.map(({ channel, id}) => (
          <ChannelCell channel={channel} id={id} />
        ))}
      </div>
      <div className="px-4 py-2">
        <button className="text-gray-300 hover:text-white">
          + チャンネルを追加する
        </button>
      </div>
    </div>
  );
}

export default ChatList;