import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (
    err: Error,
    req: Request,
    res: Response,
) => {
    console.log('Global Error: ', err.message);
    res.status(500).json({ message: err.message || 'Internal Server Error' });
}