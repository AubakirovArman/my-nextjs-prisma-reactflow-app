'use client';

import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface DatabaseTriggerData {
  label?: string;
  table?: string;
}

const DatabaseTriggerNode = ({ id, data }: NodeProps<DatabaseTriggerData>) => {
  const { setNodes } = useReactFlow();
  const [tableValue, setTableValue] = useState(data.table || '');

  const onTableChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      setTableValue(newValue);
      setNodes((currentNodes) =>
        currentNodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, table: newValue } } : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-orange-700 border-2 border-orange-800 text-white w-56">
      <div className="text-sm font-bold mb-2">{data.label || 'DB Trigger'}</div>
      <div className="mb-2">
        <label className="block text-xs text-orange-200 mb-1">Таблица:</label>
        <input
          type="text"
          value={tableValue}
          onChange={onTableChange}
          className="w-full px-2 py-1 text-xs bg-orange-800 border border-orange-600 rounded text-white placeholder-orange-300"
          placeholder="users"
        />
      </div>
      <Handle type="source" position={Position.Right} id="output" className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default DatabaseTriggerNode;
