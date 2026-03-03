export const ordersQuery = (userId?: number, search?: string, visible?: boolean) => {
    return {
        userId,
        visible,
        OR: [
            { user: { OR: [{ lastName: { contains: search } }, { firstName: { contains: search } }, { patronymic: { contains: search } }] } },
            { service: { name: { contains: search } } },
        ],
    };
};
