import express from 'express';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { addCategory, deleteCategory, getAllCategories, updateCategory } from '../controllers/categoryControllers.js';
const router = express.Router();

router.post("/addCategory",protectedRoutes, addCategory);
router.get("/getAllCategories",protectedRoutes, getAllCategories);
router.patch("/updateCategory/:id",protectedRoutes, updateCategory);
router.delete("/deleteCategory/:id",protectedRoutes, deleteCategory);

export default router;