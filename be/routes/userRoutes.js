import { Router } from 'express';
import { getUsers, getUser, addUser, deleteUser, updateUser } from '../controllers/userController.js';
import { validateUserRegistration } from '../middleWares/userValidatorMiddleware.js';

const userRouter = Router();
userRouter.get('/', getUsers);
userRouter.get('/:id', getUser);
userRouter.post('/',validateUserRegistration,addUser);
userRouter.delete('/:id', deleteUser);
userRouter.put('/:id', validateUserRegistration, updateUser);

export default userRouter;
