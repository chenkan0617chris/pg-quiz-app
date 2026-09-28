import samples from '../content/free-practice.json';
import type { PracticeQuestion } from './practice';

export function freePracticeQuestion(kind:PracticeQuestion['kind'],index:number):PracticeQuestion {
  const question=samples[kind][index];
  if(!Number.isInteger(index)||!question)throw new Error('Invalid sample');
  return structuredClone(question) as PracticeQuestion;
}
