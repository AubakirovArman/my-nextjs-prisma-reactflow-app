# React Flow Visual Logic Builder

## 📋 Описание проекта

Это интерактивное веб-приложение для создания визуальных логических схем с использованием технологии drag-and-drop. Приложение позволяет пользователям создавать сложные логические цепочки, соединяя различные типы узлов для обработки данных, отображения информации и выполнения различных операций.

## 🚀 Основные возможности

### Визуальный редактор
- **Drag & Drop интерфейс**: Перетаскивание узлов из палитры на рабочую область
- **Интерактивные соединения**: Создание связей между узлами для передачи данных
- **Реальное время**: Мгновенное обновление и обработка данных при изменениях
- **Адаптивный дизайн**: Современный темный интерфейс с использованием Tailwind CSS

### Типы узлов

#### 1. **Start Node (Стартовый узел)**
- Точка входа для логической схемы
- Инициирует выполнение всей цепочки
- Не имеет входящих соединений

#### 2. **Input Text Node (Узел ввода текста)**
- Позволяет пользователю вводить текстовые данные
- Поддерживает уникальные идентификаторы для ссылок
- Передает введенные данные следующим узлам
- **Особенности:**
  - Редактируемый ID узла
  - Отображение входящих данных
  - Валидация ввода

#### 3. **JSON Processor Node (Узел обработки JSON)**
- Извлекает данные из JSON объектов по указанному пути
- Поддерживает сложные пути доступа к данным
- Может ссылаться на конкретные узлы по ID
- **Возможности:**
  - Обработка вложенных объектов
  - Извлечение массивов и примитивных значений
  - Обработка ошибок при некорректных путях
  - Примеры путей: `inputValue`, `incomingData.message`, `data.users[0].name`

#### 4. **Display Node (Узел отображения)**
- Показывает результаты обработки данных
- Поддерживает различные форматы данных
- Имеет уникальный идентификатор
- **Функции:**
  - Форматированный вывод JSON
  - Отображение текстовых данных
  - Индикация ошибок

#### 5. **Alert Node (Узел уведомлений)**
- Отображает системные сообщения и уведомления
- Поддерживает различные типы сообщений
- Интеграция с системой событий

## 🛠 Технологический стек

### Frontend
- **Next.js 15.3.3** - React фреймворк с поддержкой SSR
- **React 19.0.0** - Библиотека для создания пользовательских интерфейсов
- **@xyflow/react 12.6.4** - Библиотека для создания интерактивных диаграмм
- **TypeScript 5** - Типизированный JavaScript
- **Tailwind CSS 4** - Utility-first CSS фреймворк

### Backend & Database
- **Prisma 6.8.2** - ORM для работы с базой данных
- **PostgreSQL** - Реляционная база данных
- **@prisma/client** - Клиент для взаимодействия с БД

### Development Tools
- **ESLint 9** - Линтер для JavaScript/TypeScript
- **PostCSS** - Инструмент для трансформации CSS
- **Turbopack** - Быстрый сборщик для разработки

## 📦 Установка и запуск

### Предварительные требования
- Node.js 18+ 
- npm, yarn, pnpm или bun
- PostgreSQL база данных

### Шаги установки

1. **Клонирование репозитория**
```bash
git clone <repository-url>
cd my-nextjs-prisma-reactflow-app
```

2. **Установка зависимостей**
```bash
npm install
# или
yarn install
# или
pnpm install
# или
bun install
```

3. **Настройка базы данных**
```bash
# Создайте файл .env.local в корне проекта
echo "DATABASE_URL=postgresql://username:password@localhost:5432/database_name" > .env.local
```

4. **Миграция базы данных**
```bash
npx prisma migrate dev
# или
npx prisma db push
```

5. **Генерация Prisma клиента**
```bash
npx prisma generate
```

6. **Запуск приложения**
```bash
npm run dev
# или
yarn dev
# или
pnpm dev
# или
bun dev
```

