import React from 'react'
import Navbar from './NavbarComponents/Navbar';


const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <div className="flex-1 flex flex-col">
        <ChatArea />
      </div>
    </div>
  )
}

export default App
import ChatArea from './Chatarea/ChatArea';
