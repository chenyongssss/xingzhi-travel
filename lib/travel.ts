export type TravelRequest = {
  destination: string;
  origin: string;
  startDate: string;
  days: number;
  travelers: number;
  party: string;
  childAge: string;
  transport: string;
  roomMode: "auto" | "private" | "shared";
  interests: string[];
  diet: string;
  pace: string;
  totalBudget: number;
};

export type StayPlan = { label: string; rooms: number; guestsPerRoom: number; pricePerRoom: number; note: string };
export type BudgetLine = { key: string; label: string; amount: number; formula: string; detail: string; source: "估算" | "实时" };
export type BudgetTier = { id: "save" | "balanced" | "comfort"; label: string; total: number; lines: BudgetLine[]; stay: StayPlan };
export type DayPlan = { day: number; theme: string; morning: string; lunch: string; afternoon: string; dinner: string; evening: string; foodRecommendation?: string; transit: string; checkins: string[]; booking: string; caution: string; backup: string; spend: number };
export type Itinerary = { summary: string; weather: string; bookingChecklist: string[]; avoid: string[]; foodList: string[]; stayArea: string; sourceNote: string; days: DayPlan[] };
export type SourceLink = { label: string; url: string };
export type DestinationProfile = { completeness: "verified" | "basic"; verifiedAt: string; sources: SourceLink[]; bookingHint: string; stayArea: string; budgetFactor: number };
export type LiveQuote = { category: "hotel" | "ticket" | "transport"; amount: number; currency: "CNY"; validFor: string; provider: string; status: "live" | "estimate" };
export interface QuoteProvider { name: string; getQuotes(request: TravelRequest): Promise<LiveQuote[]>; }
export const quoteProviders: QuoteProvider[] = [];

const destinations: Record<string, string[]> = {
  "北京": ["北京"], "上海": ["上海"], "天津": ["天津"], "重庆": ["重庆"], "河北": ["秦皇岛", "承德", "保定", "张家口", "邯郸"], "山西": ["太原", "大同", "平遥", "忻州", "临汾"], "内蒙古": ["呼和浩特", "呼伦贝尔", "鄂尔多斯", "阿拉善"], "辽宁": ["大连", "沈阳", "丹东", "盘锦", "本溪"], "吉林": ["长春", "吉林市", "延吉", "长白山"], "黑龙江": ["哈尔滨", "漠河", "牡丹江", "伊春"], "江苏": ["南京", "苏州", "无锡", "扬州", "常州", "连云港"], "浙江": ["杭州", "宁波", "温州", "绍兴", "嘉兴", "舟山", "湖州"], "安徽": ["黄山", "合肥", "宏村", "池州", "宣城"], "福建": ["厦门", "福州", "泉州", "漳州", "武夷山", "平潭"], "江西": ["南昌", "景德镇", "婺源", "庐山", "上饶"], "山东": ["青岛", "济南", "威海", "烟台", "泰安", "日照"], "河南": ["郑州", "洛阳", "开封", "安阳", "焦作"], "湖北": ["武汉", "宜昌", "恩施", "襄阳", "十堰"], "湖南": ["长沙", "张家界", "凤凰", "郴州", "衡阳"], "广东": ["广州", "深圳", "珠海", "汕头", "佛山", "潮州", "惠州"], "广西": ["桂林", "阳朔", "南宁", "北海", "柳州", "崇左"], "海南": ["三亚", "海口", "万宁", "陵水", "儋州"], "四川": ["成都", "九寨沟", "乐山", "都江堰", "稻城", "甘孜", "阿坝"], "贵州": ["贵阳", "荔波", "安顺", "黔东南", "遵义"], "云南": ["昆明", "大理", "丽江", "香格里拉", "西双版纳", "腾冲"], "西藏": ["拉萨", "林芝", "日喀则", "阿里"], "陕西": ["西安", "延安", "华山", "汉中", "榆林"], "甘肃": ["兰州", "敦煌", "张掖", "甘南", "天水"], "青海": ["西宁", "青海湖", "茶卡", "海西"], "宁夏": ["银川", "中卫", "吴忠"], "新疆": ["乌鲁木齐", "喀什", "伊犁", "阿勒泰", "吐鲁番", "库尔勒"]
};

export const provinces = Object.keys(destinations);
export const citiesFor = (province: string) => destinations[province] ?? [];
export const allCities = Object.values(destinations).flat();

