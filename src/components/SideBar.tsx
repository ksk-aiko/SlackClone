/**
 * SideBar component renders a sidebar with navigation icons and user information.
 * 
 * This component fetches the user data based on the userId from the Redux store
 * and displays the user's profile picture and display name. It also includes
 * navigation icons for Home and Direct Messages (DM).
 * 
 * @component
 * 
 * @returns {JSX.Element} The rendered sidebar component.
 * 
 * @example
 * // Usage example
 * import SideBar from './components/SideBar';
 * 
 * function App() {
 *   return (
 *     <div className="App">
 *       <SideBar />
 *     </div>
 *   );
 * }
 * 
 * export default App;
 */
import React, { useEffect, useState} from 'react';
import {Home, ChatBubble} from "@mui/icons-material";
import { useAppSelector} from '../app/hook';
import { getUser } from '../features/users/userAPI';
import { User } from '../type/User';
import {signOut} from "../features/auth/Auth"
import { useNavigate, useLocation } from 'react-router-dom';

const SideBar = () => {

  // Fetch the userId from the Redux store
  const userId = useAppSelector((state) => state.user.userId);

  const navigate = useNavigate();
  const location = useLocation();

  // Initialize the user state
  const [user, setUser] = useState<User | null>();

  // Fetch the user data based on the userId
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

  const isHomePage = location.pathname === '/';
  const isDMPage = location.pathname === '/dm';

  return (
    <div className="w-16 h-screen bg-gray-900 text-white">
      <div className="py-5 flex flex-col items-center">
        <div className={`bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-Gray-600 ${isHomePage ? 'ring-2 ring-blue-500' : ''}`} 
        onClick={() => navigate('/')}>
          <Home/>
        </div>
      </div>
      <div className="py-5 flex flex-col items-center">
        <div className={`bg-gray-700 p-2 rounded-lg cursor-pointer hover:bg-Gray-600 ${isDMPage ? 'ring-2 ring-blue-500' : ''}`}
        onClick={() => navigate('/dm')}>
          <ChatBubble/>
        </div>
        <span className="text-xs">DM</span>
      </div>
      <div className="py-5 mt-auto mx-2 flex flex-col items-center">
        <div className="bg-gray-700 p-2 rounded-lg">
          <img src={user?.profile_picture || "/default-user-icon.webp"} alt="" onClick={() => signOut()}/>
        </div>
        <span className="text-xs">{user?.displayName}</span>
      </div>
    </div>
  );
}

export default SideBar;