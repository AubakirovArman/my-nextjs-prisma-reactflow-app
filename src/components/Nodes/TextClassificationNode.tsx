// src/components/Nodes/TextClassificationNode.tsx
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

const TextClassificationNode = ({ data }: NodeProps<{ label?: string; incomingData?: unknown }>) => {
  const renderValue = (value: unknown) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return '[object]';
      }
    }
    return String(value);
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-yellow-600 border-2 border-yellow-700 text-white w-60">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="text-sm font-bold mb-2">{data.label || 'Text Classify'}</div>
      <div className="text-xs p-2 bg-yellow-700/70 rounded-sm min-h-[40px] max-h-[150px] overflow-y-auto">
        {data.incomingData !== undefined ? (
          <pre className="whitespace-pre-wrap break-all">{renderValue(data.incomingData)}</pre>
        ) : (
          <span className="italic opacity-70">Ожидание данных...</span>
        )}
      </div>
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default TextClassificationNode;
