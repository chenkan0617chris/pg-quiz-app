# CK Quiz：英文 SEO 与跨公司测评内容（2026-09-29）

## 本次判断

用户反馈 Google 与 Bing 已可搜到 CK Quiz，品牌查询位于第一页或第二页。本次未取得 Search Console 查询报表，不能把品牌词表现视为通用英文测评词排名，也没有搜索量、关键词难度或国家排名基线。

已有 canonical、双语 hreflang、服务端文章、FAQ、作者入口和 sitemap。重点是内容与搜索意图，而非重复增加 meta keywords。修正英文首页“四种题型”与实际五种的不一致，使用 CK Quiz 品牌名，强化 Switch / Digit 的英文入口；免费固定样题与付费生成新题分开说明。

## 发布内容与关键词分工

| 页面（均有 /zh 与 /en） | 英文意图 | 内容职责 |
| --- | --- | --- |
| 首页 | P&G assessment practice | 产品范围、五类练习、免费条件 |
| /guides/pipeline | P&G Switch Challenge practice | 沿用现有 URL，提供重排推导方法 |
| /guides/company-assessments | company assessment tests, assessments similar to P&G | 公司差异、能力迁移、相关练习选择 |
| /guides/pwc-assessment | PwC UK online assessment practice | 数字、归纳、演绎的区别；利润比例与逻辑例题 |
| /guides/deloitte-assessment | Deloitte UK numerical reasoning practice | 加权比率、读表流程、语言任务的边界 |
| /guides/unilever-assessment | Unilever UK assessment preparation | 明确 2025 英国学徒项目资料范围、百分点例题 |

新增四篇双语攻略，共八个公开 URL；接入原有 sitemap、canonical、hreflang、Article、FAQ、面包屑和攻略目录。首页增加比较页入口，攻略互链与资料分析练习入口连接内容和产品。没有新增真实公司试题、公司专属考试引擎、语言推理或情境判断模拟。

## 公司研究：证据与边界

- P&G：官方交互测评说明介绍算式、符号重排和记忆任务。本站练习训练相关基础能力，不能等同完整官方模拟。
  https://www.pgcareers.com/us/en/interactive-assessments
- PwC UK：官方 early-careers 页列出 numerical、inductive、deductive reasoning；认知部分计时，行为部分不计时。不能外推为中国及所有地区版本。
  https://www.pwc.co.uk/careers/early-careers/applying/assessment-selection-process.html
- Deloitte UK：官方说明包含 numerical / verbal reasoning 与行为部分；整体无统一时限，但部分问题计时。不能宣传成 Digit 游戏。
  https://www.deloitte.com/uk/en/careers/early-careers/early-careers-assessment.html
- Unilever UK：2025 年手册印刷页 44–45（PDF 第 23 页）的 Apprenticeship Programme 列出 numerical、verbal、situational judgement。文章注明年份及学徒项目范围，不认定所有 UFLP/全球申请使用相同测评。
  https://tbcdn.talentbrew.com/company/34155/gst_v1/lib/unilever-ec-brochure-uk-2025.pdf#page=23
- Nestlé UK & Ireland：Academy 页确认 online assessment 阶段，但没有足够证据认定为宝洁同款游戏；只在比较页说明，不做声称同款题的独立销售页。
  https://www.nestle.co.uk/en-gb/jobs/nestle-academy/application-process
- Reckitt、Danone：本次搜索未取得足以支持具体同款题型的官方资料，暂不增加品牌落地页。

## GEO 的本次落实

新增攻略使用直接回答、完整原创例题、可复算解释、可见作者、核查日期和官方来源链接。地区、年份及产品覆盖限制出现在正文中，方便人和搜索系统判断适用范围。沿用同一份服务端内容，不单独给 AI 展示不同版本。

Google 官方说明：AI 搜索沿用 SEO 基础，不要求特殊 AI 文件或额外 schema。因此本轮不将 llms.txt 或 FAQ 标记当成排名、引用或富结果保证。
https://developers.google.com/search/docs/appearance/ai-features

## 上线与衡量

1. 发布时只包含本次 SEO 内容变更，避免夹带并行开发中的模拟考试文件；发布后对正式域名运行 `node scripts/audit-seo.mjs`。
2. 确认 sitemap 被 Google Search Console 和 Bing Webmaster Tools 读取；对重点新英文页面检查发现、抓取及索引状态。提交成功不等于收录成功。
3. 建立上线前 28 天基线：严格过滤 quiz.ckautoflow.com；按 /en、/zh 和国家分组；区分 CK Quiz 品牌词与非品牌词。记录展示、点击、CTR、平均位置、落地页，低样本时不要仅凭 CTR 下结论。
4. 优先观察 P&G Switch Challenge practice、P&G assessment practice、PwC UK numerical reasoning、Deloitte UK numerical reasoning、Unilever UK assessment preparation。此列表是内容假设，不是已验证的搜索量排名。
5. 每两周看新增展示查询。先优化已有展示且位置 8–20 的相关页面，避免一开始追逐范围过宽的 interview questions。第一排名页目标需要指定关键词、国家与设备，不能保证期限或结果。
6. 每月在不同 AI 搜索中使用固定提问，记录日期、系统、问题、是否引用、引用 URL；把引用与推荐区分开，未做的查询不记作已有曝光。
7. 后续英文内容优先做现有原创题的完整讲解、常见错误和题型对比；通过真实教程和相关社区参与取得外部发现路径，不批量发布空泛公司页。

