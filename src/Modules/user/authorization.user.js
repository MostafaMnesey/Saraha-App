import { roleEnum } from "../../DB/Models/User/User.model.js";

export const endPoint = {
  profile: [roleEnum.user],
  credentials: [roleEnum.user],
};
