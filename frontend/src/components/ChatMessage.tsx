'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Conversation } from '@/types';
import { api } from '@/lib/api';

interface ChatMessageProps {
  conversation?: Conversation;
  question?: string;
  answer?: string;
  isStreaming?: boolean;
  streamingText?: string;
  isNew?: boolean;
  onDelete?: (id: string) => void;
}

export default function ChatMessage({
  conversation,
  question,
  answer,
  isStreaming,
  streamingText,
  isNew,
  onDelete,
}: ChatMessageProps) {
  const [deleting, setDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const q = conversation?.question ?? question ?? '';
  const a = conversation?.answer ?? answer ?? streamingText ?? '';
  const id = conversation?._id;
  const ts = conversation?.timestamp;

  const handleDelete = async () => {
    if (!id || !onDelete) return;
    setDeleting(true);
    try {
      await api.deleteConversation(id);
      onDelete(id);
    } catch {
      setDeleting(false);
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`chat-pair ${isNew ? 'fade-in' : ''}`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      style={{ marginBottom: '1.5rem', position: 'relative' }}
    >
      {/* User message */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <div
          style={{
            maxWidth: '72%',
            background: 'var(--user-bubble)',
            color: 'var(--user-bubble-text)',
            borderRadius: 'var(--radius) var(--radius) 4px var(--radius)',
            padding: '0.75rem 1rem',
            fontSize: '0.95rem',
            lineHeight: 1.6,
            wordBreak: 'break-word',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {q}
        </div>
      </div>

      {/* AI message */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '0.5rem' }}>
        {/* AI avatar */}
        <div
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: '14px', color: 'var(--accent-text)' }}>✦</span>
        </div>

        <div style={{ flex: 1, maxWidth: 'calc(100% - 44px)' }}>
          <div
            style={{
              background: 'var(--ai-bubble)',
              color: 'var(--ai-bubble-text)',
              borderRadius: '4px var(--radius) var(--radius) var(--radius)',
              padding: '0.875rem 1.125rem',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border)',
              wordBreak: 'break-word',
            }}
          >
            {isStreaming && !a ? (
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center', padding: '4px 0' }}>
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            ) : (
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{a}</ReactMarkdown>
                {isStreaming && <span className="streaming-cursor" />}
              </div>
            )}
          </div>

          {ts && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', paddingLeft: '4px' }}>
              {formatTime(ts)}
            </div>
          )}
        </div>

        {/* Delete button */}
        {id && onDelete && showDelete && !deleting && (
          <button
            onClick={handleDelete}
            title="Delete"
            style={{
              flexShrink: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '4px',
              borderRadius: '6px',
              marginTop: 4,
              opacity: showDelete ? 1 : 0,
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2" />
            </svg>
          </button>
        )}
        {deleting && (
          <div style={{ flexShrink: 0, marginTop: 8 }}>
            <div className="spinner" style={{ width: 14, height: 14 }} />
          </div>
        )}
      </div>
    </div>
  );
}
