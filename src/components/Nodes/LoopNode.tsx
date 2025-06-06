'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface LoopNodeData {
  label?: string;
}

const LoopNode = ({ data }: NodeProps<LoopNodeData>) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-rose-600 border-2 border-rose-700 text-white w-48">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="text-sm font-bold mb-2">{data.label || 'Loop'}</div>
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default LoopNode;
