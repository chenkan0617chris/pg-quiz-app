import type { PracticeQuestion, PublicQuestion, Explanation } from './practice';

export const EXAM_SECTIONS = [
  {kind:'pipeline', name:{zh:'管道推理',en:'Switch challenge'}, seconds:360},
  {kind:'numerical',name:{zh:'数字运算',en:'Digit challenge'},seconds:300},
  {kind:'grid',name:{zh:'空间记忆',en:'Grid challenge'},seconds:540},
] as const;
export type GridQuestion = {kind:'grid';sequence:number[];spatial:{cells:number[];symmetric:boolean}[]};
export type ExamQuestion = PracticeQuestion | GridQuestion;
export type PublicGrid = {kind:'grid';sequence:number[];spatial:{cells:number[]}[]};
export type ExamPublicQuestion = PublicQuestion | PublicGrid;
export type ExamCommand = {action:'begin';section:number}|{action:'answer';questionId:string;answer:number[]}|{action:'sync'|'finish'};
export type ExamAttempt = {id:string;section:number;question:ExamQuestion;answer:number[]|null;correct:boolean;earned:number;possible:number;elapsedMs:number};
export type ExamState = {id:string;version:1;createdAt:number;finishedAt:number|null;phase:'ready'|'running'|'completed';section:number;deadline:number|null;startedAt:number|null;current:{id:string;question:ExamQuestion;shownAt:number}|null;attempts:ExamAttempt[];sectionMs:number[]};
export type ExamView = Pick<ExamState,'id'|'createdAt'|'finishedAt'|'phase'|'section'|'deadline'> & {serverNow:number;answered:number;current:{id:string;question:ExamPublicQuestion}|null};
export type ExamSummary = {section:number;correct:number;wrong:number;unanswered:number;attempted:number;earned:number;possible:number;score:number;seconds:number;correctPerMinute:number;averageSeconds:number};
export type ExamReport = {id:string;createdAt:number;finishedAt:number;score:number;sections:ExamSummary[];attempts:(Omit<ExamAttempt,'question'> & {question:ExamPublicQuestion;referenceAnswer:number[];explanation:Explanation|null})[]};
export type ExamListItem = {id:string;createdAt:number;finishedAt:number|null;phase:ExamState['phase'];score:number|null};
