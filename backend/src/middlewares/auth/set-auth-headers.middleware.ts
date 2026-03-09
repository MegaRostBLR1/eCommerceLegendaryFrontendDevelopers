import { NextFunction, Request, Response } from 'express';

export const setAuthorizationsHeaders = (_req: Request, res: Response, next: NextFunction): void => {
    res.set('Access-Control-Expose-Headers', 'Authorization');
    next();
};
