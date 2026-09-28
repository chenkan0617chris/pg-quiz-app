'use client';

import { Fragment, useRef, useState } from 'react';
import styles from './NumericalBoard.module.css';

export default function NumericalBoard({ target, values, onChange, disabled, zh }: {
  target: number;
  values: string[];
  onChange: (values: string[]) => void;
  disabled: boolean;
  zh: boolean;
}) {
  const [active, setActive] = useState(0);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function enter(value: string, index = active) {
    if (disabled || !/^[1-9]?$/.test(value)) return;
    if (value && values.some((digit, i) => i !== index && digit === value)) return;
    const next = values.map((digit, i) => i === index ? value : digit);
    onChange(next);
    if (value) {
      const empty = next.findIndex((digit, i) => i > index && !digit);
      const nextIndex = empty >= 0 ? empty : next.findIndex(digit => !digit);
      if (nextIndex >= 0) {
        setActive(nextIndex);
        inputs.current[nextIndex]?.focus();
      }
    }
  }

  function erase() {
    if (disabled) return;
    const index = values[active] ? active : values.findLastIndex((digit, i) => i < active && !!digit);
    if (index < 0) return;
    onChange(values.map((digit, i) => i === index ? '' : digit));
    setActive(index);
    inputs.current[index]?.focus();
  }

  return <div className={styles.board}>
    <div className={styles.equation} role="group" aria-label={zh ? '填写算式' : 'Complete the equation'}>
      {values.map((value, index) => <Fragment key={index}>
        {index > 0 && <span aria-hidden="true">{index === 1 ? '×' : '+'}</span>}
        <input
          ref={element => { inputs.current[index] = element; }}
          className={`${styles.slot} ${!disabled && active === index ? styles.active : ''}`}
          aria-label={zh ? `第 ${index + 1} 个数字` : `Digit ${index + 1}`}
          autoComplete="off" inputMode="none" pattern="[1-9]" maxLength={1} required
          value={value} disabled={disabled}
          onFocus={event => { setActive(index); event.target.select(); }}
          onClick={event => event.currentTarget.select()}
          onChange={event => enter(event.target.value, index)}
          onKeyDown={event => {
            if (/^[1-9]$/.test(event.key)) { event.preventDefault(); enter(event.key, index); }
            if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); erase(); }
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault();
              inputs.current[(index + (event.key === 'ArrowRight' ? 1 : values.length - 1)) % values.length]?.focus();
            }
          }}
        />
      </Fragment>)}
      <span aria-hidden="true">=</span><span className={styles.target}>{target}</span>
    </div>
    <div className={styles.keypad} role="group" aria-label={zh ? '数字键盘' : 'Number pad'}>
      {Array.from({ length: 9 }, (_, i) => String(i + 1)).map(digit => <button
        key={digit} type="button" className={styles.key}
        disabled={disabled || values.includes(digit)}
        aria-label={zh ? `输入 ${digit}` : `Enter ${digit}`}
        onClick={() => enter(digit)}
      >{digit}</button>)}
    </div>
    <button type="button" className={styles.erase} onClick={erase}
      disabled={disabled || values.every(value => !value)}
      aria-label={zh ? '删除数字' : 'Delete digit'} title={zh ? '删除数字' : 'Delete digit'}>
      <svg width="42" height="46" viewBox="0 0 42 46" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7 14h28l-3 25a4 4 0 0 1-4 3H14a4 4 0 0 1-4-3L7 14ZM5 10a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v2H5v-2ZM15 6V4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v2M15 18l2 19M21 18v19M27 18l-2 19" />
      </svg>
    </button>
    <p className={styles.hint}>{zh ? '使用 1–9，不重复；点击空位可修改数字。任何符合等式的答案都算正确。' : 'Use distinct digits 1–9. Select a slot to edit. Any valid solution is accepted.'}</p>
  </div>;
}
