# План упрощенной версии для личного использования

## Что будем делать

Простой инструмент только для вас с двумя основными функциями:
1. **Lead Generation** - поиск лидов в Instagram
2. **Automated Messaging** - автоматическая отправка сообщений

**НЕ нужно**:
- ❌ Сложный веб-дашборд
- ❌ Система биллинга
- ❌ Мультиаккаунты
- ❌ Команды и роли
- ❌ Twitter/X поддержка (пока)

**Нужно**:
- ✅ Chrome Extension для Instagram
- ✅ Локальное хранилище для лидов (SQLite)
- ✅ Простой popup UI
- ✅ Автоматизация сообщений
- ✅ AI генерация текстов

---

## Упрощенная архитектура

```
instagram-lead-gen/
├── extension/              # Chrome Extension
│   ├── manifest.json       # Конфигурация расширения
│   ├── popup/              # UI расширения
│   │   ├── popup.html
│   │   ├── popup.js
│   │   └── popup.css
│   ├── content/            # Скрипты для Instagram страниц
│   │   ├── scraper.js      # Парсинг лидов
│   │   └── messenger.js    # Отправка сообщений
│   ├── background/         # Фоновые процессы
│   │   └── service-worker.js
│   └── storage/            # Локальная БД
│       └── database.js     # SQLite wrapper
└── README.md
```

---

## Функциональность по приоритету

### 1. Lead Scraper (Парсер лидов)

#### Источники лидов:
- Подписчики аккаунта
- Подписки аккаунта
- Лайкеры поста
- Комментаторы поста
- Посты по хештегу

#### Что собираем:
```javascript
{
  username: "johndoe",
  fullName: "John Doe",
  bio: "Entrepreneur | Coffee lover",
  followers: 5000,
  following: 800,
  isPrivate: false,
  isVerified: false,
  profilePicUrl: "https://...",
  posts: 120,
  tags: ["entrepreneur", "scraped_from_followers"],
  scrapedAt: "2025-01-20T10:00:00Z"
}
```

#### Фильтры:
- Минимум подписчиков
- Максимум подписчиков
- Не приватные аккаунты
- Только с био
- По ключевым словам в био

### 2. Automated Messaging (Авто-сообщения)

#### Создание кампании:
```javascript
{
  name: "Outreach Campaign #1",
  targetLeads: ["user1", "user2", ...],
  messageSequence: [
    {
      step: 1,
      template: "Привет {firstName}! Увидел твой профиль...",
      delayAfterPrevious: 0
    },
    {
      step: 2,
      template: "Эй, ты не ответил, интересует ли тебя...",
      delayAfterPrevious: 48 // часов
    }
  ],
  settings: {
    messagesPerHour: 15,
    startTime: "09:00",
    endTime: "21:00",
    stopOnReply: true
  }
}
```

#### Персонализация:
- `{firstName}` - имя
- `{username}` - username
- `{bio}` - био пользователя

#### AI генерация:
```javascript
// Использовать OpenAI для создания сообщений
async function generateMessage(lead, context) {
  const prompt = `
    Создай короткое дружелюбное сообщение для Instagram DM.
    Человек: ${lead.fullName} (@${lead.username})
    Био: ${lead.bio}
    Контекст: ${context}
    Длина: до 200 символов
  `;

  return await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }]
  });
}
```

---

## Технологический стек (упрощенный)

### Chrome Extension
```
- Manifest V3
- Vanilla JavaScript (без фреймворков)
- Chrome Storage API (для простых данных)
- Better SQLite3 (для локальной БД)
```

### UI
```
- HTML + CSS + JavaScript
- Простой Bootstrap или Tailwind CDN
- Никаких build tools (или простой Vite)
```

### Автоматизация
```
- MutationObserver для отслеживания DOM
- Fetch API для запросов
- setInterval для планирования
```

### AI
```
- OpenAI API (только для генерации сообщений)
- Или локально: Ollama (бесплатно)
```

