'use client';
import type {PublicQuestion} from '@/lib/practice';
import {PipelineBoard,PipelineShapeLane,PipelineStage} from '@/components/pipeline/PipelineBoard';

export default function PipelineQuestionBoard({question:q,values,onChange,disabled,zh}:{question:Extract<PublicQuestion,{kind:'pipeline'}>;values:string[];onChange:(values:string[])=>void;disabled:boolean;zh:boolean}){
 return <div className="space-y-4">
  <p className="text-sm leading-6 text-slate-600">{zh?'选择一个排列，使输入经过所有层后与输出一致。':'Choose the permutation that makes the pipeline match the output.'}</p>
  <div className="mx-auto max-w-lg"><PipelineBoard ariaLabel={zh?'管道题':'Pipeline question'} stagePorts={q.boxes.map(box=>box?1:3)} inputLane={<PipelineShapeLane label={zh?'输入':'Input'} lane="input" order={q.input}/>} outputLane={<PipelineShapeLane label={zh?'输出':'Output'} lane="output" order={q.output}/>}>
   {q.boxes.map((box,i)=><PipelineStage key={i} label={zh?`第 ${i+1} 级`:`Stage ${i+1}`} ports={box?1:3} state={{key:i,value:box?.join('')??'',unknown:!box}} valueEditor={!box?<fieldset disabled={disabled} className="w-full min-w-0"><legend className="sr-only">{zh?`第 ${i+1} 级`:`Stage ${i+1}`}</legend><div className="grid grid-cols-3 gap-2">{q.options.map((option,index)=>{const selected=values.join('')===option.join('');return <label key={option.join('')} className={`flex min-w-0 cursor-pointer flex-col items-center gap-2 rounded-xl border-2 px-1 py-3 ${selected?'border-indigo-600 bg-indigo-50 text-indigo-800':'border-sky-200 bg-white text-slate-800'} ${disabled?'cursor-default opacity-70':''}`}><input type="radio" name="pipeline-choice" aria-label={`${zh?'选项':'Option'} ${String.fromCharCode(65+index)}: ${option.join('')}`} checked={selected} onChange={()=>onChange(option.map(String))}/><span className="font-mono text-base font-bold tracking-wide sm:text-xl">{option.join('')}</span></label>;})}</div></fieldset>:undefined}/>)}
  </PipelineBoard></div>
 </div>;
}
