'use client';

import { useI18n } from '@/lib/i18n';
import { OP_CYCLE, OP_SYMBOL, uid, type Op, type Token } from '@/lib/numeric';

export default function EquationBuilder({
  tokens,
  target,
  onChange,
  onTarget,
  onClear,
  onSample,
}: {
  tokens: Token[];
  target: string;
  onChange: (t: Token[]) => void;
  onTarget: (v: string) => void;
  onClear: () => void;
  onSample: () => void;
}) {
  const { t } = useI18n();

  const removeAt = (id: string) => onChange(tokens.filter((tk) => tk.id !== id));
  const setOp = (id: string, op: Op) =>
    onChange(tokens.map((tk) => (tk.id === id && tk.kind === 'op' ? { ...tk, op } : tk)));

  const add = (tk: Token) => onChange([...tokens, tk]);

  return (
    <div>
      {/* equation row */}
      <div className="flex min-h-[64px] flex-wrap items-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-3">
        {tokens.length === 0 && (
          <span className="px-2 text-sm text-gray-400">{t('numEquation')}…</span>
        )}

        {tokens.map((tk) => (
          <div key={tk.id} className="group relative">
            {/* delete badge */}
            <button
              type="button"
              onClick={() => removeAt(tk.id)}
              aria-label="remove"
              className="absolute -right-2 -top-2 z-10 hidden h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-[11px] leading-none text-white shadow group-hover:flex hover:bg-red-500"
            >
              ×
            </button>

            {tk.kind === 'blank' && (
              <div className="h-11 w-11 rounded-lg border-2 border-dashed border-gray-300 bg-white" />
            )}

            {tk.kind === 'op' && (
              <select
                value={tk.op}
                onChange={(e) => setOp(tk.id, e.target.value as Op)}
                className="h-11 w-11 cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white text-center text-xl font-semibold text-indigo-600 focus:border-indigo-400 focus:outline-none"
              >
                {OP_CYCLE.map((op) => (
                  <option key={op} value={op}>
                    {OP_SYMBOL[op]}
                  </option>
                ))}
              </select>
            )}

            {(tk.kind === 'lparen' || tk.kind === 'rparen') && (
              <div className="flex h-11 w-7 items-center justify-center text-3xl font-semibold text-gray-500">
                {tk.kind === 'lparen' ? '(' : ')'}
              </div>
            )}
          </div>
        ))}

        {/* = target */}
        <span className="px-1 text-2xl font-semibold text-gray-400">=</span>
        <input
          inputMode="numeric"
          value={target}
          onChange={(e) => onTarget(e.target.value)}
          className="h-11 w-24 rounded-lg border border-gray-300 bg-white px-3 text-center text-lg font-semibold text-gray-800 focus:border-indigo-400 focus:outline-none"
        />
      </div>

      {/* add controls */}
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => add({ kind: 'blank', id: uid() })}>{t('numAddSlot')}</Btn>
        <Btn onClick={() => add({ kind: 'op', id: uid(), op: '+' })}>{t('numAddOp')}</Btn>
        <Btn onClick={() => add({ kind: 'lparen', id: uid() })}>(</Btn>
        <Btn onClick={() => add({ kind: 'rparen', id: uid() })}>)</Btn>
        <Btn onClick={onSample} subtle>
          {t('numReset')}
        </Btn>
        <Btn onClick={onClear} subtle>
          {t('numClear')}
        </Btn>
      </div>

      <p className="mt-3 text-xs text-gray-400">{t('numBuilderHint')}</p>
    </div>
  );
}

function Btn({
  children,
  onClick,
  subtle,
}: {
  children: React.ReactNode;
  onClick: () => void;
  subtle?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        subtle
          ? 'rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-500 transition hover:bg-gray-100'
          : 'rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100'
      }
    >
      {children}
    </button>
  );
}
