import { body, param } from 'express-validator';
import { HttpException } from '../../exceptions/exception';
import { categoriesService } from '../../services/categories.service';

export const categoriesValidators = {
    categoryId: [
        param('id')
            .isInt()
            .toInt()
            .custom(async (id) => {
                if (await categoriesService.getCategoryById(id)) return true;
                else throw new HttpException(400, 'Not exist entity');
            })
            .withMessage('Not exist entity'),
    ],
    categoryCrate: [body('name').isString(), body('description').optional().isString()],
    categoryUpdate: [body('name').optional().isString(), body('description').optional().isString()],
};
