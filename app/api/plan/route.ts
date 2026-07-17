import { clientKey, validTravelRequest, withinRateLimit } from "@/lib/request-guard";
import { buildItinerary, normalizeItinerary, type Itinerary, type TravelRequest } from "@/lib/travel";

type PlanRequest = TravelRequest & {
  turnstileToken?: string;
  replaceDay?: number;
  previousItinerary?: Itinerary;
};

async function verifyTurnstile(token: unknown, remoteIp: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set("remoteip", remoteIp);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  return response.ok && Boolean((await response.json() as { success?: boolean }).success);
}

export async function POST(request: Request) {
  const raw = await request.json().catch(() => null);
  if (!validTravelRequest(raw)) return Response.json({ error: "请检查目的地、天数与同行人数后重试。" }, { status: 400 });
  const input = raw as PlanRequest;
  if (!await verifyTurnstile(input.turnstileToken, request.headers.get("cf-connecting-ip"))) return Response.json({ error: "安全校验未完成，请刷新后重试。" }, { status: 403 });
  const fallback = normalizeItinerary(buildItinerary(input));
  const previous = input.previousItinerary;
  const replaceDay = Number.isInteger(input.replaceDay) ? input.replaceDay : null;
  const keepOtherDays = (next: Itinerary) => replaceDay && previous?.days?.length === input.days ? { ...next, days: next.days.map((day, index) => index === replaceDay - 1 ? day : previous.days[index] ?? day) } : next;
  const aiAllowed = request.headers.get("x-xingzhi-ai-allowed") !== "0" && withinRateLimit(clientKey(request));
  const baseUrl = process.env.AI_BASE_URL; const apiKey = process.env.AI_API_KEY; const model = process.env.AI_MODEL;
  if (!baseUrl || !apiKey || !model) return Response.json({ itinerary: keepOtherDays(fallback), mode: "fallback" });
  if (!aiAllowed) return Response.json({ itinerary: keepOtherDays(fallback), mode: "limit" });
  try {
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 12000);
    const replacementInstruction = replaceDay ? `只重排第 ${replaceDay} 天，其余天数保持用户给出的 previousItinerary 不变；替换日不得重复已有景点与餐厅。` : "生成完整行程。";
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, { method: "POST", signal: controller.signal, headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model, temperature: 0.35, response_format: { type: "json_object" }, messages: [{ role: "system", content: `你是中国自由行规划师。只返回 JSON，字段必须符合 itinerary：summary, weather, bookingChecklist, avoid, foodList, stayArea, sourceNote, days。住宿必须给出具体区域与适合原因；每一天必须提供 foodRecommendation，包含早餐、午餐、晚餐各一条具体当地菜品或可信的店铺建议。若无法确认店铺，不得编造店名，应写清菜品与推荐区域。每天不得重复景点或餐厅；同日按区域安排，不得臆造实时票价或开放规则。每天的 Plan B 必须对应当天路线、天气或时段，不能使用相同的泛化文案。${replacementInstruction}` }, { role: "user", content: JSON.stringify({ input, previousItinerary: previous }) }] }) });
    clearTimeout(timeout);
    if (!response.ok) throw new Error("model request failed");
    const data = await response.json() as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    const generated = content ? normalizeItinerary(JSON.parse(content) as Itinerary) : null;
    const itinerary = generated ? {
      ...fallback,
      ...generated,
      days: fallback.days.map((day, index) => ({
        ...day,
        ...(generated.days[index] ?? {}),
        spend: day.spend,
        backup: generated.days[index]?.backup?.trim() || day.backup,
        foodRecommendation: generated.days[index]?.foodRecommendation || day.foodRecommendation
      }))
    } : fallback;
    return Response.json({ itinerary: keepOtherDays(itinerary), mode: "ai" }, { headers: { "x-xingzhi-ai-success": "1" } });
  } catch { return Response.json({ itinerary: keepOtherDays(fallback), mode: "fallback" }); }
}
