import test from 'node:test';
import assert from 'node:assert/strict';
import {generateQuestion,publicQuestion,gradeAnswer} from '../src/lib/practice';
import {freePracticeQuestion} from '../src/lib/free-practice';
import {newExam,transitionExam} from '../src/lib/exam';
test('all pipeline levels have three distinct choices with exactly one correct answer',()=>{
 for(const difficulty of ['easy','medium','hard'] as const)for(let i=0;i<40;i++){
  const q=generateQuestion('pipeline',difficulty);const view=publicQuestion(q);
  if(view.kind!=='pipeline')throw Error('pipeline expected');
  assert.equal(view.options.length,3);
  assert.equal(new Set(view.options.map(x=>x.join(''))).size,3);
  assert.equal(view.options.filter(x=>gradeAnswer(q,x)).length,1);
  assert.deepEqual(publicQuestion(q),view);
 }
});
test('free pipeline bank covers all three levels with stable choices',()=>{
 const levels=new Set<number>();
 for(let i=0;i<5;i++){const q=freePracticeQuestion('pipeline',i);const v=publicQuestion(q);if(v.kind!=='pipeline')throw Error();levels.add(v.boxes.length);assert.equal(v.options.length,3);assert.equal(v.options.filter(x=>gradeAnswer(q,x)).length,1);}
 assert.deepEqual([...levels].sort(),[1,2,3]);
});
test('exam introduces multi-stage pipelines even after incorrect answers',()=>{
 let s=transitionExam(newExam('test',0),{action:'begin',section:0},1);
 const levels=[];
 for(let i=0;i<6;i++){const q=s.current!;if(q.question.kind!=='pipeline')throw Error();levels.push(q.question.boxes?.length??1);s=transitionExam(s,{action:'answer',questionId:q.id,answer:[]},i+2);}
 assert.ok(levels.includes(2));assert.ok(levels.includes(3));
});
test('saved version-1 pipelines retain answers and receive stable choices',()=>{
 const q={kind:'pipeline' as const,version:1 as const,input:[1,2,3,4],output:[3,1,4,2],answer:[3,1,4,2]};
 const v=publicQuestion(q);if(v.kind!=='pipeline')throw Error();
 assert.deepEqual(v.boxes,[null]);assert.equal(v.options.length,3);
 assert.equal(v.options.filter(x=>gradeAnswer(q,x)).length,1);
 assert.deepEqual(publicQuestion(q),v);assert.equal('answer' in v,false);
});
