# План создания аналога ColdDMS

## Обзор проекта

Создание инструмента автоматизации холодных сообщений для Instagram и Twitter/X с функциями поиска лидов, автоматической рассылки и управления кампаниями.

---

## Архитектура приложения

### 1. Chrome Extension (Расширение браузера)
**Цель**: Автоматизация действий в социальных сетях, имитация человеческого поведения

**Компоненты**:
- Content Script - взаимодействие со страницами соц. сетей
- Background Service Worker - фоновая логика
- Popup UI - интерфейс управления
- Options Page - настройки расширения

**Технологии**:
```
- Manifest V3
- JavaScript/TypeScript
- Playwright или Puppeteer для автоматизации
- Chrome Storage API
- Chrome Messaging API
```

### 2. Web Dashboard (Веб-приложение)
**Цель**: Управление кампаниями, аналитика, CRM

**Компоненты**:
- Campaign Manager - создание и управление кампаниями
- Lead Database - хранение и фильтрация лидов
- Unified Inbox - централизованные сообщения
- Analytics Dashboard - метрики и статистика
- Team Management - управление командой

**Технологии**:
```
Frontend:
- React или Next.js
- TypeScript
- Tailwind CSS или Material-UI
- React Query для управления состоянием
- Recharts или Chart.js для графиков

Backend:
- Node.js + Express или Fastify
- TypeScript
- PostgreSQL для основной БД
- Redis для кэширования и очередей
- Prisma ORM
```

### 3. API Backend (Серверная часть)
**Цель**: Бизнес-логика, интеграции, хранение данных

**Основные модули**:

#### Auth & User Management
```typescript
- JWT аутентификация
- Управление пользователями и ролями
- Подписки и биллинг (Stripe)
```

#### Lead Management
```typescript
- Парсинг лидов из соц. сетей
- Фильтрация и сегментация
- Импорт/экспорт списков
- Дедупликация
```

#### Campaign Management
```typescript
- Создание кампаний
- Управление последовательностями сообщений
- Планирование отправки
- Трекинг статусов
```

#### Message Queue System
```typescript
- Bull или BullMQ (Redis-based queue)
- Job scheduling
- Rate limiting
- Retry logic
```

#### Analytics & Reporting
```typescript
- Сбор метрик
- Генерация отчетов
- A/B тестирование
```

### 4. AI Integration (AI модуль)
**Цель**: Генерация и оптимизация сообщений

**Функции**:
- Генерация персонализированных сообщений
- Анализ ответов
- Sentiment analysis
- Авто-ответы

**Технологии**:
```
- OpenAI API (GPT-4)
- LangChain для workflow
- Vector DB (Pinecone/Weaviate) для контекста
```

---

## База данных - Схема

### Таблицы:

```sql
-- Пользователи
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  subscription_tier VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Социальные аккаунты
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  platform VARCHAR(50), -- 'instagram', 'twitter'
  username VARCHAR(255),
  account_data JSONB,
  status VARCHAR(50),
  created_at TIMESTAMP
);

-- Лиды
CREATE TABLE leads (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  platform VARCHAR(50),
  username VARCHAR(255),
  full_name VARCHAR(255),
  bio TEXT,
  followers_count INTEGER,
  following_count INTEGER,
  profile_url TEXT,
  metadata JSONB,
  tags TEXT[],
  created_at TIMESTAMP
);

-- Кампании
CREATE TABLE campaigns (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  social_account_id UUID REFERENCES social_accounts(id),
  name VARCHAR(255),
  status VARCHAR(50), -- 'draft', 'active', 'paused', 'completed'
  settings JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Сообщения в кампании
CREATE TABLE campaign_messages (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  step_number INTEGER,
  message_template TEXT,
  delay_hours INTEGER,
  created_at TIMESTAMP
);

-- Отправленные сообщения
CREATE TABLE sent_messages (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  lead_id UUID REFERENCES leads(id),
  message_text TEXT,
  sent_at TIMESTAMP,
  status VARCHAR(50), -- 'sent', 'delivered', 'read', 'replied', 'failed'
  response_text TEXT,
  response_at TIMESTAMP
);

-- Аналитика
CREATE TABLE campaign_analytics (
  id UUID PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id),
  date DATE,
  messages_sent INTEGER,
  messages_delivered INTEGER,
  messages_read INTEGER,
  replies_received INTEGER,
  conversions INTEGER
);
```

---

## Основные функции и их реализация

### 1. Lead Scraping (Парсинг лидов)

#### Методы сбора:
1. **Из подписчиков аккаунта**
   ```typescript
   async function scrapeFollowers(username: string, filters: Filters) {
     // 1. Открыть профиль
     // 2. Кликнуть на "Followers"
     // 3. Скроллить и собирать данные
     // 4. Применить фильтры
     // 5. Сохранить в БД
   }
   ```

