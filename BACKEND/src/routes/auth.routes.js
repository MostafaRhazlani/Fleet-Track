import { Router } from "express";
import AuthController from "../controllers/auth.controller.js";
import AuthService from "../services/auth.service.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import UserRepository from "../repositories/user.repository.js";
import AuthGuard from "../middleware/auth.guard.js";

const router = Router();

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);
const authMiddleware = new AuthMiddleware();
const authGuard = new AuthGuard();

router.post("/register", authMiddleware.validateRegister(), authController.register.bind(authController));
router.post("/login", authMiddleware.validateLogin(), authController.login.bind(authController));
router.post('/logout', authGuard.requireAuth, authController.logout.bind(authController));
router.get("/me", authGuard.requireAuth, authController.getAutenticatedUser.bind(authController));

export default router;
