'use client';

import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface ScheduleNodeData {
  label?: string;
  cron?: string;
}

const ScheduleNode = ({ id, data }: NodeProps<ScheduleNodeData>) => {
  const { setNodes } = useReactFlow();
  const [cronValue, setCronValue] = useState(data.cron || '');

  const onCronChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      setCronValue(newValue);
      setNodes((currentNodes) =>
        currentNodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, cron: newValue } } : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-emerald-700 border-2 border-emerald-800 text-white w-56">
      <div className="text-sm font-bold mb-2">{data.label || 'Schedule'}</div>
      <div className="mb-2">
        <label className="block text-xs text-emerald-200 mb-1">Cron выражение:</label>
        <input
          type="text"
          value={cronValue}
          onChange={onCronChange}
          className="w-full px-2 py-1 text-xs bg-emerald-800 border border-emerald-600 rounded text-white placeholder-emerald-300"
          placeholder="0 * * * *"
        />
      </div>
      <Handle type="source" position={Position.Right} id="output" className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default ScheduleNode;
