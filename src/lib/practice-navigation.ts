export type PracticeNavigationItem = {
  path: string;
  label:
    | 'navPipeline'
    | 'navNumerical'
    | 'navSeries'
    | 'navMemory'
    | 'navGrid'
    | 'navData'
    | 'navPeak'
    | 'navVerbal';
};

/**
 * The order follows the subjects people start most often: Switch and Digit
 * first, then the remaining cognitive and assessment formats.
 */
export const PRACTICE_NAVIGATION: readonly PracticeNavigationItem[] = [
  { path: '/practice', label: 'navPipeline' },
  { path: '/practice?kind=numerical', label: 'navNumerical' },
  { path: '/practice?kind=figure', label: 'navSeries' },
  { path: '/memory', label: 'navMemory' },
  { path: '/grid', label: 'navGrid' },
  { path: '/practice?kind=data', label: 'navData' },
  { path: '/peak', label: 'navPeak' },
  { path: '/verbal', label: 'navVerbal' },
];
