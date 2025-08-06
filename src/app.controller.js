import express from "express";
import authController from "./Modules/Auth/auth.controller.js";
import userController from "./Modules/user/user.controller.js";
import connectDB from "./DB/Connection.DB.js";
import { globalErrorHandling } from "./utils/response.js";
import cors from "cors"

function bootstrap() {
  //express server
  const app = express();
  const port = process.env.PORT || 3000;
  //data base connection
  connectDB();

  //convert buffer data
  app.use(express.json());
  //routes

  //cors
  app.use(cors())
  //authService
  app.use("/auth", authController);
  //
  app.use("/user", userController);

  //error handling
  app.use(globalErrorHandling);
  //404

  app.all("/{*dummy}", (req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}
export default bootstrap;
