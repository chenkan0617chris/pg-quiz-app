# SEO 与 GEO 实施策略（2026-09-28）

> 后续已按用户确认调整为 A$6.99／30 天、每种解题器 10 次免费、固定样题。以下保留初始调研记录；最新实施见 [首批执行记录](marketing/execution-2026-09-28.md)。

## 当前结论与证据

- Google 公开查询 `site:quiz.ckautoflow.com` 未返回结果。
- 已登录的 Google Search Console 域名资源 `ckautoflow.com` 覆盖题库子域名。逐一检查 `/zh`、`/en`：均为 `URL is unknown to Google`，无抓取记录、无引用 sitemap。域名资源的其他网站统计不能算作题库的收录或流量。
- Search Console sitemap 列表只有 `https://www.ckautoflow.com/sitemap.xml`，没有题库 sitemap。因此首要任务是提交题库 sitemap，建立发现路径。
- 百度搜索页面在当前网络超时。没有证据可断言百度已收录或未收录；需要百度搜索资源平台的账户级数据。
- 站点原已有服务端正文、20 个中英文 URL、canonical、互相引用的 hreflang、FAQ/Article/Breadcrumb JSON-LD。无需推倒重建。
- 发现的可修复问题：每次构建都把全部 sitemap 日期刷新为当天；唯一价格页 `/billing` 被禁止抓取且 noindex；说明中有“免费求解器”却实际要求试用/付费；内容维护者和题目编写方法不清晰。

## 定位与关键词分工

目标是吸引准备推理笔试的中文及英文学习者，通过公开攻略体验内容价值，再进入 7 天试用与 A$4.99/30 天一次性购买。独立练习定位，不声称官方题库或保证通过。

| 页面 | 中文意图 | 英文意图 | 内容职责 |
|---|---|---|---|
| /zh、/en | 宝洁笔试练习、宝洁在线测评准备 | P&G test prep, P&G assessment practice | 产品定位、四类练习、清晰试用和价格 |
| /guides/pipeline | 宝洁管道题怎么做、管道推理逆推 | pipeline logic questions, permutation solving | 方法、完整推导、易错点 |
| /pipeline | 管道题求解器 | pipeline logic solver | 工具输入和结果验证，不与攻略抢同一意图 |
| /guides/figure、/series | 图形推理规律、图形序列求解 | figure series reasoning, figure rule solver | 六类变换与多解限制 |
| /guides/numerical、/numerical | 数字推理填空、不重复数字算式 | numerical reasoning blanks, equation solver | 约束、候选排除、解的验证 |
| /guides/data | 增长率占比题、资料分析分母 | data interpretation growth rate and percentage | 公式、单位与例题 |
| /pricing | 宝洁练习工具价格、免费试用 | P&G practice pricing, free trial | 真实价格、时长、登录条件、一次性购买 |
| /about | 题目来源、是否官方 | question methodology, independent practice | 维护者、方法、来源、适用范围 |

以上是按产品与意图整理的关键词假设，不是购买工具测得的搜索量或排名数据。等有 Search Console 展示后，用真实查询修订。

## 本轮直接实施

1. 新增 `/zh/pricing`、`/en/pricing`、`/zh/about`、`/en/about`；共 24 个 sitemap URL。全站页脚和首页链接到公开页面。
2. 公开价格页、首页与 Checkout 共用金额配置；SoftwareApplication/Offer JSON-LD 对应可见价格，未添加虚假评分或评论。
3. 为四种攻略增加双语直接回答摘要、CKAutoFlow 维护者链接、来源与方法说明。保留完整示例推导，避免只有 AI 摘要而无实质内容。
4. 将原发布日期与修改日期分开；sitemap 使用实际内容日期，未知日期省略，不按部署时间伪装更新。
5. 修正免费工具描述、保证学习速度的表述，以及“四种题都有求解器”的不准确说明。
6. 保留 `/billing`、登录注册页的 noindex，但允许抓取 HTML 以便读取 noindex；继续禁止爬取 API。通配规则允许 Googlebot、Baiduspider、Bingbot、OAI-SearchBot 等获取公开内容。
7. JSON-LD 转义 `<`，避免文章字符串破坏 script 标签。
8. 提供 `scripts/audit-seo.mjs`，检查 sitemap URL 的 HTTP 状态、标题、H1、语言、canonical、hreflang、noindex、JSON-LD、价格和作者链接。

## GEO 的实际工作

Google 的 AI 搜索沿用搜索质量与可索引要求，并不要求特定 AI 文件或特殊 schema。重点是能被发现、完整可抓取、可复算的原创例题和可验证来源。OAI-SearchBot 是 OpenAI 搜索用途的 crawler；不要把 GPTBot 的训练用途与搜索收录混为一谈。

