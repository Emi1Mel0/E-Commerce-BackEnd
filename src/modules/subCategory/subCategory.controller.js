import slugify from "slugify";
import { errorCatcher } from "../../Middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { appError } from "../../utils/AppError.js";
import { subCategoryModel } from "../../../DataBases/models/subCategory.model.js";

export const addSubCategory = errorCatcher(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  // const findCategory = categoryModel.findOne(req.body.name);
  // if(findCategory) return new appError("category already exists", 409)
  const subCategory = new subCategoryModel(req.body);
  await subCategory.save();
  res
    .status(201)
    .json({ message: "subCategory added successfully", subCategory });
});

export const getAllSubCategories = errorCatcher(async (req, res, next) => {
  let filterObj = {};
  if (req.params.category) filterObj.category = req.params.category;
  const subCategories = await subCategoryModel
    .find(filterObj)
    .populate("category");
  res.status(200).json({
    status: 200,
    message: "subCategories fetched successfully",
    subCategories,
  });
});

export const getSingleSubCategory = errorCatcher(async (req, res, next) => {
  const subCategory = await subCategoryModel.findById(req.params.id);
  !subCategory &&
    res.status(404).json({ status: 404, message: "subCategory not found" });
  subCategory &&
    res.status(200).json({
      status: 200,
      message: "subCategory fetched successfully",
      subCategory,
    });
});

export const updateSubCategory = errorCatcher(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image
  const subCategory = await subCategoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  !subCategory &&
    res.status(404).json({ status: 404, message: "subCategory not found" });
  subCategory &&
    res.status(200).json({
      status: 200,
      message: "subCategory updated successfully",
      subCategory,
    });
});

export const deleteSubCategory = deleteOne(subCategoryModel);
