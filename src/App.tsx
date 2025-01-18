/**
 * The main App component of the SlackClone application.
 * 
 * This component uses the `useAuthState` hook to manage authentication state
 * and the `useAppSelector` hook to access the user ID from the Redux store.
 * 
 * Depending on whether the user is authenticated (i.e., `userId` is present),
 * it conditionally renders either the `SideBar` and `ChatContainer` components
 * for authenticated users or the `Login` component for unauthenticated users.
 * 
 * @component
 * @returns {JSX.Element} The rendered App component.
 */
import React from 'react';
import './App.css';
import SideBar from "./components/SideBar.tsx";
import ChatContainer from "./components/ChatContainer.tsx";
import Login from './components/Login.tsx';
import { useAppSelector } from './app/hook.ts';
import useAuthState from "./features/auth/useAuthState.tsx";

function App() {
  // Get the user authentication state
  useAuthState();

  // Get the user ID from the Redux store
  const userId = useAppSelector((state) => state.user.userId);

  return (
    <div className="flex">
      {userId ? (
        <>
        <SideBar />
        <ChatContainer />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
