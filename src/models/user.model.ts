import { model, Schema, Document, SchemaTypes } from 'mongoose';
import { User } from '@/interfaces/user.interface';

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    favoriteProducts: {
        type: [SchemaTypes.ObjectId],
        ref: 'Product',
        required: true,
        default: []
    }
}, {
    timestamps: true,
    versionKey: false,
    id: false,
    toJSON: { 
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

const userModel = model<User & Document>('User', userSchema);

export default userModel;