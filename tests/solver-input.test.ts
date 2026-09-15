import test from 'node:test';
import assert from 'node:assert/strict';
import { pipelineSchema, numericalSchema } from '../src/lib/solver-input';

const pipeline = { inputUnknown: false, outputUnknown: false, inputOrder: [1,2,3,4], outputOrder: [4,3,2,1], boxes: [{value:'',unknown:true}], candidates:'' };
test('accepts ordinary pipeline and rejects invalid shape values', () => {
  assert.equal(pipelineSchema.safeParse(pipeline).success, true);
  assert.equal(pipelineSchema.safeParse({...pipeline,inputOrder:[1,1,2,3]}).success, false);
});
test('rejects combinatorial pipeline explosion', () => {
  assert.equal(pipelineSchema.safeParse({...pipeline,boxes:Array(8).fill({value:'',unknown:true}),candidates:'1234,1243,1324,1342,1423,1432'}).success,false);
});
test('rejects unbounded numeric options and malformed expressions', () => {
  const input = {tokens:[{kind:'blank',id:'a'},{kind:'op',id:'b',op:'+'},{kind:'blank',id:'c'}],target:3,range:'1-9',distinct:true};
  assert.equal(numericalSchema.safeParse(input).success,true);
  assert.equal(numericalSchema.safeParse({...input,target:Infinity}).success,false);
  assert.equal(numericalSchema.safeParse({...input,range:'1-999999'}).success,false);
  assert.equal(numericalSchema.safeParse({...input,tokens:[{kind:'blank',id:'a'},{kind:'blank',id:'b'}]}).success,false);
});
