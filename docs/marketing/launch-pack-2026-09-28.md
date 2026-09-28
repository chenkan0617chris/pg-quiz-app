# 首批海外推广内容包

状态：内容已准备，未发布到外部账号。需要用户提供实际频道/主页并确认使用哪个身份。全部定位为独立原创练习，不声称官方授权、真题或通过率。当前套餐：A$6.99／30 天，一次付款，不自动续费；每个账号每种解题器 10 次免费，每种练习题型 5 道固定样题。

## 1. LinkedIn：排列题教学帖

**正文（可直接发布）**

The hardest part of a shape-reordering question is often reading the direction correctly.

Try this original example:

Input: A B C D
Output: C A D B

Number the input positions 1–4. Then read the output from left to right:
C came from position 3.
A came from position 1.
D came from position 4.
B came from position 2.

So the rule is 3142. Verify it by taking input positions 3, 1, 4, 2.

I built an independent practice tool with worked explanations for this kind of reasoning. The guide is public; signed-in accounts get 10 free uses per solver and five fixed samples per practice type.

It is not affiliated with P&G, and these are original practice questions. Use it to prepare before an assessment, not for real-time assistance during one.

Guide: https://quiz.ckautoflow.com/en/guides/pipeline?utm_source=linkedin&utm_medium=organic_social&utm_campaign=assessment_launch&utm_content=permutation_example

#GraduateCareers #Reasoning #AssessmentPreparation

配图：public/learn/permutation-example.svg。若平台不接受 SVG，发布前由原文件导出 PNG；不要上传截图导致文字模糊。

## 2. LinkedIn：数字题教学帖

Before trying random digits, use the last blank to bound the product.

Original example: a × b + c = 23.
Use different digits from 1 to 9.

Because c is between 1 and 9, a × b must be between 14 and 22.
Try 3 × 6 = 18. Then c = 5.

3 × 6 + 5 = 23, and all three digits are different.

That is one valid answer, not necessarily the only one. Always check the range, distinct-digit rule and final result.

I have written a public guide explaining this method, with an independent practice tool for trying more examples. It is not official P&G assessment content.

https://quiz.ckautoflow.com/en/guides/numerical?utm_source=linkedin&utm_medium=organic_social&utm_campaign=assessment_launch&utm_content=digit_example

#NumericalReasoning #GraduateJobs #AssessmentPreparation

配图：public/learn/numerical-example.svg。

## 3. Reddit：针对有人问如何准备排列题的回复草稿

仅用于与问题确实相关、允许作者分享的讨论；发帖前核对具体版规。不要复制粘贴到多个旧帖，不批量私信，不装作付费用户。

A useful starting point is to treat the code as “which input position do I read next?” rather than “where does each shape move?”

For example, ABCD → CADB gives 3142: read input positions 3, 1, 4, 2. Check the result by applying that code again to the original input. With more than one box, work forward through the known boxes before the missing one, and backward through the known boxes after it.

Disclosure: I built an independent practice tool and wrote a guide on this. It uses original exercises and is not affiliated with P&G. The guide is public; the interactive tools have limited free access. Follow the instructions in your own assessment invitation.

可选链接（仅版规允许时附加）：
https://quiz.ckautoflow.com/en/guides/pipeline?utm_source=reddit&utm_medium=community&utm_campaign=assessment_launch&utm_content=helpful_reply

这是待适配草稿，不是已找到允许推广的帖子。r/jobs、r/recruitinghell、r/cincinnati 是研究来源，不等于可投放广告的频道。

## 4. YouTube 视频 1：排列规则（录制稿）

标题：Switch-Style Practice: One Original Example Explained

目标成片：约 2 分钟；以下为旁白与画面脚本，尚未录制或导出视频。

- 0:00–0:15：显示 ABCD → CADB。旁白：“Before trying to solve a reordering puzzle quickly, make sure you know which direction the rule describes. Here is an original example you can check yourself.”
- 0:15–0:40：逐个标出输入位置 1、2、3、4。旁白：“Our rule tells us which input position to read for each output position. The first output is C. C is third in the input, so the first digit is three.”
- 0:40–1:05：依次高亮 A、D、B，显示 3、1、4、2。旁白：“A comes from position one. D comes from position four. B comes from position two. That gives three, one, four, two.”
- 1:05–1:30：按规则取出输入，重新得到 CADB。旁白：“Now verify the direction. Take the third input, then the first, fourth and second. You recover C, A, D, B. A code should be checked, not just guessed from the picture.”
- 1:30–1:50：展示攻略中两端夹逼的方法，不输入任何真实考试题。旁白：“For several boxes, work forward to the missing box and backward from the final output. The guide below has a worked example.”
- 1:50–2:05：展示网站与免费规则。旁白：“This is independent practice, not official test content. Read the free guide, then sign in if you want to try the sample exercises. Prepare before your assessment and follow the employer’s instructions.”

