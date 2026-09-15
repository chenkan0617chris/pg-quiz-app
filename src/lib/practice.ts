import { randomInt } from 'node:crypto';
import { FIGURE_RULES, transformFigure, solveFigure, type FigureRule } from './figure';
import { apply, invert, isPermutation } from './engine';

export type Difficulty = 'easy' | 'medium' | 'hard';
type PipelineQuestion = {kind:'pipeline';version:1|2;input:number[];output:number[];answer:number[];boxes?:(number[]|null)[];difficulty?:Difficulty};
type NumericalQuestion = {kind:'numerical';version:1;target:number;answer:number[]};
type DataQuestion = {kind:'data';version:1;metric:'growth'|'share'|'ratio';rows:{label:string;before:number;after:number}[];focus:number;options:number[];answer:number[]};
type FigureQuestion = {kind:'figure';version:1;frames:number[];options:number[];rule:FigureRule;answer:number[]};
export type PracticeQuestion = PipelineQuestion | NumericalQuestion | DataQuestion | FigureQuestion;

function shuffle(values:number[]):number[] {
  const result = [...values];
  for (let i=result.length-1;i>0;i--) {
    const j = randomInt(i+1);
    [result[i],result[j]] = [result[j],result[i]];
  }
  return result;
}
function nonIdentity() {
  let p:number[];
  do { p=shuffle([1,2,3,4]); } while(p.every((v,i)=>v===i+1));
  return p;
}

export function generateQuestion(kind:PracticeQuestion['kind'],difficulty:Difficulty='easy'):PracticeQuestion {
  if(kind==='figure') {
    for(let attempt=0;attempt<200;attempt++) {
      const rule=FIGURE_RULES[randomInt(FIGURE_RULES.length)];
      const frames=[randomInt(1,511)];
      for(let i=1;i<5;i++)frames.push(transformFigure(frames[i-1],rule));
      if(new Set(frames).size<2||solveFigure(frames).length!==1)continue;
      const next=transformFigure(frames[4],rule);
      const options=new Set([next]);
      // One-cell changes are plausible distractors that cannot equal the answer.
      for(const bit of shuffle([0,1,2,3,4,5,6,7,8]).slice(0,4))options.add(next^(1<<bit));
      const choices=shuffle([...options]);
      return {kind,version:1,frames,options:choices,rule,answer:[choices.indexOf(next)+1]};
    }
    throw new Error('Unable to generate unambiguous figure');
  }
  if (kind === 'pipeline') {
    const input = shuffle([1,2,3,4]);
    const answer = nonIdentity();
    const count={easy:1,medium:2,hard:3}[difficulty];
    const hidden=randomInt(count);
    const boxes=Array.from({length:count},(_,i)=>i===hidden?null:nonIdentity());
    const output=boxes.reduce<number[]>((seq,box)=>apply(box??answer,seq),input);
    return {kind,version:2,input,output,answer,boxes,difficulty};
  }
  if (kind === 'data') {
    const rows=['A','B','C','D'].map(label=>({label,before:randomInt(4,21)*50,after:randomInt(4,25)*50}));
    const focus=randomInt(4);
    const metric=(['growth','share','ratio'] as const)[randomInt(3)];
    const value=dataValue({metric,rows,focus});
    const distractors=new Set<number>();
    while(distractors.size<3) {
      const offset=(randomInt(2)===0?-1:1)*(metric==='ratio'?randomInt(1,16)/10:randomInt(1,26));
      const candidate=Math.round((value+offset)*10)/10;
      if(candidate!==value && (metric==='growth'||candidate>0) && (metric!=='share'||candidate<100)) distractors.add(candidate);
    }
    const options=shuffle([value,...distractors]);
    return {kind,version:1,metric,rows,focus,options,answer:[options.indexOf(value)+1]};
  }
  const answer = shuffle([1,2,3,4,5,6,7,8,9]).slice(0,3);
  return {kind,version:1,target:answer[0]*answer[1]+answer[2],answer};
}
export function dataValue(q:Pick<DataQuestion,'metric'|'rows'|'focus'>) {
  const r=q.rows[q.focus];
  const value=q.metric==='growth'?(r.after-r.before)/r.before*100
    :q.metric==='share'?r.after/q.rows.reduce((sum,row)=>sum+row.after,0)*100
    :r.after/q.rows[(q.focus+1)%q.rows.length].after;
  return Math.round(value*10)/10;
}
/** Explicit projection: no answers or explanation until submission. */
export function publicQuestion(q:PracticeQuestion) {
  if(q.kind==='figure')return {kind:q.kind,version:q.version,frames:q.frames,options:q.options};
  if(q.kind==='pipeline') return {kind:q.kind,version:q.version,input:q.input,output:q.output,boxes:q.boxes??[null],difficulty:q.difficulty??'easy'};
  if(q.kind==='data') return {kind:q.kind,version:q.version,metric:q.metric,rows:q.rows,focus:q.focus,options:q.options};
  return {kind:q.kind,version:q.version,target:q.target,expression:'a × b + c',distinct:true,min:1,max:9};
}
export type PublicQuestion = ReturnType<typeof publicQuestion>;

export function gradeAnswer(q:PracticeQuestion,answer:number[]):boolean {
  if (q.kind === 'pipeline') {
    return isPermutation(answer) && (q.boxes??[null]).reduce<number[]>((seq,box)=>apply(box??answer,seq),q.input).every((v,i)=>v===q.output[i]);
  }
  if(q.kind==='figure')return answer.length===1 && answer[0]===q.answer[0];
  if(q.kind==='data') return answer.length===1 && Number.isInteger(answer[0]) && answer[0]===q.answer[0];
  return answer.length===3 && new Set(answer).size===3
    && answer.every(v=>Number.isInteger(v) && v>=1 && v<=9)
    && answer[0]*answer[1]+answer[2]===q.target;
}

/** Reconstruct a lesson from the stored question, including older version-1 attempts. */
export function explainQuestion(q:PracticeQuestion,submitted:number[]) {
  if(q.kind==='figure')return {kind:'figure' as const,rule:q.rule,frames:[...q.frames,q.options[q.answer[0]-1]],choice:q.answer[0]};
  if(q.kind==='pipeline') {
    const boxes=q.boxes??[null];
    const unknown=boxes.findIndex(b=>b===null);
    let before=q.input;
    for(let i=0;i<unknown;i++) before=apply(boxes[i]!,before);
    let after=q.output;
    for(let i=boxes.length-1;i>unknown;i--) after=apply(invert(boxes[i]!),after);
    let seq=q.input;
    const steps=boxes.map((box,index)=>{
      const input=seq;
      const permutation=box??q.answer;
      seq=apply(permutation,input);
      return {input,output:seq,permutation,unknown:index===unknown};
    });
    return {kind:'pipeline' as const,unknown,before,after,steps};
  }
  if(q.kind==='data') {
    const r=q.rows[q.focus];
    const denominator=q.metric==='growth'?r.before:q.metric==='share'?q.rows.reduce((s,row)=>s+row.after,0):q.rows[(q.focus+1)%4].after;
    return {kind:'data' as const,numerator:q.metric==='growth'?r.after-r.before:r.after,denominator,value:dataValue(q)};
  }
  const digits=gradeAnswer(q,submitted)?submitted:q.answer;
  return {kind:'numerical' as const,digits,product:digits[0]*digits[1],target:q.target};
}
export type Explanation = ReturnType<typeof explainQuestion>;
