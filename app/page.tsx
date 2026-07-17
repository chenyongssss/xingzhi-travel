"use client";

import { useEffect, useMemo, useState } from "react";
import { allCities, buildBudgets, buildItinerary, citiesFor, destinationProfile, provinces, recommendedStay, type BudgetTier, type Itinerary, type TravelRequest } from "@/lib/travel";

const interests = ["在地美食", "经典景点", "博物馆人文", "自然风光", "亲子轻松", "拍照打卡"];
const today = new Date().toISOString().slice(0, 10);
const issuesUrl = process.env.NEXT_PUBLIC_GITHUB_ISSUES_URL || "#feedback";
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
type PlanResponse = { itinerary: Itinerary; mode: "ai" | "fallback" | "limit"; sourceStatus?: "verified" | "basic" };

export default function Page() {
  const [province, setProvince] = useState("四川");
  const [input, setInput] = useState<TravelRequest>({ destination: "成都", origin: "上海", startDate: today, days: 4, travelers: 2, party: "情侣", childAge: "", transport: "火车", roomMode: "auto", interests: ["在地美食", "经典景点"], diet: "无特殊忌口", pace: "舒适不赶路", totalBudget: 5000 });
  const [tier, setTier] = useState<BudgetTier["id"]>("balanced");
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const budgets = useMemo(() => buildBudgets(input), [input]);
  const activeBudget = budgets.find((item) => item.id === tier) ?? budgets[1];
  const stay = recommendedStay(input, activeBudget.stay.pricePerRoom);
  const profile = destinationProfile(input.destination);
  const budgetGap = input.totalBudget ? input.totalBudget - activeBudget.total : 0;
  const set = <K extends keyof TravelRequest>(key: K, value: TravelRequest[K]) => setInput((current) => ({ ...current, [key]: value }));
  useEffect(() => {
    if (!turnstileSiteKey) return;
    const render = () => (window as Window & { turnstile?: { render: (target: string, options: { sitekey: string; callback: (token: string) => void }) => void } }).turnstile?.render("#turnstile", { sitekey: turnstileSiteKey, callback: setTurnstileToken });
    const script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; script.onload = render; document.head.appendChild(script);
    return () => script.remove();
  }, []);

  async function generate(replaceDay?: number) {
    setLoading(true); setNotice(replaceDay ? `正在重排第 ${replaceDay} 天，其他日程尽量不动。` : "正在把路线、预算和预约提醒拼成一份旅行单。");
    try {
      const response = await fetch("/api/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...input, turnstileToken, replaceDay, previousItinerary: replaceDay ? itinerary : undefined }) });
      if (!response.ok) throw new Error("plan request failed");
      const data = await response.json() as PlanResponse;
      setItinerary(data.itinerary);
      setNotice(data.mode === "ai" ? "新方案已生成：路线、吃喝和节奏都已重新校对。" : "旅行单已经准备好，来看看每天怎么走、吃什么。 ");
    } catch {
      setItinerary(buildItinerary(input));
      setNotice("旅行单已经准备好，来看看每天怎么走、吃什么。 ");
    } finally {
      setLoading(false); setTimeout(() => document.getElementById("plan")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    }
  }
  function toggleInterest(item: string) { set("interests", input.interests.includes(item) ? input.interests.filter((value) => value !== item) : [...input.interests, item]); }
  function copyChecklist() {
    if (!itinerary) return;
    const text = [`${input.destination} ${input.days} 天旅行清单`, `住宿：${itinerary.stayArea}`, `预约：${itinerary.bookingChecklist.join("；")}`, `预算：${activeBudget.label} ¥${activeBudget.total}`, ...itinerary.days.map((day) => `Day ${day.day} ${day.theme}：${day.morning}；${day.afternoon}；${day.dinner}`)].join("\n");
    navigator.clipboard?.writeText(text); setNotice("行前清单已复制，可以直接发给同行的人。");
  }
  return <main>
    <nav className="nav wrap"><a className="brand" href="#top"><span>行</span>知旅行</a><div className="nav-links"><a href="#planner">做攻略</a><a href="#budget">预算参考</a><a href="#library">城市资料</a></div><button className="quiet-button" onClick={() => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" })}>开始规划 →</button></nav>
    <header className="hero wrap" id="top"><div><p className="eyebrow">PERSONAL TRAVEL PLANNER · 150+ DESTINATIONS</p><h1><em>现在出发！</em><br />把旅行过成<br />你喜欢的样子。</h1><div className="hero-pills"><span>✓ 路线不绕路</span><span>✓ 预算看得懂</span><span>✓ 官方信息可核验</span></div><button className="primary hero-cta" onClick={() => document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" })}>帮我做攻略 <b>→</b></button></div><aside className="hero-card"><p className="card-label"><i /> 这份攻略里有</p><h2>住得舒服，吃得开心，<br />走得不累。</h2><div className="hero-route"><span>出发地</span><i /><span>目的地</span><i /><span>每日安排</span></div><div className="hero-alert"><b>✓</b><span>资料有出处，预算有口径<br />出发前，心里更有底</span></div></aside></header>

    <section className="planner-section" id="planner"><div className="wrap"><div className="section-copy"><div><p className="eyebrow">STEP 01 · START HERE</p><h2>说说你的旅行，<br /><em>剩下的交给我。</em></h2></div><p>不需要注册。生成后可以保存 PDF、复制清单，或用自己的地图继续导航。</p></div><div className="planner-shell">
      <details className="form-section" open><summary><span>01</span><h3>目的地与日期</h3><small>从哪出发，什么时候走</small></summary><div className="form-grid"><Field label="出发城市"><input value={input.origin} onChange={(e) => set("origin", e.target.value)} /></Field><Field label="出行日期"><input type="date" min={today} value={input.startDate} onChange={(e) => set("startDate", e.target.value)} /></Field><Field label="省份／地区"><select value={province} onChange={(e) => { setProvince(e.target.value); set("destination", citiesFor(e.target.value)[0] ?? ""); }}>{provinces.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="热门城市"><select value={citiesFor(province).includes(input.destination) ? input.destination : ""} onChange={(e) => set("destination", e.target.value)}><option value="">选择城市</option>{citiesFor(province).map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="或直接输入目的地" wide><input list="cities" value={input.destination} onChange={(e) => set("destination", e.target.value)} placeholder="支持输入城市、县市或景区" /><datalist id="cities">{allCities.map((item) => <option key={item} value={item} />)}</datalist></Field></div></details>
      <details className="form-section"><summary><span>02</span><h3>同行与住宿</h3><small>自动匹配房型和间数</small></summary><div className="form-grid"><Field label="停留天数"><select value={input.days} onChange={(e) => set("days", Number(e.target.value))}>{[2,3,4,5,6,7,8,10].map((item) => <option key={item} value={item}>{item} 天</option>)}</select></Field><Field label="同行人数"><select value={input.travelers} onChange={(e) => set("travelers", Number(e.target.value))}>{[1,2,3,4,5,6,7,8].map((item) => <option key={item} value={item}>{item} 人</option>)}</select></Field><Field label="同行关系"><select value={input.party} onChange={(e) => set("party", e.target.value)}>{["独自出发","情侣","朋友","亲子","父母同行","多人小团"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="住宿偏好"><select value={input.roomMode} onChange={(e) => set("roomMode", e.target.value as TravelRequest["roomMode"])}><option value="auto">自动推荐</option><option value="shared">优先合住省钱</option><option value="private">独立入住</option></select></Field></div><div className="stay-preview"><b>自动推荐</b><span>{stay.label}</span><i />每间约住 {stay.guestsPerRoom} 人<i />{stay.note}</div></details>
      <details className="form-section"><summary><span>03</span><h3>预算与偏好</h3><small>预算会参与方案判断</small></summary><div className="form-grid"><Field label="总预算（全员，元）"><input type="number" min="0" step="100" value={input.totalBudget} onChange={(e) => set("totalBudget", Math.max(0, Number(e.target.value) || 0))} /></Field><Field label="大交通"><select value={input.transport} onChange={(e) => set("transport", e.target.value)}>{["火车","飞机","自驾","灵活比价"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="旅行节奏"><select value={input.pace} onChange={(e) => set("pace", e.target.value)}>{["轻松慢游","舒适不赶路","经典打卡","高效深度游"].map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="饮食偏好"><input value={input.diet} onChange={(e) => set("diet", e.target.value)} placeholder="例如：无辣、素食、海鲜过敏" /></Field></div><div className="interest-picker"><span>想重点体验什么？</span>{interests.map((item) => <button type="button" className={input.interests.includes(item) ? "selected" : ""} key={item} onClick={() => toggleInterest(item)}>{input.interests.includes(item) ? "✓ " : "+ "}{item}</button>)}</div></details>
      <div className="planner-bottom"><div><b>预算只是参考，最终以你自己核验的页面为准</b><span>没有实时票价，也不会跳转下单。</span><div id="turnstile" /></div><button className="primary" onClick={() => generate()} disabled={loading || Boolean(turnstileSiteKey && !turnstileToken)}>{loading ? "正在排出发清单…" : "生成我的旅行攻略"}<b>→</b></button></div></div></div></section>

    <section className="budget-section" id="budget"><div className="wrap"><div className="section-header"><div><p className="eyebrow">STEP 02 · BUDGET REFERENCE</p><h2>钱不只是一串数字。<br />每一项都有去处。</h2></div><p>按目的地、人数、房型、出行日期与交通方式计算。它是规划口径，不代表实时库存、票价或可预订价格。</p></div><div className="tier-tabs">{budgets.map((item) => <button key={item.id} className={tier === item.id ? "active" : ""} onClick={() => setTier(item.id)}><span>{item.label}</span><b>¥{item.total.toLocaleString()}</b><small>全员总预算</small></button>)}</div><div className="budget-layout"><article className="budget-feature"><p>当前选择</p><h3>{activeBudget.label}自由行</h3><strong>¥{activeBudget.total.toLocaleString()}</strong><span>人均 ¥{Math.round(activeBudget.total / input.travelers).toLocaleString()}</span><hr /><b>{budgetGap >= 0 ? `比你的预算少 ¥${budgetGap.toLocaleString()}` : `超出你的预算 ¥${Math.abs(budgetGap).toLocaleString()}`}</b><p>{budgetGap < 0 ? "优先切换省钱档、减少高价门票或调整房型，再决定是否缩短天数。" : "这部分余量可留给临时交通、排队替代方案或一顿想吃的特色餐。"}</p><div className="quote-note"><i /> 旅行预算参考<br />资料核验：2026-07-16</div></article><div className="budget-lines">{activeBudget.lines.map((line) => <article key={line.key}><div><span>{line.label}</span><b>¥{line.amount.toLocaleString()}</b><small>{line.formula}</small></div><p>{line.detail}</p><em>参考</em></article>)}</div></div></div></section>

    {itinerary && <section className="plan-section" id="plan"><div className="wrap"><div className="plan-top"><div><p className="eyebrow">YOUR TRAVEL NOTE</p><h2>{input.destination} · {input.days} 天自由行</h2><p>{itinerary.summary}</p></div><button className="quiet-button" onClick={() => generate()}>重新生成 →</button></div>{notice && <div className="notice">✦ {notice}</div>}<div className="export-bar"><button className="primary" onClick={() => window.print()}>打印／保存 PDF</button><button className="quiet-button bordered" onClick={copyChecklist}>复制行前清单</button></div><div className="plan-overview"><article><span>推荐住宿区域</span><b>{itinerary.stayArea}</b></article><article><span>预约清单</span><b>{itinerary.bookingChecklist.slice(0, 2).join(" · ")}</b></article><article><span>行前提醒</span><b>{itinerary.weather}</b></article></div><div className="day-list">{itinerary.days.map((day) => { const mapUrl = `https://ditu.amap.com/search?query=${encodeURIComponent(`${input.destination} ${day.checkins.join(" ")}`)}`; return <article className="day-card" key={day.day}><aside><span>DAY</span><strong>{String(day.day).padStart(2, "0")}</strong><i /><small>约 ¥{day.spend}/天</small></aside><div className="day-body"><div className="day-head"><h3>{day.theme}</h3><div><a href={mapUrl} target="_blank" rel="noreferrer">地图查看</a><button onClick={() => generate(day.day)} disabled={loading}>替换这一天</button></div></div><div className="schedule"><p><b>上午</b>{day.morning}</p><p><b>午餐</b>{day.lunch}</p><p><b>下午</b>{day.afternoon}</p><p><b>晚餐</b>{day.dinner}</p><p><b>夜间</b>{day.evening}</p></div><div className="day-notes"><span><b>美食推荐</b>{day.foodRecommendation || `${day.lunch}；${day.dinner}`}</span><span><b>交通</b>{day.transit}</span><span><b>打卡</b>{day.checkins.join(" · ") || "将替换为附近备选"}</span><span><b>预约</b>{day.booking}</span><span><b>注意</b>{day.caution}</span></div><div className="backup"><b>PLAN B</b>{day.backup}</div></div></article>; })}</div><div className="closing-grid"><article><span>避坑提醒</span>{itinerary.avoid.map((item) => <p key={item}>! {item}</p>)}</article><article><span>推荐美食</span>{itinerary.foodList.map((item) => <p key={item}>· {item}</p>)}</article><article><span>资料说明</span><p>{itinerary.sourceNote}</p></article></div></div></section>}
    <section className="library" id="library"><div className="wrap"><p className="eyebrow">DESTINATION LIBRARY</p><h2>约 150 个热门目的地，<br />资料完整度一眼看懂。</h2><p>{profile.completeness === "verified" ? `${input.destination} 已核验：` : `${input.destination} 为基础资料：`} {profile.bookingHint}</p>{profile.sources.length > 0 && <div className="source-links">{profile.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer">官方资料：{source.label} ↗</a>)}</div>}<div className="library-stats"><span><b>{allCities.length}</b> 个目的地</span><span><b>20</b> 个优先核验城市</span><span><b>持续</b> 人工更新</span></div></div></section><footer id="feedback"><div className="wrap footer-inner"><a className="brand" href="#top"><span>行</span>知旅行</a><p>个人旅行规划工具 · 信息仅供参考，请在出发前自行核验。</p><a className="quiet-button" href={issuesUrl} target={issuesUrl.startsWith("http") ? "_blank" : undefined} rel="noreferrer">资料纠错与建议 →</a></div></footer>
  </main>;
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: React.ReactNode }) { return <label className={wide ? "wide" : ""}><span>{label}</span>{children}</label>; }
