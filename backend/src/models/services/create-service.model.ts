import { Service } from '@prisma/client';

export type CreateService = Omit<Service, 'date' | 'visible'> & {
    categories: number[];
};