2. **Из хештегов**
   ```typescript
   async function scrapeHashtag(hashtag: string) {
     // 1. Поиск по хештегу
     // 2. Собрать посты
     // 3. Извлечь авторов и лайкеров
     // 4. Сохранить уникальные профили
   }
   ```

3. **Из комментариев**
   ```typescript
   async function scrapeComments(postUrl: string) {
     // 1. Открыть пост
     // 2. Загрузить комментарии
     // 3. Извлечь username и профили
     // 4. Фильтровать и сохранить
   }
   ```

#### Важно:
- Rate limiting (лимиты запросов)
- Имитация человеческого поведения (случайные задержки)
- Защита от бана (warmup период)

### 2. Automated Messaging (Автоматическая отправка)

```typescript
interface MessageSequence {
  step: number;
  template: string;
  delayHours: number;
  variables: string[];
}

async function sendCampaignMessage(
  lead: Lead,
  message: MessageSequence,
  campaign: Campaign
) {
  // 1. Персонализировать сообщение
  const personalizedText = personalize(message.template, lead);

  // 2. Проверить лимиты
  if (!canSendMessage(campaign)) {
    await scheduleForLater(lead, message);
    return;
  }

  // 3. Отправить сообщение
  await sendDM(lead.username, personalizedText);

  // 4. Записать в БД
  await logMessage(lead, personalizedText);

  // 5. Запланировать следующий шаг
  if (message.step < campaign.sequence.length) {
    await scheduleNextMessage(lead, campaign, message.step + 1);
  }
}
```

### 3. Персонализация сообщений

```typescript
function personalize(template: string, lead: Lead): string {
  return template
    .replace('{firstName}', lead.firstName)
    .replace('{username}', lead.username)
    .replace('{bio}', lead.bio)
    .replace('{customField}', lead.metadata.customField);
}

// AI-генерация
async function generateMessage(lead: Lead, context: string): Promise<string> {
  const prompt = `
    Создай персонализированное холодное сообщение для:
    Имя: ${lead.fullName}
    Bio: ${lead.bio}
    Контекст: ${context}

    Требования: короткое, дружелюбное, с призывом к действию
  `;

  return await callOpenAI(prompt);
}
```

### 4. Rate Limiting & Safety

```typescript
class RateLimiter {
  private limits = {
    instagram: {
      messagesPerHour: 20,
      messagesPerDay: 100,
      followsPerHour: 30
    }
  };

  async canSend(userId: string, platform: string): Promise<boolean> {
    const sent = await redis.get(`user:${userId}:${platform}:hourly`);
    return parseInt(sent || '0') < this.limits[platform].messagesPerHour;
  }

  async recordSend(userId: string, platform: string) {
    await redis.incr(`user:${userId}:${platform}:hourly`);
    await redis.expire(`user:${userId}:${platform}:hourly`, 3600);
  }
}
```

### 5. Response Detection (Обнаружение ответов)

```typescript
async function checkForReplies(campaign: Campaign) {
  // 1. Получить список отправленных сообщений без ответа
  const pendingMessages = await getPendingMessages(campaign.id);

  for (const msg of pendingMessages) {
    // 2. Проверить DM inbox
    const reply = await checkDMInbox(msg.leadUsername);

    if (reply) {
      // 3. Сохранить ответ
      await saveReply(msg.id, reply);

      // 4. Остановить последовательность для этого лида
      await stopSequence(msg.leadId, campaign.id);

      // 5. Уведомить пользователя
      await notifyUser(campaign.userId, reply);
    }
  }
}
```

### 6. Analytics & Reporting

```typescript
interface CampaignMetrics {
  sent: number;
  delivered: number;
  read: number;
  replied: number;
  conversionRate: number;
  avgResponseTime: number;
}

async function calculateMetrics(campaignId: string): Promise<CampaignMetrics> {
  const messages = await db.sentMessages.findMany({
    where: { campaignId }
  });

  return {
    sent: messages.length,
    delivered: messages.filter(m => m.status !== 'failed').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.responseText).length,
    conversionRate: calculateConversionRate(messages),
    avgResponseTime: calculateAvgResponseTime(messages)
  };
}
```

---

## План разработки (поэтапно)

### Фаза 1: MVP - Базовый функционал (4-6 недель)

#### Неделя 1-2: Backend + Database
- [ ] Настроить проект (Node.js + Express + PostgreSQL)
- [ ] Создать схему БД (users, leads, campaigns, messages)
- [ ] Реализовать API для аутентификации (JWT)
- [ ] CRUD для кампаний и лидов

#### Неделя 3-4: Chrome Extension - Instagram
- [ ] Создать базовое расширение (Manifest V3)
- [ ] Реализовать scraper для подписчиков Instagram
- [ ] Автоматическая отправка DM в Instagram
- [ ] Rate limiting и имитация человека

