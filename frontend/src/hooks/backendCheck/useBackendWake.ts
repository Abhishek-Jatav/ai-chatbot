"use client";

import { useEffect, useState } from "react";
import { pingBackend } from "./ping";

export function useBackendWake() {
  const [serverAwake, setServerAwake] = useState(false);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await pingBackend();
        setServerAwake(true);
      } catch {
        setServerAwake(false);
      }
    };

    // Initial check
    checkBackend();

    // Keep polling every 3 sec (never stops)
    const interval = setInterval(checkBackend, 3000);

    return () => clearInterval(interval);
  }, []);

  return serverAwake;
}
