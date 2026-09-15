import type { Block } from '@/content/blocks';

/** Slug used for heading anchors so the table of contents can link into the body. */
export function headingId(text: string, index: number): string {
  return `s${index}-${text.replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 24).toLowerCase()}`;
}

/** Server-rendered article body: crawlers get the full text without running JavaScript. */
export default function Prose({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-5 text-[15px] leading-7 text-slate-700">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2 key={i} id={headingId(block.text, i)} className="scroll-mt-24 pt-4 text-xl font-bold text-slate-900">
                {block.text}
              </h2>
            );
          case 'h3':
            return (
              <h3 key={i} className="pt-2 text-base font-semibold text-slate-900">
                {block.text}
              </h3>
            );
          case 'ul':
            return (
              <ul key={i} className="list-disc space-y-2 pl-6 marker:text-slate-400">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            );
          case 'ol':
            return (
              <ol key={i} className="list-decimal space-y-2 pl-6 marker:text-slate-400">
                {block.items.map((item, j) => <li key={j}>{item}</li>)}
              </ol>
            );
          case 'note':
            return (
              <p key={i} className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-slate-700">
                {block.text}
              </p>
            );
          case 'example':
            return (
              <div key={i} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="mb-3 font-semibold text-slate-900">{block.title}</p>
                <ol className="list-decimal space-y-1.5 pl-5 font-mono text-sm marker:text-slate-400">
                  {block.lines.map((line, j) => <li key={j}>{line}</li>)}
                </ol>
              </div>
            );
          default:
            return <p key={i}>{block.text}</p>;
        }
      })}
    </div>
  );
}
