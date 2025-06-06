'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface DatabaseNodeData {
  label?: string;
  action?: string;
  status?: string;
}

const DatabaseNode = ({ id, data }: NodeProps<DatabaseNodeData>) => {
  const [action, setAction] = useState(data.action || 'log');

  const onActionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(e.target.value);
  }, []);

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-emerald-600 border-2 border-emerald-700 text-white w-56">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="text-sm font-bold mb-2">{data.label || 'Database'}</div>
      <select
        value={action}
        onChange={onActionChange}
        className="w-full px-2 py-1 text-xs bg-emerald-700 border border-emerald-500 rounded text-white"
      >
        <option value="log">Log</option>
        <option value="save">Save</option>
      </select>
      {data.status && <div className="mt-2 text-xs">{data.status}</div>}
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default DatabaseNode;
