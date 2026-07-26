"use client";

import { useEffect } from "react";
import { useDinoGame } from "./useDinoGame";

export default function DinoGame() {
  const { dinoY, obstacleX, jump, gameOver, reset, score } = useDinoGame();

  // Controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        gameOver ? reset() : jump();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver]);

  return (
    <div
      onClick={() => (gameOver ? reset() : jump())}
      className="relative w-full max-w-[500px] aspect-[3/1] bg-white overflow-hidden rounded-xl border">
      {/* Sky */}
      <div className="absolute inset-0 bg-white" />

      {/* Ground line */}
      <div className="absolute bottom-[15%] w-full h-[2px] bg-black" />

      {/* Dino 🦖 */}
      <div
        className="absolute left-[10%] text-2xl select-none"
        style={{ bottom: `${15 + dinoY}%` }}>
        🦖
      </div>

      {/* Cactus 🌵 */}
      <div
        className="absolute text-xl"
        style={{
          left: `${obstacleX}%`,
          bottom: "15%",
        }}>
        🌵
      </div>

      {/* Score */}
      <div className="absolute top-2 right-3 text-black font-mono text-sm">
        {score}
      </div>

      {/* Game Over */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80">
          <div className="text-black font-bold text-lg">Game Over</div>
          <div className="text-sm text-gray-600">Tap / Space to restart</div>
        </div>
      )}
    </div>
  );
}
