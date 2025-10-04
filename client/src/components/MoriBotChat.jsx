import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function MoriBotChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const initialBotGreeting = "Hello! 👋 I'm MoriBot. How can I help you today?";

  const avatar =
    "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://media.easy-peasy.ai/00a02138-536a-49e0-95fa-6a58e899c001/9ae25be5-c975-4dd2-bc12-b17becd4cd54.png";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (showChat && messages.length === 0 && !isTyping) {
      simulateTyping(initialBotGreeting);
    }
  }, [showChat, messages.length, isTyping]);

  const simulateTyping = async (text) => {
    setIsTyping(true);
    const newMessageId = Date.now();
    const newMessage = {
      type: "bot",
      text: "",
      timestamp: new Date(),
      id: newMessageId,
    };
    setMessages((prev) => [...prev, newMessage]);

    let currentText = "";
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessageId ? { ...msg, text: currentText } : msg
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    setIsTyping(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      text: question,
      timestamp: new Date(),
      id: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5555/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();
      await simulateTyping(
        data.answer || "🤖 Sorry, I couldn't process your request."
      );
    } catch (err) {
      await simulateTyping("❌ I'm currently offline. Please try again later.");
    }

    setLoading(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setMessages([]);
    setQuestion("");
    setLoading(false);
    setIsTyping(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!showChat ? (
        <div className="relative group flex items-center">
          <button
            onClick={() => setShowChat(true)}
            className="relative z-10 w-16 h-16 bg-white rounded-full overflow-hidden shadow-lg transition duration-300 hover:scale-105 border border-gray-300"
          >
            <img
              src={avatar}
              alt="Open MoriBot Chat"
              className="w-full h-full object-cover"
            />
          </button>

          <div className="absolute right-[calc(100%+1rem)] bottom-1/2 translate-y-1/2 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 pointer-events-none group-hover:pointer-events-auto bg-white border border-gray-300 shadow-xl rounded-xl px-4 py-3 text-gray-800 w-64 transition-all duration-300 z-50">
            <div className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[10px] border-t-transparent border-b-transparent border-l-white"></div>
            <div className="absolute right-0 top-1/2 translate-x-[calc(100%+1px)] -translate-y-1/2 w-0 h-0 border-t-[10px] border-b-[10px] border-l-[10px] border-t-transparent border-b-transparent border-l-gray-300"></div>
            <p className="text-sm">{initialBotGreeting}</p>
          </div>
        </div>
      ) : (
        <div className="w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-teal-800 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={avatar}
                  alt="MoriBot"
                  className="w-8 h-8 rounded-full animate-pulse ring ring-teal-400 ring-offset-2"
                />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="text-sm">MoriBot is online</div>
            </div>
            <button onClick={handleCloseChat} className="hover:text-red-200">
              ✖
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                    msg.type === "user"
                      ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  {msg.type === "bot" && (
                    <img
                      src={avatar}
                      alt="MoriBot"
                      className="w-4 h-4 rounded-full mb-1 ring ring-teal-400 ring-offset-2"
                    />
                  )}
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <p className="text-xs text-right mt-1 opacity-50">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
                  <img
                    src={avatar}
                    alt="MoriBot"
                    className="w-4 h-4 rounded-full animate-pulse ring ring-teal-400 ring-offset-2"
                  />
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 bg-white border-t flex flex-col gap-2"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:ring-teal-500 focus:border-teal-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-full font-medium disabled:opacity-50"
              >
                {loading ? "..." : "Send"}
              </button>
            </div>
            <Link to="/contact">
              <button
                type="button"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
              >
                Reach to Our Support Agent
              </button>
            </Link>
          </form>
        </div>
      )}
    </div>
  );
}
