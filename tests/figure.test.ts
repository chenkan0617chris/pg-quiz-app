import test from 'node:test';
import assert from 'node:assert/strict';
import {FIGURE_RULES,transformFigure,solveFigure} from '../src/lib/figure';
import {generateQuestion,gradeAnswer,publicQuestion,explainQuestion} from '../src/lib/practice';

test('figure transforms obey geometry and inversion',()=>{
 assert.equal(transformFigure(1,'cw'),4);
 assert.equal(transformFigure(1,'ccw'),64);
 assert.equal(transformFigure(1,'half'),256);
 assert.equal(transformFigure(4,'right'),1);
 assert.equal(transformFigure(64,'down'),1);
 assert.equal(transformFigure(1,'ring'),2);
 for(let mask=0;mask<512;mask++) {
  assert.equal(transformFigure(transformFigure(mask,'cw'),'ccw'),mask);
  assert.equal(transformFigure(transformFigure(mask,'mirror'),'mirror'),mask);
  assert.equal(transformFigure(transformFigure(mask,'invert'),'invert'),mask);
 }
});
test('solver validates complete sequence and handles unsupported input',()=>{
 assert.deepEqual(solveFigure([1,4,256,64,1]).map(r=>r.next),[4]);
 assert.deepEqual(solveFigure([1,4,7,99]),[]);
 assert.deepEqual(solveFigure([1,2]),[]);
 assert.deepEqual(solveFigure([1,2,512]),[]);
});
test('generated figures have distinct choices, one prediction, private rules and replayable explanations',()=>{
 const rules=new Set();
 for(let i=0;i<400;i++) {
  const q=generateQuestion('figure');if(q.kind!=='figure')throw new Error();
  rules.add(q.rule);
  assert.equal(new Set(q.options).size,5);
  assert.equal(q.frames.length,5);
  assert.equal(solveFigure(q.frames).length,1);
  assert.equal(solveFigure(q.frames)[0].next,q.options[q.answer[0]-1]);
  for(let j=1;j<=5;j++)assert.equal(gradeAnswer(q,[j]),j===q.answer[0]);
  assert.equal(gradeAnswer(q,[q.answer[0],1]),false);
  const pub=publicQuestion(q);assert.equal('rule' in pub,false);assert.equal('answer' in pub,false);
  const ex=explainQuestion(q,q.answer);if(ex.kind!=='figure')throw new Error();
  for(let j=1;j<ex.frames.length;j++)assert.equal(transformFigure(ex.frames[j-1],ex.rule),ex.frames[j]);
 }
 assert.equal(rules.size,FIGURE_RULES.length);
});
