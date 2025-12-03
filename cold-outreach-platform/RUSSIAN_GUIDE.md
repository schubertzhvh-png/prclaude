# 🚀 Руководство по Cold Outreach Platform (Instagram)

## 📋 Что это такое?

Это **твоё личное веб-приложение** для автоматизации cold outreach через Instagram DM. Аналог Cold DMs, но:
- ✅ Только для тебя (без регистрации)
- ✅ Бесплатно (запускаешь локально)
- ✅ Полный контроль над данными
- ✅ Только Instagram (Twitter/X убран)

---

## 🎯 Что можно делать?

### 1. **Кампании**
- Создавай разные кампании (например: "SaaS founders Q1", "E-commerce бренды")
- Для каждой кампании: своя ниша, оффер, контекст для AI

### 2. **Лиды**
- Импортируй лиды из CSV
- Или скрапь из Instagram:
  - Фолловеры аккаунта
  - Лайкеры постов
  - Комментаторы
- Храни информацию: username, имя, ниша, заметки

### 3. **Последовательности (Sequences)**
- Создавай многошаговые последовательности сообщений
- Шаг 1: первое сообщение
- Шаг 2: follow-up через 3 дня (если не ответил)
- Шаг 3: последний шанс через 5 дней
- Используй плейсхолдеры: `{{name}}`, `{{username}}`, `{{niche}}`

### 4. **Отправка (Outreach)**
- **Ручной режим**: показываешь сообщение → копируешь → отправляешь вручную → отмечаешь "отправлено"
- **Авто режим** (опционально): добавляешь в очередь → бот отправляет с задержками и лимитами

### 5. **Inbox (Входящие)**
- Отслеживай кто ответил
- История всех переписок
- Быстрое изменение статуса: новый → отправлено → ответил → забукал/проиграл

### 6. **AI помощник**
- Улучшение текста через GPT
- Генерация персонализированных сообщений на основе профиля лида

---

## 🏗️ Технологии

**Backend (Сервер):**
- NestJS (TypeScript)
- PostgreSQL (база данных)
- Redis + BullMQ (очередь сообщений)
- Prisma ORM

**Frontend (Интерфейс):**
- Next.js 14 (пока не создан - следующий шаг)
- React + TypeScript
- Tailwind CSS + shadcn/ui

---

## 📁 Что уже готово?

### ✅ Полностью готов Backend (API)

Реализованы все модули:

1. **Campaigns API** (`/api/campaigns`)
   - Создание, редактирование, удаление
   - Фильтры и поиск
   - Статистика

2. **Leads API** (`/api/leads`)
   - CRUD операции
   - Импорт пачкой
   - Пагинация
   - Быстрая смена статуса

3. **Sequences API** (`/api/campaigns/:id/sequence`)
   - Создание многошаговых последовательностей
   - Шаблоны с плейсхолдерами

4. **Outreach API** (`/api/outreach`)
   - Очередь лидов для отправки
   - Создание задач
   - Ручной режим

5. **Conversations API** (`/api/conversations`)
   - История переписок
   - Inbox

6. **Instagram API** (`/api/instagram`)
   - Сохранение аккаунта (с шифрованием)
   - Импорт фолловеров (заготовка)
   - Отправка DM (заготовка)

7. **AI API** (`/api/ai`)
   - Улучшение текста (заготовка для OpenAI)

**API документация:**
- Автоматический Swagger UI: `http://localhost:3001/api/docs`
- Полное описание: `API_SPECIFICATION.md`

---

## ⏳ Что осталось сделать?

### 1. База данных (5 минут)
```bash
# Установи PostgreSQL
# Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# macOS:
brew install postgresql

# Запусти:
sudo service postgresql start  # Linux
brew services start postgresql  # macOS

# Создай базу:
sudo -u postgres createdb cold_outreach
```

### 2. Запуск Backend (5 минут)
```bash
cd cold-outreach-platform/backend

# Установи зависимости
npm install

# Создай .env файл
cp .env.example .env

# Отредактируй .env:
# DATABASE_URL="postgresql://user:password@localhost:5432/cold_outreach"
nano .env  # или любой редактор

# Сгенерируй Prisma Client
npx prisma generate

# Запусти миграции (создаст все таблицы)
npx prisma migrate dev --name init

# Запусти сервер
npm run start:dev
```

