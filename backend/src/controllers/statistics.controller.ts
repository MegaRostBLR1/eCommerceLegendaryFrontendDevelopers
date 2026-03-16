import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/exception';
import { statisticsService } from '../services/statistics.service';
import { StatisticsQuery } from '../models/query/statistics-query.model';

export const statisticsController = {
    totalOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await statisticsService.totalOrdersByDates(req.query as unknown as StatisticsQuery));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    totalUsersOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await statisticsService.totalUsersOrdersByDates(req.query as unknown as StatisticsQuery));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    userOrders: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await statisticsService.userOrdersByDates(Number(req.params['id']), req.query as unknown as StatisticsQuery));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
};
