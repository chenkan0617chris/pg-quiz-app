import type { Language } from '@/lib/language';

// Unique unordered combinations: 9 choose 3 = 84. Order does not change a product.
const triples = Array.from({ length: 9 }, (_, i) => i + 1).flatMap(a =>
  Array.from({ length: 9 - a }, (_, i) => a + i + 1).flatMap(b =>
    Array.from({ length: 9 - b }, (_, i) => b + i + 1).map(c => ({ a, b, c, product: a * b * c })),
  ),
).sort((left, right) => left.product - right.product || left.a - right.a || left.b - right.b);

export default function TripleProductTable({ lang }: { lang: Language }) {
  const zh = lang === 'zh';
  return <section id="triple-product-table" className="mt-10 border-t border-slate-200 pt-8">
    <h2 className="text-xl font-bold">{zh ? '宝洁三乘表：1–9 不重复数字乘积练习' : 'Triple-product table: three distinct digits from 1–9'}</h2>
    <p className="mt-3 text-sm leading-7 text-slate-600">{zh
      ? '准备宝洁计算题时，三乘表可用于熟悉三个数字相乘的组合。下表列出 1–9 中三个互不相同数字的全部 84 种无序组合，按乘积从小到大排列。交换因数顺序不改变乘积，因此不重复列出；不包含 0 或重复数字。相同乘积可能对应多组数字。'
      : 'Use this table before your assessment to learn products of three distinct digits. It contains all 84 unordered combinations from 1–9, sorted by product. Reordering factors does not change the result. Zero and repeated digits are excluded; some products have multiple combinations.'}</p>
    <div className="my-5 rounded-xl bg-slate-50 p-5 text-sm leading-7">
      <h3 className="font-semibold">{zh ? '原创例题：a × b × c + d = 122' : 'Original example: a × b × c + d = 122'}</h3>
      <p>{zh ? '若四个数字均在 1–9 且不重复，先试 d = 2，剩余乘积为 120。表中 3 × 5 × 8 = 120，且 2 未被使用，因此 3 × 5 × 8 + 2 = 122 是一个可行解。还需核对题目的其他限制；找到一个解不代表只有一个解。' : 'For four distinct digits from 1–9, try d = 2. The remaining product is 120. The table gives 3 × 5 × 8 = 120 and none of those digits is 2, so 3 × 5 × 8 + 2 = 122 is one valid answer. Check all other constraints; one answer does not prove uniqueness.'}</p>
    </div>
    <details className="rounded-xl border border-slate-200 p-4">
      <summary className="cursor-pointer font-medium text-indigo-700">{zh ? '查看完整三乘表（84 组）' : 'View the full table (84 combinations)'}</summary>
      <div className="mt-4 max-h-96 overflow-auto">
        <table className="w-full text-left text-sm">
          <caption className="pb-3 text-left text-slate-500">{zh ? '独立生成的数学练习表，非官方测评资料。' : 'Independently generated mathematics reference, not official assessment material.'}</caption>
          <thead><tr className="border-b"><th scope="col" className="p-2">{zh ? '乘积' : 'Product'}</th><th scope="col" className="p-2">{zh ? '三个不重复数字' : 'Three distinct digits'}</th></tr></thead>
          <tbody>{triples.map(({a,b,c,product}) => <tr key={`${a}-${b}-${c}`} className="border-b border-slate-100"><td className="p-2 font-mono">{product}</td><td className="p-2 font-mono">{a} × {b} × {c}</td></tr>)}</tbody>
        </table>
      </div>
    </details>
    <p className="mt-3 text-xs leading-6 text-slate-500">{zh ? '请用于考前学习；正式测评是否允许参考资料，以招聘方规则为准。' : 'For preparation before the assessment. Follow the employer’s rules on reference materials during the actual test.'}</p>
  </section>;
}
