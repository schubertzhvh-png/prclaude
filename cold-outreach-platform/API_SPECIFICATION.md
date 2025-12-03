# REST API Specification

Base URL: `http://localhost:3001/api`

## Authentication

MVP: Single-user, без authentication
Future: JWT tokens в header `Authorization: Bearer <token>`

---

## 1. CAMPAIGNS

### GET /campaigns
Получить список кампаний

**Query параметры:**
- `platform` (optional): `instagram`
- `status` (optional): `draft` | `active` | `paused` | `completed`
- `limit` (optional): number, default 100
- `offset` (optional): number, default 0

**Response 200:**
```json
{
  "campaigns": [
    {
      "id": "uuid",
      "name": "Q1 Instagram Outreach",
      "description": "...",
      "platform": "instagram",
      "niche": "SaaS founders",
      "offer": "Free consultation",
      "aiContext": "...",
      "status": "active",
      "leadStats": {
        "total": 150,
        "new": 50,
        "messaged": 80,
        "replied": 15,
        "booked": 5
      },
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "total": 1
}
```

### GET /campaigns/:id
Получить одну кампанию

**Response 200:**
```json
{
  "id": "uuid",
  "name": "Q1 Instagram Outreach",
  ...
  "sequence": {
    "id": "uuid",
    "name": "3-Step Outreach",
    "steps": [...]
  },
  "leadStats": {...}
}
```

### POST /campaigns
Создать кампанию

**Request body:**
```json
{
  "name": "Q1 Instagram Outreach",
  "description": "Targeting SaaS founders",
  "platform": "instagram",
  "niche": "SaaS founders",
  "offer": "Free 30-min consultation",
  "aiContext": "We help SaaS founders scale to 7 figures...",
  "status": "draft"
}
```

**Response 201:**
```json
{
  "id": "uuid",
  "name": "Q1 Instagram Outreach",
  ...
}
```

### PUT /campaigns/:id
Обновить кампанию

**Request body:** Same as POST

**Response 200:** Updated campaign

### DELETE /campaigns/:id
Удалить кампанию

**Response 204:** No content

---

## 2. LEADS

### GET /leads
Получить список лидов

**Query параметры:**
- `campaignId` (optional): uuid
- `status` (optional): `new` | `messaged` | `replied` | `booked` | `lost`
- `platform` (optional): `instagram`
- `source` (optional): `followers` | `likes` | `comments` | `manual` | `import`
- `search` (optional): поиск по username/name
- `limit`, `offset`

**Response 200:**
```json
{
  "leads": [
    {
      "id": "uuid",
      "campaignId": "uuid",
      "username": "johndoe",
      "platform": "instagram",
      "name": "John Doe",
      "niche": "Marketing",
      "note": "Interested in automation",
      "source": "followers",
      "status": "new",
      "currentStepIndex": 0,
      "lastMessage": null,
      "lastInteractionAt": null,
      "createdAt": "2025-01-01T00:00:00Z",
      "campaign": {
        "id": "uuid",
        "name": "Q1 Instagram"
      }
    }
  ],
  "total": 150
}
```

### GET /leads/:id
Получить одного лида

**Response 200:**
```json
{
  "id": "uuid",
  ...
  "campaign": {...},
  "conversationLogs": [
    {
      "id": "uuid",
      "direction": "outbound",
      "messageSnippet": "Hey John! Saw your profile...",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ],
  "messageJobs": [...]
}
```

### POST /leads
Создать одного лида

**Request body:**
```json
{
  "campaignId": "uuid",
  "username": "johndoe",
  "platform": "instagram",
  "name": "John Doe",
  "niche": "Marketing",
  "note": "Found via @competitor's followers",
  "source": "followers"
}
```

**Response 201:** Created lead

### POST /leads/import
Массовый импорт лидов

**Request body:**
```json
{
  "campaignId": "uuid",
  "leads": [
    {
      "username": "user1",
      "name": "User One",
      "niche": "SaaS",
      "source": "import"
    },
    ...
  ]
}
```

**Response 201:**
```json
{
  "imported": 100,
  "skipped": 5,
  "errors": []
}
```

### PUT /leads/:id
Обновить лида

**Request body:** Same as POST (partial updates allowed)

**Response 200:** Updated lead

