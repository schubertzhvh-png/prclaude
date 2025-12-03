# Database Schema - PostgreSQL

## Полное описание всех таблиц

### 1. User (на будущее для мультиюзерки)

```sql
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_email ON "User"(email);
```

**Поля:**
- `id` - UUID, первичный ключ
- `email` - Email пользователя (nullable для MVP)
- `password_hash` - Хэш пароля (nullable для MVP)
- `name` - Имя пользователя
- `created_at` - Дата создания
- `updated_at` - Дата последнего обновления

---

### 2. Campaign

```sql
CREATE TYPE platform_enum AS ENUM ('instagram');
CREATE TYPE campaign_status_enum AS ENUM ('draft', 'active', 'paused', 'completed');

CREATE TABLE "Campaign" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  platform platform_enum NOT NULL,
  niche VARCHAR(255),
  offer TEXT,
  ai_context TEXT,
  status campaign_status_enum DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_campaign_user_id ON "Campaign"(user_id);
CREATE INDEX idx_campaign_platform ON "Campaign"(platform);
CREATE INDEX idx_campaign_status ON "Campaign"(status);
CREATE INDEX idx_campaign_created_at ON "Campaign"(created_at DESC);
```

**Поля:**
- `id` - UUID, первичный ключ
- `user_id` - FK к User (nullable на MVP)
- `name` - Название кампании
- `description` - Описание
- `platform` - Платформа (только instagram)
- `niche` - Ниша (для контекста)
- `offer` - Описание оффера
- `ai_context` - Контекст для AI генерации
- `status` - Статус (draft | active | paused | completed)
- `created_at` / `updated_at` - Временные метки

---

### 3. Lead

```sql
CREATE TYPE lead_status_enum AS ENUM ('new', 'messaged', 'replied', 'booked', 'lost');
CREATE TYPE lead_source_enum AS ENUM ('followers', 'following', 'likes', 'comments', 'manual', 'import', 'other');

CREATE TABLE "Lead" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES "Campaign"(id) ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  platform platform_enum NOT NULL,
  name VARCHAR(255),
  niche VARCHAR(255),
  note TEXT,
  source lead_source_enum DEFAULT 'manual',
  status lead_status_enum DEFAULT 'new',
  current_step_index INTEGER DEFAULT 0,
  last_message TEXT,
  last_interaction_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(campaign_id, username, platform)
);

CREATE INDEX idx_lead_campaign_id ON "Lead"(campaign_id);
CREATE INDEX idx_lead_status ON "Lead"(status);
CREATE INDEX idx_lead_platform ON "Lead"(platform);
CREATE INDEX idx_lead_source ON "Lead"(source);
CREATE INDEX idx_lead_current_step ON "Lead"(current_step_index);
CREATE INDEX idx_lead_username ON "Lead"(username);
CREATE INDEX idx_lead_last_interaction ON "Lead"(last_interaction_at DESC);
```

**Поля:**
- `id` - UUID, первичный ключ
- `campaign_id` - FK к Campaign
- `username` - Username в соцсети
- `platform` - Платформа
- `name` - Имя лида
- `niche` - Ниша лида
- `note` - Заметки
- `source` - Источник (followers | likes | comments | manual | import | other)
- `status` - Статус (new | messaged | replied | booked | lost)
- `current_step_index` - Текущий шаг в секвенции (0-based)
- `last_message` - Последнее сообщение/заметка
- `last_interaction_at` - Дата последнего взаимодействия
- `created_at` / `updated_at` - Временные метки

**Уникальность:** Один username не может быть дважды в одной кампании на одной платформе

---

### 4. Sequence

```sql
CREATE TABLE "Sequence" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES "Campaign"(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(campaign_id)
);

CREATE INDEX idx_sequence_campaign_id ON "Sequence"(campaign_id);
```

**Поля:**
- `id` - UUID, первичный ключ
- `campaign_id` - FK к Campaign (одна секвенция на кампанию)
- `name` - Название секвенции
- `description` - Описание
- `created_at` / `updated_at` - Временные метки

