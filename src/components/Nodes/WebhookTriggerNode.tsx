'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface WebhookTriggerData {
  label?: string;
  customName?: string;
  incomingData?: any;
}

const WebhookTriggerNode = ({ id, data }: NodeProps<WebhookTriggerData>) => {
  const { setNodes } = useReactFlow();
  const [customNameValue, setCustomNameValue] = useState(data.customName || '');

  const onCustomNameChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = evt.target.value;
      setCustomNameValue(newValue);
      setNodes((currentNodes) =>
        currentNodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, customName: newValue } }
            : node
        )
      );
    },
    [id, setNodes]
  );

  const renderIncomingData = () => {
    if (data.incomingData !== undefined) {
      return (
        <div className="text-xs text-teal-200 mb-2 p-1 bg-teal-800 rounded break-words max-h-32 overflow-y-auto">
          {typeof data.incomingData === 'object'
            ? JSON.stringify(data.incomingData, null, 2)
            : String(data.incomingData)}
        </div>
      );
    }
    return null;
  };

  const pathPreview = customNameValue || '<name>';

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-teal-600 border-2 border-teal-700 text-white w-60">
      <div className="text-sm font-bold mb-2">{data.label || 'Webhook Trigger'}</div>

      <div className="mb-2">
        <label className="block text-xs text-teal-200 mb-1">Custom name:</label>
        <input
          type="text"
          value={customNameValue}
          onChange={onCustomNameChange}
          className="w-full px-2 py-1 rounded-md bg-teal-700 text-teal-50 placeholder-teal-300 text-xs"
          placeholder="myhook"
        />
      </div>

      <div className="text-xs text-teal-200 mb-2">POST /api/inputwebhook/{pathPreview}</div>

      {renderIncomingData()}

      <Handle type="source" position={Position.Right} id="output" className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default WebhookTriggerNode;
