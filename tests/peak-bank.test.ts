import test from 'node:test';
import assert from 'node:assert/strict';
import { PAIRS, PEAK_DIMENSIONS, SCENARIOS, STATEMENTS } from '../src/content/peak-bank';
import { drawRound } from '../src/components/exam/PeakTraining';

test('PEAK bank covers every dimension with positive and reverse statements',()=>{
 for(const dim of Object.keys(PEAK_DIMENSIONS)){
  assert.ok(STATEMENTS.filter(s=>s.dim===dim&&!s.reverse).length>=3,dim);
  assert.ok(STATEMENTS.filter(s=>s.dim===dim&&s.reverse).length>=2,dim);
 }
 assert.ok(PAIRS.length>=20);assert.ok(SCENARIOS.length>=15);
 for(const s of SCENARIOS)assert.equal(s.options.length,4);
 const texts=[...STATEMENTS.map(s=>s.zh),...SCENARIOS.map(s=>s.zh)];
 assert.equal(new Set(texts).size,texts.length);
});
test('each PEAK round is a fresh random mix with a reverse-worded consistency check',()=>{
 const rounds=Array.from({length:10},drawRound);
 for(const round of rounds){
  assert.equal(round.length,18);
  const statements=round.flatMap(e=>e.type==='statement'?[e.item]:[]);
  assert.equal(statements.length,10);
  for(const r of statements.filter(s=>s.reverse))assert.ok(statements.some(s=>s.dim===r.dim&&!s.reverse));
  assert.equal(round.filter(e=>e.type==='pair').length,5);
  assert.equal(round.filter(e=>e.type==='scenario').length,3);
 }
 assert.ok(new Set(rounds.map(r=>JSON.stringify(r))).size>=9);
});
