// src/components/Nodes/OllamaNode.tsx
"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";

interface OllamaNodeData {
  label?: string;
  incomingData?: Record<string, unknown>;
  response?: unknown;
  error?: string;
  // Основные параметры
  base_url?: string;
  model_name?: string;
  temperature?: number;
  format?: string;
  metadata?: Record<string, unknown>;
  tags?: string;
  stop_tokens?: string;
  system?: string;
  template?: string;
  tool_model_enabled?: boolean;
  // Расширенные параметры
  mirostat?: string;
  mirostat_eta?: number;
  mirostat_tau?: number;
  top_k?: number;
  top_p?: number;
  repeat_penalty?: number;
  repeat_last_n?: number;
  num_ctx?: number;
  num_thread?: number;
  timeout?: number;
  // Состояние
  availableModels?: string[];
  isLoadingModels?: boolean;
  showAdvanced?: boolean;
  // Входящие данные для каждого параметра
  incoming_base_url?: string;
  incoming_model_name?: string;
  incoming_temperature?: number;
  incoming_format?: string;
  incoming_system?: string;
  incoming_tags?: string;
  incoming_stop_tokens?: string;
  incoming_top_k?: number;
  incoming_top_p?: number;
  incoming_num_ctx?: number;
  incoming_timeout?: number;
}

const OLLAMA_TOOL_MODELS_BASE = [
  "llama3.3", "qwq", "llama3.2", "llama3.1", "mistral", "qwen2", "qwen2.5",
  "qwen2.5-coder", "mistral-nemo", "mixtral", "command-r", "command-r-plus",
  "mistral-large", "smollm2", "hermes3", "athene-v2", "mistral-small",
  "nemotron-mini", "nemotron", "llama3-groq-tool-use", "granite3-dense",
  "granite3.1-dense", "aya-expanse", "granite3-moe", "firefunction-v2", "cogito"
];