const verifiedSources: Record<string, SourceLink> = {
  "北京": { label: "北京市人民政府", url: "https://www.beijing.gov.cn/" }, "上海": { label: "上海市人民政府", url: "https://www.shanghai.gov.cn/" }, "杭州": { label: "杭州市人民政府", url: "https://www.hangzhou.gov.cn/" }, "西安": { label: "西安市人民政府", url: "https://www.xa.gov.cn/" }, "成都": { label: "成都市人民政府", url: "https://www.chengdu.gov.cn/" }, "重庆": { label: "重庆市人民政府", url: "https://www.cq.gov.cn/" }, "厦门": { label: "厦门市人民政府", url: "https://www.xm.gov.cn/" }, "长沙": { label: "长沙市人民政府", url: "https://www.changsha.gov.cn/" }, "昆明": { label: "昆明市人民政府", url: "https://www.km.gov.cn/" }, "大理": { label: "大理州人民政府", url: "https://www.dali.gov.cn/" }, "三亚": { label: "三亚市人民政府", url: "https://www.sanya.gov.cn/" }, "青岛": { label: "青岛市人民政府", url: "https://www.qingdao.gov.cn/" }, "哈尔滨": { label: "哈尔滨市人民政府", url: "https://www.harbin.gov.cn/" }, "南京": { label: "南京市人民政府", url: "https://www.nanjing.gov.cn/" }, "苏州": { label: "苏州市人民政府", url: "https://www.suzhou.gov.cn/" }, "广州": { label: "广州市人民政府", url: "https://www.gz.gov.cn/" }, "深圳": { label: "深圳市人民政府", url: "https://www.sz.gov.cn/" }, "武汉": { label: "武汉市人民政府", url: "https://www.wuhan.gov.cn/" }, "洛阳": { label: "洛阳市人民政府", url: "https://www.ly.gov.cn/" }, "桂林": { label: "桂林市人民政府", url: "https://www.guilin.gov.cn/" }
};
export function destinationProfile(destination: string): DestinationProfile {
  const source = verifiedSources[destination];
  if (source) return { completeness: "verified", verifiedAt: "2026-07-16", sources: [source], bookingHint: "热门场馆、山岳与海岛项目请先通过官方页面确认预约和开放信息。", stayArea: premiumCities.has(destination) ? "优先地铁换乘站 10 分钟步行圈" : "优先市中心或交通枢纽附近", budgetFactor: premiumCities.has(destination) ? 1.22 : 1 };
  return { completeness: "basic", verifiedAt: "2026-07-16", sources: [], bookingHint: "当前为基础资料；出发前请核验官方开放、预约和交通信息。", stayArea: "优先交通枢纽或核心活动区附近", budgetFactor: 1 };
}

