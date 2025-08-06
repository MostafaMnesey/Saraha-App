import mongoose, { Schema } from "mongoose";

export let genderEnum = {
  male: "male",
  female: "female",
};
export let roleEnum = {
  user: "user",
  admin: "admin",
};
export const providerEnum = {
  google: "google",
  system: "system",
};
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === providerEnum.system ? true : false;
      },
    },
    gender: {
      type: String,
      enum: {
        values: Object.values(genderEnum),
        message: `Gender is only ${Object.values(genderEnum)}`,
      },
      default: genderEnum.male,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(roleEnum),
        message: `role is only ${Object.values(roleEnum)}`,
      },
      default: roleEnum.user,
    },
    provider: {
      type: String,
      enum: {
        values: Object.values(providerEnum),
        message: `provider is only ${Object.values(providerEnum)}`,
      },
      default: providerEnum.system,
    },

    phone: {
      type: String,
    },
    confirmEmail: Date,
    confirmEmailOtp: String,
    picture: String,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);
userSchema
  .virtual("fullName")
  .set(function (values) {
    const [firstName, lastName] = values?.split(" ") || [];
    this.set({
      firstName,
      lastName,
    });
  })
  .get(function () {
    return `${this.firstName} ${this.lastName}`;
  });
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);
mongoose.syncIndexes();

export default UserModel;
