import { Router } from 'express';
import CategoryController from '@controllers/category.controller';
import { Routes } from '@interfaces/routes.interface';
import authMiddleware from '@middlewares/auth.middleware';

class CategoryRoute implements Routes {
    public path = '/categories';
    public router = Router();
    public categoryController = new CategoryController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.categoryController.getCategories);
        this.router.get(`${this.path}/:id`, this.categoryController.getCategoryById);
        this.router.get(`${this.path}/:id/products`, this.categoryController.getProductsByCategoryId);
        this.router.post(`${this.path}`, authMiddleware, this.categoryController.createCategory);
    }
}

export default CategoryRoute;
