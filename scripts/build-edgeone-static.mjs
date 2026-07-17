import { copyFileSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = join(process.cwd(), "out");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const asset of ["og.png", "favicon.svg"]) {
  const source = join(process.cwd(), "public", asset);
  if (existsSync(source)) copyFileSync(source, join(outDir, asset));
}

const html = String.raw`<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>行知旅行｜自由行规划工具</title>
  <meta name="description" content="输入目的地、人数、预算和偏好，生成自由行路线、预算、美食、住宿区域和行前清单。" />
  <meta property="og:title" content="行知旅行｜自由行规划工具" />
  <meta property="og:description" content="输入目的地、人数、预算和偏好，生成可打印的自由行路线、预算、美食和住宿建议。" />
  <meta property="og:image" content="./og.png" />
  <style>
    :root{--ink:#182b26;--muted:#66756f;--paper:#f8f5ed;--cream:#eee7d8;--orange:#ef653b;--green:#194f44;--line:#d9d3c5}
    *{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:Arial,"Microsoft YaHei",sans-serif}button,input,select{font:inherit}button{cursor:pointer}.wrap{width:min(1160px,calc(100% - 44px));margin:auto}
    .nav{height:78px;display:flex;align-items:center;justify-content:space-between}.brand{color:var(--ink);font-size:22px;font-weight:900;text-decoration:none;letter-spacing:-.08em}.brand span{display:inline-grid;place-items:center;width:30px;height:30px;margin-right:6px;border-radius:50%;background:var(--orange);color:white;font-size:14px;letter-spacing:0}.nav-links{display:flex;gap:26px}.nav-links a{color:var(--muted);font-size:14px;text-decoration:none}.quiet{border:0;background:transparent;color:var(--ink);font-weight:800}
    .hero{display:grid;grid-template-columns:1.08fr .92fr;gap:70px;align-items:center;min-height:530px;padding:66px 0}.eyebrow{margin:0 0 13px;color:var(--orange);letter-spacing:.15em;font-size:11px;font-weight:900}.hero h1,.section h2,.plan h2{margin:0;font-size:clamp(42px,5.5vw,70px);line-height:1.04;letter-spacing:-.07em}.hero h1 em,.section h2 em{font-family:Georgia,"Songti SC",serif;color:var(--orange);font-weight:400}.intro{max-width:540px;margin:24px 0;color:var(--muted);font-size:17px;line-height:1.75}.pills{display:flex;flex-wrap:wrap;gap:9px}.pills span{border:1px solid var(--line);padding:8px 10px;color:var(--muted);font-size:12px}.primary{border:0;background:var(--orange);color:white;padding:15px 19px;font-weight:800}.hero .primary{margin-top:25px;min-width:210px}.card{background:var(--green);color:#fbf4e2;padding:30px;box-shadow:12px 14px #d8d0be}.card h2{font-family:Georgia,"Songti SC",serif;font-size:32px;line-height:1.25}.card p,.card small{color:#bdd1c7;line-height:1.7}
    .section{padding:78px 0;background:var(--cream)}.section-head{display:grid;grid-template-columns:1fr .65fr;gap:60px;align-items:end;margin-bottom:34px}.section-head h2{font-size:48px}.section-head p{color:var(--muted);line-height:1.7}.shell{background:#fffdf8;border:1px solid var(--line);box-shadow:8px 8px #d7cfbd}.form-block{padding:25px 28px;border-bottom:1px solid var(--line)}.form-block h3{margin:0 0 18px;font-size:18px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}.field span{display:block;margin-bottom:8px;color:var(--muted);font-size:12px;font-weight:800}.field input,.field select{width:100%;border:0;border-bottom:1px solid var(--line);background:white;padding:10px 4px}.wide{grid-column:span 2}.chips{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.chips button{border:1px solid var(--line);background:#fffdf8;color:var(--muted);font-size:12px;padding:7px 9px}.chips button.on{border-color:var(--orange);background:#fff0e9;color:var(--orange);font-weight:800}.bottom{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 28px}.bottom small{display:block;color:var(--muted);margin-top:5px}
    .budget{padding:90px 0}.budget-head{display:grid;grid-template-columns:1fr .5fr;gap:50px;align-items:end}.budget-head h2{font-size:48px;margin:0;line-height:1.05}.budget-head p{color:var(--muted);line-height:1.7}.tiers{display:grid;grid-template-columns:repeat(3,1fr);margin-top:35px;border:1px solid var(--line)}.tiers button{text-align:left;border:0;border-right:1px solid var(--line);background:#fffdf8;padding:19px}.tiers button:last-child{border-right:0}.tiers button.active{border-bottom:4px solid var(--orange)}.tiers b{display:block;color:var(--green);font-size:26px;margin:6px 0}.budget-grid{display:grid;grid-template-columns:.75fr 1.25fr;border:1px solid var(--line);border-top:0;background:var(--line);gap:1px}.budget-main,.budget-lines{background:#fffdf8}.budget-main{padding:28px}.budget-main strong{display:block;color:var(--orange);font-size:42px}.budget-lines{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--line)}.line{position:relative;background:white;padding:21px}.line b{font-size:20px}.line p{color:var(--muted);font-size:12px;line-height:1.6}.line em{position:absolute;right:14px;bottom:12px;background:#e7efe9;color:var(--green);font-style:normal;font-size:10px;padding:3px 6px}
    .plan{display:none;padding:88px 0;background:#e8efe8}.plan.show{display:block}.notice{margin:20px 0;border-left:3px solid var(--orange);background:#fffdf8;color:var(--muted);padding:13px}.overview{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);margin:22px 0}.overview article,.day,.end article{background:#fffdf8;padding:18px}.overview span,.end span{display:block;color:var(--orange);font-size:10px;font-weight:900;letter-spacing:.12em;margin-bottom:8px}.days{display:grid;gap:14px}.day{display:grid;grid-template-columns:120px 1fr;border:1px solid var(--line)}.day aside{border-right:1px solid var(--line);padding:20px}.day aside strong{display:block;color:var(--green);font-family:Georgia,serif;font-size:40px}.day h3{margin:0 0 12px}.schedule{display:grid;grid-template-columns:1fr 1fr;gap:0 22px}.schedule p{margin:0;padding:8px 0;border-top:1px solid #ebe6da;font-size:13px}.schedule b{color:var(--orange);margin-right:10px;font-size:11px}.tags{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}.tags span{background:#f3f1e9;color:var(--muted);font-size:11px;line-height:1.55;padding:9px}.backup{border-top:1px dashed var(--line);margin-top:13px;padding-top:12px;color:var(--muted);font-size:12px}.end{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line);margin-top:22px}.map{color:var(--orange);font-weight:800;text-decoration:none}.export{display:flex;gap:9px;justify-content:flex-end;margin:18px 0}.bordered{border:1px solid var(--green);background:#fffdf8;color:var(--green);padding:12px 15px;font-weight:800}
    footer{background:#e4ded1;padding:28px 0;color:var(--muted);font-size:13px}@media(max-width:760px){.wrap{width:min(100% - 30px,1160px)}.nav-links{display:none}.hero,.section-head,.budget-head,.budget-grid{grid-template-columns:1fr}.hero{padding:44px 0;min-height:auto}.grid{grid-template-columns:1fr 1fr}.wide{grid-column:span 2}.bottom{display:block}.bottom .primary{width:100%;margin-top:16px}.tiers{grid-template-columns:1fr}.tiers button{border-right:0;border-bottom:1px solid var(--line)}.budget-lines,.overview,.end,.schedule,.tags{grid-template-columns:1fr}.day{grid-template-columns:1fr}.day aside{border-right:0;border-bottom:1px solid var(--line);display:flex;gap:10px;align-items:center}.hero h1{font-size:46px}.section-head h2,.budget-head h2,.plan h2{font-size:36px}}
  </style>
</head>
<body>
  <nav class="nav wrap">
    <a class="brand" href="#top"><span>行</span>知旅行</a>
    <div class="nav-links"><a href="#planner">做攻略</a><a href="#budget">预算参考</a><a href="#library">城市资料</a></div>
    <button class="quiet" onclick="scrollToPlanner()">开始规划 →</button>
  </nav>
  <header class="hero wrap" id="top">
    <div>
      <p class="eyebrow">PERSONAL TRAVEL PLANNER · 150+ DESTINATIONS</p>
      <h1><em>现在出发！</em><br>把旅行过成<br>你喜欢的样子。</h1>
      <p class="intro">输入目的地、人数、预算和偏好，生成一份能直接带走的自由行方案：路线、预算、住宿区域、美食、注意事项和行前清单都放在一起。</p>
      <div class="pills"><span>✓ 路线不绕路</span><span>✓ 预算看得懂</span><span>✓ 官方信息可核验</span></div>
      <button class="primary" onclick="scrollToPlanner()">帮我做攻略 →</button>
    </div>
    <aside class="card">
      <small>这份攻略里有</small>
      <h2>住得舒服，吃得开心，<br>走得不累。</h2>
      <p>每日只保留 2 个核心停留点，给排队、天气、吃饭和交通留下余量。</p>
    </aside>
  </header>

  <section class="section" id="planner">
    <div class="wrap">
      <div class="section-head">
        <div><p class="eyebrow">STEP 01 · START HERE</p><h2>说说你的旅行，<br><em>剩下的交给我。</em></h2></div>
        <p>EdgeOne 国内试水版：不需要 AI Key，不消耗模型额度；先用本地规则生成基础可用的旅行单。</p>
      </div>
      <div class="shell">
        <div class="form-block">
          <h3>01 目的地与日期</h3>
          <div class="grid">
            <label class="field"><span>出发城市</span><input id="origin" value="上海"></label>
            <label class="field"><span>出行日期</span><input id="date" type="date"></label>
            <label class="field"><span>省份／地区</span><select id="province"></select></label>
            <label class="field"><span>热门城市</span><select id="city"></select></label>
            <label class="field wide"><span>或直接输入目的地</span><input id="destination" value="成都" list="cities"><datalist id="cities"></datalist></label>
          </div>
        </div>
        <div class="form-block">
          <h3>02 同行与预算</h3>
          <div class="grid">
            <label class="field"><span>停留天数</span><select id="days"><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>10</option></select></label>
            <label class="field"><span>同行人数</span><select id="travelers"><option>1</option><option selected>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select></label>
            <label class="field"><span>同行关系</span><select id="party"><option>独自出发</option><option selected>情侣</option><option>朋友</option><option>亲子</option><option>多人小团</option></select></label>
            <label class="field"><span>总预算（全员）</span><input id="budget" type="number" value="5000" step="100"></label>
            <label class="field"><span>大交通</span><select id="transport"><option selected>火车</option><option>飞机</option><option>自驾</option><option>灵活比价</option></select></label>
            <label class="field"><span>住宿偏好</span><select id="room"><option value="auto" selected>自动推荐</option><option value="shared">优先合住省钱</option><option value="private">独立入住</option></select></label>
            <label class="field"><span>旅行节奏</span><select id="pace"><option>轻松慢游</option><option selected>舒适不赶路</option><option>经典打卡</option><option>高效深度游</option></select></label>
            <label class="field"><span>饮食偏好</span><input id="diet" value="无特殊忌口"></label>
          </div>
          <div class="chips" id="chips"></div>
        </div>
        <div class="bottom">
          <div><b>预算只是参考，最终以你自己核验的页面为准</b><small>没有实时票价，也不会跳转下单。</small></div>
          <button class="primary" onclick="generate()">生成我的旅行攻略 →</button>
        </div>
      </div>
    </div>
  </section>

  <section class="budget" id="budget"><div class="wrap" id="budgetView"></div></section>
  <section class="plan" id="plan"><div class="wrap" id="planView"></div></section>
  <section class="library" id="library"><div class="wrap"><p class="eyebrow">DESTINATION LIBRARY</p><h2>约 150 个热门目的地，资料完整度一眼看懂。</h2><p>当前为个人公开试水版，预算和预约提醒请在出发前通过官方页面再次核验。</p></div></section>
  <footer><div class="wrap">个人旅行规划工具 · 不卖套餐，不代下单，信息仅供参考。</div></footer>

  <script>
    const data={"北京":["北京"],"上海":["上海"],"天津":["天津"],"重庆":["重庆"],"河北":["秦皇岛","承德","保定","张家口","邯郸"],"山西":["太原","大同","平遥","忻州","临汾"],"江苏":["南京","苏州","无锡","扬州","常州"],"浙江":["杭州","宁波","温州","绍兴","舟山"],"福建":["厦门","福州","泉州","武夷山"],"山东":["青岛","济南","威海","烟台","泰安"],"河南":["郑州","洛阳","开封"],"湖北":["武汉","宜昌","恩施"],"湖南":["长沙","张家界","凤凰"],"广东":["广州","深圳","珠海","潮州"],"广西":["桂林","阳朔","南宁","北海"],"海南":["三亚","海口","万宁"],"四川":["成都","九寨沟","乐山","都江堰","稻城"],"贵州":["贵阳","荔波","安顺"],"云南":["昆明","大理","丽江","香格里拉","西双版纳"],"陕西":["西安","华山"],"甘肃":["兰州","敦煌","张掖"],"青海":["西宁","青海湖"],"新疆":["乌鲁木齐","喀什","伊犁","阿勒泰"]};
    const guide={成都:{stay:"春熙路／太古里：首访交通最方便；预算友好可选建设路地铁站附近。",food:["甜水面","钟水饺","川菜小馆回锅肉","牛油火锅"],spots:["熊猫基地早场","宽窄巷子","东郊记忆","九眼桥"]},杭州:{stay:"湖滨适合看西湖；武林广场地铁站附近兼顾性价比与通勤。",food:["片儿川","葱包桧","东坡肉","定胜糕"],spots:["西湖骑行","灵隐飞来峰","中国茶叶博物馆","河坊街"]},西安:{stay:"钟楼／南门适合首次到访；大雁塔地铁站附近适合夜游。",food:["肉丸胡辣汤","油泼面","小炒泡馍","甑糕"],spots:["兵马俑","陕西历史博物馆","城墙骑行","大唐不夜城"]},重庆:{stay:"解放碑适合首次到访；观音桥夜宵和住宿选择更丰富。",food:["重庆小面","酸辣粉","江湖菜","老火锅"],spots:["山城步道","李子坝","三峡博物馆","洪崖洞"]},厦门:{stay:"中山路／镇海路去鼓浪屿和市区景点顺路。",food:["沙茶面","土笋冻","姜母鸭","花生汤"],spots:["鼓浪屿","南普陀","沙坡尾","环岛路"]},长沙:{stay:"五一广场／湘江中路夜游和地铁最方便。",food:["长沙米粉","剁椒鱼头","口味虾","糖油粑粑"],spots:["湖南博物院","岳麓山","橘子洲","潮宗街"]},大理:{stay:"大理古城南门吃住选择多；双廊适合看洱海日落。",food:["饵丝","乳扇","白族酸辣鱼","菌菇火锅"],spots:["大理古城","洱海生态廊道","喜洲古镇","苍山"]},三亚:{stay:"三亚湾方便机场与市区；亚龙湾更适合海边度假。",food:["海南粉","椰子鸡","清补凉","明码标价海鲜"],spots:["椰梦长廊","蜈支洲岛","亚龙湾","南山"]}};
    const interests=["在地美食","经典景点","博物馆人文","自然风光","亲子轻松","拍照打卡"];
    let picked=new Set(["在地美食","经典景点"]), activeTier="balanced", current=null;
    const $=id=>document.getElementById(id), money=n=>"¥"+Math.round(n).toLocaleString();
    function init(){const p=$("province"), c=$("city"), d=$("date"); d.value=new Date().toISOString().slice(0,10); Object.keys(data).forEach(x=>p.add(new Option(x,x))); p.value="四川"; updateCities(); p.onchange=updateCities; c.onchange=()=>{$("destination").value=c.value}; Object.values(data).flat().forEach(x=>$("cities").append(new Option(x))); renderChips(); renderBudget(readInput());}
    function updateCities(){const c=$("city"); c.innerHTML=""; data[$("province").value].forEach(x=>c.add(new Option(x,x))); c.value=data[$("province").value][0]; $("destination").value=c.value}
    function renderChips(){const box=$("chips"); box.innerHTML=interests.map(x=>'<button type="button" class="'+(picked.has(x)?"on":"")+'" onclick="toggleChip(\\''+x+'\\')">'+(picked.has(x)?"✓ ":"+ ")+x+'</button>').join("")}
    function toggleChip(x){picked.has(x)?picked.delete(x):picked.add(x); renderChips()}
    function scrollToPlanner(){$("planner").scrollIntoView({behavior:"smooth"})}
    function readInput(){return{origin:$("origin").value,destination:$("destination").value||$("city").value,days:+$("days").value,travelers:+$("travelers").value,party:$("party").value,totalBudget:+$("budget").value||0,transport:$("transport").value,room:$("room").value,pace:$("pace").value,diet:$("diet").value}}
    function cityGuide(dest){return guide[dest]||{stay:"优先选择市中心或交通枢纽地铁站 10 分钟步行圈，兼顾晚间用餐与返程。",food:["当地早餐","本地特色面食／米粉","口碑家常菜","夜市小吃"],spots:["城市核心文化街区","当地博物馆或展馆","代表性景观","夜间街区慢游"]}}
    function stayPlan(i,price){if(i.room==="private"||i.travelers===1)return{label:i.travelers===1?"1 间单人房":i.travelers+" 间单人房",rooms:i.travelers,price:Math.round(price*.9),note:"独立入住，适合作息不同或重视私密性。"}; const occ=i.room==="shared"?Math.min(4,i.travelers):2, rooms=Math.ceil(i.travelers/occ); return{label:occ>=3?rooms+" 间多人房":rooms+" 间双床／大床房",rooms,price,note:occ>=3?"按多人合住优先，保留独立床位调整空间。":"情侣默认大床房；朋友默认双床房，避免强制拼床。"}}
    function budgets(i){const premium=["北京","上海","杭州","三亚","厦门","深圳","大理","丽江","青岛","成都"].includes(i.destination)?1.2:1, nights=Math.max(1,i.days-1), trans=i.transport==="飞机"?760:i.transport==="自驾"?330:i.transport==="火车"?420:520; return[{id:"save",label:"省钱",room:168,food:78,local:20,ticket:78,extra:.08},{id:"balanced",label:"平衡",room:248,food:125,local:42,ticket:135,extra:.1},{id:"comfort",label:"舒适",room:398,food:205,local:86,ticket:230,extra:.12}].map(t=>{const stay=stayPlan(i,Math.round(t.room*premium)), big=trans*i.travelers*(t.id==="save"?.82:t.id==="comfort"?1.35:1), hotel=stay.price*stay.rooms*nights, food=t.food*i.days*i.travelers, local=t.local*i.days*i.travelers, ticket=t.ticket*Math.max(1,i.days-1)*i.travelers, sub=big+hotel+food+local+ticket, reserve=sub*t.extra; return{...t,stay,total:sub+reserve,lines:[["往返大交通",big,Math.round(big/i.travelers)+"元/人",i.origin+"往返"+i.destination+"的"+i.transport+"参考价"],["住宿",hotel,stay.rooms+"间 × "+stay.price+"元 × "+nights+"晚",stay.label+"；人均 "+Math.round(hotel/i.travelers)+" 元。"+stay.note],["餐饮",food,Math.round(food/i.days/i.travelers)+"元/人/天","早餐小吃＋特色正餐＋日常餐食，避开景区门口高溢价餐厅。"],["门票与预约",ticket,"约"+Math.round(ticket/i.travelers)+"元/人","按核心景点、讲解或必要预约计算；免费场馆按预约提醒处理。"],["市内交通",local,Math.round(local/i.days/i.travelers)+"元/人/天","地铁公交为主，晚间或携行李时适量打车。"],["预留金",reserve,Math.round(t.extra*100)+"%缓冲","用于天气调整、行李寄存、候补预约或价格波动。"]]} }) }
    function renderBudget(i){const bs=budgets(i), b=bs.find(x=>x.id===activeTier)||bs[1], gap=i.totalBudget-b.total; $("budgetView").innerHTML='<div class="budget-head"><div><p class="eyebrow">STEP 02 · BUDGET REFERENCE</p><h2>钱不只是一串数字。<br>每一项都有去处。</h2></div><p>按目的地、人数、房型、出行日期与交通方式计算。它是规划口径，不代表实时库存或可预订价格。</p></div><div class="tiers">'+bs.map(x=>'<button class="'+(x.id===activeTier?"active":"")+'" onclick="activeTier=\\''+x.id+'\\';renderBudget(readInput())"><span>'+x.label+'</span><b>'+money(x.total)+'</b><small>全员总预算</small></button>').join("")+'</div><div class="budget-grid"><article class="budget-main"><p>当前选择</p><h3>'+b.label+'自由行</h3><strong>'+money(b.total)+'</strong><p>人均 '+money(b.total/i.travelers)+'</p><hr><b>'+(gap>=0?"比你的预算少 "+money(gap):"超出你的预算 "+money(Math.abs(gap)))+'</b><p>'+(gap>=0?"这部分余量可留给临时交通、排队替代方案或一顿想吃的特色餐。":"优先切换省钱档、减少高价门票或调整房型。")+'</p></article><div class="budget-lines">'+b.lines.map(l=>'<article class="line"><span>'+l[0]+'</span><br><b>'+money(l[1])+'</b><p>'+l[2]+'</p><p>'+l[3]+'</p><em>参考</em></article>').join("")+'</div></div>'}
    function itinerary(i){const g=cityGuide(i.destination), bs=budgets(i)[1], weights=Array.from({length:i.days},(_,n)=>n===0?.74:n===i.days-1?.82:n%2?1.22:1.02), sum=weights.reduce((a,b)=>a+b,0); let used=0; return weights.map((w,n)=>{const spend=n===i.days-1?bs.total-used:Math.round(bs.total*w/sum); used+=n===i.days-1?0:spend; const a=g.spots[n%g.spots.length], b=g.spots[(n+1)%g.spots.length], c=g.spots[(n+2)%g.spots.length], f=g.food; return{day:n+1,spend,theme:n===0?"抵达与熟悉街区":n===i.days-1?"从容收尾":"围绕"+a+"深度体验",morning:n===0?"抵达后寄存行李，先吃 "+f[3%f.length]+" 再办理入住":"08:30 出发，优先游览 "+a,lunch:"12:00 在 "+a+" 附近吃 "+f[n%f.length],afternoon:n===i.days-1?"预留返程前 2 小时，逛 "+b+" 并取行李":"14:00 前往 "+b+"，只保留一个核心场馆／景观",dinner:"18:00 选择 "+f[(n+1)%f.length]+"，避开景区门口高溢价餐厅",evening:n===i.days-1?"前往车站／机场，提前抵达":"19:30 "+c+" 夜间打卡，21:00 前返回住宿区",food:"早餐："+f[3%f.length]+" · 午餐："+f[n%f.length]+" · 晚餐："+f[(n+1)%f.length],backup:n===0?"若抵达晚于计划，今晚只在住宿区附近吃饭散步。":"如果排队超过 40 分钟，先切换到附近室内展馆、书店或咖啡店。",spots:[a,b]}})}
    function generate(){const i=readInput(), g=cityGuide(i.destination), days=itinerary(i); current={i,g,days}; renderBudget(i); $("plan").classList.add("show"); $("planView").innerHTML='<p class="eyebrow">YOUR TRAVEL NOTE</p><h2>'+i.destination+' · '+i.days+' 天自由行</h2><p class="notice">已生成基础旅行单：路线、预算、吃住和提醒都可直接参考。出发前请复核官方预约和天气。</p><div class="export"><button class="primary" onclick="window.print()">打印／保存 PDF</button><button class="bordered" onclick="copyList()">复制行前清单</button></div><div class="overview"><article><span>推荐住宿区域</span><b>'+g.stay+'</b></article><article><span>预约清单</span><b>核心景点官方预约 · 往返大交通 · 首晚住宿</b></article><article><span>行前提醒</span><b>出发前 72 小时复核天气、开放状态和交通。</b></article></div><div class="days">'+days.map(d=>'<article class="day"><aside><span>DAY</span><strong>'+String(d.day).padStart(2,"0")+'</strong><small>约 '+money(d.spend)+'/天</small></aside><div><h3>'+d.theme+'</h3><div class="schedule"><p><b>上午</b>'+d.morning+'</p><p><b>午餐</b>'+d.lunch+'</p><p><b>下午</b>'+d.afternoon+'</p><p><b>晚餐</b>'+d.dinner+'</p><p><b>夜间</b>'+d.evening+'</p></div><div class="tags"><span><b>美食推荐</b><br>'+d.food+'</span><span><b>打卡点</b><br>'+d.spots.join(" · ")+'</span><span><b>交通</b><br>优先地铁／公交，累计步行控制在 8–12 公里。</span><span><b>地图</b><br><a class="map" target="_blank" href="https://ditu.amap.com/search?query='+encodeURIComponent(i.destination+" "+d.spots.join(" "))+'">高德地图搜索 →</a></span></div><div class="backup"><b>PLAN B：</b>'+d.backup+'</div></div></article>').join("")+'</div><div class="end"><article><span>避坑提醒</span><p>不通过陌生人购买低价票或讲解；不接受未明码标价的包车与加工。</p></article><article><span>推荐美食</span><p>'+g.food.join(" · ")+'</p></article><article><span>资料说明</span><p>基础规划结果，预算和预约请出发前自行核验。</p></article></div>'; $("plan").scrollIntoView({behavior:"smooth"})}
    function copyList(){if(!current)return; const text=current.i.destination+" "+current.i.days+" 天旅行清单\\n住宿："+current.g.stay+"\\n"+current.days.map(d=>"Day "+d.day+" "+d.theme+"："+d.morning+"；"+d.afternoon+"；"+d.dinner).join("\\n"); navigator.clipboard&&navigator.clipboard.writeText(text); alert("行前清单已复制")}
    document.addEventListener("input",e=>{if(["origin","destination","days","travelers","party","budget","transport","room","pace","diet"].includes(e.target.id))renderBudget(readInput())});
    init();
  </script>
</body>
</html>`;

writeFileSync(join(outDir, "index.html"), html, "utf8");
writeFileSync(join(outDir, "404.html"), html, "utf8");
writeFileSync(join(outDir, "robots.txt"), "User-agent: *\nAllow: /\n", "utf8");
