# 2026-10-01 部署与搜索可见性排查

## 发布

- 生产部署：`dpl_5EvQwmeuAoSkPoWmbKgy1JGhSDM9`，Vercel 返回 READY，已绑定 https://quiz.ckautoflow.com。
- 已核对正式首页导航：首页 → 解题工具 → 专项训练 → 练习题库 → 模拟考中心 → 解题攻略。
- 本地单元测试：44 通过、11 数据库集成测试跳过、0 失败；远程生产构建与 TypeScript 检查通过。

## 已确认的历史变化

1. 2026-09-15，提交 `320467b`：公开页面迁移到 `/zh`、`/en` 路径，加入 canonical、hreflang、站点地图及可抓取正文。旧路径按 cookie/Accept-Language 临时跳转。无语言请求访问 `/pipeline`，线上实测返回 307 到 `/en/pipeline`；根路径同样 307 到 `/en`。
2. 2026-09-28，提交 `32781ea`：免费额度与付费权益调整、双语攻略扩充、定价和关于页面、结构化数据及 SEO 审计。公开工具说明仍可匿名抓取，没有整页改成登录墙。
3. 2026-09-29，根据当日发布记录及当前工作区差异：首页标题由“宝洁笔试题库 | 管道·图形·数字推理在线练习”改为“宝洁测评题库｜管道题工具与模拟练习 | CK Quiz”；管道页由“管道推理题在线求解器 | 宝洁笔试题库”改为“宝洁管道题工具｜在线求解与逐步验算 | CK Quiz”，同步改 H1、摘要、正文与内部链接。品牌名改为 CK Quiz，加入四篇公司测评双语攻略。部署前获取的线上 HTML 已包含新管道标题，因此这不是 10 月 1 日才上线的变化。
4. 2026-10-01 本任务代码修改仅调整 Sidebar 导航顺序。部署使用当前工作区，没有额外改写 SEO 标题或重定向策略。

## 线上检查

- 中文首页、中文/英文管道页、中文管道攻略均返回 200。
- 页面 robots 为 index, follow，无 X-Robots-Tag 禁止索引；各语言 canonical 指向自身，hreflang 指向对应语言页面。
- robots.txt 允许公开页面抓取，仅禁止 /api/；sitemap.xml 可访问。
- 管道页标题、H1 和说明保留“宝洁管道题”主题。

## 判断边界

- 旧 URL 的语言协商及 307 是迁移风险，应结合原先获得排名的具体 URL 检查；它不是本次排名下降的已证实原因。9 月 29 日记录仍有用户反馈 Google/Bing 可搜到网站，但该记录未提供本次关键词的排名基线。
- 标题和内容变动可能触发重新评估，但没有查询级历史数据，不能认定是哪项改动导致下降，也不能认定网站被处罚或全部退索引。
- 本次公开搜索工具查询未返回目标站点，不能用它代替用户所在地区的 Google/Bing 结果或 Search Console 收录状态。
- 尚未取得用户搜索引擎、精确关键词、下降日期及 Search Console 查询报表。

## 下一步证据

在对应搜索平台比较下降前后的精确查询：展示、点击、平均排名和落地页；分别检查 `/pipeline`、`/zh/pipeline`、`/en/pipeline` 的索引状态、搜索引擎选择的 canonical 和最近抓取时间。根据原排名 URL 的语言再决定是否将旧工具路径永久映射到对应语言页面，避免盲目回滚标题或再次迁移网址。

参考：
- https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
- https://developers.google.com/search/docs/crawling-indexing/301-redirects
- https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites

## 后续：用户确认 Google 第四页后执行的优化

用户提供的搜索结果落地页为 `/zh`，标题仍是“宝洁笔试题库 | 管道·图形·数字推理在线练习 - CKAutoFlow”。用户报告此前第二页、现在第四页，这是用户观察，尚无同地区、同设备、同关键词的每日排名序列。

### Search Console 实际证据

通过已登录的 Chrome 读取 `sc-domain:ckautoflow.com`，Performance 必须加页面包含 `https://quiz.ckautoflow.com/` 筛选，避免混入主域名业务。

- 默认 3 个月报表图表范围显示 2026-07-21 至 2026-09-28，11 点击、30 展示、全查询平均位置 4.2。样本非常少且不是目标词专属排名，不能解读为该词在第一页。
- 可见查询“宝洁管道题”：1 点击 / 1 展示；“宝洁管道题工具”：0 点击 / 2 展示。匿名查询等原因使查询行不等于总计。报表尚不能验证 9 月 30 日至 10 月 1 日变化。
- `/zh`：已收录；最后抓取 2026-09-28 10:42:42（Search Console 界面时间）；Googlebot smartphone，抓取成功、允许索引，Google canonical 为该 URL。此抓取早于 9 月 29 日标题修改，不能据此将新标题认定为排名下降原因。
- `/zh/pipeline`：首次检查显示 URL is unknown to Google；本轮稍后再次检查更新为 Discovered – currently not indexed，并列出项目 sitemap。仍未收录、尚无最近抓取，不能把状态更新归因于本轮代码改动。
- sitemap 报表：`https://quiz.ckautoflow.com/sitemap.xml` 于 9 月 28 日提交，10 月 1 日读取成功，发现 44 页。单 URL 检查未显示引用 sitemap，不等于全站未提交 sitemap；发现也不等于收录。

### 已发布的改进

- 首页标题改为“宝洁管道题在线练习与解题工具 | 宝洁笔试题库 - CK Quiz”，同步调整 H1、摘要与首段。保持现有 `/zh` URL、canonical 和语言配置。
- 首页主入口直达管道工具，次入口直达管道练习；加入可匿名阅读的单级重排例题、方法简介及描述清楚的攻略/工具内链。
- 公司测评比较模块移到首页下方，让主要练习内容提前。
- 管道工具页增加原创两级管道例题、逐步位置对应和代回验证。保留既有标题，避免无依据地反复调整已匹配的工具页标题。
- 仅实际修改的中文首页和管道页 sitemap lastmod 更新为 2026-10-01。没有新增重复关键词页面，没有批量修改其他页面日期，也没有将品牌拼成“保洁”。
- 部署 `dpl_Cb7DsucHPPGBaVL1X2cr56ZAoQ22`，READY，正式域名已绑定。
- ESLint 通过；44 单元测试通过、11 数据库测试跳过；生产构建/TypeScript 通过；44 公开页、90 JSON-LD 块、4 noindex 页面线上审计通过；两条例题独立计算校验通过，线上新内容及 sitemap 日期已确认。
- 首页与中文管道工具页分别提交索引请求，均已显示“Indexing requested”，加入优先抓取队列。请求受理不等于抓取完成或排名提升。

排名恢复尚未验证。后续应在报表日期推进后，固定页面/查询/国家/设备条件比较展示和平均位置，避免用全站平均位置替代目标关键词表现。
