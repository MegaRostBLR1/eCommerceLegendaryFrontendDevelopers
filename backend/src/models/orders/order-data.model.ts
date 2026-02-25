import { Order, Service, User } from '@prisma/client';

export type OrderData = Pick<Order, 'id' | 'description' | 'date' | 'startDate' | 'status' | 'price' | 'quantity'> & {
    service: Pick<Service, 'id' | 'name' | 'discount'>;
    user: Omit<User, 'date' | 'password' | 'visible'> | null;
};
