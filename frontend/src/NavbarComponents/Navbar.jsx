import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white">
      <div className="text-2xl font-bold">Chatbot</div>
      <div className="flex gap-6 items-center">
        {/* Add menu items here */}
        <a href="#" className="hover:text-cyan-400 transition-colors">Home</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">About</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
        <button
          className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-400 transition-colors"
          onClick={() => {
            sessionStorage.removeItem('chat_messages');
            window.location.reload();
          }}
        >
          Clear Chats
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
