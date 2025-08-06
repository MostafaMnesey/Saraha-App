import bootstrap from "./app.controller.js";
import path from "node:path";
import { config } from "dotenv";

config({
  path: path.join("./src/config/.env.dev"),
});
bootstrap();
