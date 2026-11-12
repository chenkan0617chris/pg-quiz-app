/**
 * Original verbal reasoning passages in the True / False / Cannot Say format
 * used by SHL-style, Aon (cut-e) and Talent Q verbal tests. Every passage and
 * statement is written for this site; none is copied from a real test.
 *
 * The rule the explanations teach: judge each statement ONLY from the passage.
 * True = the passage states it or it follows necessarily. False = the passage
 * contradicts it. Cannot Say = the passage gives too little to decide, even if
 * the statement sounds plausible from general knowledge.
 */
export type VerbalAnswer = 'T' | 'F' | 'C';

export type VerbalStatement = { text: string; answer: VerbalAnswer; why: string };

export type VerbalPassage = { id: string; topic: string; text: string; statements: VerbalStatement[] };

export const VERBAL_PASSAGES: VerbalPassage[] = [
  {
    id: 'remote-work',
    topic: 'Workplace policy',
    text: 'A logistics firm introduced a hybrid working policy in 2024, allowing office staff to work from home for up to two days a week. Warehouse and delivery roles were excluded because the work cannot be done remotely. In a staff survey six months later, 72% of eligible employees said the policy had improved their work–life balance. Managers reported no measurable change in team output, although several said that arranging meetings had become harder. The firm has said it will review the policy at the end of 2025.',
    statements: [
      { text: 'Delivery drivers at the firm can work from home one day a week.', answer: 'F', why: 'The passage says warehouse and delivery roles were excluded from the policy.' },
      { text: 'Most eligible employees who answered the survey felt their work–life balance improved.', answer: 'T', why: '72% is a majority of eligible respondents, and the passage reports it directly.' },
      { text: 'Team output rose after the policy was introduced.', answer: 'F', why: 'Managers reported no measurable change in output, which contradicts a rise.' },
      { text: 'The firm will extend the policy to three days a week after its review.', answer: 'C', why: 'The passage only says a review will happen. It gives no outcome.' },
    ],
  },
  {
    id: 'battery-recycling',
    topic: 'Sustainability',
    text: 'Lithium-ion batteries contain valuable metals such as cobalt and nickel, but only a small share of used batteries are currently recycled. Recycling is expensive partly because batteries arrive in many shapes and chemistries, which makes automated dismantling difficult. Some manufacturers have begun designing battery packs that can be separated with standard tools. Supporters argue that, as more electric vehicles reach the end of their lives, the supply of used batteries will become large enough to make recycling plants profitable.',
    statements: [
      { text: 'Most used lithium-ion batteries are currently recycled.', answer: 'F', why: 'The passage says only a small share are recycled.' },
      { text: 'Variation in battery design is one reason recycling is costly.', answer: 'T', why: 'Different shapes and chemistries make automated dismantling difficult, which the passage gives as part of the cost.' },
      { text: 'All manufacturers now design packs that can be separated with standard tools.', answer: 'F', why: 'Only some manufacturers have begun to do this.' },
      { text: 'Recycling plants are already profitable in most countries.', answer: 'C', why: 'Supporters expect future profitability. The passage says nothing about current profitability by country.' },
    ],
  },
  {
    id: 'graduate-scheme',
    topic: 'Recruitment',
    text: 'The bank’s graduate scheme lasts two years and consists of four six-month rotations across different departments. Applicants must hold, or expect to obtain, a degree in any subject. After the online tests, shortlisted candidates attend an assessment centre that includes a group exercise and a presentation. Last year the scheme received over 9,000 applications for 120 places. Graduates who complete the scheme are not guaranteed a permanent role, but the bank states that most are offered one.',
    statements: [
      { text: 'Each rotation on the scheme lasts six months.', answer: 'T', why: 'Two years split into four rotations of six months each, as stated.' },
      { text: 'Only applicants with a finance or economics degree are eligible.', answer: 'F', why: 'A degree in any subject is accepted.' },
      { text: 'Every graduate who completes the scheme receives a permanent role.', answer: 'F', why: 'The passage says they are not guaranteed one.' },
      { text: 'More applications were received last year than in the year before.', answer: 'C', why: 'Only last year’s figure is given, so there is nothing to compare it with.' },
    ],
  },
  {
    id: 'urban-cycling',
    topic: 'Transport',
    text: 'After a city built a network of protected cycle lanes, the number of people cycling to work doubled within three years. Road injuries involving cyclists fell over the same period, even though more people were cycling. Local shops on the new routes initially opposed the lanes, fearing that the loss of parking spaces would reduce trade. A study commissioned by the city council later found that footfall on those streets had increased, but it did not measure shop revenue.',
    statements: [
      { text: 'Cycling to work became more common after the lanes were built.', answer: 'T', why: 'The number of cyclists commuting doubled.' },
      { text: 'Cyclist injuries rose because more people were cycling.', answer: 'F', why: 'Injuries fell over the same period.' },
      { text: 'Shop revenue on the new routes increased.', answer: 'C', why: 'The study measured footfall, not revenue, so revenue cannot be judged.' },
      { text: 'Some local shops were against the lanes at first.', answer: 'T', why: 'Shops on the routes initially opposed them because of lost parking.' },
    ],
  },
  {
    id: 'sleep-study',
    topic: 'Health research',
    text: 'In a study of 400 adults, participants who slept fewer than six hours a night performed worse on memory tests than those who slept seven to eight hours. The researchers noted that the study was observational: it recorded sleep and test scores but did not assign participants to sleep for particular lengths of time. They therefore cautioned that the results show an association rather than proving that short sleep causes poorer memory. A follow-up trial with controlled sleep schedules is planned.',
    statements: [
      { text: 'The study proved that short sleep causes poorer memory.', answer: 'F', why: 'The researchers say it shows an association and does not prove causation.' },
      { text: 'Participants were told how long to sleep each night.', answer: 'F', why: 'The study was observational and did not assign sleep lengths.' },
      { text: 'The follow-up trial will find that short sleep harms memory.', answer: 'C', why: 'The trial is only planned; its results are unknown.' },
      { text: 'People who slept seven to eight hours scored better on memory tests than those who slept under six hours.', answer: 'T', why: 'That is the reported finding.' },
    ],
  },
  {
    id: 'subscription-pricing',
    topic: 'Business strategy',
    text: 'A software company switched from selling one-off licences to a monthly subscription. In the first year, total revenue fell by 15% because customers no longer paid a large sum upfront. However, the company’s finance director argued that subscription revenue is more predictable and that, if customer numbers hold steady, annual revenue should exceed the old licence model by the third year. Some long-standing customers complained that they would pay more over time than under the previous system.',
    statements: [
      { text: 'Revenue dropped in the first year after the switch.', answer: 'T', why: 'Total revenue fell by 15% in the first year.' },
      { text: 'The finance director expects higher annual revenue by year three regardless of customer numbers.', answer: 'F', why: 'The forecast depends on customer numbers holding steady.' },
      { text: 'Most customers preferred the subscription model.', answer: 'C', why: 'Only complaints from some long-standing customers are mentioned; there is no measure of overall preference.' },
      { text: 'Under the old model, customers paid a large sum upfront.', answer: 'T', why: 'The revenue fall is explained by customers no longer paying a large upfront sum.' },
    ],
  },
  {
    id: 'museum-funding',
    topic: 'Public sector',
    text: 'The national museum has been free to enter since 2001 and is funded mainly by a government grant, with the rest coming from donations, its shop and paid special exhibitions. Visitor numbers more than doubled in the decade after charges were removed. The grant has been frozen for five years while running costs have risen, and the museum has cut its opening hours on two weekday evenings. Its director has ruled out reintroducing general admission charges.',
    statements: [
      { text: 'Special exhibitions at the museum are free.', answer: 'F', why: 'Paid special exhibitions are listed as a source of income.' },
      { text: 'The government grant has increased in line with running costs.', answer: 'F', why: 'The grant has been frozen while costs have risen.' },
      { text: 'The museum plans to charge visitors for general admission.', answer: 'F', why: 'The director has ruled this out.' },
      { text: 'Donations provide more income than the shop.', answer: 'C', why: 'No breakdown between donations, the shop and exhibitions is given.' },
    ],
  },
  {
    id: 'four-day-week',
    topic: 'Workplace trial',
    text: 'Sixty companies took part in a six-month trial of a four-day working week with no loss of pay. Participation was voluntary, and most firms were small office-based businesses. At the end of the trial, the majority of companies chose to continue with the shorter week, and staff reported lower levels of burnout. Critics pointed out that companies which volunteered may have been those most likely to succeed with the change, so the results may not apply to all employers.',
    statements: [
      { text: 'Employees in the trial had their pay reduced.', answer: 'F', why: 'The trial ran with no loss of pay.' },
      { text: 'Most participating companies kept the four-day week after the trial.', answer: 'T', why: 'The majority chose to continue.' },
      { text: 'The trial shows that every employer would benefit from a four-day week.', answer: 'F', why: 'Critics note the volunteer firms may not represent all employers, so the passage rejects this generalisation.' },
      { text: 'Productivity increased at the participating companies.', answer: 'C', why: 'The passage mentions burnout and continuation, not productivity.' },
    ],
  },
  {
    id: 'water-pricing',
    topic: 'Utilities',
    text: 'A water company plans to install smart meters in all homes in its region over the next four years. Households with meters pay for the water they use, whereas unmetered households pay a fixed charge based on the value of their property. The company says metered households typically use less water. Consumer groups have welcomed the plan but warned that large families on low incomes could see their bills rise, and have asked for a social tariff to protect them.',
    statements: [
      { text: 'All homes in the region already have smart meters.', answer: 'F', why: 'The meters are planned over the next four years.' },
      { text: 'Unmetered households pay according to how much water they use.', answer: 'F', why: 'They pay a fixed charge based on property value.' },
      { text: 'Consumer groups oppose the smart meter plan.', answer: 'F', why: 'They have welcomed it, while raising a concern.' },
      { text: 'The company has agreed to introduce a social tariff.', answer: 'C', why: 'Consumer groups asked for one; the company’s response is not given.' },
    ],
  },
  {
    id: 'language-learning',
    topic: 'Education',
    text: 'A university replaced weekly grammar lectures in its first-year Spanish course with small conversation groups led by native speakers. Exam pass rates were similar to previous years, but students rated the course more highly and more of them chose to continue Spanish in their second year. The department notes that the conversation groups cost more to run, because each group has no more than eight students.',
    statements: [
      { text: 'Pass rates improved sharply after the change.', answer: 'F', why: 'Pass rates were similar to previous years.' },
      { text: 'More students continued Spanish into the second year.', answer: 'T', why: 'The passage states this directly.' },
      { text: 'The new format is cheaper than the lecture format.', answer: 'F', why: 'The conversation groups cost more to run.' },
      { text: 'The department will extend conversation groups to other languages.', answer: 'C', why: 'No plans for other languages are mentioned.' },
    ],
  },
  {
    id: 'supply-chain',
    topic: 'Operations',
    text: 'A consumer goods manufacturer used to source a key packaging material from a single supplier. When a fire at that supplier’s plant halted deliveries for three weeks, two of the manufacturer’s product lines ran out of stock. The company now buys the material from three suppliers in different countries. The arrangement has raised its packaging costs slightly, which the company says is an acceptable price for reducing the risk of future shortages.',
    statements: [
      { text: 'The fire caused some of the manufacturer’s products to go out of stock.', answer: 'T', why: 'Two product lines ran out of stock while deliveries were halted.' },
      { text: 'The manufacturer now relies on one supplier for the material.', answer: 'F', why: 'It now uses three suppliers.' },
      { text: 'Packaging costs fell after the change.', answer: 'F', why: 'Costs rose slightly.' },
      { text: 'The three new suppliers are cheaper than the original supplier.', answer: 'C', why: 'Total costs rose, but nothing is said about each supplier’s price compared with the original one.' },
    ],
  },
  {
    id: 'online-reviews',
    topic: 'Marketing',
    text: 'Research on an online marketplace found that products with an average rating between 4.2 and 4.7 stars sold better than those with a perfect 5.0. The researchers suggested that shoppers may treat flawless ratings with suspicion, assuming that some reviews are fake. Products with fewer than ten reviews were excluded from the analysis because a small number of ratings can swing the average sharply.',
    statements: [
      { text: 'Products rated 5.0 sold better than those rated 4.5.', answer: 'F', why: 'Products in the 4.2–4.7 range sold better than perfect-rated ones.' },
      { text: 'The researchers proved that shoppers distrust perfect ratings.', answer: 'F', why: 'They only suggested this as a possible explanation.' },
      { text: 'Products with only five reviews were included in the study.', answer: 'F', why: 'Products with fewer than ten reviews were excluded.' },
      { text: 'Products rated below 4.0 sold the least.', answer: 'C', why: 'No sales results are given for ratings below 4.2.' },
    ],
  },
];

export const VERBAL_LABELS: Record<'zh' | 'en', Record<VerbalAnswer, string>> = {
  en: { T: 'True', F: 'False', C: 'Cannot Say' },
  zh: { T: '正确 True', F: '错误 False', C: '无法判断 Cannot Say' },
};
