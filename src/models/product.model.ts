import { model, Schema, Document, SchemaTypes } from 'mongoose';
import { Product } from '@/interfaces/product.interface';

const productSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    categoryId: {
        type: SchemaTypes.ObjectId,
        ref: 'Category',
        required: true
    },
    images : {
        type: [String],
        required: true,
        default: []
    },
    price: {
        type: Number,
        required: true
    }
}, {
    versionKey: false,
    id: false,
    toJSON: { 
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

productSchema.virtual('category', {
    ref: 'Category', 
    localField: 'categoryId', 
    foreignField: '_id'
});

const productModel = model<Product & Document>('Product', productSchema);

export default productModel;