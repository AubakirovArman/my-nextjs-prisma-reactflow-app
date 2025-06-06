// src/components/NodePalette.tsx
'use client'; // <--- Это делает компонент Клиентским

import React from 'react';

// Функция onDragStart теперь находится здесь
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
        {/* Элементы палитры */}
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
          onDragStart={(event) => onDragStart(event, 'webhookTriggerNode', 'Webhook Trigger')}
          draggable
        >
          <p className="font-medium text-slate-100">Webhook Trigger Node</p>
          <p className="text-xs text-slate-400">Запускает логику через webhook</p>
        </div>
      </div>
    </aside>
  );
};

export default NodePalette;