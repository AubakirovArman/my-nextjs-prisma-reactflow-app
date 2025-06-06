'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface MathNodeData {
  label?: string;
  operation?: string;
  operand?: number;
  result?: number;
}

const MathNode = ({ id, data }: NodeProps<MathNodeData>) => {
  const [operation, setOperation] = useState(data.operation || 'add');
  const [operand, setOperand] = useState(data.operand || 0);

  const onOpChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setOperation(e.target.value);
  }, []);

  const onOperandChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setOperand(Number(e.target.value));
  }, []);

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-indigo-600 border-2 border-indigo-700 text-white w-56">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="text-sm font-bold mb-2">{data.label || 'Math'}</div>
      <select
        value={operation}
        onChange={onOpChange}
        className="w-full px-2 py-1 text-xs bg-indigo-700 border border-indigo-500 rounded text-white mb-1"
      >
        <option value="add">Add</option>
        <option value="subtract">Subtract</option>
        <option value="multiply">Multiply</option>
        <option value="divide">Divide</option>
      </select>
      <input
        type="number"
        value={operand}
        onChange={onOperandChange}
        className="w-full px-2 py-1 text-xs bg-indigo-700 border border-indigo-500 rounded text-white"
      />
      {data.result !== undefined && (
        <div className="mt-2 text-xs">{data.result}</div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default MathNode;
