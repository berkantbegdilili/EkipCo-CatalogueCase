import productModel from '@models/product.model';
import { Product } from '@interfaces/product.interface';
import { isEmpty } from '@/utils/util';
import { HttpErrorException } from '@/exceptions/http-error.exception';

class ProductService {
    public products = productModel;

    public async findAllProduct(isPopulate: boolean = false): Promise<Product[]> {
        const products: Product[] = await this.products.find().populate(isPopulate ? 'category':'');
        return products;
    }

    public async findProductById(productId: string, isPopulate: boolean = false): Promise<Product> {
        if (isEmpty(productId)) throw new HttpErrorException(400, "The product identifier cannot be left blank.");
    
        const findProduct: Product = await this.products.findOne({ _id: productId }).populate(isPopulate ? 'category':'');
        if (!findProduct) throw new HttpErrorException(409, "The product doesn't exists.");
    
        return findProduct;
    }

    public async findProductsByCategoryId(categoryId: string, isPopulate: boolean = false): Promise<Product[]> {
        if (isEmpty(categoryId)) throw new HttpErrorException(400, "The category identifier cannot be left blank.");
    
        const findProducts: Product[] = await this.products.find({ categoryId: categoryId }).populate(isPopulate ? 'category':'');
        if (!findProducts) throw new HttpErrorException(409, "The product doesn't exists.");

        return findProducts;
    }

    public async createProduct(productData: Product): Promise<Product> {
        if (isEmpty(productData)) throw new HttpErrorException(400, "The body cannot be left blank.");
    
        const createProductData: Product = await this.products.create({ ...productData });
    
        return createProductData;
    }
}

export default ProductService;