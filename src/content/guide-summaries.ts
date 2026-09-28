import type { Language } from '@/lib/language';
import type { GuideSlug } from './guides';

/** Short answers describe our actual algorithms, not the employer's test specification. */
export const GUIDE_SUMMARIES: Record<Language, Record<GuideSlug, string>> = {
 zh: {
  assessment: '先以招聘通知确认题型和规则，再完成原创样题、复盘错误并尝试新题。本站提供排列、数字、图形、资料分析和基础顺序记忆练习，不提供 PEAK 模拟或完整 Grid 双任务模拟。',
  memory: '顺序记忆同时考查位置与先后次序。先熟悉圆点位置，从 3 个位置开始，观察结束后按原顺序点击；提交后找出第一个记错的位置。基础回忆练习不等同于带干扰任务的 Grid 类测评。',
  pipeline: '管道题的方框描述位置重排。先把已知输入正推到未知方框前，再把已知输出逆推到未知方框后；对照两端每个图形的位置，就能确定该方框。最后把答案代回完整管道验证。',
  figure: '图形序列题需要让同一条规则解释所有相邻图形，再预测下一幅。本站依次检查旋转、镜像、循环平移、外围移动、黑白翻转和旋转加翻转。多条规则给出不同预测时，现有信息不足以确定唯一答案。',
  numerical: '算式填空先按运算优先级建立约束，再用奇偶、整除和余数排除候选数字。每组候选都必须同时满足目标结果、数字范围和不重复条件；找到一个解不意味着只有一个解。',
  data: '资料分析先确定题目要计算的指标及分母。增长率 =（本期−基期）÷基期，占比 = 部分÷整体，比值 = 一个量÷另一个量。先统一单位，再代入表格数值，最后检查百分数与小数的转换。',
 },
 en: {
  assessment: 'Check the tasks and instructions in your invitation, work through original samples, review mistakes and try unfamiliar questions. This site offers permutation, numerical, figure, data and basic sequence-memory practice, but no PEAK simulator or complete dual-task Grid simulation.',
  memory: 'Sequence recall requires the right positions in the right order. Number the board consistently, begin with three positions and reproduce the sequence after playback. Review the first mismatch after submitting. Simple recall is not equivalent to a Grid-style dual task with intervening reasoning.',
  pipeline: 'A pipeline box reorders positions. Work forward from the input to the unknown box and backward from the output to its other side. Match each output shape to its input position to recover the missing rule, then verify it through the complete pipeline.',
  figure: 'A figure-series rule must explain every adjacent pair before predicting the next figure. This tool checks rotation, reflection, cyclic shift, perimeter movement, inversion and rotation with inversion. If matching rules predict different next figures, the supplied sequence does not determine one answer under these rules.',
  numerical: 'Turn equation blanks into constraints using the order of operations, then eliminate candidate digits with parity, divisibility and remainders. Every candidate must satisfy the target value, permitted digit range and distinct-digit requirement. Finding one valid assignment does not establish that it is unique.',
  data: 'Identify the requested measure and denominator before calculating. Growth rate is (current − baseline) ÷ baseline; share is part ÷ total; a ratio divides one quantity by another. Align units first, use the supplied figures and check the conversion between decimals and percentages.',
 },
};
