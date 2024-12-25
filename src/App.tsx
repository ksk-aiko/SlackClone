import React from 'react';
// import logo from './logo.svg';
import './App.css';
import SideBar from "./components/SideBar";
import ChatContainer from "./components/ChatContainer";

function App() {
  return (
    <div className="flex">
      <SideBar />
      <ChatContainer />
    </div>
  );
}

export default App;
