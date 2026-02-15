import { Service } from '@prisma/client';
import { CategoryResponse } from '../categories/category-response.model';

export type ServiceResponse = Omit<Service, 'date' | 'visible'> & {
    categories: CategoryResponse[];
};
