import React, { useEffect, useState} from 'react';
import {Home, ChatBubble} from "@mui/icons-material";
import { useAppSelector} from '../app/hook.ts';
import { getUser } from '../features/users/userAPI.ts';
import { User } from '../type/User.ts';

const SideBar = () => {
  const userId = useAppSelector((state) => state.user.userId);
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        const userRef = await getUser(userId);
        if (userRef) {
          setUser(userRef);
        }
      }
    };

    fetchUser();
  }, [userId]);

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
        <span className="text-xs">{user?.displayName}</span>
      </div>
    </div>
  );
}

export default SideBar;