import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";

import { userModel } from "../../../DataBases/models/user.model.js";
import { errorCatcher } from "../../Middleware/catchError.js";
// import { sendMail } from "../../services/emails/sendMail.js";
import { appError } from "../../utils/AppError.js";

export const signup = errorCatcher(async (req, res) => {
  let user = new userModel(req.body);
  await user.save();
  res.json({ message: "success" });
});

export const signin = errorCatcher(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user && bcryptjs.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    return res.json({ message: "success", token });
  }
  next(new appError("incorrect password or email", 401));
});

export const changePassword = errorCatcher(async (req, res, next) => {
  let user = await userModel.findById(req.user._id);

  if (user && bcryptjs.compareSync(req.body.oldPassword, user.password)) {
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    await userModel.findByIdAndUpdate(
      req.user._id,
      { password: req.body.newPassword, passwordChangedAt: Date.now() },
      { new: true }
    );
    return res.json({ message: "success", token });
  }
  next(new appError("incorrect password or email", 401));
});

// 1. check there is token or not
// 2. check that token is verified or not
// 3. user id => is exist or not( check token is expired or not)
// 4. check if the token is didn't changed after changing the password
// so we do need to change the token

export const protectedRoutes = errorCatcher(async (req, res, next) => {
  let { token } = req.headers;

  if (!token) return next(new appError("token not provided", 401));

  let decoded = jwt.verify(token, process.env.JWT_KEY);
  let user = await userModel.findById(decoded.userId);

  if (!user) return next(new appError("user not found", 401));
  if (user?.passwordChangedAt) {
    let time = parseInt(user?.passwordChangedAt.getTime() / 1000);
    if (time > decoded.iat)
      return next(new appError("invalid token ... login again", 401));
  }
  req.user = user;
  next();
});

export const allowedTo = (...roles) => {
  return errorCatcher(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new appError("you are not allowed to perform this action", 403)
      );
    next();
  });
};
