import express from 'express';
import protectedRoutes from '../middlewares/protectedRoutes.js';
import { loginUserdata } from '../controllers/loginUserData.js';
const router = express.Router();

router.get('/me', protectedRoutes, loginUserdata);

export default router;