7. **Открытие в браузере**
Перейдите по адресу [http://localhost:3000](http://localhost:3000)

## 🎯 Использование

### Создание логической схемы

1. **Добавление узлов**
   - Перетащите нужный тип узла из левой панели на рабочую область
   - Каждый узел получает уникальный ID автоматически
   - ID можно редактировать для удобства ссылок

2. **Соединение узлов**
   - Кликните на выходной порт узла (справа)
   - Перетащите соединение к входному порту другого узла (слева)
   - Данные будут передаваться по созданному соединению

3. **Настройка узлов**
   - **Input Text Node**: Введите текст или JSON данные
   - **JSON Processor Node**: 
     - Укажите ID исходного узла в поле "Source Node ID"
     - Введите путь к данным в поле "Data Path"
     - Примеры: `inputValue`, `data.message`, `users[0].name`
   - **Display Node**: Автоматически отображает входящие данные

4. **Выполнение схемы**
   - Нажмите кнопку "Запустить" в верхней панели
   - Данные будут обработаны согласно созданной логике
   - Результаты отобразятся в Display узлах

### Примеры использования

#### Пример 1: Простая обработка текста
```
Input Text Node (id: "input1") 
    ↓
JSON Processor Node (sourceNodeId: "input1", dataPath: "inputValue")
    ↓
Display Node
```

#### Пример 2: Обработка JSON данных
```
Input Text Node (JSON: {"user": {"name": "John", "age": 30}})
    ↓
JSON Processor Node (dataPath: "user.name")
    ↓
Display Node (покажет: "John")
```

## 🗄 Структура базы данных

### Модель Node
```prisma
model Node {
  id        String   @id @default(cuid())
  label     String   // Метка узла
  x         Float    // Позиция X на холсте
  y         Float    // Позиция Y на холсте
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 📁 Структура проекта

```
my-nextjs-prisma-reactflow-app/
├── prisma/
│   ├── migrations/          # Миграции базы данных
│   └── schema.prisma        # Схема базы данных
├── public/                  # Статические файлы
├── src/
│   ├── app/
│   │   ├── globals.css      # Глобальные стили
│   │   ├── layout.tsx       # Основной layout
│   │   └── page.tsx         # Главная страница
│   ├── components/
│   │   ├── MyFlowDiagram.tsx    # Основной компонент диаграммы
│   │   ├── NodePalette.tsx      # Палитра узлов
│   │   └── Nodes/               # Компоненты узлов
│   │       ├── AlertNode.tsx
│   │       ├── DisplayNode.tsx
│   │       ├── InputTextNode.tsx
│   │       ├── JsonProcessorNode.tsx
│   │       └── StartNode.tsx
│   ├── generated/
│   │   └── prisma/          # Сгенерированный Prisma клиент
│   └── lib/
│       └── prisma.ts        # Конфигурация Prisma
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

## 🔧 Конфигурация

### Переменные окружения
Создайте файл `.env.local` в корне проекта:

```env
# База данных
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# Опционально: другие настройки
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Настройка Tailwind CSS
Файл `tailwind.config.js` уже настроен для работы с темной темой и кастомными цветами.

### Настройка TypeScript
Проект использует строгую типизацию TypeScript с настройками в `tsconfig.json`.

## 🚀 Скрипты

```bash
# Разработка с Turbopack
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшен сервера
npm run start

# Линтинг кода
npm run lint

# Работа с базой данных
npx prisma studio          # Открыть Prisma Studio
npx prisma migrate dev     # Создать и применить миграцию
npx prisma generate        # Сгенерировать клиент
npx prisma db push         # Применить схему к БД
npx prisma db pull         # Получить схему из БД
```

## 🎨 Кастомизация

### Добавление новых типов узлов

1. Создайте новый компонент в `src/components/Nodes/`
2. Зарегистрируйте его в `nodeTypes` в `MyFlowDiagram.tsx`
3. Добавьте в палитру узлов в `NodePalette.tsx`

### Изменение стилей
- Основные стили находятся в `src/app/globals.css`
- Используйте Tailwind классы для быстрой стилизации
- Кастомные цвета определены в конфигурации Tailwind

## 🐛 Отладка

### Общие проблемы

1. **Ошибка подключения к БД**
   - Проверьте `DATABASE_URL` в `.env.local`
   - Убедитесь, что PostgreSQL запущен
   - Выполните `npx prisma migrate dev`

2. **Узлы не отображаются**
   - Проверьте регистрацию в `nodeTypes`
   - Убедитесь в корректности импортов

3. **Данные не передаются между узлами**
   - Проверьте соединения между узлами
   - Убедитесь в корректности путей данных
   - Проверьте ID узлов

### Логирование
Используйте `console.log` в компонентах узлов для отладки передачи данных.

## 📚 Дополнительные ресурсы

- [Next.js Documentation](https://nextjs.org/docs)
- [React Flow Documentation](https://reactflow.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 👥 Авторы

- Ваше имя - [your-email@example.com](mailto:your-email@example.com)

## 🙏 Благодарности

- Команде React Flow за отличную библиотеку
- Команде Next.js за мощный фреймворк
- Команде Prisma за удобную ORM
- Сообществу разработчиков за вдохновение и поддержку
