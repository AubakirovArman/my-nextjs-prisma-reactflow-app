// src/components/Nodes/OllamaNode.tsx
"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";

const OllamaNode = ({
  data,
}: NodeProps<{
  label?: string;
  incomingData?: unknown;
  response?: unknown;
  error?: string;
}>) => {
  const renderValue = (value: unknown) => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return "[object]";
      }
    }
    return String(value);
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-amber-600 border-2 border-amber-700 text-white w-60">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-slate-700 !w-3 !h-3"
      />
      <div className="text-sm font-bold mb-2">{data.label || "Ollama"}</div>
      <div className="text-xs p-2 bg-amber-700/70 rounded-sm min-h-[40px] max-h-[150px] overflow-y-auto mb-2">
        {data.incomingData !== undefined ? (
          <pre className="whitespace-pre-wrap break-all">
            {renderValue(data.incomingData)}
          </pre>
        ) : (
          <span className="italic opacity-70">Ожидание данных...</span>
        )}
      </div>
      {data.response !== undefined && (
        <div className="text-xs p-2 bg-amber-700/50 rounded-sm mb-2 max-h-[150px] overflow-y-auto">
          <pre className="whitespace-pre-wrap break-all">
            {renderValue(data.response)}
          </pre>
        </div>
      )}
      {data.error && (
        <div className="text-xs text-red-300 break-all mb-1">
          Ошибка: {data.error}
        </div>
      )}
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-slate-700 !w-3 !h-3"
      />
    </div>
  );
};

export default OllamaNode;
