'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from '@/components/Header';
import ChatMessage from '@/components/ChatMessage';
import ChatInput from '@/components/ChatInput';
import Sidebar from '@/components/Sidebar';
import { Conversation, Theme } from '@/types';
import { api } from '@/lib/api';

interface ChatEntry {
  id?: string;
  question: string;
  answer: string;
  timestamp?: string;
  isStreaming?: boolean;
}

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<ChatEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [useStreamMode, setUseStreamMode] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarRefresh, setSidebarRefresh] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('theme') as Theme;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute('data-theme', saved);
    }
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  }, []);

  useEffect(() => {
    if (chats.length > 0) scrollToBottom();
  }, [chats, scrollToBottom]);

  const handleSend = async (question: string) => {
    setError(null);

    if (useStreamMode) {
      await handleStreamSend(question);
    } else {
      await handleNormalSend(question);
    }
  };

  const handleNormalSend = async (question: string) => {
    setIsLoading(true);
    const tempId = Date.now().toString();

    // Add placeholder
    setChats((prev) => [...prev, { id: tempId, question, answer: '', isStreaming: true }]);

    try {
      const res = await api.askQuestion(question);
      setChats((prev) =>
        prev.map((c) =>
          c.id === tempId
            ? { id: res.data._id, question: res.data.question, answer: res.data.answer, timestamp: res.data.timestamp, isStreaming: false }
            : c,
        ),
      );
      setSidebarRefresh((n) => n + 1);
    } catch (err: any) {
      setChats((prev) => prev.filter((c) => c.id !== tempId));
      setError(err.message || 'Failed to get a response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStreamSend = async (question: string) => {
    setIsStreaming(true);
    const tempId = `stream-${Date.now()}`;

    setChats((prev) => [...prev, { id: tempId, question, answer: '', isStreaming: true }]);

    await api.askQuestionStream(
      question,
      (chunk) => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === tempId ? { ...c, answer: c.answer + chunk } : c,
          ),
        );
        scrollToBottom();
      },
      (savedId) => {
        setChats((prev) =>
          prev.map((c) =>
            c.id === tempId ? { ...c, id: savedId, isStreaming: false } : c,
          ),
        );
        setSidebarRefresh((n) => n + 1);
        setIsStreaming(false);
      },
      (errMsg) => {
        setChats((prev) => prev.filter((c) => c.id !== tempId));
        setError(errMsg);
        setIsStreaming(false);
      },
    );
  };

  const handleDeleteChat = (id: string) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    setSidebarRefresh((n) => n + 1);
  };

  const handleSelectFromHistory = (c: Conversation) => {
    // Check if already in chat
    const exists = chats.find((ch) => ch.id === c._id);
    if (!exists) {
      setChats((prev) => [...prev, { id: c._id, question: c.question, answer: c.answer, timestamp: c.timestamp }]);
    }
    scrollToBottom();
  };

  const isEmpty = chats.length === 0;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header theme={theme} onToggleTheme={toggleTheme} onToggleSidebar={() => setSidebarOpen(true)} />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSelectConversation={handleSelectFromHistory}
        refreshTrigger={sidebarRefresh}
      />

      <main style={{ flex: 1, maxWidth: 800, width: '100%', margin: '0 auto', padding: '0 1.5rem', display: 'flex', flexDirection: 'column' }}>
        {/* Empty state */}
        {isEmpty && (
          <div style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '4rem 1rem', textAlign: 'center',
            gap: '1.5rem',
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '20px',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-lg)',
            }}>
              <span style={{ fontSize: '2rem', color: 'var(--accent-text)' }}>✦</span>
            </div>
            <div>
              <h1 style={{
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
                color: 'var(--text-primary)', marginBottom: '0.5rem',
              }}>
                What would you like to know?
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: 440 }}>
                Ask me anything — programming, science, general knowledge, or complex topics. I'm powered by Gemini AI.
              </p>
            </div>

            {/* Quick start chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: 520 }}>
              {[
                "What is machine learning?",
                "Explain async/await in JavaScript",
                "Best practices for REST APIs",
                "What is the CAP theorem?",
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  style={{
                    padding: '8px 14px', background: 'var(--bg-card)',
                    border: '1px solid var(--border)', borderRadius: '100px',
                    cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)',
                    fontFamily: 'DM Sans, sans-serif',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent-text)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat messages */}
        {!isEmpty && (
          <div ref={chatContainerRef} style={{ flex: 1, padding: '2rem 0 1rem' }}>
            {chats.map((chat, i) => (
              <ChatMessage
                key={chat.id || i}
                question={chat.question}
                answer={chat.answer}
                isStreaming={chat.isStreaming}
                streamingText={chat.isStreaming ? chat.answer : undefined}
                isNew={i === chats.length - 1}
                conversation={chat.id && !chat.id.startsWith('stream-') ? {
                  _id: chat.id,
                  question: chat.question,
                  answer: chat.answer,
                  timestamp: chat.timestamp || new Date().toISOString(),
                } : undefined}
                onDelete={handleDeleteChat}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            margin: '0.5rem 0', padding: '12px 16px',
            background: 'rgba(192, 57, 43, 0.1)', border: '1px solid rgba(192, 57, 43, 0.3)',
            borderRadius: 'var(--radius-sm)', color: 'var(--danger)',
            fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>⚠ {error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', fontSize: '1.25rem', lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Input area */}
        <div style={{
          position: 'sticky', bottom: 0,
          background: 'var(--bg)', paddingBottom: '1.5rem',
          paddingTop: '0.75rem',
        }}>
          {/* Stream toggle */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <div
                onClick={() => setUseStreamMode((s) => !s)}
                style={{
                  width: 32, height: 18, borderRadius: 9,
                  background: useStreamMode ? 'var(--accent)' : 'var(--border)',
                  position: 'relative', cursor: 'pointer',
                  transition: 'background 0.2s ease',
                }}
              >
                <div style={{
                  position: 'absolute', top: 2,
                  left: useStreamMode ? 16 : 2,
                  width: 14, height: 14, borderRadius: '50%',
                  background: useStreamMode ? 'var(--accent-text)' : 'var(--text-muted)',
                  transition: 'left 0.2s ease',
                }} />
              </div>
              Streaming
            </label>
          </div>

          <ChatInput
            onSend={handleSend}
            disabled={isLoading || isStreaming}
            streaming={isStreaming}
          />
        </div>
      </main>
    </div>
  );
}
