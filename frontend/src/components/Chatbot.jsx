import React, { useState, useRef, useEffect } from "react";
import "./Chatbot.css";

import UserIcon from "../assets/User.png";
import SendIcon from "../assets/send-gradient.svg";
import BotIcon from "../assets/bot-gradient.png";


const quickReplies = [
  "Reset my password",
  "I have a billing question",
  "Report an issue",
  "Connect me to an agent"
];

export default function Chatbot() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Welcome! How can I assist you today?" },
    { sender: "user", text: "I need help with my account." },
    { sender: "bot", text: "Of course! Can you tell me a bit more?" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = msg => {
    const text = msg || query;
    if (!text.trim()) return;
    setMessages([...messages, { sender: "user", text }]);
    setQuery("");
    setLoading(true);
    setTimeout(() => {
      setMessages(m => [
        ...m,
        { sender: "bot", text: "🟦 Thank you! Our support team will respond soon." }
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="cs-bg">
      <header className="cs-header">
        {/* Header icon/logo */}
        <img src={BotIcon} alt="Support Bot" className="cs-header-emoji" />
        <span className="cs-header-title">Customer Support Bot</span>
      </header>
      <main className="cs-main">
        <div className="cs-chat-history">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`cs-bubble ${msg.sender}`}
            >
              {/* Avatar icons */}
              {msg.sender === "bot" && (
                <img src={BotIcon} alt="Bot" className="cs-bubble-avatar" />
              )}
              {msg.sender === "user" && (
                <img src={UserIcon} alt="You" className="cs-bubble-avatar user" />
              )}
              <span>{msg.text}</span>
            </div>
          ))}
          {loading && (
            <div className="cs-bubble bot">
              <img src={BotIcon} alt="Bot" className="cs-bubble-avatar" />
              Typing…
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="cs-quick-replies">
          {quickReplies.map((txt, i) => (
            <button
              key={i}
              className="cs-chip"
              onClick={() => send(txt)}
            >
              {txt}
            </button>
          ))}
        </div>
      </main>
      <footer className="cs-input-row">
        <input
          type="text"
          placeholder="Type your question..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
        />
        <button
          className="cs-send-btn"
          onClick={() => send()}
          disabled={!query.trim() || loading}
        >
          <img src={SendIcon} alt="Send" style={{ width: 24, height: 24 }} />
        </button>
      </footer>
    </div>
  );
}
