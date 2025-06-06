// src/components/NodePalette.tsx
'use client';

import React from 'react';

const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, nodeLabel: string) => {
  event.dataTransfer.setData('application/reactflow-type', nodeType);
  event.dataTransfer.setData('application/reactflow-label', nodeLabel);
  event.dataTransfer.effectAllowed = 'move';
};

const NodePalette = () => {
  return (
    <aside className="w-64 p-4 border-r border-slate-700 bg-slate-800 overflow-y-auto shrink-0">
      <h3 className="text-lg font-semibold mb-4 text-sky-400">Типы Узлов</h3>
      <div className="space-y-3">
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'startNode', 'Старт')}
          draggable
        >
          <p className="font-medium text-slate-100">Start Node</p>
          <p className="text-xs text-slate-400">Начальная точка логики</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'alertNode', 'Alert')}
          draggable
        >
          <p className="font-medium text-slate-100">Alert Node</p>
          <p className="text-xs text-slate-400">Отображает уведомление</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'inputTextNode', 'Input Text')}
          draggable
        >
          <p className="font-medium text-slate-100">Input Text Node</p>
          <p className="text-xs text-slate-400">Поле для ввода текста</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'displayNode', 'Display')}
          draggable
        >
          <p className="font-medium text-slate-100">Display Node</p>
          <p className="text-xs text-slate-400">Отображает все входящие данные</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'jsonProcessorNode', 'JSON Processor')}
          draggable
        >
          <p className="font-medium text-slate-100">JSON Processor Node</p>
          <p className="text-xs text-slate-400">Обрабатывает JSON по ключу/индексу</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'conditionNode', 'Condition')}
          draggable
        >
          <p className="font-medium text-slate-100">Condition Node</p>
          <p className="text-xs text-slate-400">Условное ветвление</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'httpRequestNode', 'HTTP Request')}
          draggable
        >
          <p className="font-medium text-slate-100">HTTP Request Node</p>
          <p className="text-xs text-slate-400">Выполняет HTTP запрос</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'mergeNode', 'Merge')}
          draggable
        >
          <p className="font-medium text-slate-100">Merge Node</p>
          <p className="text-xs text-slate-400">Объединяет данные</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'databaseNode', 'Database')}
          draggable
        >
          <p className="font-medium text-slate-100">Database Node</p>
          <p className="text-xs text-slate-400">Работа с базой данных</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'delayNode', 'Delay')}
          draggable
        >
          <p className="font-medium text-slate-100">Delay Node</p>
          <p className="text-xs text-slate-400">Пауза в выполнении</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'loopNode', 'Loop')}
          draggable
        >
          <p className="font-medium text-slate-100">Loop Node</p>
          <p className="text-xs text-slate-400">Итерация по массиву</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'mathNode', 'Math')}
          draggable
        >
          <p className="font-medium text-slate-100">Math Node</p>
          <p className="text-xs text-slate-400">Простые вычисления</p>
        </div>
      </div>
    </aside>
  );
};

export default NodePalette;
