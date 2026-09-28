import type { Language } from '@/lib/language';
import type { Faq } from './blocks';
import type { GuideSlug } from './guides';

export type HomeCopy = {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  lede: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  typesHeading: string;
  typesIntro: string;
  types: { slug: GuideSlug | 'memory'; name: string; blurb: string; toolHref: string; toolLabel: string }[];
  howHeading: string;
  how: { title: string; text: string }[];
  whyHeading: string;
  why: { title: string; text: string }[];
  accessHeading: string;
  accessText: string;
  accessCta: string;
  faqHeading: string;
  faq: Faq[];
};

export const HOME: Record<Language, HomeCopy> = {
  zh: {
    title: '宝洁笔试题库 | 管道·图形·数字推理在线练习',
    description:
      '宝洁笔试与在线测评练习平台：管道推理、图形推理、数字推理、图表数据分析、顺序记忆五大题型，提供在线求解器、分难度题库和逐步解析。每种解题器各享 10 次免费机会，并可练习固定样题，无需绑卡。',
    keywords: [
      '宝洁笔试',
      '宝洁笔试题库',
      '宝洁在线测评',
      '宝洁管道题',
      '图形推理题',
      '数字推理题',
      '宝洁校招笔试',
      'P&G 笔试',
      '快消管培生笔试',
    ],
    h1: '宝洁笔试题库：五大题型在线练习与解题工具',
    lede:
      '这是一个面向宝洁及同类快消公司校招笔试的练习平台，覆盖管道推理、图形推理、数字推理、图表数据分析和顺序记忆五种题型。管道、图形和数字题配有在线求解器，各题型提供练习与反馈，记忆题支持正确顺序回放。题目全部按公开题型格式生成，可以无限次练习。',
    primaryCta: { label: '开始练习', href: '/practice' },
    secondaryCta: { label: '查看解题攻略', href: '/guides' },
    typesHeading: '覆盖的五种题型',
    typesIntro:
      '每种题型都有独立的解题攻略，讲清底层结构、标准流程和常见失分点；攻略旁边就是对应的工具，可以边读边验证。',
    types: [
      { slug: 'memory', name: '记忆力训练', blurb: '记住蓝色板上粉色圆点依次亮起的位置，再按原顺序点击。支持 3、5、7 个位置，提交后可以回看正确顺序。', toolHref: '/memory', toolLabel: '开始记忆训练' },
      {
        slug: 'pipeline',
        name: '管道推理题',
        blurb:
          '四个图形穿过一排方框，顺序被重新排列，题目藏起其中一个方框让你反推。本质是排列的复合与求逆，可以通过正推与逆推逐步确定未知规则，再代回验证。',
        toolHref: '/pipeline',
        toolLabel: '管道题求解器',
      },
      {
        slug: 'figure',
        name: '图形推理题',
        blurb:
          '给出一串连续图形，要求推出下一幅。支持固定旋转、镜像、循环平移、外围移动、黑白翻转和旋转后翻转六类变换，求解器会告诉你规律是否唯一。',
        toolHref: '/series',
        toolLabel: '图形规律求解器',
      },
      {
        slug: 'numerical',
        name: '数字推理题',
        blurb:
          '在挖空的算式里填入符合目标结果的数字。关键不是算得快，而是用余数、整除性和奇偶性把候选组合从几百个压到几个。求解器会列出全部可行解。',
        toolHref: '/numerical',
        toolLabel: '数字推理求解器',
      },
      {
        slug: 'data',
        name: '图表数据分析题',
        blurb:
          '从表格和图表里读数并计算增长率、占比或比值。失分几乎都来自分母选错和单位看漏，练习题库的每道题都会写清分子分母的来源。',
        toolHref: '/practice',
        toolLabel: '数据分析练习',
      },
    ],
    howHeading: '怎么用这个站',
    how: [
      {
        title: '第一步：读攻略，建立流程',
        text: '每篇攻略都给出一套固定的排查顺序，而不是零散技巧。先把流程读完，知道每一步该排除什么，再开始做题，效率差别很大。',
      },
      {
        title: '第二步：用求解器验证推导',
        text: '求解器会显示每一步的中间结果，而不只是给答案。用它检查自己的正推和逆推方向对不对，把系统性错误在刷题之前先排掉。',
      },
      {
        title: '第三步：进题库限时刷量',
        text: '练习题库按简单、中等、困难三档出题，答错的题会单独归档，可以只重做错题。每题都带逐步解析，管道题另有动画演示。',
      },
    ],
    whyHeading: '和一般题库的区别',
    why: [
      {
        title: '题目是生成的，不会刷完',
        text: '题目按规则实时生成，可以重复练习同一档难度。部分题目可能重复，建议关注推导过程，而不只是记住答案。',
      },
      {
        title: '解析讲的是方法，不是答案',
        text: '每道题的解析都还原完整推导：管道题会逐级演示图形怎么移动，图形题会指出用的是哪条变换规则，数字题会给出拆解顺序。',
      },
      {
        title: '错题单独归档',
        text: '做错的题会保留下来，可以只重做错题。同一类错误重复出现，往往说明流程里某一步没有固定下来。',
      },
      {
        title: '中英文完整对照',
        text: '全站中英双语，同一道题可以切换语言查看。准备英文测评时，可以直接熟悉英文题干里的表述方式。',
      },
    ],
    accessHeading: '免费体验与会员价格',
    accessText:
      '每个账号的管道、图形和数字解题器各有 10 次免费机会，独立累计，不每日重置；每种练习题型开放 5 道固定样题；记忆训练累计免费 10 轮，其他样题可重复作答并查看解析。购买会员后可在 30 天内继续使用解题器、生成更多新题，一次付款，不自动续费。',
    accessCta: '查看免费体验与会员',
    faqHeading: '常见问题',
    faq: [
      {
        q: '这个站和宝洁公司有关系吗？',
        a: '没有。本站是独立的第三方练习工具，与宝洁公司（Procter & Gamble）无隶属、合作或授权关系。站内所有题目都是依据公开讨论的题型格式自行生成的练习题，不是任何公司的真实考题。',
      },
      {
        q: '宝洁笔试主要考哪些题型？',
        a: '公开讨论中最常提到的推理题型包括：图形顺序重排（管道题）、图形序列推理、数字与算式推理，以及基于图表的资料分析。本站覆盖这四类，并提供顺序记忆训练。具体考试形式和内容以官方通知为准，不同年份和岗位可能不同。',
      },
      {
        q: '完全零基础需要练多久？',
        a: '准备时间因基础而异。建议先完成一组练习记录正确率，读完对应攻略后重做错题，再逐步加入计时。本站没有验证过的学习时长或通过率保证。',
      },
      {
        q: '手机上可以用吗？',
        a: '可以，页面在手机和平板上都能正常使用。不过管道题和图形题需要点选格子录入，屏幕大一些会更顺手，建议在电脑上做系统练习。',
      },
      {
        q: '免费机会如何计算，需要绑卡吗？',
        a: '无需绑卡。每个账号每种解题器各有 10 次免费机会，输入校验失败不扣次数，成功求解（包括没有找到可行解）计一次，不每日重置。记忆训练累计免费 10 轮，每开始一轮扣 1 次；其他固定样题可以反复练习。已有的 7 天试用保留至原到期时间。',
      },
    ],
  },

  en: {
    title: 'P&G Test Prep — Pipeline, Figure & Numerical Practice',
    description:
      'Practice for P&G-style online assessments: pipeline logic, figure series, numerical reasoning and data interpretation, with step-by-step solvers, a graded question bank and worked explanations. 10 free uses per solver and fixed practice samples; no card required.',
    keywords: [
      'P&G online assessment',
      'P&G aptitude test practice',
      'P&G test prep',
      'pipeline logic questions',
      'figure series practice',
      'numerical reasoning practice',
      'graduate aptitude test practice',
      'FMCG assessment practice',
    ],
    h1: 'P&G Test Prep: Four Question Types, Solvers and a Practice Bank',
    lede:
      'This is a practice platform for P&G-style graduate assessments and similar FMCG reasoning screens, covering five question types: pipeline logic, figure series, numerical reasoning, data interpretation and sequence memory. Pipeline, figure and numerical questions have dedicated solvers; all five types have practice with feedback, including sequence replay for memory exercises. Questions are generated from publicly described formats, so you can practise without running out.',
    primaryCta: { label: 'Start practising', href: '/practice' },
    secondaryCta: { label: 'Read the guides', href: '/guides' },
    typesHeading: 'The five question types',
    typesIntro:
      'Each type has its own guide covering the structure underneath it, a standard procedure and the mistakes that cost most marks. The matching tool sits alongside, so you can verify as you read.',
    types: [
      { slug: 'memory', name: 'Sequence memory', blurb: 'Watch pink dots light up on a blue board, then repeat their order. Practise 3, 5 or 7 positions and replay the correct sequence after submitting.', toolHref: '/memory', toolLabel: 'Train your memory' },
      {
        slug: 'pipeline',
        name: 'Pipeline logic',
        blurb:
          'Four shapes pass through a row of boxes and come out reordered, with one box hidden for you to deduce. Underneath it is composition and inversion of permutations, and forward and backward reasoning lets you determine the unknown rule and check it against the full sequence.',
        toolHref: '/pipeline',
        toolLabel: 'Pipeline solver',
      },
      {
        slug: 'figure',
        name: 'Figure series',
        blurb:
          'Given a sequence of figures, work out the next one. The solver checks six families of transformation — fixed rotation, reflection, cyclic shift, perimeter movement, inversion, and rotation with inversion — and tells you whether the rule is unique.',
        toolHref: '/series',
        toolLabel: 'Figure rule solver',
      },
      {
        slug: 'numerical',
        name: 'Numerical reasoning',
        blurb:
          'Fill the blanks in an equation so it reaches a target. The skill is not calculating quickly but using remainders, divisibility and parity to cut hundreds of candidates down to a few. The solver lists every valid solution.',
        toolHref: '/numerical',
        toolLabel: 'Numerical solver',
      },
      {
        slug: 'data',
        name: 'Data interpretation',
        blurb:
          'Read figures from tables and charts to compute growth, share or ratio. Almost every lost mark comes from the wrong denominator or a missed unit, so every question in the bank spells out where the numerator and denominator came from.',
        toolHref: '/practice',
        toolLabel: 'Data practice',
      },
    ],
    howHeading: 'How to use this site',
    how: [
      {
        title: 'First, read the guide and adopt a procedure',
        text: 'Each guide gives one fixed checking order rather than a scattering of tips. Reading it through first, so you know what each step eliminates, makes a large difference to how fast questions go.',
      },
      {
        title: 'Then use the solver to check your working',
        text: 'The solvers display every intermediate result, not just the answer. Use them to confirm you have the direction right in both the forward and backward passes, and clear out systematic errors before you start drilling.',
      },
      {
        title: 'Finally, drill against the clock',
        text: 'The practice bank generates questions at easy, medium and hard settings. Anything you get wrong is kept separately so you can retry just those, and every question comes with a worked explanation and, for pipeline questions, an animated walkthrough.',
      },
    ],
    whyHeading: 'What makes this different from a static question bank',
    why: [
      {
        title: 'Questions are generated, so you cannot exhaust them',
        text: 'Questions are produced from the underlying rules on demand rather than drawn from a fixed set. You can keep practising at one difficulty. Questions may repeat, so focus on the reasoning rather than memorising an answer.',
      },
      {
        title: 'Explanations teach the method, not the answer',
        text: 'Every explanation reconstructs the full reasoning: pipeline questions animate how shapes move stage by stage, figure questions name the transformation involved, and numerical questions show the order in which to break the equation down.',
      },
      {
        title: 'Wrong answers are kept for retry',
        text: 'Questions you get wrong are stored so you can redo only those. A mistake that keeps recurring usually means one step of your procedure has not settled yet.',
      },
      {
        title: 'Full Chinese and English parity',
        text: 'The whole site runs in both languages and you can switch on any question. If you are preparing for an assessment in English, you can get used to how these questions are worded before it matters.',
      },
    ],
    accessHeading: 'Free access and pricing',
    accessText:
      'Each account gets 10 lifetime free uses of each solver and 5 fixed samples per practice type, with full explanations. Memory training has 10 lifetime free rounds, one credit per start. Allowances do not reset daily. Buy 30-day access for continued solving and new generated questions. One-time payment, no automatic renewal.',
    accessCta: 'See free access and pricing',
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'Is this site connected to Procter & Gamble?',
        a: 'No. This is an independent third-party practice tool with no affiliation, partnership or endorsement from Procter & Gamble. Every question is generated from publicly discussed formats and is not real test content from any company.',
      },
      {
        q: 'Which question types appear in P&G-style assessments?',
        a: 'The reasoning formats most often described publicly are shape-reordering questions (pipeline), figure sequences, numerical and equation reasoning, and chart-based data interpretation. This site covers those four and adds sequence-memory practice. The actual format and content of any assessment is set by the employer and can differ by year and by role.',
      },
      {
        q: 'How long does it take starting from scratch?',
        a: 'Preparation time depends on your starting point. Try a set to measure accuracy, read the relevant guide, retry your mistakes and then introduce a timer. We do not claim a verified preparation time or pass-rate guarantee.',
      },
      {
        q: 'Does it work on a phone?',
        a: 'Yes, the pages work on phones and tablets. That said, pipeline and figure questions need you to tap cells to enter a question, which is easier on a larger screen, so a computer is better for sustained practice.',
      },
      {
        q: 'How do free uses work, and is a card required?',
        a: 'No card is required. Each account gets 10 free uses per solver, with no daily reset. Invalid inputs do not count; a completed solve counts even when no solution is found. Memory has 10 lifetime free rounds; other fixed samples can be repeated. Existing seven-day trials are honoured until their original expiry.',
      },
    ],
  },
};
