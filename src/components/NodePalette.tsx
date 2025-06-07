'use client';

import React, { useState } from 'react';

interface NodeItem {
  type: string;
  label: string;
  description: string;
}

interface Category {
  title: string;
  nodes: NodeItem[];
}

const onDragStart = (
  event: React.DragEvent<HTMLDivElement>,
  nodeType: string,
  nodeLabel: string,
) => {
  event.dataTransfer.setData('application/reactflow-type', nodeType);
  event.dataTransfer.setData('application/reactflow-label', nodeLabel);
  event.dataTransfer.effectAllowed = 'move';
};

const categories: Category[] = [
  {
    title: 'Основные',
    nodes: [
      {
        type: 'startNode',
        label: 'Start Node',
        description: 'Начальная точка логики',
      },
      {
        type: 'alertNode',
        label: 'Alert Node',
        description: 'Отображает уведомление',
      },
      {
        type: 'inputTextNode',
        label: 'Input Text Node',
        description: 'Поле для ввода текста',
      },
      {
        type: 'baseUrlInputNode',
        label: 'Base URL Input',
        description: 'Ввод базового URL'
      },
      {
        type: 'displayNode',
        label: 'Display Node',
        description: 'Отображает все входящие данные',
      },
      {
        type: 'jsonProcessorNode',
        label: 'JSON Processor Node',
        description: 'Обрабатывает JSON по ключу/индексу',
      },
      {
        type: 'telegramNode',
        label: 'Telegram Node',
        description: 'Отправляет текст в Telegram',
      },
    ],
  },
  {
    title: 'Триггеры',
    nodes: [
      {
        type: 'webhookTriggerNode',
        label: 'Webhook Trigger Node',
        description: 'Запускает логику через webhook',
      },
      {
        type: 'scheduleNode',
        label: 'Schedule Node',
        description: 'Запуск по расписанию',
      },
      {
        type: 'fileWatcherNode',
        label: 'File Watcher Node',
        description: 'Изменение файла в папке',
      },
      {
        type: 'databaseTriggerNode',
        label: 'Database Trigger Node',
        description: 'Новые данные в БД',
      },
      {
        type: 'telegramListenerNode',
        label: 'Telegram Listener Node',
        description: 'Новое сообщение Telegram',
      },
      {
        type: 'mqttListenerNode',
        label: 'MQTT Listener Node',
        description: 'Сообщение в MQTT канале',
      },
      {
        type: 'emailTriggerNode',
        label: 'Email Trigger Node',
        description: 'Получение письма',
      },
    ],
  },
  {
    title: 'AI / ML',
    nodes: [
      { type: 'llmNode', label: 'LLM Node', description: 'Запрос к LLM' },
      { type: 'ollamaNode', label: 'Ollama Node', description: 'Локальная LLM Ollama' },
      { type: 'embeddingNode', label: 'Embedding Node', description: 'Текст в вектор' },
      { type: 'vectorSearchNode', label: 'Vector Search Node', description: 'Поиск векторов' },
      { type: 'langChainAgentNode', label: 'LangChain Agent Node', description: 'Запуск агента' },
      { type: 'ragNode', label: 'RAG Node', description: 'Документы + LLM' },
      { type: 'sentimentAnalysisNode', label: 'Sentiment Analysis Node', description: 'Определяет настроение' },
      { type: 'textClassificationNode', label: 'Text Classification Node', description: 'Классифицирует текст' },
      { type: 'summarizationNode', label: 'Summarization Node', description: 'Сжимает текст' },
      { type: 'textToSQLNode', label: 'Text-to-SQL Node', description: 'Генерация SQL' },
      { type: 'promptTemplateNode', label: 'Prompt Template Node', description: 'Шаблон с переменными' },
    ],
  },
];

const NodeItemComponent = ({ type, label, description }: NodeItem) => (
  <div
    className="p-3 border border-slate-700 bg-slate-700/50 rounded-md shadow hover:shadow-lg hover:border-sky-500 cursor-grab transition-all duration-150 ease-in-out"
    onDragStart={(event) => onDragStart(event, type, label)}
    draggable
  >
    <p className="font-medium text-slate-100">{label}</p>
    <p className="text-xs text-slate-400">{description}</p>
  </div>
);

const NodePalette = () => {
  const [open, setOpen] = useState<Record<string, boolean>>({});

  const toggle = (title: string) => {
    setOpen((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 p-4 border-r border-slate-700 bg-slate-800 overflow-y-auto shrink-0">
      <h3 className="text-lg font-semibold mb-4 text-sky-400">Типы Узлов</h3>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.title}>
            <button
              type="button"
              onClick={() => toggle(cat.title)}
              className="w-full flex items-center justify-between text-slate-200 font-medium mb-2"
            >
              <span>{cat.title}</span>
              <span>{open[cat.title] ? '−' : '+'}</span>
            </button>
            {open[cat.title] && (
              <div className="space-y-3">
                {cat.nodes.map((n) => (
                  <NodeItemComponent key={n.type} {...n} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default NodePalette;
