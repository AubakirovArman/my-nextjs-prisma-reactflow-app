// src/components/MyFlowDiagram.tsx
'use client';

import React, { useState, useCallback, useMemo, useRef, DragEvent,useEffect } from 'react'; // Добавь useRef, DragEvent
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
  useReactFlow, // <--- Импортируй хук useReactFlow
  ReactFlowProvider, // <--- Обертка, если useReactFlow используется в родительском компоненте MyFlowDiagram
  useNodesState, // Added missing import
  useEdgesState, // Added missing import
  // ... другие импорты из @xyflow/react
  FitViewOptions,
  DefaultEdgeOptions,
  getOutgoers, // Утилита для получения следующих узлов
  getIncomers, // Может понадобиться для более сложной логики
} from '@xyflow/react';

import StartNode from './Nodes/StartNode';
import AlertNode from './Nodes/AlertNode';
import InputTextNode from './Nodes/InputTextNode';
import DisplayNode from './Nodes/DisplayNode';
import JsonProcessorNode from './Nodes/JsonProcessorNode';

const initialNodes: Node[] = [
  // Можно начать с пустого холста или с одного StartNode
  // { id: 'start', type: 'startNode', position: { x: 250, y: 5 }, data: { label: 'Старт Процесса' } },
];
const initialEdges: Edge[] = [];

const fitViewOptions: FitViewOptions = { padding: 0.3 };
const defaultEdgeOptions: DefaultEdgeOptions = { animated: true, type: 'smoothstep' };

// Счетчик для уникальных ID (простой вариант)
let idCounter = 0;
const getId = (type: string) => `${type}_${idCounter++}`;

