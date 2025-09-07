import mongoose from 'mongoose';

const productModels = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    supplier: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Supplier',
        required: true
    }
},
    { timestamps: true }
);

export const Product = mongoose.model('Product', productModels);