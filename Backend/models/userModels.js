import mongoose from 'mongoose';

const userModels = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gmail: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    }
},
	{ timestamps: true }
);

export const User = mongoose.model('User', userModels);