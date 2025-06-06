'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface HttpRequestNodeData {
  label?: string;
  url?: string;
  method?: string;
  response?: any;
  incomingData?: any;
}

const HttpRequestNode = ({ id, data }: NodeProps<HttpRequestNodeData>) => {
  const { setNodes } = useReactFlow();
  const [urlValue, setUrlValue] = useState(data.url || '');
  const [methodValue, setMethodValue] = useState(data.method || 'GET');

  const onUrlChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const newUrl = evt.target.value;
      setUrlValue(newUrl);
      setNodes(nodes =>
        nodes.map(node =>
          node.id === id ? { ...node, data: { ...node.data, url: newUrl } } : node
        )
      );
    },
    [id, setNodes]
  );

  const onMethodChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      const newMethod = evt.target.value;
      setMethodValue(newMethod);
      setNodes(nodes =>
        nodes.map(node =>
          node.id === id ? { ...node, data: { ...node.data, method: newMethod } } : node
        )
      );
    },
    [id, setNodes]
  );

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-indigo-600 border-2 border-indigo-700 text-white w-64">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="text-sm font-bold mb-2">{data.label || 'HTTP Request'}</div>
      <div className="mb-2">
        <label className="block text-xs text-indigo-200 mb-1">URL:</label>
        <input
          type="text"
          value={urlValue}
          onChange={onUrlChange}
          className="w-full px-2 py-1 text-xs bg-indigo-700 border border-indigo-500 rounded text-white placeholder-indigo-300"
          placeholder="https://api.example.com"
        />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-indigo-200 mb-1">Method:</label>
        <select
          value={methodValue}
          onChange={onMethodChange}
          className="w-full px-2 py-1 text-xs bg-indigo-700 border border-indigo-500 rounded text-white"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
        </select>
      </div>
      {data.response !== undefined && (
        <div className="text-xs p-2 bg-indigo-700/70 rounded-sm max-h-[120px] overflow-y-auto">
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(data.response, null, 2)}</pre>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default HttpRequestNode;
