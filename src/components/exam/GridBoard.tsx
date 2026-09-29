'use client';
import { useEffect, useState } from 'react';
import type { PublicGrid } from '@/lib/exam-types';

type Progress={phase:'ready'|'watch'|'spatial'|'recall'|'done';index:number;spatial:number[];recall:number[];watchUntil:number};
function restore(key:string|undefined,length:number):Progress {
  const empty:Progress={phase:'ready',index:0,spatial:[],recall:[],watchUntil:0};
  if(!key||typeof window==='undefined')return empty;
  try{const p=JSON.parse(sessionStorage.getItem(`grid-progress:${key}`)??'null');
    if(p&&Number.isFinite(p.watchUntil)&&['ready','watch','spatial','recall','done'].includes(p.phase)&&Number.isInteger(p.index)&&p.index>=0&&p.index<length&&Array.isArray(p.spatial)&&p.spatial.length<=length&&p.spatial.every((n:unknown)=>n===0||n===1)&&Array.isArray(p.recall)&&p.recall.length<=length&&p.recall.every((n:unknown)=>Number.isInteger(n)&&Number(n)>=1&&Number(n)<=25))return p;
  }catch{}
  return empty;
}

/** Single observation followed by interference, repeated before ordered recall. */
export default function GridBoard({question:q,storageKey,zh,disabled,onAnswer}:{question:PublicGrid;storageKey?:string;zh:boolean;disabled:boolean;onAnswer:(answer:number[])=>void}){
  const [saved]=useState(()=>restore(storageKey,q.sequence.length));
  const [phase,setPhase]=useState(saved.phase);
  const [index,setIndex]=useState(saved.index);
  const [spatial,setSpatial]=useState<number[]>(saved.spatial);
  const [recall,setRecall]=useState<number[]>(saved.recall);
  const [watchUntil,setWatchUntil]=useState(saved.watchUntil);
  useEffect(()=>{
    if(storageKey){try{sessionStorage.setItem(`grid-progress:${storageKey}`,JSON.stringify({phase,index,spatial,recall,watchUntil}));}catch{}}
    if(phase==='done')onAnswer([...recall,...spatial]);
  },[phase,index,spatial,recall,watchUntil,storageKey,onAnswer]);
  useEffect(()=>{
    if(phase!=='watch')return;
    const timer=setTimeout(()=>setPhase('spatial'),Math.max(0,watchUntil-Date.now()));
    return ()=>clearTimeout(timer);
  },[phase,index,watchUntil]);
  function judge(value:number,now:number){
    if(disabled)return;
    setSpatial([...spatial,value]);
    if(index+1<q.sequence.length){setIndex(index+1);setWatchUntil(now+1000);setPhase('watch');}
    else setPhase('recall');
  }
  function pick(value:number){
    if(disabled||phase!=='recall'||recall.includes(value))return;
    const next=[...recall,value];setRecall(next);
    if(next.length===q.sequence.length){setPhase('done');}
  }
  return <div className="space-y-5">
    <p className="text-sm leading-6 text-slate-600">{zh?'每记住一个圆点，完成一次左右对称判断；最后按顺序回忆全部位置。只能观察一次。':'Remember a dot, then judge vertical symmetry. After all dots, recall their positions in order. One observation only.'}</p>
    <p role="status" className="font-medium">{phase==='ready'?(zh?'准备好后开始本轮':'Start this round when ready'):phase==='watch'?(zh?`观察位置 ${index+1} / ${q.sequence.length}`:`Observe ${index+1} / ${q.sequence.length}`):phase==='spatial'?(zh?'图案沿中间竖线左右对称吗？':'Is the pattern symmetric across its vertical centre?'):phase==='done'?(zh?'已输入，请提交本轮。':'Ready to submit this round.'):(zh?`依次点击位置 · ${recall.length} / ${q.sequence.length}`:`Recall in order · ${recall.length} / ${q.sequence.length}`)}</p>
    <div className="flex min-h-72 items-center justify-center rounded-2xl bg-[#40b1d9] p-5 sm:min-h-80">
      {phase==='spatial'?<div className="space-y-5"><div className="relative mx-auto grid w-44 grid-cols-4 gap-1 rounded-lg bg-white/30 p-2" aria-label={zh?'对称判断图案':'Symmetry pattern'}>
        {q.spatial[index].cells.map((v,i)=><span key={i} className={`aspect-square rounded-sm ${v?'bg-indigo-900':'bg-white'}`} aria-label={`${i+1}: ${v?(zh?'深色':'dark'):(zh?'白色':'white')}`}/>)}<span className="absolute inset-y-0 left-1/2 border-l-2 border-dashed border-pink-500"/>
      </div><div className="flex gap-3">{[1,0].map(value=><button key={value} type="button" disabled={disabled} onClick={()=>judge(value,Date.now())} className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-900 disabled:opacity-50">{value?(zh?'对称':'Symmetric'):(zh?'不对称':'Not symmetric')}</button>)}</div></div>:<div className="grid w-64 grid-cols-5 gap-5 sm:gap-7" aria-label={zh?'空间记忆板':'Grid memory board'}>{Array.from({length:25},(_,i)=>{
        const order=recall.indexOf(i+1),lit=phase==='watch'&&q.sequence[index]===i+1;
        return <button key={i} type="button" aria-label={zh?`位置 ${i+1}`:`Position ${i+1}`} disabled={disabled||phase!=='recall'||order>=0} onClick={()=>pick(i+1)} className={`aspect-square rounded-full border-2 border-white font-bold text-white focus-visible:outline-4 focus-visible:outline-indigo-900 ${lit||order>=0?'bg-[#c4449c]':'bg-white'}`}>{order>=0?order+1:''}</button>;
      })}</div>}
    </div>
    {phase==='ready'&&<button type="button" disabled={disabled} onClick={()=>{setWatchUntil(Date.now()+1000);setPhase('watch');}} className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white disabled:opacity-50">{zh?'开始观察':'Begin observation'}</button>}
  </div>;
}
