import express from "express";
import { validation } from "../../Middleware/validation.js";
import {
  addUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  updateUser,
} from "./user.controller.js";
import { addUserVal, updateUserVal } from "./user.validation.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";
import { emailExists } from "../../Middleware/emailExists.js";

const userRouter = express.Router();

userRouter.route("/").get(getAllUsers).post(validation(addUserVal), emailExists,addUser);

userRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleUser)
  .put(validation(updateUserVal), updateUser)
  .delete(validation(paramsIdVal), deleteUser);

  export default userRouter