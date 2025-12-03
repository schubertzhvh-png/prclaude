# 🚀 Cold Outreach Platform

Личное веб-приложение для cold outreach в Instagram и X/Twitter. Аналог Cold DMs, но для single-user без регистрации и оплаты.

---

## 📋 Что это?

**Cold Outreach Platform** - это ваш личный "операционный центр" для DM-аутрича:

✅ Управление лидами и кампаниями
✅ Автоматические последовательности сообщений
✅ Instagram и X/Twitter интеграция
✅ AI-генерация персонализированных сообщений
✅ Inbox/CRM для отслеживания диалогов
✅ Система очередей с rate limiting

---

## 🏗️ Архитектура

### Технологический стек:

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- React Hook Form + Zod
- TanStack Query

**Backend:**
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis + BullMQ

---

## 📁 Структура проекта

```
cold-outreach-platform/
├── ARCHITECTURE.md          # Техническая спецификация
├── DATABASE_SCHEMA.md       # Описание схемы БД
├── API_SPECIFICATION.md     # REST API спецификация
├── README.md                # Этот файл
│
├── backend/                 # NestJS Backend
│   ├── schema.prisma        # ✅ Prisma schema (создан)
│   ├── src/
│   │   ├── modules/
│   │   │   ├── campaigns/
│   │   │   ├── leads/
│   │   │   ├── sequences/
│   │   │   ├── outreach/
│   │   │   ├── conversations/
│   │   │   ├── instagram/
│   │   │   ├── ai/
│   │   │   └── queue/
│   │   ├── common/
│   │   ├── config/
│   │   └── main.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/                # Next.js Frontend
    ├── src/
    │   ├── app/
    │   │   ├── (dashboard)/
    │   │   │   ├── campaigns/
    │   │   │   ├── leads/
    │   │   │   ├── outreach/
    │   │   │   ├── inbox/
    │   │   │   └── settings/
    │   │   └── layout.tsx
    │   ├── components/
    │   ├── lib/
    │   └── types/
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.ts
    └── .env.local
```

---

## 🚀 Быстрый старт

### Предварительные требования:

- Node.js 18+
- PostgreSQL 14+
- Redis 7+
- npm или yarn

### 1. Клонировать репозиторий

```bash
cd cold-outreach-platform
```

### 2. Установить Backend

```bash
cd backend

# Установить зависимости
npm install

# Создать .env файл
cp .env.example .env

# Отредактировать .env (укажите DATABASE_URL, REDIS_URL)
nano .env

# Запустить миграции Prisma
npx prisma generate
npx prisma migrate dev --name init

# Запустить сервер
npm run start:dev
```

Backend запустится на `http://localhost:3001`

### 3. Установить Frontend

```bash
cd ../frontend

# Установить зависимости
npm install

# Создать .env.local
cp .env.local.example .env.local

# Запустить dev сервер
npm run dev
```

Frontend запустится на `http://localhost:3000`

---

## 📚 Документация

### Основные документы:

1. **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Техническая архитектура, обоснование выбора технологий
2. **[DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)** - Детальная схема БД, таблицы, связи, индексы
3. **[API_SPECIFICATION.md](./API_SPECIFICATION.md)** - Полная спецификация REST API
4. **[backend/schema.prisma](./backend/schema.prisma)** - Prisma schema для генерации моделей

### Основные концепции:

#### Campaign (Кампания)
Контейнер для outreach на определенной платформе с конкретным оффером.

#### Lead (Лид)
Целевой пользователь в кампании. Отслеживается статус (new → messaged → replied → booked).

#### Sequence (Секвенция)
Последовательность шагов (steps) с message templates для кампании.

#### MessageJob (Задача отправки)
Задача в очереди для ручной или автоматической отправки DM.

#### ConversationLog (Лог диалога)
История inbound/outbound сообщений с лидом.

---

## ⚙️ Конфигурация

### Backend (.env)

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cold_outreach"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Server
PORT=3001
NODE_ENV=development

# Instagram (encrypted storage)
INSTAGRAM_ENCRYPTION_KEY=your-32-char-key-here

# AI
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...

# Rate Limits
MAX_DM_PER_HOUR=20
MAX_DM_PER_DAY=100
MIN_DELAY_BETWEEN_DM=45
MAX_DELAY_BETWEEN_DM=180
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 🔄 Workflow

### Типичный флоу использования:

1. **Создать Campaign**
   - Название, платформа (Instagram/X), ниша, оффер
   - Добавить AI context для генерации

2. **Настроить Sequence**
   - Шаг 0: Initial DM (delay: 0 дней)
   - Шаг 1: Follow-up 1 (delay: 2 дня)
   - Шаг 2: Follow-up 2 (delay: 3 дня)
   - Использовать плейсхолдеры: `{{name}}`, `{{niche}}`, `{{offer}}`

3. **Импортировать Leads**
   - Через CSV (массовый импорт)
   - Через Instagram (followers/likers/commenters)
   - Вручную (один за другим)

4. **Outreach**
   - Выбрать кампанию и шаг
   - Просмотреть очередь лидов
   - Режимы:
     - **Ручной**: скопировать текст, отправить самостоятельно, отметить как sent
     - **Авто**: добавить в очередь, система отправит с учётом rate limits

5. **Inbox/CRM**
   - Отслеживать ответы
   - Добавлять inbound сообщения
   - Менять статусы: replied → booked / lost

---

## 🔐 Instagram Integration

### ⚠️ Важно: Риски и безопасность

