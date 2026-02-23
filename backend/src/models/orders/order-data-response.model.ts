import { Order } from '@prisma/client';
import { UserResponse } from '../users/user-response.model';

export type OrderDataResponse = Pick<Order, 'id' | 'description' | 'startDate' | 'date' | 'quantity' | 'status' | 'price'> & {
    name: string;
    discount: number;
    user: Omit<UserResponse, 'email' | 'role'>;
};
