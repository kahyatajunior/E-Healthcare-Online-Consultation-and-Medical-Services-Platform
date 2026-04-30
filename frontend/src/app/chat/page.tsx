"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import type { Chat } from "@/lib/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { FiMessageSquare } from "react-icons/fi";

export default function ChatListPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!user) return;

    const fetchChats = async () => {
      try {
        const res = await api.get("/chats");
        setChats(res.data.chats);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [user, authLoading, router]);

  if (authLoading) return <LoadingSpinner size="lg" />;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Messages</h1>

      {loading ? (
        <LoadingSpinner size="lg" />
      ) : chats.length === 0 ? (
        <div className="text-center py-16">
          <FiMessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No conversations yet.</p>
          <p className="text-gray-400 text-sm mt-1">
            Chats are created when appointments are booked.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const otherUser = chat.participants.find(
              (p) => (p._id || p.id) !== user.id
            );
            const lastMessage =
              chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1]
                : null;
            const unreadCount = chat.messages.filter(
              (m) =>
                !m.isRead &&
                (m.sender?._id || m.sender?.id) !== user.id &&
                m.sender?.toString?.() !== user.id
            ).length;

            return (
              <Link
                key={chat._id}
                href={`/chat/${chat.appointment?._id || chat.appointment}`}
                className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                  {otherUser?.name?.charAt(0) || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 truncate">
                      {otherUser?.name || "Unknown"}
                    </h3>
                    {lastMessage && (
                      <span className="text-xs text-gray-400">
                        {new Date(lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {lastMessage?.content || "No messages yet"}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {unreadCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
