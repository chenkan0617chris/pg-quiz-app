import type { GuideCopy } from './guides.zh';

export const GUIDES_EN: Record<string, GuideCopy> = {
  pipeline: {
    title: 'Pipeline Logic Questions: How to Solve Them Step by Step',
    description:
      'A complete method for pipeline logic questions in P&G-style aptitude tests: how boxes reorder shapes, forward and backward solving, handling several unknown boxes, with worked examples and a free solver.',
    keywords: [
      'pipeline logic questions',
      'P&G online assessment',
      'P&G aptitude test practice',
      'shape reordering questions',
      'P&G reasoning test',
      'pipeline puzzle solver',
    ],
    h1: 'How to Solve Pipeline Logic Questions',
    lede:
      'Pipeline questions are the most distinctive format in P&G-style reasoning screens. Four shapes enter a pipeline, pass through a row of boxes, and leave in a different order. Each box applies one fixed reordering rule, and the question usually hides a box and asks what it must have done. This guide covers the structure underneath the pictures, two reliable solving methods, and what to do when more than one box is unknown.',
    updated: '2026-09-15',
    toolHref: '/pipeline',
    toolLabel: 'Open the pipeline solver',
    body: [
      { type: 'h2', text: '1. What the question actually tests' },
      {
        type: 'p',
        text: 'Strip away the shapes and a pipeline question is composition and inversion of permutations. The order of four shapes is a permutation of 1 to 4, each box is a permutation acting on positions, and sending shapes through the boxes composes those permutations in sequence. Once you see it that way, the question stops being a visual puzzle and becomes arithmetic you can execute mechanically.',
      },
      {
        type: 'ul',
        items: [
          'Input row: the order the shapes enter in.',
          'Box: one reordering rule written as four digits. 3142 means the new first position takes whatever was in the old third position, the new second takes the old first, and so on.',
          'Output row: the order the shapes leave in.',
          'Unknown: usually one of the boxes, but it can also be the input or output row itself.',
        ],
      },
      {
        type: 'note',
        text: 'The key idea: a box describes movement between positions, not a change to the shapes. The same box applied to different inputs gives different outputs, but it always moves positions the same way.',
      },
      { type: 'h2', text: '2. The general method: squeeze from both ends' },
      {
        type: 'p',
        text: 'With a single unknown box, work inward from both sides. Start at the input and apply every known box that comes before the unknown one to get its true input. Then start at the output and undo every known box that comes after it to get its true output. With both ends pinned down, the unknown box is a single direct correspondence.',
      },
      {
        type: 'ol',
        items: [
          'Write the input row as a string of digits, for example 1234.',
          'Working left to right, apply each known box before the unknown one. Call the result A.',
          'Write down the output row. Working right to left, apply the inverse of each known box after the unknown one. Call the result B.',
          'Compare A and B. For each position i, find where B\'s i-th shape sits in A. That index is the i-th digit of the answer.',
          'Substitute the box back into the original pipeline and confirm it reproduces the given output.',
        ],
      },
      {
        type: 'example',
        title: 'Worked example: input 1234, through box 2314 then an unknown box, output 4132',
        lines: [
          'Step 1: apply 2314 to 1234. Position 1 takes the old position 2, giving 2. Position 2 takes the old position 3, giving 3. Position 3 takes the old position 1, giving 1. Position 4 takes the old position 4, giving 4. So A = 2314.',
          'Step 2: nothing follows the unknown box, so B is the output itself. B = 4132.',
          'Step 3: B\'s first shape is 4, which sits in position 4 of A (2314), so the answer starts with 4.',
          'B\'s second shape is 1, which sits in position 3 of A, so the second digit is 3.',
          'B\'s third shape is 3, which sits in position 2 of A, so the third digit is 2.',
          'B\'s fourth shape is 2, which sits in position 1 of A, so the fourth digit is 1.',
          'The unknown box is 4321. Check: applying 4321 to 2314 gives 4132, which matches the output.',
        ],
      },
      { type: 'h2', text: '3. Inverting a box quickly' },
      {
        type: 'p',
        text: 'The backward step is where most mistakes happen. The inverse of 3142 is not the digits written in reverse. It is the same correspondence read the other way round: if the original box says position 1 comes from position 3, the inverse says position 3 comes from position 1.',
      },
      {
        type: 'ol',
        items: ['Write the box as a list of pairs: 1←3, 2←1, 3←4, 4←2.', 'Swap each side: 3←1, 1←2, 4←3, 2←4.', 'Sort by the left-hand number: 1←2, 2←4, 3←1, 4←3.', 'Read off the right-hand side. The inverse is 2413.'],
      },
      {
        type: 'note',
        text: 'Self-check: applying a box and then its inverse must return 1234. It takes two seconds and is far cheaper than discovering the error after finishing the question.',
      },
      { type: 'h2', text: '4. Several unknown boxes and candidate options' },
      {
        type: 'p',
        text: 'When two or more boxes are hidden the answer is usually not unique, so the question will supply candidate options. Do not try to solve directly. Treat the candidates as a search space, run each combination through the pipeline, and keep the ones that reproduce the output.',
      },
      {
        type: 'ul',
        items: [
          'Use the squeeze method first to pin down the stretch between the two unknowns. That alone usually eliminates most candidates.',
          'Check parity. Permutations are odd or even, and the parity of a composition is fixed. Count how many pairwise swaps take the input to the output, then discard any candidate combination whose parity does not match.',
          'If several combinations still reproduce the output, the question is underdetermined and the intended answer follows whatever extra constraint it states, such as all boxes being different.',
        ],
      },
      { type: 'h2', text: '5. Where marks are lost' },
      {
        type: 'ul',
        items: [
          'Reading the box backwards. 3142 means the new first position takes the old third, not that the old first moves to the new third. Get the direction wrong once and every later step fails.',
          'Forgetting that boxes compose in order. The second box acts on the first box\'s output, not on the original input.',
          'Reversing the digits instead of genuinely inverting when working backwards.',
          'Skipping the substitution check. Verification is almost free here, so skipping it is the worst possible way to save time.',
          'Spending time on the shapes. Number them 1 to 4 immediately, work entirely in digits, and translate back only at the end.',
        ],
      },
      { type: 'h2', text: '6. How to practise' },
      {
        type: 'p',
        text: 'Pipeline questions improve fast, because once the method clicks the rest is speed and accuracy. Start with the solver and check your intermediate sequences against its output to confirm you have the direction right in both the forward and the backward pass. Once that is solid, move to the practice bank and work through easy, medium and hard in turn, aiming to get a single question under a minute.',
      },
    ],
    faq: [
      {
        q: 'How many boxes does a pipeline question usually have?',
        a: 'Typically one to three. More boxes mean more compositions and inversions around the unknown, but the method is unchanged: run forward to the unknown box, run backward from the output, then compare the two ends. The easy, medium and hard settings in the practice bank correspond to one, two and three boxes.',
      },
      {
        q: 'Can I just try every possibility?',
        a: 'You can, but it is a poor trade. Four shapes give 24 permutations, so one unknown box means up to 24 attempts and two unknown boxes means 576 combinations. The squeeze method takes a constant number of steps and, as long as you keep the direction straight, is both faster and less error-prone.',
      },
      {
        q: 'What if the input or output row is the unknown?',
        a: 'The method is the same, only the direction changes. If the input is unknown, undo every box from the output backwards. If the output is unknown, apply every box to the input forwards. Both cases require all boxes to be known, otherwise there is not enough information.',
      },
      {
        q: 'Can the solver read a screenshot of my question?',
        a: 'No. You enter the shape order and the boxes as structured input; there is no image recognition. That is deliberate, because it keeps the result checkable: every intermediate sequence is displayed so you can compare each step against your own working.',
      },
    ],
  },

  figure: {
    title: 'Figure Series Questions: Six Rules and a Checking Order',
    description:
      'A systematic method for figure series reasoning: rotation, reflection, cyclic shift, perimeter movement, inversion and rotation-with-inversion, in a fixed order of elimination, with 3x3 grid examples and a free rule solver.',
    keywords: [
      'figure series questions',
      'figural reasoning test',
      'abstract reasoning practice',
      'P&G figure reasoning',
      'next in sequence puzzle',
      'pattern recognition test',
    ],
    h1: 'Figure Series Questions: Six Transformations and a Checking Order',
    lede:
      'A figure series gives you several figures in sequence and asks for the next one. The difficulty is not that any single transformation is hard, but that there are many candidate rules and no obvious order in which to test them, so it is easy to stare and get nowhere. This guide narrows the common rules to six families and gives you a fixed checking order that reaches an answer in about a minute.',
    updated: '2026-09-15',
    toolHref: '/series',
    toolLabel: 'Open the figure rule solver',
    body: [
      { type: 'h2', text: '1. Turn the figures into something comparable' },
      {
        type: 'p',
        text: 'Comparing two figures by eye is unreliable, because visual weight pulls your attention to the wrong places. Discretise first. On a 3x3 grid, number the nine cells in a fixed order and record which ones are filled. Every rule then becomes a change in the set of filled positions, which is far steadier to reason about than an impression.',
      },
      {
        type: 'ul',
        items: [
          'Count the filled cells in each figure. A constant count means a movement rule: rotation, reflection or a shift.',
          'A count that rises or falls by a fixed amount means an accumulation rule.',
          'A count that alternates between n and 9 minus n means inversion is involved.',
        ],
      },
      { type: 'note', text: 'Counting filled cells is the cheapest and most informative first move. It usually eliminates more than half the candidate rules in one pass.' },
      { type: 'h2', text: '2. The six common transformations' },
      { type: 'h3', text: 'Rotation by a fixed angle' },
      {
        type: 'p',
        text: 'The whole figure turns about its centre by a constant angle, usually 90 or 180 degrees, always in the same direction. The signal is a constant fill count with a congruent outline that has changed orientation. To confirm, pick the most distinctive filled cell, such as a lone corner, and track where it travels between figures.',
      },
      { type: 'h3', text: 'Reflection' },
      {
        type: 'p',
        text: 'The figure flips across a vertical or horizontal axis. This is easiest to confuse with a 180 degree rotation. Tell them apart by handedness: a reflection turns three points arranged clockwise into the same three arranged anticlockwise, while a rotation does not. Pick an asymmetric group of filled cells and check whether their winding direction has flipped.',
      },
      { type: 'h3', text: 'Cyclic shift' },
      {
        type: 'p',
        text: 'Every filled cell moves a fixed number of steps in one direction, and anything that leaves one edge reappears on the opposite edge. The signal is that the shape of the fill pattern is identical between consecutive figures and only its placement has moved. Looking at a single row or column in isolation makes the offset obvious.',
      },
      { type: 'h3', text: 'Perimeter movement' },
      {
        type: 'p',
        text: 'Only the eight outer cells take part. Filled cells advance a fixed number of steps around the ring, while the centre cell either stays put or follows a separate rule of its own. The trap is the centre: counting it as part of the ring makes the step count never line up. Cover the centre and look only at the ring.',
      },
      { type: 'h3', text: 'Inversion' },
      {
        type: 'p',
        text: 'Filled becomes empty and empty becomes filled. Pure inversion makes the fill count alternate between n and 9 minus n, which is very easy to spot. It often appears as an every-other-figure rule, where figures 1, 3 and 5 share a colour scheme and figures 2 and 4 are their negatives.',
      },
      { type: 'h3', text: 'Rotation combined with inversion' },
      {
        type: 'p',
        text: 'The hardest family: rotate, then invert. Because the fill count jumps it is easy to misread as an accumulation rule, and because the outline changes it is easy to conclude there is no rule at all. The test is to invert every other figure first. If the sequence then resolves into a clean rotation, you have found a combined rule.',
      },
      { type: 'h2', text: '3. A fixed checking order' },
      { type: 'p', text: 'Do not test rules at random. Each step below has a definite elimination attached, and five steps are enough to settle almost any question.' },
      {
        type: 'ol',
        items: [
          'Count filled cells. Constant means a movement rule. Alternating between n and 9 minus n means inversion. Monotonic means accumulation.',
          'Within movement rules, check whether the outline is congruent. Congruent means rotation or reflection. Not congruent but the same fill pattern means a shift.',
          'Separate rotation from reflection using handedness: take three non-collinear filled cells and see whether their winding direction reverses.',
          'If none of that holds, isolate the outer ring and check whether only the perimeter is moving.',
          'If it still does not hold, invert every other figure and go back to step 1. That is the entry point for combined rules.',
        ],
      },
      { type: 'h2', text: '4. The verification you must not skip' },
      {
        type: 'p',
        text: 'Once you have a candidate rule, verify it across every consecutive pair, not just the first two. Distractor options are routinely built to satisfy only the first pair, so skipping the full check walks straight into them.',
      },
      {
        type: 'ul',
        items: [
          'Test the rule on 1 to 2, 2 to 3, 3 to 4 and 4 to 5. All of them must hold.',
          'If any pair fails, discard the rule and move to the next step in the checking order.',
          'Only after all pairs hold should you apply the rule to the final figure to produce the answer.',
          'Compare against the options. If two options both fit, your rule is underspecified and needs one more constraint.',
        ],
      },
      {
        type: 'note',
        text: 'The solver on this site checks only the six families above. It states explicitly whether the prediction is unique or whether several rules disagree. If it finds nothing, the question uses a rule outside those families and needs separate analysis; it does not mean the tool has miscalculated.',
      },
      { type: 'h2', text: '5. Where marks are lost' },
      {
        type: 'ul',
        items: [
          'Mistaking a reflection for a 180 degree rotation. The two agree on symmetric figures and disagree completely on asymmetric ones, which makes this the single most common error.',
          'Counting the centre cell as part of the ring in perimeter questions.',
          'Choosing an answer after verifying only the first pair.',
          'Staying too long with one hypothesis. If a rule has not verified within thirty seconds, move to the next family. The whole value of a fixed order is that you never double back.',
          'Only comparing adjacent figures and missing an every-other-figure rule.',
        ],
      },
      { type: 'h2', text: '6. How to practise' },
      {
        type: 'p',
        text: 'Progress here comes almost entirely from making the checking order automatic. Start by using the solver in reverse: enter a sequence yourself, see which rule it identifies, and train your own reading to agree with it. Once that is consistent, move to timed questions in the practice bank with a target of forty seconds for identification plus verification.',
      },
    ],
    faq: [
      {
        q: 'Is there a universal trick for figure series questions?',
        a: 'There is no universal formula, but there is a fixed checking order. Count filled cells to pick the family, use outline and handedness to separate rules within it, then verify across every pair. That covers the large majority of questions; the remaining unusual ones come down to exposure rather than technique.',
      },
      {
        q: 'How do I tell a reflection from a 180 degree rotation?',
        a: 'Use handedness. Take three non-collinear filled cells and note whether they run clockwise or anticlockwise. A reflection reverses that direction and a rotation preserves it. If the figure happens to be symmetric the two produce the same result, in which case the distinction does not affect your answer.',
      },
      {
        q: 'What does it mean when the solver finds no matching rule?',
        a: 'It means the sequence does not fit the six supported families, not that the question is unsolvable. It may use superposition, cancellation of shared elements, stroke counting or another rule. The tool exists to automate the mechanically checkable part, not to replace your judgement.',
      },
      {
        q: 'How long should one figure question take under time pressure?',
        a: 'Cap it at a minute. If you have not verified a rule by then, flag it and move on. Figure questions carry the same marks as any other, so grinding on one is a clear net loss when time is short.',
      },
    ],
  },

  numerical: {
    title: 'Numerical Reasoning: Solve Equation Blanks Fast',
    description:
      'How to solve numerical reasoning blanks without brute force: use remainders, divisibility and parity to cut the search space, handle the distinct-digits constraint, with worked examples and a free solver.',
    keywords: [
      'numerical reasoning practice',
      'fill in the blank equations',
      'P&G numerical reasoning',
      'digit puzzle solver',
      'aptitude test maths',
      'mental arithmetic test practice',
    ],
    h1: 'Numerical Reasoning: From Brute Force to Constraint Reduction',
    lede:
      'A numerical reasoning blank gives you an equation with gaps and a target result, and asks which single digits belong in the gaps. Brute force gets there eventually, but nowhere near fast enough under exam conditions. This guide is about using remainders, divisibility and parity to remove roughly ninety per cent of the search space and bring a question down to thirty seconds.',
    updated: '2026-09-15',
    toolHref: '/numerical',
    toolLabel: 'Open the numerical solver',
    body: [
      { type: 'h2', text: '1. Why brute force does not work' },
      {
        type: 'p',
        text: 'Three blanks with digits from 1 to 9 give 729 combinations, and even requiring them to be distinct leaves 504. At one second each that is far beyond the time budget for a single question. The real method is not to calculate faster, but to prove that almost every combination is impossible and then check only the handful that survive.',
      },
      { type: 'h2', text: '2. Three tools for cutting the space' },
      { type: 'h3', text: 'Handle the multiplication first' },
      {
        type: 'p',
        text: 'In an equation mixing addition and multiplication, the product sets the magnitude and the addition only nudges it. For a x b + c = target, c is at most 9, so the product must fall between target minus 9 and target minus 1. That single observation usually takes the candidates from hundreds down to a handful.',
      },
      {
        type: 'example',
        title: 'Worked example: a x b + c = 47, digits from 1 to 9, all distinct',
        lines: [
          'Step 1: c ranges from 1 to 9, so a x b must lie between 38 and 46.',
          'Step 2: list products of two distinct digits from 1 to 9 in that range. Only 5x8=40, 6x7=42 and 5x9=45 qualify.',
          'Step 3: recover c for each. Product 40 gives c = 7, and 7 is not used by 5 or 8, so it works. Product 42 gives c = 5, which works. Product 45 gives c = 2, which works.',
          'Step 4: check distinctness. The triples (5,8,7), (6,7,5) and (5,9,2) all pass.',
          'Result: three solutions, found with three divisions and three subtractions instead of testing 504 combinations.',
        ],
      },
      { type: 'h3', text: 'Parity' },
      {
        type: 'p',
        text: 'Parity is the cheapest elimination available and you can apply it at a glance. A product is even if either factor is even, and odd only when both factors are odd. A sum is even when both terms share parity and odd when they do not. Applying this against the target typically removes half the remaining candidates at once.',
      },
      {
        type: 'ul',
        items: [
          'Odd target with a x b + c: if the product is even, c must be odd; if the product is odd, meaning both a and b are odd, then c must be even.',
          'Even target: the product and c must share parity.',
          'Subtraction behaves identically. Parity depends only on whether the two terms match, not on the sign.',
        ],
      },
      { type: 'h3', text: 'Divisibility and remainders' },
      {
        type: 'p',
        text: 'When the equation contains a division, or the target is a multiple of 3, 5 or 9, divisibility can pin a digit outright. The useful tool is the digit sum: a number is divisible by 9 exactly when its digits sum to a multiple of 9, and the same logic applies for 3. With division in the equation, the numerator must be divisible by the denominator or that branch is dead immediately.',
      },
      { type: 'h2', text: '3. The standard procedure' },
      {
        type: 'ol',
        items: [
          'Read the constraints. Is the range 1 to 9 or 0 to 9, and must the digits be distinct? These two decide the size of the search space, and misreading either wastes the whole question.',
          'Find the term with the largest magnitude, usually a product or quotient, and use the target to bound its possible range.',
          'List the factor combinations that fall inside that range. There are usually fewer than five.',
          'Apply parity and divisibility to discard the obviously impossible ones.',
          'For each survivor, recover the remaining blanks and check the distinctness constraint.',
          'Substitute the complete solution back into the original equation and verify.',
        ],
      },
      {
        type: 'note',
        text: 'The distinctness constraint is easy to overlook, but it is also the best filter you have. Apply it before the final step rather than discovering a clash after finishing the arithmetic.',
      },
      { type: 'h2', text: '4. Where marks are lost' },
      {
        type: 'ul',
        items: [
          'Ignoring operator precedence. Multiplication and division come before addition and subtraction, and brackets come first. Reading 2 + 3 x 4 as 20 is the classic slip.',
          'Reading the range as 0 to 9 but working as though it were 1 to 9, or the reverse. When 0 is allowed, a product can collapse to zero, which opens up a whole extra family of solutions.',
          'Missing the distinctness requirement and submitting an answer with a repeated digit.',
          'Reversing the operands in a subtraction or division.',
          'Stopping at the first solution. Many questions have several, and if two options both fit you have missed a constraint.',
        ],
      },
      { type: 'h2', text: '5. How to practise' },
      {
        type: 'p',
        text: 'The bottleneck is rarely arithmetic ability; it is whether reducing before calculating has become a habit. Use the solver to see every solution to the same question, because seeing how solutions cluster builds intuition about which combinations are worth trying. Then work through timed questions in the practice bank, forcing yourself to write down the feasible product range before doing any arithmetic.',
      },
    ],
    faq: [
      {
        q: 'Are calculators allowed in these tests?',
        a: 'Most online assessments do not provide one, and relying on it is a bad habit regardless. The numbers are chosen to be manageable mentally, and the real time cost is enumeration rather than arithmetic. Practising reduction pays off far more than practising calculation speed.',
      },
      {
        q: 'What should I do when a question has several solutions?',
        a: 'First re-read the constraints. The digit range, whether repeats are allowed, and any stated ordering can each collapse several solutions into one. If the question genuinely has several, pick whichever one appears among the options.',
      },
      {
        q: 'How can I tell quickly whether a large target is even reachable?',
        a: 'Bound it. If every blank at its maximum still falls short of the target, there is no solution in the stated range, which means you have misread the range or an operator. The same applies in reverse if every blank at its minimum already exceeds the target. The check takes seconds and saves you a minute down a dead end.',
      },
      {
        q: 'Does the solver return every solution?',
        a: 'Yes, as long as the number of combinations stays within its limit; beyond that it says it is showing only the first several. This is deliberate, so you can see how the solutions are distributed rather than just receiving one answer.',
      },
    ],
  },

  data: {
    title: 'Data Interpretation: Growth, Share and Ratio Made Simple',
    description:
      'How to handle data interpretation questions: choosing the right denominator for growth, share and ratio questions, when to estimate rather than calculate, and the unit and axis traps that cost most marks.',
    keywords: [
      'data interpretation practice',
      'numerical data questions',
      'percentage growth calculation',
      'chart reading test',
      'P&G data interpretation',
      'graph and table questions',
    ],
    h1: 'Data Interpretation: Three Question Types and Fast Estimation',
    lede:
      'The arithmetic in data interpretation is not the hard part. The hard part is finding the two right numbers among many within a few dozen seconds. Nearly every lost mark here comes from choosing the wrong denominator or missing a unit, not from calculating incorrectly. This guide reduces the common phrasings to three types and gives a denominator rule and an estimation strategy for each.',
    updated: '2026-09-15',
    toolHref: '/practice',
    toolLabel: 'Go to the practice bank',
    body: [
      { type: 'h2', text: '1. Three question types, three denominators' },
      {
        type: 'p',
        text: 'The phrasing varies endlessly, but the calculation nearly always falls into one of three types: growth, share and ratio. The numerator is easy to find in all three. What separates them is the denominator, and knowing those three rules cold lifts accuracy immediately.',
      },
      { type: 'h3', text: 'Growth: divide by the base period' },
      {
        type: 'p',
        text: 'For "by what percentage did it grow", the formula is (current minus base) divided by base, times 100 per cent. The denominator is always the earlier figure, never the later one and never the sum of the two. A negative result means a decline, and the answer should carry the minus sign or match a "fell by x per cent" option.',
      },
      { type: 'h3', text: 'Share: divide by the total' },
      {
        type: 'p',
        text: 'For "what percentage of the total", the formula is part divided by whole, times 100 per cent. The usual mistake is the definition of the whole. If the question asks for the share of that year\'s total, you must add up every category for that year, not carry over last year\'s total and not sum only the categories the question happens to mention.',
      },
      { type: 'h3', text: 'Ratio: follow the order in the question' },
      {
        type: 'p',
        text: 'For "how many times A is B" or "the ratio of A to B", divide directly, but keep the order exactly as written. "A is how many times B" is A divided by B, while "A is how many times greater than B" is (A minus B) divided by B. One word changes the answer by a whole unit, so circle both numbers before you start writing.',
      },
      {
        type: 'note',
        text: 'Bind the keyword to the denominator: "grew" or "fell" means base period, "share" or "proportion" means total, "times" or "ratio" means the order given.',
      },
      { type: 'h2', text: '2. When to estimate' },
      {
        type: 'p',
        text: 'If the options are far apart, exact calculation is wasted time. Glance at the spacing first. More than about five per cent apart, estimate. Less than one per cent apart, calculate properly.',
      },
      {
        type: 'ul',
        items: [
          'Round to two significant figures before calculating. Treating 1847 as 1800 usually keeps the error within about three per cent.',
          'For growth, establish the bracket first. If the current figure is roughly 1.2 times the base, growth is around 20 per cent, which is often enough to identify the option.',
          'For share, estimate by count. Four roughly comparable departments put each near 25 per cent, then adjust up or down based on how the target department compares.',
          'If two options still sit inside your estimated range, calculate those two exactly rather than redoing all of them.',
        ],
      },
      { type: 'h2', text: '3. The real traps are in reading the figures' },
      {
        type: 'ul',
        items: [
          'Units: check whether the header says thousands or millions, and whether the axis starts at zero. A bar chart starting at 50 exaggerates visual differences several times over.',
          'Wrong year: if the question compares year two against year one, do not compute it the other way round. Reversing the direction changes both the sign and the value.',
          'Percentage points versus per cent: going from 20 per cent to 25 per cent is an increase of five percentage points, not five per cent, which would be 25 per cent. Options routinely include both figures.',
          'Notes outside the chart: the scope that matters, such as "excluding exports", is often in small print beneath the table.',
          'Total rows: use a given total rather than adding it yourself, since manual addition drops rows. Just confirm the total covers the same scope as the question.',
        ],
      },
      { type: 'h2', text: '4. The standard procedure' },
      {
        type: 'ol',
        items: [
          'Read the question before the chart. Hunting with a target in mind is much faster than reading the chart in full first.',
          'Decide whether it is growth, share or ratio, and fix the denominator immediately.',
          'Circle the two figures in the chart and confirm their units and years.',
          'Check the option spacing and decide whether to estimate or calculate.',
          'Compare against the options. If nothing is close, the first suspect is the denominator, so return to step 2 rather than recalculating.',
        ],
      },
      { type: 'h2', text: '5. How to practise' },
      {
        type: 'p',
        text: 'The key is making the denominator decision reflexive. When working through the practice bank, force yourself to state the denominator out loud before calculating anything. After twenty or thirty questions the keyword in the prompt will locate it for you automatically. Every question in the bank comes with a step-by-step explanation that names the source of both the numerator and the denominator, so you can check it against your own reasoning.',
      },
    ],
    faq: [
      {
        q: 'Do I need to memorise formulas for data interpretation?',
        a: 'Only three: growth divides by the base period, share divides by the total, and ratio follows the order in the question. Most other formulas are variations on these three, and memorising them separately makes it more likely you will apply the wrong one under pressure.',
      },
      {
        q: 'What is the difference between five percentage points and five per cent?',
        a: 'Percentage points are the absolute difference between two percentages; per cent is the relative change. Going from 20 per cent to 25 per cent is five percentage points in absolute terms and 5 divided by 20, or 25 per cent, in relative terms. Questions often include both numbers to see whether you know the difference.',
      },
      {
        q: 'When is it right to give up on a data interpretation question?',
        a: 'When it requires cross-referencing three or more charts and the options are closely spaced, the return is usually poor. Under time pressure, clear every single-chart, single-step question first and come back to these afterwards.',
      },
      {
        q: 'Does estimating risk the wrong answer?',
        a: 'Not if you check the option spacing before deciding to estimate. The risk comes from estimating when options are close together. The rule of thumb is simple: estimation error runs at about three per cent, so anything tighter than that needs exact calculation.',
      },
    ],
  },
};
