import express from "express";
import { validation } from "../../Middleware/validation.js";

import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authentication.controller.js";

import { addToCartVal, updateQTYVal } from "./cart.validation.js";
import {
  addCart,
  applyCoupon,
  clearUserCart,
  getLoggedUserCart,
  removeCart,
  updateQuantity,
} from "./cart.controller.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";

const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), validation(addToCartVal), addCart)
  .get(protectedRoutes, allowedTo("user"), getLoggedUserCart)
  .delete(protectedRoutes, allowedTo("user"), clearUserCart);
//works successfully
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

cartRouter.post(
  "/applyCoupon",
  protectedRoutes,
  allowedTo("user"),
  applyCoupon
);

cartRouter
  .route("/:id")
  .delete(
    protectedRoutes,
    allowedTo("user", "admin"),
    validation(paramsIdVal),
    removeCart
  )
  .put(
    protectedRoutes,
    allowedTo("user"),
    validation(updateQTYVal),
    updateQuantity
  );

export default cartRouter;
