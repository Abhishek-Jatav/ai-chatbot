"use client";

import ChatLayout from "../components/ChatLayout";
import { useChat } from "../../hooks/useChat";

export default function ChatPage() {
  const chat = useChat();

  return <ChatLayout chat={chat} />;
}
