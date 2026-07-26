"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import EmptyState from "./EmptyState";

interface Props {
  chat: any;
}

export default function ChatLayout({ chat }: Props) {
  const {
    messages,
    loading,
    streaming,
    streamMode,
    sidebarOpen,
    refreshKey,
    theme,
    error,
    bottomRef,

    setSidebarOpen,
    setStreamMode,
    setError,

    send,
    deleteMessage,
    selectConversation,
    toggleTheme,
  } = chat;

  useEffect(() => {
    if (error) {
      toast.error(error);

      setError("");
    }
  }, [error, setError]);

  const empty = messages.length === 0;

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        openSidebar={() => setSidebarOpen(true)}
      />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        refreshKey={refreshKey}
        onSelect={selectConversation}
      />

      <main className="mx-auto flex h-[calc(100vh-64px)] max-w-6xl flex-col px-3 sm:px-6">
        <AnimatePresence mode="wait">
          {empty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex items-center justify-center">
              <EmptyState onSelect={send} />
            </motion.div>
          ) : (
            <motion.section
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 overflow-y-auto py-6">
              <div className="mx-auto w-full max-w-4xl space-y-8">
                {messages.map((message: any) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    onDelete={deleteMessage}
                  />
                ))}

                <div ref={bottomRef} />
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        <div className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-[#020617] via-[#020617] to-transparent">
          <div className="mx-auto max-w-4xl">
            <div className="mb-3 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-sm text-slate-400">Streaming Response</span>

              <button
                onClick={() => {
                  setStreamMode(!streamMode);

                  toast.success(
                    !streamMode ? "Streaming enabled" : "Streaming disabled",
                  );
                }}
                className={`relative h-7 w-14 rounded-full transition ${
                  streamMode ? "bg-cyan-500" : "bg-slate-600"
                }`}>
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    streamMode ? "left-8" : "left-1"
                  }`}
                />
              </button>
            </div>

            <ChatInput
              disabled={loading || streaming}
              streaming={streaming}
              onSend={send}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
