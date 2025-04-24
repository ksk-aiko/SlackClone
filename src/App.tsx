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
import SideBar from "./components/SideBar";
import ChatContainer from "./components/ChatContainer";
import Login from './components/Login';
import { useAppSelector } from './app/hook';
import useAuthState from "./features/auth/useAuthState";
import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  // Get the user authentication state
  useAuthState();

  // Get the user ID from the Redux store
  const userId = useAppSelector((state) => state.user.userId);

  if (!userId) {
    return <Login />;
  }

  return (
    <div className="flex">
      <SideBar />
      <Routes>
        <Route path="/" element={<ChatContainer />} />
        <Route path="/dm" element={<ChatContainer type="dm" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App;
