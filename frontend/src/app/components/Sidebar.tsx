"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MessageSquare,
  Calendar,
  ChevronRight,
  X,
  History,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

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
    } catch {
      toast.error("Unable to load history");
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

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!search.trim()) {
        loadHistory(1);
        return;
      }

      try {
        const res: any = await api.searchHistory(search);

        setHistory(res.data);
        setPage(1);
        setTotalPages(1);
      } catch {
        toast.error("Search failed");
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [search, loadHistory]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString([], {
      month: "short",
      day: "numeric",
    });

  const title = useMemo(() => `${stats.total} Conversations`, [stats.total]);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.aside
            initial={{ x: -420 }}
            animate={{ x: 0 }}
            exit={{ x: -420 }}
            transition={{ type: "spring", damping: 24 }}
            className="fixed left-0 top-0 z-50 h-screen w-[380px] max-w-[92vw]
            border-r border-white/10 bg-[#020617]/95 backdrop-blur-2xl">
            <div className="flex h-full flex-col">
              {/* Header */}

              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <History size={20} />
                    History
                  </h2>

                  <p className="mt-1 text-sm text-slate-400">{title}</p>
                </div>

                <button
                  onClick={onClose}
                  className="rounded-xl border border-white/10 p-2 transition hover:bg-white/10">
                  <X size={18} />
                </button>
              </div>

              {/* Stats */}

              <div className="grid grid-cols-2 gap-4 p-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-3xl font-bold">{stats.total}</div>

                  <div className="mt-1 text-sm text-slate-400">Total Chats</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-3xl font-bold">{stats.todayCount}</div>

                  <div className="mt-1 text-sm text-slate-400">Today</div>
                </div>
              </div>

              {/* Search */}

              <div className="px-6 pb-5">
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <Search size={18} className="text-slate-400" />

                  <input
                    className="w-full bg-transparent text-sm placeholder:text-slate-500"
                    placeholder="Search conversations..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* History */}

              <div className="flex-1 overflow-y-auto px-4 pb-6">
                {loading && history.length === 0 && (
                  <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin" size={28} />
                  </div>
                )}

                {!loading && history.length === 0 && (
                  <div className="flex h-64 flex-col items-center justify-center text-center">
                    <MessageSquare size={42} className="mb-4 text-slate-500" />

                    <h3 className="font-semibold">No Conversations</h3>

                    <p className="mt-2 text-sm text-slate-500">
                      Your previous chats will appear here.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {history.map((item) => (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      key={item._id}
                      onClick={() => {
                        onSelect(item);
                        toast.success("Conversation loaded");
                        onClose();
                      }}
                      className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-500/30 hover:bg-cyan-500/5">
                      <div className="line-clamp-2 font-medium">
                        {item.question}
                      </div>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />

                          {formatDate(item.timestamp)}
                        </div>

                        <ChevronRight size={15} />
                      </div>
                    </motion.button>
                  ))}
                </div>

                {page < totalPages && (
                  <button
                    onClick={() => loadHistory(page + 1)}
                    className="primary-btn mt-6 w-full">
                    Load More
                  </button>
                )}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}