## 验证记录

- `npm test`：37 通过，9 个需数据库等条件的测试跳过，0 失败。
- `npm run build`：生产构建和 TypeScript 检查通过。
- 首次全仓 lint 通过；最终复查因并行新增的 `src/components/exam/ExamRunner.tsx:16` 在 render 中写 ref 而失败，该文件不属于本次 SEO 变更。本次全部 SEO 文件单独运行 ESLint 通过。`git diff --check` 通过。
- 本地生产服务 `SEO_BASE_URL=http://localhost:3107 node scripts/audit-seo.mjs`：38 个可索引页面、84 个 JSON-LD 块、4 个 noindex 页面通过；含全部 8 个新增 URL。
- 本次未部署、未提交新增 URL 到搜索后台，未声称已收录、已获得排名或 AI 引用。仓库同时存在其他任务的模拟考试开发，本次未修改该部分。

## 正式发布（用户确认后，2026-09-29）

- 已部署到 https://quiz.ckautoflow.com ，状态 READY。
- 部署 ID：`dpl_7wXcmsK32YBxtmorz2zC5MsEBESu`；部署 URL：https://pg-quiz-cf3sim9ur-chenkan0617chris-projects.vercel.app 。
- 发布副本以 `9b90e25` 为基线，叠加本次 SEO 文件；未包含正在并行开发的 exams/grid/peak 路由、数据库迁移及其导航/支付页改动。原工作目录全部改动保留。
- 发布副本测试：31 通过，9 跳过，0 失败；完整 lint 通过；Vercel 生产构建通过。
- 正式域名 HTML 审计：38 个公开页面、84 个 JSON-LD 块、4 个 noindex 页面通过。
- 模拟 bingbot 与 OAI-SearchBot 请求英文公司比较攻略，均为 200，含文章正文、来源及 canonical；不等于搜索引擎已实际抓取或引用。
- 对本次部署查询最近 10 分钟 error 日志，返回 No logs found；仅记录本次查询结果，不代表持续监控已建立。
- Google 已有 sitemap 提交记录，本轮更新同一 sitemap 地址；未重新操作 Google Search Console 或声称新增页面已收录。

英文测试建议：先看 `CK Quiz P&G assessment`；通过 `site:quiz.ckautoflow.com/en` 辅助检查英文收录；再按目标地区持续观察 `P&G Switch Challenge practice`、`P&G assessment practice`、`PwC UK numerical reasoning practice`、`Deloitte UK numerical reasoning practice`、`Unilever UK assessment preparation`。site 查询不是完整索引报告，也不是通用词排名测试。

- 发布后 IndexNow：公开 key 校验通过，38 个 sitemap URL 提交通知返回 HTTP 200。表示接收通知，不表示 Bing 等已完成收录；Google 不在此提交范围内。

## 搜索截图关键词补强（2026-09-29）

用户截图相关搜索：宝洁管道题工具、宝洁计算题、宝洁测评、宝洁题库、宝洁三乘表；另要求宝洁管道题模拟。本轮按意图分配，未创建重复关键词落地页：

- `/zh/pipeline`：宝洁管道题工具；标题、H1、摘要与可见正文明确在线求解、逐步验算；链接到管道练习及模拟考。
- `/zh/exams`：宝洁管道题模拟考试；修改标题与可见主标题，明确独立原创和会员条件。
- `/zh/practice`：宝洁题库与管道题模拟练习；明确固定免费样题和练习反馈。
- `/zh/numerical`：宝洁计算题工具、宝洁三乘表；新增服务端渲染的 84 组 1–9 不重复数字三数乘积表，并提供原创拆解示例；英文页同步提供数学内容。
- `/zh`：宝洁测评题库；通过首页导航文案连接工具、练习内容。
- 模拟考、Grid、PEAK 页面补充可见面包屑及对应 JSON-LD，保持新增训练页面也能通过全站抓取审计。

验证：44 个单元测试通过，11 跳过；生产构建及 lint 通过；本地 HTML 审计 44 个公开页面、90 个 JSON-LD 块及 4 个 noindex 页面通过。独立解析中英文实际 HTML，逐行核对三乘表组合范围、不重复条件和乘积，两个语言各 84 组正确且无重复。截图不等于关键词搜索量证据；已加入内容不等于搜索引擎已收录或已获得该词排名。

该轮已发布：`dpl_2MGmP78cwxsaiCQkpbJMp8haLv6x`，READY，正式域名已绑定。正式站点 44 页面/90 JSON-LD/4 noindex 审计通过；五类目标页面的标题关键词及线上三乘表 84 行检查通过。44 个 URL 的 IndexNow 提交返回 200。该部署最近 10 分钟 error 日志查询返回 No logs found。未声称具体关键词已收录或排名提升。
