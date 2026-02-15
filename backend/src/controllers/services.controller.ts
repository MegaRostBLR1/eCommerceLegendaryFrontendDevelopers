import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/exception';
import { servicesService } from '../services/services.service';
import { PageCountQuery } from '../models/query/user-query.model';

export const servicesController = {
    allServices: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await servicesService.getAllServices(req.query as unknown as PageCountQuery));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    serviceById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await servicesService.getServiceById(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    createService: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(201).json(await servicesService.createService(req.body));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    updateService: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200).json(await servicesService.updateService(Number(req.params['id']), req.body));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
    removeService: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(204).json(await servicesService.removeService(Number(req.params['id'])));
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
};
