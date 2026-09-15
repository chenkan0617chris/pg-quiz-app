# Figure reasoning — 2026-09-13

Official research: SHL Direct inductive reasoning examples describe a logical sequence of five boxes completed from choices A–E (https://www.shlglobal.cn/en/shldirect/en/example-questions/inductive-reasoning/). SHL practice catalogue distinguishes inductive pattern inference from numerical and deductive tasks (https://www.shlglobal.cn/en/shldirect/en/practice-tests/). Aon's preparation page offers several distinct assessments including inductive reasoning and deductive gapChallenge (https://www.aon.com/en/capabilities/talent-and-rewards/prepare-for-your-online-assessment); its gapChallenge guide describes applying given rules to logical problems (https://www.aon.com/getmedia/c7d38097-cd4b-4979-8236-0717603076e5/practice-tasks-deductive-reasoning-gapchallenge.pdf).

This release implements original binary-grid sequence exercises, not copied official questions and not a complete simulator of these providers. No claim is made about employer-specific timings or scoring.

/series now provides a 3×3 cell editor for 3–8 figures. Authenticated, rate-limited, trial-gated server solving matches nine deterministic transforms: clockwise/counterclockwise/half rotation, horizontal reflection, wrapping row/column shift, perimeter shift, inversion and rotation+inversion. Results group matching rules by prediction and explicitly limit uniqueness to the supported rule set. Arbitrary image upload and general shape/count/matrix puzzles are not implemented.

Practice adds kind figure, five observed figures and five distinct options. Stored answer/rule is excluded from the public projection. Server submission supplies the correct choice, rule and six-step visual sequence. Existing history/retry/first-submission semantics are reused with no migration.

Validation: exhaustive rotation/inversion checks over all 512 figures, known sequence and unsupported-input tests, 400 generated exercises checked for unique predictions, five unique options, all choices graded, explanation transitions and no leaked answer/rule. Lint and production builds checked. Existing tests remain passing.
