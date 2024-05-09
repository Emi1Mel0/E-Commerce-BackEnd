import { productModel } from "../../../DataBases/models/product.model.js";
import { errorCatcher } from "../../Middleware/catchError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import QRCode from "qrcode";

export const sharingProduct = errorCatcher(async (req, res, next) => {
  // const product = await productModel.findOne({ _id: req.params.id });
  // if (!product) {
  //   return res.status(404).json({
  //     message: "product not found",
  //   });
  // }
  // const qr = await QRCode.toDataURL(product.slug);
  // res.setHeader("Content-Type", "image/png");
  // res.send(qr);
  QRCode.toDataURL(
    `http://localhost:3000/api/v1/products/product`,
    (err, qr) => {
      res.send(`<img src="${qr}"/>`);
      // res.status(200).json(qr);
    }
  );
});

export const getAllProducts = errorCatcher(async (req, res, next) => {
  const apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  const products = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({
      message: "the products fetched successfully",
      page: apiFeatures.pageNumber,
      products,
    });
});
