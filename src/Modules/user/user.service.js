import { asyncHandler, succssesResponse } from "../../utils/response.js";
import * as DbService from "../../DB/db.service.js";
import UserModel from "../../DB/Models/User/User.model.js";
import { decryptText } from "../../utils/encryption.security.js";
export const getUser = asyncHandler(async (req, res, next) => {
  console.log(req.user);
  
  const user = await DbService.findById({
    model: UserModel,
    id: req.user._id,
  });
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  user.phone = await decryptText({ text: user.phone });
  return succssesResponse({ res, data: user });
}); 
