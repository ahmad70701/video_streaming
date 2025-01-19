import { Router } from "express";
import { login, logout } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post('/login',login);
authRouter.post('/logout',isAuthenticated,logout);

export default authRouter;