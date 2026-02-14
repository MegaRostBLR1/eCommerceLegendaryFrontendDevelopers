import express, { Request, Response } from 'express';
import { loggerMiddleware } from '../middlewares/logger/logger.middleware';
import { disconnectDbMiddleware } from '../middlewares/db/disconnect-db.middleware';
import { authController } from '../controllers/authorization.controller';
import { validators } from './validators/validators';
import { validateErrors } from '../middlewares/validation/validator-errors.middleware';
import { authMiddleware } from '../middlewares/auth/authorization.middleware';
import { usersController } from '../controllers/users.controllers';
import { permissionMiddleware } from '../middlewares/auth/check-role.middleware';
import { userValidators } from './validators/user.validators';
import { queryValidators } from './validators/query.validators';

export const router = express.Router();

router.all(['/users', '/users/:id'], loggerMiddleware, disconnectDbMiddleware);
router.all(['/users', '/users/:id'], authMiddleware);

router.get('/', async (_req: Request, res: Response) => {
    res.status(200).send(`<h1 style="text-align: center">Base app route</h1>`);
});

router.route('/login').post(...validators.login, validateErrors, authController.signInSignUp);
router
    .route('/users')
    .get(permissionMiddleware, queryValidators.query, validateErrors, usersController.allUsers)
    .post(permissionMiddleware, validators.login, userValidators.userUpdate, validateErrors, usersController.createUser);
router
    .route('/users/:id')
    .get(userValidators.userId, validateErrors, usersController.getUserById)
    .patch(userValidators.userId, userValidators.userUpdate, validateErrors, usersController.updateUser)
    .delete(userValidators.userId, validateErrors, permissionMiddleware, usersController.removeUser);

export default router;
