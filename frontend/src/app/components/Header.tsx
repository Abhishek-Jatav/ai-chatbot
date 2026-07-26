"use client";

import { motion } from "framer-motion";
import { Menu, Moon, Sun, Sparkles } from "lucide-react";

import { toast } from "sonner";
import { HeaderProps } from "@/types";

export default function Header({
  theme,
  toggleTheme,
  openSidebar,
}: HeaderProps) {
  const changeTheme = () => {
    toggleTheme();

    toast.success(
      theme === "dark" ? "Light mode enabled" : "Dark mode enabled",
    );
  };

  return (
    <motion.header
      initial={{
        y: -60,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#020617cc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">
          {/* Left */}

          <div className="flex items-center gap-3">
            <button
              onClick={openSidebar}
              className="h-10 w-10 rounded-xl border border-white/10 hover:bg-white/5 transition flex items-center justify-center">
              <Menu size={20} />
            </button>

            <motion.div
              whileHover={{
                scale: 1.05,
              }}
              className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>

              <div className="hidden sm:block">
                <h1 className="font-bold text-lg">AI FAQ Assistant</h1>

                <p className="text-xs text-slate-400">Powered by Gemini AI</p>
              </div>
            </motion.div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-3">
            <button
              onClick={changeTheme}
              className="h-10 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition flex items-center gap-2">
              {theme === "dark" ? (
                <>
                  <Sun size={18} />
                  <span className="hidden md:block">Light</span>
                </>
              ) : (
                <>
                  <Moon size={18} />
                  <span className="hidden md:block">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