Instagram не поддерживает официальное API для cold DM outreach.
Неофициальная интеграция нарушает Instagram ToS и может привести к блокировке.

**Best practices:**
- ✅ Не превышать лимиты (20 DM/час, 100 DM/день)
- ✅ Рандомизация задержек между отправками
- ✅ Warmup аккаунта (начать с 5-10 DM/день)
- ✅ Миксовать активности (лайки, сторис, не только DM)
- ✅ Использовать "старые" аккаунты (не новые)
- ✅ Возможность полностью отключить автоотправку

### Как подключить Instagram:

1. **Получить session cookie:**
   - Войти в Instagram в браузере
   - Открыть DevTools → Application → Cookies
   - Скопировать значение `sessionid`

2. **В приложении:**
   - Instagram Settings → Username + Session Cookie
   - Активировать интеграцию
   - Тестировать на малых объёмах

3. **Модуль InstagramService:**
   - Хранит зашифрованные credentials (AES-256)
   - Предоставляет методы: `fetchFollowers()`, `sendDM()`, etc.
   - Интегрируется с BullMQ для очередей

---

## 🤖 AI Integration

### Поддерживаемые провайдеры:

- **OpenAI** (GPT-4)
- **Anthropic** (Claude)

### Использование:

1. **Конфигурация:**
   ```env
   OPENAI_API_KEY=sk-...
   ```

2. **В приложении:**
   - Outreach → кнопка "AI Improve"
   - Отправляет: `baseMessage + lead data + campaignAiContext`
   - Получает: улучшенную версию сообщения

3. **AI Context в Campaign:**
   ```
   We help SaaS founders scale to 7 figures through proven outbound strategies.
   Our ideal clients are B2B SaaS companies with $1M+ ARR looking to add another $100k MRR in 90 days.
   ```

---

## 📊 Система очередей (BullMQ)

### MessageJob Processing:

**Очередь:** `message-jobs`

**Процессор:**
1. Проверка rate limits (hourly/daily)
2. Проверка активных часов (9am-9pm)
3. Рандомная задержка (45-180 сек)
4. Отправка через InstagramService
5. Обновление статуса (sent/failed)
6. Retry при ошибках (max 3)

**Web UI:** Bull Board на `/admin/queues`

---

## 📈 Roadmap

### MVP (Текущий этап):

- [x] Архитектура и схема БД
- [x] Prisma schema
- [x] API спецификация
- [ ] Backend реализация (NestJS modules)
- [ ] Frontend реализация (Next.js pages)
- [ ] Instagram интеграция (заглушка)
- [ ] AI интеграция (заглушка)
- [ ] Очереди (BullMQ setup)

### Phase 2:

- [ ] Реальная Instagram интеграция (библиотека instagram-private-api)
- [ ] X/Twitter интеграция
- [ ] Advanced AI (fine-tuning, multiple prompts)
- [ ] Analytics dashboard
- [ ] Export/Import campaigns

### Phase 3 (Мультиюзерка):

- [ ] Authentication (JWT)
- [ ] User management
- [ ] Billing (Stripe)
- [ ] Teams & collaboration

---

## 🛠️ Development

### Backend команды:

```bash
# Разработка
npm run start:dev

# Сборка
npm run build

# Production
npm run start:prod

# Тесты
npm run test

# Prisma Studio (GUI для БД)
npx prisma studio

# Генерация Prisma Client
npx prisma generate

# Создать миграцию
npx prisma migrate dev --name add_new_field

# Применить миграции (production)
npx prisma migrate deploy
```

### Frontend команды:

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Production
npm run start

# Линтинг
npm run lint

# Type-check
npm run type-check
```

---

## 📝 Плейсхолдеры в сообщениях

В `SequenceStep.messageTemplate` поддерживаются:

| Плейсхолдер | Источник | Пример |
|-------------|----------|---------|
| `{{name}}` | Lead.name | "John Doe" |
| `{{username}}` | Lead.username | "johndoe" |
| `{{niche}}` | Lead.niche | "SaaS" |
| `{{note}}` | Lead.note | "Interested in automation" |
| `{{offer}}` | Campaign.offer | "Free consultation" |
| `{{campaignName}}` | Campaign.name | "Q1 Outreach" |

**Пример:**
```
Hey {{name}}!

Noticed you're in {{niche}} and thought you'd find value in {{offer}}.

Would love to connect!
```

---

## 🤝 Contributing

Single-user приложение, но архитектура готова для open-source.

---

## 📄 License

Private project. All rights reserved.

---

## 🆘 Support

Для вопросов и багов создавайте issues в репозитории.

---

## 🎯 Next Steps

1. **Изучите документацию:**
   - [ARCHITECTURE.md](./ARCHITECTURE.md)
   - [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
   - [API_SPECIFICATION.md](./API_SPECIFICATION.md)

2. **Реализуйте Backend:**
   - Создайте NestJS модули (см. ARCHITECTURE.md)
   - Реализуйте контроллеры по API_SPECIFICATION.md
   - Подключите Prisma и миграции

3. **Реализуйте Frontend:**
   - Создайте страницы (Campaigns, Leads, Outreach, Inbox)
   - Интегрируйте с Backend API
   - Добавьте формы и валидацию

4. **Instagram интеграция:**
   - Установите `instagram-private-api`
   - Реализуйте InstagramService
   - Добавьте шифрование credentials

5. **Тестируйте на малых объёмах!**

---

**Готово к разработке!** 🚀

Создана полная архитектура, спецификации и фундамент для вашего личного cold outreach приложения.
