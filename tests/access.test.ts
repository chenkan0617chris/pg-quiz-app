import test from 'node:test';
import assert from 'node:assert/strict';
import { accessStatus } from '../src/lib/access-status';

test('trial lasts exactly seven days and paid access takes precedence',()=>{
 const start=Date.parse('2026-09-01T00:00:00Z');
 const end=start+7*86400000;
 assert.equal(accessStatus(end,null,end-1),'trial');
 assert.equal(accessStatus(end,null,end),'expired');
 assert.equal(accessStatus(end,end+1000,end),'paid');
 assert.equal(accessStatus(end,end,end),'expired');
});
