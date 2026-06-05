import { Conversation, PaginatedResponse, StatsResponse } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  async askQuestion(question: string): Promise<{ success: boolean; data: Conversation }> {
    const res = await fetch(`${API_BASE}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    return handleResponse(res);
  },

  async askQuestionStream(
    question: string,
    onChunk: (text: string) => void,
    onDone: (id?: string) => void,
    onError: (err: string) => void,
  ): Promise<void> {
    const res = await fetch(`${API_BASE}/chat/ask/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    if (!res.ok || !res.body) {
      onError('Failed to connect to streaming endpoint');
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.error) {
              onError(data.error);
              return;
            }
            if (data.done) {
              onDone(data.id);
              return;
            }
            if (data.chunk) {
              onChunk(data.chunk);
            }
          } catch (_) {}
        }
      }
    }
  },

  async getHistory(page = 1, limit = 20): Promise<PaginatedResponse<Conversation>> {
    const res = await fetch(`${API_BASE}/chat/history?page=${page}&limit=${limit}`);
    return handleResponse(res);
  },

  async searchConversations(query: string): Promise<{ success: boolean; data: Conversation[]; total: number }> {
    const res = await fetch(`${API_BASE}/chat/search?q=${encodeURIComponent(query)}`);
    return handleResponse(res);
  },

  async getStats(): Promise<{ success: boolean; data: StatsResponse }> {
    const res = await fetch(`${API_BASE}/chat/stats`);
    return handleResponse(res);
  },

  async deleteConversation(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/chat/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },
};
