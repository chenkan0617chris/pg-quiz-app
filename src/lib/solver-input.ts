import { z } from 'zod';

const order = z.array(z.number().int().min(1).max(4)).length(4).refine(v => new Set(v).size === 4);
export const pipelineSchema = z.object({
  inputUnknown: z.boolean(), outputUnknown: z.boolean(),
  inputOrder: order, outputOrder: order,
  boxes: z.array(z.object({value:z.string().max(4),unknown:z.boolean()})).min(1).max(8),
  candidates: z.string().max(160),
}).refine(v => {
  const count = v.candidates.split(',').filter(s => s.trim()).length;
  return Math.pow(count, v.boxes.filter(b => b.unknown).length) <= 4096;
}, 'Too many combinations');

const id = z.string().max(100);
const token = z.discriminatedUnion('kind', [
  z.object({kind:z.literal('blank'),id}),
  z.object({kind:z.literal('op'),id,op:z.enum(['+','-','*','/'])}),
  z.object({kind:z.literal('lparen'),id}),
  z.object({kind:z.literal('rparen'),id}),
]);
export const numericalSchema = z.object({
  tokens:z.array(token).min(1).max(40), target:z.number().finite().min(-1e9).max(1e9),
  range:z.enum(['1-9','0-9']),distinct:z.boolean(),
}).refine(({tokens}) => {
  let expectOperand = true, depth = 0;
  for (const t of tokens) {
    if (t.kind === 'blank') { if (!expectOperand) return false; expectOperand=false; }
    else if (t.kind === 'op') { if (expectOperand) return false; expectOperand=true; }
    else if (t.kind === 'lparen') { if (!expectOperand) return false; depth++; }
    else { if (expectOperand || depth === 0) return false; depth--; }
  }
  return !expectOperand && depth === 0;
}, 'Invalid equation');
