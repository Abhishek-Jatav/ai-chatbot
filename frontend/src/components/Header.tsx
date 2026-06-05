'use client';
import React from 'react';
import { Theme } from '@/types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
}

export default function Header({ theme, onToggleTheme, onToggleSidebar }: HeaderProps) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 30,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{
        maxWidth: 800, margin: '0 auto',
        padding: '0 1.5rem',
        height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        {/* Left: menu + logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onToggleSidebar}
            title="Conversation history"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-secondary)', padding: '6px',
              borderRadius: '8px', display: 'flex', alignItems: 'center',
              transition: 'color 0.15s ease, background 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.background = 'var(--bg-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)';
              e.currentTarget.style.background = 'none';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="15" y2="18" />
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: 28, height: 28, borderRadius: '8px',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: 'var(--accent-text)', fontSize: '14px' }}>✦</span>
            </div>
            <span style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: '1rem', color: 'var(--text-primary)',
            }}>
              FAQ Assistant
            </span>
          </div>
        </div>

        {/* Right: theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Powered by Gemini
          </span>
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              borderRadius: '10px', cursor: 'pointer',
              padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--text-secondary)', fontSize: '0.8rem',
              transition: 'all 0.15s ease',
            }}
          >
            {theme === 'dark' ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                Light
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
                Dark
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
