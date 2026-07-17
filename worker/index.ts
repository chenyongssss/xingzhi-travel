/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  RATE_LIMIT?: KVNamespace;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

async function dailyKey(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0] ?? "anonymous";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip));
  const hash = Array.from(new Uint8Array(digest)).map((value) => value.toString(16).padStart(2, "0")).join("");
  return `ai:${new Date().toISOString().slice(0, 10)}:${hash}`;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname !== "/api/plan" || request.method !== "POST" || !env.RATE_LIMIT) return handler.fetch(request, env, ctx);
    const key = await dailyKey(request);
    const used = Number(await env.RATE_LIMIT.get(key) ?? "0");
    const headers = new Headers(request.headers);
    headers.set("x-xingzhi-ai-allowed", used < 3 ? "1" : "0");
    const response = await handler.fetch(new Request(request, { headers }), env, ctx);
    if (response.headers.get("x-xingzhi-ai-success") === "1") ctx.waitUntil(env.RATE_LIMIT.put(key, String(used + 1), { expirationTtl: 60 * 60 * 30 }));
    return response;
  },
};

export default worker;