const premiumCities = new Set(["北京", "上海", "杭州", "三亚", "厦门", "深圳", "大理", "丽江", "青岛", "成都"]);
const beachCities = new Set(["三亚", "厦门", "青岛", "北海", "舟山", "威海", "万宁", "陵水"]);
const mountainCities = new Set(["黄山", "张家界", "九寨沟", "长白山", "华山", "武夷山", "敦煌", "稻城", "香格里拉"]);
const cityHighlights: Record<string, string[]> = {
  "成都": ["熊猫基地早场", "宽窄巷子", "东郊记忆", "九眼桥"], "杭州": ["西湖骑行", "灵隐飞来峰", "中国茶叶博物馆", "河坊街"], "西安": ["兵马俑", "陕西历史博物馆", "城墙骑行", "大唐不夜城"], "北京": ["故宫", "慕田峪长城", "国家博物馆", "景山"], "上海": ["武康路", "上海博物馆", "豫园", "外滩"], "重庆": ["山城步道", "李子坝", "三峡博物馆", "洪崖洞"], "厦门": ["鼓浪屿", "南普陀", "沙坡尾", "环岛路"], "长沙": ["湖南博物院", "岳麓山", "橘子洲", "潮宗街"], "大理": ["大理古城", "洱海生态廊道", "喜洲古镇", "苍山"], "昆明": ["翠湖", "云南省博物馆", "斗南花市", "石林"], "三亚": ["椰梦长廊", "蜈支洲岛", "亚龙湾", "南山"], "青岛": ["栈桥", "八大关", "小青岛", "台东夜市"], "哈尔滨": ["中央大街", "索菲亚教堂", "冰雪大世界", "松花江"]
};
const cityGuide: Record<string, { stayArea: string; food: string[] }> = {
  "成都": { stayArea: "春熙路／太古里：首访交通最方便；预算更友好可选建设路地铁站附近。", food: ["甜水面", "钟水饺", "川菜小馆的回锅肉", "牛油火锅"] },
  "杭州": { stayArea: "湖滨适合看西湖；武林广场地铁站附近更兼顾性价比与通勤。", food: ["片儿川", "葱包桧", "杭帮菜里的东坡肉", "定胜糕"] },
  "西安": { stayArea: "钟楼／南门：城内景点集中；大雁塔地铁站附近适合夜游。", food: ["肉丸胡辣汤", "油泼面", "小炒泡馍", "甑糕"] },
  "北京": { stayArea: "前门／东直门：地铁方便，分别适合城内游与机场线接驳。", food: ["豆汁配焦圈", "炸酱面", "京味菜", "烤鸭"] },
  "上海": { stayArea: "人民广场／静安寺：地铁覆盖面广，适合首次到访。", food: ["生煎", "小笼包", "本帮菜", "葱油拌面"] },
  "重庆": { stayArea: "解放碑适合首次到访；观音桥住宿与夜宵选择更丰富。", food: ["重庆小面", "酸辣粉", "江湖菜", "老火锅"] },
  "厦门": { stayArea: "中山路／镇海路：去鼓浪屿和市区景点顺路；环岛路适合度假。", food: ["沙茶面", "土笋冻", "姜母鸭", "花生汤"] },
  "长沙": { stayArea: "五一广场／湘江中路：夜游和地铁最方便。", food: ["长沙米粉", "剁椒鱼头", "口味虾", "糖油粑粑"] },
  "大理": { stayArea: "大理古城南门：吃住选择多；双廊适合想看洱海日落的行程。", food: ["饵丝", "乳扇", "白族酸辣鱼", "菌菇火锅"] },
  "三亚": { stayArea: "三亚湾方便机场与市区；亚龙湾更适合海边度假。", food: ["海南粉", "椰子鸡", "清补凉", "明码标价海鲜"] },
  "青岛": { stayArea: "市南区靠近海边景点；台东适合重视餐饮与性价比。", food: ["鲅鱼水饺", "海鲜家常菜", "辣炒蛤蜊", "青岛啤酒"] },
  "哈尔滨": { stayArea: "中央大街适合短住；群力新区去冰雪大世界更顺路。", food: ["锅包肉", "红肠", "铁锅炖", "马迭尔冰棍"] },
  "昆明": { stayArea: "翠湖／南屏街：市区景点和餐饮集中，交通方便。", food: ["小锅米线", "汽锅鸡", "野生菌火锅", "鲜花饼"] }
};
function guideFor(destination: string) { return cityGuide[destination] ?? { stayArea: "优先选择市中心或交通枢纽地铁站 10 分钟步行圈，兼顾晚间用餐与返程。", food: ["当地早餐", "本地特色面食／米粉", "口碑家常菜", "夜市小吃"] }; }

function seasonFactor(date?: string) {
  if (!date) return 1;
  const month = new Date(`${date}T12:00:00`).getMonth() + 1;
  return [5, 7, 8, 10].includes(month) ? 1.18 : [1, 2, 4, 11, 12].includes(month) ? 1.08 : 1;
}

export function recommendedStay(input: Pick<TravelRequest, "travelers" | "party" | "roomMode">, roomPrice: number): StayPlan {
  const { travelers, party, roomMode } = input;
  if (roomMode === "private" || travelers === 1) return { label: travelers === 1 ? "1 间单人房" : `${travelers} 间单人房`, rooms: travelers, guestsPerRoom: 1, pricePerRoom: Math.round(roomPrice * 0.9), note: "独立入住，适合重视私密性或作息不同的同行者。" };
  if (party === "亲子" && travelers <= 3) return { label: "1 间亲子／家庭房", rooms: 1, guestsPerRoom: travelers, pricePerRoom: Math.round(roomPrice * 1.25), note: "默认一间家庭房；若孩子年龄较大，可在生成后改为两间双床房。" };
  const occupancy = roomMode === "shared" ? Math.min(4, travelers) : 2;
  const rooms = Math.ceil(travelers / occupancy);
  const label = occupancy >= 3 ? `${rooms} 间多人房` : `${rooms} 间双床／大床房`;
  return { label, rooms, guestsPerRoom: Math.ceil(travelers / rooms), pricePerRoom: roomPrice, note: occupancy >= 3 ? "按多人合住优先，保留独立床位需求的调整入口。" : "情侣默认大床房；朋友默认双床房，避免强制拼床。" };
}

