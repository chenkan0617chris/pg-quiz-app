/**
 * Original work-style practice content. Not official P&G PEAK items and not a scoring key:
 * statements describe common workplace behaviours so candidates can practise answering
 * consistently from real experience. Dimensions follow publicly described values
 * (ownership, leadership, integrity, trust, passion for winning) plus general work habits.
 */
export type L = {zh:string;en:string};
export const PEAK_DIMENSIONS = {
  ownership:{zh:'主人翁意识',en:'Ownership'},
  leadership:{zh:'领导与影响',en:'Leadership & influence'},
  collaboration:{zh:'协作与信任',en:'Collaboration & trust'},
  integrity:{zh:'诚信与原则',en:'Integrity'},
  drive:{zh:'成果导向',en:'Drive for results'},
  agility:{zh:'适应与学习',en:'Agility & learning'},
  planning:{zh:'计划与执行',en:'Planning & execution'},
  consumer:{zh:'用户与消费者视角',en:'Consumer focus'},
} as const;
export type Dimension = keyof typeof PEAK_DIMENSIONS;

/** reverse:true means agreeing describes the opposite of the dimension. */
export type Statement = L & {dim:Dimension;reverse?:boolean};
export type Pair = {a:L&{dim:Dimension};b:L&{dim:Dimension}};
export type Scenario = L & {options:(L&{note:L})[]};

