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
const allowedOrigins = [
    "https://inventorymanagementsystem-frontend-gffk.onrender.com", // 🔥 hardcoded
    process.env.FRONTEND_URL        // 🔥 from env
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



// routes
app.get("/", (req, res) => {
  res.send("Server is working fine ");
});
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
