import { Request, Response, NextFunction } from 'express';
import { disconnectDb } from '../../services/db/db.service';

export const disconnectDbMiddleware = (_req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
        disconnectDb();
    });
    next();
};
