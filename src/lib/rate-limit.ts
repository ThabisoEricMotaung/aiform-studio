const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

/**
 * In-memory only — resets on cold start and isn't shared across serverless
 * instances. Paired with the honeypot + timing check in the inquiries route,
 * this is deliberately lightweight rather than a hard guarantee; upgrade to
 * a shared store (e.g. Redis) if abuse becomes a real problem.
 */
const hits = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, recent);
    return false;
  }

  recent.push(now);
  hits.set(key, recent);
  return true;
}
