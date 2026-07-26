"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/lib/api";
import { ChatMessageProps } from "@/types";

export default function ChatMessage({ message, onDelete }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const copyAnswer = async () => {
    if (!message.answer) return;

    await navigator.clipboard.writeText(message.answer);

    setCopied(true);

    setTimeout(() => setCopied(false), 1800);
  };

  const deleteChat = async () => {
    if (!onDelete || message.streaming) return;

    setDeleting(true);

    try {
      await api.deleteConversation(message.id);

      onDelete(message.id);
    } finally {
      setDeleting(false);
    }
  };

  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <article className="chat-item">
      {/* User */}

      <div className="user-row">
        <div className="user-bubble">{message.question}</div>
      </div>

      {/* AI */}

      <div className="ai-row">
        <div className="ai-avatar">✦</div>

        <div className="ai-content">
          <div className="ai-bubble">
            {message.answer ? (
              <div className="markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.answer}
                </ReactMarkdown>

                {message.streaming && <span className="typing-cursor" />}
              </div>
            ) : (
              <div className="typing-loader">
                <span />

                <span />

                <span />
              </div>
            )}
          </div>

          <div className="message-footer">
            {time && <span className="message-time">{time}</span>}

            <div className="message-actions">
              <button className="text-btn" onClick={copyAnswer}>
                {copied ? "Copied" : "Copy"}
              </button>

              {!message.streaming && (
                <button
                  className="text-btn danger"
                  onClick={deleteChat}
                  disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
