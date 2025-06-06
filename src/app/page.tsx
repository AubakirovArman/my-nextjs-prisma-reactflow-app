// src/app/page.tsx
'use client'; 
import { useState } from 'react'; // <--- Импортировали useState
import MyFlowDiagram from "@/components/MyFlowDiagram"; // Убедись, что путь правильный
import NodePalette from "@/components/NodePalette"; // 


export default function HomePage() {
  const [runId, setRunId] = useState(0); // <--- Состояние для запуска

  const handleRunFlow = () => {
    setRunId(prevId => prevId + 1); // Увеличиваем ID для запуска нового выполнения
  };

  return (
    // Общий контейнер страницы, используем переменные CSS для фона и текста
    // или напрямую классы Tailwind, если они уже включают эти переменные.
    // bg-slate-900 text-slate-200 эквивалентны нашим --background и --foreground
    <div className="flex flex-col h-screen bg-slate-900 text-slate-200">
      {/* Шапка */}
      <header className="px-4 py-3 border-b border-slate-700 bg-slate-800 shadow-md flex items-center justify-between shrink-0">
        <input
          type="text"
          placeholder="Название вашей уникальной логики..."
          className="px-4 py-2 bg-slate-700 text-slate-100 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-400 flex-grow max-w-md transition-all duration-150 ease-in-out"
        />
        <div className="flex items-center space-x-3">
        <button
            onClick={handleRunFlow} // <--- Обработчик нажатия
            className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-colors duration-150 ease-in-out"
          >
            Запустить
          </button>
          <button className="px-5 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 transition-colors duration-150 ease-in-out">
            Сохранить
          </button>
        </div>
      </header>

      {/* Основной контент */}
      <div className="flex flex-grow overflow-hidden">
        {/* Левая панель (список нод) */}
        <NodePalette /> {/* <--- Используй компонент NodePalette здесь */}
        {/* Центральная панель (редактор React Flow) */}
        <main className="flex-grow relative bg-slate-900"> {/* Убедимся, что фон здесь совпадает с body */}
        <MyFlowDiagram runId={runId} />
        </main>

        {/* Правая панель (список сохраненных логик) */}
        <aside className="w-72 p-4 border-l border-slate-700 bg-slate-800 overflow-y-auto shrink-0">
          <h3 className="text-lg font-semibold mb-4 text-sky-400">Сохраненные Логики</h3>
          <div className="space-y-2">
            {/* Пример элемента списка сохраненных логик */}
            <div className="p-3 border border-transparent hover:border-sky-500 bg-slate-700/50 rounded-md cursor-pointer transition-colors duration-150 ease-in-out">
              <p className="font-medium text-slate-100">Моя первая супер-логика</p>
              <p className="text-xs text-slate-400">Сохранено: 31.05.2025</p>
            </div>
            <div className="p-3 border border-transparent hover:border-sky-500 bg-slate-700/50 rounded-md cursor-pointer transition-colors duration-150 ease-in-out">
              <p className="font-medium text-slate-100">Тестовая логика импорта</p>
              <p className="text-xs text-slate-400">Сохранено: 30.05.2025</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
