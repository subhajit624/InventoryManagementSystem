import express from 'express';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { addProduct, deleteProduct, getAllProducts, updateProduct } from '../controllers/productControllers.js';
const router = express.Router();

router.post('/addProduct', protectedRoutes, addProduct);
router.get('/getAllProducts', protectedRoutes, getAllProducts);
router.patch('/updateProduct/:id', protectedRoutes, updateProduct);
router.delete('/deleteProduct/:id', protectedRoutes, deleteProduct);

export default router;