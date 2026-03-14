import { Category } from '@prisma/client';

export type CategoryResponse = Pick<Category, 'id' | 'name' | 'description'>;
