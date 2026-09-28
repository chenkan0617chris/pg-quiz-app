import { z } from 'zod';
import { MEMORY_POINTS } from './memory-layout';

// The stored question applies the stricter, question-specific grading rules.
export const practiceAnswerSchema = z.array(z.number().int().min(0).max(MEMORY_POINTS.length)).min(1).max(7);
