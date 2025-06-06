// src/components/Nodes/InputTextNode.tsx
'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
// useStoreApi is no longer needed for this specific logic if only used for nodeInternals

const InputTextNode = ({ id, data }: NodeProps<{ label?: string; value?: string; incomingData?: any; nodeId?: string }>) => {
  const { setNodes } = useReactFlow(); // setNodes is sufficient
  const [inputValue, setInputValue] = useState(data.value || '');
  const [nodeIdValue, setNodeIdValue] = useState(data.nodeId || id);

  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;
    setInputValue(newValue); // Update local state for the input field itself

    // Update the node's data in the main React Flow state
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          // It's important to create a new object for the node and its data
          // to ensure React detects the change.
          return {
            ...node,
            data: {
              ...node.data,
              value: newValue, // Update the value in the node's data
            },
          };
        }
        return node;
      })
    );
  }, [id, setNodes]); // Dependencies are id and setNodes

  const onNodeIdChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const newNodeId = evt.target.value;
    setNodeIdValue(newNodeId);

    // Update the node's data in the main React Flow state
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

  // Функция для отображения входящих данных
  const renderIncomingData = () => {
    if (data.incomingData) {
      return (
        <div className="text-xs text-sky-200 mb-2 p-1 bg-sky-800 rounded">
          <div className="font-semibold">Входящие данные:</div>
          <div className="break-words">
            {typeof data.incomingData === 'object' 
              ? JSON.stringify(data.incomingData, null, 2)
              : String(data.incomingData)
            }
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-sky-700 border-2 border-sky-800 text-white w-56">
      {/* Входящая точка подключения */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-slate-700 !w-3 !h-3"
      />
      
      <div className="text-sm font-bold mb-2">
        {data.label || 'Input Text'}
      </div>
      
      {/* Поле для редактирования ID узла */}
      <div className="mb-2">
        <label className="block text-xs text-sky-200 mb-1">ID узла:</label>
        <input
          type="text"
          value={nodeIdValue}
          onChange={onNodeIdChange}
          className="w-full px-2 py-1 text-xs bg-sky-800 border border-sky-600 rounded text-white placeholder-sky-300"
          placeholder="Уникальный ID"
        />
      </div>
      
      {/* Отображение входящих данных */}
      {renderIncomingData()}
      
      <input
        type="text"
        value={inputValue}
        onChange={onChange}
        className="w-full px-2 py-1 rounded-md bg-sky-800 text-sky-50 placeholder-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-400"
        placeholder="Введите текст..."
      />
      
      {/* Исходящая точка подключения */}
      <Handle
        type="source"
        position={Position.Right}
        id="value"
        className="!bg-slate-700 !w-3 !h-3"
      />
    </div>
  );
};

export default InputTextNode;