"use client";

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

  const empty = messages.length === 0;

  return (
    <>
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

      <main className="chat-page">
        {empty ? (
          <EmptyState onSelect={send} />
        ) : (
          <section className="chat-list">
            {messages.map((message: any) => (
              <ChatMessage
                key={message.id}
                message={message}
                onDelete={deleteMessage}
              />
            ))}

            <div ref={bottomRef} />
          </section>
        )}

        {!!error && (
          <div className="error-box">
            <span>{error}</span>

            <button onClick={() => setError("")}>✕</button>
          </div>
        )}

        <footer className="chat-footer">
          <div className="stream-toggle">
            <label>
              <input
                type="checkbox"
                checked={streamMode}
                onChange={() => setStreamMode(!streamMode)}
              />
              Streaming
            </label>
          </div>

          <ChatInput
            disabled={loading || streaming}
            streaming={streaming}
            onSend={send}
          />
        </footer>
      </main>
    </>
  );
}
