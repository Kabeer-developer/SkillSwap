import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  fetchMessages,
  clearChat,
} from "../features/chat/chatSlice";
import useSocket from "../hooks/useSocket";

function ChatPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  const { messages } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);

  const [text, setText] = useState("");

  // Load old messages
  useEffect(() => {
    dispatch(fetchMessages(id));

    return () => {
      dispatch(clearChat());
    };
  }, [dispatch, id]);

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const { sendMessage } = useSocket(id, (message) => {
    dispatch(addMessage(message));
  });

  const handleSend = () => {
    if (!text.trim()) return;

    const messageData = {
      barterId: id,
      senderId: user._id,
      text,
    };

    sendMessage(messageData);
    dispatch(addMessage(messageData));
    setText("");
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Chat</h2>

      <div className="border h-80 overflow-y-scroll p-3 mb-3">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <strong>
              {msg.senderId === user._id ? "Me" : "Other"}:
            </strong>{" "}
            {msg.text}
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatPage;