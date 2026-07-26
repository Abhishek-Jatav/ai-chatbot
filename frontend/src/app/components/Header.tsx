"use client";

import { HeaderProps } from "@/types";

export default function Header({
  theme,
  toggleTheme,
  openSidebar,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header__left">
        <button
          className="icon-btn"
          onClick={openSidebar}
          aria-label="Open history">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="15" y2="18" />
          </svg>
        </button>

        <div className="logo">
          <div className="logo__icon">✦</div>

          <div>
            <h2>AI FAQ</h2>

            <span>Powered by Gemini</span>
          </div>
        </div>
      </div>

      <button className="theme-btn" onClick={toggleTheme}>
        {theme === "dark" ? (
          <>
            ☀️
            <span>Light</span>
          </>
        ) : (
          <>
            🌙
            <span>Dark</span>
          </>
        )}
      </button>
    </header>
  );
}
