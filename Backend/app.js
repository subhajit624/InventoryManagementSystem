import express from "express";
import dotenv from "dotenv";
dotenv.config({});
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import supplierRoutes from  "./routes/supplierRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import frontendGetRoutes from "./routes/frontendGetRoutes.js";
import cors from "cors";
import paymentRoutes from "./routes/paymentRoutes.js";


const app = express();

// Middleware
app.use(cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true, 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// routes
app.use('/api/users',userRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/supplier',supplierRoutes);
app.use('/api/product',productRoutes);
app.use('/api/order',orderRoutes);
app.use('/api/frontend',frontendGetRoutes);

// Payment route
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});