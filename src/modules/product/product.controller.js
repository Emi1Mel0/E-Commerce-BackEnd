import slugify from "slugify";
import { errorCatcher } from "../../Middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { appError } from "../../utils/AppError.js";
import { productModel } from "../../../DataBases/models/product.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

export const addProduct = errorCatcher(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  req.body.imgCover = req.files.imgCover[0].filename;
  req.body.images = req.files.images.map((img) => img.filename);

  // const findProduct = categoryModel.findOne(req.body.name);
  // if(findProduct) return new appError("category already exists", 409)

  const product = new productModel(req.body);
  await product.save();
  res.status(201).json({ message: "Product added successfully", product });
});

export const getAllProducts = errorCatcher(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(productModel.find(), req.query)
    .fields()
    .pagination()
    .filter()
    .sort()
    .search();
  let products = await apiFeatures.mongooseQuery;
  res.status(200).json({
    message: "the products fetched successfully",
    page: apiFeatures.pageNumber,
    products,
  });
});

// export const getAllProducts = errorCatcher(async (req, res, next) => {
//   const products = await productModel.find();
//   res.status(200).json({
//     message: "the products fetched successfully",
//     products,
//   });
// });

export const getSingleProduct = errorCatcher(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);
  !product &&
    res.status(404).json({ status: 404, message: "Product not found" });
  product &&
    res.status(200).json({
      status: 200,
      message: "Product fetched successfully",
      product,
    });
});

export const updateProduct = errorCatcher(async (req, res, next) => {
  if (req.body.title) req.body.slug = slugify(req.body.title);
  if (req.files.imgCover) req.body.imgCover = req.files.imgCover[0].filename;
  if (req.files.images) {
    req.body.images = req.files.images.map((img) => img.filename);
  }

  // these lines to be able to change the pictures without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image
  const product = await productModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  !product &&
    res.status(404).json({ status: 404, message: "Product not found" });
  product &&
    res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      product,
    });
});

export const deleteProduct = deleteOne(productModel);
