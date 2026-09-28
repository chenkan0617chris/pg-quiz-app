import type { GuideCopy } from './guides.zh';
import type { Language } from '@/lib/language';

export const PREPARATION_GUIDES: Record<Language,Record<'assessment'|'memory',GuideCopy>> = {
 en: {
  assessment: {
   title:'P&G Assessment Preparation: What to Practise First',
   description:'Prepare for P&G online assessments with a practical study plan, original Switch-style and numerical examples, memory practice and clear tool coverage.',
   keywords:['P&G assessment preparation','P&G online assessment practice','P&G test preparation','Switch challenge practice','Digit challenge practice'],
   h1:'How to prepare for P&G online assessments',
   lede:'Start with the assessment instructions in your invitation, learn the rules of the relevant tasks, then practise with feedback. This guide helps you choose a starting point and understand what our independent practice covers. It is a study plan, not a collection of actual P&G test questions.',
   published:'2026-09-28',updated:'2026-09-28',toolHref:'/practice',toolLabel:'Try the fixed practice samples',
   body:[
    {type:'h2',text:'1. Check the assessment you have actually been invited to take'},
    {type:'p',text:'P&G lists assessments between application and interviews. The types vary by role; an invitation may include work-related attitudes and cognitive tasks. Read your own instructions for timing, device requirements and accessibility arrangements before deciding what to practise. An internship, graduate application and experienced role need not have identical assessments.'},
    {type:'note',text:'P&G encourages preparation but requires candidates to complete the actual assessment independently, without real-time assistance. Use practice and worked solutions before your assessment. The official hiring-process source is linked below.'},
    {type:'h2',text:'2. Match each practice task to the skill you want to improve'},
    {type:'ul',items:[
     'Switch-style permutation practice: our pipeline exercises teach position reordering, forward calculation and working backward through known rules.',
     'Digit-style numerical practice: our generated exercises use distinct digits in a × b + c. The numerical solver accepts additional supported expressions; this is not a full simulation of every numerical task.',
     'Sequence-memory practice: watch dots on a scattered-dot board and repeat their order. It trains sequence recall; it does not reproduce a Grid Challenge with intervening symmetry or rotation tasks.',
     'Figure series and data interpretation: supplementary reasoning practice, not a claim that these exact tasks appear in every P&G assessment.',
     'PEAK or work-style questions: this site has no PEAK simulator or answer key. Read the employer’s instructions and answer about your own experience and preferences.'
    ]},
    {type:'h2',text:'3. Try an original example before adding time pressure'},
    {type:'example',title:'Permutation example: A B C D → C A D B',lines:[
     'Number the input positions: A=1, B=2, C=3, D=4.',
     'Read the output from left to right and find each symbol in the input.',
     'C is at position 3; A at 1; D at 4; B at 2. The rule is 3142.',
     'Check by taking input positions 3, 1, 4, 2. You get C A D B.'
    ]},
    {type:'example',title:'Numerical example: a × b + c = 23, distinct digits from 1–9',lines:[
     'Because c is between 1 and 9, a × b must be between 14 and 22.',
     'Try 3 × 6 = 18, so c = 23 − 18 = 5.',
     '3, 6 and 5 are distinct permitted digits; 3 × 6 + 5 = 23.',
     'This is one valid assignment, not proof of a unique solution.'
    ]},
    {type:'h2',text:'4. Use a short practice-and-review cycle'},
    {type:'ol',items:[
     'Complete a sample without a timer and explain the rule in your own words.',
     'Review why you missed it: instruction reading, position direction, arithmetic or recall order.',
     'Repeat the method on a different question. Memorising the previous answer does not show you have learned the rule.',
     'Once your method is reliable, use an external timer and record accuracy as well as elapsed time. The current practice bank is not a calibrated timed mock exam.',
     'Before the real assessment, follow the invitation and official preparation instructions. No practice score here predicts a passing threshold.'
    ]},
    {type:'h2',text:'5. Decide whether you need more practice'},
    {type:'p',text:'After signing in, each solver has 10 free uses per account and each practice type has 5 fixed samples with explanations. Repeating samples helps learn the interface. If you need unfamiliar questions and continued solving, see the current 30-day access option in the pricing link below. Buying access is optional and does not guarantee an assessment result.'},
   ],
   faq:[
    {q:'Is the P&G assessment the same for everyone?',a:'No. P&G says assessment types depend on the role and other factors. Use your invitation and official guidance; do not assume another applicant’s experience is your exact test.'},
    {q:'Do I need to pay to start practising?',a:'No. The guides are public. After signing in, you can use 10 free solves per solver and 5 fixed samples per practice type. Paid access provides more generated practice and continued solving.'},
    {q:'Does this site include official P&G questions?',a:'No. Exercises are original and the site is independent of P&G. We do not provide a full official simulation, PEAK answers or a pass guarantee.'},
    {q:'How should I use the memory trainer?',a:'Learn to recall ordered positions, then gradually increase sequence length. This trainer does not include the intervening reasoning tasks found in some dual-task memory assessments.'}
   ]
  },
  memory: {
   title:'Sequence Memory Practice: Dot Recall and Grid Differences',
   description:'Learn ordered dot recall with a worked example, a gradual practice routine and an explanation of how simple memory training differs from Grid Challenge.',
   keywords:['sequence memory practice','dot memory practice','P&G memory assessment preparation','Grid challenge practice'],
   h1:'Sequence memory practice: remember the order, not just the dots',
   lede:'In sequence-memory practice, several positions light up one after another. Your task is to recall both the locations and their order. Our trainer uses a blue board with 25 scattered white dots and pink dots, with sequences of 3, 5 or 7 distinct positions. It is an original recall exercise, not a full Grid Challenge simulator.',
   published:'2026-09-28',updated:'2026-09-28',toolHref:'/memory',toolLabel:'Open sequence-memory practice',
   body:[
    {type:'h2',text:'1. Understand the difference between simple recall and a dual task'},
    {type:'p',text:'Simple sequence recall asks you to watch positions and reproduce their order. A dual-task memory exercise adds another job between observations, such as judging symmetry, which interrupts rehearsal. Success on simple recall does not establish readiness for that combined task. Our current trainer supports ordered recall only.'},
    {type:'h2',text:'2. Follow positions in order'},
    {type:'example',title:'Original example: positions 2 → 7 → 4',lines:[
     'The 25 white dots stay in the same positions during playback and recall.',
     'Position 2 is near the upper centre; 7 is on the left; 4 is upper-right.',
     'During observation, notice the path: upper centre → left → upper-right.',
     'After playback, click those same positions in that order. Clicking 2 → 4 → 7 uses the right locations but the wrong sequence.'
    ]},
    {type:'h2',text:'3. Practise one manageable step at a time'},
    {type:'ol',items:[
     'Begin with three positions and wait until playback finishes before clicking.',
     'After a mistake, identify the first position where your sequence diverged. Review the correct sequence after submitting.',
     'Try describing the path spatially or rehearsing position numbers during practice. Keep the approach that helps you reproduce unfamiliar sequences accurately.',
     'Move to five positions when three feels reliable; try seven after that. This is a suggested progression, not a validated passing standard.',
     'Use new sequences to check progress. Recalling a fixed sample from repetition is useful familiarisation, but not an independent measure of working memory.'
    ]},
    {type:'h2',text:'4. Avoid common practice mistakes'},
    {type:'ul',items:[
     'Remembering the set of positions while losing their order.',
     'Clicking before the observation phase has ended.',
     'Changing how you number the board between attempts.',
     'Treating a correct answer on a familiar sample as evidence of general improvement.',
     'Assuming simple dot recall reproduces every employer’s memory assessment.'
    ]},
    {type:'h2',text:'5. What is available in this trainer'},
    {type:'p',text:'Free accounts can repeat five fixed memory samples with feedback. Paid access lets you generate new sequences and select 3, 5 or 7 positions. The board supports touch, mouse and keyboard navigation. Playback accepts no answers; after you complete the sequence and submit, the explanation lets you replay the correct order.'},
   ],
   faq:[
    {q:'Is this a full P&G Grid Challenge simulator?',a:'No. It is a sequence-recall trainer. It does not include intervening symmetry or rotation tasks and does not reproduce an employer’s adaptive scoring.'},
    {q:'Can I practise memory for free?',a:'Yes. Sign in to repeat five fixed memory samples and view feedback. Paid access unlocks new generated sequences and difficulty selection.'},
    {q:'Does the order of clicks matter?',a:'Yes. The whole sequence must match. Selecting the same positions in a different order is marked incorrect.'},
    {q:'Will a good practice score mean I pass the real assessment?',a:'No. These original exercises do not provide a validated prediction of any employer’s assessment score or hiring decision.'}
   ]
  }
 },
 zh: {
  assessment: {
   title:'宝洁在线测评怎么准备｜题型选择与备考步骤',
   description:'从招聘通知出发准备宝洁在线测评：管道重排、数字填空和记忆训练的原创例题、练习步骤，以及本站工具覆盖范围与免费额度。',
   keywords:['宝洁在线测评准备','宝洁笔试练习','宝洁管道题','宝洁数字题','宝洁记忆力测试'],
   h1:'宝洁在线测评怎么准备：先确认题型，再针对性练习',
   lede:'先阅读招聘通知中的测评要求，理解对应题型的规则，再通过练习和反馈发现问题。本文提供一条可执行的准备路径，并说明本站练习的覆盖范围；它不是宝洁真实考题合集，也不是通过考试的保证。',
   published:'2026-09-28',updated:'2026-09-28',toolHref:'/practice',toolLabel:'体验固定练习样题',
   body:[
    {type:'h2',text:'1. 先确认你实际收到的测评要求'},
    {type:'p',text:'P&G 官方将在线测评列在申请与面试之间，并说明测评类型会因岗位等因素而变化。请以自己的邀请邮件为准，确认完成时间、设备要求及需要的无障碍安排。不要把另一位求职者的经历当成自己必定遇到的全部题型。'},
    {type:'note',text:'官方允许提前准备，但要求实际测评独立完成，不使用他人或技术工具的实时协助。本站的解析与求解器用于考前学习。官方招聘流程链接见文末。'},
    {type:'h2',text:'2. 把练习类型与想提高的能力对应起来'},
    {type:'ul',items:[
     '位置重排：管道练习帮助理解 Switch 类排列问题中的正推、逆推和未知方框。',
     '数字填空：练习题库目前使用 a × b + c 和不重复数字；数字求解器支持其界面允许的其他算式，不代表覆盖所有数字测评形式。',
     '顺序记忆：观察散点板上的圆点并重现顺序。这是基础回忆训练，不包含某些 Grid 类测评中穿插的对称或旋转判断。',
     '图形规律与资料分析：作为补充推理训练，不代表所有宝洁岗位都会出现相同题型。',
     'PEAK 或工作风格问卷：本站没有对应模拟器或标准答案。请依据官方说明，如实回答自己的经历和偏好。'
    ]},
    {type:'h2',text:'3. 先做一道原创例题，再考虑计时'},
    {type:'example',title:'排列例题：A B C D → C A D B',lines:[
     '把输入位置编号：A=1、B=2、C=3、D=4。',
     '从左到右读输出，并查找每个符号原来所在的位置。',
     'C 在第 3 位、A 在第 1 位、D 在第 4 位、B 在第 2 位，所以规则是 3142。',
     '按输入的第 3、1、4、2 位取出符号，确实得到 C A D B。'
    ]},
    {type:'example',title:'数字例题：a × b + c = 23，使用 1–9 不重复数字',lines:[
     '因为 c 在 1–9 之间，所以 a × b 必须在 14–22 之间。',
     '尝试 3 × 6 = 18，得到 c = 23 − 18 = 5。',
     '3、6、5 都在允许范围内且互不重复，3 × 6 + 5 = 23。',
     '这证明找到一个可行解，不代表只有一个可行解。'
    ]},
    {type:'h2',text:'4. 用练习、复盘、再练习形成循环'},
    {type:'ol',items:[
     '先不计时完成样题，用自己的话解释规则。',
     '把错误分为读题、变换方向、算术、记忆顺序等原因。',
     '换一道题验证同一方法，不只记住上一道题的答案。',
     '方法稳定后，可使用外部计时器记录时间和正确率。当前题库不是经过校准的限时模拟考试。',
     '正式测评前再次阅读官方要求，本站练习分数不对应招聘方的通过线。'
    ]},
    {type:'h2',text:'5. 根据实际需要决定是否继续练习'},
    {type:'p',text:'登录后，每个账号每种解题器有 10 次免费机会，每种练习题型有 5 道固定样题与完整解析。固定样题适合熟悉操作；需要更多陌生题目和持续求解时，可查看下方价格入口中的 30 天会员。购买并非开始学习的前提，也不保证测评结果。'},
   ],
   faq:[
    {q:'宝洁所有岗位都用相同的测评吗？',a:'不是。官方说明测评类型与岗位等因素有关，应以自己的招聘通知为准。'},
    {q:'开始练习必须付费吗？',a:'不必。攻略无需登录即可阅读；登录后有每种解题器 10 次免费机会，以及每种练习题型 5 道固定样题。会员提供更多生成题与持续求解。'},
    {q:'本站提供宝洁真题吗？',a:'不提供。本站题目为原创练习，与宝洁无隶属关系，也没有完整官方模拟、PEAK 答案或通过保证。'},
    {q:'记忆训练应该怎么用？',a:'从较短的圆点顺序开始，逐渐增加长度。本站目前不包含观察圆点期间穿插其他推理任务的双任务训练。'}
   ]
  },
  memory: {
   title:'记忆力测试怎么练｜圆点顺序与 Grid 类题的区别',
   description:'用原创圆点例题理解位置与顺序记忆，掌握逐步练习方法，了解基础顺序记忆与带干扰任务的 Grid 类测评有什么区别。',
   keywords:['记忆力测试练习','圆点顺序记忆','宝洁记忆题','Grid Challenge 练习'],
   h1:'圆点顺序记忆怎么练：位置正确，顺序也要正确',
   lede:'顺序记忆题会依次点亮若干位置，作答时既要记住位置，也要重现顺序。本站训练使用蓝色底板上的 25 个散布白点与依次亮起的粉色圆点，支持 3、5、7 个不重复位置。这是原创的顺序回忆练习，不是完整 Grid Challenge 模拟器。',
   published:'2026-09-28',updated:'2026-09-28',toolHref:'/memory',toolLabel:'开始圆点顺序记忆练习',
   body:[
    {type:'h2',text:'1. 区分基础顺序回忆与双任务记忆'},
    {type:'p',text:'基础练习是观察位置后按顺序重现。双任务记忆还会在观察之间加入其他工作，例如判断图形是否对称，这会打断默念和复习。基础回忆做得好，并不能证明已经适应两种任务交替进行；本站当前只提供顺序回忆。'},
    {type:'h2',text:'2. 记住位置与路径'},
    {type:'example',title:'原创例题：位置 2 → 7 → 4',lines:[
     '25 个白色圆点在观察和作答时保持位置不变。',
     '2 靠近上方中央，7 在左侧，4 在右上。',
     '观察时记住路径：上方中央 → 左侧 → 右上。',
     '播放结束后按相同顺序点击。2 → 4 → 7 虽然位置相同，但顺序错误。'
    ]},
    {type:'h2',text:'3. 每次只增加一层难度'},
    {type:'ol',items:[
     '从 3 个位置开始，等待播放完毕后再点击。',
     '出错后找出从第几个位置开始偏离，并在提交后回看正确顺序。',
     '练习时可尝试记空间路径或默念位置编号，选择对陌生顺序更有效的方法。',
     '3 个位置稳定后尝试 5 个，再尝试 7 个。这是练习建议，不是经过验证的通过标准。',
     '用新的顺序检验进步。反复记住同一道固定样题有助于熟悉界面，但不是独立的记忆能力测量。'
    ]},
    {type:'h2',text:'4. 常见错误'},
    {type:'ul',items:['只记住出现过哪些位置，没有记住顺序。','观察还没结束就急着点击。','每轮使用不同的编号方式。','把背熟固定样题误认为对所有陌生顺序都有提升。','把简单圆点回忆当成所有招聘方记忆测评的完整替代。']},
    {type:'h2',text:'5. 当前训练器能做什么'},
    {type:'p',text:'免费账号可以反复练习 5 道固定记忆样题并查看反馈。会员可生成新顺序，选择 3、5、7 个位置。支持触屏、鼠标和键盘导航；播放阶段不能作答，完成点击并提交后可回看正确顺序。'},
   ],
   faq:[
    {q:'这是完整的宝洁 Grid Challenge 模拟吗？',a:'不是。本站提供基础顺序回忆，不含中间穿插的对称或旋转判断，也不复刻招聘方的自适应评分。'},
    {q:'记忆力练习可以免费用吗？',a:'可以。登录后可反复练习 5 道固定样题并查看反馈，会员可生成新题和选择难度。'},
    {q:'点击顺序会影响判分吗？',a:'会。完整顺序必须一致，只选对位置但顺序不同仍会判错。'},
    {q:'练习成绩好能保证测评通过吗？',a:'不能。本站原创练习没有经过招聘测评通过率或录用结果预测验证。'}
   ]
  }
 }
};
