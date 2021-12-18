import { model, Schema, Document, SchemaTypes } from 'mongoose';
import { Category } from '@/interfaces/category.interface';

const categorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        default: ''
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

const categoryModel = model<Category & Document>('Category', categorySchema);

export default categoryModel;