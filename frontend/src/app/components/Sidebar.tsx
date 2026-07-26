"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Conversation, SidebarProps } from "@/types";

export default function Sidebar({
  open,
  onClose,
  refreshKey,
  onSelect,
}: SidebarProps) {
  const [history, setHistory] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [stats, setStats] = useState({
    total: 0,
    todayCount: 0,
  });

  const loadHistory = useCallback(async (p = 1) => {
    setLoading(true);

    try {
      const res: any = await api.getHistory(p);

      if (p === 1) {
        setHistory(res.data);
      } else {
        setHistory((prev) => [...prev, ...res.data]);
      }

      setPage(p);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res: any = await api.getStats();
      setStats(res.data);
    } catch {}
  }, []);

  useEffect(() => {
    if (!open) return;

    loadHistory(1);
    loadStats();
  }, [open, refreshKey, loadHistory, loadStats]);

  const searchHistory = async (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      loadHistory(1);
      return;
    }

    try {
      const res: any = await api.searchHistory(value);

      setHistory(res.data);
      setPage(1);
      setTotalPages(1);
    } catch {}
  };

  const formatDate = (time: string) => {
    const date = new Date(time);

    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${open ? "show" : ""}`}>
        <div className="sidebar-header">
          <div>
            <h2>History</h2>

            <p>{stats.total} conversations</p>
          </div>

          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-stats">
          <div className="stat-card">
            <h3>{stats.total}</h3>

            <span>Total</span>
          </div>

          <div className="stat-card">
            <h3>{stats.todayCount}</h3>

            <span>Today</span>
          </div>
        </div>

        <input
          className="search-input"
          placeholder="Search..."
          value={search}
          onChange={(e) => searchHistory(e.target.value)}
        />

        <div className="history-list">
          {!loading && history.length === 0 && (
            <div className="empty-history">No conversations</div>
          )}

          {history.map((item) => (
            <button
              key={item._id}
              className="history-card"
              onClick={() => {
                onSelect(item);
                onClose();
              }}>
              <h4>
                {item.question.length > 55
                  ? item.question.slice(0, 55) + "..."
                  : item.question}
              </h4>

              <span>{formatDate(item.timestamp)}</span>
            </button>
          ))}

          {page < totalPages && (
            <button className="load-more" onClick={() => loadHistory(page + 1)}>
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
