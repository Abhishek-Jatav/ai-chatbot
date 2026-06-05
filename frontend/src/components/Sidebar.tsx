'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Conversation } from '@/types';
import { api } from '@/lib/api';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (c: Conversation) => void;
  refreshTrigger: number;
}

export default function Sidebar({ isOpen, onClose, onSelectConversation, refreshTrigger }: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, todayCount: 0 });

  const loadHistory = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.getHistory(p, 15);
      if (p === 1) {
        setConversations(res.data);
      } else {
        setConversations((prev) => [...prev, ...res.data]);
      }
      setTotalPages(res.totalPages);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.getStats();
      setStats(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadHistory(1);
      loadStats();
    }
  }, [isOpen, refreshTrigger, loadHistory, loadStats]);

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      loadHistory(1);
      return;
    }
    setIsSearching(true);
    try {
      const res = await api.searchConversations(q);
      setConversations(res.data);
      setTotalPages(1);
    } catch {}
    setIsSearching(false);
  };

  const truncate = (text: string, len = 60) =>
    text.length > len ? text.slice(0, len) + '…' : text;

  const formatDate = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffH = diffMs / 3600000;
    if (diffH < 1) return 'Just now';
    if (diffH < 24) return `${Math.floor(diffH)}h ago`;
    if (diffH < 48) return 'Yesterday';
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)',
            zIndex: 40, backdropFilter: 'blur(2px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0,
          width: 320, background: 'var(--bg-card)',
          borderRight: '1px solid var(--border)',
          zIndex: 50,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex', flexDirection: 'column',
          boxShadow: isOpen ? 'var(--shadow-lg)' : 'none',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>
              History
            </h2>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '4px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '0.875rem' }}>
            {[
              { label: 'Total', value: stats.total },
              { label: 'Today', value: stats.todayCount },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)',
                padding: '8px 10px', textAlign: 'center',
              }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div style={{ position: 'relative' }}>
            <svg
              width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search conversations…"
              style={{
                width: '100%', padding: '8px 10px 8px 34px',
                background: 'var(--bg-input)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', outline: 'none',
                fontFamily: 'DM Sans, sans-serif', fontSize: '0.875rem',
                color: 'var(--text-primary)',
              }}
            />
            {isSearching && (
              <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)' }}>
                <div className="spinner" style={{ width: 14, height: 14 }} />
              </div>
            )}
          </div>
        </div>

        {/* Conversation list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}>
          {loading && conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div className="spinner" style={{ margin: '0 auto' }} />
            </div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              {searchQuery ? 'No results found.' : 'No conversations yet.'}
            </div>
          ) : (
            <>
              {conversations.map((c) => (
                <button
                  key={c._id}
                  onClick={() => { onSelectConversation(c); onClose(); }}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '10px 12px', borderRadius: 'var(--radius-sm)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    marginBottom: '2px', transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-secondary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px', lineHeight: 1.4 }}>
                    {truncate(c.question, 65)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {formatDate(c.timestamp)}
                  </div>
                </button>
              ))}

              {page < totalPages && !searchQuery && (
                <button
                  onClick={() => loadHistory(page + 1)}
                  disabled={loading}
                  style={{
                    display: 'block', width: '100%', textAlign: 'center',
                    padding: '8px', background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)',
                    marginTop: '8px',
                  }}
                >
                  {loading ? 'Loading…' : 'Load more'}
                </button>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
