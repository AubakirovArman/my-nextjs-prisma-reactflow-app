'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';

interface HttpRequestNodeData {
  label?: string;
  url?: string;
  response?: any;
  error?: string;
}

const HttpRequestNode = ({ id, data }: NodeProps<HttpRequestNodeData>) => {
  const [url, setUrl] = useState(data.url || '');

  const onUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  }, []);

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-cyan-600 border-2 border-cyan-700 text-white w-64">
      <Handle type="target" position={Position.Left} className="!bg-slate-700 !w-3 !h-3" />
      <div className="text-sm font-bold mb-2">{data.label || 'HTTP Request'}</div>
      <input
        type="text"
        value={url}
        onChange={onUrlChange}
        className="w-full px-2 py-1 text-xs bg-cyan-700 border border-cyan-500 rounded text-white placeholder-cyan-300"
        placeholder="https://api.example.com"
      />
      {data.error && <div className="mt-2 text-xs text-red-200">{data.error}</div>}
      {data.response && (
        <div className="mt-2 text-xs max-h-24 overflow-y-auto bg-cyan-700/70 p-1 rounded">
          <pre>{JSON.stringify(data.response, null, 2)}</pre>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-slate-700 !w-3 !h-3" />
    </div>
  );
};

export default HttpRequestNode;
