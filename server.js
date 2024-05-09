process.on("uncaughtException", (err) => {
  console.log(err);
});

import express from "express";
import dotenv from "dotenv";
import { dbConnect } from "./DataBases/dbconnection.js";
import { bootstrap } from "./src/index.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// sometimes we could change the name of the folder that contains the images
app.use("/uploads", express.static("uploads"));

bootstrap(app);

dbConnect();

process.on("unhandledRejection", (err) => {
  console.log(err);
});

app.listen(process.env.PORT || port , () =>
  console.log(`Example app listening on port ${port}!`)
);