const OllamaNode = ({ id, data }: NodeProps<OllamaNodeData>) => {
  const { setNodes } = useReactFlow();
  const [showAdvanced, setShowAdvanced] = useState(data.showAdvanced || false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Функция для загрузки моделей
  const loadModels = useCallback(async (baseUrl: string, toolModelEnabled: boolean = false) => {
    if (!baseUrl) return [];
    
    setIsLoadingModels(true);
    try {
      const tagsUrl = `${baseUrl.replace(/\/$/, '')}/api/tags`;
      const showUrl = `${baseUrl.replace(/\/$/, '')}/api/show`;
      
      const tagsResponse = await fetch(tagsUrl);
      if (!tagsResponse.ok) throw new Error('Failed to fetch models');
      
      const tagsData = await tagsResponse.json();
      const models = tagsData.models || [];
      
      const validModels = [];
      
      for (const model of models) {
        const modelName = model.name;
        
        try {
          const showResponse = await fetch(showUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: modelName })
          });
          
          if (showResponse.ok) {
            const showData = await showResponse.json();
            const capabilities = showData.capabilities || [];
            
            if (capabilities.includes('completion')) {
              if (toolModelEnabled) {
                // Фильтруем по базовым именам моделей для tool calling
                const isToolModel = OLLAMA_TOOL_MODELS_BASE.some(base => 
                  modelName.toLowerCase().includes(base.toLowerCase())
                ) || capabilities.includes('tools');
                
                if (isToolModel) {
                  validModels.push(modelName);
                }
              } else {
                validModels.push(modelName);
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to check model ${modelName}:`, error);
        }
      }
      
      return validModels;
    } catch (error) {
      console.error('Failed to load models:', error);
      return [];
    } finally {
      setIsLoadingModels(false);
    }
  }, []);

  // Обновление узла
  const updateNodeData = useCallback((updates: Partial<OllamaNodeData>) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  }, [id, setNodes]);

  // Функции для получения эффективных значений (приоритет входящим данным)
  const getEffectiveValue = useCallback((localValue: any, incomingValue: any) => {
    return incomingValue !== undefined ? incomingValue : localValue;
  }, []);

  const effectiveBaseUrl = getEffectiveValue(data.base_url, data.incoming_base_url);
  const effectiveModelName = getEffectiveValue(data.model_name, data.incoming_model_name);
  const effectiveTemperature = getEffectiveValue(data.temperature, data.incoming_temperature);
  const effectiveFormat = getEffectiveValue(data.format, data.incoming_format);
  const effectiveSystem = getEffectiveValue(data.system, data.incoming_system);
  const effectiveTags = getEffectiveValue(data.tags, data.incoming_tags);
  const effectiveStopTokens = getEffectiveValue(data.stop_tokens, data.incoming_stop_tokens);
  const effectiveTopK = getEffectiveValue(data.top_k, data.incoming_top_k);
  const effectiveTopP = getEffectiveValue(data.top_p, data.incoming_top_p);
  const effectiveNumCtx = getEffectiveValue(data.num_ctx, data.incoming_num_ctx);
  const effectiveTimeout = getEffectiveValue(data.timeout, data.incoming_timeout);

  // Обработчики изменений
  const handleBaseUrlChange = useCallback(async (value: string) => {
    updateNodeData({ base_url: value });
    
    if (value) {
      const models = await loadModels(value, data.tool_model_enabled);
      updateNodeData({ 
        availableModels: models,
        model_name: models.length > 0 ? models[0] : undefined
      });
    }
  }, [data.tool_model_enabled, loadModels, updateNodeData]);

  const handleToolModelEnabledChange = useCallback(async (enabled: boolean) => {
    updateNodeData({ tool_model_enabled: enabled });
    
    if (effectiveBaseUrl) {
      const models = await loadModels(effectiveBaseUrl, enabled);
      updateNodeData({ 
        availableModels: models,
        model_name: models.length > 0 ? models[0] : undefined
      });
    }
  }, [effectiveBaseUrl, loadModels, updateNodeData]);

  // Загрузка моделей при инициализации
  useEffect(() => {
    if (effectiveBaseUrl && !data.availableModels) {
      loadModels(effectiveBaseUrl, data.tool_model_enabled).then(models => {
        updateNodeData({ availableModels: models });
      });
    }
  }, [effectiveBaseUrl, data.tool_model_enabled, data.availableModels, loadModels, updateNodeData]);

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
    <div className="px-4 py-3 shadow-md rounded-md bg-amber-600 border-2 border-amber-700 text-white w-80 relative">
      {/* Основной вход */}
      <Handle
        type="target"
        position={Position.Left}
        id="main"
        style={{ top: '20px' }}
        className="!bg-slate-700 !w-3 !h-3"
      />
      
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-bold">{data.label || "Ollama"}</div>
        <div className="text-xs bg-amber-800 px-2 py-1 rounded">🦙</div>
      </div>

      {/* Основные параметры */}
      <div className="space-y-2 mb-3">
        {/* Base URL */}
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            id="base_url"
            style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
            className="!bg-blue-500 !w-2 !h-2"
            title="Base URL"
          />
          <label className="text-xs font-medium block mb-1">
            Base URL: {data.incoming_base_url !== undefined && <span className="text-blue-300">(внешний)</span>}
          </label>
          <input
            type="text"
            value={effectiveBaseUrl || ""}
            onChange={(e) => handleBaseUrlChange(e.target.value)}
            placeholder="http://localhost:11434"
            disabled={data.incoming_base_url !== undefined}
            className={`w-full text-xs p-1 rounded border text-white placeholder-amber-300 ${
              data.incoming_base_url !== undefined 
                ? 'bg-blue-700/50 border-blue-500 cursor-not-allowed' 
                : 'bg-amber-700 border-amber-600'
            }`}
          />
        </div>

        {/* Model Name */}
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            id="model_name"
            style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
            className="!bg-green-500 !w-2 !h-2"
            title="Model Name"
          />
          <label className="text-xs font-medium block mb-1">
            Model: {data.incoming_model_name !== undefined && <span className="text-green-300">(внешний)</span>}
          </label>
          <select
            value={effectiveModelName || ""}
            onChange={(e) => updateNodeData({ model_name: e.target.value })}
            disabled={data.incoming_model_name !== undefined || isLoadingModels || !data.availableModels?.length}
            className={`w-full text-xs p-1 rounded border text-white ${
              data.incoming_model_name !== undefined 
                ? 'bg-green-700/50 border-green-500 cursor-not-allowed' 
                : 'bg-amber-700 border-amber-600'
            }`}
          >
            <option value="">Выберите модель</option>
            {data.availableModels?.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          {isLoadingModels && (
            <div className="text-xs text-amber-300 mt-1">Загрузка моделей...</div>
          )}
        </div>

        {/* Temperature */}
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            id="temperature"
            style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
            className="!bg-red-500 !w-2 !h-2"
            title="Temperature"
          />
          <label className="text-xs font-medium block mb-1">
            Temperature: {effectiveTemperature || 0.1} {data.incoming_temperature !== undefined && <span className="text-red-300">(внешний)</span>}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={effectiveTemperature || 0.1}
            onChange={(e) => updateNodeData({ temperature: parseFloat(e.target.value) })}
            disabled={data.incoming_temperature !== undefined}
            className={`w-full ${
              data.incoming_temperature !== undefined ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          />
        </div>

        {/* Tool Model Enabled */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={data.tool_model_enabled || false}
            onChange={(e) => handleToolModelEnabledChange(e.target.checked)}
            className="rounded"
          />
          <label className="text-xs">Tool Calling Models Only</label>
        </div>
      </div>

      {/* Кнопка расширенных настроек */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-xs bg-amber-700 hover:bg-amber-600 px-2 py-1 rounded mb-2 w-full"
      >
        {showAdvanced ? "Скрыть" : "Показать"} расширенные настройки
      </button>

      {/* Расширенные параметры */}
      {showAdvanced && (
        <div className="space-y-2 mb-3 p-2 bg-amber-700/50 rounded">
          {/* Format */}
           <div className="relative">
             <Handle
               type="target"
               position={Position.Left}
               id="format"
               style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
               className="!bg-purple-500 !w-2 !h-2"
               title="Format"
             />
             <label className="text-xs font-medium block mb-1">
               Format: {data.incoming_format !== undefined && <span className="text-purple-300">(внешний)</span>}
             </label>
             <input
               type="text"
               value={effectiveFormat || ""}
               onChange={(e) => updateNodeData({ format: e.target.value })}
               placeholder="json"
               disabled={data.incoming_format !== undefined}
               className={`w-full text-xs p-1 rounded border text-white placeholder-amber-300 ${
                 data.incoming_format !== undefined 
                   ? 'bg-purple-700/50 border-purple-500 cursor-not-allowed' 
                   : 'bg-amber-700 border-amber-600'
               }`}
             />
           </div>

           {/* System */}
           <div className="relative">
             <Handle
               type="target"
               position={Position.Left}
               id="system"
               style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
               className="!bg-yellow-500 !w-2 !h-2"
               title="System"
             />
             <label className="text-xs font-medium block mb-1">
               System: {data.incoming_system !== undefined && <span className="text-yellow-300">(внешний)</span>}
             </label>
             <textarea
               value={effectiveSystem || ""}
               onChange={(e) => updateNodeData({ system: e.target.value })}
               placeholder="Системное сообщение"
               rows={2}
               disabled={data.incoming_system !== undefined}
               className={`w-full text-xs p-1 rounded border text-white placeholder-amber-300 resize-none ${
                 data.incoming_system !== undefined 
                   ? 'bg-yellow-700/50 border-yellow-500 cursor-not-allowed' 
                   : 'bg-amber-700 border-amber-600'
               }`}
             />
           </div>

           {/* Tags */}
           <div className="relative">
             <Handle
               type="target"
               position={Position.Left}
               id="tags"
               style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
               className="!bg-pink-500 !w-2 !h-2"
               title="Tags"
             />
             <label className="text-xs font-medium block mb-1">
               Tags: {data.incoming_tags !== undefined && <span className="text-pink-300">(внешний)</span>}
             </label>
             <input
               type="text"
               value={effectiveTags || ""}
               onChange={(e) => updateNodeData({ tags: e.target.value })}
               placeholder="tag1,tag2,tag3"
               disabled={data.incoming_tags !== undefined}
               className={`w-full text-xs p-1 rounded border text-white placeholder-amber-300 ${
                 data.incoming_tags !== undefined 
                   ? 'bg-pink-700/50 border-pink-500 cursor-not-allowed' 
                   : 'bg-amber-700 border-amber-600'
               }`}
             />
           </div>

           {/* Stop Tokens */}
           <div className="relative">
             <Handle
               type="target"
               position={Position.Left}
               id="stop_tokens"
               style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
               className="!bg-indigo-500 !w-2 !h-2"
               title="Stop Tokens"
             />
             <label className="text-xs font-medium block mb-1">
               Stop Tokens: {data.incoming_stop_tokens !== undefined && <span className="text-indigo-300">(внешний)</span>}
             </label>
             <input
               type="text"
               value={effectiveStopTokens || ""}
               onChange={(e) => updateNodeData({ stop_tokens: e.target.value })}
               placeholder="stop1,stop2"
               disabled={data.incoming_stop_tokens !== undefined}
               className={`w-full text-xs p-1 rounded border text-white placeholder-amber-300 ${
                 data.incoming_stop_tokens !== undefined 
                   ? 'bg-indigo-700/50 border-indigo-500 cursor-not-allowed' 
                   : 'bg-amber-700 border-amber-600'
               }`}
             />
           </div>

          {/* Mirostat */}
          <div>
            <label className="text-xs font-medium block mb-1">Mirostat:</label>
            <select
              value={data.mirostat || "Disabled"}
              onChange={(e) => updateNodeData({ mirostat: e.target.value })}
              className="w-full text-xs p-1 rounded bg-amber-700 border border-amber-600 text-white"
            >
              <option value="Disabled">Disabled</option>
              <option value="Mirostat">Mirostat</option>
              <option value="Mirostat 2.0">Mirostat 2.0</option>
            </select>
          </div>

          {/* Mirostat параметры (показываем только если Mirostat включен) */}
          {data.mirostat && data.mirostat !== "Disabled" && (
            <>
              <div>
                <label className="text-xs font-medium block mb-1">Mirostat Eta:</label>
                <input
                  type="number"
                  step="0.01"
                  value={data.mirostat_eta || (data.mirostat === "Mirostat 2.0" ? 0.2 : 0.1)}
                  onChange={(e) => updateNodeData({ mirostat_eta: parseFloat(e.target.value) })}
                  className="w-full text-xs p-1 rounded bg-amber-700 border border-amber-600 text-white"
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1">Mirostat Tau:</label>
                <input
                  type="number"
                  step="0.1"
                  value={data.mirostat_tau || (data.mirostat === "Mirostat 2.0" ? 10 : 5)}
                  onChange={(e) => updateNodeData({ mirostat_tau: parseFloat(e.target.value) })}
                  className="w-full text-xs p-1 rounded bg-amber-700 border border-amber-600 text-white"
                />
              </div>
            </>
          )}

          {/* Другие параметры */}
           <div className="grid grid-cols-2 gap-2">
             <div className="relative">
               <Handle
                 type="target"
                 position={Position.Left}
                 id="top_k"
                 style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
                 className="!bg-teal-500 !w-2 !h-2"
                 title="Top K"
               />
               <label className="text-xs font-medium block mb-1">
                 Top K: {data.incoming_top_k !== undefined && <span className="text-teal-300">(внешний)</span>}
               </label>
               <input
                 type="number"
                 value={effectiveTopK || ""}
                 onChange={(e) => updateNodeData({ top_k: parseInt(e.target.value) || undefined })}
                 disabled={data.incoming_top_k !== undefined}
                 className={`w-full text-xs p-1 rounded border text-white ${
                   data.incoming_top_k !== undefined 
                     ? 'bg-teal-700/50 border-teal-500 cursor-not-allowed' 
                     : 'bg-amber-700 border-amber-600'
                 }`}
               />
             </div>
             <div className="relative">
               <Handle
                 type="target"
                 position={Position.Left}
                 id="top_p"
                 style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
                 className="!bg-orange-500 !w-2 !h-2"
                 title="Top P"
               />
               <label className="text-xs font-medium block mb-1">
                 Top P: {data.incoming_top_p !== undefined && <span className="text-orange-300">(внешний)</span>}
               </label>
               <input
                 type="number"
                 step="0.01"
                 value={effectiveTopP || ""}
                 onChange={(e) => updateNodeData({ top_p: parseFloat(e.target.value) || undefined })}
                 disabled={data.incoming_top_p !== undefined}
                 className={`w-full text-xs p-1 rounded border text-white ${
                   data.incoming_top_p !== undefined 
                     ? 'bg-orange-700/50 border-orange-500 cursor-not-allowed' 
                     : 'bg-amber-700 border-amber-600'
                 }`}
               />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-2">
             <div className="relative">
               <Handle
                 type="target"
                 position={Position.Left}
                 id="num_ctx"
                 style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
                 className="!bg-cyan-500 !w-2 !h-2"
                 title="Num Ctx"
               />
               <label className="text-xs font-medium block mb-1">
                 Num Ctx: {data.incoming_num_ctx !== undefined && <span className="text-cyan-300">(внешний)</span>}
               </label>
               <input
                 type="number"
                 value={effectiveNumCtx || ""}
                 onChange={(e) => updateNodeData({ num_ctx: parseInt(e.target.value) || undefined })}
                 disabled={data.incoming_num_ctx !== undefined}
                 className={`w-full text-xs p-1 rounded border text-white ${
                   data.incoming_num_ctx !== undefined 
                     ? 'bg-cyan-700/50 border-cyan-500 cursor-not-allowed' 
                     : 'bg-amber-700 border-amber-600'
                 }`}
               />
             </div>
             <div className="relative">
               <Handle
                 type="target"
                 position={Position.Left}
                 id="timeout"
                 style={{ left: '-8px', top: '50%', transform: 'translateY(-50%)' }}
                 className="!bg-lime-500 !w-2 !h-2"
                 title="Timeout"
               />
               <label className="text-xs font-medium block mb-1">
                 Timeout: {data.incoming_timeout !== undefined && <span className="text-lime-300">(внешний)</span>}
               </label>
               <input
                 type="number"
                 value={effectiveTimeout || ""}
                 onChange={(e) => updateNodeData({ timeout: parseInt(e.target.value) || undefined })}
                 disabled={data.incoming_timeout !== undefined}
                 className={`w-full text-xs p-1 rounded border text-white ${
                   data.incoming_timeout !== undefined 
                     ? 'bg-lime-700/50 border-lime-500 cursor-not-allowed' 
                     : 'bg-amber-700 border-amber-600'
                 }`}
               />
             </div>
           </div>
        </div>
      )}

      {/* Входящие данные */}
      <div className="text-xs p-2 bg-amber-700/70 rounded-sm min-h-[40px] max-h-[100px] overflow-y-auto mb-2">
        {data.incomingData !== undefined ? (
          <pre className="whitespace-pre-wrap break-all">
            {renderValue(data.incomingData)}
          </pre>
        ) : (
          <span className="italic opacity-70">Ожидание данных...</span>
        )}
      </div>

      {/* Ответ */}
      {data.response !== undefined && (
        <div className="text-xs p-2 bg-amber-700/50 rounded-sm mb-2 max-h-[100px] overflow-y-auto">
          <div className="font-semibold mb-1">Ответ:</div>
          <pre className="whitespace-pre-wrap break-all">
            {renderValue(data.response)}
          </pre>
        </div>
      )}

      {/* Ошибка */}
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
