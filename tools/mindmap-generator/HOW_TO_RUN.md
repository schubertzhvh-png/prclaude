# Как запустить Miro Integration 🚀

## Быстрый старт (3 минуты)

### Шаг 1: Создай .env файл

```bash
cd tools/mindmap-generator

# Создай .env из примера
cp .env.example .env
```

### Шаг 2: Открой .env и добавь свой токен

Открой файл `.env` в любом текстовом редакторе и замени:

```
MIRO_ACCESS_TOKEN=your_miro_access_token_here
MIRO_BOARD_ID=uXjVJ2dQB2s
```

На:

```
MIRO_ACCESS_TOKEN=eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_ctiB9AIaTcaLbKnkEZSvtXTTvWc
MIRO_BOARD_ID=uXjVJ2dQB2s
```

**Важно:** Убедись что нет пробелов вокруг `=`

### Шаг 3: Запусти скрипт

```bash
node miro-integration.js
```

## Ожидаемый результат:

```
🚀 Miro Growth Strategy Board Generator
==================================================

📋 Using existing board: uXjVJ2dQB2s

🎨 Creating growth strategy board in Miro...

📍 Creating central node...
✅ Central node created: 3458764580424242890

📍 Creating Phase 1: Foundation...
✅ Phase 1 created

📍 Creating Phase 2: First Monetization...
✅ Phase 2 created

📍 Creating Phase 3: Beta Launch...
✅ Phase 3 created

📍 Creating Phase 4: Scale...
✅ Phase 4 created

📍 Creating Quick Wins...
✅ Quick Wins created

📍 Creating Current State...
✅ Current State created

📍 Creating Revenue Projection...
✅ Revenue Projection created

🎉 Strategy board successfully created in Miro!

✅ Done! View your strategy at: https://miro.com/app/board/uXjVJ2dQB2s/
```

## Если ошибка "dotenv not found":

```bash
cd tools/mindmap-generator
npm install dotenv
```

Затем запусти снова:
```bash
node miro-integration.js
```

## Альтернативный способ (без .env файла):

### На Mac/Linux:

```bash
export MIRO_ACCESS_TOKEN="eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_ctiB9AIaTcaLbKnkEZSvtXTTvWc"
export MIRO_BOARD_ID="uXjVJ2dQB2s"
node miro-integration.js
```

### На Windows (PowerShell):

```powershell
$env:MIRO_ACCESS_TOKEN="eyJtaXJvLm9yaWdpbiI6ImV1MDEifQ_ctiB9AIaTcaLbKnkEZSvtXTTvWc"
$env:MIRO_BOARD_ID="uXjVJ2dQB2s"
node miro-integration.js
```

## Что изменилось:

✅ **Исправлено:** Теперь использует **sticky notes и shapes** вместо экспериментального mind map API
✅ **Исправлено:** dotenv установлен и правильно настроен
✅ **Добавлено:** Rate limiting protection (задержки между запросами)
✅ **Добавлено:** Connectors между элементами
✅ **Улучшено:** Цветовая кодировка sticky notes

## Что создается в Miro:

1. **Центральный узел** (синий shape): "Derek Rodriguez - 18-Month Growth Strategy"
2. **Phase 1** (голубой sticky): Foundation (Months 1-6)
3. **Phase 2** (зеленый sticky): First Monetization (Months 7-9)
4. **Phase 3** (фиолетовый sticky): Beta Launch (Months 10-12)
5. **Phase 4** (желтый sticky): Scale (Months 13-18)
6. **Quick Wins** (красный sticky): Week 1 action items
7. **Current State** (серый sticky): Current metrics
8. **Revenue Projection** (желтый sticky): 18-month totals

Все соединено линиями (connectors) для визуальной связи!

## Troubleshooting:

### Ошибка 401 Unauthorized:
- Проверь что токен скопирован полностью
- Убедись что нет лишних пробелов или кавычек

### Ошибка 403 Forbidden:
- Проверь что у тебя есть права на редактирование board
- Попробуй создать новый board (убери MIRO_BOARD_ID из .env)

### Ошибка 429 Too Many Requests:
- Подожди 1 минуту
- Запусти снова (скрипт теперь имеет задержки между запросами)

## Следующие шаги:

1. **Открой board в Miro:**
   https://miro.com/app/board/uXjVJ2dQB2s/

2. **Отредактируй по желанию:**
   - Перетаскивай sticky notes
   - Меняй цвета
   - Добавляй комментарии

3. **Поделись с клиентом:**
   - Скопируй ссылку
   - Отправь email
   - Проведи презентацию

🎉 Готово! У тебя есть интерактивная стратегия в Miro!