export function buildBudgets(input: TravelRequest): BudgetTier[] {
  const factor = destinationProfile(input.destination).budgetFactor * seasonFactor(input.startDate);
  const nights = Math.max(1, input.days - 1);
  const transitBase = input.transport === "飞机" ? 760 : input.transport === "自驾" ? 330 : input.transport === "火车" ? 420 : 520;
  const tiers = [
    { id: "save" as const, label: "省钱", room: 168, food: 78, local: 20, tickets: 78, extra: 0.08 },
    { id: "balanced" as const, label: "平衡", room: 248, food: 125, local: 42, tickets: 135, extra: 0.1 },
    { id: "comfort" as const, label: "舒适", room: 398, food: 205, local: 86, tickets: 230, extra: 0.12 }
  ];
  return tiers.map((tier) => {
    const stay = recommendedStay(input, Math.round(tier.room * factor));
    const bigTransport = Math.round(transitBase * factor * input.travelers * (tier.id === "save" ? 0.82 : tier.id === "comfort" ? 1.35 : 1));
    const hotel = stay.pricePerRoom * stay.rooms * nights;
    const food = Math.round(tier.food * input.days * input.travelers * (input.diet.includes("忌口") ? 1.08 : 1));
    const local = Math.round(tier.local * input.days * input.travelers * (beachCities.has(input.destination) || mountainCities.has(input.destination) ? 1.3 : 1));
    const ticket = Math.round(tier.tickets * Math.max(1, input.days - 1) * input.travelers * (mountainCities.has(input.destination) ? 1.25 : 1));
    const subtotal = bigTransport + hotel + food + local + ticket;
    const reserve = Math.round(subtotal * tier.extra);
    const lines: BudgetLine[] = [
      { key: "big", label: "往返大交通", amount: bigTransport, formula: `¥${Math.round(bigTransport / input.travelers)}/人`, detail: `${input.origin || "出发地"}往返${input.destination}的${input.transport}参考价；尚未接入授权报价时按城市区间估算。`, source: "估算" },
      { key: "hotel", label: "住宿", amount: hotel, formula: `${stay.rooms}间 × ¥${stay.pricePerRoom} × ${nights}晚`, detail: `${stay.label}；人均 ¥${Math.round(hotel / input.travelers)}。${stay.note}`, source: "估算" },
      { key: "food", label: "餐饮", amount: food, formula: `¥${Math.round(food / input.days / input.travelers)}/人/天`, detail: tier.id === "save" ? "早餐便利店／小吃，午晚餐本地餐馆或面馆；不包含高价排队网红店。" : tier.id === "balanced" ? "一顿特色正餐＋两顿日常餐食，可安排咖啡或甜品。" : "含品质正餐、特色体验餐和舒适休息时段。", source: "估算" },
      { key: "ticket", label: "门票与预约", amount: ticket, formula: `约¥${Math.round(ticket / input.travelers)}/人`, detail: "按核心景点、讲解或必要预约计算；免费博物馆按预约而非门票计入。", source: "估算" },
      { key: "local", label: "市内交通", amount: local, formula: `¥${Math.round(local / input.days / input.travelers)}/人/天`, detail: tier.id === "save" ? "地铁／公交＋必要短途步行。" : tier.id === "balanced" ? "公共交通为主，晚间或携行李时适量打车。" : "含更多点对点打车或包车衔接。", source: "估算" },
      { key: "reserve", label: "预留金", amount: reserve, formula: `${Math.round(tier.extra * 100)}%缓冲`, detail: "用于天气调整、临时行李寄存、候补预约或价格波动；未使用即不花。", source: "估算" }
    ];
    return { id: tier.id, label: tier.label, total: subtotal + reserve, lines, stay };
  });
}

