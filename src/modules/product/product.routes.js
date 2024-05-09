import express from "express";
import { validation } from "../../Middleware/validation.js";
import {
  uploadFields,
  uploadSingleFile,
} from "../../services/fileUploads/fileUploads.js";
import {
  addProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
} from "./product.controller.js";
import {
  addProductVal,
  updateProductVal,
} from "./product.validation.js";
import { paramsIdVal } from "../../utils/sharedValidation.js";

const productRouter = express.Router();

productRouter
  .route("/")
  .post(
    uploadFields([
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    validation(addProductVal),
    addProduct
  )
  // we add the upload first because multer parse for you
  // so it doesn't make sense to validate undefined
  .get(getAllProducts);
//  and the url we have sent it to the index.routes.js
//  and here use the methods only

productRouter
  .route("/:id")
  .get(validation(paramsIdVal), getSingleProduct)
  .put(
    uploadFields([
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    validation(updateProductVal),
    updateProduct
  )
  .delete(validation(paramsIdVal), deleteProduct);

export default productRouter;
