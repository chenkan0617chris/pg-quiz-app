import test from 'node:test';
import assert from 'node:assert/strict';
import { newExam, transitionExam, examView, examReport, gradeExamQuestion, generateGrid } from '../src/lib/exam';

const start = () => transitionExam(newExam('test', 1000), {action:'begin',section:0}, 2000);
test('instructions do not start timer; begin is idempotent and answers stay private', () => {
  const ready=newExam('test',1000);
  assert.equal(ready.deadline,null);
  const state=start();
  assert.equal(state.deadline,362000);
  assert.deepEqual(transitionExam(state,{action:'begin',section:0},8000),state);
  const view=examView(state,3000);
  assert.ok(view.current);
  assert.equal('answer' in view.current.question,false);
  assert.equal('attempts' in view,false);
});
test('duplicate and stale question submissions cannot consume the next question', () => {
  const s=start();
  const q=s.current!;
  const next=transitionExam(s,{action:'answer',questionId:q.id,answer:q.question.kind==='grid'?[]:q.question.answer},3000);
  assert.equal(next.attempts.length,1);
  assert.equal(next.attempts[0].correct,true);
  assert.deepEqual(transitionExam(next,{action:'answer',questionId:q.id,answer:[]},4000),next);
});
test('deadline wins over late answer, records unanswered and moves to instructions', () => {
  const s=start();
  const next=transitionExam(s,{action:'answer',questionId:s.current!.id,answer:[1,2,3,4]},s.deadline!);
  assert.equal(next.phase,'ready');
  assert.equal(next.section,1);
  assert.equal(next.attempts[0].answer,null);
  assert.equal(next.attempts[0].elapsedMs,360000);
  assert.equal(next.deadline,null);
});
test('early finish includes unanswered, keeps zero scores finite and is idempotent', () => {
  const s=transitionExam(start(),{action:'finish'},7000);
  const r=examReport(s);
  assert.equal(s.phase,'completed');
  assert.equal(r.score,0);
  assert.equal(r.sections[0].unanswered,1);
  assert.equal(r.sections[0].seconds,5);
  assert.deepEqual(transitionExam(s,{action:'finish'},8000),s);
  assert.equal(examView(s,8000).current,null);
});
test('grid grades ordered recall and spatial judgements independently', () => {
  const q=generateGrid(3);
  const answer=[...q.sequence,...q.spatial.map(x=>x.symmetric?1:0)];
  assert.deepEqual(gradeExamQuestion(q,answer),{correct:true,earned:6,possible:6});
  answer[3]=1-answer[3];
  assert.deepEqual(gradeExamQuestion(q,answer),{correct:false,earned:5,possible:6});
  assert.deepEqual(gradeExamQuestion(q,[]),{correct:false,earned:0,possible:6});
});
test('expired last section completes exam, no further questions leak', () => {
  let s=start();
  s=transitionExam(s,{action:'sync'},s.deadline!);
  s=transitionExam(s,{action:'begin',section:1},400000);
  s=transitionExam(s,{action:'sync'},s.deadline!);
  s=transitionExam(s,{action:'begin',section:2},800000);
  s=transitionExam(s,{action:'sync'},s.deadline!+5000);
  assert.equal(s.phase,'completed');
  assert.equal(s.current,null);
  assert.equal(examReport(s).sections.length,3);
});

test('Grid never sends judgement answers and ends after exactly nine rounds',()=>{
  let s=start();
  s=transitionExam(s,{action:'sync'},s.deadline!);
  s=transitionExam(s,{action:'begin',section:1},400000);
  s=transitionExam(s,{action:'sync'},s.deadline!);
  s=transitionExam(s,{action:'begin',section:2},800000);
  for(let i=0;i<9;i++){
    const current=s.current!;
    assert.equal(current.question.kind,'grid');
    if(current.question.kind!=='grid')throw new Error();
    const view=examView(s,800000+i*1000).current!.question;
    assert.equal(view.kind,'grid');
    if(view.kind==='grid')assert.equal('symmetric' in view.spatial[0],false);
    const answer=[...current.question.sequence,...current.question.spatial.map(x=>Number(x.symmetric))];
    s=transitionExam(s,{action:'answer',questionId:current.id,answer},801000+i*1000);
  }
  assert.equal(s.phase,'completed');assert.equal(s.current,null);
  const report=examReport(s);
  assert.equal(report.sections[2].correct,9);assert.equal(report.sections[2].score,100);
});
