'use client';

import { useI18n, type DictKey } from '@/lib/i18n';
import { formatEquation, type NumericResult, type Token } from '@/lib/numeric';

export default function NumericResultView({
  result,
  tokens,
  target,
}: {
  result: NumericResult;
  tokens: Token[];
  target: string;
}) {
  const { t } = useI18n();

  if (result.errorKey) {
    return (
      <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
        <span>⚠️</span>
        <span>{t(result.errorKey as DictKey, ...(result.errorParams ?? []))}</span>
      </div>
    );
  }

  if (result.solutions.length === 0) {
    return <p className="text-sm text-gray-500">{t('numNoSolution')}</p>;
  }

  return (
    <div>
      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-sm font-semibold text-green-700">
          {t('numSolutionsFound', result.solutions.length)}
        </span>
        {result.truncated && (
          <span className="text-xs text-gray-400">{t('numTruncated', result.solutions.length)}</span>
        )}
      </div>

      <ul className="max-h-[60vh] space-y-1.5 overflow-auto pr-1">
        {result.solutions.map((assign, i) => (
          <li
            key={i}
            className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50/60 px-3 py-2 font-mono text-[15px] text-gray-800"
          >
            <span className="text-green-600">✓</span>
            <span className="tracking-wide">
              {formatEquation(tokens, assign)} = {target}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
