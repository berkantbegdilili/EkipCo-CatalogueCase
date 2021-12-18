import { NextFunction, Request, Response } from 'express';
import { User } from '@interfaces/user.interface';
import userService from '@services/user.service';

class UserController {
    public userService = new userService();

    public getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllUsersData: User[] = await this.userService.findAllUser();

            res.status(200).json(findAllUsersData);
        } catch (error) {
            next(error);
        }
    };

    public getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.params.id;
            const isPopulate: boolean = (req.query.isPopulate === 'true');

            const findOneUserData: User = await this.userService.findUserById(userId, isPopulate);

            res.status(200).json(findOneUserData);
        } catch (error) {
            next(error);
        }
    };

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: User = req.body;
            const createUserData: User = await this.userService.createUser(userData);

            res.status(201).json(createUserData);
        } catch (error) {
            next(error);
        }
    };
}

export default UserController;
