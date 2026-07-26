"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api`;

// ⏱️ helper: fetch with timeout
const fetchWithTimeout = async (url: string, timeout = 5000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
};

export default function ManualBackendCheck() {
  const router = useRouter();

  const [isHealthy, setIsHealthy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [statusText, setStatusText] = useState("Backend Sleeping");

  // ⏱️ 30-second cooldown
  const startCooldown = () => {
    setCooldown(30);
  };

  const wakeBackend = async () => {
    if (cooldown > 0 || !BACKEND_URL) return;

    setLoading(true);
    setStatusText("Waking server... ⚡");

    try {
      // 🔥 Step 1: FAST ping with timeout
      await fetchWithTimeout(`${BACKEND_URL}/ping`, 5000);

      // 🔄 Step 2: wait before health check
      setStatusText("Checking database... ⏳");
      await new Promise((res) => setTimeout(res, 2000));

      // 🧠 Step 3: Full health check with timeout
      const res = await fetchWithTimeout(`${BACKEND_URL}/health`, 5000);

      if (res.ok) {
        setIsHealthy(true);
        setStatusText("Backend Ready ✅");
      } else {
        setStatusText("Server not ready ❌");
        startCooldown();
      }
    } catch (err) {
      // ❌ Covers timeout, network error, abort, no response
      setStatusText("No response from server ❌");
      startCooldown();
    }

    setLoading(false);
  };

  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-[360px] p-6 rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-xl flex flex-col gap-5">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white">Start Backend</h2>
          <p className="text-sm text-gray-400 mt-1">
            Initialize server before entering app
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              isHealthy ? "bg-green-500" : "bg-red-500"
            } animate-pulse`}
          />
          <span className="text-sm text-gray-400">{statusText}</span>
        </div>

        {/* Wake Button */}
        {!isHealthy && (
          <button
            onClick={wakeBackend}
            disabled={loading || cooldown > 0}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium 
            hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50">
            {loading
              ? "Processing..."
              : cooldown > 0
                ? `Retry in ${cooldown}s`
                : "Wake Backend"}
          </button>
        )}

        {/* Redirect */}
        {isHealthy && (
          <button
            onClick={() => router.push("/home")}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-medium 
            hover:scale-[1.02] active:scale-[0.98] transition-all">
            Go to Home →
          </button>
        )}
      </div>
    </div>
  );
}
