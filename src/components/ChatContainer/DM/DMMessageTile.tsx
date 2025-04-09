import React from 'react';
import { useAppSelector, useAppDispatch } from '../../../app/hook';
import { DMMessageRef} from '../../../type/DM';
import { Avatar } from '@mui/material'
import { formatMessageTime } from '../../../utils/formatters';

interface DMMessageTileProps {
    messageRef: DMMessageRef;
}

const DMMessageTile: React.FC<DMMessageTileProps> = ({ messageRef }) => {
    const currentUserId = useAppSelector((state) => state.user.userId);
    const users = useAppSelector((state) => state.user.users);
}