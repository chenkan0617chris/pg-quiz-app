'use client';
import {useI18n} from '@/lib/i18n';
export default function Figure({mask,onChange,label}:{mask:number;onChange?:(mask:number)=>void;label:string}) {
 const {lang}=useI18n();
 return <div className="w-24 shrink-0"><p className="mb-2 text-center text-xs text-slate-500">{label}</p><div className="grid grid-cols-3 gap-1 rounded-lg border border-slate-300 bg-slate-100 p-2" role={onChange?'group':'img'} aria-label={`${label}: ${lang==='zh'?'黑格位置':'filled cells'} ${Array.from({length:9},(_,i)=>i+1).filter(i=>mask&(1<<(i-1))).join(', ')||'—'}`}>
 {Array.from({length:9},(_,i)=>onChange?<button type="button" key={i} aria-label={`${label}, ${lang==='zh'?'格':'cell'} ${i+1}`} aria-pressed={!!(mask&(1<<i))} onClick={()=>onChange(mask^(1<<i))} className={`aspect-square rounded-sm border ${mask&(1<<i)?'bg-indigo-900 border-indigo-900':'bg-white border-slate-300'}`}/>:<span key={i} className={`aspect-square rounded-sm ${mask&(1<<i)?'bg-indigo-900':'bg-white'}`}/>)}</div></div>;
}
