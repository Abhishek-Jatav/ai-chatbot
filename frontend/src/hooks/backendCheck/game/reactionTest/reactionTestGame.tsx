"use client";

import { useReactionGame } from "@/hooks/backendCheck/game/reactionTest/useReactionGame";
import GameUI from "./GameUI";

export default function ReactionTestGame() {
  const { gameState, reactionTime, bestScore, streak, handleClick } =
    useReactionGame();

  return (
    <GameUI
      gameState={gameState}
      reactionTime={reactionTime}
      bestScore={bestScore}
      streak={streak}
      onClick={handleClick}
    />
  );
}
