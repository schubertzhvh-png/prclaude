# Growth Strategy Mind Map Generator 🚀

Автоматический генератор интерактивных mind map для стратегий роста.

## Возможности

- ✅ Конвертация structured analysis в markdown mind map
- ✅ Генерация интерактивной HTML визуализации
- ✅ Красивый дизайн с цветовой кодировкой
- ✅ Zoom, pan, expand/collapse nodes
- ✅ Экспорт в markdown для редактирования
- ✅ Готово для импорта в Miro/Figma

## Использование

### Быстрый старт

```bash
node generate-mindmap.js
```

Это создаст:
- `output/growth-strategy.md` - markdown версия
- `output/growth-strategy-mindmap.html` - интерактивная HTML mind map

### Открыть результат

Просто открой `output/growth-strategy-mindmap.html` в браузере!

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

1. Открой HTML mind map
2. Сделай screenshot (или используй browser dev tools для SVG export)
3. Импортируй в Miro как image
4. Или используй markdown версию для ручного создания структуры

## Экспорт в Figma

1. Экспортируй SVG из HTML (browser dev tools)
2. Импортируй SVG в Figma
3. Редактируй как vector graphics

## TODO

- [ ] Добавить Miro REST API integration
- [ ] PDF export
- [ ] Custom color schemes
- [ ] Multiple templates
- [ ] CLI с параметрами

## Примеры

См. `output/` директорию для примеров сгенерированных mind maps.
