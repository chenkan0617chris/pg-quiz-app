export type AccessStatus = 'trial' | 'paid' | 'expired';
export function accessStatus(trialEnd:number, paidEnd:number|null, now:number, lifetime=false):AccessStatus {
  if (lifetime) return 'paid';
  if (paidEnd !== null && paidEnd > now) return 'paid';
  return trialEnd > now ? 'trial' : 'expired';
}
