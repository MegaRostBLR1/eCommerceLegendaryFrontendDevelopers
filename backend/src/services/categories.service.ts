import { CategoryResponse } from '../models/categories/category-response.model';
import { CreateCategory } from '../models/categories/create-category.model';
import { UpdateCategory } from '../models/categories/update-category.model';
import { dbService } from './db/db.service';

export const categoriesService = {
    getCategoryById: async (id: number): Promise<CategoryResponse | null> => {
        return await dbService.getCategoryById(id);
    },
    getAllCategories: async (): Promise<CategoryResponse[]> => {
        return await dbService.getCategories(true);
    },
    createCategory: async (dto: CreateCategory): Promise<CategoryResponse> => {
        return await dbService.createCategory(dto);
    },
    updateCategory: async (id: number, dto: UpdateCategory): Promise<CategoryResponse> => {
        return await dbService.updateCategory(id, dto);
    },
    removeCategory: async (id: number): Promise<CategoryResponse> => {
        return await categoriesService.updateCategory(id, { visible: false });
    },
};
