import type { Service } from '../../../types';

interface AiResponse {
  name?: string;
  amount?: number;
  discount?: number;
  workersCount?: number;
  duration?: number | string;
  description?: string;
}

let tempId = -1;

export const mapAiResponseToService = (ai: AiResponse): Service => {
  return {
    id: tempId--,
    name: String(ai.name ?? ''),
    amount: Number(ai.amount ?? 0),
    discount: Number(ai.discount ?? 0),
    workersCount: Number(ai.workersCount ?? 1),
    duration: Number(ai.duration ?? 0),
    description: String(ai.description ?? ''),
    categories: [],
  };
};
