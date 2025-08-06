import bcrypt from "bcryptjs";
export const hashText = async ({ text = "", salt = 12 } = {}) => {
  return bcrypt.hashSync(text, parseInt(process.env.SALT));
};


export const compareText = async ({text="",hashedText=""}={})=>{
  return bcrypt.compareSync(text,hashedText);
}