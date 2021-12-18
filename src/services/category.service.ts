import categoryModel from '@models/category.model';
import { Category } from '@interfaces/category.interface';
import { isEmpty } from '@/utils/util';
import { HttpErrorException } from '@/exceptions/http-error.exception';

class CategoryService {
    public categories = categoryModel;
    
    public async findAllCategory(): Promise<Category[]> {
        const categories: Category[] = await this.categories.find();
        return categories;
    }

    public async findCategoryById(categoryId: string): Promise<Category> {
        if (isEmpty(categoryId)) throw new HttpErrorException(400, "The category identifier cannot be left blank.");
    
        const findCategory: Category = await this.categories.findOne({ _id: categoryId });
        if (!findCategory) throw new HttpErrorException(409, "The category doesn't exists.");
    
        return findCategory;
    }

    public async createCategory(categoryData: Category): Promise<Category> {
        if (isEmpty(categoryData)) throw new HttpErrorException(400, "The body cannot be left blank.");
    
        const createCategoryData: Category = await this.categories.create({ ...categoryData });
    
        return createCategoryData;
    }
}

export default CategoryService;