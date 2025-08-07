import Joi from "joi";
import { genralFeilds } from "../genralFeilds.js";

export const shareProfile = {
  params: Joi.object().keys({
    id: genralFeilds.id.required(),
  }),
};
