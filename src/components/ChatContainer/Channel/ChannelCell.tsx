/**
 * ChannelCell component renders a clickable channel name that dispatches an action to select the channel.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {Channel} props.channel - The channel object containing channel details.
 * @param {string} props.id - The unique identifier for the channel.
 * @returns {JSX.Element} The rendered ChannelCell component.
 *
 * @example
 * const channel = { id: '1', name: 'general' };
 * const id = '1';
 * return <ChannelCell channel={channel} id={id} />;
 */
import React from 'react';
import {useAppDispatch} from "../../../app/hook.ts";
import {selectChannel} from "../../../features/channel/channelSlice.ts";
import {Channel} from "../../../type/Channel.ts";
import {ChannelMenu} from "./ChannelMenu.tsx";

type Props = {
    channel: Channel
    id: string
    key: string
}

const ChannelCell = ({channel, id}: Props) => {
    const dispatch = useAppDispatch();
    const handleChannelName = () => {
        dispatch(selectChannel(id))
    }

    return (
        <div className="px-4 py-1 hover:bg-gray-700">
            <div
                className="text-gray-300 hover:text-white"
                onClick={handleChannelName} 
            >
                # {channel.name}
            </div>
            <ChannelMenu channelId={id} channelName={channel.name}/>
        </div>
    );
};

export default ChannelCell;