Сервер запустится на `http://localhost:3001`
Swagger docs: `http://localhost:3001/api/docs`

### 3. Instagram интеграция (2-3 часа)
Нужно добавить:
- Библиотеку для Instagram API (например `instagram-private-api`)
- Реальную отправку DM
- Импорт фолловеров
- Шифрование cookie сессии

**⚠️ Важно:** Instagram может банить за автоматизацию. Начни с малых объёмов (5-10 DM в день).

### 4. AI интеграция (1 час)
```bash
# Получи API ключ от OpenAI: https://platform.openai.com/api-keys
# Добавь в .env:
OPENAI_API_KEY=sk-...

# Реализуй вызов OpenAI API в модуле AI
```

### 5. Очередь сообщений (1-2 часа)
```bash
# Установи Redis
sudo apt install redis-server  # Linux
brew install redis              # macOS

# Запусти
sudo service redis-server start  # Linux
brew services start redis        # macOS

# Настрой в .env:
REDIS_HOST=localhost
REDIS_PORT=6379
```

Нужно создать процессор очереди (BullMQ), который будет:
- Брать задачи из очереди
- Проверять лимиты (MAX_DM_PER_HOUR=20)
- Делать случайные задержки (45-180 сек)
- Отправлять через Instagram API
- Обновлять статусы

### 6. Frontend (1-2 дня)
Создать Next.js приложение со страницами:
- Кампании (список, создание, редактирование)
- Лиды (таблица, импорт CSV, Instagram импорт)
- Последовательности (конструктор шагов)
- Отправка (focus mode - одно окно для прохода по лидам)
- Inbox (переписки)
- Настройки (Instagram аккаунт, AI ключи, лимиты)

---

## 🚀 Быстрый старт (что делать прямо сейчас)

### Шаг 1: Запусти Backend

```bash
cd /home/user/prclaude/cold-outreach-platform/backend

# Установи зависимости
npm install

# Создай .env
cp .env.example .env

# ВАЖНО: отредактируй .env, вставь свой DATABASE_URL
# Например: DATABASE_URL="postgresql://postgres:password@localhost:5432/cold_outreach"
nano .env

# Сгенерируй Prisma
npx prisma generate

# Запусти миграции
npx prisma migrate dev --name init

# Запусти сервер
npm run start:dev
```

### Шаг 2: Открой Swagger UI

Перейди в браузере: `http://localhost:3001/api/docs`

Там увидишь все API эндпоинты и сможешь протестировать:
1. Создай кампанию через `POST /api/campaigns`
2. Добавь лидов через `POST /api/leads`
3. Создай последовательность через `POST /api/campaigns/:id/sequence`
4. И так далее...

### Шаг 3: (Опционально) Prisma Studio

```bash
npx prisma studio
```

Откроется UI на `http://localhost:5555` где можно смотреть и редактировать данные в базе.

---

## 📊 Схема базы данных

```
User (для будущего)
  |
  └── Campaign (кампании)
        |
        ├── Lead (лиды)
        |     |
        |     ├── MessageJob (очередь отправки)
        |     └── ConversationLog (история переписок)
        |
        ├── Sequence (последовательности)
        |     └── SequenceStep (шаги)
        |
        └── InstagramImportedSource (источники импорта)

InstagramAccount (аккаунты Instagram с куками)
```

**9 таблиц всего:**
1. User (на будущее)
2. Campaign
3. Lead
4. Sequence
5. SequenceStep
6. MessageJob
7. ConversationLog
8. InstagramAccount
9. InstagramImportedSource

---

## 🔐 Безопасность Instagram

### ⚠️ Риски:
- Instagram может забанить аккаунт за автоматизацию
- Слишком много DM = бан
- Подозрительное поведение = бан

### ✅ Как снизить риски:
1. **Лимиты:**
   - Не больше 20 DM в час
   - Не больше 100 DM в день
   - Случайные задержки 45-180 секунд

2. **Рабочие часы:**
   - Отправляй только 9:00 - 21:00 (как человек)
   - Настраивается в .env: `ACTIVE_START_HOUR=9`, `ACTIVE_END_HOUR=21`

