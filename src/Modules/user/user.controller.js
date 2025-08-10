import { Router } from "express";
import {
  authMiddleware,
  authorization,
} from "../../Middlewares/auth.middleware.js";
import * as userService from "./user.service.js";
import { endPoint } from "./authorization.user.js";
import { tokenTypeEnum } from "../../utils/token.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";

const router = Router();
router.get("/", authMiddleware(), userService.getUser);
router.get(
  "/credentials",
  authMiddleware({ tokenType: tokenTypeEnum.refresh }),
  userService.getNewLoginCredentials
);
router.get(
  "/:id/share",
  validation(userValidation.shareProfile),
  userService.shareProfile
);

router.patch(
  "/update",
  authMiddleware(),
  validation(userValidation.updateUserBasic),
  userService.updateUserBasic
);

router.patch(
  "/update-password",
  authMiddleware(),
  validation(userValidation.updatePassword),
  userService.updatePassword
);

export default router;
