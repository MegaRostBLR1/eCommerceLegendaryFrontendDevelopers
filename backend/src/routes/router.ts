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
import { categoriesController } from '../controllers/categories.controller';
import { categoriesValidators } from './validators/categories.validator';
import { servicesController } from '../controllers/services.controller';
import { servicesValidators } from './validators/services.validators';

export const router = express.Router();
const middlewaresRoutes: string[] = ['/users', '/users/:id', '/categories', '/categories/:id', '/services', '/services/:id', 'services/most/used'];
const middlewaresRoutesAuth: string[] = ['/users', '/users/:id', '/categories/:id'];

router.all(middlewaresRoutesAuth, authMiddleware);
router.all(middlewaresRoutes, loggerMiddleware, authMiddleware, disconnectDbMiddleware);
router.patch(['/services/:id'], authMiddleware);
router.post(['categories'], authMiddleware);

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
router
    .route('/categories')
    .get(categoriesController.allCategories)
    .post(categoriesValidators.categoryCrate, validateErrors, permissionMiddleware, categoriesController.createCategory);
router
    .route('/categories/:id')
    .get(categoriesValidators.categoryId, validateErrors, categoriesController.categoryById)
    .patch(
        categoriesValidators.categoryId,
        categoriesValidators.categoryUpdate,
        validateErrors,
        permissionMiddleware,
        categoriesController.updateCategory,
    )
    .delete(categoriesValidators.categoryId, validateErrors, permissionMiddleware, categoriesController.removeCategory);
router.route('/services/most/used').get(servicesController.mostUsed);
router
    .route('/services')
    .get(servicesValidators.all, validateErrors, servicesController.allServices)
    .post(servicesValidators.serviceCreate, validateErrors, permissionMiddleware, servicesController.createService);
router
    .route('/services/:id')
    .get(servicesValidators.serviceId, validateErrors, categoriesController.categoryById)
    .patch(servicesValidators.serviceId, servicesValidators.serviceUpdate, validateErrors, permissionMiddleware, servicesController.updateService)
    .delete(servicesValidators.serviceId, validateErrors, permissionMiddleware, servicesController.removeService);

export default router;
