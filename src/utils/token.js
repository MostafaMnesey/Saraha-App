import jwt from "jsonwebtoken";
import * as DbService from "../DB/db.service.js";
import UserModel from "../DB/Models/User/User.model.js";
export const signatureTypeEnum = {
  user: "Bearer",
  System: "System",
};
export const tokenTypeEnum = {
  access: "access",
  refresh: "refresh",
};

export const genetrateToken = ({
  payLoad = {},
  secKey = "",
  expiresIn = "",
}) => {
  return jwt.sign(payLoad, secKey, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });
};

export const verifyToken = async ({ token = "", secKey = "" } = {}) => {
  return jwt.verify(token, secKey);
};
export const getSignatures = async ({
  signatureLevel = signatureTypeEnum.user,
} = {}) => {
  const Signature = { accessSign: undefined, refreshSign: undefined };
  switch (signatureLevel) {
    case signatureTypeEnum.System:
      Signature.accessSign = process.env.ACCESS_TOKEN_ADMIN_SECRET;
      Signature.refreshSign = process.env.REFRESH_TOKEN_ADMIN_SECRET;
      break;

    default:
      Signature.accessSign = process.env.ACCESS_TOKEN_USER_SECRET;
      Signature.refreshSign = process.env.REFRESH_TOKEN_USER_SECRET;
      break;
  }
  return Signature;
};

export const decodeToken = async ({
  authorization = "",
  tokenType = tokenTypeEnum.access,
  next,
} = {}) => {
  const [Bearer, token] = authorization?.split(" ") || [];

  if (!token || !Bearer) {
    return next(new Error("unauthenticated", { cause: 401 }));
  }

  const signature = await getSignatures({ signatureLevel: Bearer });
  const decoded = await verifyToken({

    token,
    secKey:tokenType===tokenTypeEnum.access? signature.accessSign: signature.refreshSign,
  });

  const user = await DbService.findById({
    model: UserModel,
    id: decoded.userId,
  });
  if (!user) {
    return next(new Error("Not registered", { cause: 401 }));
  }

  return user;
};