### PATCH /leads/:id/status
Быстрое обновление статуса

**Request body:**
```json
{
  "status": "replied",
  "currentStepIndex": 1,
  "lastMessage": "Said he's interested, booked a call"
}
```

**Response 200:** Updated lead

### DELETE /leads/:id
Удалить лида

**Response 204:** No content

---

## 3. SEQUENCES

### GET /campaigns/:campaignId/sequence
Получить секвенцию кампании

**Response 200:**
```json
{
  "id": "uuid",
  "campaignId": "uuid",
  "name": "3-Step Outreach",
  "description": "Initial DM + 2 follow-ups",
  "steps": [
    {
      "id": "uuid",
      "stepIndex": 0,
      "title": "Initial DM",
      "messageTemplate": "Hey {{name}}! Noticed you're in {{niche}}...",
      "delayDays": 0
    },
    {
      "id": "uuid",
      "stepIndex": 1,
      "title": "Follow-up 1",
      "messageTemplate": "Hey {{name}}, just following up...",
      "delayDays": 2
    }
  ]
}
```

### POST /campaigns/:campaignId/sequence
Создать секвенцию

**Request body:**
```json
{
  "name": "3-Step Outreach",
  "description": "...",
  "steps": [
    {
      "stepIndex": 0,
      "title": "Initial DM",
      "messageTemplate": "Hey {{name}}!...",
      "delayDays": 0
    }
  ]
}
```

**Response 201:** Created sequence

### PUT /sequences/:id
Обновить секвенцию

**Request body:** Same as POST

**Response 200:** Updated sequence

### DELETE /sequences/:id
Удалить секвенцию

**Response 204:** No content

---

## 4. SEQUENCE STEPS

### POST /sequences/:sequenceId/steps
Добавить шаг

**Request body:**
```json
{
  "stepIndex": 2,
  "title": "Final follow-up",
  "messageTemplate": "Last time reaching out...",
  "delayDays": 3
}
```

**Response 201:** Created step

### PUT /sequence-steps/:id
Обновить шаг

**Response 200:** Updated step

### DELETE /sequence-steps/:id
Удалить шаг

**Response 204:** No content

---

## 5. OUTREACH

### GET /outreach/queue
Получить очередь лидов для outreach

**Query параметры:**
- `campaignId` (required): uuid
- `stepIndex` (required): number
- `limit` (optional): number, default 50

**Response 200:**
```json
{
  "leads": [
    {
      "id": "uuid",
      "username": "johndoe",
      "name": "John Doe",
      "niche": "Marketing",
      "currentStepIndex": 0,
      "generatedMessage": "Hey John! Noticed you're in Marketing and thought you'd be interested in...",
      "campaign": {...},
      "sequenceStep": {
        "title": "Initial DM",
        "delayDays": 0
      }
    }
  ],
  "total": 25
}
```

### POST /outreach/message-jobs
Создать задачи отправки

**Request body:**
```json
{
  "campaignId": "uuid",
  "leadIds": ["uuid1", "uuid2"],
  "stepIndex": 0,
  "channel": "instagram_auto",
  "plannedAt": "2025-01-01T10:00:00Z"
}
```

**Response 201:**
```json
{
  "created": [
    {
      "id": "uuid",
      "leadId": "uuid1",
      "messageText": "...",
      "plannedAt": "2025-01-01T10:00:00Z",
      "status": "pending"
    }
  ]
}
```

### PATCH /outreach/message-jobs/:id/mark-sent
Пометить как отправлено (manual mode)

**Request body:**
```json
{
  "sentAt": "2025-01-01T10:05:00Z"
}
```

**Response 200:** Updated message job

### GET /outreach/message-jobs
Получить список задач

**Query параметры:**
- `status`: `pending` | `sent` | `failed` | `cancelled`
- `campaignId`: uuid
- `channel`: `manual` | `instagram_auto` | `x_auto`
- `limit`, `offset`

**Response 200:**
```json
{
  "jobs": [...],
  "total": 50
}
```

---

## 6. CONVERSATIONS

### GET /conversations
Получить все разговоры (Inbox)

**Query параметры:**
- `campaignId`: uuid
- `status`: lead status
- `platform`: platform
- `limit`, `offset`