export const STATEMENTS:Statement[] = [
  // ownership
  {dim:'ownership',zh:'接手的任务出现问题时，我会先想自己能做什么，而不是等别人来解决。',en:'When a task I own runs into trouble, I first ask what I can do rather than waiting for someone else to fix it.'},
  {dim:'ownership',zh:'即使没有人检查，我也会把工作做到自己认可的标准。',en:'I finish work to a standard I am happy with even when nobody will check it.'},
  {dim:'ownership',zh:'我会主动跟进自己提出的事项，直到它真正落地。',en:'I follow up on the items I raise until they are actually done.'},
  {dim:'ownership',zh:'发现流程中的漏洞时，我会提出改进方案并推动执行。',en:'When I find a gap in a process, I propose a fix and push to put it in place.'},
  {dim:'ownership',reverse:true,zh:'只要按要求完成了自己的部分，最终结果如何不是我需要操心的事。',en:'As long as I deliver my part as asked, the final outcome is not my concern.'},
  {dim:'ownership',reverse:true,zh:'项目遇到困难时，我通常会等负责人来做决定。',en:'When a project hits difficulties, I usually wait for the person in charge to decide.'},
  // leadership
  {dim:'leadership',zh:'团队方向不清楚时，我愿意站出来组织大家讨论并提出方案。',en:'When a team lacks direction, I am willing to step up, organise a discussion and propose a plan.'},
  {dim:'leadership',zh:'我能用数据和事实说服别人支持我的想法。',en:'I can win support for my ideas with data and facts.'},
  {dim:'leadership',zh:'我会主动帮助经验较少的同伴成长。',en:'I actively help less experienced teammates develop.'},
  {dim:'leadership',zh:'即使没有正式职位，我也会对团队结果施加积极影响。',en:'Even without a formal title, I try to influence the team’s results positively.'},
  {dim:'leadership',reverse:true,zh:'在小组里我更愿意按别人的安排做事，不太提出自己的方向。',en:'In a group I prefer to follow others’ plans rather than suggest a direction myself.'},
  {dim:'leadership',reverse:true,zh:'当意见不一致时，我通常选择不表态以避免冲突。',en:'When opinions clash, I usually stay silent to avoid conflict.'},
  // collaboration
  {dim:'collaboration',zh:'我会主动分享信息，让合作方能及时做出判断。',en:'I share information proactively so partners can make timely decisions.'},
  {dim:'collaboration',zh:'即使与我的观点不同，我也会认真听取同事的意见。',en:'I listen carefully to colleagues even when their views differ from mine.'},
  {dim:'collaboration',zh:'团队取得成果时，我会明确认可每个人的贡献。',en:'When the team succeeds, I make a point of recognising each person’s contribution.'},
  {dim:'collaboration',zh:'我愿意为了团队目标调整自己的工作安排。',en:'I am willing to adjust my own plans for the team’s goal.'},
  {dim:'collaboration',reverse:true,zh:'我觉得大多数工作自己做比和别人协调更高效。',en:'I find most work is faster done alone than coordinated with others.'},
  {dim:'collaboration',reverse:true,zh:'我很少向其他部门的同事寻求意见。',en:'I rarely ask colleagues in other departments for input.'},
  // integrity
  {dim:'integrity',zh:'当我发现自己犯了错误，我会尽早承认并推动修正。',en:'When I discover a mistake I made, I admit it early and work to correct it.'},
  {dim:'integrity',zh:'即使会让结果看起来不那么好，我也会如实汇报数据。',en:'I report data accurately even when it makes results look worse.'},
  {dim:'integrity',zh:'我会兑现自己做出的承诺；做不到时会提前说明。',en:'I keep my commitments, and say so early when I cannot.'},
  {dim:'integrity',zh:'遇到不合规的做法时，我会提出来，即使这让场面尴尬。',en:'I speak up about practices that break the rules, even if it is awkward.'},
  {dim:'integrity',reverse:true,zh:'为了按时交付，稍微美化一下进度汇报是可以接受的。',en:'To meet a deadline, it is acceptable to make a progress report look a little better than it is.'},
  {dim:'integrity',reverse:true,zh:'只要没有人发现，小的规则偏差不必太在意。',en:'Small rule deviations do not matter much if nobody notices.'},
  // drive
  {dim:'drive',zh:'我会给自己设定比要求更高的目标。',en:'I set myself targets higher than what is required.'},
  {dim:'drive',zh:'遇到挫折时，我会很快调整并再次尝试。',en:'After a setback, I regroup quickly and try again.'},
  {dim:'drive',zh:'我关注工作最终带来的业务结果，而不仅是完成了多少任务。',en:'I focus on the business result of my work, not just on how many tasks I completed.'},
  {dim:'drive',zh:'面对竞争，我会主动寻找能胜出的方法。',en:'When facing competition, I actively look for ways to win.'},
  {dim:'drive',reverse:true,zh:'达到最低要求后，我通常不会再投入额外精力。',en:'Once the minimum requirement is met, I usually stop putting in extra effort.'},
  {dim:'drive',reverse:true,zh:'目标难度很高时，我倾向于先降低期望。',en:'When a target is very hard, I tend to lower my expectations first.'},
  // agility
  {dim:'agility',zh:'计划突然改变时，我能较快调整并继续推进。',en:'When plans change suddenly, I adjust quickly and keep moving.'},
  {dim:'agility',zh:'我愿意学习不熟悉的方法，并通过反馈改进。',en:'I am willing to learn unfamiliar approaches and improve through feedback.'},
  {dim:'agility',zh:'我会主动寻求别人对我工作的批评意见。',en:'I actively ask others to critique my work.'},
  {dim:'agility',zh:'信息不完整时，我仍能先做出合理判断，再根据新信息修正。',en:'With incomplete information, I can still make a reasonable call and refine it as I learn more.'},
  {dim:'agility',reverse:true,zh:'我更喜欢一直使用自己熟悉的做法，而不是尝试新方法。',en:'I prefer to keep using familiar methods rather than try new ones.'},
  {dim:'agility',reverse:true,zh:'收到负面反馈时，我通常需要很长时间才能调整过来。',en:'Negative feedback usually takes me a long time to get over.'},
  // planning
  {dim:'planning',zh:'开始一项复杂任务前，我会先拆分步骤并估算时间。',en:'Before a complex task, I break it into steps and estimate the time.'},
  {dim:'planning',zh:'多项任务同时进行时，我会按影响和紧急程度排序。',en:'When juggling tasks, I rank them by impact and urgency.'},
  {dim:'planning',zh:'面对紧迫期限，我会尽早说明风险，并与相关方讨论取舍。',en:'With a tight deadline, I raise risks early and discuss trade-offs with stakeholders.'},
  {dim:'planning',zh:'我会预先想好备选方案，以防主要计划受阻。',en:'I prepare a fallback in case the main plan is blocked.'},
  {dim:'planning',reverse:true,zh:'我经常在截止日期前才开始处理重要任务。',en:'I often start important tasks only right before the deadline.'},
  {dim:'planning',reverse:true,zh:'我很少回顾项目，总结哪些地方可以做得更好。',en:'I rarely review a project to see what could have gone better.'},
  // consumer
  {dim:'consumer',zh:'做决定时，我会考虑它对最终用户或消费者的影响。',en:'When deciding, I consider the impact on the end user or consumer.'},
  {dim:'consumer',zh:'我喜欢通过观察和访谈去了解用户真正的需求。',en:'I like to understand real user needs through observation and interviews.'},
  {dim:'consumer',zh:'即使内部流程更方便，我也会优先选择对用户更好的方案。',en:'I favour the option that is better for users even if another is easier internally.'},
  {dim:'consumer',zh:'我会用用户反馈来检验自己的假设是否成立。',en:'I use user feedback to test whether my assumptions hold.'},
  {dim:'consumer',reverse:true,zh:'我认为只要产品功能完整，用户体验细节不太重要。',en:'As long as a product works, I think user-experience details matter little.'},
  {dim:'consumer',reverse:true,zh:'我很少主动去了解使用我们产品或服务的人。',en:'I rarely make an effort to learn about the people who use our product or service.'},
];

