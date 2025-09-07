import { Order } from "../models/orderModels.js";
import { Product } from "../models/productModels.js";


export const placeOrder = async(req, res) => {
    try {
        const { productId , quantity} = req.body;
        if(!productId || !quantity){
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const loggedInUser = req.user;
        const currentProduct = await Product.findById(productId);
        if(currentProduct.stock < quantity){
            return res.status(400).json({ message: "Insufficient stock available" });
        }
        const order = await Order.create({ user: loggedInUser._id, products: [{ product: productId, quantity }], status: 'pending' });
        // Decrease the stock of the product
        currentProduct.stock -= quantity;
        await currentProduct.save();
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        console.log("Error in placing order", error);
        res.status(500).json({ message: "Error occur in placing the order" });
    }
}


export const changeOrderStatus = async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin'){
            return res.status(403).json({message: "Only admin can change order status"});
        }
        const { orderId , status} = req.body;
        if(!orderId || !status){
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({ message: "No order found" });
        }
        if(!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)){
            return res.status(400).json({ message: "Invalid status value" });
        }
        if(order.status === 'cancelled' && status !== 'cancelled'){
            return res.status(400).json({ message: "Cannot change status of a cancelled order" });
        }
        order.status = status;
        await order.save();
        if (status === 'cancelled') {
        for(const item of order.products){
            const product = await Product.findById(item.product);
            if(product){
                product.stock += item.quantity;
                await product.save();
            }
            }
        }
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.log("Error in changing order status", error);
        res.status(500).json({ message: "Error occur in changing the order status" });
    }
}


export const getAllOrders = async(req, res) => {
    try {
        const loggedInUser = req.user;
        if(loggedInUser.role !== 'admin'){
            return res.status(403).json({message: "Only admin can fetch all orders"});
        }
        const orders = await Order.find({}).populate('user').populate('products.product');
        res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            orders
        });
    } catch (error) {
        console.log("Error in fetching all orders", error);
        res.status(500).json({ message: "Error occur in fetching all orders" });
    }
}


export const getUserOrders = async(req, res) => {
    try {
        const loggedInUser = req.user;
        const orders = await Order.find({ user: loggedInUser._id }).populate('products.product');
        res.status(200).json({
            success: true,
            message: "User orders fetched successfully",
            orders
        });
    } catch (error) {
        console.log("Error in fetching user orders", error);
        res.status(500).json({ message: "Error occur in fetching user orders" });
    }
}


export const deleteOrder = async(req, res) => { 
    try {
        const loggedInUser = req.user;
        const orderId = req.params.id;
        const order = await Order.findById(orderId);
        if(!order){
            return res.status(404).json({ message: "No order found" });
        }
        if(loggedInUser.role !== 'admin' && order.user.toString() !== loggedInUser._id.toString()){
            return res.status(403).json({message: "You are not authorized to delete this order"});
        }
        for(const item of order.products){
            const product = await Product.findById(item.product);
            if(product){
                product.stock += item.quantity;
                await product.save();
            }
        }
        await Order.findByIdAndDelete(orderId);
        res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        });
    }
    catch (error) {
        console.log("Error in deleting user order", error);
        res.status(500).json({ message: "Error occur in deleting user order" });
    }
}