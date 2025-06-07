'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface BaseUrlInputNodeData {
  label?: string;
  base_url?: string;
  incomingData?: Record<string, unknown>;
  nodeId?: string;
  real_time_refresh?: boolean;
}

const BaseUrlInputNode = ({ id, data }: NodeProps<BaseUrlInputNodeData>) => {
  const { setNodes, getNodes } = useReactFlow();
  const [baseUrlValue, setBaseUrlValue] = useState(data.base_url || '');
  const [nodeIdValue, setNodeIdValue] = useState(data.nodeId || id);

  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = evt.target.value;
    setBaseUrlValue(newValue);

    // Update the node's data in the main React Flow state
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              base_url: newValue,
            },
          };
        }
        return node;
      })
    );

    // If real_time_refresh is enabled, trigger model_name update
    if (data.real_time_refresh) {
      triggerModelNameRefresh();
    }
  }, [id, setNodes, data.real_time_refresh, triggerModelNameRefresh]);

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

  // Function to trigger model_name refresh in connected nodes
  const triggerModelNameRefresh = useCallback(() => {
    const currentNodes = getNodes();
    
    // Find nodes that might need model_name refresh (like OllamaNode)
    currentNodes.forEach((node) => {
      if (node.type === 'ollamaNode' && node.data) {
        // Trigger a refresh by updating the node's data
        setNodes((nodes) =>
          nodes.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  refreshTrigger: Date.now(), // Add a timestamp to trigger refresh
                },
              };
            }
            return n;
          })
        );
      }
    });
  }, [getNodes, setNodes]);

  // Effect to handle real-time refresh when base_url changes
  useEffect(() => {
    if (data.real_time_refresh && baseUrlValue) {
      triggerModelNameRefresh();
    }
  }, [baseUrlValue, data.real_time_refresh, triggerModelNameRefresh]);

  // Function to display incoming data
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
    <div className="px-4 py-3 shadow-md rounded-md bg-orange-600 border-2 border-orange-700 text-white w-64">
      {/* Input handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-slate-700 !w-3 !h-3"
      />
      
      <div className="text-sm font-bold mb-2">
        {data.label || 'Base URL Input'}
      </div>
      
      {/* Node ID field */}
      <div className="mb-2">
        <label className="block text-xs text-orange-200 mb-1">ID узла:</label>
        <input
          type="text"
          value={nodeIdValue}
          onChange={onNodeIdChange}
          className="w-full px-2 py-1 text-xs bg-orange-700 border border-orange-500 rounded text-white placeholder-orange-300"
          placeholder="Уникальный ID"
        />
      </div>
      
      {/* Display incoming data */}
      {renderIncomingData()}
      
      {/* Base URL input field */}
      <div className="mb-2">
        <label className="block text-xs text-orange-200 mb-1">
          Base URL
          <span className="ml-1 text-orange-300" title="Endpoint of the Ollama API.">ⓘ</span>
        </label>
        <input
          type="text"
          value={baseUrlValue}
          onChange={onChange}
          className="w-full px-2 py-1 rounded-md bg-orange-700 text-orange-50 placeholder-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-400"
          placeholder="http://localhost:11434"
        />
      </div>
      
      {/* Real-time refresh indicator */}
      {data.real_time_refresh && (
        <div className="text-xs text-orange-200 mb-2 flex items-center">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          Auto-refresh enabled
        </div>
      )}
      
      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="base_url"
        className="!bg-slate-700 !w-3 !h-3"
      />
    </div>
  );
};

export default BaseUrlInputNode;