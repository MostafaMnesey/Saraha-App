import EventEmitter from "node:events";
import sendEmail from "./sendEmil.email.js";
import { emailTemp } from "./email.temp.js";
import { asyncHandler } from "../response.js";

const eventEmitter = new EventEmitter();
eventEmitter.on(
  "sendEmail",
  asyncHandler(async ({ email = "", otp = "", subject = "Confirmation" }) => {
    const html = await emailTemp({otp});
    await sendEmail({
      to: email,
      subject,
      html,
    });
  })
);
export default eventEmitter;
