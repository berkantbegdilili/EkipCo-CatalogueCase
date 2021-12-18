import { NextFunction, Request, Response } from 'express';
import { HttpErrorException } from '@/exceptions/http-error.exception';

const errorMiddleware = (error: HttpErrorException, req: Request, res: Response, next: NextFunction) => {
    try {
        const statusCode: number = error.statusCode || 500;
        const message: string = error.message || 'Something went wrong';
    
        res.status(statusCode).json({ message: message });
    } catch (error) {
        next(error);
    }
};

export default errorMiddleware;
