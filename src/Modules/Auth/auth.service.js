import UserModel, {
  providerEnum,
  roleEnum,
} from "../../DB/Models/User/User.model.js";
import * as DbService from "../../DB/db.service.js";
import { encryptText } from "../../utils/encryption.security.js";
import { compareText, hashText } from "../../utils/hash.security.js";
import { asyncHandler, succssesResponse } from "../../utils/response.js";
import { OAuth2Client } from "google-auth-library";
import sendEmail from "../../utils/Email/sendEmil.email.js";
import { customAlphabet } from "nanoid";
import eventEmitter from "../../utils/Email/Email.event.js";
import {
  genetrateToken,
  getSignatures,
  signatureTypeEnum,
} from "../../utils/token.js";
//helpers
async function verify(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.WEB_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return payload;
}

const getLogindata = async (user) => {
  const getSignature = await getSignatures({
    signatureLevel:
      user.role != roleEnum.user
        ? signatureTypeEnum.System
        : signatureTypeEnum.user,
  });

  const accessToken = genetrateToken({
    payLoad: { userId: user._id },
    secKey: getSignature.accessSign,
  });
  const refreshToken = genetrateToken({
    payLoad: { userId: user._id },
    secKey: getSignature.refreshSign,
  });
  return { accessToken, refreshToken };
};

// signUp System
export const signup = asyncHandler(async (req, res, next) => {
  //destructuring data from req.body
  const { phone, fullName, email, password, gender } = req.body;

  //validate request data
  //check if email already exists
  const checkEmailExists = await DbService.findOne({
    model: UserModel,
    filter: { email },
  });

  if (checkEmailExists) {
    return next(new Error("Email already exists", { cause: 409 }));
  }
  // hashing password
  const hashedPassword = await hashText({ text: password });
  // encrypt phone

  const encryptedPhone = await encryptText({ text: phone });
  console.log(encryptedPhone);
  const otp = customAlphabet("01234567", 6)();

  const hashedOtp = await hashText({ text: otp });

  //create user if email doesn't exist
  const user = await DbService.create({
    model: UserModel,
    data: [
      {
        phone: encryptedPhone,
        fullName,
        email,
        password: hashedPassword,
        gender,
        confirmEmailOtp: hashedOtp,
      },
    ],
  });
  eventEmitter.emit("sendEmail", { email, otp });

  return succssesResponse({ res, message: "Success", data: user });
});

// signUp Google
export const signUpGoogle = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const { email, name, picture, email_verified } = await verify(idToken);
  //check if email verified
  if (!email_verified) {
    return next(new Error("Email not verified", { cause: 401 }));
  }
  //check if email already exists
  const user = await DbService.findOne({ model: UserModel, filter: { email } });
  //check if email already exists
  if (user) {
    return next(new Error("Email already exists", { cause: 409 }));
  }

  const newUser = await DbService.create({
    model: UserModel,
    data: [
      {
        fullName: name,
        email,
        picture,
        role: roleEnum.user,
        confirmEmail: Date.now(),
        provider: providerEnum.google,
      },
    ],
  });

  return succssesResponse({
    message: "Success",
    res,
    status: 201,
    data: newUser,
  });
});
export const login = asyncHandler(async (req, res, next) => {
  //destructuring data from req.body
  const { email, password } = req.body;

  //check if user exists
  const checkUserExists = await DbService.findOne({
    model: UserModel,
    filter: { email },
    select: "",
  });
  // check if password is correct

  if (!checkUserExists) {
    return next(new Error("invalid login data", { cause: 401 }));
  }

  if (!checkUserExists?.confirmEmail) {
    return next(new Error("please verify your account", { cause: 401 }));
  }

  const matchPassword = await compareText({
    text: password,
    hashedText: checkUserExists.password,
  });

  if (!matchPassword) {
    return next(new Error("invalid login data", { cause: 401 }));
  }

  const data = await getLogindata(checkUserExists);
  return succssesResponse({
    res,
    message: "Success",
    data,
  });
});
export const confirmEmail = asyncHandler(async (req, res, next) => {
  //destructuring data from req.body
  const { email, otp } = req.body;

  //check if user exists
  const checkUserExists = await DbService.findOne({
    model: UserModel,
    filter: {
      email,
      confirmEmailOtp: { $exists: true },
      confirmEmail: { $exists: false },
    },
    select: "",
  });
  // check if password is correct

  if (!checkUserExists) {
    return next(new Error("invalid email", { cause: 401 }));
  }

  const matchHashedOtp = await compareText({
    text: otp,
    hashedText: checkUserExists.confirmEmailOtp,
  });

  if (!matchHashedOtp) {
    return next(new Error("invalid OTP", { cause: 401 }));
  }

  const updatedUser = DbService.updateOne({
    model: UserModel,
    filter: { email },
    data: {
      $set: {
        confirmEmail: Date.now(),
      },
      $unset: { confirmEmailOtp: 1 },
    },
  });
  return succssesResponse({
    res,
  });
});



export const loginGoogle = asyncHandler(async (req, res, next) => {
  const { idToken } = req.body;
  const { email, email_verified } = await verify(idToken);

  if (!email_verified) {
    return next(new Error("Email not verified", { cause: 401 }));
  }
  console.log(email, email_verified);

  const user = await DbService.findOne({
    model: UserModel,
    filter: { email, provider: providerEnum.google },
  });
  if (!user) {
    return next(new Error("invalid login data or provider", { cause: 404 }));
  }
  const data = await getLogindata(user);

  return succssesResponse({
    res,
    message: "Success",
    status: 200,
    data,
  });
});
