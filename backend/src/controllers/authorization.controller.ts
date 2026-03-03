import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../exceptions/exception';
import { authorizationService } from '../services/authorization.service';
import { isEqual } from 'lodash';

export const authController = {
    signInSignUp: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await authorizationService.signInSignUp(req.body);

            if (isEqual(data.status, 'Error'))
                res.status(data.code || 401)
                    .json({ error: 'Unauthorized' })
                    .end();
            else res.status(200).json(data).end();
        } catch (e) {
            console.log('ERROR', e);
            next(HttpException.internalError(JSON.stringify(e)));
        }
    },
};
