import { Prisma, PrismaClient } from '@prisma/client';
import { UserRole } from '../../enums/user-role.enum';
import { ReqBody } from '../../models/common/request-body.model';
import { UserResponse } from '../../models/users/user-response.model';
import { USER_SELECT } from './constants/user.select';
import { CategoryResponse } from '../../models/categories/category-response.model';
import { CATEGORY_SELECT } from './constants/category.select';
import { ServiceData } from '../../models/services/service-data.model';
import { SERVICE_SELECT } from './constants/service.select';
import { queryServices } from './utils/query-services';
import { OrderData } from '../../models/orders/order-data.model';
import { ordersQuery } from './utils/orders-query';
import { ORDER_SELECT } from './constants/order.select';

const db = new PrismaClient();

export const disconnectDb = async (): Promise<void> => {
    await db.$disconnect();
};

export const dbService = {
    createUser: async (data: ReqBody, role?: UserRole): Promise<UserResponse> => {
        return await db.user.create({
            data: {
                ...data,
                role: role as string,
            },
            select: USER_SELECT,
        });
    },
    getUserByEmail: async (email: string, visible?: boolean, select?: Prisma.UserSelect): Promise<UserResponse | null> => {
        return await db.user.findFirst({ where: { email, visible }, select });
    },
    allUsers: async (page: number, take: number): Promise<UserResponse[]> => {
        return await db.user.findMany({ where: { visible: true }, select: USER_SELECT, take, skip: (page - 1) * take });
    },
    usersCount: async (): Promise<number> => {
        return await db.user.count({ where: { visible: true } });
    },
    getUserById: async (id: number, visible?: boolean): Promise<UserResponse | null> => {
        return await db.user.findFirst({ where: { id, visible }, select: USER_SELECT });
    },
    updateUser: async (id: number, data: Prisma.UserUncheckedUpdateInput): Promise<UserResponse> => {
        return await db.user.update({ where: { id }, data, select: USER_SELECT });
    },
    getCategories: async (visible: boolean): Promise<CategoryResponse[]> => {
        return await db.category.findMany({ where: { visible }, select: CATEGORY_SELECT });
    },
    getCategoryById: async (id: number, visible?: boolean): Promise<CategoryResponse | null> => {
        return await db.category.findFirst({ where: { id, visible }, select: CATEGORY_SELECT });
    },
    getServicesCategoriesByServiceId: async (serviceId: number): Promise<{ categoryId: number }[]> => {
        return await db.servicesCategories.findMany({ where: { serviceId }, select: { categoryId: true } });
    },
    createCategory: async (data: Prisma.CategoryUncheckedCreateInput): Promise<CategoryResponse> => {
        return await db.category.create({ data, select: CATEGORY_SELECT });
    },
    updateCategory: async (id: number, data: Prisma.CategoryUncheckedUpdateInput): Promise<CategoryResponse> => {
        return await db.category.update({ where: { id }, data, select: CATEGORY_SELECT });
    },
    getServicesCount: async (categories?: number[], search?: string, visible?: boolean): Promise<number> => {
        return await db.service.count({ where: queryServices(categories, search, visible) });
    },
    getServices: async (categories?: number[], search?: string, visible?: boolean): Promise<ServiceData[]> => {
        return await db.service.findMany({ where: queryServices(categories, search, visible), select: SERVICE_SELECT });
    },
    getServiceById: async (id: number, visible?: boolean): Promise<ServiceData | null> => {
        return await db.service.findFirst({ where: { id, visible }, select: SERVICE_SELECT });
    },
    createService: async (data: Prisma.ServiceUncheckedCreateInput): Promise<ServiceData> => {
        return await db.service.create({ data, select: SERVICE_SELECT });
    },
    updateService: async (id: number, data: Prisma.ServiceUncheckedUpdateInput): Promise<ServiceData> => {
        return await db.service.update({ where: { id }, data, select: SERVICE_SELECT });
    },
    servicesOrderByPostsCount: async (take: number) => {
        return await db.service.findMany({
            orderBy: {
                orders: {
                    _count: 'desc',
                },
            },
            select: SERVICE_SELECT,
            take,
        });
    },
    ordersCount: async (userId?: number, search?: string, visible?: boolean): Promise<number> => {
        return await db.order.count({ where: ordersQuery(userId, search, visible) });
    },
    allOrders: async (page: number, take: number, userId?: number, search?: string, visible?: boolean): Promise<OrderData[]> => {
        return await db.order.findMany({ where: ordersQuery(userId, search, visible), select: ORDER_SELECT, take, skip: (page - 1) * take });
    },
    getOrderById: async (id: number, visible?: boolean): Promise<OrderData | null> => {
        return await db.order.findFirst({ where: { id, visible }, select: ORDER_SELECT });
    },
    createOrder: async (data: Prisma.OrderUncheckedCreateInput): Promise<OrderData> => {
        return await db.order.create({ data, select: ORDER_SELECT });
    },
    updateOrder: async (id: number, data: Prisma.OrderUncheckedUpdateInput) => {
        return await db.order.update({ where: { id }, data, select: ORDER_SELECT });
    },
};
