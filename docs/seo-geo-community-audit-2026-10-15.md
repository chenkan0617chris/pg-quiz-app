# SEO、GEO 与社群入口调查（2026-10-15）

对象：https://quiz.ckautoflow.com 。本次仅诊断与查找公开入口，未修改生产网站或发布推广。

## 结论

流量下降属实，但现有数据不支持把主要原因归结为 Google 搜索排名崩塌。宝洁该轮网申及测评在 9 月 28 日截止，恰与站点峰值重合，招聘周期导致需求回落是有依据、尚未证实的解释。用户确认没有在高峰期发布小红书、微信群或朋友圈推广。

## 流量证据

Vercel 生产环境，完整 UTC 日；排除未完成的 10 月 14 日。

| 指标 | 9 月 30 日—10 月 6 日 | 10 月 7—13 日 |
| --- | ---: | ---: |
| 页面浏览量 PV | 306 | 116 |
| 无 referrer 的 PV | 266 | 90 |
| 已识别 Bing 来源 PV | 13 | 13 |
| 已识别 google.com 来源 PV | 1 | 6 |

PV 下降 62.1%；减少的 190 PV 中，176（92.6%）属于无来源信息。该分类不等于确定的直接访问，也不能判定是推广、机器人或测试。accounts.google.com 是登录回跳，不能作为自然搜索。近期路径含 /admin，说明统计也包含部分内部访问。

9 月 28 日峰值 621 PV、106 当日访客；回落先于 10 月 13 日定价变更。不能把每日去重访客相加当作周期去重人数。

## Google Search Console

属性 sc-domain:ckautoflow.com，筛选 Page contains https://quiz.ckautoflow.com/，避免混入其他产品。

- 报告最近 7 日对前 7 日：点击 5 vs 6，展示 55 vs 51，CTR 9.1% vs 11.8%，平均位置 7.4 vs 7.9。样本很小，没有大幅搜索曝光下跌。此比较不与上述 Vercel UTC 窗口混用。
- 3 个月报告：22 点击、136 展示、16.2% CTR、平均位置 6.9；可见数据截至 10 月 12 日。
- sitemap 成功，44 个发现网址，最后读取 10 月 13 日。
- 覆盖率快照最后更新 10 月 9 日：7 已收录，37 个“Discovered – currently not indexed”。部分例子为 /en/exams、/en/grid、/en/guides、/en/guides/assessment、/en/guides/numerical；Last crawled 为 N/A。
- /zh/pipeline URL Inspection：已收录；最后抓取 10 月 9 日 22:02:40（GSC 显示时间），抓取和索引允许，Google canonical 与声明一致。
- Generative AI on Search results（Beta）筛选该子域后为 0 展示。这只代表此 Google 报告窗口，不能推及所有 AI 产品。

搜索报告：https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Ackautoflow.com&page=*https%3A%2F%2Fquiz.ckautoflow.com%2F&num_of_days=7&compare_date=PREV

## 技术与 GEO

- 线上审核通过：44 公开页面、90 个服务端 JSON-LD 块、4 个私有 noindex 页面。
- 公开页面 HTTP 200；title、description、单 H1、canonical、hreflang 和语言标记检查通过；价格结构化数据 CNY。
- robots 允许公共页面、禁止 /api/。模拟 Googlebot、OAI-SearchBot、PerplexityBot UA 请求 /zh/pipeline 均 200；这不证明真实机器人 IP 的访问结果。
- Analytics 组件仍在。没有发现统计代码被移除的证据。
- /llms.txt 返回 HTML not-found 内容，并非真正文本文件；Google 不要求特殊 AI 文件，不应把它列为流量下降原因。
- 无已识别 ChatGPT/Perplexity 来源，但 referrer 大量缺失，不能推断零引用。
- Vercel AI crawler 指标需要 Observability Plus，未购买，无法定量确认爬虫量。
- 旧 /pipeline 路径 307 到 /en/pipeline；值得检查迁移策略，但没有证据证明它造成此次下降。
- 审核脚本仍断言 AUD 和美元符号；此次仅内存替换成 CNY/人民币后运行，未改脚本。sitemap 编辑日期也有维护空间。两者不能解释主要降幅。

优先级：先改善重要未收录指南的独有内容、示例和站内链接，再扩大内容数量；围绕已收录的 /zh/pipeline 建立管道题教程与工具之间的链接。GEO 同样先解决可索引、可引用的正文与清楚的产品事实。社群投放使用逐渠道 UTM，区分曝光、访问、注册、试用、支付。

Google 官方参考：https://developers.google.com/search/docs/appearance/ai-features

## 招聘周期证据

电子科技大学发布的宝洁 2027 全职管理岗简章明确写网申及在线测评 9 月 1—28 日、10 月起发放 offer：
https://jiuye.uestc.edu.cn/career/recruitment/online/fx54o4c376ki

中国地质大学公告也写 9 月 28 日 23:59 截止。只能说明该轮招聘，不能说所有宝洁岗位均停止招聘。

## 可使用的社群线索

### 1. 宝洁华中地区校企咨询社群（最匹配，须核实群规）

大学就业网 2026 年 9 月 5 日公告，已通过浏览器确认正文和二维码。
https://cug.91wllm.cn/campus/view/id/1002971

二维码原图：https://cug.91wllm.cn/attachment/cug/ueditor/images/20260905/1788617869442366.png

图片左侧为“宝洁华中地区校企咨询社群”，右侧为“华中PGC社区公众号”。公告署名宝洁华中校园大使团队，公开邮箱 3038131788@qq.com，可用于询问最新入口或合作。未扫描入群，不能保证二维码目前有效、群有空位或允许商业推广。公告到期日 11 月 5 日不是二维码有效期。

### 2. 牛客社区（公开内容渠道，非已核实的微信群）

入口：https://www.nowcoder.com/

相关讨论证据：https://www.nowcoder.com/discuss/530649854976983040 （2023 年发帖，所见回复到 2024 年）；只能证明受众相关，不证明当前活跃度。适合先查最新“宝洁/管道题/网测”讨论并发布原创练习讲解，发产品链接须遵守平台当前规则，未核实商业外链权限。

### 3. 快消/校招综合交流群（匹配度较低，备选）

东华大学就业网 2026 年 9 月 9 日高露洁校招公告搜索结果提供“就业实习分享群”和“QQ群”链接。正文直接抓取超时，群文档、入群有效性及群规未验证，不能作为可直接发广告的确定渠道：
https://ejob.dhu.edu.cn/pros_wjdc/s/cms/DongHua/single/2026/09/09/26090914462736322835

- 就业实习分享群：https://docs.qq.com/doc/DR1JIV016TFdQWGVC
- QQ 群入口文档：https://docs.qq.com/doc/DR1NvS0ZiVkNxV1Va

排除：网上常见应届生论坛旧链接 forum-347-1.html 实际提示版块不存在，不建议发送给用户作为可用渠道；旧年度群号不当作当前群。

## 经管理员允许后可用的短介绍

大家好，我是这个练习网站的开发者，做了一个宝洁网测题型练习工具，可以练管道题、算术题和记忆题。注册后 24 小时内可以体验全部功能，之后可继续使用免费额度，也可以 ¥19.9 一次性开通永久会员。想找几位正在备考的同学试用，反馈哪些题型和操作还需要改善。它是独立开发的练习工具，与宝洁官方无隶属关系。

按渠道附链接并使用独立 UTM；不要宣称官方、包过或永久免费。
