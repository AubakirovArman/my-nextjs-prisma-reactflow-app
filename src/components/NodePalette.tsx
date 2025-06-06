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
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'telegramNode', 'Telegram')}
          draggable
        >
          <p className="font-medium text-slate-100">Telegram Node</p>
          <p className="text-xs text-slate-400">Отправляет текст в Telegram</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'scheduleNode', 'Schedule')}
          draggable
        >
          <p className="font-medium text-slate-100">Schedule Node</p>
          <p className="text-xs text-slate-400">Запуск по расписанию</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'fileWatcherNode', 'File Watcher')}
          draggable
        >
          <p className="font-medium text-slate-100">File Watcher Node</p>
          <p className="text-xs text-slate-400">Изменение файла в папке</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'databaseTriggerNode', 'DB Trigger')}
          draggable
        >
          <p className="font-medium text-slate-100">Database Trigger Node</p>
          <p className="text-xs text-slate-400">Новые данные в БД</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'telegramListenerNode', 'Telegram Listener')}
          draggable
        >
          <p className="font-medium text-slate-100">Telegram Listener Node</p>
          <p className="text-xs text-slate-400">Новое сообщение Telegram</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'mqttListenerNode', 'MQTT Listener')}
          draggable
        >
          <p className="font-medium text-slate-100">MQTT Listener Node</p>
          <p className="text-xs text-slate-400">Сообщение в MQTT канале</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'emailTriggerNode', 'Email Trigger')}
          draggable
        >
          <p className="font-medium text-slate-100">Email Trigger Node</p>
          <p className="text-xs text-slate-400">Получение письма</p>
        </div>
        {/* AI / NLP / ML nodes */}
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'llmNode', 'LLM')}
          draggable
        >
          <p className="font-medium text-slate-100">LLM Node</p>
          <p className="text-xs text-slate-400">Запрос к LLM</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'embeddingNode', 'Embedding')}
          draggable
        >
          <p className="font-medium text-slate-100">Embedding Node</p>
          <p className="text-xs text-slate-400">Текст в вектор</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'vectorSearchNode', 'Vector Search')}
          draggable
        >
          <p className="font-medium text-slate-100">Vector Search Node</p>
          <p className="text-xs text-slate-400">Поиск векторов</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'langChainAgentNode', 'LangChain Agent')}
          draggable
        >
          <p className="font-medium text-slate-100">LangChain Agent Node</p>
          <p className="text-xs text-slate-400">Запуск агента</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'ragNode', 'RAG')}
          draggable
        >
          <p className="font-medium text-slate-100">RAG Node</p>
          <p className="text-xs text-slate-400">Документы + LLM</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'sentimentAnalysisNode', 'Sentiment')}
          draggable
        >
          <p className="font-medium text-slate-100">Sentiment Analysis Node</p>
          <p className="text-xs text-slate-400">Определяет настроение</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'textClassificationNode', 'Text Classify')}
          draggable
        >
          <p className="font-medium text-slate-100">Text Classification Node</p>
          <p className="text-xs text-slate-400">Классифицирует текст</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'summarizationNode', 'Summarization')}
          draggable
        >
          <p className="font-medium text-slate-100">Summarization Node</p>
          <p className="text-xs text-slate-400">Сжимает текст</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'textToSQLNode', 'Text to SQL')}
          draggable
        >
          <p className="font-medium text-slate-100">Text-to-SQL Node</p>
          <p className="text-xs text-slate-400">Генерация SQL</p>
        </div>
        <div
          className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
          onDragStart={(event) => onDragStart(event, 'promptTemplateNode', 'Prompt Template')}
          draggable
        >
          <p className="font-medium text-slate-100">Prompt Template Node</p>
          <p className="text-xs text-slate-400">Шаблон с переменными</p>
        </div>
      </div>
    </aside>
  );
};

export default NodePalette;