# 行知旅行

一个给自由行用户用的旅行规划工具。输入目的地、日期、人数、同行关系、预算和偏好，就能生成一份可打印、可复制、能打开地图的旅行单：路线、预算、住宿区域、美食、预约提醒和行前清单都放在一起。

在线体验：[行知旅行](https://xingzhi-travel.chen8chen88.chatgpt.site/)

可以先把它当成一个“出发前 10 分钟理清思路”的工具。它不替你下单，也不卖套餐，重点是帮你少刷一点重复攻略，少踩一点明显的坑。

## 能做什么

- 目的地支持省份城市选择，也可以直接输入想去的地方。
- 根据人数、同行关系和住宿偏好，推荐住宿区域、房型、间数和人均分摊。
- 生成每日路线，包含建议出发时间、景点、打卡点、交通方式、注意事项和 Plan B。
- 每天附带美食推荐，优先给出当地具体吃什么；资料更完整的城市会给出更具体的区域建议。
- 输出大交通、住宿、餐饮、门票预约、市内交通和预留金六项预算参考。
- 支持总预算上限，显示三档方案和预算差额，方便你决定哪里该省。
- 提供高德地图搜索链接、打印/保存 PDF、复制行前清单，适合出发前分享给同行的人。

## 适合谁

- 第一次去某个城市，不想从零开始做攻略的人。
- 情侣、朋友、亲子、4-6 人小团自由行。
- 想先看大致路线和预算，再去官方渠道核验门票、交通和开放时间的人。
- 想自己部署一个旅行规划工具，并接入自己 AI Key 的开发者。

## 公开版边界

- 本项目只提供旅行规划、预算参考和信息整理。
- 不销售酒店、门票、套餐或当地服务。
- 不抓取、转载或汇总小红书、抖音、携程、去哪儿等第三方平台正文和价格。
- 页面里的预算不是实时库存价，也不代表一定可以买到；出发前请通过景区、博物馆、交通部门等官方页面再次核验。
- 默认不需要配置 AI Key，也不会消耗作者的模型额度；开启 AI 深度定制需要部署者自己配置环境变量。

## 本地运行

需要 Node.js `>=22.13.0`。

```bash
npm install
npm run dev
```

没有 AI 配置时，网站会自动使用本地规则生成基础方案。这个模式适合个人试用、二次开发和静态体验。

## 开启 AI 深度定制

复制 `.env.example` 为 `.env.local`，填入你自己的模型服务配置：

```bash
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=你的模型密钥
AI_MODEL=gpt-5.5
```

也可以替换为兼容 OpenAI 接口格式的模型服务。模型密钥只应该放在本地 `.env.local` 或 Cloudflare 环境变量里，不要提交到 GitHub。

## Cloudflare 部署

项目推荐部署到 Cloudflare Pages/Workers，这样可以保留服务端 AI 接口，并把密钥放在 Cloudflare 环境变量中。

1. Fork 或 clone 本仓库。
2. 在 Cloudflare 创建 Pages/Workers 项目，连接 GitHub 仓库的 `main` 分支。
3. 在 GitHub Secrets 中配置 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID`。
4. 如需 AI，前往 Cloudflare 环境变量配置 `AI_BASE_URL`、`AI_API_KEY`、`AI_MODEL`。
5. 可选：配置 Turnstile 与 `RATE_LIMIT` KV Namespace，减少公开站点被刷接口。
6. 设置 `NEXT_PUBLIC_GITHUB_ISSUES_URL` 为本仓库反馈入口，例如 `https://github.com/chenyongssss/xingzhi-travel/issues/new/choose`。

默认无 AI Key 也可以部署，公开访问时会走本地规则方案，不会产生模型费用。

## 常用命令

```bash
npm run dev      # 本地开发
npm run build    # 构建检查
npm test         # 构建并运行页面渲染测试
npm run lint     # 代码检查
```

## 隐私说明

旅行需求只用于当次生成，不保存用户账户、行程历史或订单。若部署者启用了限额功能，IP 仅以哈希形式参与频率限制，不用于用户画像。

## 反馈与 Star

如果你觉得这个项目对自由行有帮助，欢迎点一个 Star。城市资料、路线体验、预算口径、美食推荐都还可以继续变好，欢迎通过 Issues 提交：

- 城市资料纠错
- 功能建议
- 体验反馈

项目地址：[https://github.com/chenyongssss/xingzhi-travel](https://github.com/chenyongssss/xingzhi-travel)