export const PAIRS:Pair[] = [
  {a:{dim:'planning',zh:'先制定详细计划，再开始行动',en:'Make a detailed plan, then act'},b:{dim:'agility',zh:'先快速行动，再边做边调整',en:'Act quickly, then adjust along the way'}},
  {a:{dim:'leadership',zh:'在讨论中提出方向并推动决定',en:'Set direction in discussions and drive a decision'},b:{dim:'collaboration',zh:'确保每个人的意见都被听到',en:'Make sure everyone’s view is heard'}},
  {a:{dim:'drive',zh:'挑战一个很可能失败的高目标',en:'Chase a stretch goal that may well fail'},b:{dim:'planning',zh:'稳妥完成一个确定能达成的目标',en:'Reliably deliver a goal I know I can hit'}},
  {a:{dim:'consumer',zh:'花时间理解用户的真实想法',en:'Spend time understanding what users really think'},b:{dim:'drive',zh:'尽快把方案推向市场看结果',en:'Get the solution to market fast and see the results'}},
  {a:{dim:'integrity',zh:'坚持原则，即使会影响进度',en:'Hold to principles even if it slows progress'},b:{dim:'collaboration',zh:'寻找各方都能接受的折中方案',en:'Find a compromise everyone can accept'}},
  {a:{dim:'ownership',zh:'亲自解决问题，直到彻底完成',en:'Solve the problem myself until it is fully done'},b:{dim:'leadership',zh:'调动合适的人一起解决问题',en:'Mobilise the right people to solve it together'}},
  {a:{dim:'agility',zh:'尝试一种从未用过的新方法',en:'Try a method I have never used'},b:{dim:'ownership',zh:'用验证过的方法确保交付质量',en:'Use a proven method to guarantee quality'}},
  {a:{dim:'collaboration',zh:'把功劳归于整个团队',en:'Give the credit to the whole team'},b:{dim:'drive',zh:'让成果被清楚地看见和衡量',en:'Make results clearly visible and measurable'}},
  {a:{dim:'planning',zh:'按优先级清单逐项推进',en:'Work through a prioritised list item by item'},b:{dim:'consumer',zh:'根据用户最迫切的痛点调整顺序',en:'Reorder work around users’ most urgent pain points'}},
  {a:{dim:'leadership',zh:'带领一个新组建的团队',en:'Lead a newly formed team'},b:{dim:'agility',zh:'快速学习一个陌生的领域',en:'Quickly learn an unfamiliar field'}},
  {a:{dim:'integrity',zh:'如实告诉上级坏消息',en:'Tell my manager bad news as it is'},b:{dim:'ownership',zh:'先想好补救方案再汇报',en:'Work out a recovery plan before reporting'}},
  {a:{dim:'drive',zh:'在竞争中争取第一',en:'Aim to come first in a competition'},b:{dim:'collaboration',zh:'帮助整个团队一起进步',en:'Help the whole team improve together'}},
  {a:{dim:'consumer',zh:'从用户反馈中发现新机会',en:'Spot new opportunities in user feedback'},b:{dim:'planning',zh:'从数据中找出效率提升点',en:'Find efficiency gains in the data'}},
  {a:{dim:'ownership',zh:'主动承担别人不愿接的任务',en:'Take on tasks others avoid'},b:{dim:'agility',zh:'在变化中迅速找到新的切入点',en:'Find a new angle quickly when things change'}},
  {a:{dim:'leadership',zh:'为团队设定清晰的目标',en:'Set clear goals for the team'},b:{dim:'integrity',zh:'为团队守住质量和规范底线',en:'Hold the team to quality and compliance standards'}},
  {a:{dim:'collaboration',zh:'跨部门协调资源',en:'Coordinate resources across departments'},b:{dim:'planning',zh:'把自己负责的部分规划到最细',en:'Plan my own part in fine detail'}},
  {a:{dim:'agility',zh:'接受反馈后立即改变做法',en:'Change my approach right after feedback'},b:{dim:'integrity',zh:'先验证反馈是否有依据',en:'First check whether the feedback is well founded'}},
  {a:{dim:'drive',zh:'追求可量化的增长',en:'Pursue measurable growth'},b:{dim:'consumer',zh:'追求用户满意度的提升',en:'Pursue higher user satisfaction'}},
  {a:{dim:'ownership',zh:'对结果负全责',en:'Take full responsibility for the outcome'},b:{dim:'collaboration',zh:'与伙伴共同承担责任',en:'Share responsibility with partners'}},
  {a:{dim:'planning',zh:'严格控制时间和预算',en:'Keep tight control of time and budget'},b:{dim:'leadership',zh:'激励团队超越预期',en:'Inspire the team to exceed expectations'}},
  {a:{dim:'integrity',zh:'遵守既定流程',en:'Follow the agreed process'},b:{dim:'drive',zh:'寻找更快达成目标的捷径',en:'Look for a faster route to the goal'}},
  {a:{dim:'consumer',zh:'为用户体验多投入时间',en:'Invest extra time in user experience'},b:{dim:'ownership',zh:'按承诺的时间准时交付',en:'Deliver on the promised date'}},
  {a:{dim:'agility',zh:'同时处理多个变化中的项目',en:'Juggle several shifting projects'},b:{dim:'planning',zh:'专注推进一个明确的项目',en:'Focus on one well-defined project'}},
  {a:{dim:'leadership',zh:'在会议中主导结论',en:'Drive the conclusion in a meeting'},b:{dim:'consumer',zh:'在会议中代表用户发声',en:'Speak up for users in a meeting'}},
];

