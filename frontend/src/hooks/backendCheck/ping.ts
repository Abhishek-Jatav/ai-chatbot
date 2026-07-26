const API_BASE = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api`;

export async function pingBackend(): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const res = await fetch(`${API_BASE}/ping`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`Ping failed: ${res.status}`);
    }

    return true;
  } catch (error: any) {
    if (error.name === "AbortError") {
      throw new Error("Backend timeout");
    }

    throw new Error("Backend unreachable");
  } finally {
    clearTimeout(timeoutId);
  }
}
