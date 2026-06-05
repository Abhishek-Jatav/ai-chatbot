# AI FAQ Assistant

An AI-powered FAQ chatbot built with **Next.js 15**, **NestJS**, **MongoDB**, and **Google Gemini AI**.

## Architecture

```
ai-faq-assistant/
├── frontend/          # Next.js 15 (React 19, TypeScript)
│   ├── src/
│   │   ├── app/       # App Router pages & layout
│   │   ├── components/ # ChatMessage, ChatInput, Sidebar, Header
│   │   ├── lib/       # API client (api.ts)
│   │   └── types/     # TypeScript interfaces
│   └── Dockerfile
├── backend/           # NestJS (TypeScript)
│   ├── src/
│   │   ├── chat/      # Chat module (controller, service, schema, DTOs)
│   │   ├── gemini/    # Gemini AI integration service
│   │   ├── app.module.ts
│   │   └── main.ts
│   └── Dockerfile
└── docker-compose.yml
```

## Prerequisites

- Node.js 20+
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))

---

## Setup Instructions

### 1. Configure Environment Variables

**Backend** — Edit `backend/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb+srv://admin:<db_password>@ai-chatbot-cluster.dzzw6nk.mongodb.net/?appName=ai-chatbot-cluster
PORT=3001
```

> Replace `<db_password>` with your actual MongoDB password.

**Frontend** — Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 2. Option A: Run Without Docker (Manual)

#### Backend
```bash
cd backend
npm install
npm run start:dev
# Runs on http://localhost:3001
```

#### Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Runs on http://localhost:3000
```

---

### 2. Option B: Run With Docker

```bash
# From the root directory
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat/ask` | Ask a question (standard) |
| `POST` | `/api/chat/ask/stream` | Ask with streaming (SSE) |
| `GET` | `/api/chat/history` | Get paginated history |
| `GET` | `/api/chat/search?q=query` | Search conversations |
| `GET` | `/api/chat/stats` | Get total/today counts |
| `DELETE` | `/api/chat/:id` | Delete a conversation |

### Example Request
```bash
curl -X POST http://localhost:3001/api/chat/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What is machine learning?"}'
```

---

## Features

### Core
- ✅ Chat interface with user/AI message bubbles
- ✅ AI-powered answers via Google Gemini 1.5 Flash
- ✅ Conversations stored in MongoDB Atlas
- ✅ Conversation history API with pagination

### Bonus
- ✅ **Streaming responses** — real-time token-by-token display via SSE
- ✅ **Dark mode** — toggle with persistence in localStorage
- ✅ **Conversation search** — full-text search with regex fallback
- ✅ **Docker setup** — `docker-compose up --build`

---

## Technical Decisions

### Backend
- **NestJS** for structured, scalable TypeScript APIs with dependency injection
- **Mongoose** schemas with text indexes for efficient search
- **Timestamp index** for fast history queries sorted by recency
- **Global validation pipe** with `class-validator` for input sanitization
- **CORS** configured to allow frontend origins

### Frontend
- **Next.js 15 App Router** with React 19 for the latest patterns
- **Streaming via SSE** — fetch ReadableStream for real-time display
- **react-markdown + remark-gfm** to render AI responses as rich markdown
- **No external state library** — React `useState` handles all local state
- **CSS variables** for instant dark/light theme switching

### MongoDB Schema Design
```typescript
{
  question: String,     // Indexed (text)
  answer: String,       // Indexed (text)
  timestamp: Date,      // Indexed (desc) for sorted history
}
// Compound text index on question + answer for full-text search
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript |
| Backend | NestJS 10, TypeScript |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini 1.5 Flash |
| Containerization | Docker + Docker Compose |
