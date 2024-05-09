import slugify from "slugify";
import { errorCatcher } from "../../Middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { appError } from "../../utils/AppError.js";
import { couponModel } from "../../../DataBases/models/coupon.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

export const addCoupon = errorCatcher(async (req, res, next) => {
  // const findCategory = categoryModel.findOne(req.body.name);
  // if(findCategory) return new appError("category already exists", 409)

  let isCouponExist = await couponModel.findOne({
    code: req.body.code,
  });
  if (isCouponExist)
    return next(new appError("coupon already Exists", 400));

  const coupon = new couponModel(req.body);
  await coupon.save();
  res.status(201).json({ message: "coupon added successfully", coupon });
});

export const getAllCoupons = errorCatcher(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(couponModel.find({}), req.query)
    .pagination()
    .fields()
    .sort()
    .search()
    .filter();
  let coupon = await apiFeatures.mongooseQuery;

  res.status(200).json({
    status: 200,
    message: "coupon fetched successfully",
    page: apiFeatures.pageNumber,
    coupon,
  });
});

export const getSingleCoupon = errorCatcher(async (req, res, next) => {
  const coupon = await couponModel.findById(req.params.id);
  !coupon && res.status(404).json({ status: 404, message: "coupon not found" });
  coupon &&
    res.status(200).json({
      status: 200,
      message: "coupon fetched successfully",
      coupon,
    });
});

export const updateCoupon = errorCatcher(async (req, res, next) => {
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image

  const coupon = await couponModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  !coupon && res.status(404).json({ status: 404, message: "coupon not found" });
  coupon &&
    res.status(200).json({
      status: 200,
      message: "coupon updated successfully",
      coupon,
    });
});

export const deleteCoupon = deleteOne(couponModel);
