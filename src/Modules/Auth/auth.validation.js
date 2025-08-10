import joi from "joi";
import { genralFeilds } from "../genralFeilds.js";

export const signUp = {
  body: joi
    .object()
    .keys({
      fullName: genralFeilds.fullName.required(),
      email: genralFeilds.email.required(),
      password: genralFeilds.password.required(),
      gender: genralFeilds.gender.required(),
      confirmPassword: genralFeilds.confirmPassword.required(),
      phone: genralFeilds.phone.required(),
    })
    .required(),
};

export const login = {
  body: joi
    .object()
    .keys({
      email: genralFeilds.email.required(),
      password: genralFeilds.password.required(),
    })
    .required(),
};

export const confirmEmail = {
  body: joi.object().keys({
    email: genralFeilds.email.required(),
    otp: genralFeilds.otp.required(),
  }),
};

export const googleService = {
  body: joi.object().keys({
    idToken: joi.string().required(),
  }),
};

export const sendForgotPassword = {
  body: joi.object().keys({
    email: genralFeilds.email.required(),
  }),
};

export const resetPassword = {
  body: joi.object().keys({
    otp: genralFeilds.otp.required(),
    email: genralFeilds.email.required(),
    password: genralFeilds.password.required(),
    confirmPassword: genralFeilds.confirmPassword.required(),
  }),
};
