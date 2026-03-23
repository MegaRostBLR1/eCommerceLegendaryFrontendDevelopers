export type Category = {
  id: number;
  name: string;
  description?: string;
};

export interface Service {
  id: number;
  name: string;
  discount: number;
  amount: number;
  workersCount: number;
  duration: number;
  description: string;
  categories: Category[];
}

export type ServicesData = {
  page: number;
  count: number;
  pages: number;
  data?: Service[];
};

export type UserRole = 'admin' | 'user';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  patronymic: string;
  email: string;
  role: UserRole;
}

export type UpdateUserDto = Omit<User, 'id' | 'role'> & {
  id?: number;
  role?: UserRole;
};

export interface UpdateServiceDto {
  name: string;
  discount: number;
  amount: number;
  workersCount: number;
  duration: number;
  description: string;
  categories: number[];
}

export interface Order {
  id: number;
  startDate: string;
  date: string;
  status: number;
  price: number;
  quantity: number;
  description: string;
  name: string;
  discount: number;
  user: {
    id: number;
    lastName: string;
    firstName: string;
    patronymic: string;
  };
}

export interface OrdersResponse {
  data: Order[];
  pages: number;
  total: number;
}

export interface IUserToken {
  token: string;
  user: User;
  status: string;
  exp: number;
}