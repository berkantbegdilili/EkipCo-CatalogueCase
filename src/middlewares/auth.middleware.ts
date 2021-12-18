import { Request, NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import userModel from '@models/user.model';
import { HttpErrorException } from '@/exceptions/http-error.exception';
import { readFileSync } from 'fs';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies['Authorization'] || req.header('Authorization').split('Bearer ')[1] || null;
        const publicKey = readFileSync(`${process.env.KEYS_DIR}/public.pem`); 

        if (token) {
            const verificationResponse = await jwt.verify(token, publicKey, { algorithms: ['RS256'] });
            const userId = verificationResponse._id;
            const findUser = await userModel.findById(userId);

            if (findUser) {
                req.session.user = findUser;
                next();
            } else {
                next(new HttpErrorException(401, 'Wrong authentication token'));
            }
        } else {
            next(new HttpErrorException(404, 'Authentication token missing'));
        }
    } catch (error) {
        next(new HttpErrorException(401, 'Wrong authentication token'));
    }
};

export default authMiddleware;