**Связь:** Одна кампания - одна секвенция (1:1)

---

### 5. SequenceStep

```sql
CREATE TABLE "SequenceStep" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sequence_id UUID NOT NULL REFERENCES "Sequence"(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  message_template TEXT NOT NULL,
  delay_days INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(sequence_id, step_index)
);

CREATE INDEX idx_sequence_step_sequence_id ON "SequenceStep"(sequence_id);
CREATE INDEX idx_sequence_step_index ON "SequenceStep"(step_index);
```

**Поля:**
- `id` - UUID, первичный ключ
- `sequence_id` - FK к Sequence
- `step_index` - Порядковый номер шага (0, 1, 2, ...)
- `title` - Название шага (напр. "Первый DM", "Follow-up 1")
- `message_template` - Шаблон сообщения с плейсхолдерами
- `delay_days` - Задержка в днях после предыдущего шага
- `created_at` / `updated_at` - Временные метки

**Уникальность:** step_index уникален в рамках одной секвенции

---

### 6. MessageJob (Очередь отправки)

```sql
CREATE TYPE message_job_status_enum AS ENUM ('pending', 'sent', 'failed', 'cancelled');
CREATE TYPE message_channel_enum AS ENUM ('manual', 'instagram_auto');

CREATE TABLE "MessageJob" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES "Lead"(id) ON DELETE CASCADE,
  campaign_id UUID NOT NULL REFERENCES "Campaign"(id) ON DELETE CASCADE,
  step_index INTEGER NOT NULL,
  message_text TEXT NOT NULL,
  planned_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  status message_job_status_enum DEFAULT 'pending',
  error_message TEXT,
  channel message_channel_enum DEFAULT 'manual',
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_message_job_lead_id ON "MessageJob"(lead_id);
CREATE INDEX idx_message_job_campaign_id ON "MessageJob"(campaign_id);
CREATE INDEX idx_message_job_status ON "MessageJob"(status);
CREATE INDEX idx_message_job_planned_at ON "MessageJob"(planned_at);
CREATE INDEX idx_message_job_channel ON "MessageJob"(channel);
CREATE INDEX idx_message_job_step_index ON "MessageJob"(step_index);
```

**Поля:**
- `id` - UUID, первичный ключ
- `lead_id` - FK к Lead
- `campaign_id` - FK к Campaign
- `step_index` - Номер шага секвенции
- `message_text` - Готовый текст сообщения (после подстановки плейсхолдеров)
- `planned_at` - Запланированное время отправки
- `sent_at` - Фактическое время отправки
- `status` - Статус (pending | sent | failed | cancelled)
- `error_message` - Сообщение об ошибке (если failed)
- `channel` - Канал (manual | instagram_auto)
- `retry_count` - Количество попыток повтора
- `created_at` / `updated_at` - Временные метки

---

### 7. ConversationLog (История диалогов)

```sql
CREATE TYPE conversation_direction_enum AS ENUM ('outbound', 'inbound');

CREATE TABLE "ConversationLog" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES "Lead"(id) ON DELETE CASCADE,
  direction conversation_direction_enum NOT NULL,
  message_snippet TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversation_log_lead_id ON "ConversationLog"(lead_id);
CREATE INDEX idx_conversation_log_created_at ON "ConversationLog"(created_at DESC);
CREATE INDEX idx_conversation_log_direction ON "ConversationLog"(direction);
```

**Поля:**
- `id` - UUID, первичный ключ
- `lead_id` - FK к Lead
- `direction` - Направление (outbound | inbound)
- `message_snippet` - Текст сообщения или его часть
- `metadata` - Дополнительные данные в JSON (напр. screenshot URL, timestamp)
- `created_at` - Дата создания

---

### 8. InstagramAccount (Интеграция)

```sql
CREATE TABLE "InstagramAccount" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES "User"(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  username VARCHAR(255) NOT NULL,
  session_cookie_encrypted TEXT,
  session_data_encrypted TEXT,
  last_used_at TIMESTAMP,
  daily_dm_sent INTEGER DEFAULT 0,
  daily_dm_reset_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_instagram_account_user_id ON "InstagramAccount"(user_id);
CREATE INDEX idx_instagram_account_is_active ON "InstagramAccount"(is_active);
```

