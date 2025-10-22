# Growth Strategy Mind Map Generator 🚀

Автоматический генератор интерактивных mind map для стратегий роста.

## Возможности

- ✅ Конвертация structured analysis в markdown mind map
- ✅ Генерация интерактивной HTML визуализации
- ✅ **Автоматическое создание в Miro через REST API** 🔥
- ✅ Красивый дизайн с цветовой кодировкой
- ✅ Zoom, pan, expand/collapse nodes
- ✅ Экспорт в markdown для редактирования
- ✅ Готово для совместной работы с клиентами

## Использование

### Вариант 1: HTML Mind Map (Локально)

```bash
node generate-mindmap.js
```

Это создаст:
- `output/growth-strategy.md` - markdown версия
- `output/growth-strategy-mindmap.html` - интерактивная HTML mind map

Открой `output/growth-strategy-mindmap.html` в браузере!

### Вариант 2: Miro Mind Map (Облако) 🔥 НОВОЕ!

Автоматически создает mind map прямо в Miro для совместной работы с клиентами!

#### Setup (один раз):

1. **Получи Miro Access Token:**
   - Иди на https://miro.com/app/settings/user-profile/apps
   - Create new app → Copy access token
   - Подробные инструкции: см. `MIRO_SETUP.md`

2. **Настрой environment:**
   ```bash
   cp .env.example .env
   # Отредактируй .env и добавь свой token
   ```

3. **Запусти:**
   ```bash
   node miro-integration.js
   ```

#### Результат:
- ✅ Новый Miro board создан
- ✅ Mind map автоматически добавлен
- ✅ Получишь ссылку для sharing с клиентом
- ✅ Можно редактировать вместе в реальном времени

**Пример output:**
```
🚀 Miro Mind Map Generator
📋 Creating new Miro board...
✅ Board created!
🎨 Creating mind map in Miro...
✅ Done! View at: https://miro.com/app/board/YOUR_BOARD_ID/
```

## Структура данных

Mind map генерируется из structured analysis object:

```javascript
{
  name: "Client Name",
  currentState: { ... },
  branches: {
    audienceGrowth: { ... },
    positioning: { ... },
    monetization: { ... },
    contentMarketing: { ... },
    quickWins: { ... }
  },
  threeYearRoadmap: { ... }
}
```

## Кастомизация

### Добавить новую ветку

Просто добавь в `branches` object:

```javascript
branches: {
  newBranch: {
    title: "New Strategy Area 🎯",
    opportunities: [...]
  }
}
```

### Изменить цвета

Редактируй color array в HTML template:

```javascript
const colors = [
  '#667eea', // Level 1
  '#764ba2', // Level 2
  // Добавь свои цвета
];
```

## Экспорт в Miro

### Автоматический (Рекомендуется) 🔥

```bash
node miro-integration.js
```

Создаст board и mind map автоматически через Miro REST API!

### Ручной

1. Открой HTML mind map
2. Сделай screenshot (или используй browser dev tools для SVG export)
3. Импортируй в Miro как image
4. Или используй markdown версию для ручного создания структуры

## Экспорт в Figma

1. Экспортируй SVG из HTML (browser dev tools)
2. Импортируй SVG в Figma
3. Редактируй как vector graphics

## TODO

- [x] Miro REST API integration ✅
- [ ] PDF export
- [ ] Custom color schemes
- [ ] Multiple templates
- [ ] CLI с параметрами
- [ ] Batch processing для нескольких клиентов
- [ ] Webhook integration для уведомлений

## Примеры

См. `output/` директорию для примеров сгенерированных mind maps.
