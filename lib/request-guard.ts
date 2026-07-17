import type { TravelRequest } from "@/lib/travel";

const requests = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 6;

export function clientKey(request: Request) { return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"; }
export function withinRateLimit(key: string) {
  const now = Date.now(); const recent = (requests.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now); requests.set(key, recent); return true;
}
export function validTravelRequest(input: unknown): input is TravelRequest {
  if (!input || typeof input !== "object") return false;
  const value = input as Partial<TravelRequest>;
  return typeof value.destination === "string" && value.destination.trim().length > 0 && typeof value.origin === "string" && typeof value.startDate === "string" && Number.isInteger(value.days) && value.days >= 2 && value.days <= 10 && Number.isInteger(value.travelers) && value.travelers >= 1 && value.travelers <= 8 && Array.isArray(value.interests) && typeof value.party === "string" && typeof value.transport === "string" && typeof value.roomMode === "string" && typeof value.diet === "string" && typeof value.pace === "string";
}
