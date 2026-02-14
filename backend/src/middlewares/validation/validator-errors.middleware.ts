import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { LoggerLevel } from '../../enums/logger-level.enum';
const chalk = require('chalk');

export const validateErrors = (req: Request, res: Response, next: NextFunction): void | Response => {
    const validResult = validationResult(req);

    if (!validResult.isEmpty()) {
        const { method, url, ip } = req;
        console.log(chalk.red(`${LoggerLevel.ERROR}: ${new Date().toISOString()} ${method} ${url} ${ip} => ${JSON.stringify(validResult.array())}`));

        return res.status(403).json({ errors: validResult.array() });
    }

    next();
};