#### Неделя 5-6: Web Dashboard
- [ ] Frontend на React
- [ ] Страница создания кампаний
- [ ] Список лидов с фильтрами
- [ ] Базовая аналитика

### Фаза 2: Расширенный функционал (4-6 недель)

#### Неделя 7-8: Advanced Lead Generation
- [ ] Scraping из хештегов
- [ ] Scraping из комментариев и лайков
- [ ] Импорт/экспорт CSV
- [ ] Дедупликация лидов
- [ ] Фильтры по метрикам (followers, engagement)

#### Неделя 9-10: Message Sequences & Automation
- [ ] Многошаговые последовательности
- [ ] Персонализация переменных
- [ ] Авто-остановка при ответе
- [ ] Scheduling и delays
- [ ] Message queue system (Bull)

#### Неделя 11-12: AI Integration
- [ ] OpenAI API интеграция
- [ ] AI-генерация сообщений
- [ ] AI-анализ ответов
- [ ] Рекомендации по улучшению

### Фаза 3: Масштабирование и Twitter/X (3-4 недели)

#### Неделя 13-14: Twitter/X Support
- [ ] Scraper для Twitter/X
- [ ] DM отправка в Twitter/X
- [ ] Unified inbox

#### Неделя 15-16: Team & CRM
- [ ] Управление командой
- [ ] Назначение лидов
- [ ] CRM функции
- [ ] Email уведомления

### Фаза 4: Продакшн (2-3 недели)

#### Неделя 17-18: Billing & Deployment
- [ ] Stripe интеграция
- [ ] Подписки и планы
- [ ] Docker контейнеризация
- [ ] Deploy на AWS/GCP
- [ ] Мониторинг и логирование

---

## Технологический стек (финальный)

### Frontend
```
- React 18 + TypeScript
- Next.js 14 (App Router)
- Tailwind CSS
- Shadcn/ui components
- React Query (TanStack Query)
- Zustand для state management
- Recharts для графиков
```

### Backend
```
- Node.js 20
- Express.js или Fastify
- TypeScript
- Prisma ORM
- PostgreSQL 15
- Redis для кэша и очередей
- Bull для job queue
```

### Chrome Extension
```
- Manifest V3
- TypeScript
- Playwright для автоматизации
- Webpack для сборки
```

### Infrastructure
```
- Docker
- AWS EC2 или Google Cloud Run
- AWS RDS или Supabase для PostgreSQL
- Redis Cloud или AWS ElastiCache
- Vercel для фронтенда
```

### AI & Services
```
- OpenAI API (GPT-4)
- Resend или SendGrid для email
- Stripe для платежей
- Sentry для error tracking
```

---

## Безопасность и соблюдение правил

### Важные ограничения:

1. **Instagram API Terms**
   - НЕ использовать неофициальные API
   - Соблюдать rate limits
   - Не парсить агрессивно

2. **Rate Limiting**
   - Максимум 20-30 DM в час
   - Максимум 100 DM в день
   - Случайные задержки между действиями

3. **Warmup Period**
   - Новые аккаунты начинают с 5-10 DM/день
   - Постепенное увеличение лимитов
   - Имитация естественного использования

4. **Privacy & GDPR**
   - Хранить только публичные данные
   - Возможность удаления данных
   - Privacy Policy и Terms of Service

---

## Оценка стоимости разработки

### Разработка:
- MVP (6 недель): 1 full-stack разработчик
- Полная версия (16-18 недель): 2-3 разработчика
- Стоимость: $30,000 - $80,000 (в зависимости от команды)

### Операционные расходы:
- Сервер: $50-200/месяц
- База данных: $25-100/месяц
- Redis: $15-50/месяц
- OpenAI API: $100-500/месяц
- Домен и SSL: $20/год
- **Итого**: ~$200-850/месяц

### Pricing для клиентов:
- Starter: $29/месяц (ограниченные функции)
- Pro: $79/месяц (все функции)
- Business: $199/месяц (команды + премиум)

---

## Альтернативный подход: No-Code/Low-Code

Если вы хотите быстрее начать без глубокой разработки:

### Вариант 1: Использовать существующие инструменты
```
- Phantombuster для scraping
- Zapier/Make для автоматизации
- Airtable для CRM
- Bubble для интерфейса
```

### Вариант 2: Купить готовый белый лейбл (white label)
- Некоторые компании продают готовые решения под вашим брендом
- Стоимость: $5,000-20,000

---

## Следующие шаги

1. **Определите минимальный функционал** - что действительно нужно в MVP?
2. **Выберите подход** - разработка с нуля или использование существующих инструментов?
3. **Соберите команду** - нужны frontend, backend, Chrome extension разработчики
4. **Создайте прототип** - начните с простого scraper + отправка DM
5. **Тестируйте на малых объемах** - чтобы не попасть под бан

Готов помочь с любым из этих этапов!
