import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/exception';
import { authorizationService } from '../services/authorization.service';

export const authController = {
    signInSignUp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.status(200)
                .json(await authorizationService.signInSignUp(req.body))
                .end();
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
};
