import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '@interfaces/user.interface';
import userModel from '@models/user.model';
import { isEmpty } from '@utils/util';
import { HttpErrorException } from '@/exceptions/http-error.exception';
import { readFileSync } from 'fs';

class AuthService {
    public users = userModel;

    public async signUp(userData: User): Promise<User> {
        if (isEmpty(userData)) throw new HttpErrorException(400, "The body cannot be left blank.");
    
        const findUser: User = await this.users.findOne({ email: userData.email });
        if (findUser) throw new HttpErrorException(409, `The email ${userData.email} already exists.`);
    
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
    
        return createUserData;
    }

    public async logIn(userData: User): Promise<{ cookie: string; findUser: User }> {
        if (isEmpty(userData)) throw new HttpErrorException(400, "The body cannot be left blank.");

        const findUser: User = await this.users.findOne({ email: userData.email });
        if (!findUser) throw new HttpErrorException(409, `The email ${userData.email} doesn't exists.`);

        const isPasswordMatching: boolean = await bcrypt.compare(userData.password, findUser.password);
        if (!isPasswordMatching) throw new HttpErrorException(409, "The password is invalid.");

        const tokenData = this.createToken(findUser);
        const cookie = this.createCookie(tokenData);

        return { cookie, findUser };
    }

    public async logOut(userData: User): Promise<User> {
        if (isEmpty(userData)) throw new HttpErrorException(400, "The body cannot be left blank.");

        const findUser: User = await this.users.findOne({ email: userData.email, password: userData.password });
        if (!findUser) throw new HttpErrorException(409, `The email ${userData.email} doesn't exists.`);

        return findUser;
    }

    public createToken(user: User) {
        const privateKeyBuffer = readFileSync(`${process.env.KEYS_DIR}/private.key`);
        const expiresIn: number = 60 * 60;

        const data = JSON.stringify(user);

        const token = jwt.sign(
            data,
            privateKeyBuffer,
            { algorithm: 'RS256' },
            { expiresIn: expiresIn }
        );

        return { expiresIn, token };
    }

    public createCookie(tokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
    }
}

export default AuthService;