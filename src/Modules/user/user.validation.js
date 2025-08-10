import Joi from "joi";
import { genralFeilds } from "../genralFeilds.js";

export const shareProfile = {
  params: Joi.object().keys({
    id: genralFeilds.id.required(),
  }),
};

export const updateUserBasic = {
  body: Joi.object().keys({
    firstName: genralFeilds.fullName,
    lastName: genralFeilds.fullName,
    phone: genralFeilds.phone,
  }),
};

export const updatePassword = {
  body: Joi.object().keys({
    oldPassword: genralFeilds.password.required(),
    password: genralFeilds.password.not(Joi.ref("oldPassword")).required(),
    confirmPassword: genralFeilds.confirmPassword.required(),
  }),
};

