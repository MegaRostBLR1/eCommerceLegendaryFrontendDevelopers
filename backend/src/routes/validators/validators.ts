import { body } from 'express-validator';

export const validators = {
    login: [body('email').isEmail().withMessage('Email required'), body('password').isString().isLength({ min: 3 }).withMessage('Password required')],
};
