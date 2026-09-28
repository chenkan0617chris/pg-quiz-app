import test from 'node:test';
import assert from 'node:assert/strict';
import { freePracticeQuestion } from '../src/lib/free-practice';
import { gradeAnswer,publicQuestion } from '../src/lib/practice';
import { FREE_SAMPLES_PER_KIND,hasFullAccess } from '../src/lib/access-policy';

test('free samples are fixed, independently selectable and correctly graded',()=>{
 for(const kind of ['pipeline','numerical','figure','data','memory'] as const){
  const seen=new Set();
  for(let index=0;index<FREE_SAMPLES_PER_KIND;index++){
   const q=freePracticeQuestion(kind,index);
   assert.deepEqual(q,freePracticeQuestion(kind,index));
   assert.equal(gradeAnswer(q,q.answer),true);
   assert.equal('answer' in publicQuestion(q),false);
   seen.add(JSON.stringify(q));
   q.answer[0]=-1;
   assert.notEqual(freePracticeQuestion(kind,index).answer[0],-1);
  }
  assert.equal(seen.size,FREE_SAMPLES_PER_KIND);
  for(const invalid of [-1,5,0.5])assert.throws(()=>freePracticeQuestion(kind,invalid));
 }
 assert.equal(hasFullAccess('paid'),true);
 assert.equal(hasFullAccess('trial'),true);
 assert.equal(hasFullAccess('expired'),false);
});
