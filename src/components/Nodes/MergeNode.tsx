'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface MergeNodeData {
  label?: string;
  collected?: any[];
}

const MergeNode = ({ data }: NodeProps<MergeNodeData>) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-fuchsia-600 border-2 border-fuchsia-700 text-white w-48">
      <Handle type="target" position={Position.Left} id="a" className="!bg-slate-700 !w-3 !h-3" style={{ top: '30%' }} />
      <Handle type="target" position={Position.Left} id="b" className="!bg-slate-700 !w-3 !h-3" style={{ bottom: '30%' }} />
      <div className="text-sm font-bold mb-2">{data.label || 'Merge'}</div>
      {data.collected && data.collected.length > 0 && (
        <div className="text-xs bg-fuchsia-700/70 p-1 rounded mb-2">
          <pre>{JSON.stringify(data.collected, null, 2)}</pre>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default MergeNode;
