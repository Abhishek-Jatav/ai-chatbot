"use client";

import { useEffect, useRef, useState, useCallback } from "react";

type GameState = "waiting" | "ready" | "clicked" | "tooSoon";

export function useReactionGame() {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stable startGame function (important)
  const startGame = useCallback(() => {
    setReactionTime(null);
    setGameState("waiting");

    const delay = Math.random() * 3000 + 2000;

    timeoutRef.current = setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState("ready");
    }, delay);
  }, []);

  // Load sound
  useEffect(() => {
    audioRef.current = new Audio(
      "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3",
    );
  }, []);

  // Load best score
  useEffect(() => {
    const saved = localStorage.getItem("bestReaction");
    if (saved) setBestScore(Number(saved));
  }, []);

  const handleClick = () => {
    if (gameState === "waiting") {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setGameState("tooSoon");
      setStreak(0);
      return;
    }

    if (gameState === "ready") {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setGameState("clicked");

      audioRef.current?.play();

      if (!bestScore || time < bestScore) {
        setBestScore(time);
        localStorage.setItem("bestReaction", String(time));
      }

      setStreak((prev) => prev + 1);
    }
  };

  // Restart after result
  useEffect(() => {
    if (gameState === "clicked" || gameState === "tooSoon") {
      const restart = setTimeout(startGame, 1200);
      return () => clearTimeout(restart);
    }
  }, [gameState, startGame]); // ✅ ALWAYS same size

  // Initial start
  useEffect(() => {
    startGame();
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [startGame]); // ✅ stable dependency

  return {
    gameState,
    reactionTime,
    bestScore,
    streak,
    handleClick,
  };
}