interface FlowComponentProps {
  runId: number;
  initialNodes?: Node[];
  initialEdges?: Edge[];
  onNodeProcessed?: (nodeId: string, data: any) => void;
  onProcessingComplete?: () => void;
}
// Компонент Flow, который будет использовать useReactFlow
const FlowComponent: React.FC<FlowComponentProps> = ({ 
  runId, 
  initialNodes = [], 
  initialEdges = [], 
  onNodeProcessed, 
  onProcessingComplete 
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { project, getNode, getNodes, getEdges } = useReactFlow(); // Added getNode, getNodes, getEdges
  const [processingRunId, setProcessingRunId] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow(); // Removed redundant getNode, getEdges

  const nodeTypes: NodeTypes = useMemo(() => ({
    startNode: StartNode,
    alertNode: AlertNode,
    inputTextNode: InputTextNode,
    displayNode: DisplayNode,
    jsonProcessorNode: JsonProcessorNode,
  }), []);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) {
        return;
      }
      
      // Получаем тип узла из данных, которые мы сохранили в onDragStart
      const type = event.dataTransfer.getData('application/reactflow-type');
      const label = event.dataTransfer.getData('application/reactflow-label');

      // Если тип не определен, ничего не делаем
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Преобразуем позицию курсора на экране в позицию внутри холста React Flow
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(type), // Генерируем уникальный ID
        type,
        position,
        data: { label: `${label}` }, // Можно добавить и другие данные по умолчанию
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes] // Добавляем setNodes в зависимости useCallback
  );
  // Функция выполнения одного узла и перехода к следующему
  const processNode = useCallback((nodeId: string, currentData: any) => {
    const node = getNode(nodeId); // Получаем актуальный узел из React Flow
    if (!node) {
      console.error(`Узел с ID ${nodeId} не найден.`);
      return;
    }

    console.log(`Выполняется узел: ${node.data.label || node.type} (ID: ${nodeId}), получены данные:`, currentData);
    let outputData = currentData; // По умолчанию данные проходят транзитом

    // Логика для каждого типа узла
    switch (node.type) {
      case 'startNode':
        // StartNode просто инициирует поток, может передать начальное значение если нужно
        console.log('StartNode выполнен.');
        outputData = { message: "Поток запущен!" }; // Пример начальных данных
        break;
      case 'inputTextNode':
        // InputTextNode получает входящие данные и объединяет их со своим значением
        console.log(`InputTextNode (${node.data.label || 'Input Text'}) получил:`, currentData);
        
        // Обновляем состояние узла InputTextNode, чтобы он отобразил входящие данные
        setNodes((currentNodes) =>
          currentNodes.map((n_map) => { 
            if (n_map.id === nodeId) { 
              return {
                ...n_map,
                data: {
                  ...n_map.data,
                  incomingData: currentData, 
                },
              };
            }
            return n_map;
          })
        );
        
        // InputTextNode выдает объект с входящими данными и своим значением
        outputData = {
          incomingData: currentData,
          inputValue: node.data.value || '',
          combined: `${currentData ? (typeof currentData === 'object' ? JSON.stringify(currentData) : currentData) + ' + ' : ''}${node.data.value || ''}`
        };
        console.log(`InputTextNode (${node.data.label || 'Input Text'}) выдал:`, outputData);
        break;
      case 'alertNode':
          console.log(`AlertNode (${node.data.label || 'Alert'}) получил:`, currentData);
  
          // Обновляем состояние узла AlertNode, чтобы он отобразил данные
          setNodes((currentNodes) =>
            currentNodes.map((n_map) => { 
              if (n_map.id === nodeId) { 
                return {
                  ...n_map,
                  data: {
                    ...n_map.data,
                    incomingValue: currentData, 
                  },
                };
              }
              return n_map;
            })
          );
  
          return; 
      case 'displayNode':
        console.log(`DisplayNode (${node.data.label || 'Display'}) получил:`, currentData);
        
        // Обновляем состояние узла DisplayNode, чтобы он отобразил данные
        setNodes((currentNodes) =>
          currentNodes.map((n_map) => { 
            if (n_map.id === nodeId) { 
              return {
                ...n_map,
                data: {
                  ...n_map.data,
                  incomingData: currentData, 
                },
              };
            }
            return n_map;
          })
        );
        
        // DisplayNode отображает данные и передает их дальше
        outputData = currentData;
        break;
      case 'jsonProcessorNode':
        console.log(`JsonProcessorNode (${node.data.label || 'JSON Processor'}) получил:`, currentData);
        
        let processedValue = null;
        let errorMessage = null;
        
        try {
          const dataPath = node.data.dataPath || node.data.path || '';
          const sourceNodeId = node.data.sourceNodeId;
          
          // Определяем источник данных
          let sourceData = currentData;
          
          // Если указан ID исходного узла, ищем данные в этом узле
          if (sourceNodeId) {
            const sourceNode = nodes.find(n => n.data.nodeId === sourceNodeId || n.id === sourceNodeId);
            if (sourceNode) {
              // Получаем данные из найденного узла
              if (sourceNode.type === 'inputTextNode') {
                sourceData = {
                  nodeId: sourceNode.data.nodeId || sourceNode.id,
                  inputValue: sourceNode.data.value || '',
                  incomingData: sourceNode.data.incomingData,
                };
              } else {
                sourceData = sourceNode.data;
              }
              console.log(`JsonProcessorNode получил данные из узла ${sourceNodeId}:`, sourceData);
            } else {
              errorMessage = `Узел с ID "${sourceNodeId}" не найден`;
            }
          }
          
          if (sourceData && dataPath && !errorMessage) {
            // Разбираем путь (например: "key", "0", "key.subkey", "key[0]", "[0].key")
            const pathParts = dataPath.split(/[.\[\]]/).filter(part => part !== '');
            let result = sourceData;
            
            for (const part of pathParts) {
              if (result === null || result === undefined) {
                break;
              }
              
              // Проверяем, является ли часть числом (индекс массива)
              const index = parseInt(part, 10);
              if (!isNaN(index)) {
                result = Array.isArray(result) ? result[index] : undefined;
              } else {
                result = typeof result === 'object' ? result[part] : undefined;
              }
            }
            
            processedValue = result;
          } else if (sourceData && !dataPath && !errorMessage) {
            // Если путь не указан, передаем данные как есть
            processedValue = sourceData;
          }
        } catch (error) {
          errorMessage = `Ошибка обработки: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`;
          console.error('JsonProcessorNode error:', error);
        }
        
        // Обновляем состояние узла JsonProcessorNode
        setNodes((currentNodes) =>
          currentNodes.map((n_map) => { 
            if (n_map.id === nodeId) { 
              return {
                ...n_map,
                data: {
                  ...n_map.data,
                  incomingData: currentData,
                  processedValue: processedValue,
                  error: errorMessage,
                },
              };
            }
            return n_map;
          })
        );
        
        // JsonProcessorNode выдает обработанное значение
        outputData = processedValue;
        console.log(`JsonProcessorNode (${node.data.label || 'JSON Processor'}) выдал:`, outputData);
        break;
      default:
        console.warn(`Неизвестный тип узла для выполнения: ${node.type}`);
        break;
    }

    // Находим следующие узлы
    // Используем getNodes() и getEdges() для получения актуальных данных
    const currentFlowNodes = getNodes();
    const currentFlowEdges = getEdges();
    const outgoers = getOutgoers(node, currentFlowNodes, currentFlowEdges);

    if (outgoers.length > 0) {
      // Для упрощения, идем только по первому выходу
      // В реальном приложении нужно будет обрабатывать ветвления
      console.log(`Переход к следующему узлу: ${outgoers[0].id} с данными:`, outputData);
      processNode(outgoers[0].id, outputData);
    } else {
      console.log(`Конец ветки после узла ${nodeId}.`);
    }
  }, [getNode, getNodes, getEdges, setNodes]); // Dependencies are now stable functions from useReactFlow and useState

  // Эффект для запуска выполнения при изменении runId
  useEffect(() => {
    if (runId > 0) {
      console.log(`--- Запуск выполнения потока (Run ID: ${runId}) ---`);
      // Очищаем предыдущие данные в AlertNode, DisplayNode и InputTextNode перед новым выполнением
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.type === 'alertNode') {
            return {
              ...node,
              data: {
                ...node.data,
                incomingValue: null,
              },
            };
          }
          if (node.type === 'displayNode') {
            return {
              ...node,
              data: {
                ...node.data,
                incomingData: null,
              },
            };
          }
          if (node.type === 'inputTextNode') {
            return {
              ...node,
              data: {
                ...node.data,
                incomingData: null,
              },
            };
          }
          if (node.type === 'jsonProcessorNode') {
            return {
              ...node,
              data: {
                ...node.data,
                incomingData: null,
                processedValue: null,
                error: null,
              },
            };
          }
          return node;
        })
      );

      // Получаем актуальный startNode после очистки
      // Важно: getNodes() здесь вернет узлы ПОСЛЕ обновления setNodes выше, если setNodes успело отработать синхронно
      // или если processNode вызывается в следующем рендере. Для большей предсказуемости,
      // можно было бы обернуть логику processNode в setTimeout(0) или использовать еще один useEffect, 
      // но попробуем так для начала.
      const currentNodesAfterClear = getNodes();
      const startNode = currentNodesAfterClear.find(n => n.type === 'startNode');
      
      if (startNode) {
        processNode(startNode.id, null); // processNode теперь более стабилен
      } else {
        console.error("Не найден StartNode для начала выполнения!");
        alert("Ошибка: Не найден узел 'StartNode' для начала выполнения!");
      }
      console.log(`--- Выполнение потока завершено (Run ID: ${runId}) ---`);
    }
    // processNode теперь стабилен, setNodes и getNodes тоже. 
    // Основной триггер - runId.
  }, [runId, processNode, setNodes, getNodes]); 

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }} >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver} // <--- Добавляем обработчик onDragOver
        onDrop={onDrop}         // <--- Добавляем обработчик onDrop
        fitView
        fitViewOptions={fitViewOptions}
        defaultEdgeOptions={defaultEdgeOptions}

        className="bg-slate-900" // Можно также задать фон здесь, если нужно
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}


// Обертка MyFlowDiagram, чтобы предоставить ReactFlowProvider
// Это необходимо, чтобы хук useReactFlow работал корректно в FlowComponent
export default function MyFlowDiagram({ runId }: { runId: number }) {
  return (
    <ReactFlowProvider>
      <FlowComponent 
        runId={runId} 
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
    </ReactFlowProvider>
  );
}