'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { EXAM_SECTIONS, type ExamView, type ExamCommand } from '@/lib/exam-types';
import ExamQuestion from './ExamQuestion';

export default function ExamRunner({initial,zh,onClose,onComplete}:{initial:ExamView;zh:boolean;onClose:()=>void;onComplete:(id:string)=>void}){
  const [exam,setExam]=useState(initial);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [remaining,setRemaining]=useState(Math.max(0,Math.ceil(((initial.deadline??initial.serverNow)-initial.serverNow)/1000)));
  const [focused,setFocused]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const root=useRef<HTMLDivElement>(null);
  const lock=useRef(false);
  const anchor=useRef({server:initial.serverNow,local:0});
  const examRef=useRef(exam);
  useEffect(()=>{examRef.current=exam;},[exam]);
  const call=useCallback(async(command:ExamCommand)=>{
    if(lock.current)return;
    lock.current=true;setBusy(true);setError('');
    try{
      const response=await fetch('/api/exams',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:initial.id,...command})});
      if(!response.ok)throw new Error(response.status===403?(zh?'会员已到期。请交卷保存，再开通会员继续。':'Membership expired. Finish to save, then renew.'):(zh?'保存失败，请重试。已保存的答案不会丢失，计时仍继续。':'Could not save. Retry; saved answers are safe and the clock continues.'));
      const next=await response.json() as ExamView;
      anchor.current={server:next.serverNow,local:performance.now()};
      setExam(next);
      setRemaining(Math.max(0,Math.ceil(((next.deadline??next.serverNow)-next.serverNow)/1000)));
      if(next.phase==='completed'){
        if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});
        onComplete(next.id);
      }
    }catch(e){setError(e instanceof Error?e.message:'Unavailable');}
    finally{lock.current=false;setBusy(false);}
  },[initial.id,zh,onComplete]);
  useEffect(()=>{
    anchor.current={server:initial.serverNow,local:performance.now()};
    function focus(){setFocused(document.fullscreenElement===root.current&&!document.hidden);}
    document.addEventListener('fullscreenchange',focus);document.addEventListener('visibilitychange',focus);
    const unload=(event:BeforeUnloadEvent)=>{if(examRef.current.phase==='running'){event.preventDefault();}};
    window.addEventListener('beforeunload',unload);
    return ()=>{document.removeEventListener('fullscreenchange',focus);document.removeEventListener('visibilitychange',focus);window.removeEventListener('beforeunload',unload);};
  },[initial.serverNow]);
  useEffect(()=>{
    if(exam.phase!=='running')return;
    let lastSync=performance.now();
    const timer=setInterval(()=>{
      const now=performance.now();
      const left=Math.max(0,Math.ceil((exam.deadline!-anchor.current.server-(now-anchor.current.local))/1000));
      setRemaining(left);
      if(now-lastSync>15000||(left===0&&now-lastSync>3000)){lastSync=now;void call({action:'sync'});}
    },250);
    return ()=>clearInterval(timer);
  },[exam.phase,exam.deadline,call]);
  async function fullscreen(){
    setError('');
    if(!root.current?.requestFullscreen||!document.fullscreenEnabled){setError(zh?'当前浏览器不支持全屏考试，请使用电脑端 Chrome、Edge 或支持全屏的浏览器。':'Fullscreen is unavailable. Use a desktop browser with fullscreen support.');return false;}
    try{if(document.fullscreenElement!==root.current)await root.current.requestFullscreen();setFocused(true);return true;}
    catch{setError(zh?'未能进入全屏，请允许全屏后重试。':'Fullscreen was denied. Allow it and retry.');return false;}
  }
  async function begin(){if(await fullscreen())void call({action:'begin',section:exam.section});}
  async function leave(){if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});onClose();}
  const section=EXAM_SECTIONS[exam.section];
  const blocked=exam.phase==='running'&&!focused;
  return <div ref={root} role="dialog" aria-modal="true" aria-label={zh?'模拟考场':'Mock exam room'} className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
    <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900 px-5 py-4 text-white"><div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4"><div><p className="text-xs uppercase tracking-widest text-indigo-200">P&G STYLE · {zh?'模拟考':'MOCK EXAM'}</p><h1 className="mt-1 font-semibold">{section.name[zh?'zh':'en']}</h1></div><div className="flex items-center gap-5"><div className="text-right"><p className="text-xs text-slate-300">{zh?'本项剩余':'Section time left'}</p><strong className={`font-mono text-3xl tabular-nums ${remaining<=30&&exam.phase==='running'?'text-rose-300':''}`}>{exam.phase==='ready'?`${section.seconds/60}:00`:`${Math.floor(remaining/60)}:${String(remaining%60).padStart(2,'0')}`}</strong></div><button disabled={busy} onClick={()=>setConfirm(true)} className="rounded-lg border border-slate-500 px-3 py-2 text-sm">{zh?'交卷':'Finish exam'}</button></div></div></header>
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8"><ol className="mb-6 grid grid-cols-3 gap-2">{EXAM_SECTIONS.map((s,i)=><li key={s.kind} className={`border-t-4 pt-3 text-xs sm:text-sm ${i===exam.section?'border-indigo-600 font-semibold text-indigo-700':i<exam.section?'border-emerald-500 text-slate-500':'border-slate-200 text-slate-400'}`}>{i+1}. {s.name[zh?'zh':'en']}</li>)}</ol>
      {error&&<div role="alert" className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</div>}
      {confirm?<section className="rounded-2xl border bg-white p-8"><h2 className="text-xl font-semibold">{zh?'确认提前交卷？':'Finish this exam now?'}</h2><p className="my-4 leading-7 text-slate-600">{zh?'交卷后不能继续。本题未提交的答案会记为未答，未开始的项目为 0 分。已提交答案会保存并生成报告。':'You cannot resume after finishing. The current unsubmitted question will be unanswered; unstarted sections score zero. Saved answers will appear in your report.'}</p><div className="flex flex-wrap gap-3"><button disabled={busy} onClick={()=>void call({action:'finish'})} className="rounded-xl bg-indigo-600 px-5 py-3 text-white">{zh?'确认交卷并查看报告':'Finish & view report'}</button><button disabled={busy} onClick={()=>setConfirm(false)} className="rounded-xl border px-5 py-3">{zh?'返回考试':'Return to exam'}</button></div></section>
      :exam.phase==='ready'?<section className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-10"><p className="text-sm font-medium text-indigo-600">{zh?'考前说明 · 此页不计时':'Instructions · timer has not started'}</p><h2 className="mt-3 text-3xl font-semibold">{section.name[zh?'zh':'en']} <span className="text-slate-400">/ {section.seconds/60} min</span></h2><p className="mt-5 leading-8 text-slate-600">{exam.section===0?(zh?'根据输入和输出图形，推导缺失的排列。连续作答，正确越多难度逐步提升。时限内尽可能准确地完成更多题目。':'Infer the missing permutation from the input and output. Difficulty rises with correct answers. Complete as many accurately as possible within the time limit.'):exam.section===1?(zh?'用 1–9 的不同数字填写 a × b + c = 目标值。符合条件的多种答案都算正确。':'Fill a × b + c = target using distinct digits from 1–9. Every valid solution is accepted.'):(zh?'共 9 轮。每次记住一个位置，随后判断图案是否左右对称，最后按顺序回忆所有位置。每轮 3–5 个位置，随正确轮数增加。':'Nine rounds. Remember a position, judge symmetry, then recall every position in order. Three to five positions per round, increasing with correct rounds.')}</p><ul className="my-6 space-y-3 text-sm text-slate-600"><li>{zh?'• 点击开始后进入全屏并计时，超时自动结束本项。':'• Starting enters fullscreen and starts the clock. This section ends automatically at its deadline.'}</li><li>{zh?'• 退出全屏、切换页面或刷新都不会暂停计时。':'• Leaving fullscreen, switching tabs or refreshing does not pause the clock.'}</li><li>{zh?'• 作答过程中不显示正确答案，不可返回上一题。':'• No answers or backtracking during the exam.'}</li></ul><div className="flex flex-wrap gap-3"><button disabled={busy} onClick={()=>void begin()} className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{zh?'进入全屏，开始本项':'Enter fullscreen & start'}</button><button onClick={()=>void leave()} className="rounded-xl border px-5 py-3">{zh?'返回中心（保留进度）':'Back to centre (keep progress)'}</button></div></section>
      :blocked?<section className="rounded-2xl border border-amber-200 bg-white p-10 text-center"><h2 className="text-2xl font-semibold">{zh?'请恢复全屏作答':'Return to fullscreen'}</h2><p className="my-5 text-slate-600">{zh?'你已离开全屏或切换页面，题目暂时隐藏。考试计时仍在继续。':'The exam is hidden while fullscreen is inactive. The timer continues.'}</p><button onClick={()=>void fullscreen()} className="rounded-xl bg-indigo-600 px-6 py-3 text-white">{zh?'恢复全屏':'Resume fullscreen'}</button></section>
      :null}
      {exam.phase==='running'&&exam.current&&<section hidden={blocked||confirm} inert={blocked||confirm} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-8"><div className="mb-6 flex items-center justify-between text-sm text-slate-500"><span>{zh?`第 ${exam.answered+1} ${exam.section===2?'轮':'题'}`:`Question ${exam.answered+1}`}{exam.section===2?' / 9':''}</span><span>{zh?'答案自动保存':'Answers saved on submission'}</span></div><ExamQuestion key={exam.current.id} questionId={exam.current.id} question={exam.current.question} zh={zh} disabled={busy||remaining===0||blocked||confirm} onSubmit={answer=>void call({action:'answer',questionId:exam.current!.id,answer})}/></section>}
    </div>
  </div>;
}
