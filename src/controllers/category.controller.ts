import { NextFunction, Request, Response } from 'express';
import { Category } from '@interfaces/category.interface';
import categoryService from '@services/category.service';
import productService from '@/services/product.service';
import { Product } from '@/interfaces/product.interface';

class CategoryController {
    public categoryService = new categoryService();
    public productService = new productService();

    public getCategories = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const findAllCategoriesData: Category[] = await this.categoryService.findAllCategory();

            res.status(200).json(findAllCategoriesData);
        } catch (error) {
            next(error);
        }
    };

    public getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId: string = req.params.id;
            const findOneCategoryData: Category = await this.categoryService.findCategoryById(categoryId);

            res.status(200).json(findOneCategoryData);
        } catch (error) {
            next(error);
        }
    };

    public getProductsByCategoryId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryId: string = req.params.id;
            const isPopulate: boolean = (req.query.isPopulate === 'true');

            const findAllProductsData: Product[] = await this.productService.findProductsByCategoryId(categoryId, isPopulate);

            res.status(200).json(findAllProductsData);
        } catch (error) {
            next(error);
        }
    };

    public createCategory = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const categoryData: Category = req.body;
            const createCategoryData: Category = await this.categoryService.createCategory(categoryData);

            res.status(201).json(createCategoryData);
        } catch (error) {
            next(error);
        }
    };
}

export default CategoryController;
