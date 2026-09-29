'use client';
import { useState } from 'react';
import type { ExamPublicQuestion } from '@/lib/exam-types';
import PipelineQuestionBoard from '@/components/practice/PipelineQuestionBoard';
import NumericalBoard from '@/components/practice/NumericalBoard';
import GridBoard from './GridBoard';

export default function ExamQuestion({question:q,questionId,zh,disabled,onSubmit}:{question:ExamPublicQuestion;questionId?:string;zh:boolean;disabled:boolean;onSubmit:(answer:number[])=>void}){
  const [values,setValues]=useState<string[]>(Array(q.kind==='pipeline'?4:q.kind==='numerical'?3:0).fill(''));
  const [gridAnswer,setGridAnswer]=useState<number[]|null>(null);
  const complete=q.kind==='grid'?gridAnswer!==null:values.length>0&&values.every(Boolean);
  return <form onSubmit={e=>{e.preventDefault();if(complete&&!disabled)onSubmit(gridAnswer??values.map(Number));}} className="space-y-6">
    {q.kind==='pipeline'&&<PipelineQuestionBoard question={q} values={values} onChange={setValues} disabled={disabled} zh={zh}/>}
    {q.kind==='numerical'&&<><p className="text-sm text-slate-600">{zh?'使用 1–9 的三个不同数字完成算式。先乘后加。':'Use three distinct digits from 1–9. Multiply before adding.'}</p><NumericalBoard target={q.target} values={values} onChange={setValues} disabled={disabled} zh={zh}/></>}
    {q.kind==='grid'&&<GridBoard storageKey={questionId} question={q} zh={zh} disabled={disabled} onAnswer={setGridAnswer}/>}
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5"><span className="text-xs text-slate-500">{zh?'提交后不可返回，交卷后统一查看答案。':'No backtracking. Answers appear after finishing the exam.'}</span><button disabled={disabled||!complete} className="rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white disabled:opacity-40">{disabled?(zh?'保存中…':'Saving…'):(zh?'提交并继续 →':'Submit & continue →')}</button></div>
  </form>;
}
