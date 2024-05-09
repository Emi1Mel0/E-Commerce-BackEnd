import mongoose from "mongoose";

export function dbConnect() {
  mongoose
    .connect(process.env.DB_ONLINE)
    .then(() => {
      console.log("Mongodb is connected . . . 👌🏻");
    })
    .catch((err) => {
      console.error("database error", err);
    });
}
