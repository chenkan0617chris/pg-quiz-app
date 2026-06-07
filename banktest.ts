// Inline the engine functions needed
type Perm = number[];
function apply(box: Perm, seq: number[]): number[] { return box.map(s => seq[s-1]); }
function composeApply(f: Perm, s: Perm): Perm { return s.map(i => f[i-1]); }
function foldBoxes(b: Perm[]): Perm { return b.reduce<Perm>((a,x)=>composeApply(a,x),[1,2,3,4]); }

// Rebuild the puzzle bank inline
const ALL_PERMS: string[] = [];
for (const a of [1,2,3,4]) for (const b of [1,2,3,4]) for (const c of [1,2,3,4]) for (const d of [1,2,3,4]) {
  if (new Set([a,b,c,d]).size===4) ALL_PERMS.push(`${a}${b}${c}${d}`);
}
function parseP(s: string): Perm { return s.split('').map(Number); }
function wrongOpts(correct: string, seed: number): string[] {
  const pool = ALL_PERMS.filter(p => p !== correct);
  const result: string[] = []; let i = seed % pool.length;
  while (result.length < 3) {
    const c = pool[i % pool.length];
    if (!result.includes(c)) result.push(c);
    i = (i*7+seed+3)%pool.length;
  }
  return result;
}
function arrangeOptions(correct: string, wrong: string[], seed: number): string[] {
  const pos = seed%4; const opts = wrong.slice(); opts.splice(pos,0,correct); return opts;
}
function make(id: number, difficulty: string, inputOrder: number[], allBoxes: string[], hideIdx: number) {
  const perms = allBoxes.map(parseP);
  const outputOrder = apply(foldBoxes(perms), inputOrder);
  const answer = allBoxes[hideIdx];
  const boxes = allBoxes.map((b,i) => i===hideIdx ? null : b);
  const wrong = wrongOpts(answer, id);
  const options = arrangeOptions(answer, wrong, id);
  return { id, difficulty, inputOrder, boxes, outputOrder, options, answer };
}

const PUZZLES = [
  make(1,'easy',[1,2,3,4],['1324','2413'],1), make(2,'easy',[1,2,3,4],['2143','1324'],0),
  make(3,'easy',[1,2,3,4],['4321','2143'],0), make(4,'easy',[1,2,3,4],['3412','1324'],1),
  make(5,'easy',[2,1,3,4],['2413','3412'],0), make(6,'easy',[1,2,3,4],['3142','4123'],1),
  make(7,'easy',[4,3,2,1],['2341','3412'],0), make(8,'easy',[1,2,3,4],['4231','2341'],1),
  make(9,'easy',[1,3,2,4],['1432','3214'],0), make(10,'easy',[1,2,3,4],['3214','1432'],1),
  make(11,'medium',[1,2,3,4],['1324','2413','2143'],1), make(12,'medium',[1,2,3,4],['2143','1324','3412'],0),
  make(13,'medium',[1,2,3,4],['3412','2143','1324'],2), make(14,'medium',[2,1,3,4],['4321','1324','2413'],1),
  make(15,'medium',[1,2,3,4],['2413','4321','1324'],0), make(16,'medium',[1,3,2,4],['1324','3412','2143'],2),
  make(17,'medium',[1,2,3,4],['3142','2143','4321'],1), make(18,'medium',[4,3,2,1],['2341','1432','3214'],0),
  make(19,'medium',[1,2,3,4],['4231','3142','2143'],2), make(20,'medium',[2,4,1,3],['2143','2413','1324'],1),
  make(21,'hard',[1,2,3,4],['1324','2413','2143','4321'],2), make(22,'hard',[1,2,3,4],['2143','3412','1324','2413'],1),
  make(23,'hard',[2,1,3,4],['4321','1324','2413','3412'],3), make(24,'hard',[1,2,3,4],['3412','2143','4321','1324'],0),
  make(25,'hard',[1,3,2,4],['2413','1324','3142','2143'],2), make(26,'hard',[1,2,3,4],['4123','2341','1432','3214'],1),
  make(27,'hard',[3,2,1,4],['3214','2413','1324','4231'],3), make(28,'hard',[1,2,3,4],['2341','4321','3142','2413'],0),
  make(29,'hard',[4,1,2,3],['1432','3412','2143','1324'],2), make(30,'hard',[1,2,3,4],['3142','4231','2413','1432'],1),
];

let pass=0,fail=0;
for (const p of PUZZLES) {
  const allBoxes = p.boxes.map(b => b ?? p.answer);
  const out = apply(foldBoxes(allBoxes.map(parseP)), p.inputOrder);
  const ok = JSON.stringify(out)===JSON.stringify(p.outputOrder);
  const inOpts = p.options.includes(p.answer);
  const uniq = new Set(p.options).size===4;
  if (ok&&inOpts&&uniq) pass++;
  else { fail++; console.log(`FAIL #${p.id}`,{ok,inOpts,uniq,out,expected:p.outputOrder}); }
}
console.log(`\n${pass}/30 puzzles valid${fail?` — ${fail} FAILED`:' ✓'}`);
