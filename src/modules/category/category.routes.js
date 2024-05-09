import express from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from "./category.controller.js";
import { validation } from "../../Middleware/validation.js";
import {
  addCategoryVal,
  updateCategoryVal,
} from "./category.validation.js";
import { uploadSingleFile } from "../../services/fileUploads/fileUploads.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";
import { allowedTo, protectedRoutes } from "../Authentication/authentication.controller.js";

const categoryRouter = express.Router();

categoryRouter.use('/:category/subcategories',subCategoryRouter)

categoryRouter
  .route("/")
  .post(protectedRoutes,allowedTo('admin'),uploadSingleFile('img'),validation(addCategoryVal), addCategory)
  // we add the upload first because multer parse for you
  // so it doesn't make sense to validate undefined 
  .get(getAllCategories);
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

categoryRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleCategory)
  .put(protectedRoutes,uploadSingleFile('img'),validation(updateCategoryVal), updateCategory)
  .delete(protectedRoutes,validation(paramsIdVal), deleteCategory);

export default categoryRouter;
