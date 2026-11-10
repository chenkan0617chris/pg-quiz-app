'use client';
import type {PublicQuestion} from '@/lib/practice';
import {PipelineBoard,PipelineShapeLane,PipelineStage} from '@/components/pipeline/PipelineBoard';
import styles from '@/components/pipeline/PipelineBoard.module.css';

/** Same board as the pipeline solver; the unknown stage shows its three candidates as selectable boxes. */
export default function PipelineQuestionBoard({question:q,values,onChange,disabled,zh}:{question:Extract<PublicQuestion,{kind:'pipeline'}>;values:string[];onChange:(values:string[])=>void;disabled:boolean;zh:boolean}){
 return <div className="space-y-4">
  <p className="text-sm leading-6 text-slate-600">{zh?'选择一个排列，使输入经过所有层后与输出一致。':'Choose the permutation that makes the pipeline match the output.'}</p>
  <div className="mx-auto max-w-lg"><PipelineBoard ariaLabel={zh?'管道题':'Pipeline question'} stagePorts={q.boxes.map(box=>box?1:3)} inputLane={<PipelineShapeLane label={zh?'输入':'Input'} lane="input" order={q.input}/>} outputLane={<PipelineShapeLane label={zh?'输出':'Output'} lane="output" order={q.output}/>}>
   {q.boxes.map((box,i)=><PipelineStage key={i} label={zh?`第 ${i+1} 级`:`Stage ${i+1}`} ports={box?1:3} state={{key:i,value:box?.join('')??'',unknown:!box}} valueEditor={!box?<fieldset disabled={disabled} className={`${styles.candidates} min-w-0 border-0 p-0`}><legend className="sr-only">{zh?`第 ${i+1} 级，三选一`:`Stage ${i+1}, choose one`}</legend>{q.options.map((option,index)=>{const selected=values.join('')===option.join('');return <label key={option.join('')} className={`${styles.choice} ${selected?styles.choiceSelected:''} ${disabled?'cursor-default':'cursor-pointer'}`}><input type="radio" name="pipeline-choice" aria-label={`${zh?'选项':'Option'} ${String.fromCharCode(65+index)}: ${option.join('')}`} checked={selected} onChange={()=>onChange(option.map(String))} className={styles.choiceRadio}/><span className={styles.digits}>{option.join('')}</span></label>;})}</fieldset>:undefined}/>)}
  </PipelineBoard></div>
 </div>;
}
