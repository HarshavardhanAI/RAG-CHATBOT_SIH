import React, { useState, useRef, useEffect } from 'react';

const ChatArea = () => {
  const [messages, setMessages] = useState([
    { text: 'Hello! How can I help you today?', sender: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    // Call backend API
    fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.response) {
          setMessages((msgs) => [
            ...msgs,
            { text: data.response, sender: 'bot' },
          ]);
        } else {
          setMessages((msgs) => [
            ...msgs,
            { text: data.error || 'Error: No response from server.', sender: 'bot' },
          ]);
        }
      })
      .catch((err) => {
        setMessages((msgs) => [
          ...msgs,
          { text: 'Error: ' + err.message, sender: 'bot' },
        ]);
      });
  };

  return (
  <div className="w-full flex-1 flex flex-col bg-gray-950">
      <div className="flex-1 overflow-y-auto px-2 sm:px-8 py-6 flex flex-col gap-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={
              `max-w-[70%] px-5 py-3 rounded-2xl text-base break-words ` +
              (msg.sender === 'user'
                ? 'self-end bg-cyan-500 text-white rounded-br-md'
                : 'self-start bg-gray-800 text-cyan-200 rounded-bl-md')
            }
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex border-t border-gray-800 p-4 bg-gray-950" onSubmit={handleSend}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 border border-gray-700 bg-gray-900 text-cyan-100 rounded-full text-base outline-none focus:ring-2 focus:ring-cyan-500"
        />
        <button type="submit" className="ml-4 px-6 py-2 bg-cyan-500 text-white rounded-full text-base hover:bg-cyan-400 transition-colors">Send</button>
      </form>
    </div>
  );
};

export default ChatArea;
