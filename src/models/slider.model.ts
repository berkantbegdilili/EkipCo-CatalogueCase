import { model, Schema, Document, SchemaTypes } from 'mongoose';
import { Slider } from '@/interfaces/slider.interface';

const sliderSchema: Schema = new Schema({
    image: {
        type: String,
        required: true
    },
    productId: {
        type: SchemaTypes.ObjectId,
        ref: 'Product',
        required: true
    },
    priority: {
        type: Number,
        required: true,
        unique: true
    },
    expiredAt: {
        type: Date
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

const sliderModel = model<Slider & Document>('Slider', sliderSchema);

export default sliderModel;