import test from 'node:test';
import assert from 'node:assert/strict';
import { generateQuestion,gradeAnswer,publicQuestion } from '../src/lib/practice';
import { generateGrid } from '../src/lib/exam';
import { FREE_PRACTICE_PER_KIND,PRACTICE_KINDS,hasFullAccess } from '../src/lib/access-policy';

test('every practice kind generates varied, gradeable questions without leaking answers',()=>{
 for(const kind of ['pipeline','numerical','figure','data','memory'] as const){
  const seen=new Set<string>();
  for(let i=0;i<20;i++){
   const q=generateQuestion(kind,'medium');
   assert.equal(gradeAnswer(q,q.answer),true);
   assert.equal('answer' in publicQuestion(q),false);
   seen.add(JSON.stringify(q));
  }
  assert.ok(seen.size>=15,`${kind} should rarely repeat (got ${seen.size} distinct of 20)`);
 }
});
test('grid training rounds are random and sized by difficulty',()=>{
 const seen=new Set<string>();
 for(const length of [3,4,5])for(let i=0;i<10;i++){
  const q=generateGrid(length);
  assert.equal(q.sequence.length,length);assert.equal(q.spatial.length,length);
  assert.equal(new Set(q.sequence).size,length);
  seen.add(q.sequence.join(','));
 }
 assert.ok(seen.size>=25);
});
test('free allowance policy covers each practice kind',()=>{
 assert.equal(FREE_PRACTICE_PER_KIND,10);
 assert.deepEqual([...PRACTICE_KINDS],['pipeline','numerical','data','figure','grid']);
 assert.equal(hasFullAccess('paid'),true);
 assert.equal(hasFullAccess('trial'),true);
 assert.equal(hasFullAccess('expired'),false);
});
