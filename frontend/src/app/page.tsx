import Link from "next/link";
import ManualBackendCheck from "../hooks/manualBackendCheck/ManualBackendCheck";

export default function Page() {
  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[#020617]" />
      <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-cyan-600/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full" />

      {/* Backend Status */}
      <div className="fixed top-4 left-4 z-50 w-[340px]">
        <div className="bg-[#0f172a]/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/10">
          <ManualBackendCheck />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <div className="max-w-6xl w-full">
          {/* Hero */}
          <div className="text-center mb-14">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              🤖 AI FAQ Assistant
            </h1>

            <p className="text-xl md:text-2xl text-cyan-400 font-medium mb-5">
              Intelligent AI Chatbot Powered by Google Gemini
            </p>

            <p className="max-w-3xl mx-auto text-gray-400 text-lg leading-relaxed">
              Ask anything and receive fast, intelligent answers powered by
              Google Gemini AI. Built with Next.js, NestJS, MongoDB Atlas, and
              real-time streaming for a smooth conversational experience.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/chat"
                className="px-8 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition font-semibold text-white">
                Launch Assistant
              </Link>

              <a
                href="https://github.com/your-github"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition text-white">
                GitHub
              </a>

              <a
                href="https://your-portfolio.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition text-white">
                Portfolio
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-white font-semibold text-lg mb-3">
                🤖 AI Assistant
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li>Google Gemini AI</li>
                <li>Streaming Responses</li>
                <li>Markdown Support</li>
                <li>Natural Conversations</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-white font-semibold text-lg mb-3">
                📚 Chat Management
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li>Conversation History</li>
                <li>Search Previous Chats</li>
                <li>Delete Conversations</li>
                <li>Dark / Light Theme</li>
              </ul>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <h3 className="text-white font-semibold text-lg mb-3">
                ⚡ Modern Stack
              </h3>

              <ul className="space-y-2 text-gray-400">
                <li>Next.js 15</li>
                <li>NestJS</li>
                <li>MongoDB Atlas</li>
                <li>Docker Ready</li>
              </ul>
            </div>
          </div>

          {/* Architecture */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 backdrop-blur-md">
            <h2 className="text-white text-xl font-semibold mb-4">
              🏗 System Flow
            </h2>

            <div className="text-center text-gray-300 leading-loose">
              Next.js
              <span className="mx-2 text-cyan-400">→</span>
              REST API / SSE
              <span className="mx-2 text-cyan-400">→</span>
              NestJS
              <span className="mx-2 text-cyan-400">→</span>
              Google Gemini AI
              <span className="mx-2 text-cyan-400">→</span>
              MongoDB Atlas
              <span className="mx-2 text-cyan-400">→</span>
              Streaming Chat UI
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500">
            The backend is hosted on a free server and may take a few moments to
            wake up before the AI assistant is ready.
          </p>
        </div>
      </div>
    </div>
  );
}
