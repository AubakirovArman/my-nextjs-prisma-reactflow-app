'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

const TelegramNode = ({ data }: NodeProps<{ label?: string; incomingData?: Record<string, unknown> }>) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-blue-700 border-2 border-blue-800 text-white w-48">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="flex flex-col">
        <div className="text-sm font-bold mb-1">{data.label || 'Telegram'}</div>
        <div className="text-xs p-2 bg-blue-800/70 rounded-sm min-h-[30px]">
          {data.incomingData !== undefined ? (
            <pre className="whitespace-pre-wrap break-all">{JSON.stringify(data.incomingData, null, 2)}</pre>
          ) : (
            <span className="italic opacity-70">Ожидание данных...</span>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default TelegramNode;
