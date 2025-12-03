# Cold Outreach Platform - Техническая спецификация

## 1. ВЫБОР ТЕХНОЛОГИЧЕСКОГО СТЕКА

### Frontend: **Next.js 14 (App Router) + TypeScript**

**Обоснование выбора Next.js над Vite:**

✅ **SSR и оптимизация**: Next.js предоставляет Server-Side Rendering из коробки, что улучшает SEO и начальную загрузку
✅ **API Routes**: Встроенные API routes упрощают разработку для single-user приложения (можно обойтись без отдельного backend сервера при необходимости)
✅ **File-based routing**: Интуитивная структура страниц
✅ **Оптимизация изображений**: Встроенный Image component
✅ **TypeScript support**: Отличная интеграция из коробки
✅ **Экосистема**: Больше готовых решений и примеров для enterprise-приложений
✅ **Production-ready**: Проще деплоить (Vercel, но можно и self-hosted)

**Против Vite:** Хотя Vite быстрее в dev-режиме, Next.js предоставляет больше возможностей для масштабирования, лучше подходит для data-heavy приложений с формами и таблицами.

### Backend: **NestJS + TypeScript**

**Обоснование выбора NestJS над Express:**

✅ **Архитектура из коробки**: Встроенная DI (Dependency Injection), модульная структура
✅ **TypeScript-first**: Полная типизация, декораторы
✅ **Масштабируемость**: Легко добавить мультиюзерку в будущем
✅ **Встроенные модули**: Validation (class-validator), Guards, Interceptors, Pipes
✅ **Swagger/OpenAPI**: Автогенерация документации API
✅ **Микросервисная архитектура**: Если понадобится разделить на сервисы
✅ **Queue management**: Отличная интеграция с BullMQ
✅ **Testability**: Встроенная поддержка тестирования

**Против Express:** Express требует ручной настройки архитектуры, NestJS предоставляет это из коробки.

### ORM: **Prisma**

**Обоснование выбора Prisma над TypeORM/Knex:**

✅ **Type-safety**: Полная типизация запросов на уровне TypeScript
✅ **Developer Experience**: Prisma Studio для визуального просмотра данных
✅ **Миграции**: Простая система миграций с автогенерацией
✅ **Schema-first**: Декларативная схема в одном файле
✅ **Performance**: Оптимизированные запросы
✅ **Relations**: Простая работа со связями
✅ **Prisma Client**: Автогенерируемый type-safe клиент

### Очереди: **BullMQ + Redis**

**Обоснование:**
✅ Надежная система очередей для асинхронной обработки
✅ Поддержка приоритетов, задержек, повторов
✅ Web UI для мониторинга (Bull Board)
✅ Rate limiting из коробки

### UI библиотеки:

- **shadcn/ui** - современные, кастомизируемые компоненты на базе Radix UI
- **Tailwind CSS** - utility-first стилизация
- **React Hook Form** + **Zod** - формы и валидация
- **TanStack Query** - управление серверным состоянием
- **Zustand** - легковесное state management для клиента

---

## 2. АРХИТЕКТУРА ПРИЛОЖЕНИЯ

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Campaigns  │  │    Leads    │  │  Outreach   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │    Inbox    │  │ Instagram   │  │ AI Settings │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend (NestJS)                        │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Controllers (REST API)                   │  │
│  │  /campaigns  /leads  /sequences  /outreach  /inbox   │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Services (Business Logic)           │  │
│  │  CampaignService  LeadService  OutreachService       │  │
│  │  InstagramService  AIService  QueueService           │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Repositories (Data Access)               │  │
│  │                   Prisma ORM                          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Infrastructure                            │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PostgreSQL  │  │    Redis     │  │   BullMQ     │     │
│  │   (Data)     │  │  (Cache +    │  │  (Queues)    │     │
│  │              │  │   Session)   │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. МОДУЛЬНАЯ СТРУКТУРА BACKEND

### Основные модули NestJS:

1. **CampaignsModule**
   - CampaignsController
   - CampaignsService
   - Campaign entity/repository

2. **LeadsModule**
   - LeadsController
   - LeadsService
   - Lead entity/repository
   - CSV Import logic

3. **SequencesModule**
   - SequencesController
   - SequencesService
   - Sequence, SequenceStep entities

4. **OutreachModule**
   - OutreachController
   - OutreachService
   - MessageJob entity
   - Queue processing logic

5. **ConversationsModule**
   - ConversationsController
   - ConversationsService
   - ConversationLog entity

6. **InstagramModule**
   - InstagramController
   - InstagramService
   - Instagram API wrapper (unofficial)
   - Import/Send logic

7. **AIModule**
   - AIController
   - AIService
   - OpenAI/Anthropic integration

8. **QueueModule**
   - BullMQ configuration
   - Processors
   - Rate limiting

---

## 4. БЕЗОПАСНОСТЬ И КОНФИГУРАЦИЯ

### Environment Variables (.env):

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

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 5. NEXT STEPS

Далее я создам:

1. **Детальную схему БД** с Prisma schema
2. **Backend структуру** с NestJS модулями
3. **Frontend структуру** с Next.js страницами
4. **Полную реализацию** всех компонентов

Готовы начать? 🚀
