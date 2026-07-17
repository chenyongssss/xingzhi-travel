declare module "cloudflare:workers" {
  export const env: Record<string, unknown>;
}

interface Fetcher {
  fetch(request: Request): Promise<Response>;
}

interface D1Database {}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}
