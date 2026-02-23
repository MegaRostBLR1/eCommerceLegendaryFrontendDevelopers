import { body, query } from 'express-validator';

export const validators = {
    login: [body('email').isEmail().withMessage('Email required'), body('password').isString().isLength({ min: 3 }).withMessage('Password required')],
    search: [query('search').optional().isString().isLength({ min: 3 }).withMessage('Search minimum length is 3 symbols')],
};
