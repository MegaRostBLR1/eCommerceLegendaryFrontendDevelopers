import { OrderStatus } from '../enums/order.status.enum';
import { CreateOrderDto } from '../models/orders/create-order.model';
import { OrderDataResponse } from '../models/orders/order-data-response.model';
import { OrderData } from '../models/orders/order-data.model';
import { OrdersResponse } from '../models/orders/orders-response.model';
import { UpdateOrderDto } from '../models/orders/update-order.model';
import { OrdersQuery } from '../models/query/orders-query.model';
import { dbService } from './db/db.service';

const generateUserOrders = async (userId: number): Promise<void> => {
    return;
    function randomDate(start: Date, end: Date) {
        const startTime = start.getTime();
        const endTime = end.getTime();
        const randomTime = startTime + Math.random() * (endTime - startTime);

        return new Date(randomTime);
    }

    const startDate = new Date('2026-03-10T08:00:00Z');
    const endDate = new Date('2026-10-20T20:00:00Z');

    const array = [4, 5, 7, 9];
    const amounts: Record<string, { a: number; q: number }> = {
        '4': { a: 100, q: 2 },
        '5': { a: 56, q: 3 },
        '7': { a: 56, q: 1 },
        '9': { a: 56, q: 5 },
    };

    const orders: CreateOrderDto[] = Array(45)
        .fill(1)
        .reduce((prev: CreateOrderDto[], item, idx) => {
            const randomElement: number = array[Math.floor(Math.random() * array.length)] as number | 4;
            // console.log('RANDOM ELd', randomElement);
            console.log('item', item, idx);
            const obj = {
                serviceId: randomElement,
                quantity: amounts[randomElement]?.q as number,
                price: amounts[randomElement]?.a as number,
                startDate: randomDate(startDate, endDate),
                userId,
                description: `${randomElement}_${amounts[randomElement]?.q}_${amounts[randomElement]?.a}`,
            };
            prev.push(obj);

            return prev;
        }, []);

    for (const el of orders) {
        await ordersService.createOrder(el);
    }
};

const mappedOrder = (data: OrderData | null): OrderDataResponse | null => {
    if (!data) return null;

    const { description, service, user, ...d } = data;

    return {
        ...d,
        description: description || '',
        duration: service.duration,
        name: service.name,
        discount: service.discount || 0,
        user: { id: user?.id || 0, lastName: user?.lastName || '', firstName: user?.firstName || '', patronymic: user?.patronymic || '' },
    };
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
            data: (await dbService.allOrders(page, count, undefined, search)).map((i) => mappedOrder(i)) as OrderDataResponse[],
        };
    },
    orderById: async (id: number): Promise<OrderDataResponse | null> => {
        const data = await dbService.getOrderById(id);

        if (!data) return null;

        return mappedOrder(await dbService.getOrderById(id, true));
    },
    ordersByUserId: async (userId: number, { page: p, count: c }: OrdersQuery): Promise<OrdersResponse> => {
        await generateUserOrders(userId);
        const page = p ? Number(p) : 1;
        const count = c ? Number(c) : 10;
        const ordersCount = await dbService.ordersCount(userId);

        return {
            page,
            count,
            pages: Math.ceil(ordersCount / count),
            data: (await dbService.allOrders(page, count, userId, undefined, true)).map((i) => mappedOrder(i)) as OrderDataResponse[],
        };
    },
    createOrder: async ({ serviceId, quantity, price, startDate, userId, description }: CreateOrderDto): Promise<OrderDataResponse | null> => {
        return mappedOrder(
            await dbService.createOrder({
                serviceId,
                quantity,
                price,
                startDate,
                userId,
                description,
                status: OrderStatus.CREATED,
            }),
        );
    },
    updateOrder: async (id: number, { quantity, description, status, startDate }: UpdateOrderDto): Promise<OrderDataResponse | null> => {
        return mappedOrder(await dbService.updateOrder(id, { quantity, description, status, startDate }));
    },
    removeOrder: async (id: number): Promise<OrderDataResponse | null> => {
        return await ordersService.updateOrder(id, { visible: false });
    },
};
