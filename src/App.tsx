import React from 'react';
// import logo from './logo.svg';
import './App.css';
import SideBar from "./components/SideBar.tsx";
import ChatContainer from "./components/ChatContainer.tsx";
import Login from './components/Login.tsx';

function App() {
  return (
    <div className="flex">
      <Login />
      {/* <SideBar />
      <ChatContainer /> */}
    </div>
  );
}

export default App;
