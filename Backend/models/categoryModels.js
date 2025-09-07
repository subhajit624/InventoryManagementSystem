import mongoose from "mongoose";

const categoryModels = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true,
    },      
    description: {
        type: String,
        required: true
    }
   },
    { timestamps: true }
);

export const Category = mongoose.model('Category', categoryModels);