---

## План разработки (2-3 недели)

### Неделя 1: Парсинг лидов

**День 1-2: Настройка проекта**
- [x] Создать структуру проекта
- [ ] Настроить manifest.json
- [ ] Создать базовый popup UI
- [ ] Настроить локальное хранилище

**День 3-4: Scraper для подписчиков**
- [ ] Открытие списка подписчиков
- [ ] Парсинг данных профилей
- [ ] Сохранение в локальную БД
- [ ] Фильтрация по критериям

**День 5-7: Дополнительные источники**
- [ ] Scraper для лайков поста
- [ ] Scraper для комментариев
- [ ] Scraper по хештегам
- [ ] Экспорт в CSV

### Неделя 2: Автоматизация сообщений

**День 8-10: Базовая отправка**
- [ ] Функция открытия DM
- [ ] Отправка сообщения
- [ ] Персонализация переменных
- [ ] Rate limiting (15-20/час)

**День 11-12: Последовательности**
- [ ] Создание кампаний
- [ ] Многошаговые последовательности
- [ ] Планирование с задержками
- [ ] Трекинг статусов

**День 13-14: AI интеграция**
- [ ] OpenAI API интеграция
- [ ] Генерация сообщений
- [ ] Улучшение промптов

### Неделя 3: Доработка и тестирование

**День 15-17: Безопасность**
- [ ] Имитация человеческого поведения
- [ ] Случайные задержки
- [ ] Warmup режим
- [ ] Обработка ошибок

**День 18-21: UI и удобство**
- [ ] Улучшение интерфейса
- [ ] Статистика и метрики
- [ ] Логи активности
- [ ] Тестирование на малых объемах

---

## Минимальный UI (Popup расширения)

```html
<!DOCTYPE html>
<html>
<head>
  <title>Instagram Lead Gen</title>
  <style>
    body { width: 400px; padding: 20px; }
    .tab { display: none; }
    .tab.active { display: block; }
  </style>
</head>
<body>
  <!-- Табы -->
  <div class="tabs">
    <button onclick="showTab('scraper')">Scraper</button>
    <button onclick="showTab('leads')">Leads</button>
    <button onclick="showTab('campaigns')">Campaigns</button>
    <button onclick="showTab('settings')">Settings</button>
  </div>

  <!-- Tab 1: Scraper -->
  <div id="scraper" class="tab active">
    <h3>Scrape Leads</h3>

    <select id="scrapeType">
      <option value="followers">Followers</option>
      <option value="following">Following</option>
      <option value="post_likes">Post Likes</option>
      <option value="hashtag">Hashtag</option>
    </select>

    <input type="text" id="scrapeInput" placeholder="Username or URL">

    <h4>Filters</h4>
    <label>Min followers: <input type="number" id="minFollowers" value="100"></label>
    <label>Max followers: <input type="number" id="maxFollowers" value="10000"></label>
    <label><input type="checkbox" id="onlyPublic" checked> Only public accounts</label>

    <button onclick="startScraping()">Start Scraping</button>

    <div id="scrapeProgress"></div>
  </div>

  <!-- Tab 2: Leads -->
  <div id="leads" class="tab">
    <h3>Leads Database</h3>

    <input type="text" id="searchLeads" placeholder="Search...">

    <div id="leadsList">
      <!-- Динамически загружаем -->
    </div>

    <button onclick="exportCSV()">Export CSV</button>
  </div>

  <!-- Tab 3: Campaigns -->
  <div id="campaigns" class="tab">
    <h3>Message Campaigns</h3>

    <button onclick="createCampaign()">+ New Campaign</button>

    <div id="campaignsList">
      <!-- Список кампаний -->
    </div>
  </div>

  <!-- Tab 4: Settings -->
  <div id="settings" class="tab">
    <h3>Settings</h3>

    <label>Messages per hour: <input type="number" id="msgPerHour" value="15"></label>
    <label>Start time: <input type="time" id="startTime" value="09:00"></label>
    <label>End time: <input type="time" id="endTime" value="21:00"></label>

    <h4>OpenAI API</h4>
    <input type="text" id="openaiKey" placeholder="sk-...">

    <button onclick="saveSettings()">Save</button>
  </div>

  <script src="popup.js"></script>
</body>
</html>
```

