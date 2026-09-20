'use client';

import type { Flow } from '@/lib/engine';
import { useI18n } from '@/lib/i18n';
import { PipelineBoard, PipelineShapeLane, PipelineStage } from './PipelineBoard';

/** Vertical pipeline diagram: input chip -> box pills -> intermediate/output chips. */
export default function FlowDiagram({
  flow,
  highlightOutput = false,
}: {
  flow: Flow;
  highlightOutput?: boolean;
}) {
  const { t } = useI18n();
  const output = flow.stages.at(-1)?.seqAfter ?? flow.input;

  return (
    <div className="mt-6">
      <PipelineBoard
        ariaLabel={t('pipelineDiagram')}
        inputLane={<PipelineShapeLane label={t('inputOrder')} lane="input" order={flow.input}/>}
        outputLane={<PipelineShapeLane label={t('outputOrder')} lane="output" order={output} highlight={highlightOutput}/>}
      >
        {flow.stages.map((stage, index) => (
          <PipelineStage
            key={index}
            label={t('pipelineStage', index + 1)}
            state={{
              key: index,
              value: stage.box.join(''),
              solved: stage.solved,
            }}
          />
        ))}
      </PipelineBoard>
    </div>
  );
}
