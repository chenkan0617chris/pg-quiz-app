import type { Faq } from './blocks';

/**
 * English-only search copy for the pages that map onto a named P&G assessment
 * section. English searchers type the section names ("Switch Challenge",
 * "Digit Challenge", "Grid Challenge", "PEAK"), not our internal tool names, so
 * each page explains the section in those terms, links to its siblings and
 * carries a visible FAQ that the FAQPage markup mirrors.
 *
 * Facts about the official assessment are limited to what P&G publishes
 * (pgcareers.com/assessment-overviews) or what candidates and prep sites
 * consistently report, and are worded as such.
 */
export type TestPageKey = 'pipeline' | 'numerical' | 'grid' | 'peak' | 'exams';

export type TestPageCopy = {
  /** The section name as English searchers use it. */
  name: string;
  sections: { heading: string; paragraphs: string[]; list?: string[] }[];
  faqHeading: string;
  faq: Faq[];
};

export const TEST_PAGE_PATHS: Record<TestPageKey, string> = {
  pipeline: '/pipeline',
  numerical: '/numerical',
  grid: '/grid',
  peak: '/peak',
  exams: '/exams',
};

export const TEST_PAGES_EN: Record<TestPageKey, TestPageCopy> = {
  pipeline: {
    name: 'Switch Challenge',
    sections: [
      {
        heading: 'What is the P&G Switch Challenge?',
        paragraphs: [
          'The Switch Challenge is one of the short cognitive games in the P&G Interactive Assessment, which P&G describes as an online test of about 30 minutes that some roles require. In each question a row of four symbols passes through a hidden operator and comes out in a new order. Your job is to pick the four-digit code that describes the reordering, as fast and as accurately as you can.',
          'Candidates commonly report a fixed time window of around six minutes with as many questions as you can answer, and difficulty that rises as you keep getting questions right. Later questions chain two or more operators, so you have to work out one unknown box while another box has already changed the order.',
        ],
      },
      {
        heading: 'How to read a Switch code',
        paragraphs: [
          'A code such as 3142 means: the new first position takes the symbol from old position 3, the new second takes old position 1, the new third takes old position 4 and the new fourth takes old position 2. Read it as "where does each new slot come from", never as "where does each old symbol go". Mixing up those two directions is the single most common source of wrong answers.',
        ],
        list: [
          'One unknown box: compare the input with the output slot by slot and write down where each output symbol came from.',
          'A known box before the unknown one: apply the known box first, then compare the intermediate row with the output.',
          'A known box after the unknown one: undo the known box from the output first, then compare.',
          'Always substitute your answer back through the whole chain before moving on.',
        ],
      },
      {
        heading: 'Worked example',
        paragraphs: [
          'Input A B C D goes through box 2314, then through an unknown box, and the output is D A C B. Box 2314 turns A B C D into B C A D. In the output, D was in position 4 of B C A D, A in position 3, C in position 2 and B in position 1, so the unknown box is 4321. Check it: B C A D through 4321 gives D A C B.',
          'Enter the same rows in the solver above to see every intermediate sequence. With a single unknown box you do not need to fill in answer options.',
        ],
      },
    ],
    faqHeading: 'Switch Challenge FAQ',
    faq: [
      {
        q: 'How long is the P&G Switch Challenge?',
        a: 'Candidates usually report a time window of about six minutes in which you answer as many questions as you can. P&G itself describes the whole Interactive Assessment as taking about 30 minutes; check the instructions on your own invitation, because the format can vary by role.',
      },
      {
        q: 'What does a code like 3142 mean in the Switch Challenge?',
        a: 'Each digit says which old position fills that new position. 3142 means the new first slot takes old position 3, the second takes old position 1, the third takes old position 4 and the fourth takes old position 2.',
      },
      {
        q: 'How can I get faster at the Switch Challenge?',
        a: 'Learn one fixed procedure, check answers by substitution until it is automatic, then practise against a timer. Speed comes from never having to decide which direction to read the code, not from guessing.',
      },
      {
        q: 'Are these official P&G questions?',
        a: 'No. CK Quiz is an independent practice site and is not affiliated with Procter & Gamble. All questions are original and generated, so they train the same skill without copying the real test.',
      },
      {
        q: 'Is the Switch Challenge solver free?',
        a: 'Sign in to use it. New accounts get 24 hours of full access, and free users then keep a limited number of solver uses and practice questions for each type.',
      },
    ],
  },

  numerical: {
    name: 'Digit Challenge',
    sections: [
      {
        heading: 'What is the P&G Digit Challenge?',
        paragraphs: [
          'The Digit Challenge is the numerical game in the P&G Interactive Assessment. Each question shows an equation with blanks, such as _ × _ + _ = 47, and you fill the blanks with single digits so that the equation is true. Candidates commonly report that a digit can be used only once per equation, that there is a time window of around five minutes, and that equations get longer as you progress.',
          'It is less about arithmetic speed than about narrowing the search: the target, parity, divisibility and the largest possible product tell you which digits are worth trying first.',
        ],
      },
      {
        heading: 'A fast method for Digit Challenge equations',
        paragraphs: [],
        list: [
          'Start with the operation that moves the result most, usually the multiplication.',
          'Bound it: if the target is 47 and the last term is at most 9, the product must be between 38 and 46.',
          'List the digit pairs that give a product in that range, then see whether the remaining digit closes the gap.',
          'Check that no digit repeats if the rule says digits must be distinct.',
        ],
      },
      {
        heading: 'Worked example',
        paragraphs: [
          'Solve a × b + c = 47 using digits 1 to 9, all different. The product must be between 38 and 46. 5 × 8 = 40 needs c = 7, which works, so 5 × 8 + 7 = 47 is a valid answer. 6 × 7 = 42 needs c = 5, which also works. The solver above lists every combination, which shows you how many answers a question like this really has.',
          'The three-digit product table on this page helps you recognise products of three different digits at a glance, which is the step that slows most people down in longer equations.',
        ],
      },
    ],
    faqHeading: 'Digit Challenge FAQ',
    faq: [
      {
        q: 'How long is the P&G Digit Challenge?',
        a: 'Candidates usually report about five minutes with as many equations as you can complete. Follow the instructions on your own invitation, because timings can change.',
      },
      {
        q: 'Can I use the same digit twice in the Digit Challenge?',
        a: 'Candidates commonly report that each digit can appear only once per equation. The solver lets you switch the distinct-digits rule on or off so you can practise either way.',
      },
      {
        q: 'Do I follow normal order of operations?',
        a: 'Yes, practise with standard precedence: multiplication and division before addition and subtraction, and brackets first. The solver uses the same rule.',
      },
      {
        q: 'Can I use a calculator?',
        a: 'Practise without one. The questions are designed for mental arithmetic, and the skill being measured is how quickly you eliminate impossible digits.',
      },
    ],
  },

  grid: {
    name: 'Grid Challenge',
    sections: [
      {
        heading: 'What is the P&G Grid Challenge?',
        paragraphs: [
          'The Grid Challenge is the working-memory game in the P&G Interactive Assessment. You see a dot appear in a grid, then answer a quick distractor question, such as whether a pattern is symmetrical, then see the next dot. At the end you click the dot positions in the order they appeared. Candidates commonly report a small number of rounds whose sequences get longer.',
          'The difficulty is not the symmetry question on its own but holding the sequence in memory while your attention is pulled away.',
        ],
      },
      {
        heading: 'How to practise for the Grid Challenge',
        paragraphs: [],
        list: [
          'Give each grid cell a short name, for example rows A to D and columns 1 to 4, and repeat the growing sequence silently.',
          'Answer the symmetry question quickly. A slow distractor answer gives the sequence time to fade.',
          'Group positions into chunks of two or three, or into a shape such as "top row, then diagonal".',
          'Start with three positions and only move up when you are reliably correct.',
        ],
      },
    ],
    faqHeading: 'Grid Challenge FAQ',
    faq: [
      {
        q: 'What does the P&G Grid Challenge measure?',
        a: 'Working memory under interference: remembering dot positions in order while you answer spatial questions in between.',
      },
      {
        q: 'Is the symmetry part scored?',
        a: 'Treat both parts as important. This training gives a point for each correctly recalled position and each correct symmetry answer, then shows the right answers for both, so you can see which part is holding you back.',
      },
      {
        q: 'How many dots do I need to remember?',
        a: 'Sequences get longer as the test goes on. This page offers three, four and five positions so you can build up gradually.',
      },
      {
        q: 'Can I try it without signing in?',
        a: 'Yes. A sample board is shown before you start, and signing in gives you randomly generated rounds.',
      },
    ],
  },

  peak: {
    name: 'PEAK Performance Assessment',
    sections: [
      {
        heading: 'What is the P&G PEAK Performance Assessment?',
        paragraphs: [
          'P&G describes the PEAK Performance Assessment as an untimed online questionnaire about your background, experience, interests and work-related attitudes, compared against P&G competencies. P&G says most applicants take about 20 minutes. It is usually the first online step after you apply.',
          'There are no right answers to memorise. What helps is knowing the question formats in advance, so that you answer from real examples instead of reacting to an unfamiliar layout.',
        ],
      },
      {
        heading: 'Question formats you can practise here',
        paragraphs: [],
        list: [
          'Rating statements: how much a statement describes you.',
          'Forced choice: picking the more accurate of two statements that both sound positive.',
          'Workplace scenarios: choosing how you would act in a short situation.',
        ],
      },
      {
        heading: 'How to approach it',
        paragraphs: [
          'Answer honestly and consistently, and tie each answer to something you have actually done. Similar ideas come back in different wording, and contradictory answers stand out more than any single strong or weak answer. The practice here draws statements at random and flags pairs where your answers point in different directions.',
        ],
      },
    ],
    faqHeading: 'PEAK assessment FAQ',
    faq: [
      {
        q: 'Is the P&G PEAK assessment timed?',
        a: 'P&G says you can take as much time as you need, and that most applicants finish in about 20 minutes.',
      },
      {
        q: 'Can you fail the PEAK Performance Assessment?',
        a: 'It is used to compare your answers with the competencies P&G looks for, so some applicants do not progress after it. It is not a knowledge test, and trying to guess an ideal profile usually produces inconsistent answers.',
      },
      {
        q: 'Should I practise for a personality-style questionnaire?',
        a: 'Practise the format, not the answers. Knowing what rating, forced-choice and scenario questions look like lets you spend your attention on giving accurate answers.',
      },
    ],
  },

  exams: {
    name: 'P&G Online Assessment',
    sections: [
      {
        heading: 'A timed rehearsal of the P&G online assessment games',
        paragraphs: [
          'The mock exams put Switch-style, Digit-style and Grid-style rounds together under a timer, closer to how the real Interactive Assessment feels than practising one question type at a time. After each exam you get a report showing your score and time for every question.',
          'P&G describes the Interactive Assessment as about 30 minutes of short cognitive games, required for some roles. The questions here are original and generated; they are not official P&G questions.',
        ],
      },
      {
        heading: 'How to use mock exams in your preparation',
        paragraphs: [],
        list: [
          'Learn the method for each section in the guides and solvers first.',
          'Practise each type in the practice bank until you are accurate without a timer.',
          'Then take a full mock exam, read the report and go back to the type that cost you most time.',
        ],
      },
    ],
    faqHeading: 'P&G online assessment FAQ',
    faq: [
      {
        q: 'What sections are in the P&G online assessment?',
        a: 'P&G lists the PEAK Performance Assessment and, for some roles, the Interactive Assessment. Candidates commonly describe the Interactive Assessment games as the Switch Challenge, Digit Challenge and Grid Challenge.',
      },
      {
        q: 'How long does the P&G Interactive Assessment take?',
        a: 'P&G says about 30 minutes. It can be taken online at any time and works on mobile.',
      },
      {
        q: 'Is the mock exam free?',
        a: 'You can preview the exam room and a sample report for free. Full timed exams are part of membership.',
      },
    ],
  },
};
