import { categoryModel } from "../../../DataBases/models/category.model.js";
import slugify from "slugify";
import { errorCatcher } from "../../Middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { appError } from "../../utils/AppError.js";

export const addCategory = errorCatcher(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  // const findCategory = categoryModel.findOne(req.body.name);
  // if(findCategory) return new appError("category already exists", 409)
  const category = new categoryModel(req.body);
  await category.save();
  res.status(201).json({ message: "Category added successfully", category });
});

export const getAllCategories = errorCatcher(async (req, res, next) => {
  const categories = await categoryModel.find();
  res.status(200).json({
    status: 200,
    message: "Categories fetched successfully",
    categories,
  });
});

export const getSingleCategory = errorCatcher(async (req, res, next) => {
  const category = await categoryModel.findById(req.params.id);
  !category &&
    res.status(404).json({ status: 404, message: "Category not found" });
  category &&
    res.status(200).json({
      status: 200,
      message: "Category fetched successfully",
      category,
    });
});

export const updateCategory = errorCatcher(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  if (req.file) req.body.image = req.file.filename;
  // we add this line because sometimes we need to update the name not the image
  const category = await categoryModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  !category &&
    res.status(404).json({ status: 404, message: "Category not found" });
  category &&
    res.status(200).json({
      status: 200,
      message: "Category updated successfully",
      category,
    });
});

export const deleteCategory = deleteOne(categoryModel);
