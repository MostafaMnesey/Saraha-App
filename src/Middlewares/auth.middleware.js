import { asyncHandler } from "../utils/response.js";
import { decodeToken, tokenTypeEnum } from "../utils/token.js";

export const authMiddleware = () => {
  return asyncHandler(async (req, res, next) => {
    req.user = await decodeToken({
      authorization: req.headers.authorization,
      tokenType: tokenTypeEnum.access,
      next,
    });

    return next();
  });
};

export const authorization = (role = []) => {
  return asyncHandler(async (req, res, next) => {
    if (!role.includes(req.user.role)) {
      return next(new Error("unauthorized", { cause: 403 }));
    }
    return next();
  });
};
