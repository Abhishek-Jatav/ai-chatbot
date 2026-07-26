"use client";

type Props = {
  gameState: "waiting" | "ready" | "clicked" | "tooSoon";
  reactionTime: number | null;
  bestScore: number | null;
  streak: number;
  onClick: () => void;
};

export default function GameUI({
  gameState,
  reactionTime,
  bestScore,
  streak,
  onClick,
}: Props) {
  const getBackground = () => {
    switch (gameState) {
      case "waiting":
        return "bg-gradient-to-br from-gray-900 to-gray-700";
      case "ready":
        return "bg-gradient-to-br from-green-500 to-emerald-700";
      case "tooSoon":
        return "bg-gradient-to-br from-red-500 to-rose-700";
      case "clicked":
        return "bg-gradient-to-br from-indigo-600 to-purple-800";
      default:
        return "";
    }
  };

  const getMessage = () => {
    switch (gameState) {
      case "waiting":
        return "Wait for green...";
      case "ready":
        return "CLICK NOW!";
      case "tooSoon":
        return "Too soon! 😅";
      case "clicked":
        return `${reactionTime} ms`;
      default:
        return "";
    }
  };

  return (
    <div
      onClick={onClick}
      className={`${getBackground()}
      flex flex-col items-center justify-center
      w-full min-h-screen text-white text-center
      px-4 transition-all duration-300 cursor-pointer`}>
      <div className="max-w-md w-full space-y-6">
        <h1 className="text-2xl sm:text-4xl font-bold">
          ⚡ Reaction Speed Test
        </h1>

        {gameState === "waiting" && (
          <div className="w-16 h-16 mx-auto rounded-full bg-white/20 animate-pulse" />
        )}

        {bestScore && (
          <p className="text-sm sm:text-base text-gray-200">
            🏆 Best: {bestScore} ms
          </p>
        )}

        <p className="text-sm text-gray-300">🎮 Streak: {streak}</p>
        <p className="text-lg sm:text-2xl font-medium">{getMessage()}</p>
      </div>
    </div>
  );
}