本轮不把 llms.txt 当作收录或排名保证，不堆砌 AI 关键词，不伪造“专家”履历、研究数据、通过率和第三方推荐。FAQ 标记也不代表该教育工具一定获得 Google FAQ 富结果。

## 接下来 30 天

- 第 1 周：确认题库 sitemap 读取成功；检查中英文首页与管道攻略的 URL inspection；如未发现，先查 sitemap/内链/抓取响应，不重复批量提交。
- 第 2 周：根据真实展示查询完善两篇重点长尾内容：管道方框方向与逆排列的区别；增长率、增长量和占比的区别。必须带原创完整示例和对应练习入口。
- 第 3 周：将站内已有示例改编为中英文短视频/图文教程，发布到用户自己的渠道并链接对应攻略；发布另行执行，不自动群发或灌水。
- 第 4 周：对比 Google 的题库子域名展示、点击、CTR、查询、落地页，以及 Vercel 来源流量。挑选有展示无点击的页面改标题；有访问无注册的页面改善试用说明。没有基线前不承诺流量增长百分比。
- 每次内容更新检查实际日期、数学示例、价格一致性和内链。排名观察周期通常超过部署周期，提交不等于索引或排名。

## 百度工作

当前未验证百度账户或题库站点。登录百度搜索资源平台后，确认 `quiz.ckautoflow.com` 的站点归属，按后台提供的 HTML 标签/文件/DNS 方式验证，然后使用账户实际开放的普通收录/链接提交功能。项目已支持 `BAIDU_SITE_VERIFICATION` 环境变量。不要编造验证代码；不要将 Google 或 IndexNow 接收视为百度收录。

百度还需从中国大陆网络实测页面、Clerk 登录和 Stripe 结账；本机澳洲网络的请求结果不代表大陆用户体验。没有测量结果前不建议迁移域名或主机。

## 衡量

- 收录：题库子域名的有效索引 URL 数与 sitemap 发现 URL 数。
- 搜索：按 `/zh` 与 `/en` 区分展示、点击、CTR 和关键词，不混入主站/CRM。
- 转化：搜索访问 → 攻略/工具 → 注册 → 试用 → 付费。当前没有新增追踪第三方；转化事件后续按明确埋点方案接入。
- AI：每月固定查询“管道推理怎么逆推”“图形规律不唯一怎么办”“pipeline logic solver”等，记录引用品页与日期；未执行的查询不得记作已有 AI 推荐。

## 官方参考

- Google AI 搜索与网站：https://developers.google.com/search/docs/appearance/ai-features
- Google 搜索基础：https://developers.google.com/search/docs/essentials
- OpenAI 发布者说明：https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- P&G 招聘流程（只作为招聘流程来源，不作为本站数学方法背书）：https://www.pgcareers.com/us/en/hiring-process

## 本轮验收记录

- 部署 `dpl_GsSxs93quMq1WRgPiPdiHcNexCwM` 已 READY，正式域名已更新。
- `npm test`：24 个测试通过，5 个数据库集成测试按默认配置跳过；本轮没有改变数据库或付款逻辑。lint 与生产构建通过。
- 正式站点 `node scripts/audit-seo.mjs`：24 个公开页面、46 个可解析 JSON-LD 块、3 个 noindex 页面通过检查。模拟 Googlebot 的 HTTP 请求可取得完整正文；额外的 Baiduspider、OAI-SearchBot、bingbot 请求均返回 200，包含正文和 canonical。模拟 UA 检查不等同于来自各搜索引擎 IP 的实际抓取。
- 本地生产服务的 HTTP 审计请求超时，因此未将本地 HTTP 审计记为通过；上述完整审计在正式站点实际执行通过。
- IndexNow 公开 key 校验通过，24 个 URL 提交返回 HTTP 200。这是提交接收，不是收录确认。
- Google Search Console 已成功提交 `https://quiz.ckautoflow.com/sitemap.xml`。提交后短暂显示 Couldn't fetch，随后中文首页 URL inspection 已显示 Discovered – currently not indexed，并列出题库 sitemap，证明发现状态已改变。
- 百度搜索结果页确认 ERR_TIMED_OUT。百度搜索资源平台可以打开，但未登录，已向用户提出登录请求。未虚报百度提交或收录成功。
- 最终复查 Google sitemap 状态为 **Success**，最后读取 2026-09-28，已发现 **24** 个页面；不再是提交后瞬时的 Couldn't fetch。
- 中文首页的 REQUEST INDEXING 返回 **Indexing requested**，已加入优先抓取队列；这仍不是已收录确认。
- 英文首页同样变为 Discovered – currently not indexed，REQUEST INDEXING 也返回 Indexing requested。中英文首页均已进入优先抓取队列。
