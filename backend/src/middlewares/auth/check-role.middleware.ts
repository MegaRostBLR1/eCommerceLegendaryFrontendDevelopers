import { Request, Response, NextFunction } from 'express';
import { isEqual } from 'lodash';
import { UserRole } from '../../enums/user-role.enum';
import { RequestWithUser } from '../../models/request/request-user.model';

export const permissionMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!isEqual((req as RequestWithUser).user?.role, UserRole.ADMIN)) res.status(403).json({ error: 'Forbidden' });
    else next();
};