**Response 200:**
```json
{
  "leads": [
    {
      "id": "uuid",
      "username": "johndoe",
      "name": "John Doe",
      "status": "replied",
      "lastMessage": "Interested, let's schedule",
      "lastInteractionAt": "2025-01-01T15:30:00Z",
      "campaign": {...},
      "conversationCount": 5
    }
  ],
  "total": 15
}
```

### GET /conversations/:leadId
Получить историю одного лида

**Response 200:**
```json
{
  "lead": {...},
  "logs": [
    {
      "id": "uuid",
      "direction": "outbound",
      "messageSnippet": "Hey John!...",
      "metadata": null,
      "createdAt": "2025-01-01T10:00:00Z"
    },
    {
      "id": "uuid",
      "direction": "inbound",
      "messageSnippet": "Hi! Yes, interested...",
      "metadata": null,
      "createdAt": "2025-01-01T15:30:00Z"
    }
  ]
}
```

### POST /conversations
Добавить запись в историю

**Request body:**
```json
{
  "leadId": "uuid",
  "direction": "inbound",
  "messageSnippet": "Yes, let's schedule a call",
  "metadata": {
    "screenshotUrl": "..."
  }
}
```

**Response 201:** Created log

---

## 7. INSTAGRAM INTEGRATION

### GET /instagram/account
Получить настройки Instagram аккаунта

**Response 200:**
```json
{
  "id": "uuid",
  "isActive": true,
  "username": "myaccount",
  "lastUsedAt": "2025-01-01T00:00:00Z",
  "dailyDmSent": 15,
  "dailyDmResetAt": "2025-01-01T00:00:00Z"
}
```

### POST /instagram/account
Сохранить/обновить credentials

**Request body:**
```json
{
  "username": "myaccount",
  "sessionCookie": "sessionid=...",
  "isActive": true
}
```

**Response 200:** Updated account

### POST /instagram/import/followers
Импорт подписчиков

**Request body:**
```json
{
  "targetUsername": "competitor",
  "campaignId": "uuid",
  "filters": {
    "minFollowers": 100,
    "maxFollowers": 10000
  }
}
```

**Response 202:** Accepted (async job started)
```json
{
  "jobId": "uuid",
  "status": "processing"
}
```

### POST /instagram/import/likers
Импорт лайкеров поста

**Request body:**
```json
{
  "postUrl": "https://instagram.com/p/...",
  "campaignId": "uuid"
}
```

**Response 202:** Accepted

### POST /instagram/import/commenters
Импорт комментаторов

**Request body:** Same as likers

**Response 202:** Accepted

### POST /instagram/send-dm
Отправить одно DM

**Request body:**
```json
{
  "leadId": "uuid",
  "messageText": "Hey John!..."
}
```

**Response 200:**
```json
{
  "success": true,
  "sentAt": "2025-01-01T10:00:00Z"
}
```

### POST /instagram/send-dm-batch
Массовая отправка (создаёт MessageJob)

**Request body:**
```json
{
  "tasks": [
    {
      "leadId": "uuid1",
      "messageText": "..."
    }
  ],
  "campaignId": "uuid",
  "stepIndex": 0
}
```

**Response 201:**
```json
{
  "jobIds": ["uuid1", "uuid2"],
  "status": "queued"
}
```

---

## 8. AI

### POST /ai/improve-message
Улучшить сообщение через AI

**Request body:**
```json
{
  "baseMessage": "Hey {{name}}!...",
  "lead": {
    "name": "John Doe",
    "username": "johndoe",
    "niche": "Marketing"
  },
  "campaignAiContext": "We help marketers automate outreach..."
}
```

**Response 200:**
```json
{
  "improvedMessage": "Hi John! I noticed your marketing work and thought you'd find value in...",
  "suggestions": [
    "Make it more personal",
    "Add specific reference to their niche"
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "username",
      "message": "Username is required"
    }
  ]
}
```

Common status codes:
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `409` - Conflict (e.g. duplicate lead)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

---

## Rate Limiting

Instagram endpoints:
- `/instagram/send-dm`: 20 requests/hour
- `/instagram/send-dm-batch`: 5 requests/hour
- `/instagram/import/*`: 10 requests/hour

Headers:
```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1704110400
```

---

Далее создам начальную структуру backend проекта! 🚀