---

## Примеры кода

### 1. Scraper для подписчиков

```javascript
// content/scraper.js

class InstagramScraper {
  async scrapeFollowers(username, filters) {
    const leads = [];

    // 1. Открываем профиль
    window.location.href = `https://www.instagram.com/${username}/`;
    await this.waitForLoad();

    // 2. Кликаем на "followers"
    const followersBtn = document.querySelector('a[href*="/followers/"]');
    followersBtn.click();
    await this.sleep(2000);

    // 3. Получаем модальное окно со списком
    const modal = document.querySelector('div[role="dialog"]');
    const scrollableDiv = modal.querySelector('div:nth-child(2)');

    // 4. Скроллим и собираем
    let previousHeight = 0;
    let noChangeCount = 0;

    while (noChangeCount < 3) {
      // Получаем все элементы списка
      const items = modal.querySelectorAll('a[href^="/"]');

      for (const item of items) {
        const username = item.getAttribute('href').replace('/', '').replace('/', '');

        if (!this.isScraped(username)) {
          const leadData = await this.scrapeProfile(username);

          // Применяем фильтры
          if (this.matchesFilters(leadData, filters)) {
            leads.push(leadData);
            await this.saveLead(leadData);
          }
        }
      }

      // Скроллим вниз
      scrollableDiv.scrollTop = scrollableDiv.scrollHeight;
      await this.sleep(1000 + Math.random() * 1000); // Случайная задержка

      // Проверяем, загрузились ли новые
      const currentHeight = scrollableDiv.scrollHeight;
      if (currentHeight === previousHeight) {
        noChangeCount++;
      } else {
        noChangeCount = 0;
      }
      previousHeight = currentHeight;
    }

    return leads;
  }

  async scrapeProfile(username) {
    // Собираем данные профиля без открытия (из превью в модалке)
    // Или открываем в новом табе
    const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
      headers: {
        'x-ig-app-id': '936619743392459' // Instagram app ID
      }
    });

    const data = await response.json();
    const user = data.data.user;

    return {
      username: user.username,
      fullName: user.full_name,
      bio: user.biography,
      followers: user.edge_followed_by.count,
      following: user.edge_follow.count,
      posts: user.edge_owner_to_timeline_media.count,
      isPrivate: user.is_private,
      isVerified: user.is_verified,
      profilePicUrl: user.profile_pic_url_hd,
      scrapedAt: new Date().toISOString()
    };
  }

  matchesFilters(lead, filters) {
    if (filters.minFollowers && lead.followers < filters.minFollowers) return false;
    if (filters.maxFollowers && lead.followers > filters.maxFollowers) return false;
    if (filters.onlyPublic && lead.isPrivate) return false;
    if (filters.keywords) {
      const bio = lead.bio.toLowerCase();
      const hasKeyword = filters.keywords.some(k => bio.includes(k.toLowerCase()));
      if (!hasKeyword) return false;
    }
    return true;
  }

  async saveLead(lead) {
    // Сохраняем в Chrome Storage или IndexedDB
    await chrome.storage.local.set({
      [`lead_${lead.username}`]: lead
    });
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  waitForLoad() {
    return new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });
  }
}
```

### 2. Automated Messenger

```javascript
// content/messenger.js

class InstagramMessenger {
  constructor() {
    this.messagesPerHour = 15;
    this.messageQueue = [];
    this.isRunning = false;
  }

