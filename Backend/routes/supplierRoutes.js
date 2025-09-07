import express from "express";
import { addSupplier, deleteSupplier, getAllSuppliers, updateSupplier } from "../controllers/supplierControllers.js";
import protectedRoutes from "../middlewares/protectedRoutes.js";
const router = express.Router();

router.post("/addSupplier", protectedRoutes, addSupplier);
router.get("/getAllSuppliers", protectedRoutes, getAllSuppliers);
router.patch("/updateSupplier/:id", protectedRoutes, updateSupplier);
router.delete("/deleteSupplier/:id", protectedRoutes, deleteSupplier);

export default router;