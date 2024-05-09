import slugify from "slugify";
import { errorCatcher } from "../../Middleware/catchError.js";
import { deleteOne } from "../handlers/handlers.js";
import { appError } from "../../utils/AppError.js";
import { reviewModel } from "../../../DataBases/models/review.model.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";

export const addReview = errorCatcher(async (req, res, next) => {
  // const findCategory = categoryModel.findOne(req.body.name);
  // if(findCategory) return new appError("category already exists", 409)
  req.body.user = req.user._id;
  let isReviewExist = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isReviewExist)
    return next(new appError("you wrote this review before", 400));

  const review = new reviewModel(req.body);
  await review.save();
  res.status(201).json({ message: "review added successfully", review });
});

export const getAllReviews = errorCatcher(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(reviewModel.find({}), req.query)
    .pagination()
    .fields()
    .sort()
    .search()
    .filter();
  let review = await apiFeatures.mongooseQuery;

  res.status(200).json({
    status: 200,
    message: "review fetched successfully",
    page: apiFeatures.pageNumber,
    review,
  });
});

export const getSingleReview = errorCatcher(async (req, res, next) => {
  const review = await reviewModel.findById(req.params.id);
  !review && res.status(404).json({ status: 404, message: "review not found" });
  review &&
    res.status(200).json({
      status: 200,
      message: "review fetched successfully",
      review,
    });
});

export const updateReview = errorCatcher(async (req, res, next) => {
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image

  const review = await reviewModel.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  !review && res.status(404).json({ status: 404, message: "review not found" });
  review &&
    res.status(200).json({
      status: 200,
      message: "review updated successfully",
      review,
    });
});

export const deleteReview = deleteOne(reviewModel);
