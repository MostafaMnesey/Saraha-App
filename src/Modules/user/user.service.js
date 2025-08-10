import { asyncHandler, succssesResponse } from "../../utils/response.js";
import * as DbService from "../../DB/db.service.js";
import UserModel from "../../DB/Models/User/User.model.js";
import { decryptText, encryptText } from "../../utils/encryption.security.js";
import { getLogindata } from "../Auth/auth.service.js";
import { compareText, hashText } from "../../utils/hash.security.js";
import eventEmitter from "../../utils/Email/Email.event.js";
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

export const updateUserBasic = asyncHandler(async (req, res, next) => {
  if (req.body.phone)
    req.body.phone = await encryptText({ text: req.body.phone });
  const user = await DbService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      $set: req.body,
      $inc: {
        __v: 1,
      },
    },
  });

  return user
    ? succssesResponse({ res, data: user })
    : next(new Error("User not found", { cause: 404 }));
});

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, password } = req.body;
  const match = await compareText({
    text: oldPassword,
    hashedText: req.user.password,
  });
  console.log({
    oldPassword,
    password,
  });

  console.log(match);

  if (
    !(await compareText({ text: oldPassword, hashedText: req.user.password }))
  ) {
    return next(new Error("Invalid old password", { cause: 401 }));
  }

  const hashedPassword = await hashText({ text: password });
  console.log(hashedPassword);

  console.log(hashedPassword);

  const user = await DbService.findOneAndUpdate({
    model: UserModel,
    filter: { _id: req.user._id },
    data: {
      $set: {
        password: hashedPassword,
      },
    },
  });

  return user
    ? succssesResponse({ res, data: user })
    : next(new Error("User not found", { cause: 404 }));
});
