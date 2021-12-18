import { Router } from 'express';
import ProductController from '@controllers/product.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';

class ProductRoute implements Routes {
    public path = '/products';
    public router = Router();
    public productController = new ProductController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.productController.getProducts);
        this.router.get(`${this.path}/:id`, this.productController.getProductById);
        this.router.post(`${this.path}`, authMiddleware, this.productController.createProduct);
        this.router.post(`${this.path}/:id/favorites`, authMiddleware, this.productController.addToFavoriteProduct);
    }
}

export default ProductRoute;
