import { Request, Response, NextFunction } from 'express';
import { authorizationService } from '../../services/authorization.service';
import { userService } from '../../services/user.service';
import { DecodedToken } from '../../models/authorization/decoded-token.model';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const handleToken = await authorizationService.handleInnerToken(req.headers['authorization'] || '');

    if (!handleToken) res.status(401).json({ error: 'unauthorized' });
    else {
        (req as any).user = await userService.getUserById((handleToken as DecodedToken).id);
        next();
    }
};
