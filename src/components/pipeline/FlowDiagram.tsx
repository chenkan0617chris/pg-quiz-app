'use client';

import type { Flow } from '@/lib/engine';
import PipelineAnimation from './PipelineAnimation';

/** Solver result: animates the shapes through every box, with solved boxes revealed. */
export default function FlowDiagram({ flow }: { flow: Flow; highlightOutput?: boolean }) {
  return (
    <div className="mt-4">
      <PipelineAnimation
        key={JSON.stringify(flow)}
        input={flow.input}
        stages={flow.stages.map((stage) => ({ box: stage.box, unknown: stage.solved }))}
        autoPlay
      />
    </div>
  );
}
