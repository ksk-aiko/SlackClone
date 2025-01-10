import React from 'react';
// import logo from './logo.svg';
import './App.css';
import SideBar from "./components/SideBar.tsx";
import ChatContainer from "./components/ChatContainer.tsx";
import Login from './components/Login.tsx';
import { useAppSelector } from './app/hook.ts';

function App() {
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
