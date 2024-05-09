import { userModel } from "../../DataBases/models/user.model.js";
import { appError } from "../utils/AppError.js";

export const emailExists = async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new appError("user already exists", 409));

  next();
};
