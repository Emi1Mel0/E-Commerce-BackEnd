import express from "express";
import { validation } from "../../Middleware/validation.js";

import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authentication.controller.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";
import { createOrderVal } from "./order.validation.js";
import {
  createCashOrder,
  createCheckOutSession,
  getAllOrders,
  getSpecificOrder,
} from "./order.controller.js";

const orderRouter = express.Router();

orderRouter
  .route("/")
  .get(protectedRoutes, allowedTo("user"), getSpecificOrder);
//   .post(protectedRoutes, allowedTo("user"), validation(addToCartVal), addCart)
//   .delete(protectedRoutes, allowedTo("user"), clearUserCart);
//works successfully
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

orderRouter.get(
  "/allOrders",
  protectedRoutes,
  allowedTo("admin"),
  getAllOrders
);

orderRouter
  .route("/:id")
  .post(
    protectedRoutes,
    allowedTo("user"),
    validation(createOrderVal),
    createCashOrder
  );

orderRouter.post(
  "/CheckOut/:id",
  protectedRoutes,
  allowedTo("user"),
  createCheckOutSession
);

export default orderRouter;
