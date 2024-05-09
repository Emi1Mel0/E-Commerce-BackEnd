import express from "express";
import { validation } from "../../Middleware/validation.js";
import {
  addReview,
  deleteReview,
  getAllReviews,
  getSingleReview,
  updateReview,
} from "./review.controller.js";
import {
  addReviewVal,
  updateReviewVal,
} from "./review.validation.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";
import { allowedTo, protectedRoutes } from "../Authentication/authentication.controller.js";

const reviewRouter = express.Router();

reviewRouter
  .route("/")
  .post(protectedRoutes,allowedTo('user'),validation(addReviewVal), addReview)
  .get(getAllReviews);
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

reviewRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleReview)
  .put(protectedRoutes,allowedTo('user'),validation(updateReviewVal), updateReview)
  .delete(protectedRoutes,allowedTo('user','admin'),validation(paramsIdVal), deleteReview);

export default reviewRouter;
