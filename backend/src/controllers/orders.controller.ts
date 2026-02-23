import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/exception';
import { ordersService } from '../services/orders.service';
import { OrdersQuery } from '../models/orders/orders-query.model';

export const ordersController = {
    allOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await ordersService.getAllOrders(req.query as unknown as OrdersQuery));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    orderById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await ordersService.orderById(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    ordersByUserId: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await ordersService.ordersByUserId(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    createOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(201).json(await ordersService.createOrder(req.body));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    updateOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await ordersService.updateOrder(Number(req.params['id']), req.body));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    removeOrder: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(204).json(await ordersService.removeOrder(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
};