3. **Начни с малого:**
   - Первые дни: 5-10 DM в день вручную
   - Потом постепенно увеличивай
   - Используй тёплые аккаунты (не новые)

4. **Ручной режим безопаснее:**
   - Платформа показывает текст
   - Ты копируешь и отправляешь сам через Instagram
   - Отмечаешь как "отправлено"
   - Никаких банов!

---

## 💡 Типичный workflow

1. **Создаёшь кампанию:** "SaaS Founders Q1"
   - Платформа: Instagram
   - Ниша: "SaaS founders with 10-100 employees"
   - Оффер: "Free consultation on scaling to 7 figures"

2. **Импортируешь лидов:**
   - Вариант А: CSV файл (username, name, niche)
   - Вариант Б: Скрапинг фолловеров из @saasfounder123

3. **Создаёшь последовательность:**
   - Шаг 0 (сразу): "Hey {{name}}! Noticed you're in {{niche}}..."
   - Шаг 1 (через 3 дня): "Following up on my previous message..."
   - Шаг 2 (через 5 дней): "Last chance - this offer expires..."

4. **Запускаешь outreach:**
   - Заходишь в раздел "Outreach"
   - Выбираешь кампанию + шаг 0
   - Видишь список лидов
   - Для каждого: AI улучшает текст → ты копируешь → отправляешь в Instagram → отмечаешь "sent"

5. **Отслеживаешь результаты:**
   - Inbox показывает кто ответил
   - Меняешь статус: replied → booked (или lost)
   - Смотришь статистику по кампании

---

## 📚 Документация

В папке `cold-outreach-platform/` есть все документы:

- **README.md** - основная инструкция (EN)
- **RUSSIAN_GUIDE.md** - это руководство (RU)
- **ARCHITECTURE.md** - техническая архитектура
- **DATABASE_SCHEMA.md** - подробная схема БД
- **API_SPECIFICATION.md** - все API эндпоинты
- **IMPLEMENTATION_STATUS.md** - что готово, что осталось

---

## 🐛 Troubleshooting

### Backend не запускается?
```bash
# Проверь PostgreSQL
sudo service postgresql status

# Проверь что база создана
sudo -u postgres psql -c "\l"

# Проверь .env файл
cat .env | grep DATABASE_URL
```

### Prisma ошибки?
```bash
# Удали и пересоздай базу
npx prisma migrate reset

# Или создай миграцию заново
npx prisma migrate dev --name init
```

### Порт занят?
```bash
# Измени в .env
PORT=3002

# Или найди и убей процесс
lsof -i :3001
kill -9 <PID>
```

---

## 🎯 Следующие шаги (приоритеты)

### Сейчас (чтобы начать работать):
1. ✅ Запусти Backend
2. ✅ Протестируй API через Swagger
3. ✅ Создай тестовую кампанию и лидов

### Скоро (для полноценной работы):
1. 🔄 Instagram API интеграция (реальная отправка DM)
2. 🔄 Redis + BullMQ (автоматическая очередь)
3. 🔄 AI интеграция (OpenAI для улучшения текстов)

### Потом (для удобства):
1. ⏳ Frontend (Next.js UI)
2. ⏳ CSV импорт через UI
3. ⏳ Графики и аналитика

---

## 📞 Если что-то непонятно

1. Открой Swagger docs: `http://localhost:3001/api/docs`
2. Посмотри примеры в `API_SPECIFICATION.md`
3. Изучи схему БД в `DATABASE_SCHEMA.md`
4. Проверь Prisma Studio: `npx prisma studio`

---

## ⚡ Быстрые команды

```bash
# Backend
cd backend
npm run start:dev        # Запустить сервер
npx prisma studio       # Открыть UI базы данных
npx prisma migrate dev  # Применить миграции
npm run build           # Собрать для продакшена

# База данных
sudo service postgresql start    # Запустить PostgreSQL
sudo -u postgres psql           # Открыть консоль PostgreSQL

# Redis
sudo service redis-server start  # Запустить Redis
redis-cli                       # Открыть консоль Redis

# Git
git status                      # Текущие изменения
git log --oneline -10          # Последние 10 коммитов
```

---

**Готово! Теперь у тебя есть полноценный backend для Instagram cold outreach. Запускай и тестируй! 🚀**
