// src/app/page.tsx
'use client'; 
import { useState, useRef, useEffect } from 'react';
import MyFlowDiagram, { MyFlowDiagramRef } from "@/components/MyFlowDiagram";
import NodePalette from "@/components/NodePalette"; //


export default function HomePage() {
  const [runId, setRunId] = useState(0);
  const [logicName, setLogicName] = useState('');
  const [logics, setLogics] = useState<Array<{id:string,name:string,createdAt:string}>>([]);
  const diagramRef = useRef<MyFlowDiagramRef>(null);

  useEffect(() => {
    fetch('/api/logic/list')
      .then(res => res.json())
      .then(setLogics)
      .catch(() => {});
  }, []);

  const handleRunFlow = () => {
    setRunId(prevId => prevId + 1); // Увеличиваем ID для запуска нового выполнения
  };

  const handleSaveFlow = async () => {
    if (!diagramRef.current) return;
    const { nodes, edges } = diagramRef.current.getFlowData();
    const res = await fetch('/api/logic/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: logicName || 'Unnamed', nodes, edges })
    });
    const data = await res.json();
    if (data.id) {
      setLogics(prev => [{ id: data.id, name: logicName || 'Unnamed', createdAt: new Date().toISOString() }, ...prev]);
    }
  };

  const handleLoadFlow = async (id: string) => {
    if (!diagramRef.current) return;
    const res = await fetch(`/api/logic/${id}`);
    const data = await res.json();
    if (data.nodes && data.edges) {
      diagramRef.current.setFlowData({ nodes: data.nodes, edges: data.edges });
      setLogicName(data.name);
    }
  };

  const handleDeleteFlow = async (id: string) => {
    await fetch(`/api/logic/${id}`, { method: 'DELETE' });
    setLogics(prev => prev.filter(l => l.id !== id));
  };

  return (
    // Общий контейнер страницы
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0f172a] via-[#1e2937] to-[#3b0764] text-slate-200">
      {/* Шапка */}
      <header className="px-4 py-3 border-b border-slate-600/60 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-md shadow-md flex items-center justify-between shrink-0">
        <input
          type="text"
          value={logicName}
          onChange={(e) => setLogicName(e.target.value)}
          placeholder="Название вашей уникальной логики..."
          className="px-4 py-2 bg-slate-800/60 text-slate-100 border border-slate-600/60 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 flex-grow max-w-md transition-all duration-150 ease-in-out"
        />
        <div className="flex items-center space-x-3">
        <button
            onClick={handleRunFlow} // <--- Обработчик нажатия
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-colors duration-150 ease-in-out"
          >
            Запустить
          </button>
          <button
            onClick={handleSaveFlow}
            className="px-5 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-colors duration-150 ease-in-out">
            Сохранить
          </button>
        </div>
      </header>

      {/* Основной контент */}
      <div className="flex flex-grow overflow-hidden">
        {/* Левая панель (список нод) */}
        <NodePalette /> {/* <--- Используй компонент NodePalette здесь */}
        {/* Центральная панель (редактор React Flow) */}
        <main className="flex-grow relative"> {/* Убедимся, что фон здесь совпадает с body */}
        <MyFlowDiagram ref={diagramRef} runId={runId} />
        </main>

        {/* Правая панель (список сохраненных логик) */}
        <aside className="w-72 p-4 border-l border-slate-600/60 bg-slate-800/30 backdrop-blur-lg overflow-y-auto shrink-0">
          <h3 className="text-lg font-semibold mb-4 text-sky-400">Сохраненные Логики</h3>
          <div className="space-y-2">
            {logics.map(l => (
              <div
                key={l.id}
                onClick={() => handleLoadFlow(l.id)}
                className="relative p-3 border border-slate-500/50 hover:border-sky-500 bg-slate-700/30 rounded-md cursor-pointer transition-colors duration-150 ease-in-out backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDeleteFlow(l.id); }}
                  className="absolute top-1 right-1 text-red-400 hover:text-red-300"
                >
                  ×
                </button>
                <p className="font-medium text-slate-100">{l.name}</p>
                <p className="text-xs text-slate-400">{new Date(l.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
