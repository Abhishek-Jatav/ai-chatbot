"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  SendHorizonal,
  Mic,
  Paperclip,
  Smile,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChatInputProps } from "@/types";

const SUGGESTIONS = [
  "Explain React Hooks with examples",
  "Build JWT Authentication using NestJS",
  "Write a scalable REST API",
  "Optimize this MongoDB query",
  "Difference between Redis and Kafka",
  "Explain Docker like I'm five",
];

export default function ChatInput({
  disabled,
  streaming,
  onSend,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recording, setRecording] = useState(false);

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
    const text = message.trim();

    if (!text) {
      toast.warning("Please enter a message");
      return;
    }

    if (disabled) return;

    onSend(text);

    toast.success("Message sent");

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "52px";
    }

    setShowSuggestions(false);
  };

  const chooseSuggestion = (text: string) => {
    setMessage(text);

    setShowSuggestions(false);

    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      resize();
    });
  };

  const voiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;

    setRecording(true);

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;

      setMessage((prev) => (prev ? prev + " " + transcript : transcript));

      resize();

      toast.success("Voice converted to text");
    };

    recognition.onerror = () => {
      toast.error("Voice recognition failed");
    };

    recognition.onend = () => {
      setRecording(false);
    };
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-full mb-4 w-full rounded-2xl border border-white/10 bg-[#0f172a] p-3 shadow-2xl">
            <div className="mb-2 flex items-center gap-2 text-sm text-cyan-400">
              <Sparkles size={16} />
              Suggestions
            </div>

            <div className="grid gap-2">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item}
                  onClick={() => chooseSuggestion(item)}
                  className="rounded-xl border border-white/10 bg-white/5 p-3 text-left text-sm hover:bg-cyan-500/10">
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="rounded-3xl border border-white/10 bg-[#0f172a]/90 backdrop-blur-xl shadow-2xl">
        <div className="flex items-end gap-3 p-4">
          <button
            type="button"
            onClick={() => setShowSuggestions((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-cyan-500/10"
            title="AI Suggestions">
            <Sparkles size={18} />
          </button>

          <button
            type="button"
            onClick={() => toast.info("File upload will be available soon.")}
            className="hidden sm:flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            title="Attach File">
            <Paperclip size={18} />
          </button>

          <div className="flex-1">
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              disabled={disabled}
              placeholder="Ask anything..."
              className="max-h-[180px] min-h-[52px] w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500"
              onChange={(e) => {
                setMessage(e.target.value);
                resize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => toast.info("Emoji picker coming soon.")}
            className="hidden md:flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition hover:bg-white/10"
            title="Emoji">
            <Smile size={18} />
          </button>

          <button
            type="button"
            onClick={voiceInput}
            className={`flex h-11 w-11 items-center justify-center rounded-xl border transition ${
              recording
                ? "border-red-500 bg-red-500 text-white"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
            title="Voice Input">
            <Mic size={18} className={recording ? "animate-pulse" : ""} />
          </button>

          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            type="button"
            disabled={!message.trim() || disabled}
            onClick={send}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl disabled:cursor-not-allowed disabled:opacity-40">
            {streaming ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 1,
                  ease: "linear",
                }}
                className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
              />
            ) : (
              <SendHorizonal size={20} />
            )}
          </motion.button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-3 text-xs text-slate-400">
          <span>
            Press <kbd className="rounded bg-white/10 px-2 py-1">Enter</kbd> to
            send
          </span>

          <span>
            <kbd className="rounded bg-white/10 px-2 py-1">Shift + Enter</kbd>{" "}
            for new line
          </span>
        </div>
      </div>
    </div>
  );
}