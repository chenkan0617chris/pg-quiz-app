# 英文推广帖草稿（2026-11-10）

简报：给正在准备宝洁（P&G）线上测评的毕业生和求职者看；看完能掌握 Switch Challenge 读代码的方向规则，并拿到一个可以逐步验算的免费练习工具；依据是网站上的真实例题和 Search Console 里已出现的英文搜索词。下一步：打开 /en/pipeline 试做一题。不写用户数、通过率或"官方"字样。

每个渠道用独立 UTM，方便在 Vercel 里区分来源。

## LinkedIn（正文不放链接，链接放第一条评论）

Applying to P&G this season? One rule makes the Switch Challenge much easier:

Read the code as "where does each NEW slot come from", never "where does each old symbol go".

So 3142 means:
→ new slot 1 takes old position 3
→ new slot 2 takes old position 1
→ new slot 3 takes old position 4
→ new slot 4 takes old position 2

Flip that direction and you get a wrong answer that still looks plausible.

When there are two boxes, apply the known box first, then compare:
A B C D → [2314] → B C A D → [ ? ] → D A C B
The unknown box is 4321. Check it by substitution before moving on.

I built a free practice site around this: a step-by-step Switch Challenge solver, Digit Challenge equation practice, Grid Challenge memory rounds, PEAK question formats and timed mock tests.

It's independent and not affiliated with P&G. All questions are original, and every answer comes with a worked solution.

Link in the first comment. If you know someone going through P&G's online assessment, send this to them.

#GraduateJobs #PandG #OnlineAssessment #CareerAdvice #JobSearch

第一条评论：
Free Switch Challenge solver and practice: https://quiz.ckautoflow.com/en/pipeline?utm_source=linkedin&utm_medium=social&utm_campaign=pg_launch

## Reddit：r/SideProject（允许介绍自己的项目）

标题：I built a free step-by-step solver for the P&G Switch Challenge, plus Digit, Grid and PEAK practice

正文：
P&G's online assessment has a few short games, and the one people struggle with most is the Switch Challenge: a row of four symbols goes through a hidden box and you pick the 4-digit code that reorders them.

Most prep sites give a handful of free samples and sell the rest as a paid pack. I wanted something where you can enter any question and see every step, so I built one:

- Switch Challenge solver: enter the rows and boxes, and it solves the unknown box and shows each intermediate row
- Digit Challenge: fill equation blanks with distinct digits, and it lists every valid answer
- Grid Challenge: remember dot positions while answering symmetry questions
- PEAK: rating, forced-choice and scenario formats
- Timed mock tests with a per-question report

The trick that helped me most: read a code like 3142 as "new slot 1 takes old position 3", never "old symbol 1 goes to position 3".

It's independent (not affiliated with P&G), the questions are original, and it works in English and Chinese. Sign-in gives 24 hours of full access, then a free allowance per type.

https://quiz.ckautoflow.com/en?utm_source=reddit&utm_medium=social&utm_campaign=pg_launch

I'd really like feedback on what's confusing or missing, especially from anyone who has sat the real thing recently.

## Product Hunt

- 名称：CK Quiz
- Tagline（≤60）：Free practice and step-by-step solvers for P&G assessments
- 描述（≤260）：Practise the P&G online assessment: a Switch Challenge solver that shows every step, Digit Challenge equation practice, Grid Challenge memory rounds, PEAK question formats and timed mock tests. Original questions in English and Chinese. Not affiliated with P&G.
- 链接：https://quiz.ckautoflow.com/en?utm_source=producthunt&utm_medium=launch&utm_campaign=pg_launch
- Topics：Education、Hiring、Productivity
- 价格：Free（含付费选项）
- 图片：至少 2 张 1270×760 截图（Switch 解题器逐步结果、模拟考报告、Grid 训练）
- 发布时间：建议周二到周四，美西时间 00:01 开始

Maker 首条评论：
Hi Product Hunt! I built CK Quiz after seeing how little free, interactive practice exists for P&G's online assessment. Most prep sites give a few samples and sell the rest.

The core is a Switch Challenge solver: enter any question and it solves the hidden box and shows every intermediate row, so you learn the method instead of memorising answers. There's also Digit and Grid Challenge practice, PEAK question formats and timed mock tests.

It's independent and not affiliated with P&G. I'd love feedback on what would make it more useful before your next assessment.

## 发布状态（2026-11-10）

- LinkedIn 第 1 条（Switch Challenge）：已发布，链接在第一条评论；发布 12 分钟时 203 次曝光。
- LinkedIn 第 2 条（Digit Challenge，配图 launch-assets/digit-solver.png）：已用 LinkedIn 自带定时功能排在 2026-11-11 周三 8:00（悉尼时间）。定时帖无法预先发评论，所以链接写在正文末尾（utm_campaign=pg_digit）。修改或取消：LinkedIn → Start a post → 时钟图标 → Scheduled。
- Reddit：Claude in Chrome 不允许访问 reddit.com，需要手动发，文案见上。
- Product Hunt：Chrome 中未登录 PH，需要先自己登录。图库图片已按 1270×760 准备好：launch-assets/ph-switch-solver.png、launch-assets/ph-digit-solver.png。

### LinkedIn 第 2 条正文

P&G Digit Challenge: stop guessing digits. Put a range on the product first.

Example: _ × _ + _ = 47, digits 1–9, no repeats.

The last blank is between 1 and 9, so the product must be between 38 and 46.

Two different single digits only multiply to 40, 42 or 45 in that range:
→ 5 × 8 = 40, so the last digit is 7
→ 6 × 7 = 42, so it's 5
→ 5 × 9 = 45, so it's 2

Three checks instead of trying hundreds of combinations. The solver in the image confirms there are exactly 6 answers once you count the swapped order.

The same move works on longer equations: start with the operation that moves the total most, bound it, then fill the gap.

This is one of the tools on the free P&G practice site I shared yesterday: Switch, Digit and Grid Challenge practice, PEAK question formats and timed mock tests. Independent, not affiliated with P&G.

Try the Digit Challenge solver: https://quiz.ckautoflow.com/en/numerical?utm_source=linkedin&utm_medium=social&utm_campaign=pg_digit

#GraduateJobs #PandG #OnlineAssessment #CareerAdvice #JobSearch

## 更新（2026-11-10 晚）

- LinkedIn 排期（悉尼时间）：
  - 11-11 周三 8:00 —— Switch Challenge 进阶：已知方框在未知方框之后（先撤销已知方框），配图 launch-assets/switch-two-box.png，答案 3142，链接 utm_campaign=pg_switch2。
  - 11-12 周四 8:00 —— Digit Challenge（由原定 11-11 改期）。
- Product Hunt：草稿已建好并自动保存（My launches → Drafts → CK Quiz），尚未排期发布。
  - 名称 CK Quiz；tagline、描述、首条评论见上文。
  - 图库顺序：Switch 两方框 → 模拟考预览 → 模拟考报告 → Digit → Grid（launch-assets/ph-*.png，1270×760）；Logo 自动取自网站。
  - 定价 Free Options；标签 Education、Career、Productivity；角色 I made this。
  - 还需：选择发布日期后点 Schedule launch。
