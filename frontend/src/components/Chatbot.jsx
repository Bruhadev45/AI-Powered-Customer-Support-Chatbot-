import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

// Optional: Replace with your own avatar images in src/assets, or use these links.
const AI_AVATAR = "/assets/ai-avatar.png";
const USER_AVATAR = "/assets/user-avatar.png";

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { user: "", bot: "Hi! I'm your AI Assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  const handleQuery = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const userMsg = query;
    setChatHistory([...chatHistory, { user: userMsg }]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/chat', { query: userMsg });
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { user: userMsg, bot: res.data.response }
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev.slice(0, -1),
        { user: userMsg, bot: "Sorry, something went wrong. Please try again." }
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xl bg-white/80 rounded-3xl shadow-2xl p-6 flex flex-col min-h-[70vh]">
      <h1 className="text-3xl font-extrabold text-blue-800 text-center mb-4">AI Customer Support Chatbot</h1>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-1">
        {chatHistory.map((chat, idx) => (
          <div key={idx}>
            {chat.user && (
              <div className="flex items-end justify-end gap-2 mb-2">
                <div className="bg-blue-500 text-white rounded-2xl px-4 py-2 max-w-[70%]">{chat.user}</div>
                <img src={USER_AVATAR} alt="User" className="h-8 w-8 rounded-full shadow" />
              </div>
            )}
            {chat.bot && (
              <div className="flex items-end gap-2 mb-2">
                <img src={AI_AVATAR} alt="AI" className="h-8 w-8 rounded-full shadow" />
                <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 max-w-[70%] shadow">{chat.bot}</div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-end gap-2 mb-2 animate-pulse">
            <img src={AI_AVATAR} alt="AI" className="h-8 w-8 rounded-full shadow" />
            <div className="bg-gray-100 text-gray-800 rounded-2xl px-4 py-2 max-w-[70%]">Typing...</div>
          </div>
        )}
        <div ref={chatRef} />
      </div>
      <form onSubmit={handleQuery} className="flex items-center gap-2">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="flex-1 rounded-2xl border border-blue-200 px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 transition"
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          type="submit"
          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl shadow font-bold hover:scale-105 transition-transform disabled:opacity-50"
          disabled={loading || !query.trim()}
        >
          Send
        </button>
      </form>
      <div className="mt-4 text-xs text-gray-400 text-center">
        Powered by LangChain & HuggingFace | UI inspired by ChatGPT, Grok, Bard
      </div>
    </div>
  );
};

export default Chatbot;
