'use client';
import { useEffect, useSyncExternalStore } from 'react';

// Counts in-place upgrade cards on the page so the global banner does not repeat the same offer.
let cards = 0;
const listeners = new Set<() => void>();
function change(by: number) { cards += by; listeners.forEach(listener => listener()); }
function subscribe(listener: () => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }

export function useAnnounceUpgradeCard() {
  useEffect(() => { change(1); return () => change(-1); }, []);
}
export function useUpgradeCardShown() {
  return useSyncExternalStore(subscribe, () => cards > 0, () => false);
}
