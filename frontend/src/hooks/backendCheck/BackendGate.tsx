"use client";

import { ReactNode } from "react";
import { useBackendWake } from "./useBackendWake";
import Connecting from "../backendCheck/Connecting";
import ReactionTestGame from "../backendCheck/game/reactionTest/reactionTestGame";
// import DinoGame from "../backendCheck/game/dinosaurgame/DinoGame";

export default function BackendGate({ children }: { children: ReactNode }) {
  const serverAwake = useBackendWake();

  if (!serverAwake) {
    return (
      <div className="fixed inset-0 w-full h-full bg-[#020617] text-white z-[9999] flex flex-col">
        {/* 🔝 Connecting (20%) */}
        <div className="h-[20vh] w-full">
          <Connecting error={null} />
        </div>

        {/* 🎮 Game (80%) */}
        <div className="h-[80vh] w-full flex justify-center items-center">
          <ReactionTestGame />
          {/* <DinoGame /> */}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
