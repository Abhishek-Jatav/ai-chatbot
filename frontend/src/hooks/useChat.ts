"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { ChatMessage, Conversation, Theme } from "@/types";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [streamMode, setStreamMode] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [error, setError] = useState("");

  const [theme, setTheme] = useState<Theme>("light");

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------------- Theme ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;

    if (!saved) return;

    setTheme(saved);
    document.documentElement.dataset.theme = saved;
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";

    setTheme(next);

    localStorage.setItem("theme", next);

    document.documentElement.dataset.theme = next;
  };

  /* ---------------- Scroll ---------------- */

  const scrollBottom = useCallback(() => {
    requestAnimationFrame(() => {
      bottomRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    });
  }, []);

  useEffect(scrollBottom, [messages, scrollBottom]);

  /* ---------------- Send ---------------- */

  const send = async (question: string) => {
    setError("");

    streamMode ? await sendStreaming(question) : await sendNormal(question);
  };

  async function sendNormal(question: string) {
    setLoading(true);

    const id = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id,
        question,
        answer: "",
        streaming: true,
      },
    ]);

    try {
      const res: any = await api.ask(question);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                id: res.data._id,
                question: res.data.question,
                answer: res.data.answer,
                timestamp: res.data.timestamp,
              }
            : m,
        ),
      );

      setRefreshKey((x) => x + 1);
    } catch (e: any) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendStreaming(question: string) {
    setStreaming(true);

    const id = crypto.randomUUID();

    setMessages((prev) => [
      ...prev,
      {
        id,
        question,
        answer: "",
        streaming: true,
      },
    ]);

    await api.askStream(
      question,

      (chunk) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  answer: m.answer + chunk,
                }
              : m,
          ),
        );
      },

      (savedId) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id
              ? {
                  ...m,
                  id: savedId,
                  streaming: false,
                }
              : m,
          ),
        );

        setStreaming(false);
        setRefreshKey((x) => x + 1);
      },

      (msg) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));

        setStreaming(false);
        setError(msg);
      },
    );
  }

  /* ---------------- Delete ---------------- */

  const deleteMessage = async (id: string) => {
    try {
      await api.deleteConversation(id);

      setMessages((prev) => prev.filter((m) => m.id !== id));

      setRefreshKey((x) => x + 1);
    } catch {}
  };

  /* ---------------- History ---------------- */

  const selectConversation = (conversation: Conversation) => {
    setMessages((prev) => {
      const exists = prev.find((m) => m.id === conversation._id);

      if (exists) return prev;

      return [
        ...prev,
        {
          id: conversation._id,
          question: conversation.question,
          answer: conversation.answer,
          timestamp: conversation.timestamp,
        },
      ];
    });

    scrollBottom();
  };

  return {
    /* state */

    messages,

    loading,

    streaming,

    streamMode,

    sidebarOpen,

    refreshKey,

    theme,

    error,

    bottomRef,

    /* setters */

    setStreamMode,

    setSidebarOpen,

    setError,

    /* actions */

    send,

    deleteMessage,

    selectConversation,

    toggleTheme,
  };
}
