// src/components/Nodes/AlertNode.tsx
'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

const AlertNode = ({ data }: NodeProps<{ label?: string; incomingValue?: unknown }>) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-amber-500 border-2 border-amber-600 text-white w-48">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-700 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="text-sm font-bold mb-1">
          {data.label || 'Alert'}
        </div>
        <div className="text-xs p-2 bg-amber-600/70 rounded-sm min-h-[30px]">
          {/* Вот здесь мы отображаем incomingValue */}
          {data.incomingValue !== undefined ? (
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(data.incomingValue, null, 2)}</pre>
          ) : (
            <span className="italic opacity-70">Ожидание данных...</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertNode;