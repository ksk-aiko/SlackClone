import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppSelector } from '../../../app/hook';
import { fetchDMChatsAsync } from '../../../features/dm/dmSlice';
import { DMChatRef } from '../../../type/DM';
import { subscribeToDMChats } from '../../../features/dm/dmApi';
import DMCell from './DMCell';
import DMUserSearch from './DMUserSearch';