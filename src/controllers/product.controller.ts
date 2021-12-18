import { NextFunction, Request, Response } from 'express';
import ProductService from '@/services/product.service';
import { Product } from '@/interfaces/product.interface';
import UserService from '@/services/user.service';
import { User } from '@/interfaces/user.interface';

class ProductController {
    public productService = new ProductService();
    public userService = new UserService();


    public getProducts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const isPopulate: boolean = (req.query.isPopulate === 'true');
            const findAllProductsData: Product[] = await this.productService.findAllProduct(isPopulate);

            res.status(200).json(findAllProductsData);
        } catch (error) {
            next(error);
        }
    };

    public getProductById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId: string = req.params.id;
            const isPopulate: boolean = (req.query.isPopulate === 'true');
            const findOneProductData: Product = await this.productService.findProductById(productId, isPopulate);

            res.status(200).json(findOneProductData);
        } catch (error) {
            next(error);
        }
    };

    public createProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productData: Product = req.body;
            const createProductData: Product = await this.productService.createProduct(productData);

            res.status(201).json(createProductData);
        } catch (error) {
            next(error);
        }
    };

    public addToFavoriteProduct = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const productId: string = req.params.id;
            const userId: string = req.body.userId;

            const addToFavoriteData: User = await this.userService.addToFavoriteProduct(userId, productId);

            res.status(200).json(addToFavoriteData);
        } catch (error) {
            next(error);
        }
    }
}

export default ProductController;
