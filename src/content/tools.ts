import type { Language } from '@/lib/language';
import type { GuideSlug } from './guides';

export type ToolCopy = {
  /** SERP title; may carry a brand suffix the on-page heading should not repeat. */
  title: string;
  /** On-page heading, written as prose rather than as a search-result title. */
  h1: string;
  /** Short name for breadcrumbs and cross-links. */
  label: string;
  description: string;
  keywords: string[];
  /** Shown above the interactive area, so the page carries readable content on its own. */
  intro: string;
  /** Shown below it: how to read the output, and what the tool deliberately does not do. */
  notes: string[];
  guide: GuideSlug;
};

export const TOOLS: Record<'pipeline' | 'series' | 'numerical' | 'practice', Record<Language, ToolCopy>> = {
  pipeline: {
    zh: {
      title: '管道推理题在线求解器 | 宝洁笔试题库',
      h1: '管道推理题在线求解器',
      label: '管道推理',
      description:
        '输入管道方框与输入输出顺序，在线求出未知方框。显示每一级的中间序列和图形流动过程，可用于核对自己的正推与逆推是否正确。',
      keywords: ['管道题求解', '宝洁管道题在线', '图形重排计算器', '管道推理题工具'],
      intro:
        '把题目里的输入顺序、每个方框和输出顺序录进来，求解器会算出未知方框，并把每一级的中间序列都显示出来。它的用途不只是给答案——更重要的是让你逐级对照，确认自己的正推方向和逆推方向没有搞反，因为方向性错误是这类题最主要的失分来源。',
      notes: [
        '方框写成 4 位数字，含义是"新的第 n 位取自旧的第几位"。例如 3142 表示新第 1 位取旧第 3 位。',
        '只有一个未知方框时，候选项可以不填，此时求解器直接算出唯一答案；有两个或以上未知方框时必须提供候选项。',
        '求解器不做图像识别，需要你把题目录入成结构化输入。这样每一步都可验证，而不是给一个无法核对的结果。',
      ],
      guide: 'pipeline',
    },
    en: {
      title: 'Pipeline Logic Solver — Free Online Tool',
      h1: 'Pipeline logic solver',
      label: 'Pipeline logic',
      description:
        'Enter the pipeline boxes and the input and output order to solve for an unknown box. Shows every intermediate sequence and the shape flow, so you can check your own forward and backward working.',
      keywords: ['pipeline logic solver', 'shape reordering calculator', 'P&G pipeline question tool', 'permutation solver'],
      intro:
        'Enter the input order, each box and the output order from your question, and the solver works out the unknown box while displaying every intermediate sequence. The point is not only the answer: stepping through the stages lets you confirm you have not reversed the direction of the forward or backward pass, which is where most marks are lost on this question type.',
      notes: [
        'A box is written as four digits meaning "the new position n takes whatever was in old position x". So 3142 means the new first position takes the old third.',
        'With a single unknown box you can leave the candidate options blank and the solver returns the unique answer directly. With two or more unknown boxes, candidates are required.',
        'There is no image recognition; you enter the question as structured input. That keeps every step checkable rather than producing a result you cannot verify.',
      ],
      guide: 'pipeline',
    },
  },

  series: {
    zh: {
      title: '图形推理规律求解器 | 在线找规律工具',
      h1: '图形推理规律求解器',
      label: '图形推理',
      description:
        '点击格子录入连续图形，自动识别旋转、镜像、循环平移、外围移动、黑白翻转等规律，并推出下一幅图形，同时告诉你答案是否唯一。',
      keywords: ['图形推理求解', '图形找规律工具', '图形序列计算器', '3x3 方格推理'],
      intro:
        '点击方格把题目里的连续图形录进来，求解器会在支持的六类变换里寻找匹配的规律，并推出下一幅图形。它会明确区分两种结果：所有匹配规则给出同一个预测，还是不同规则给出不同预测——后者说明题目在这六类规则下并不唯一，需要结合选项判断。',
      notes: [
        '支持的变换：固定角度旋转、左右镜像、循环平移、外围顺次移动、黑白翻转，以及旋转后翻转。',
        '支持 3 到 8 幅图形，每幅为 3×3 黑白方格。',
        '如果提示"没有找到符合规则的解"，说明这道题用的规律不在上述六类之内（例如叠加、去同存异、数笔画），需要另行分析，而不是工具算错。',
      ],
      guide: 'figure',
    },
    en: {
      title: 'Figure Series Rule Solver — Find the Next Figure',
      h1: 'Figure series rule solver',
      label: 'Figure series',
      description:
        'Click cells to enter a sequence of figures. The solver identifies rotation, reflection, cyclic shift, perimeter movement and inversion rules, predicts the next figure, and states whether the answer is unique.',
      keywords: ['figure series solver', 'pattern rule finder', 'abstract reasoning tool', '3x3 grid sequence solver'],
      intro:
        'Click the cells to enter the figures from your question, and the solver searches the six supported transformation families for a match and predicts the next figure. It distinguishes clearly between two outcomes: every matching rule agreeing on one prediction, or different rules disagreeing — the second means the sequence is not uniquely determined under these rules and you need the answer options to settle it.',
      notes: [
        'Supported transformations: fixed-angle rotation, reflection, cyclic shift, perimeter movement, inversion, and rotation combined with inversion.',
        'Accepts 3 to 8 figures, each on a 3x3 black-and-white grid.',
        'If it reports no matching rule, the sequence uses a rule outside these six families — superposition, cancelling shared elements, stroke counting and so on — which needs separate analysis rather than indicating a miscalculation.',
      ],
      guide: 'figure',
    },
  },

  numerical: {
    zh: {
      title: '数字推理算式求解器 | 算式填空计算器',
      h1: '数字推理算式求解器',
      label: '数字推理',
      description:
        '搭出带空格的算式并填入目标结果，求解器会列出每个空格所有可行的数字组合，支持 1–9 或 0–9 范围以及不重复约束。',
      keywords: ['数字推理求解', '算式填空计算器', '数字组合求解', '笔试算式工具'],
      intro:
        '用下方的构建器搭出题目里的算式，标出空格并填入目标结果，求解器会列出所有满足条件的数字组合。看到解的完整分布比拿到单个答案更有价值——它能让你直观判断哪一类组合值得优先尝试，从而在限时做题时更快收敛。',
      notes: [
        '可选择数字范围 1–9 或 0–9，并可开启"不能重复"约束。这两项直接决定搜索空间，务必与题目一致。',
        '遵循标准运算优先级：先乘除后加减，括号优先。',
        '组合数过大时只显示前若干个解，并会给出提示；此时建议缩小数字范围或减少空格数。',
      ],
      guide: 'numerical',
    },
    en: {
      title: 'Numerical Equation Solver — Fill the Blanks',
      h1: 'Numerical equation solver',
      label: 'Numerical reasoning',
      description:
        'Build an equation with blanks and set a target. The solver lists every digit combination that satisfies it, with support for 1-9 or 0-9 ranges and a distinct-digits constraint.',
      keywords: ['numerical reasoning solver', 'equation blank calculator', 'digit combination solver', 'aptitude maths tool'],
      intro:
        'Use the builder to reconstruct the equation from your question, mark the blanks and set the target, and the solver lists every digit combination that works. Seeing the full set of solutions is more useful than receiving one answer: it shows you which kinds of combination are worth trying first, which is exactly what makes the difference under time pressure.',
      notes: [
        'Choose the digit range 1-9 or 0-9 and switch the no-repeats constraint on or off. Both directly change the search space, so match them to your question.',
        'Standard operator precedence applies: multiplication and division before addition and subtraction, brackets first.',
        'When the number of combinations is very large, only the first several solutions are shown with a notice. Narrow the digit range or use fewer blanks in that case.',
      ],
      guide: 'numerical',
    },
  },

  practice: {
    zh: {
      title: '笔试练习题库 | 四大题型分难度在线刷题',
      h1: '笔试练习题库',
      label: '练习题库',
      description:
        '管道推理、图形推理、数字推理与图表数据分析练习题库，按简单、中等、困难三档生成题目，每题附逐步解析，答错的题可单独重做。',
      keywords: ['笔试练习题库', '宝洁笔试练习', '推理题在线练习', '图形推理题库', '资料分析练习'],
      intro:
        '练习题库按规则实时生成题目，覆盖管道推理、图形推理、数字推理和图表数据分析四种题型，分简单、中等、困难三档。每道题提交后都会给出完整解析：管道题会逐级演示图形如何移动，图形题会指出用的是哪条变换规则，数字题和数据题会写清每一步的计算依据。做错的题会单独保存，可以只重做错题。',
      notes: [
        '题目是按规则实时生成的，不是固定题库，同一难度可以一直练下去。',
        '管道题的三档难度分别对应 1、2、3 个方框。',
        '答题记录需要登录后才会保存；未登录也可以做题，但不会留下历史记录。',
      ],
      guide: 'data',
    },
    en: {
      title: 'Practice Bank — Four Question Types, Three Levels',
      h1: 'Practice bank',
      label: 'Practice',
      description:
        'A practice bank for pipeline logic, figure series, numerical reasoning and data interpretation, generated at easy, medium and hard settings, with a worked explanation on every question and a retry list for the ones you get wrong.',
      keywords: ['aptitude test practice bank', 'P&G assessment practice', 'reasoning questions online', 'figure series practice', 'data interpretation practice'],
      intro:
        'The practice bank generates questions on demand across all four types — pipeline logic, figure series, numerical reasoning and data interpretation — at easy, medium and hard settings. Every submission comes with a full explanation: pipeline questions animate how the shapes move stage by stage, figure questions name the transformation involved, and numerical and data questions show the reasoning behind each step. Anything you get wrong is saved so you can retry just those.',
      notes: [
        'Questions are generated from the underlying rules rather than drawn from a fixed set, so one difficulty can be practised indefinitely.',
        'For pipeline questions, the easy, medium and hard settings correspond to one, two and three boxes.',
        'Your history is saved once you sign in. You can practise without an account, but nothing is kept.',
      ],
      guide: 'data',
    },
  },
};
