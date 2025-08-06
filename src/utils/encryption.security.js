import CryptoJS from "crypto-js";

export const encryptText = async ({ text = "", secKey = "" } = {}) => {
  return CryptoJS.AES.encrypt(text, process.env.SEC_KEY || secKey).toString();
};
export const decryptText = async ({ text = "" } = {}) => {
  return CryptoJS.AES.decrypt(text, process.env.SEC_KEY).toString(
    CryptoJS.enc.Utf8
  );
};
