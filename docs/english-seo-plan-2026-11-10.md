# 英文 Google 排名计划（2026-11-10）

## 已上线（提交 9de3256）

| 页面 | 新标题（Google 显示） | 目标搜索词 |
|---|---|---|
| /en | P&G Assessment Practice: Switch, Digit, Grid & PEAK | P&G assessment test practice |
| /en/pipeline | P&G Switch Challenge Practice & Solver | P&G Switch Challenge practice |
| /en/numerical | P&G Digit Challenge Practice & Equation Solver | P&G Digit Challenge practice |
| /en/grid | P&G Grid Challenge Practice: Dot Memory Training | P&G Grid Challenge practice |
| /en/peak | P&G PEAK Performance Assessment Practice | P&G PEAK assessment |
| /en/exams | P&G Online Assessment Mock Test: Switch, Digit, Grid | P&G online assessment mock test |
| /en/practice | P&G Assessment Practice Questions with Answers | P&G assessment practice questions |

- 每页加了服务端渲染的英文正文：考试介绍、方法、例题、FAQ（含 FAQPage 结构化数据），并互相链接。
- 英文首页新增"各测评部分"链接区块。
- /llms.txt 现在是真正的纯文本文件。
- 已通过 IndexNow 通知 Bing（44 个 URL，返回 200）。
- 中文页面没有改动。
- 考试官方信息只引用 P&G Careers 页面（PEAK 约 20 分钟、不限时；Interactive Assessment 约 30 分钟）；Switch、Digit、Grid 各自的时长写成"考生普遍反映"。

## 2026-11-10 已在 Search Console 完成

- 已请求编入索引：/、/en/pipeline、/en/numerical、/en/grid、/en/peak、/en/exams、/en/practice、/en/guides；sitemap 已重新提交。
- 请求前状态：/en/pipeline 已收录；/en/numerical 为“Google 不知道此网址”；grid、peak、exams、practice、guides 为“已发现，尚未编入索引”。
- /en 未单独收录：Google 认定它与根域名 / 重复，选择 / 为规范网址（根域名 307 跳到 /en，Googlebot 看到的就是英文首页）。英文搜索结果会显示根域名，用户点进来后按浏览器语言跳转，所以可以接受，不需要改网址结构。
- 近 90 天子域名：43 次点击、387 次展示、平均排名 9.3。已出现的英文查询：procter and gamble switch challenge（排名 48）、p&g switch challenge practice free（10）、p&g digit challenge（52）、p&g grid challenge（53）、p&g switch challenge（65）、digit challenge test（71）。这些词已有需求，此前因页面标题没写对，只能排在第 5–7 页。

## 你需要在 Google Search Console 做的（约 5 分钟）

1. 打开 GSC → 网址检查，依次粘贴下面 7 个网址，各点一次"请求编入索引"（每天有配额，一天做完没问题）：
   - https://quiz.ckautoflow.com/en
   - https://quiz.ckautoflow.com/en/pipeline
   - https://quiz.ckautoflow.com/en/numerical
   - https://quiz.ckautoflow.com/en/grid
   - https://quiz.ckautoflow.com/en/peak
   - https://quiz.ckautoflow.com/en/exams
   - https://quiz.ckautoflow.com/en/guides
2. 站点地图 → 重新提交 sitemap.xml。
3. 看英文关键词：效果 → 搜索结果 → 网页筛选"包含 /en/"，再看"查询"标签。2–4 周后再看一次展示数和平均排名。

## 外链与社区（需要你用自己的账号发，发之前先看各社区规则）

原则：先回答问题，链接只放在确实有帮助的地方；注明是自己做的独立工具，不说"官方"或"包过"。

### Reddit 回复模板（用于有人问 P&G 测评怎么准备的帖子）

> The interactive part is usually described as three short games: Switch (work out the 4-digit code that reorders symbols), Digit (fill equation blanks with distinct digits) and Grid (remember dot positions while answering symmetry questions). PEAK is an untimed questionnaire, about 20 minutes per P&G.
>
> What helped most for Switch: read each code as "new slot n takes old position x", never the other way round, and check every answer by substitution. For Digit, bound the product first (e.g. for a×b+c=47, the product must be 38–46).
>
> Disclosure: I built a free practice site with a step-by-step Switch solver and Digit/Grid drills — quiz.ckautoflow.com/en — not affiliated with P&G. Happy to hear what's missing.

可找的地方：r/procterandgamble、r/FMCG、r/UKJobs、r/GradSchool、r/internships 里关于 "P&G assessment / online test" 的帖子。

### 工具目录（一次性提交，长期外链）

- Product Hunt（以 "Free P&G Switch Challenge solver & practice" 为卖点）
- AlternativeTo（列为 JobTestPrep 的免费替代）
- SaaSHub、Indie Hackers 的 "Show IH"

### 一篇长文（Medium / LinkedIn / dev.to）

标题建议：How to solve the P&G Switch Challenge in under 10 seconds per question —— 内容复用 /en/pipeline 的方法和例题，文末链回该页。

## 怎么判断有没有效果

- 2–4 周：GSC 中 /en/ 页面出现 "switch challenge"、"digit challenge" 等查询的展示。
- 1–3 个月：长尾词进前 20；有外链后再看能否进前 10。
- "P&G assessment test practice" 这类大词的竞争对手是 JobTestPrep、WikiJob 等，需要持续积累外链，不要期待短期进第一页。

## 2026-11-11 排名快照（Google，hl=en&gl=us&pws=0，从悉尼的浏览器搜索，只计自然结果标题）

| 搜索词 | 排名 |
|---|---|
| p&g digit challenge solver | 第 2 |
| p&g switch challenge solver | 第 4 |
| p&g switch challenge practice | 前 37 名内未出现 |
| p&g switch challenge practice free / digit challenge practice / grid challenge practice / peak performance assessment practice / assessment test practice | 第 1 页未出现 |

- site:quiz.ckautoflow.com/en 已显示 9 个英文页面，均为新标题；/en/grid、/en/exams 已从"未收录"变为已收录。
- GSC 数据截至 11-08（改版前）：p&g switch challenge practice free 平均第 10，其余 challenge 词 48–71。
