# SEO 与用户使用分析（2026-11-16）

数据来源：
- Vercel Analytics，近 7 天：11-09 至 11-16。
- Google Search Console，近 28 天：数据截至 11-13。
- 管理后台：共 110 名用户，看了最近 25 名的列表和 3 名新用户的详情。
- 不含个人信息。

## 流量：海外用户已经是主体
- 近 7 天：100 访客（比上周 +41%）、436 次浏览（+86%），跳出率 56%。
- 国家：美国 29%、澳洲 10%、印度 9%、香港 8%、新加坡 8%。中国大陆已不在前五。
- 来源：google.com 30、accounts.google.com 16（Google 登录回跳，说明有不少人注册）、必应中国 3、Facebook 2、LinkedIn 2、Product Hunt 2。
- 访问最多的页面：
  - /en 29、/zh/pipeline 17、/en/pipeline 15、/zh/numerical 13、/en/exams 12。
  - 登录页 /sign-in 15。
- 设备：桌面 74%、手机 26%。

## Google 搜索（近 28 天）
- 33 次点击（上次 26）、532 次展示（上次 279，翻倍）、平均排名 18.3。
- 平均排名从 12.9 变成 18.3，是因为新增了很多排名靠后的英文词展示，不是原有排名下降。
- 点击按国家：香港 7、英国 5、台湾 5、澳洲 5、美国 4、印度 2、中国 1。
- 展示按国家：美国 123、印度 47、英国 44。
- 英文词在上升：

| 搜索词 | 排名 | 上次 |
|---|---|---|
| grid challenge | 6.0（已有点击） | – |
| switch challenge solver | 5.5 | – |
| p&g grid challenge practice | 5.7 | – |
| digit challenge practice | 9.2 | – |
| digit challenge | 14.3 | – |
| p&g switch challenge | 19.3 | 48 |
| digit challenge test | 43 | 65 |

- 新页面已被收录并开始有展示：
  - EY 攻略（37 次展示）、SHL 攻略（32）、/en/exams（34）。
  - 对应的 SHL、EY、PwC 搜索词出现，但排名还在 50–90 名。
- PEAK 相关搜索出现：peak performance assessment、p&g peak performance assessment answers（50–70 名）。还有人直接搜 PEAK 题目里的陈述原句，我们排第 1–7 名。
- 中文 /zh/guides/figure 有 128 次展示、0 次点击。搜索词是公务员考试数字推理术语（尾数循环、折返遍历、圆形排列），搜索意图和本站不匹配，不建议追。

## 用户使用
- 4 天新增 7 名用户（103 → 110），从名字看大多是海外用户（含印度）。
- **注册引导上线后，最近的新用户都用了功能。** 以前约一半人注册后什么都不用。样本还小，需要继续观察。
- 新用户的典型行为：
  - **考试中实时用解题器**：注册后 13 分钟内连续用了 5 次数字解题器、3 次管道解题器，然后离开。
  - **全部试一遍**：9 分钟内依次试了管道解题器、记忆训练、Grid 样题、PEAK 练习。
  - **直接去模拟考**：注册后马上开了 2 次模拟考，其中一次做了约 19 分钟。
- 付费：这 4 天没有新增付费。

## 本次调整
1. **PEAK 英文页：**
   - 新增“如何读反向表述的陈述”一节，并补充“PEAK 有没有标准答案”的常见问题。
   - 对应 "peak performance assessment answers" 和陈述原句类搜索。
2. **Digit 页标题：** 加上 "Test"，对应 "digit challenge test" 搜索。
3. 已在 GSC 请求收录：/zh/guides/shl-assessment、/zh/guides/kpmg-assessment、/zh/guides/ey-assessment（之前都是“Google 不知道此网址”），以及更新后的 /en/peak（已收录，请求重新抓取）。

## 建议（未做）
- **印度价格**：印度访客和注册都在增加，US$14.99 对印度学生偏贵。可以考虑按国家定价（例如 ₹499 / 7 天）。需要 Stripe 支持 INR，并改数据库价格约束。
- **记录引导选择**：引导的选择目前只存在浏览器里，后台看不到用户选了哪种测评。可以加一张表记录，方便判断海外用户主要在考什么。
- **外链**：AlternativeTo、Reddit（r/UKJobs、r/developersIndia 的求职帖）仍然是把英文词推进前 10 的关键，需要你登录账号。

## "switch challenge practice" 排在第 6 页：原因和改动（2026-11-16）

**排在前面的页面：**
- JobTestPrep（多个页面）
- Aon 官方练习 PDF
- assess.ly、12minprep：都有免登录、可直接做的限时题。

**我们的问题：**
1. **搜索意图不匹配：** 搜 "practice" 的人想马上做题，但 /en/pipeline 的主功能是需要登录的解题器。
2. **域名权重低、外链少：** 只能靠时间和外链慢慢积累。
3. **很多页面 Google 还没抓取：** quiz 站约 30 个页面处于“已发现，尚未编入索引”，包括 /en/guides/pipeline、/zh/numerical、/zh/practice、/zh/grid。部分页面 Google 没看到任何引用它的页面。

**已上线的改动：**
- /en/pipeline 和 /zh/pipeline 新增 8 道免费、免登录的原创管道题：
  - 每题选完立刻显示答案和逐步解析。
  - 题目在服务端渲染，图形名称也写进了 HTML，搜索引擎能读到。
  - 用测试保证每题只有一个选项正确。
- 英文标题改为 "Switch Challenge Practice: Free Questions & Solver (Aon, P&G)"，H1 和描述同步更新。
- 内链文字改成 "Try free Switch Challenge practice questions" 等含关键词的写法。
- 已跑 IndexNow。

**GSC 已请求收录（今天配额用完）：**
- /en/pipeline（重新抓取）
- /en/guides/pipeline
- /zh/numerical
- /en/guides/numerical
- /zh/practice
- /en/guides/assessment

**之后几天继续提交：** /zh/grid、/en/guides/data、/en/guides/memory、/en/guides/pwc-assessment、/en/guides/deloitte-assessment、/en/about。

**2 周后复查：** "switch challenge practice" 的排名，以及已收录页面数（现在 29 个，含其他子域名）。
