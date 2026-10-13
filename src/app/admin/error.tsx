'use client';
export default function AdminError({reset}:{reset:()=>void}) {
  return <section role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-6"><h2 className="font-semibold">暂时无法读取后台数据</h2><p className="mt-2 text-sm text-slate-600">请稍后重试；如果持续失败，请检查数据库和账号服务连接。</p><button onClick={reset} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">重试</button></section>;
}
