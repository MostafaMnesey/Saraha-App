import { Router } from "express";
import * as authService from "./auth.service.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";


const router = Router();
router.post("/signup", authService.signup);
router.post("/signUp-google", authService.signUpGoogle);
router.post("/login", authService.login);
router.post("/login-google", authService.loginGoogle);
router.patch("/confirm-email", authService.confirmEmail);

export default router;
