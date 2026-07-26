"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  BrainCircuit,
  MessageSquareText,
  History,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import ManualBackendCheck from "../hooks/manualBackendCheck/ManualBackendCheck";

const features = [
  {
    icon: BrainCircuit,
    title: "Gemini AI",
    desc: "Fast and intelligent answers powered by Google's latest Gemini models.",
  },
  {
    icon: MessageSquareText,
    title: "Streaming Chat",
    desc: "Watch AI responses appear in real-time for a natural conversation.",
  },
  {
    icon: History,
    title: "Conversation History",
    desc: "Search and revisit previous conversations instantly.",
  },
  {
    icon: Database,
    title: "Persistent Storage",
    desc: "MongoDB Atlas securely stores every conversation.",
  },
  {
    icon: ShieldCheck,
    title: "Production Ready",
    desc: "NestJS architecture with clean code and scalable APIs.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Optimized frontend built with Next.js App Router.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-cyan-500/10 blur-[180px] rounded-full" />

        <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-purple-600/10 blur-[180px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <nav className="flex items-center justify-between py-8">
          <div className="flex items-center gap-3">
            <Sparkles className="text-cyan-400" />

            <h2 className="font-bold text-2xl">AI FAQ Assistant</h2>
          </div>

          <Link href="/home" className="primary-btn">
            Launch App
          </Link>
        </nav>

        <section className="grid lg:grid-cols-2 gap-14 items-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}>
            <span className="inline-flex px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-sm mb-6">
              ✨ Premium AI Assistant
            </span>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              Chat with
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                Gemini AI
              </span>
            </h1>

            <p className="mt-8 text-slate-400 text-lg leading-8 max-w-xl">
              Experience a beautiful AI assistant with streaming responses,
              searchable history, markdown support, production-ready backend,
              and premium UI.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <Link
                href="/home"
                className="primary-btn flex items-center gap-2">
                Start Chat
                <ArrowRight size={18} />
              </Link>

              <a href="#features" className="secondary-btn">
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}>
            <div className="glass rounded-3xl p-6">
              <ManualBackendCheck />
            </div>
          </motion.div>
        </section>

        <section id="features" className="py-10">
          <h2 className="text-4xl font-bold text-center mb-14">
            Powerful Features
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {features.map((item) => {
              const Icon = item.icon;

              return (
                <motion.div
                  whileHover={{ y: -8 }}
                  key={item.title}
                  className="card p-7">
                  <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-5">
                    <Icon className="text-cyan-400" />
                  </div>

                  <h3 className="font-bold text-xl mb-3">{item.title}</h3>

                  <p className="text-slate-400 leading-7">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="py-20">
          <div className="glass rounded-3xl p-10 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to experience AI?</h2>

            <p className="text-slate-400 mb-10">
              Start chatting with Gemini AI in seconds.
            </p>

            <Link
              href="/home"
              className="primary-btn inline-flex items-center gap-2">
              Launch Assistant
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
