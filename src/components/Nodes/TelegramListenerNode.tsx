'use client';

import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

const TelegramListenerNode = ({ data }: NodeProps<{ label?: string }>) => {
  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-blue-600 border-2 border-blue-800 text-white w-48">
      <div className="text-sm font-bold mb-2">{data.label || 'Telegram Listener'}</div>
      <div className="text-xs italic opacity-80 mb-2">Ожидание сообщения...</div>
      <Handle type="source" position={Position.Right} id="output" className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default TelegramListenerNode;
