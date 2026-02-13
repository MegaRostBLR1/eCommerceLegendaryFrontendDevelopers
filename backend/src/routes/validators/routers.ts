import express, { Request, Response } from 'express';
export const router = express.Router();

// router.all('/*', loggerMiddleware, disconnectDbMiddleware);

router.get('/', async (_req: Request, res: Response) => {
    res.status(200).send(`<h1 style="text-align: center">Base app route</h1>`);
});

export default router;
