# 宝洁 P&G 测评练习网站：海外市场与获客验证

> 后续已按用户确认调整为 A$6.99／30 天、每种解题器 10 次免费、固定样题。以下保留初始调研记录；最新实施见 [首批执行记录](marketing/execution-2026-09-28.md)。

调研日期：2026-09-28。对象为 quiz.ckautoflow.com 的英语业务。本文是策略建议，未发布社交帖子、联系外部人员、购买广告或修改试用权益。

## 判断

存在真实的备考需求，值得用低成本实验验证。美国本地需求有近期直接讨论；澳洲招聘流程也包含在线测评，但付费需求和市场规模尚未验证。优先服务英语求职者，以美国为第一验证市场，澳洲为小规模对照。不能用 Reddit 热度推算销量，也不能把英语帖子自动归为美国用户。

这是有季节性、使用周期较短的垂直备考产品。目前没有可信的关键词月搜索量、目标国家申请人数或本站海外转化率，不能给出可靠市场规模或收入预测。

## 证据与边界

| 来源 | 发现 | 能证明什么 |
| --- | --- | --- |
| [P&G 美国官方招聘流程](https://www.pgcareers.com/us/en/hiring-process) | 申请后有在线测评；具体类型随职位变化；未通过可在 12 个月后再试 | 测评是实际招聘环节，涉及实习、毕业生和有经验候选人；不能推断每个岗位题型相同 |
| [Cincinnati Reddit，2026-05-26](https://www.reddit.com/r/cincinnati/comments/1togn7f/procter_and_gamble/) | 发帖者被记忆和逻辑测评卡住；评论建议看 YouTube、提前练习 | 美国本地社区有近期痛点与准备行为；不证明用户国籍、代表性或付费意愿 |
| [Cincinnati Reddit，2026-03-02](https://www.reddit.com/r/cincinnati/comments/1rj2gn5/how_to_get_a_job_at_pg/) | 有经验的采购从业者询问如何进入 P&G；评论提及测评门槛 | 不局限于留学生或应届生；评论不是官方录用规则 |
| [英语求职 Reddit，2025-09-25](https://www.reddit.com/r/recruitinghell/comments/1npswto/pg_assessment_test/) | 暑期实习申请者描述没有准备的压力；涉及数字、排列、点位记忆 | 题型陌生和限时压力是具体痛点；地域未验证 |
| [Prosple 澳洲 P&G 雇主资料](https://au.prosple.com/graduate-employers/procter-gamble-pg-australia) | 毕业生/实习招聘流程列在线测评，业务包括销售、品牌、财务、供应链 | 澳洲存在相应使用场景；资料更新时间不明确，不能当作当前岗位数量 |
| [JobTestPrep P&G 产品](https://www.jobtestprep.com/procter-and-gamble-assessment) | 有付费课程、免费样题、Switch/Digit/Grid/PEAK 内容 | 存在商业供应及竞争；未核验销量和动态价格，不引用其通过率或用户规模 |

排除：P&G PEAKathon 页面实际是 2023 活动，不能作为今年澳洲需求证据。菲律宾讨论不能归入美澳样本。Reddit 倾向呈现负面经历；竞品自述评价不能当作独立销量证明。

## 产品与需求的差距

依据当前代码 src/lib/practice.ts、src/components/practice/PracticePage.tsx、src/content/product-info.ts：

- Pipeline 的排列变换练习与 Switch 类需求相近，适合作为第一推广入口。
- Numerical 当前生成 a × b + c，范围较窄，扩展运算形式后更有价值。
- Figure 是图形规律题，并非交替干扰任务下的点位记忆 Grid Challenge。应明确区分，优先补记忆训练。
- 尚无完整限时模考与 PEAK 模块，不能宣传为完整官方模拟。
- 7 天全功能免费试用可能覆盖用户整个备考周期。这是商业假设，需要观察试用期内完成练习、考试时间和付款数据再决定。

建议产品顺序：免费无需注册的少量原创样题 → Switch/Digit 限时训练 → Grid 记忆训练 → 成绩与错题复习。可实验“少量免费样题 + A$4.99 的 30 天完整访问”，但保留已承诺用户的试用权益；本次未改变价格或试用。

推荐英语定位：Independent P&G-style reasoning practice, with step-by-step explanations. 原创练习、明确覆盖范围、展示 AUD 币种和访问期限。官方允许准备工具，但要求实际测评独立完成，避免以实时答案工具作为核心卖点。[官方说明](https://www.pgcareers.com/us/en/hiring-process)

## 获客顺序

### 1. 搜索内容与练习入口

首批关键词是假设，不是已验证搜索量：P&G assessment practice、P&G switch challenge practice、P&G digit challenge practice、how to prepare for P&G online assessment。目前有英文攻略，先优化相应页面，避免重复创建同主题薄页面。

每页包含：直接回答、原创可操作样例、图解步骤、覆盖限制、官方来源、更新时间和练习按钮。Grid 功能上线前只写指南，不宣传已有模拟器。美澳招聘文章必须提供真实当地流程差异，不机械复制换地名。

GEO 延续可引用内容结构，争取真实社区提及和教学资源链接。结构化数据、站点地图不保证被 AI 引用；不承诺短期排名。

### 2. YouTube 教学

先做 3 个英语录屏视频，每个 3–6 分钟：

1. P&G-Style Switch Practice: One Original Example Explained
2. Digit Practice: Finding Distinct Digits Step by Step
3. Preparing for P&G Online Assessments: What to Practise First

演示原创题，用清楚的语音和英文字幕。描述区链接到对应英语攻略/练习而非统一首页。每个长视频剪两条短片，先测试教学到练习的转化。Reddit 中主动推荐视频提供了方向性支持，不保证本频道流量。

### 3. Reddit

r/recruitinghell、r/jobs、r/cincinnati 可用于理解问题；不默认这些社区允许商业推广。先查看具体版规，必要时询问版主；提供独立完整的解题帮助，允许时才附链接，并披露作者身份。禁止批量刷旧帖、私信或伪装用户推荐。[Reddit 官方政策](https://support.reddithelp.com/hc/en-us/articles/360043504051-Spam)

可用披露句：Disclosure: I built an independent practice tool. It uses original exercises and is not affiliated with P&G. 后面再结合该帖问题给出真实帮助，不能只丢这句话和链接。

### 4. 校园社团与求职内容创作者

试点英语商科/工程求职社团，以及发布 graduate recruitment 内容的 LinkedIn/YouTube 创作者。提供免费小练习和可评估的演示资源，先验证是否有人使用，再讨论合作。社团身份、受众和允许推广的政策需要逐个核实。本次未联系任何人。

## 30 天实验

| 周次 | 工作 | 验证问题 |
| --- | --- | --- |
| 第 1 周 | 梳理英语落地页覆盖范围、免费样例与计时训练需求；定义来源和事件统计；招募 5–10 位实际备考者进行自愿访谈 | 用户是否找到对应题型？哪里不愿注册/付款？ |
| 第 2 周 | 发布首批 3 篇/次实质性攻略更新和 2 个教学视频；在允许的社区提供有用回答 | 哪类内容带来真实做题行为？ |
| 第 3 周 | 第 3 个视频；小规模社团/创作者合作试点；收集题型缺口与购买原因 | 是价格、内容覆盖、信任还是试用已足够造成流失？ |
| 第 4 周 | 按国家和来源汇总：访问 → 开始样题 → 完成练习 → 注册 → 付款 → 退款 | 是否有非熟人的真实付款及重复有效渠道？ |

可设探索目标：100 位相关访客、20 位完成练习、3–5 笔非熟人真实付款。这是验证门槛示例，不是行业基准或流量/收入保证。低于样本量只能说证据不足。SEO 收录和排名通常不能用 30 天结果直接判定成败；前期用户验证可依靠视频、社区和自愿测试者。

为每个渠道使用一致 UTM 参数，例如 utm_source=youtube、utm_medium=organic_video、utm_campaign=switch_tutorial。不要把邮箱、姓名等个人信息放进 URL；付款成功以服务器确认的订单为准，避免仅统计按钮点击。新增第三方分析服务需作为后续明确实施任务。

## 定价与广告

当前价格 A$4.99，一次购买 30 天。100 单的销售额为 A$499，1,000 单为 A$4,990，均未扣手续费、退款、税费和成本，也不是预测。

举例：假设访问到付款为 3%，每次访问的毛收入约 A$4.99 × 3% = A$0.15；这是尚未扣成本的获客上限，实际可接受 CPC 更低。没有真实转化和净收入数据前，不建议大规模 Google/Meta 广告。优先自然搜索、教学视频和少量准确的社区流量。

后续若 P&G 单品牌流量上限过低，再研究其他企业和测评类型；不能直接把现有题库改标题冒充所有企业通用模拟。
