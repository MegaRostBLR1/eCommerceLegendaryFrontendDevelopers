export const ORDER_SELECT = {
    id: true,
    description: true,
    startDate: true,
    date: true,
    status: true,
    price: true,
    quantity: true,
    service: { select: { id: true, name: true, discount: true } },
    user: { select: { id: true, email: true, role: true, lastName: true, firstName: true, patronymic: true } },
};
