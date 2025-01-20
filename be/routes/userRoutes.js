import { Router } from 'express';
import { getUsers, getUser, addUser, deleteUser, updateUser } from '../controllers/userController.js';
import { validateUserRegistration } from '../middlewares/userValidatorMiddleware.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const userRouter = Router();

userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', validateUserRegistration, addUser);
userRouter.delete('/:id', isAuthenticated, deleteUser);
userRouter.put('/:id', isAuthenticated, validateUserRegistration, updateUser);

export default userRouter;
