import express from 'express';
import { addUser, deleteUser, getAllUsers, login, logout, register, updateProfile} from '../controllers/userControllers.js';
import protectedRoutes from '../middlewares/protectedRoutes.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.get('/getAllUsers',protectedRoutes, getAllUsers);
router.delete('/deleteUser/:id',protectedRoutes, deleteUser);
router.patch('/updateProfile',protectedRoutes, updateProfile);
router.post('/adduser',protectedRoutes, addUser);

export default router;