  async startCampaign(campaign) {
    this.isRunning = true;

    // Загружаем лиды для кампании
    const leads = await this.getLeadsForCampaign(campaign);

    // Создаем очередь сообщений
    for (const lead of leads) {
      for (const message of campaign.messageSequence) {
        this.messageQueue.push({
          lead,
          message,
          scheduledFor: this.calculateScheduleTime(message)
        });
      }
    }

    // Запускаем обработку очереди
    this.processQueue();
  }

  async processQueue() {
    while (this.isRunning && this.messageQueue.length > 0) {
      const now = Date.now();

      // Находим сообщения, которые нужно отправить
      const toSend = this.messageQueue.filter(m => m.scheduledFor <= now);

      if (toSend.length > 0) {
        const item = toSend[0];

        // Проверяем rate limit
        if (await this.canSendMessage()) {
          await this.sendDM(item.lead, item.message);

          // Удаляем из очереди
          this.messageQueue = this.messageQueue.filter(m => m !== item);

          // Записываем отправку
          await this.recordSent(item);
        }
      }

      // Ждем перед следующей проверкой
      await this.sleep(60000); // Проверяем каждую минуту
    }
  }

  async sendDM(lead, message) {
    try {
      // 1. Открываем DM с пользователем
      window.location.href = `https://www.instagram.com/direct/t/${await this.getUserId(lead.username)}`;
      await this.sleep(2000 + Math.random() * 1000);

      // 2. Персонализируем сообщение
      const personalizedText = this.personalize(message.template, lead);

      // 3. Находим textarea
      const textarea = document.querySelector('textarea[placeholder*="Message"]');

      if (!textarea) {
        throw new Error('Message input not found');
      }

      // 4. Вводим текст (имитация печати)
      await this.typeText(textarea, personalizedText);

      // 5. Отправляем
      await this.sleep(500 + Math.random() * 500);
      const sendBtn = document.querySelector('button[type="submit"]');
      sendBtn.click();

      console.log(`✅ Sent message to ${lead.username}`);

      return true;
    } catch (error) {
      console.error(`❌ Failed to send to ${lead.username}:`, error);
      return false;
    }
  }

  async typeText(element, text) {
    // Имитируем человеческую печать
    for (const char of text) {
      element.value += char;
      element.dispatchEvent(new Event('input', { bubbles: true }));

      // Случайная задержка между символами (30-100мс)
      await this.sleep(30 + Math.random() * 70);
    }
  }

  personalize(template, lead) {
    const firstName = lead.fullName.split(' ')[0];

    return template
      .replace('{firstName}', firstName)
      .replace('{username}', lead.username)
      .replace('{fullName}', lead.fullName)
      .replace('{bio}', lead.bio);
  }

  async canSendMessage() {
    // Проверяем, не превышен ли лимит
    const sent = await this.getSentInLastHour();
    return sent < this.messagesPerHour;
  }

  async getSentInLastHour() {
    const hourAgo = Date.now() - 3600000;
    const history = await chrome.storage.local.get('messageHistory');
    const recentMessages = (history.messageHistory || []).filter(m => m.timestamp > hourAgo);
    return recentMessages.length;
  }

  async recordSent(item) {
    const history = await chrome.storage.local.get('messageHistory');
    const messages = history.messageHistory || [];

    messages.push({
      lead: item.lead.username,
      message: item.message.template,
      timestamp: Date.now(),
      status: 'sent'
    });

    await chrome.storage.local.set({ messageHistory: messages });
  }

