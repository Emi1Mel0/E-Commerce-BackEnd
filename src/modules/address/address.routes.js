import express from "express";
import { validation } from "../../Middleware/validation.js";

import { paramsIdVal } from "../../utils/sharedValidation.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authentication.controller.js";

import { addAddressVal } from "./address.validation.js";
import { addAddress, getLoggedUserAddress, removeAddress } from "./address.controller.js";

const addressRouter = express.Router();

addressRouter
  .route("/")
  .patch(
    protectedRoutes,
    allowedTo("user"),
    validation(addAddressVal),
    addAddress
  )
  .get(protectedRoutes, allowedTo("user"), getLoggedUserAddress);
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

addressRouter
  .route("/:id")
  .delete(
    protectedRoutes,
    allowedTo("user", "admin"),
    validation(paramsIdVal),
    removeAddress
  );

export default addressRouter;
