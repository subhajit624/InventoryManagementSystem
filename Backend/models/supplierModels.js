import mongoose from 'mongoose';

const supplierModels = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

export const Supplier = mongoose.model('Supplier', supplierModels);