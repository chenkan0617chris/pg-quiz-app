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
  types: { slug: GuideSlug; name: string; blurb: string; toolHref: string; toolLabel: string }[];
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
      '宝洁笔试与在线测评练习平台：管道推理、图形推理、数字推理、图表数据分析四大题型，提供在线求解器、分难度题库和逐步解析。注册即享 7 天免费试用，无需绑卡。',
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
    h1: '宝洁笔试题库：四大题型在线练习与解题工具',
    lede:
      '这是一个面向宝洁及同类快消公司校招笔试的练习平台，覆盖管道推理、图形推理、数字推理和图表数据分析四种高频题型。每种题型都配有两样东西：一个能看到完整推导过程的求解器，和一个分难度、带逐步解析的练习题库。题目全部按公开题型格式生成，可以无限次练习。',
    primaryCta: { label: '开始练习', href: '/practice' },
    secondaryCta: { label: '查看解题攻略', href: '/guides' },
    typesHeading: '覆盖的四种题型',
    typesIntro:
      '每种题型都有独立的解题攻略，讲清底层结构、标准流程和常见失分点；攻略旁边就是对应的工具，可以边读边验证。',
    types: [
      {
        slug: 'pipeline',
        name: '管道推理题',
        blurb:
          '四个图形穿过一排方框，顺序被重新排列，题目藏起其中一个方框让你反推。本质是排列的复合与求逆，掌握正推加逆推的夹逼法之后可以稳定在一分钟内完成。',
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
        text: '练习题库按简单、中等、困难三档出题，答错的题会单独归档，可以只重做错题。每题都带逐步解析和动画演示。',
      },
    ],
    whyHeading: '和一般题库的区别',
    why: [
      {
        title: '题目是生成的，不会刷完',
        text: '题目按规则实时生成，不是一份固定的题库。同一档难度可以一直练下去，不存在背答案的问题。',
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
    accessHeading: '试用与价格',
    accessText:
      '注册即享 7 天免费试用，无需绑定银行卡。试用期内可以使用全部求解器和练习题库。试用结束后答题记录仍然保留，可随时购买 30 天使用权，一次性付费，不会自动续费。',
    accessCta: '查看试用与购买',
    faqHeading: '常见问题',
    faq: [
      {
        q: '这个站和宝洁公司有关系吗？',
        a: '没有。本站是独立的第三方练习工具，与宝洁公司（Procter & Gamble）无隶属、合作或授权关系。站内所有题目都是依据公开讨论的题型格式自行生成的练习题，不是任何公司的真实考题。',
      },
      {
        q: '宝洁笔试主要考哪些题型？',
        a: '公开讨论中最常提到的推理题型包括：图形顺序重排（管道题）、图形序列推理、数字与算式推理，以及基于图表的资料分析。本站覆盖的就是这四类。具体考试形式和内容以官方通知为准，不同年份和岗位可能不同。',
      },
      {
        q: '完全零基础需要练多久？',
        a: '管道推理和数字推理的方法性很强，通常两三个小时就能把流程跑顺，之后主要靠限时练准确率。图形推理需要的积累更多，建议分散在一到两周内每天做二三十题，比集中突击效果好。',
      },
      {
        q: '手机上可以用吗？',
        a: '可以，页面在手机和平板上都能正常使用。不过管道题和图形题需要点选格子录入，屏幕大一些会更顺手，建议在电脑上做系统练习。',
      },
      {
        q: '免费试用需要绑卡吗？',
        a: '不需要。注册后直接开始 7 天试用，期间不会产生任何费用，也不会自动扣款。是否购买完全由你在试用结束后决定。',
      },
    ],
  },

  en: {
    title: 'P&G Test Prep — Pipeline, Figure & Numerical Practice',
    description:
      'Practice for P&G-style online assessments: pipeline logic, figure series, numerical reasoning and data interpretation, with step-by-step solvers, a graded question bank and worked explanations. Seven-day free trial, no card required.',
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
      'This is a practice platform for P&G-style graduate assessments and similar FMCG reasoning screens, covering four recurring question types: pipeline logic, figure series, numerical reasoning and data interpretation. Each type comes with two things — a solver that shows its full working rather than just an answer, and a graded question bank with step-by-step explanations. Questions are generated from publicly described formats, so you can practise without running out.',
    primaryCta: { label: 'Start practising', href: '/practice' },
    secondaryCta: { label: 'Read the guides', href: '/guides' },
    typesHeading: 'The four question types',
    typesIntro:
      'Each type has its own guide covering the structure underneath it, a standard procedure and the mistakes that cost most marks. The matching tool sits alongside, so you can verify as you read.',
    types: [
      {
        slug: 'pipeline',
        name: 'Pipeline logic',
        blurb:
          'Four shapes pass through a row of boxes and come out reordered, with one box hidden for you to deduce. Underneath it is composition and inversion of permutations, and once the forward-and-backward squeeze method clicks, a minute per question is realistic.',
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
        text: 'Questions are produced from the underlying rules on demand rather than drawn from a fixed set. You can keep drilling one difficulty indefinitely, and memorising answers is not possible.',
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
    accessHeading: 'Trial and pricing',
    accessText:
      'Sign up for a seven-day free trial with no card required. The trial includes every solver and the full practice bank. Your history stays available after it ends, and you can buy 30 days of access at any point — a one-time payment with no automatic renewal.',
    accessCta: 'See trial and pricing',
    faqHeading: 'Frequently asked questions',
    faq: [
      {
        q: 'Is this site connected to Procter & Gamble?',
        a: 'No. This is an independent third-party practice tool with no affiliation, partnership or endorsement from Procter & Gamble. Every question is generated from publicly discussed formats and is not real test content from any company.',
      },
      {
        q: 'Which question types appear in P&G-style assessments?',
        a: 'The reasoning formats most often described publicly are shape-reordering questions (pipeline), figure sequences, numerical and equation reasoning, and chart-based data interpretation. Those four are what this site covers. The actual format and content of any assessment is set by the employer and can differ by year and by role.',
      },
      {
        q: 'How long does it take starting from scratch?',
        a: 'Pipeline and numerical reasoning are highly procedural, and two or three hours is usually enough to get the method running smoothly, after which it is timed practice for accuracy. Figure series takes more exposure; twenty or thirty questions a day spread over one to two weeks works better than cramming.',
      },
      {
        q: 'Does it work on a phone?',
        a: 'Yes, the pages work on phones and tablets. That said, pipeline and figure questions need you to tap cells to enter a question, which is easier on a larger screen, so a computer is better for sustained practice.',
      },
      {
        q: 'Does the free trial need a card?',
        a: 'No. The seven-day trial starts as soon as you sign up, nothing is charged during it, and there is no automatic billing afterwards. Whether to buy is entirely your decision at the end.',
      },
    ],
  },
};
