const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  let data: any = null;

  try {
    data = await res.json();
  } catch {}

  if (!res.ok) {
    throw new Error(
      data?.message || data?.error || `Request failed (${res.status})`,
    );
  }

  return data;
}

export const api = {
  ask(question: string) {
    return request("/chat", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  },

  async askStream(
    question: string,
    onChunk: (chunk: string) => void,
    onComplete: (id: string) => void,
    onError: (message: string) => void,
  ) {
    try {
      const response = await fetch(`${BASE_URL}/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Unable to connect.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let savedId = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value);

        const lines = chunk.split("\n").filter(Boolean);

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;

          const payload = line.replace("data:", "").trim();

          try {
            const parsed = JSON.parse(payload);

            if (parsed.chunk) {
              onChunk(parsed.chunk);
            }

            if (parsed.id) {
              savedId = parsed.id;
            }

            if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch {}
        }
      }

      onComplete(savedId);
    } catch (err: any) {
      onError(err.message || "Streaming failed.");
    }
  },

  deleteConversation(id: string) {
    return request(`/history/${id}`, {
      method: "DELETE",
    });
  },

  getHistory(page = 1, limit = 15) {
    return request(`/history?page=${page}&limit=${limit}`);
  },

  searchHistory(query: string) {
    return request(`/history/search?q=${encodeURIComponent(query)}`);
  },

  getStats() {
    return request("/history/stats");
  },
};
