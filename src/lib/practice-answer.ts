export function updatePipelineDigit(values: string[], index: number, raw: string): string[] {
  const digit = raw.replace(/[^1-4]/g, '').slice(-1);
  if (raw && !digit) return values;
  return values.map((value, i) => (i === index ? digit : value));
}
