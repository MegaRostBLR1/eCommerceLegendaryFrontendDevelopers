export const validationRules = {
  serviceName: /^[a-zA-Zа-яА-Я0-9\s_]{3,50}$/,
  discount: /^\d+(\.\d{1,2})?$/,
  amount: /^\d+$/,
  workersCount: /^\d+$/,
  duration: /^\d+$/,
  description: /^.{5,500}$/,
  categories: /^(\d+,?\s*)+$/,
};
