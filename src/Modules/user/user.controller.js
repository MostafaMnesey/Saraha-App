import { Router } from "express";
import {
  authMiddleware,
  authorization,
} from "../../Middlewares/auth.middleware.js";
import * as userService from "./user.service.js";
import { endPoint } from "./authorization.user.js";
const router = Router();
router.get(
  "/",
  authMiddleware(),
  userService.getUser
);
export default router;
