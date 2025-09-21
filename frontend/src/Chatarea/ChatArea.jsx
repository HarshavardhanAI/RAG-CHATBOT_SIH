import React, { useState, useRef, useEffect } from 'react';


const ChatArea = () => {
  const defaultMessages = [
    { text: 'Hello! How can I help you today?', sender: 'bot' },
  ];
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chat_messages');
    return saved ? JSON.parse(saved) : defaultMessages;
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chat_messages', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => {
      const updated = [...prev, { text: input, sender: 'user' }];
      sessionStorage.setItem('chat_messages', JSON.stringify(updated));
      return updated;
    });
    setInput('');
    setLoading(true);
    fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: input }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages((msgs) => {
          let updated;
          if (data.response) {
            updated = [...msgs, { text: data.response, sender: 'bot' }];
          } else {
            updated = [...msgs, { text: data.error || 'Error: No response from server.', sender: 'bot' }];
          }
          sessionStorage.setItem('chat_messages', JSON.stringify(updated));
          return updated;
        });
      })
      .catch((err) => {
        setMessages((msgs) => {
          const updated = [...msgs, { text: 'Error: ' + err.message, sender: 'bot' }];
          sessionStorage.setItem('chat_messages', JSON.stringify(updated));
          return updated;
        });
      })
      .finally(() => setLoading(false));
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
        {loading && (
          <div className="self-start flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin inline-block"></span>
            <span className="text-cyan-400 text-sm">Generating response...</span>
          </div>
        )}
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
