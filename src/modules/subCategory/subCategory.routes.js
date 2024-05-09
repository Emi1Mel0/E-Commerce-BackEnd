import express from "express";
import { validation } from "../../Middleware/validation.js";
import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSingleSubCategory,
  updateSubCategory,
} from "./subCategory.controller.js";
import {
  addSubCategoryVal,
  updateSubCategoryVal,
} from "./subCategory.validation.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";

const subCategoryRouter = express.Router();

subCategoryRouter
  .route("/")
  .post(validation(addSubCategoryVal), addSubCategory)
  .get(getAllSubCategories);
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

subCategoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleSubCategory)
  .put(validation(updateSubCategoryVal), updateSubCategory)
  .delete(validation(paramsIdVal), deleteSubCategory);

export default subCategoryRouter;