  calculateScheduleTime(message) {
    // Если это первое сообщение - отправляем сразу
    if (message.step === 1) {
      return Date.now();
    }

    // Иначе добавляем задержку
    return Date.now() + (message.delayAfterPrevious * 3600000);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 3. AI Generation

```javascript
// background/ai.js

class AIMessageGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.endpoint = 'https://api.openai.com/v1/chat/completions';
  }

  async generateMessage(lead, context, style = 'friendly') {
    const prompt = this.buildPrompt(lead, context, style);

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'Ты эксперт по написанию коротких, дружелюбных сообщений для Instagram DM. Твоя задача - создавать персонализированные сообщения, которые выглядят естественно и побуждают к ответу.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 150
        })
      });

      const data = await response.json();
      return data.choices[0].message.content.trim();

    } catch (error) {
      console.error('AI generation failed:', error);
      return this.fallbackMessage(lead);
    }
  }

  buildPrompt(lead, context, style) {
    return `
Создай короткое персонализированное сообщение для Instagram DM.

Информация о человеке:
- Имя: ${lead.fullName}
- Username: @${lead.username}
- Био: ${lead.bio}
- Подписчики: ${lead.followers}

Контекст/Цель сообщения: ${context}

Стиль: ${style}

Требования:
- Длина: максимум 200 символов
- Тон: дружелюбный и непринужденный
- Должно быть персонализированным
- Не звучать как спам
- Заканчиваться вопросом или призывом к действию

Напиши только текст сообщения, без кавычек и пояснений.
    `.trim();
  }

  fallbackMessage(lead) {
    const firstName = lead.fullName.split(' ')[0];
    return `Привет ${firstName}! Увидел твой профиль и подумал, что нам есть о чем поговорить. Интересно узнать больше о том, чем ты занимаешься?`;
  }

  async generateSequence(lead, context, steps = 3) {
    const messages = [];

    for (let i = 1; i <= steps; i++) {
      const stepContext = `${context}. Это ${i} сообщение из ${steps} в последовательности.`;
      const message = await this.generateMessage(lead, stepContext);
      messages.push(message);

      // Небольшая задержка между генерациями
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return messages;
  }
}
```

---

## Manifest.json

```json
{
  "manifest_version": 3,
  "name": "Instagram Lead Generator",
  "version": "1.0.0",
  "description": "Personal tool for Instagram lead generation and automated messaging",

  "permissions": [
    "storage",
    "activeTab",
    "scripting",
    "alarms"
  ],

  "host_permissions": [
    "https://www.instagram.com/*",
    "https://api.openai.com/*"
  ],

  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },

  "background": {
    "service_worker": "background/service-worker.js"
  },

  "content_scripts": [
    {
      "matches": ["https://www.instagram.com/*"],
      "js": [
        "content/scraper.js",
        "content/messenger.js"
      ],
      "run_at": "document_idle"
    }
  ],

  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  }
}
```

---

## Безопасность и лимиты

### Rate Limiting
```javascript
const LIMITS = {
  messagesPerHour: 15,
  messagesPerDay: 80,
  followsPerHour: 20,
  likesPerHour: 50,
  scrapeDelay: 1000, // мс между запросами
  minTypingSpeed: 30, // мс между символами
  maxTypingSpeed: 100
};
```

### Warmup Schedule (для новых аккаунтов)
```javascript
const WARMUP_SCHEDULE = [
  { day: 1, messagesPerDay: 10 },
  { day: 2, messagesPerDay: 15 },
  { day: 3, messagesPerDay: 20 },
  { day: 4, messagesPerDay: 30 },
  { day: 5, messagesPerDay: 50 },
  { day: 7, messagesPerDay: 80 }
];
```

### Имитация человека
```javascript
// Случайные задержки
function randomDelay(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Время активности (не отправлять ночью)
function isActiveHours() {
  const hour = new Date().getHours();
  return hour >= 9 && hour <= 21;
}

// Случайные паузы между сообщениями
async function humanLikePause() {
  const pauseMs = randomDelay(45000, 180000); // 45сек - 3мин
  await sleep(pauseMs);
}
```

---

## Следующие шаги

Хотите, чтобы я начал создавать код для этого проекта?

Мы можем начать с:
1. **Базовой структуры** - создать файлы и manifest.json
2. **Scraper для подписчиков** - первый рабочий функционал
3. **Простой UI** - popup для управления

Какой вариант предпочтительнее?
