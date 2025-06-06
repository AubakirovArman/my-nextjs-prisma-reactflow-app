'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface DelayNodeData {
  label?: string;
  ms?: number;
}

const DelayNode = ({ id, data }: NodeProps<DelayNodeData>) => {
  const [ms, setMs] = useState(data.ms || 1000);

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setMs(Number(e.target.value));
  }, []);

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-yellow-600 border-2 border-yellow-700 text-white w-48">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="text-sm font-bold mb-2">{data.label || 'Delay'}</div>
      <input
        type="number"
        value={ms}
        onChange={onChange}
        className="w-full px-2 py-1 text-xs bg-yellow-700 border border-yellow-500 rounded text-white"
      />
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default DelayNode;
