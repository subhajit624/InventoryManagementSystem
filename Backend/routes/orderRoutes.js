import express from 'express';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { changeOrderStatus, deleteOrder, getAllOrders, getUserOrders, placeOrder } from '../controllers/orderControllers.js';
const router = express.Router();


router.post('/placeOrder', protectedRoutes, placeOrder);
router.patch('/changeOrderStatus', protectedRoutes, changeOrderStatus);
router.get('/getAllOrders', protectedRoutes, getAllOrders);
router.get('/getUserOrders', protectedRoutes, getUserOrders);
router.delete('/deleteOrder/:id', protectedRoutes, deleteOrder);


export default router;