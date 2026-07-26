"use client";

import { EmptyStateProps } from "@/types";

const QUESTIONS = [
  "Explain React Hooks",
  "Build a JWT authentication API",
  "How does WebSocket work?",
  "Optimize this SQL query",
];

export default function EmptyState({ onSelect }: EmptyStateProps) {
  return (
    <section className="empty-state">
      <div className="hero-icon">✦</div>

      <h1>How can I help you today?</h1>

      <p>
        Ask coding questions, debug errors, generate content, or learn something
        new with Gemini AI.
      </p>

      <div className="prompt-grid">
        {QUESTIONS.map((question) => (
          <button
            key={question}
            className="prompt-card"
            onClick={() => onSelect(question)}>
            <span className="prompt-icon">✨</span>

            <span className="prompt-text">{question}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
