import type { ExamPublicQuestion } from '@/lib/exam-types';
import {PipelineBoard,PipelineShapeLane,PipelineStage} from '@/components/pipeline/PipelineBoard';
import styles from '@/components/pipeline/PipelineBoard.module.css';

const SWITCH_PREVIEW_QUESTION: Extract<ExamPublicQuestion,{kind:'pipeline'}> = {
  kind:'pipeline',version:2,input:[1,2,3,4],output:[3,4,1,2],boxes:[[2,1,4,3],null],difficulty:'medium',options:[[2,1,4,3],[4,3,2,1],[3,4,1,2]],
};

/** A deterministic, display-only version of the Switch question shown before an exam starts. */
export default function ExamPreview({zh}:{zh:boolean}){
  const q=SWITCH_PREVIEW_QUESTION;
  return <div className="p-6">
    <div className="mb-5 flex justify-between text-xs text-slate-500"><span>{zh?'第 8 题 · 管道推理':'Question 8 · Switch'}</span><span className="font-mono">04:32</span></div>
    <p className="mb-4 text-sm leading-6 text-slate-600">{zh?'模拟卷预览：正式考试中，选择一个排列，使输入经过所有层后与输出一致。':'Mock exam preview: during the exam, choose the permutation that makes the pipeline match the output.'}</p>
    <div className="mx-auto max-w-lg"><PipelineBoard ariaLabel={zh?'管道题':'Pipeline question'} stagePorts={q.boxes.map(box=>box?1:3)} inputLane={<PipelineShapeLane label={zh?'输入':'Input'} lane="input" order={q.input}/>} outputLane={<PipelineShapeLane label={zh?'输出':'Output'} lane="output" order={q.output}/>}>
      {q.boxes.map((box,i)=><PipelineStage key={i} label={zh?`第 ${i+1} 级`:`Stage ${i+1}`} ports={box?1:3} state={{key:i,value:box?.join('')??'',unknown:!box}} valueEditor={!box?<div aria-hidden="true" className={`${styles.candidates} min-w-0`}>{q.options.map(option=><span key={option.join('')} className={`${styles.choice} pointer-events-none cursor-default`}><span className={styles.digits}>{option.join('')}</span></span>)}</div>:undefined}/>)}</PipelineBoard></div>
    <div className="mt-5 rounded-lg bg-indigo-50 p-3 text-center text-sm text-indigo-700">{zh?'全屏专注 · 连续限时作答':'Fullscreen focus · timed challenges'}</div>
  </div>;
}