描述区：
Learn position reordering with an original worked example. Independent practice, not affiliated with P&G. Public guide; 10 free uses per solver and 5 fixed samples per practice type after sign-in. Optional full access: A$6.99 for 30 days, no automatic renewal.
https://quiz.ckautoflow.com/en/guides/pipeline?utm_source=youtube&utm_medium=organic_video&utm_campaign=assessment_launch&utm_content=switch_tutorial

## 5. YouTube 视频 2：数字约束（录制稿）

标题：Digit-Style Practice: Find Distinct Digits Step by Step

- 开场：展示 a × b + c = 23，强调 1–9 与不重复规则。
- 第一步旁白：“The last digit is between one and nine. Subtract those limits from twenty-three: the product has to be between fourteen and twenty-two.”
- 第二步旁白：“Try three times six. That gives eighteen, leaving five for the final blank.”
- 验证旁白：“Three, six and five are permitted and different. Three times six plus five is twenty-three. There may be other solutions; finding one is not proof that it is unique.”
- 常见错误：说明不能先加后乘，也不能只检查结果而忽略重复数字。
- 结尾：说明本站练习生成题目前以 a × b + c 为主，不是完整官方 Digit 模拟；进入详细攻略和免费样题。

描述链接：
https://quiz.ckautoflow.com/en/guides/numerical?utm_source=youtube&utm_medium=organic_video&utm_campaign=assessment_launch&utm_content=digit_tutorial

## 6. YouTube 视频 3：记忆练习（录制稿）

标题：Dot Memory Practice: Remember Positions in the Right Order

- 开场：蓝板、粉色圆点，展示位置编号 1–9。
- 示范：2 → 7 → 4，观察阶段不点击，播放后按相同顺序点击。
- 讲解：“Remembering the correct locations is only half the task. Two, four, seven contains the same locations but the wrong order.”
- 复盘：故意演示错序，提交后回看正确顺序；找出第一个出错位置。
- 难度：从 3 个位置开始，说明会员支持生成新顺序与 5、7 个位置选择；固定样题适合熟悉界面。
- 范围说明：“This is basic sequence recall. It does not include intervening symmetry or rotation tasks, so it is not a complete Grid Challenge simulation.”

描述链接：
https://quiz.ckautoflow.com/en/guides/memory?utm_source=youtube&utm_medium=organic_video&utm_campaign=assessment_launch&utm_content=memory_tutorial

## 7. 首两周发布顺序（建议，未设置自动发布）

1. 先发布排列教学及对应文章链接；检查链接能到达英语页面。
2. 隔 2–3 天发布数字教学，避免重复介绍产品而没有新内容。
3. 发布圆点记忆演示；强调基础练习与完整双任务模拟的区别。
4. 在真实且相关的讨论中提供完整解答，仅在社区允许时放链接。
5. 两周后看真实访客来源、练习启动和付款记录。互动量不等于付费意愿。

## 8. 衡量与执行边界

- UTM 已按来源、媒介、活动、素材命名，链接公开可用。不能声称目前能将 UTM 自动关联到每笔付款。
- 现有 Vercel Web Analytics 用于访问趋势；本次新增 scripts/growth-report.mjs 输出账户、题型使用、免费额度耗尽和真实订单聚合数据。
- 30 天报告命令：node --env-file=.env.local scripts/growth-report.mjs 30。结果包含口径限制，不含邮箱、用户 ID 或答案。
- 尚需实际账号：YouTube 频道、LinkedIn 主页或 Reddit 用户名。未经明确指定，不代用户挑选陌生身份发帖。

## 可直接上传的配图

两幅例题图均已导出 1200 × 675 PNG：`public/learn/permutation-example.png`、`public/learn/numerical-example.png`。SVG 源文件保留。新攻略尚未部署，发布含这些链接的帖子前需要先上线并验证链接。
