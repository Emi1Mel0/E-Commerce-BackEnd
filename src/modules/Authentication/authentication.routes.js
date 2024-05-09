import express from "express";
import { validation } from "../../Middleware/validation.js";
import {
  changePasswordVal,
  signInVal,
  signupVal,
} from "./authentication.validation.js";
import {
  changePassword,
  protectedRoutes,
  signin,
  signup,
} from "./authentication.controller.js";
import { emailExists } from "../../Middleware/emailExists.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";

const authenticationRouter = express.Router();

authenticationRouter.post(
  "/signup",
  validation(signupVal),
  emailExists,
  signup
);
authenticationRouter.post("/signin", validation(signInVal), signin);
authenticationRouter.patch(
  "/changePassword",
  protectedRoutes,
  validation(changePasswordVal),
  changePassword
);

export default authenticationRouter;