const n=(zh:string,en:string):L=>({zh,en});
export const SCENARIOS:Scenario[] = [
  {zh:'你负责的校园推广活动距离开始还有两天，合作方突然通知无法提供承诺的场地。你会怎么做？',en:'Two days before a campus event you run, the partner says the promised venue is no longer available. What do you do?',options:[
    {zh:'立即列出备选场地并联系，同时通知团队调整安排',en:'List alternative venues and contact them at once, while updating the team',note:n('体现主人翁意识和计划执行：先保证结果，再同步信息。','Shows ownership and execution: secure the outcome, keep people informed.')},
    {zh:'向导师或负责人汇报，等待他们决定',en:'Report to your supervisor and wait for their decision',note:n('汇报是必要的，但只等待会错过时间窗口。更好的做法是汇报时带上备选方案。','Reporting matters, but only waiting wastes time. Bring options when you report.')},
    {zh:'与合作方协商，要求他们承担责任并寻找替代',en:'Negotiate with the partner to make them responsible for a replacement',note:n('追责合理，但不应替代你自己的行动；可以同时进行。','Holding them accountable is fair, but should not replace your own action; do both.')},
    {zh:'把活动推迟，避免仓促出错',en:'Postpone the event to avoid rushing',note:n('有时是合理选择，但应先评估替代方案和推迟对参与者的影响。','Sometimes right, but first assess alternatives and the impact on participants.')},
  ]},
  {zh:'小组作业中，一位组员连续两次没有按时完成他负责的部分。你会怎么做？',en:'In a group project, one member has missed their deadline twice. What do you do?',options:[
    {zh:'私下与他沟通，了解原因并一起调整分工',en:'Talk privately, understand why and adjust the workload together',note:n('体现协作与信任：先了解原因，再解决问题。','Shows collaboration and trust: understand the cause before fixing it.')},
    {zh:'自己把他的部分做完，避免影响进度',en:'Do their part yourself to protect the timeline',note:n('短期保住进度，但没有解决根本问题，也可能让自己超负荷。','Protects the timeline short term but leaves the root cause and may overload you.')},
    {zh:'在小组会议上公开指出问题',en:'Raise the issue openly in the group meeting',note:n('透明是好的，但公开指责可能伤害信任；先私下沟通通常更有效。','Transparency is good, but public blame can hurt trust; a private talk first usually works better.')},
    {zh:'向老师反映情况',en:'Report it to the instructor',note:n('在内部沟通无效后可以升级，但通常不是第一步。','Escalation is fine after direct talks fail, but rarely the first step.')},
  ]},
  {zh:'你在整理数据时发现，上周已提交给经理的报告里有一个计算错误，结论可能因此改变。你会怎么做？',en:'While reviewing data you find a calculation error in a report sent to your manager last week; it may change the conclusion. What do you do?',options:[
    {zh:'立即告知经理，说明影响并附上修正后的结果',en:'Tell your manager at once, explain the impact and attach corrected results',note:n('体现诚信和主人翁意识：及时、主动、带着解决方案。','Shows integrity and ownership: prompt, proactive and with a fix.')},
    {zh:'先修正数据，等下次汇报时一并更新',en:'Fix the data and update it at the next report',note:n('如果结论可能改变，等待会让别人基于错误信息做决定。','If the conclusion may change, waiting lets others decide on wrong information.')},
    {zh:'先确认错误是否真的影响结论，再决定是否汇报',en:'Check whether it really changes the conclusion before deciding to report',note:n('核实很重要，但应尽快完成并主动沟通，而不是以此回避。','Checking is important, but do it fast and communicate rather than use it to delay.')},
    {zh:'请同事帮忙复核，再一起向经理说明',en:'Ask a colleague to double-check, then tell the manager together',note:n('复核有价值，但责任仍在你，应确保信息尽快传达。','A second check helps, but the responsibility is yours; make sure the news travels quickly.')},
  ]},
  {zh:'你提出的新方案在会议上被一位资深同事否定了，但你认为他忽略了一些关键数据。你会怎么做？',en:'A senior colleague rejects your proposal in a meeting, but you believe they overlooked key data. What do you do?',options:[
    {zh:'会后找他沟通，用数据解释并听取他的顾虑',en:'Follow up after the meeting, walk through the data and hear their concerns',note:n('体现影响力与尊重：用事实说服，同时开放地倾听。','Shows influence and respect: persuade with facts, listen openly.')},
    {zh:'在会议上当场反驳',en:'Push back on the spot in the meeting',note:n('表达观点需要勇气，但当场对抗可能让讨论情绪化。','Speaking up takes courage, but confrontation can make it emotional.')},
    {zh:'接受他的意见，放弃这个方案',en:'Accept the decision and drop the proposal',note:n('尊重资深意见，但放弃有数据支持的观点可能错过机会。','Respectful, but dropping a data-backed idea may miss an opportunity.')},
    {zh:'找经理支持你的方案',en:'Go to your manager for backing',note:n('可以作为后续一步，但先直接沟通更能建立信任。','Can come later, but talking directly first builds more trust.')},
  ]},
  {zh:'你同时被分配了两项紧急任务，都要求本周五完成，你判断无法都高质量完成。你会怎么做？',en:'You are given two urgent tasks both due Friday, and you judge you cannot do both well. What do you do?',options:[
    {zh:'评估两项任务的影响，向相关方说明情况并协商优先级',en:'Assess the impact of each, explain the situation and agree priorities',note:n('体现计划执行和诚信：尽早暴露风险并讨论取舍。','Shows planning and integrity: surface the risk early and discuss trade-offs.')},
    {zh:'加班把两项都做完，尽量不打扰别人',en:'Work overtime to finish both without bothering anyone',note:n('体现投入，但可能牺牲质量，也让别人无法提前调整。','Shows commitment, but may cost quality and denies others the chance to adjust.')},
    {zh:'先做自己更擅长的那一项',en:'Do the one you are better at first',note:n('应按业务影响而不是个人偏好排序。','Prioritise by business impact, not personal preference.')},
    {zh:'两项都做到差不多就提交',en:'Do both to a passable level',note:n('按时交付但质量不足，可能带来返工。','On time but below standard, which may cause rework.')},
  ]},
  {zh:'你在实习中注意到团队的一个重复性流程每周要花大家很多时间，但没有人提过改进。你会怎么做？',en:'During an internship you notice a repetitive weekly process eats a lot of team time, yet nobody has suggested improving it. What do you do?',options:[
    {zh:'梳理问题，做一个小的改进试点，再向团队展示效果',en:'Map the problem, pilot a small fix and show the team the result',note:n('体现主人翁意识和成果导向：用小试点证明价值。','Shows ownership and drive: prove value with a small pilot.')},
    {zh:'在周会上提出这个问题，看大家的反应',en:'Raise it in the weekly meeting and see how people react',note:n('提出问题是好的开始，带上初步方案会更有说服力。','A good start; bringing a draft solution is more persuasive.')},
    {zh:'作为实习生，先按现有流程做好自己的工作',en:'As an intern, just do your work the current way',note:n('尊重现状，但错过了创造价值的机会。','Respects the status quo but misses a chance to add value.')},
    {zh:'私下问一位资深同事为什么一直这样做',en:'Privately ask a senior colleague why it is done this way',note:n('了解背景很有帮助，可以作为提出改进的前一步。','Useful context and a sensible step before proposing a change.')},
  ]},
  {zh:'一位客户（或用户）对你们的产品提出强烈投诉，而问题来自另一个部门。你会怎么做？',en:'A customer complains strongly about your product, but the cause sits in another department. What do you do?',options:[
    {zh:'先安抚并记录客户问题，再牵头联系相关部门跟进到底',en:'Reassure and log the issue, then coordinate with the other department until it is resolved',note:n('体现用户视角和主人翁意识：对客户负责到底。','Shows consumer focus and ownership: stay accountable to the customer.')},
    {zh:'告诉客户这不是你们部门的问题，并给出对方联系方式',en:'Tell the customer it is not your department and pass on a contact',note:n('信息正确，但客户体验差，也没有确保问题被解决。','Accurate, but a poor experience and no guarantee of resolution.')},
    {zh:'把投诉转给相关部门，由他们处理',en:'Forward the complaint for the other team to handle',note:n('分工合理，但应跟进结果并向客户反馈。','Reasonable split, but follow up and close the loop with the customer.')},
    {zh:'先向自己的经理汇报，等待指示',en:'Report to your manager and wait for instructions',note:n('可以同步，但客户问题通常需要更快的响应。','Worth sharing, but customer issues usually need a faster response.')},
  ]},
  {zh:'你发现团队为了达到月度目标，打算把下个月的订单提前计入本月。你会怎么做？',en:'You learn the team plans to book next month’s orders this month to hit a monthly target. What do you do?',options:[
    {zh:'明确表达顾虑，说明规范要求，并建议如实汇报',en:'State your concern clearly, explain the rules and suggest reporting accurately',note:n('体现诚信：在压力下坚持如实和合规。','Shows integrity: stay accurate and compliant under pressure.')},
    {zh:'不参与，但也不说什么',en:'Stay out of it and say nothing',note:n('避免了个人参与，但没有阻止可能的违规。','Avoids personal involvement but does not stop a possible breach.')},
    {zh:'既然大家都这样做，就按团队决定执行',en:'Go along since everyone does it',note:n('从众会带来合规风险，也损害信任。','Following the crowd creates compliance risk and erodes trust.')},
    {zh:'私下向合规或上级渠道反映',en:'Raise it privately through compliance or a manager',note:n('合理的渠道，尤其在直接沟通无效时。','A sound channel, especially if raising it directly does not work.')},
  ]},
  {zh:'你加入一个新项目，所用的软件工具你完全不熟悉，而项目两周后就要出第一版结果。你会怎么做？',en:'You join a new project using software you have never used, with a first deliverable in two weeks. What do you do?',options:[
    {zh:'制定学习计划，边学边做，并主动请熟悉的同事指导',en:'Make a learning plan, learn by doing and ask experienced colleagues for guidance',note:n('体现学习敏捷和计划性。','Shows learning agility and planning.')},
    {zh:'先用自己熟悉的工具完成，再想办法转换',en:'Use tools you know and convert later',note:n('可以保底，但可能造成返工和团队协作障碍。','A fallback, but may cause rework and friction with the team.')},
    {zh:'向经理说明自己不熟悉，请求换一个任务',en:'Tell your manager you are unfamiliar and ask for another task',note:n('坦诚是好的，但放弃学习机会不利于成长。','Honest, but passing up the chance to learn limits growth.')},
    {zh:'全部自学，不打扰别人',en:'Teach yourself entirely without bothering anyone',note:n('自驱力强，但适时求助能更快达到标准。','Self-driven, but asking for help at the right moments is faster.')},
  ]},
  {zh:'你带领的小组讨论陷入僵局，两位成员各执一词，时间已所剩不多。你会怎么做？',en:'A group discussion you lead is deadlocked between two members and time is running out. What do you do?',options:[
    {zh:'总结双方观点，提出判断标准，推动大家做出决定',en:'Summarise both sides, propose decision criteria and drive a decision',note:n('体现领导力：用清晰标准推动共识。','Shows leadership: use clear criteria to build consensus.')},
    {zh:'采用多数投票，尽快结束讨论',en:'Take a majority vote to end it quickly',note:n('高效，但可能忽视少数意见中的关键风险。','Efficient, but may miss key risks raised by the minority.')},
    {zh:'自己直接选择一个方案',en:'Pick an option yourself',note:n('果断，但若不解释理由，可能削弱团队认同。','Decisive, but without reasons it may weaken buy-in.')},
    {zh:'把决定推迟到下次会议',en:'Defer the decision to the next meeting',note:n('若信息不足可以接受，否则会拖延进度。','Acceptable if information is missing; otherwise it delays progress.')},
  ]},
  {zh:'你的新产品创意在小范围测试中反馈一般，但你仍然相信它的潜力。你会怎么做？',en:'Your new product idea gets lukewarm feedback in a small test, but you still believe in it. What do you do?',options:[
    {zh:'深入分析反馈，找出原因并改进后再测试',en:'Dig into the feedback, find the reasons, improve and retest',note:n('体现用户视角和成果导向：让数据指导迭代。','Shows consumer focus and drive: let data guide iteration.')},
    {zh:'坚持原方案，扩大测试范围证明自己',en:'Stick with it and expand the test to prove yourself',note:n('坚持有价值，但忽视反馈可能浪费资源。','Persistence helps, but ignoring feedback can waste resources.')},
    {zh:'放弃这个创意，转向其他项目',en:'Drop the idea and move on',note:n('避免沉没成本，但可能过早放弃。','Avoids sunk cost but may give up too early.')},
    {zh:'请更多同事评估，再决定方向',en:'Ask more colleagues to evaluate before deciding',note:n('多方视角有帮助，但最终要回到用户的真实反馈。','More views help, but come back to real user feedback.')},
  ]},
  {zh:'经理临时让你代替他在跨部门会议上汇报，而你只有半天准备时间。你会怎么做？',en:'Your manager asks you to present for them at a cross-department meeting with half a day to prepare. What do you do?',options:[
    {zh:'快速确认汇报目标和关键信息，准备要点并预演可能的问题',en:'Confirm the goal and key messages, prepare points and rehearse likely questions',note:n('体现计划性和主人翁意识。','Shows planning and ownership.')},
    {zh:'照着经理的旧材料讲',en:'Present from the manager’s old slides as they are',note:n('省时，但可能无法回应听众当前关心的问题。','Saves time but may not answer what the audience cares about now.')},
    {zh:'说明准备时间不足，建议改期',en:'Say there is not enough time and suggest rescheduling',note:n('坦诚，但错过了承担责任和展示能力的机会。','Honest, but misses a chance to step up.')},
    {zh:'请熟悉情况的同事和你一起汇报',en:'Ask a well-informed colleague to co-present',note:n('借助团队力量是合理的，前提是你仍然主导准备。','Using the team is reasonable if you still own the preparation.')},
  ]},
  {zh:'你完成的分析得到了表扬，但你知道其中关键的思路来自一位不太发言的同事。你会怎么做？',en:'Your analysis is praised, but a key idea came from a quiet colleague. What do you do?',options:[
    {zh:'当场或尽快说明这位同事的贡献',en:'Credit the colleague right away or as soon as possible',note:n('体现诚信与信任：公正地认可他人贡献。','Shows integrity and trust: credit others fairly.')},
    {zh:'私下感谢这位同事',en:'Thank the colleague privately',note:n('有礼貌，但别人仍不知道他的贡献。','Polite, but others still do not see their contribution.')},
    {zh:'既然是团队工作，就不必特别说明',en:'It was teamwork, so no need to mention it',note:n('看似谦逊，但可能让他人的贡献被忽略。','Looks modest but lets a contribution go unseen.')},
    {zh:'下次让这位同事来负责汇报',en:'Have the colleague present next time',note:n('给他人机会很好，但当下的认可同样重要。','Giving them a turn is good, but timely credit matters too.')},
  ]},
  {zh:'市场环境突然变化，你们团队花了一个月准备的计划可能不再适用。你会怎么做？',en:'The market shifts suddenly and a plan your team spent a month on may no longer fit. What do you do?',options:[
    {zh:'快速评估变化的影响，保留仍有效的部分并调整方案',en:'Assess the impact quickly, keep what still works and adapt the plan',note:n('体现适应能力：既不固守也不全盘推翻。','Shows agility: neither clinging on nor scrapping everything.')},
    {zh:'按原计划执行，毕竟已经投入很多',en:'Run the original plan since so much went into it',note:n('沉没成本思维，可能导致更大损失。','Sunk-cost thinking that may cost more.')},
    {zh:'放弃原计划，从头开始',en:'Scrap it and start over',note:n('可能浪费已有的有效工作。','May throw away useful work.')},
    {zh:'等上级给出新方向',en:'Wait for leadership to set a new direction',note:n('需要对齐，但主动提出调整建议更有价值。','Alignment is needed, but proposing adjustments adds more value.')},
  ]},
  {zh:'你在社团中负责招新，结果报名人数只有目标的一半，距离截止还有一周。你会怎么做？',en:'You run recruitment for a society; sign-ups are at half the target with a week to go. What do you do?',options:[
    {zh:'分析报名渠道和反馈，集中资源加强效果最好的渠道',en:'Analyse channels and feedback, then double down on what works best',note:n('体现成果导向和数据思维。','Shows drive for results and data thinking.')},
    {zh:'请所有成员都去发传单',en:'Ask every member to hand out flyers',note:n('增加投入，但没有针对原因。','More effort, but not aimed at the cause.')},
    {zh:'降低目标，接受现状',en:'Lower the target and accept it',note:n('现实，但过早放弃了改进空间。','Realistic but gives up on improvement too soon.')},
    {zh:'调研目标学生为什么不报名',en:'Ask target students why they have not signed up',note:n('理解用户是关键一步，后续要迅速转化为行动。','Understanding users is key; turn it into action quickly.')},
  ]},
  {zh:'你发现一位同事在处理客户数据时没有遵守隐私规定，但他说“大家都这么做”。你会怎么做？',en:'A colleague is not following privacy rules with customer data and says “everyone does it”. What do you do?',options:[
    {zh:'提醒他相关规定和风险，并建议按规范处理',en:'Remind them of the rules and risks and suggest doing it properly',note:n('体现诚信与对团队负责。','Shows integrity and care for the team.')},
    {zh:'既然大家都这么做，就不必多管',en:'If everyone does it, leave it alone',note:n('忽视了对客户和公司的风险。','Ignores the risk to customers and the company.')},
    {zh:'直接向上级报告',en:'Report it straight to a manager',note:n('合理渠道，尤其在提醒无效或风险较高时。','A valid channel, especially if a reminder fails or the risk is high.')},
    {zh:'自己以身作则，不去提醒别人',en:'Lead by example without saying anything',note:n('个人做法正确，但没有降低团队风险。','Right for you, but does not reduce the team’s risk.')},
  ]},
];
