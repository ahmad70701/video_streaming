import { Router } from "express";
import { login, logout, authenticate } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post('/login', login);
authRouter.get('/authenticate',isAuthenticated, authenticate);
authRouter.post('/logout',isAuthenticated,logout);

export default authRouter;