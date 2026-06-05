'use client';
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSend: (question: string) => void;
  disabled?: boolean;
  streaming?: boolean;
}

const SUGGESTIONS = [
  "What is machine learning?",
  "How does React's useEffect work?",
  "Explain REST vs GraphQL",
  "What are the SOLID principles?",
];

export default function ChatInput({ onSend, disabled, streaming }: ChatInputProps) {
  const [value, setValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [disabled]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    autoResize();
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleSuggestion = (s: string) => {
    setValue(s);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Suggestions */}
      {showSuggestions && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10,
          }}
        >
          <div style={{ padding: '8px 12px', fontSize: '0.75rem', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>
            Suggested questions
          </div>
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestion(s)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '10px 16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
                color: 'var(--text-primary)',
                transition: 'background 0.15s ease',
                borderBottom: i < SUGGESTIONS.length - 1 ? '1px solid var(--border)' : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
          background: 'var(--bg-input)',
          border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '8px 8px 8px 12px',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
        onFocus={() => {}}
      >
        {/* Spark suggestions button */}
        <button
          onClick={() => setShowSuggestions((s) => !s)}
          title="Show suggestions"
          style={{
            flexShrink: 0,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: showSuggestions ? 'var(--accent)' : 'var(--text-muted)',
            padding: '6px',
            borderRadius: '8px',
            marginBottom: '2px',
            transition: 'color 0.15s ease',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"/>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything…"
          disabled={disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '0.95rem',
            color: 'var(--text-primary)',
            lineHeight: 1.6,
            padding: '4px 0',
            overflow: 'hidden',
            opacity: disabled ? 0.5 : 1,
          }}
        />

        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          style={{
            flexShrink: 0,
            background: !value.trim() || disabled ? 'var(--bg-secondary)' : 'var(--accent)',
            color: !value.trim() || disabled ? 'var(--text-muted)' : 'var(--accent-text)',
            border: 'none',
            borderRadius: '10px',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: !value.trim() || disabled ? 'not-allowed' : 'pointer',
            transition: 'background 0.15s ease, color 0.15s ease',
            flexDirection: 'column',
          }}
        >
          {streaming ? (
            <div className="spinner" style={{ width: 16, height: 16, borderTopColor: 'var(--accent-text)' }} />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>

      <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '8px' }}>
        Press <kbd style={{ background: 'var(--tag)', padding: '1px 5px', borderRadius: 4, fontSize: '0.65rem' }}>Enter</kbd> to send &nbsp;·&nbsp; 
        <kbd style={{ background: 'var(--tag)', padding: '1px 5px', borderRadius: 4, fontSize: '0.65rem' }}>Shift+Enter</kbd> for new line
      </p>
    </div>
  );
}
