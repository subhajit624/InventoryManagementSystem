import { Supplier } from "../models/supplierModels.js";


export const addSupplier = async (req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin') {
            return res.status(403).json({message: "Only admin can add supplier"});
        }
        const {name, gmail, phone, address} = req.body;
        if(!name || !gmail || !phone || !address) {
            return res.status(400).json({message: "All fields are required"});
        }
        const existingSupplier = await Supplier.findOne({$or: [{name}, {gmail}]});
        if(existingSupplier) {
            return res.status(409).json({message: "Supplier with this name or gmail already exists"});
        }
        const supplier = await Supplier.create({name, gmail, phone, address});
        res.status(201).json({
            success: true,
            message: "Supplier added successfully",
            supplier
        });
    } catch (error) {
        console.log("Error in adding supplier:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const getAllSuppliers = async (req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin') {
            return res.status(403).json({message: "Only admin can fetch all suppliers"});
        }
        const suppliers = await Supplier.find({});
        res.status(200).json({
            success: true,
            message: "Suppliers fetched successfully",
            suppliers
        });
    } catch (error) {
        console.log("Error in fetching suppliers:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const updateSupplier = async (req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin') {
            return res.status(403).json({message: "Only admin can update supplier"});
        }
        const {name, gmail, phone, address} = req.body;
        const supplierId = req.params.id;
        if(!name || !gmail || !phone || !address) {
            return res.status(400).json({message: "All fields are required"});
        }
        const supplier = await Supplier.findByIdAndUpdate( supplierId, {name, gmail, phone, address}, {new: true});
        res.status(200).json({
            success: true,
            message: "Supplier updated successfully",
            supplier
        });

    } catch (error) {
        console.log("Error in updating supplier:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}


export const deleteSupplier = async (req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin') {
            return res.status(403).json({message: "Only admin can delete supplier"});
        }
        const supplierId = req.params.id;
        await Supplier.findByIdAndDelete(supplierId);
        res.status(200).json({
            success: true,
            message: "Supplier deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleting supplier:", error);
        res.status(500).json({message: "Internal Server Error"});
    }
}