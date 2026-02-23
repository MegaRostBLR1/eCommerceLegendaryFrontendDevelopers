import { OrderDataResponse } from '../models/orders/order-data-response.model';
import { OrderData } from '../models/orders/order-data.model';
import { OrdersResponse } from '../models/orders/orders-response.model';
import { UpdateOrderDto } from '../models/orders/update-order.model';
import { OrdersQuery } from '../models/query/orders-query.model';
import { dbService } from './db/db.service';

const mappedOrder = (data: OrderData): OrderDataResponse => {
    console.log('DATA', data);

    return {} as OrderDataResponse;
};

export const ordersService = {
    getAllOrders: async ({ page: p, count: c, search }: OrdersQuery): Promise<OrdersResponse> => {
        // search => service name, user bio
        const page = p ? Number(p) : 1;
        const count = c ? Number(c) : 10;
        const ordersCount = await dbService.ordersCount(undefined, search);

        return {
            page,
            count,
            pages: Math.ceil(ordersCount / count),
            data: (await dbService.allOrders(page, count, undefined, search)).map((i) => mappedOrder(i)),
        };
    },
    orderById: async (id: number): Promise<OrderDataResponse | null> => {
        const data = await dbService.getOrderById(id);

        if (!data) return null;

        return {} as OrderDataResponse;

        // const { servicesCategories, ...d } = data;

        // return { ...d, categories: mappedServiceCategories(servicesCategories) };
    },
    ordersByUserId: async (userId: number, { page: p, count: c }: OrdersQuery): Promise<OrdersResponse> => {
        const page = p ? Number(p) : 1;
        const count = c ? Number(c) : 10;
        const ordersCount = await dbService.ordersCount(userId);
        const data = await dbService.allOrders(page, count, userId, undefined, true);

        return { page, count, pages: Math.ceil(ordersCount / count), data };
    },
    createOrder: async (dto: any): Promise<OrderDataResponse> => {
        console.log(dto);

        return {} as OrderDataResponse;
    },
    updateOrder: async (id: number, dto: UpdateOrderDto): Promise<OrderDataResponse> => {
        console.log(id, dto);

        return {} as OrderDataResponse;
    },
    removeOrder: async (id: number): Promise<OrderDataResponse> => {
        return await ordersService.updateOrder(id, { visible: false });
    },
};
