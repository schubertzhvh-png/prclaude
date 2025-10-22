// AI Message Generator using OpenAI API

class AIMessageGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.endpoint = 'https://api.openai.com/v1/chat/completions';
  }

  async generateMessage(lead, context, options = {}) {
    if (!this.apiKey) {
      console.warn('OpenAI API key not set, using fallback');
      return this.fallbackMessage(lead);
    }

    const {
      style = 'friendly',
      maxLength = 200,
      includeQuestion = true
    } = options;

    const prompt = this.buildPrompt(lead, context, style, maxLength, includeQuestion);

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
              content: 'Ты эксперт по написанию коротких, дружелюбных сообщений для Instagram DM. Твоя задача - создавать персонализированные сообщения, которые выглядят естественно и побуждают к ответу. Пиши на русском языке, используя неформальный стиль.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 150
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const generatedMessage = data.choices[0].message.content.trim();

      // Remove quotes if present
      return generatedMessage.replace(/^["'](.*)["']$/, '$1');

    } catch (error) {
      console.error('AI generation failed:', error);
      return this.fallbackMessage(lead);
    }
  }

  buildPrompt(lead, context, style, maxLength, includeQuestion) {
    const firstName = this.extractFirstName(lead.fullName);

    return `
Создай короткое персонализированное сообщение для Instagram DM.

Информация о человеке:
- Имя: ${lead.fullName}
- Username: @${lead.username}
- Био: ${lead.bio || 'не указано'}
- Подписчики: ${lead.followers || 'неизвестно'}

Контекст/Цель: ${context}
Стиль: ${style}

Требования:
- Длина: максимум ${maxLength} символов
- Тон: дружелюбный, непринужденный, как будто пишет реальный человек
- Обращайся на "ты"
- Используй имя ${firstName}
- Сделай сообщение персонализированным на основе био
- Не звучи как спам или бот
${includeQuestion ? '- Заканчивай вопросом или призывом к действию' : ''}
- НЕ используй эмодзи
- Пиши естественно, как в обычной переписке

Напиши только текст сообщения, без кавычек и пояснений.
    `.trim();
  }

  async generateSequence(lead, context, steps = 3) {
    const messages = [];

    for (let i = 1; i <= steps; i++) {
      let stepContext = context;
      let includeQuestion = true;

      if (i === 1) {
        stepContext = `${context}. Это первое сообщение, знакомство.`;
      } else if (i === 2) {
        stepContext = `${context}. Это второе сообщение - follow-up, так как не было ответа на первое.`;
        includeQuestion = true;
      } else {
        stepContext = `${context}. Это ${i}-е сообщение в последовательности, финальная попытка.`;
        includeQuestion = true;
      }

      const message = await this.generateMessage(lead, stepContext, {
        style: i === 1 ? 'friendly' : 'casual',
        includeQuestion
      });

      messages.push(message);

      // Задержка между генерациями
      await this.sleep(1000);
    }

    return messages;
  }

  fallbackMessage(lead) {
    const firstName = this.extractFirstName(lead.fullName);
    const templates = [
      `Привет ${firstName}! Увидел твой профиль и подумал, что нам есть о чем поговорить. Чем занимаешься?`,
      `Хей ${firstName}! Классный профиль) Расскажешь больше о том, чем увлекаешься?`,
      `Привет ${firstName}! Заинтересовал твой контент. Можем обсудить?`,
      `${firstName}, привет! Нашел твой профиль и показалось интересным. Пообщаемся?`
    ];

    return templates[Math.floor(Math.random() * templates.length)];
  }

  extractFirstName(fullName) {
    if (!fullName) return 'друг';
    const parts = fullName.trim().split(/\s+/);
    return parts[0] || 'друг';
  }

  personalize(template, lead) {
    const firstName = this.extractFirstName(lead.fullName);

    return template
      .replace(/\{firstName\}/g, firstName)
      .replace(/\{username\}/g, lead.username)
      .replace(/\{fullName\}/g, lead.fullName)
      .replace(/\{bio\}/g, lead.bio || '')
      .replace(/\{followers\}/g, lead.followers || 0);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Make it available globally
if (typeof window !== 'undefined') {
  window.AIMessageGenerator = AIMessageGenerator;
}
