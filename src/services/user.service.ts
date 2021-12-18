import bcrypt from 'bcrypt';
import userModel from '@models/user.model';
import { User } from '@interfaces/user.interface';
import { isEmpty } from '@utils/util';
import { HttpErrorException } from '@/exceptions/http-error.exception';
import { Product } from '@/interfaces/product.interface';
import ProductService from './product.service';

class UserService {
    public users = userModel;
    public ProductService = new ProductService();

    public async findAllUser(): Promise<User[]> {
        const users: User[] = await this.users.find();
        return users;
    }

    public async findUserById(userId: string, isPopulate: boolean = false): Promise<User> {
        if (isEmpty(userId)) throw new HttpErrorException(400, "The user identifier cannot be left blank.");
    
        const findUser: User = await this.users.findOne({ _id: userId }).populate(isPopulate ? 'favoriteProducts':'');
        if (!findUser) throw new HttpErrorException(409, "The user doesn't exists.");
    
        return findUser;
    }

    public async createUser(userData: User): Promise<User> {
        if (isEmpty(userData)) throw new HttpErrorException(400, "The body cannot be left blank.");
    
        const findUser: User = await this.users.findOne({ email: userData.email });
        if (findUser) throw new HttpErrorException(409, `The email ${userData.email} already exists.`);
    
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const createUserData: User = await this.users.create({ ...userData, password: hashedPassword });
    
        return createUserData;
    }

    public async addToFavoriteProduct(userId: string, productId: string): Promise<User> {
        if (isEmpty(userId)) throw new HttpErrorException(400, "The user identifier cannot be left blank.");

        if (isEmpty(productId)) throw new HttpErrorException(400, "The product identifier cannot be left blank.");

        const findProduct: Product = await this.ProductService.findProductById(productId);

        if (!findProduct) throw new HttpErrorException(409, "The product doesn't exists.");

        const updateUserById: User = await this.users.findByIdAndUpdate(userId, { 
            $push: { favoriteProducts: productId } 
        }, { new: true });

        if (!updateUserById) throw new HttpErrorException(409, "The user doesn't exists.");
    
        return updateUserById;
    }
}

export default UserService;