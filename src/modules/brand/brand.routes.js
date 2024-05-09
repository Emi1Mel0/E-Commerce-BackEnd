import express from "express";
import { validation } from "../../Middleware/validation.js";
import { uploadSingleFile } from "../../services/fileUploads/fileUploads.js";
import {
  addBrandVal,
  updateBrandVal,
} from "./brand.validation.js";
import {
  addBrand,
  deleteBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
} from "./brand.controller.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";

const brandRouter = express.Router();

brandRouter
  .route("/")
  .post(uploadSingleFile("logo"), validation(addBrandVal), addBrand)
  // we add the upload first because multer parse for you
  // so it doesn't make sense to validate undefined
  .get(getAllBrands);
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

brandRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleBrand)
  .put(uploadSingleFile("logo"), validation(updateBrandVal), updateBrand)
  .delete(validation(paramsIdVal), deleteBrand);

export default brandRouter;
