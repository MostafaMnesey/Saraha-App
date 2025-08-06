import mongoose from "mongoose";
import { log } from "console";

const connectDB = async () => {
  try {
    const uri = process.env.DB_URI;
    const connection = await mongoose.connect(uri);
    log("DB connected");
    log(connection.models);
  } catch (error) {
    log("Error in DB connection");
    log(error);
  }
};
export default connectDB;
