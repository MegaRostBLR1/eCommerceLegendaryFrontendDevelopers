import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/exception';
import { categoriesService } from '../services/categories.service';

export const categoriesController = {
    allCategories: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await categoriesService.getAllCategories());
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    categoryById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await categoriesService.getCategoryById(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    createCategory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(201).json(await categoriesService.createCategory(req.body));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    updateCategory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await categoriesService.updateCategory(Number(req.params['id']), req.body));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    removeCategory: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(204).json(await categoriesService.removeCategory(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
};
