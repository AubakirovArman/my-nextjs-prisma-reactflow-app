'use client';

import React, { useState, useCallback } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';

interface JsonProcessorNodeData {
  label?: string;
  path?: string;
  sourceNodeId?: string;
  incomingData?: any;
  extractedValue?: any;
  error?: string;
}

const JsonProcessorNode = ({ id, data }: NodeProps<JsonProcessorNodeData>) => {
  const { setNodes } = useReactFlow();
  const [pathValue, setPathValue] = useState(data.path || '');
  const [sourceNodeIdValue, setSourceNodeIdValue] = useState(data.sourceNodeId || '');

  const onPathChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = evt.target.value;
    setPathValue(newPath);

    // Обновляем путь в данных узла
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              path: newPath,
              dataPath: newPath, // Синхронизируем с полем dataPath
            },
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  const onSourceNodeIdChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    const newSourceNodeId = evt.target.value;
    setSourceNodeIdValue(newSourceNodeId);

    // Обновляем ID исходного узла в данных узла
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              sourceNodeId: newSourceNodeId,
            },
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  // Функция для извлечения значения по пути
  const extractValueByPath = (obj: any, path: string): any => {
    if (!path || !obj) return obj;
    
    try {
      // Разбиваем путь на части (поддерживаем точки и квадратные скобки)
      const parts = path.split(/[.\[\]]+/).filter(part => part !== '');
      
      let current = obj;
      for (const part of parts) {
        if (current === null || current === undefined) {
          return undefined;
        }
        
        // Проверяем, является ли часть числом (индекс массива)
        const index = parseInt(part, 10);
        if (!isNaN(index) && Array.isArray(current)) {
          current = current[index];
        } else {
          current = current[part];
        }
      }
      
      return current;
    } catch (error) {
      console.error('Ошибка при извлечении значения:', error);
      return undefined;
    }
  };

  // Функция для отображения входящих данных
  const renderIncomingData = () => {
    if (data.incomingData) {
      return (
        <div className="text-xs text-orange-200 mb-2 p-2 bg-orange-800 rounded">
          <div className="font-semibold mb-1">Входящие данные:</div>
          <div className="break-words max-h-20 overflow-y-auto">
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

  // Функция для отображения извлеченного значения
  const renderExtractedValue = () => {
    if (data.error) {
      return (
        <div className="text-xs text-red-200 mb-2 p-2 bg-red-800 rounded">
          <div className="font-semibold">Ошибка:</div>
          <div className="break-words">{data.error}</div>
        </div>
      );
    }

    if (data.extractedValue !== undefined) {
      return (
        <div className="text-xs text-green-200 mb-2 p-2 bg-green-800 rounded">
          <div className="font-semibold">Результат:</div>
          <div className="break-words">
            {typeof data.extractedValue === 'object' 
              ? JSON.stringify(data.extractedValue, null, 2)
              : String(data.extractedValue)
            }
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="px-4 py-3 shadow-md rounded-md bg-orange-600 border-2 border-orange-700 text-white w-64">
      {/* Входящая точка подключения */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        className="!bg-slate-700 !w-3 !h-3"
      />
      
      <div className="text-sm font-bold mb-2">
        {data.label || 'JSON Processor'}
      </div>
      
      {/* Отображение входящих данных */}
      {renderIncomingData()}
      
      {/* Поле для ввода ID исходного узла */}
      <div className="mb-2">
        <label className="text-xs text-orange-200 block mb-1">
          ID исходного узла:
        </label>
        <input
          type="text"
          value={sourceNodeIdValue}
          onChange={onSourceNodeIdChange}
          className="w-full px-2 py-1 rounded-md bg-orange-700 text-orange-50 placeholder-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-400 text-xs"
          placeholder="ID узла для получения данных"
        />
      </div>
      
      {/* Поле для ввода пути */}
      <div className="mb-2">
        <label className="text-xs text-orange-200 block mb-1">
          Путь к данным:
        </label>
        <input
          type="text"
          value={pathValue}
          onChange={onPathChange}
          className="w-full px-2 py-1 rounded-md bg-orange-700 text-orange-50 placeholder-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-400 text-xs"
          placeholder="например: user.name или items[0].id"
        />
      </div>
      
      {/* Отображение результата */}
      {renderExtractedValue()}
      
      {/* Подсказка */}
      <div className="text-xs text-orange-300 mb-2">
        <div className="font-semibold">Примеры:</div>
        <div>• ID узла: input1, myInput</div>
        <div>• Пути: inputValue, incomingData.message</div>
        <div>• user.name, items[0], data[1].email</div>
      </div>
      
      {/* Исходящая точка подключения */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="!bg-slate-700 !w-3 !h-3"
      />
    </div>
  );
};

export default JsonProcessorNode;