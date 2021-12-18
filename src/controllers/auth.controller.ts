import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/user.interface';
import AuthService from '@services/auth.service';
import { isEmpty } from '@/utils/util';

class AuthController {
    public authService = new AuthService();

    public signUp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            const signUpUserData: User = await this.authService.signUp(userData);
      
            res.status(201).json(signUpUserData);
        } catch (error) {
            next(error);
        }
    }

    public logIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            const { cookie, findUser } = await this.authService.logIn(userData);
      
            res.setHeader('Set-Cookie', [cookie]);
            res.status(200).json(findUser);
        } catch (error) {
            next(error);
        }
    }

    public logOut = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.session.user;
            const logoutUserData: User = await this.authService.logOut(userData);
      
            res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
            res.status(200).json(logoutUserData);
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;