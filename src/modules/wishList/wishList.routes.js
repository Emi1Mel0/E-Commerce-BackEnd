import express from "express";
import { validation } from "../../Middleware/validation.js";

import { addToWishListVal } from "./wishList.validation.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";
import {
  allowedTo,
  protectedRoutes,
} from "../Authentication/authentication.controller.js";
import {
  addToWishList,
  getLoggedUserWishList,
  removeFromWishList,
} from "./wishList.controller.js";

const wishListRouter = express.Router();

wishListRouter
  .route("/")
  .patch(
    protectedRoutes,
    allowedTo("user"),
    validation(addToWishListVal),
    addToWishList
  )
  .get(protectedRoutes, allowedTo("user"), getLoggedUserWishList);
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

wishListRouter
  .route("/:id")
  .delete(
    protectedRoutes,
    allowedTo("user", "admin"),
    validation(paramsIdVal),
    removeFromWishList
  );

export default wishListRouter;
