import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 text-white">
      <div className="text-2xl font-bold">Chatbot</div>
      <div className="flex gap-6">
        {/* Add menu items here */}
        <a href="#" className="hover:text-cyan-400 transition-colors">Home</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">About</a>
        <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
      </div>
    </nav>
  );
};

export default Navbar;