**Поля:**
- `id` - UUID, первичный ключ
- `user_id` - FK к User (nullable на MVP)
- `is_active` - Активна ли интеграция
- `username` - Instagram username
- `session_cookie_encrypted` - Зашифрованная сессия
- `session_data_encrypted` - Дополнительные данные сессии (JSON, зашифровано)
- `last_used_at` - Последнее использование
- `daily_dm_sent` - Количество DM отправленных сегодня
- `daily_dm_reset_at` - Время сброса дневного счетчика
- `created_at` / `updated_at` - Временные метки

---

### 9. InstagramImportedSource (Лог импортов)

```sql
CREATE TYPE instagram_import_type_enum AS ENUM ('followers', 'following', 'likers', 'commenters');

CREATE TABLE "InstagramImportedSource" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES "Campaign"(id) ON DELETE CASCADE,
  ig_type instagram_import_type_enum NOT NULL,
  ig_target VARCHAR(500) NOT NULL,
  leads_imported INTEGER DEFAULT 0,
  imported_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_instagram_imported_campaign_id ON "InstagramImportedSource"(campaign_id);
CREATE INDEX idx_instagram_imported_type ON "InstagramImportedSource"(ig_type);
CREATE INDEX idx_instagram_imported_at ON "InstagramImportedSource"(imported_at DESC);
```

**Поля:**
- `id` - UUID, первичный ключ
- `campaign_id` - FK к Campaign
- `ig_type` - Тип импорта (followers | following | likers | commenters)
- `ig_target` - Цель импорта (@username или URL поста)
- `leads_imported` - Количество импортированных лидов
- `imported_at` - Дата импорта

---

## Диаграмма связей (ER Diagram в текстовом виде)

```
User (1) ───┬──< (N) Campaign
            │
            └──< (1) InstagramAccount

Campaign (1) ───┬──< (N) Lead
                ├──< (1) Sequence
                ├──< (N) MessageJob
                └──< (N) InstagramImportedSource

Sequence (1) ───< (N) SequenceStep

Lead (1) ───┬──< (N) MessageJob
            └──< (N) ConversationLog
```

---

## Индексы для производительности

### Составные индексы:

```sql
-- Для фильтрации лидов в Outreach
CREATE INDEX idx_lead_campaign_status_step ON "Lead"(campaign_id, status, current_step_index);

-- Для очереди сообщений
CREATE INDEX idx_message_job_status_planned ON "MessageJob"(status, planned_at) WHERE status = 'pending';

-- Для поиска по кампании и платформе
CREATE INDEX idx_lead_campaign_platform ON "Lead"(campaign_id, platform);
```

---

## Плейсхолдеры для message_template

В `SequenceStep.message_template` поддерживаются:

- `{{name}}` - Lead.name
- `{{username}}` - Lead.username
- `{{niche}}` - Lead.niche
- `{{note}}` - Lead.note
- `{{offer}}` - Campaign.offer
- `{{campaignName}}` - Campaign.name

Пример:
```
Привет {{name}}! Заметил что ты в нише {{niche}}.
У меня есть {{offer}}. Интересно?
```

---

## Constraints и правила

1. **Lead.current_step_index** должен быть >= 0
2. **SequenceStep.delay_days** должен быть >= 0
3. **MessageJob.retry_count** должен быть >= 0
4. **InstagramAccount.daily_dm_sent** должен быть >= 0
5. **Campaign.name** не может быть пустым
6. **Lead.username** не может быть пустым

---

## Политики безопасности (для будущей мультиюзерки)

Row Level Security (RLS) для PostgreSQL:

```sql
-- Пример для Campaign
ALTER TABLE "Campaign" ENABLE ROW LEVEL SECURITY;

CREATE POLICY campaign_user_policy ON "Campaign"
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::UUID);
```

На MVP это не требуется (single user), но архитектура готова.

---

Далее создам Prisma schema файл с этой структурой! 🚀
