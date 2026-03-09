import { Order } from '@prisma/client';
import { OrderStatus } from '../../enums/order.status.enum';

export type CreateOrderDto = Pick<Order, 'price' | 'quantity' | 'serviceId' | 'startDate' | 'userId' | 'description'> & {
    status?: OrderStatus;
};
