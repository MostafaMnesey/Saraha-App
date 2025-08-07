import { asyncHandler, succssesResponse } from "../../utils/response.js";
import * as DbService from "../../DB/db.service.js";
import UserModel from "../../DB/Models/User/User.model.js";
import { decryptText } from "../../utils/encryption.security.js";
import { getLogindata } from "../Auth/auth.service.js";
export const getUser = asyncHandler(async (req, res, next) => {
  req.user.phone = await decryptText({ text: req.user?.phone });
  return succssesResponse({ res, data: req.user });
});
export const shareProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await DbService.findById({
    model: UserModel,
    id,
    select: "-password",
  });
  user.phone = await decryptText({ text: user.phone });

  return user
    ? succssesResponse({ res, data: user })
    : next(new Error("User not found", { cause: 404 }));
});

export const getNewLoginCredentials = asyncHandler(async (req, res, next) => {
  const credentials = await getLogindata(req.user);
  return succssesResponse({ res, data: credentials });
});
