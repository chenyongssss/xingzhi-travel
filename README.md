# 行知旅行

![行知旅行宣传图](public/og.png)

一个给自由行用户用的旅行规划工具。输入目的地、日期、人数、同行关系、预算和偏好，就能生成一份可打印、可复制、能打开地图的旅行单：路线、预算、住宿区域、美食、预约提醒和行前清单都放在一起。

在线体验：

- EdgeOne 正式访问地址：部署完成后填写
- 当前可验证页面：[行知旅行静态版](https://chenyongssss.github.io/xingzhi-travel-edgeone-static/)

如果你是从小红书、朋友圈或者攻略帖点进来的，可以先把它当成一个“出发前 10 分钟理清思路”的工具。它不替你下单，也不卖套餐，重点是帮你少刷一点重复攻略，少踩一点明显的坑。

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
- 想自己部署一个旅行规划工具，并接入自己模型服务的开发者。

## 公开版边界

- 本项目只提供旅行规划、预算参考和信息整理。
- 不销售酒店、门票、套餐或当地服务。
- 不抓取、转载或汇总小红书、抖音、携程、去哪儿等第三方平台正文和价格。
- 页面里的预算不是实时库存价，也不代表一定可以买到；出发前请通过景区、博物馆、交通部门等官方页面再次核验。
- 默认可使用本地规则生成基础方案；开启 AI 深度定制时，部署者需要自行配置模型服务环境变量。

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
AI_MODEL=gpt-4.1-mini
```

也可以替换为兼容 OpenAI 接口格式的模型服务。模型密钥只应该放在本地 `.env.local`、EdgeOne 环境变量或 GitHub Secrets 中，不要提交到 GitHub。

## EdgeOne 部署主线

如果主要面向小红书、微信和国内手机用户，推荐优先部署到腾讯云 EdgeOne Pages。当前公开页面可以先走纯前端规则生成，路线、预算、住宿区域、美食、打印 PDF、复制清单和高德地图链接都可以正常使用。

### 方式一：控制台静态部署

推荐先部署专用静态仓库：

- 仓库：`chenyongssss/xingzhi-travel-edgeone-static`
- 项目名：`xingzhi-travel`
- 框架预设：`Other`
- 根目录：`./`
- 安装命令：留空；如控制台必填，使用 `echo skip`
- 构建命令：留空；如控制台必填，使用 `echo skip`
- 输出目录：`./`

### 方式二：GitHub Actions + EdgeOne Token

如果你希望后续一键部署，在 `chenyongssss/xingzhi-travel-edgeone-static` 仓库中添加 GitHub Secret：

```text
EDGEONE_API_TOKEN=你的 EdgeOne API Token
```

然后进入：

```text
Actions → Deploy EdgeOne Static → Run workflow
```

工作流会执行：

```bash
npx edgeone pages deploy ./ -n xingzhi-travel -t "$EDGEONE_API_TOKEN" -e production
```

### EdgeOne + AI 深度定制

如果要启用 AI 深度定制，需要部署可运行服务端接口的版本，并在平台环境变量中配置：

```text
AI_BASE_URL=https://api.openai.com/v1
AI_API_KEY=你的模型密钥
AI_MODEL=gpt-4.1-mini
```

建议链路：

1. 先用静态版上线验证访问、点击和生成体验。
2. 用户反馈稳定后，创建支持 Functions/服务端接口的 EdgeOne Pages 项目。
3. 在 EdgeOne 项目环境变量中添加 `AI_BASE_URL`、`AI_API_KEY`、`AI_MODEL`。
4. 保持模型密钥只存在平台环境变量或 GitHub Secrets，不写入代码、不提交仓库。
5. 接口异常或额度不足时，页面继续回退到本地规则方案，保证用户仍能生成基础行程。

## 常用命令

```bash
npm run dev      # 本地开发
npm run build    # 构建检查
npm run build:edgeone # EdgeOne 静态版构建
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
