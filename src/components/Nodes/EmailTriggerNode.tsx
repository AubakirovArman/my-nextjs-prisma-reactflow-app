'use client';

import React, { useCallback, useState } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface EmailTriggerData {
  label?: string;
  address?: string;
}

const EmailTriggerNode = ({ id, data }: NodeProps<EmailTriggerData>) => {
  const { setNodes } = useReactFlow();
  const [addressValue, setAddressValue] = useState(data.address || '');

  const onAddressChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      setAddressValue(newValue);
      setNodes((currentNodes) =>
        currentNodes.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, address: newValue } } : n
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-pink-700 border-2 border-pink-800 text-white w-56">
      <div className="text-sm font-bold mb-2">{data.label || 'Email Trigger'}</div>
      <div className="mb-2">
        <label className="block text-xs text-pink-200 mb-1">Адрес:</label>
        <input
          type="text"
          value={addressValue}
          onChange={onAddressChange}
          className="w-full px-2 py-1 text-xs bg-pink-800 border border-pink-600 rounded text-white placeholder-pink-300"
          placeholder="user@example.com"
        />
      </div>
      <Handle type="source" position={Position.Right} id="output" className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default EmailTriggerNode;
