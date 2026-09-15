import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQuestion, gradeAnswer, publicQuestion } from '../src/lib/practice';

test('generated questions always accept their reference answers', () => {
  for (const kind of ['pipeline','numerical'] as const) {
    for (let i=0;i<100;i++) {
      const q = generateQuestion(kind);
      assert.equal(gradeAnswer(q,q.answer),true);
      assert.equal(gradeAnswer(q,[]),false);
      assert.equal('answer' in publicQuestion(q),false);
    }
  }
});
test('numeric grading accepts alternate solutions and rejects repeated/out of range digits', () => {
  const q = {kind:'numerical' as const,version:1 as const,target:11,answer:[2,3,5]};
  assert.equal(gradeAnswer(q,[3,2,5]),true);
  assert.equal(gradeAnswer(q,[2,2,7]),false);
  assert.equal(gradeAnswer(q,[1,1,10]),false);
  assert.equal(gradeAnswer(q,[2,3,4]),false);
});

import { explainQuestion, dataValue } from '../src/lib/practice';
import { preferredLanguage } from '../src/lib/language';
import { apply } from '../src/lib/engine';

test('browser language defaults and manual overrides',()=>{
  assert.equal(preferredLanguage(null,['zh-CN','en-US']),'zh');
  assert.equal(preferredLanguage(null,['zh-TW']),'zh');
  assert.equal(preferredLanguage(null,['en-AU','zh-CN']),'en');
  assert.equal(preferredLanguage('zh',['en-US']),'zh');
  assert.equal(preferredLanguage('en',['zh-CN']),'en');
  assert.equal(preferredLanguage('invalid',['en']),'en');
  assert.equal(preferredLanguage(null,[]),'en');
});

function permutations(a:number[]):number[][] {
  return a.length?a.flatMap((v,i)=>permutations(a.filter((_,j)=>i!==j)).map(rest=>[v,...rest])):[[]];
}
test('all pipeline difficulties have exactly one solution and a valid reversible lesson',()=>{
  const candidates=permutations([1,2,3,4]);
  for(const difficulty of ['easy','medium','hard'] as const) for(let i=0;i<80;i++) {
    const q=generateQuestion('pipeline',difficulty);
    assert.equal(q.kind,'pipeline');
    if(q.kind!=='pipeline')throw new Error();
    assert.equal(q.boxes?.length,{easy:1,medium:2,hard:3}[difficulty]);
    assert.deepEqual(candidates.filter(p=>gradeAnswer(q,p)),[q.answer]);
    const lesson=explainQuestion(q,q.answer);
    if(lesson.kind!=='pipeline')throw new Error();
    assert.deepEqual(apply(q.answer,lesson.before),lesson.after);
    assert.deepEqual(lesson.steps.at(-1)?.output,q.output);
    assert.equal(publicQuestion(q).kind,'pipeline');
    assert.equal(JSON.stringify(publicQuestion(q)).includes('answer'),false);
  }
});
test('data exercises have unique options, independently correct math, and single-choice grading',()=>{
  const metrics=new Set();
  for(let i=0;i<300;i++) {
    const q=generateQuestion('data');
    if(q.kind!=='data')throw new Error();
    metrics.add(q.metric);
    const r=q.rows[q.focus];
    const raw=q.metric==='growth'?(r.after-r.before)*100/r.before:q.metric==='share'?r.after*100/q.rows.reduce((a,b)=>a+b.after,0):r.after/q.rows[(q.focus+1)%4].after;
    assert.equal(dataValue(q),Math.round(raw*10)/10);
    assert.equal(new Set(q.options).size,4);
    assert.equal(q.options[q.answer[0]-1],dataValue(q));
    for(let choice=1;choice<=4;choice++) assert.equal(gradeAnswer(q,[choice]),choice===q.answer[0]);
    assert.equal(gradeAnswer(q,[q.answer[0],1]),false);
    assert.equal('answer' in publicQuestion(q),false);
  }
  assert.equal(metrics.size,3);
});
test('old pipeline rows and alternate numerical solutions have explanations',()=>{
  const old={kind:'pipeline' as const,version:1 as const,input:[1,2,3,4],output:[4,3,2,1],answer:[4,3,2,1]};
  assert.equal(gradeAnswer(old,old.answer),true);
  assert.equal(explainQuestion(old,old.answer).kind,'pipeline');
  const ex=explainQuestion({kind:'numerical',version:1,target:11,answer:[2,3,5]},[3,2,5]);
  assert.deepEqual(ex,{kind:'numerical',digits:[3,2,5],product:6,target:11});
});
