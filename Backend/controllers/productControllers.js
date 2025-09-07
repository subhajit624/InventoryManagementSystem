import { Product } from "../models/productModels.js";


export const addProduct = async(req, res) => {
    try {
        const { name, stock, price, categoryId, supplierId } = req.body;
        if(!name || !stock || !price || !categoryId || !supplierId){
            return res.status(400).json({ message: "Fill all the fields to add product" });
        }
        const savedProduct = await Product.create({ name, stock, price, category: categoryId, supplier: supplierId });
        const product = await Product.findById(savedProduct._id).populate('category').populate('supplier');
        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });
    } catch (error) {
        console.log("Error in adding product", error);
        res.status(500).json({ message: "Error occur in adding the product" });
    }
}


export const getAllProducts = async(req, res) => {
    try {
        const products = await Product.find({}).populate('category').populate('supplier');
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });
    } catch (error) {
        console.log("Error in fetching products", error);
        res.status(500).json({ message: "Error occur in fetching the products" });
    }
}


export const updateProduct = async(req, res) => {
    try {
        const { name, stock, price, categoryId, supplierId } = req.body;
        if(!name || !stock || !price || !categoryId || !supplierId){
            return res.status(400).json({ message: "Fill all the fields to update product" });
        }
        const productId = req.params.id;
        const existingProduct = await Product.findById(productId);
        if(!existingProduct){
            return res.status(404).json({ message: "No product found" });
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, { name, stock, price, category: categoryId, supplier: supplierId }, { new: true });
        const product = await Product.findById(updatedProduct._id).populate('category').populate('supplier');
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.log("Error in updating product", error);
        res.status(500).json({ message: "Error occur in updating the product" });
    }
}


export const deleteProduct = async(req, res) => {
    try {
        const productId = req.params.id;
        const existingProduct = await Product.findById(productId);
        if(!existingProduct){
            return res.status(404).json({ message: "No product found" });
        }
        await Product.findByIdAndDelete(productId);
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleting product", error);
        res.status(500).json({ message: "Error occur in deleting the product" });
    }
}