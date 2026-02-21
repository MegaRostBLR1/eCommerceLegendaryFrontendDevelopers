import { OrdersQuery } from "../models/query/orders-query.model"

export const ordersService = {
    getAllOrders: ({ page: p, count: c, search }: OrdersQuery): Promise<OrdersResponse> => {
        return 
    },
    orderById: async (id: number):  => {

    },
    ordersByUserId: async () => {

    },
    createOrder: async () => {

    },
    updateOrder: async () => {

    },
    removeOrder: async () => {

    },
}
