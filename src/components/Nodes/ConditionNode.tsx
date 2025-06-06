'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface ConditionNodeData {
  label?: string;
  condition?: string;
  incomingData?: any;
  result?: boolean;
}

const ConditionNode = ({ id, data }: NodeProps<ConditionNodeData>) => {
  const [expr, setExpr] = useState(data.condition || '');

  const onExprChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newVal = e.target.value;
      setExpr(newVal);
    },
    []
  );

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-teal-600 border-2 border-teal-700 text-white w-64">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="text-sm font-bold mb-2">{data.label || 'Condition'}</div>
      <input
        type="text"
        value={expr}
        onChange={onExprChange}
        className="w-full px-2 py-1 text-xs bg-teal-700 border border-teal-500 rounded text-white placeholder-teal-300"
        placeholder="value > 10"
      />
      {data.result !== undefined && (
        <div className="mt-2 text-xs">Result: {String(data.result)}</div>
      )}
      <Handle type="source" id="true" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" style={{ top: '30%' }} />
      <Handle type="source" id="false" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" style={{ bottom: '30%' }} />
    </div>
  );
};

export default ConditionNode;
