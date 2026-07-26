"use client";

import { useEffect, useRef, useState } from "react";
import { ChatInputProps } from "@/types";

const SUGGESTIONS = [
  "Explain React Hooks",
  "Write a Node.js authentication API",
  "What is Machine Learning?",
  "Optimize this SQL query",
];

export default function ChatInput({
  disabled,
  streaming,
  onSend,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const resize = () => {
    const el = textareaRef.current;

    if (!el) return;

    el.style.height = "0px";

    el.style.height = Math.min(el.scrollHeight, 180) + "px";
  };

  const send = () => {
    const text = value.trim();

    if (!text || disabled) return;

    onSend(text);

    setValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "48px";
    }

    setShowSuggestions(false);
  };

  const selectSuggestion = (text: string) => {
    setValue(text);

    setShowSuggestions(false);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      resize();
    });
  };

  return (
    <div className="chat-input-wrapper">
      {showSuggestions && (
        <div className="suggestions">
          {SUGGESTIONS.map((item) => (
            <button
              key={item}
              className="suggestion-item"
              onClick={() => selectSuggestion(item)}>
              {item}
            </button>
          ))}
        </div>
      )}

      <div className="chat-input">
        <button
          className="icon-btn"
          onClick={() => setShowSuggestions((v) => !v)}
          title="Suggestions">
          ✨
        </button>

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          disabled={disabled}
          placeholder="Ask anything..."
          onChange={(e) => {
            setValue(e.target.value);
            resize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
        />

        <button
          className="send-btn"
          disabled={!value.trim() || disabled}
          onClick={send}>
          {streaming ? (
            <div className="mini-spinner" />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.3">
              <line x1="22" y1="2" x2="11" y2="13" />

              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>

      <p className="input-footer">
        Press <kbd>Enter</kbd> to send • <kbd>Shift + Enter</kbd> for new line
      </p>
    </div>
  );
}
