import test from 'node:test';
import assert from 'node:assert/strict';
import { isAdminId, parseActivityFilters } from '../src/lib/admin/policy';

test('admin allowlist fails closed and requires an exact authenticated user id',()=>{
  assert.equal(isAdminId(null,'user_owner'),false);
  assert.equal(isAdminId('user_owner',''),false);
  assert.equal(isAdminId('user_owner',undefined),false);
  assert.equal(isAdminId('user_owner','user_owner2'),false);
  assert.equal(isAdminId('user_owner',' user_other, user_owner \n'),true);
});
test('activity filters validate real calendar dates, tool names and pagination',()=>{
  assert.deepEqual(parseActivityFilters({}),{tool:'',from:null,to:null,page:1});
  assert.deepEqual(parseActivityFilters({tool:'solver:pipeline',from:'2026-10-01',to:'2026-10-13',page:'2'}),
    {tool:'solver:pipeline',from:'2026-10-01T00:00:00.000Z',to:'2026-10-14T00:00:00.000Z',page:2});
  for(const params of [{from:'2026-02-30'},{to:'oops'},{from:'2026-10-14',to:'2026-10-13'},{tool:'bad'},{page:'-1'},{page:'1.5'},{page:'99999999'}])
    assert.throws(()=>parseActivityFilters(params));
});
