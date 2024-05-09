import slugify from "slugify";
import { errorCatcher } from "../../Middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { appError } from "../../utils/AppError.js";
import { brandModel } from "../../../DataBases/models/brand.model.js";

export const addBrand = errorCatcher(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;
  // const findBrand = categoryModel.findOne(req.body.name);
  // if(findBrand) return new appError("category already exists", 409)
  const brand = new brandModel(req.body);
  await brand.save();
  res.status(201).json({ message: "Brand added successfully", brand });
});

export const getAllBrands = errorCatcher(async (req, res, next) => {
  const brands = await brandModel.find();
  res.status(200).json({
    status: 200,
    message: "Brands fetched successfully",
    brands,
  });
});

export const getSingleBrand = errorCatcher(async (req, res, next) => {
  const brand = await brandModel.findById(req.params.id);
  !brand && res.status(404).json({ status: 404, message: "Brand not found" });
  brand &&
    res.status(200).json({
      status: 200,
      message: "Brand fetched successfully",
      brand,
    });
});

export const updateBrand = errorCatcher(async (req, res, next) => {
  if (req.body.name) req.body.slug = slugify(req.body.name);
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  if (req.file) req.body.logo = req.file.filename;
  // we add this line because sometimes we need to update the name not the image
  const brand = await brandModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  !brand && res.status(404).json({ status: 404, message: "Brand not found" });
  brand &&
    res.status(200).json({
      status: 200,
      message: "Brand updated successfully",
      brand,
    });
});

export const deleteBrand = deleteOne(brandModel);
