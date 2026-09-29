import { randomInt, randomUUID } from 'node:crypto';
import { generateQuestion, publicQuestion, gradeAnswer, explainQuestion } from './practice';
import { EXAM_SECTIONS, type ExamState, type ExamCommand, type ExamQuestion, type GridQuestion, type ExamView, type ExamReport } from './exam-types';

export function generateGrid(length:number):GridQuestion {
  const sequence:number[]=[];
  while(sequence.length<length){const n=randomInt(1,26);if(!sequence.includes(n))sequence.push(n);}
  const spatial=sequence.map(()=>{
    const cells=Array<number>(16).fill(0);
    for(let row=0;row<4;row++)for(let col=0;col<2;col++)cells[row*4+col]=cells[row*4+3-col]=randomInt(2);
    const symmetric=randomInt(2)===1;
    if(!symmetric){const i=randomInt(16);cells[i]=1-cells[i];}
    return {cells,symmetric};
  });
  return {kind:'grid',sequence,spatial};
}
export function gradeExamQuestion(q:ExamQuestion,answer:number[]) {
  if(q.kind!=='grid'){const correct=gradeAnswer(q,answer);return {correct,earned:correct?1:0,possible:1};}
  const length=q.sequence.length;
  const earned=q.sequence.reduce((sum,v,i)=>sum+Number(answer[i]===v),0)
    +q.spatial.reduce((sum,v,i)=>sum+Number(answer[length+i]===(v.symmetric?1:0)),0);
  return {correct:earned===length*2&&answer.length===length*2,earned:answer.length===length*2?earned:0,possible:length*2};
}
function publicExamQuestion(q:ExamQuestion) {
  return q.kind==='grid'?{kind:'grid' as const,sequence:q.sequence,spatial:q.spatial.map(x=>({cells:x.cells}))}:publicQuestion(q);
}
export function newExam(id:string,now:number):ExamState {
  return {id,version:1,createdAt:now,finishedAt:null,phase:'ready',section:0,deadline:null,startedAt:null,current:null,attempts:[],sectionMs:[0,0,0]};
}
function nextQuestion(s:ExamState,now:number) {
  const prior=s.attempts.filter(a=>a.section===s.section);
  const correct=prior.filter(a=>a.correct).length;
  const difficulty=EXAM_SECTIONS[s.section].kind==='pipeline'
    ?(prior.length<2?'easy':prior.length<4?'medium':'hard')
    :(correct<3?'easy':correct<7?'medium':'hard');
  const kind=EXAM_SECTIONS[s.section].kind;
  const question=kind==='grid'?generateGrid(correct<3?3:correct<6?4:5):generateQuestion(kind,difficulty);
  s.current={id:randomUUID(),question,shownAt:now};
}
function saveAnswer(s:ExamState,answer:number[]|null,now:number) {
  if(!s.current)return;
  const {id,question,shownAt}=s.current;
  s.attempts.push({id,section:s.section,question,answer,...gradeExamQuestion(question,answer??[]),elapsedMs:Math.max(0,now-shownAt)});
  s.current=null;
}
function endSection(s:ExamState,now:number) {
  saveAnswer(s,null,now);
  if(s.startedAt!==null)s.sectionMs[s.section]=Math.max(0,now-s.startedAt);
  s.startedAt=null;s.deadline=null;
  if(s.section===EXAM_SECTIONS.length-1){s.phase='completed';s.finishedAt=now;}
  else {s.section++;s.phase='ready';}
}
/** Pure transition, clock supplied only by the server. Old question IDs are idempotent. */
export function transitionExam(state:ExamState,command:ExamCommand,now:number):ExamState {
  if(state.phase==='completed')return state;
  const s=structuredClone(state);
  if(s.phase==='running'&&s.deadline!==null&&now>=s.deadline){
    endSection(s,s.deadline);
    // Never let a late/stale request start or answer the following section.
    if(command.action!=='finish')return s;
  }
  if(command.action==='finish'){
    if(s.phase==='running')endSection(s,now);
    s.phase='completed';s.finishedAt=now;s.current=null;
    return s;
  }
  if(command.action==='begin'&&s.phase==='ready'&&command.section===s.section){
    s.phase='running';s.startedAt=now;s.deadline=now+EXAM_SECTIONS[s.section].seconds*1000;nextQuestion(s,now);
  }
  if(command.action==='answer'&&s.phase==='running'&&s.current?.id===command.questionId){
    saveAnswer(s,command.answer,now);
    const count=s.attempts.filter(a=>a.section===s.section).length;
    if(count>=(s.section===2?9:200))endSection(s,now);
    else nextQuestion(s,now);
  }
  return s;
}
export function examView(s:ExamState,now:number):ExamView {
  return {id:s.id,createdAt:s.createdAt,finishedAt:s.finishedAt,phase:s.phase,section:s.section,deadline:s.deadline,serverNow:now,
    answered:s.attempts.filter(a=>a.section===s.section&&a.answer!==null).length,
    current:s.current?{id:s.current.id,question:publicExamQuestion(s.current.question)}:null};
}
export function examReport(s:ExamState):ExamReport {
  if(s.phase!=='completed')throw new Error('Exam still running');
  const sections=EXAM_SECTIONS.map((_,section)=>{
    const rows=s.attempts.filter(a=>a.section===section);
    const attempted=rows.filter(a=>a.answer!==null).length;
    const correct=rows.filter(a=>a.correct).length;
    const earned=rows.reduce((n,a)=>n+a.earned,0),possible=rows.reduce((n,a)=>n+a.possible,0);
    const seconds=s.sectionMs[section]/1000;
    const answeredMs=rows.filter(a=>a.answer!==null).reduce((n,a)=>n+a.elapsedMs,0);
    return {section,correct,wrong:attempted-correct,unanswered:rows.length-attempted,attempted,earned,possible,
      score:possible?Math.round(earned/possible*100):0,seconds,
      correctPerMinute:seconds?Math.round(correct/seconds*600)/10:0,averageSeconds:attempted?Math.round(answeredMs/attempted/100)/10:0};
  });
  return {id:s.id,createdAt:s.createdAt,finishedAt:s.finishedAt!,score:Math.round(sections.reduce((n,a)=>n+a.score,0)/3),sections,
    attempts:s.attempts.map(a=>({...a,question:publicExamQuestion(a.question),referenceAnswer:a.question.kind==='grid'?[...a.question.sequence,...a.question.spatial.map(x=>Number(x.symmetric))]:a.question.answer,
      explanation:a.question.kind==='grid'?null:explainQuestion(a.question,a.answer??[])}))};
}
