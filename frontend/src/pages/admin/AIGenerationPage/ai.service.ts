import {
  GoogleGenerativeAI,
  SchemaType,
  type ResponseSchema,
} from '@google/generative-ai';
import { environment } from '../../../assets/environment/environment';

const genAI = new GoogleGenerativeAI(environment.geminiKey);

const schema: ResponseSchema = {
  description: 'Список услуг по уборке',
  type: SchemaType.ARRAY,
  items: {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING },
      amount: { type: SchemaType.NUMBER },
      discount: { type: SchemaType.NUMBER },
      workersCount: { type: SchemaType.NUMBER },
      duration: { type: SchemaType.NUMBER },
      description: { type: SchemaType.STRING },
    },
    required: ['name', 'amount', 'description'],
  },
};

const model = genAI.getGenerativeModel({
  model: 'gemini-3-flash-preview',
  generationConfig: {
    responseMimeType: 'application/json',
    responseSchema: schema,
  },
  systemInstruction: `Ты — генератор данных для клинингового сервиса. 
  Всегда возвращай массив объектов в формате JSON. 
  Если пользователь просит конкретное количество услуг, генерируй именно столько. 
  Пиши на языке пользователя.`,
});

export const aiService = {
  async generateServices(prompt: string) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      if (error instanceof Error)
        throw new Error('Не удалось сгенерировать услуги. Попробуйте позже.');
      throw error;
    }
  },
};
