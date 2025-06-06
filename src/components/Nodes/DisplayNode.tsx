// src/components/Nodes/DisplayNode.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

const DisplayNode = ({ id, data }: NodeProps<{ label?: string; incomingData?: any; nodeId?: string }>) => {
  const { setNodes } = useReactFlow();
  const [nodeIdValue, setNodeIdValue] = useState(data.nodeId || id);

  const onNodeIdChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const newNodeId = evt.target.value;
    setNodeIdValue(newNodeId);

    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              nodeId: newNodeId,
            },
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);
  const renderValue = (value: any) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') return value;
    if (typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return '[Объект не может быть сериализован]';
      }
    }
    return String(value);
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-purple-600 border-2 border-purple-700 text-white w-64">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-700 !w-3 !h-3"
      />
      <div className="flex flex-col">
        <div className="text-sm font-bold mb-2">
          {data.label || 'Display'}
        </div>
        
        {/* Поле для редактирования ID узла */}
        <div className="mb-2">
          <label className="block text-xs text-purple-200 mb-1">ID узла:</label>
          <input
            type="text"
            value={nodeIdValue}
            onChange={onNodeIdChange}
            className="w-full px-2 py-1 text-xs bg-purple-700 border border-purple-500 rounded text-white placeholder-purple-300"
            placeholder="Уникальный ID"
          />
        </div>
        
        <div className="text-xs p-3 bg-purple-700/70 rounded-sm min-h-[60px] max-h-[200px] overflow-y-auto">
          {data.incomingData !== undefined ? (
            <pre className="whitespace-pre-wrap break-all text-purple-100">
              {renderValue(data.incomingData)}
            </pre>
          ) : (
            <span className="italic opacity-70 text-purple-200">
              Ожидание данных для отображения...
            </span>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-slate-700 !w-3 !h-3"
      />
    </div>
  );
};

export default DisplayNode;