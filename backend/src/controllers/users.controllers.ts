import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/exception';
import { userService } from '../services/user.service';
import { PageCountQuery } from '../models/query/user-query.model';

export const usersController = {
    allUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await userService.getAllUsers(req.query as unknown as PageCountQuery));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    getUserById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await userService.getUserById(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    createUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(201).json(await userService.createUser(req.body));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    updateUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await userService.updateUser(Number(req.params['id']), req.body));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    removeUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(204).json(await userService.removeUser(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
};
