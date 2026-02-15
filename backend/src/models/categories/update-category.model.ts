import { CreateCategory } from './create-category.model';

export type UpdateCategory = Partial<CreateCategory> & {
    visible?: boolean;
};
