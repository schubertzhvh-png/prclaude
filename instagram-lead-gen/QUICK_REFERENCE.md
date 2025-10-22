# ⚡ Быстрая шпаргалка

## 🎯 Запуск за 30 секунд

```bash
# 1. Установить расширение
chrome://extensions/ → Developer mode ON → Load unpacked → выбрать папку

# 2. Открыть дашборд
cd web-dashboard
python3 -m http.server 8000
# Открыть http://localhost:8000
```

---

## 🔥 Основные команды

### Запуск дашборда

```bash
# Python
python3 -m http.server 8000

# Node
npx http-server -p 8000

# Или просто двойной клик на index.html
```

### Структура проекта

```
instagram-lead-gen/
├── manifest.json      ← Конфиг расширения
├── popup/             ← UI расширения
├── content/           ← Скрипты для Instagram
├── web-dashboard/     ← Веб-дашборд
│   └── index.html     ← Откройте это!
└── START_HERE.md      ← Читайте сначала!
```

---

## 🎨 Что где находится

### Chrome Extension (Расширение)

```
Иконка расширения → Popup
├── Scraper      → Парсинг лидов
├── Leads        → Просмотр базы
├── Campaigns    → Создание кампаний
└── Settings     → Настройки
```

### Web Dashboard (Дашборд)

```
index.html → Dashboard
├── Overview     → Статистика
├── Leads        → Таблица лидов
├── Campaigns    → Управление кампаниями
├── Scraper      → Парсинг (через расширение)
├── Analytics    → Аналитика
└── Settings     → Настройки
```

---

## ⚙️ Настройки по умолчанию

```javascript
{
  messagesPerHour: 15,      // Безопасно!
  messagesPerDay: 80,       // Безопасно!
  startTime: "09:00",       // Активные часы
  endTime: "21:00",         // Не ночью
  stopOnReply: true         // Остановка при ответе
}
```

---

## 🚀 Быстрый старт - Собрать лиды

1. Instagram → открыть профиль
2. Расширение → Scraper
3. Type: **Followers**
4. Start Scraping
5. Подождать 30 сек
6. Stop
7. Leads → смотреть результат

---

## 📊 Быстрый старт - Создать кампанию

1. Расширение → Campaigns
2. + New Campaign
3. Название: "Тест"
4. Message: `Привет {firstName}!`
5. Create
6. ⚠️ НЕ ЗАПУСКАТЬ сразу - сначала прочитать про безопасность!

---

## 🔄 Синхронизация

```
Расширение → создает данные
Дашборд → показывает данные

Синхронизация:
Dashboard → кнопка "🔄 Sync"
```

---

## 📥 Экспорт данных

```
# CSV (только лиды)
Dashboard → Leads → Export CSV

# JSON (все данные)
Dashboard → Settings → Export All Data
```

---

## 🛡️ Безопасные лимиты

```
✅ БЕЗОПАСНО:
- 15-20 сообщений/час
- 80-100 сообщений/день
- Работа 9:00-21:00
- Перерывы между сессиями

❌ ОПАСНО:
- >30 сообщений/час
- >150 сообщений/день
- Работа 24/7
- Одинаковые тексты
```

---

## 🔑 Персонализация

```
{firstName}  → John
{username}   → johndoe
{fullName}   → John Doe
{bio}        → Entrepreneur...
{followers}  → 5000
{ai}         → AI генерирует текст
```

Пример:
```
Привет {firstName}! Увидел что ты {bio}. Давай пообщаемся?
```

---

## 📚 Документация

```
START_HERE.md        → Начните отсюда!
QUICKSTART.md        → 5 минут на установку
README.md            → Полная документация
COMPLETE_GUIDE.md    → Исчерпывающий гайд
FEATURES.md          → Список возможностей
```

---

## 🆘 Частые проблемы

### Расширение не видно
```
chrome://extensions/ → Developer mode → Reload
```

### Парсинг не работает
```
1. Убедитесь на странице Instagram
2. Залогинены
3. Обновите страницу
```

### Дашборд: Extension Disconnected
```
Это нормально! Нажмите "🔄 Sync"
```

---

## 💡 Полезные ссылки

```
Chrome Extensions:     chrome://extensions/
Instagram:            https://instagram.com
OpenAI API Keys:      https://platform.openai.com/api-keys
Дашборд (локально):   http://localhost:8000
```

---

## ✅ Чеклист первого запуска

- [ ] Создал иконки (icons/generate-icons.html)
- [ ] Установил расширение (chrome://extensions/)
- [ ] Открыл дашборд (index.html)
- [ ] Протестировал парсинг (собрал 5-10 лидов)
- [ ] Проверил данные в дашборде
- [ ] Настроил безопасные лимиты
- [ ] Прочитал START_HERE.md
- [ ] Прочитал про безопасность

---

## 🎯 Готово!

Теперь:
1. Собирайте лиды
2. Управляйте через дашборд
3. Автоматизируйте отправку
4. Отслеживайте статистику

**Успехов!** 🚀