export function buildItinerary(input: TravelRequest): Itinerary {
  const highlights = cityHighlights[input.destination] ?? ["城市核心文化街区", "当地博物馆或展馆", "代表性景观", "夜间街区慢游"];
  const guide = guideFor(input.destination);
  const food = guide.food;
  const balancedTotal = buildBudgets(input)[1].total;
  const dayWeights = Array.from({ length: input.days }, (_, index) => {
    if (index === 0) return 0.74;
    if (index === input.days - 1) return 0.82;
    if (mountainCities.has(input.destination)) return index % 2 ? 1.35 : 1.14;
    if (beachCities.has(input.destination)) return index % 2 ? 1.27 : 1.08;
    return index % 3 === 1 ? 1.22 : 1.02;
  });
  const weightSum = dayWeights.reduce((sum, weight) => sum + weight, 0);
  let allocated = 0;
  const dailySpends = dayWeights.map((weight, index) => {
    if (index === input.days - 1) return balancedTotal - allocated;
    const amount = Math.round((balancedTotal * weight) / weightSum);
    allocated += amount;
    return amount;
  });
  const days = Array.from({ length: input.days }, (_, index) => {
    const place = highlights[index % highlights.length];
    const next = highlights[(index + 1) % highlights.length];
    const last = highlights[(index + 2) % highlights.length];
    const isArrival = index === 0;
    const isLast = index === input.days - 1;
    const backup = isArrival
      ? `若抵达晚于计划，把${next}留到明早；今晚只在住宿区附近吃饭散步，别赶行程。`
      : isLast
        ? `若返程时间提前，放弃${next}的深度停留，改在住宿区附近吃一顿早饭后直接取行李出发。`
        : index % 3 === 1
          ? `如果${place}排队超过 40 分钟，先去${next}的免费街区或展馆，把主景点调到傍晚再试。`
          : `遇雨或体力下降时，用${next}附近的室内展馆、书店或咖啡店替换户外段，打卡点等天气转好再去。`;
    return {
      day: index + 1,
      theme: isArrival ? "抵达与熟悉街区" : isLast ? "从容收尾" : `围绕${place}深度体验`,
      morning: isArrival ? `抵达后寄存行李，先来一份${food[(index + 3) % food.length]}再办理入住` : `08:30 出发前吃${food[(index + 3) % food.length]}，再优先游览${place}`,
      lunch: `12:00 在${place}步行 10 分钟范围内吃${food[index % food.length]}`,
      afternoon: isLast ? `预留返程前 2 小时，逛${next}并取行李` : `14:00 前往${next}，只保留一个核心场馆／景观`,
      dinner: `18:00 选择${food[(index + 1) % food.length]}，避开景区门口高溢价餐厅`,
      foodRecommendation: `早餐：${food[(index + 3) % food.length]} · 午餐：${food[index % food.length]} · 晚餐：${food[(index + 1) % food.length]}`,
      evening: isLast ? "前往车站／机场，按大交通提前抵达" : `19:30 ${last}夜间打卡，21:00 前返回住宿区`,
      transit: `住宿区 → ${place} → ${next}：优先地铁／公交；累计步行控制在 8–12 公里。`,
      checkins: [place, next],
      booking: index === 0 ? "出发前确认核心景点预约；未约到则直接启用备选。" : "如需讲解、船票或热门时段，至少提前 3–7 天核验官方规则。",
      caution: "不把跨城景点与市区场馆塞进同一天；遇高温、雨雪或排队超 40 分钟即切换备选。",
      backup,
      spend: dailySpends[index]
    };
  });
  return {
    summary: `${input.party} ${input.travelers} 人，${input.days} 天 ${input.destination}自由行。以${input.pace}节奏安排，每日只保留 2 个核心停留点，避免重复和折返。`,
    weather: input.startDate ? "请在出发前 72 小时复核目的地天气、预警和景区开放状态。" : "填写出行日期后将叠加旺淡季与天气提醒。",
    bookingChecklist: ["核心景点官方预约", "往返大交通座位／航班", "首晚住宿与入住时间", "当地交通卡或机场／车站接驳"],
    avoid: ["不通过陌生人购买低价票或讲解", "不接受未明码标价的包车与海鲜加工", "景点周边餐饮先确认份量与服务费"],
    foodList: food,
    stayArea: guide.stayArea,
    sourceNote: destinationProfile(input.destination).completeness === "verified" ? "已核验目的地资料，预约与开放状态仍须以官方页面当日信息为准；核验日期：2026-07-16。" : "基础目的地资料，未提供具体预约结论；出发前请核验官方开放、预约和交通信息；核验日期：2026-07-16。",
    days
  };
}

export function normalizeItinerary(value: Itinerary): Itinerary {
  const used = new Set<string>();
  return { ...value, days: value.days.map((day) => ({ ...day, checkins: day.checkins.filter((item) => { const key = item.trim(); if (used.has(key)) return false; used.add(key); return true; }) })) };
}
