import express from "express";
import { validation } from "../../Middleware/validation.js";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
  getSingleCoupon,
  updateCoupon,
} from "./coupon.controller.js";
import { addCouponVal, updateCouponVal } from "./coupon.validation.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authentication.controller.js";

const couponRouter = express.Router();

couponRouter.use(protectedRoutes, allowedTo("admin"));
// to be able to use all this config with all method

couponRouter
  .route("/")
  .post(validation(addCouponVal), addCoupon)
  .get(getAllCoupons);
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

couponRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleCoupon)
  .put(validation(updateCouponVal), updateCoupon)
  .delete(validation(paramsIdVal), deleteCoupon);

export default couponRouter;
