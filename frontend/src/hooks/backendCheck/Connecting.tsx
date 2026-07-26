"use client";

import { useEffect, useState } from "react";

export default function Connecting({ error }: { error: string | null }) {
  const [dots, setDots] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const maxTime = 60;

  // Dots animation
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Timer countdown (AUTO reload at 0)
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          window.location.reload(); // 🔥 auto reload
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const progress = Math.pow(Math.min(timeLeft, maxTime) / maxTime, 3);
  const percentage = Math.round((Math.min(timeLeft, maxTime) / maxTime) * 100);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="w-full h-full bg-[#020617] text-white flex items-center justify-center px-4">
      <div className="w-full bg-[#0b1220]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4">
        <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
          {/* Text */}
          <div>
            <div className="font-bold text-sm flex items-center gap-2">
              🔌 Connecting to server
              <span className="animate-pulse text-blue-400">{dots}</span>
            </div>

            <div className="text-xs mt-1 text-white/80">
              Free server waking up… please wait 🙏
            </div>
          </div>

          {/* Percentage */}
          <div className="flex flex-col items-center min-w-[80px]">
            <div className="text-3xl font-extrabold font-mono">
              {percentage}%
            </div>
            <div className="text-[10px] text-white/60 uppercase">loading</div>
          </div>

          {/* Progress */}
          <div className="col-span-2 mt-2">
            <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* 🔄 Retry button (always helpful) */}
        <div className="mt-3 flex justify-center">
          <button
            onClick={handleRetry}
            className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition">
            Retry 🔄
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="text-red-400 text-xs mt-2 text-center">{error}</div>
        )}
      </div>
    </div>
  );
}
