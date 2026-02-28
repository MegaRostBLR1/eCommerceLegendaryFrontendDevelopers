export type Category = {
  id: number;
  name: string;
  description?: string;
};

export type Service = {
  id: number;
  name: string;
  discount?: number;
  amount: number;
  workersCount: number;
  duration: string;
  description: string;
  categories: Category[];
};

export type ServicesData = {
  page: number;
  count: number;
  pages: number;
  data?: Service[];
};
