import { Category } from "../models/categoryModels.js";


export const addCategory = async(req, res) => {
      try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin'){
            return res.status(403).json({message: "Only admin can add category"});
        }
        const { name, description } = req.body;
        if(!name || !description){
          return res.status(400).json({ message: "All fields are required" });
        }
        const existingCategory = await Category.findOne({ name });
        if(existingCategory){
            return res.status(409).json({ message: "This Category already exists" });
        }
        const category = await Category.create({ name, description });
        res.status(201).json({
            success: true,
            message: "Category added successfully",
            category
        });
      } catch (error) {
        console.log("error occur in addCategory controller", error);
        res.status(500).json({ message: "Internal server error in addCategory" });
      }
}


export const getAllCategories = async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin'){
            return res.status(403).json({message: "Only admin fetch categories"});
        }
        const categories = await Category.find({});
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        console.log("error occur in getAllCategories controller", error);
        res.status(500).json({ message: "Internal server error in getAllCategories" });
    }
}


export const updateCategory = async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin'){
            return res.status(403).json({message: "Only admin can edit category"});
        }
        const { name, description } = req.body;
        if(!name || !description){
          return res.status(400).json({ message: "Fill all the fields to change" });
        }
        const categoryId = req.params.id;
        const category = await Category.findByIdAndUpdate(
            categoryId,
            { name, description },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.log("error occur in editCategory controller", error);
        res.status(500).json({ message: "Internal server error in editCategory" });
    }
}


export const deleteCategory = async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin'){
            return res.status(403).json({message: "Only admin can delete category"});
        }
        const categoryId = req.params.id;
        await Category.findByIdAndDelete(categoryId);
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        console.log("error occur in deleteCategory controller", error);
        res.status(500).json({ message: "Internal server error in deleteCategory" });
    }
}