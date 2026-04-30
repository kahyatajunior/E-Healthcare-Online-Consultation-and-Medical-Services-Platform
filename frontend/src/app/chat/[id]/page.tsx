"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import type { Chat, ChatMessage } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { io, Socket } from "socket.io-client";
import { FiSend, FiPaperclip } from "react-icons/fi";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token, loading: authLoading } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!user || !token || !params.id) return;

    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/appointment/${params.id}`);
        setChat(res.data.chat);
        setMessages(res.data.chat.messages || []);

        await api.put(`/chats/${res.data.chat._id}/read`);
      } catch (error) {
        console.error("Failed to fetch chat:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChat();
  }, [user, token, authLoading, params.id, router]);

  useEffect(() => {
    if (!chat || !token) return;

    const socket = io(SOCKET_URL, {
      auth: { token },
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("joinChat", chat._id);
    });

    socket.on("newMessage", (data: { chatId: string; message: ChatMessage }) => {
      if (data.chatId === chat._id) {
        setMessages((prev) => [...prev, data.message]);
      }
    });

    socket.on(
      "userTyping",
      (data: { chatId: string; userName: string }) => {
        if (data.chatId === chat._id) {
          setTyping(data.userName);
        }
      }
    );

    socket.on("userStopTyping", (data: { chatId: string }) => {
      if (data.chatId === chat._id) {
        setTyping(null);
      }
    });

    return () => {
      socket.emit("leaveChat", chat._id);
      socket.disconnect();
    };
  }, [chat, token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chat || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      chatId: chat._id,
      content: newMessage.trim(),
      messageType: "text",
    });

    socketRef.current.emit("stopTyping", { chatId: chat._id });
    setNewMessage("");
  };

  const handleTyping = () => {
    if (!chat || !socketRef.current) return;
    socketRef.current.emit("typing", { chatId: chat._id });

    setTimeout(() => {
      socketRef.current?.emit("stopTyping", { chatId: chat._id });
    }, 2000);
  };

  if (authLoading || loading) return <LoadingSpinner size="lg" />;
  if (!user || !chat) return null;

  const otherUser = chat.participants.find(
    (p) => (p._id || p.id) !== user.id
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-8rem)]">
        <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {otherUser?.name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">
              {otherUser?.name || "Unknown"}
            </h2>
            {typing && (
              <p className="text-xs text-green-600">{typing} is typing...</p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const senderId = msg.sender?._id || msg.sender?.id || (typeof msg.sender === "string" ? msg.sender : "");
              const isMe = senderId === user.id;

              return (
                <div
                  key={msg._id || idx}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isMe
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    {msg.messageType === "file" || msg.messageType === "image" ? (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center space-x-2 underline ${
                          isMe ? "text-blue-100" : "text-blue-600"
                        }`}
                      >
                        <FiPaperclip className="w-4 h-4" />
                        <span>{msg.fileName || "Attachment"}</span>
                      </a>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}
                    <p
                      className={`text-xs mt-1 ${
                        isMe ? "text-blue-200" : "text-gray-400"
                      }`}
                    >
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={sendMessage}
          className="p-4 border-t border-gray-200 flex items-center space-x-3"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
