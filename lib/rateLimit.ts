/**
 * Rate limiting simple en memoria, por IP.
 *
 * Suficiente para una web de casamiento (poco tráfico, una sola instancia).
 * Evita que alguien mande cientos de envíos en pocos segundos.
 *
 * Nota: al ser en memoria, se reinicia con cada deploy y no se comparte entre
 * instancias. Para algo más robusto se usaría Upstash/Redis, pero acá alcanza.
 */

const WINDOW_MS = 60_000; // 1 minuto
const MAX_REQUESTS = 5; // máximo de envíos por IP por ventana

const hits = new Map<string, number[]>();

export function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;

  const timestamps = (hits.get(ip) ?? []).filter((t) => t > windowStart);

  if (timestamps.length >= MAX_REQUESTS) {
    const retryAfter = Math.ceil((timestamps[0] + WINDOW_MS - now) / 1000);
    return { ok: false, retryAfter };
  }

  timestamps.push(now);
  hits.set(ip, timestamps);

  // Limpieza oportunista para que el Map no crezca indefinidamente.
  if (hits.size > 5000) {
    for (const [key, value] of hits) {
      const fresh = value.filter((t) => t > windowStart);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
  }

  return { ok: true, retryAfter: 0 };
}
