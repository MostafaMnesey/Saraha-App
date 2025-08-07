import { Router } from "express";
import * as authService from "./auth.service.js";
import { authMiddleware } from "../../Middlewares/auth.middleware.js";
import { validation } from "../../Middlewares/authValidation.middleware.js";
import * as authValidation from "./auth.validation.js";

const router = Router();
router.post("/signup", validation(authValidation.signUp), authService.signup);
router.post(
  "/signUp-google",
  validation(authValidation.googleService),
  authService.signUpGoogle
);
router.post("/login", validation(authValidation.login), authService.login);
router.post(
  "/login-google",
  validation(authValidation.googleService),
  authService.loginGoogle
);
router.patch(
  "/confirm-email",
  validation(authValidation.confirmEmail),
  authService.confirmEmail
);

export default router;
