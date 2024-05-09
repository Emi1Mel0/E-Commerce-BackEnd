import { errorCatcher } from "../../Middleware/catchError.js";

import { userModel } from "../../../DataBases/models/user.model.js";

export const addToWishList = errorCatcher(async (req, res, next) => {
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image

  const wishList = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { $addToSet: { wishList: req.body.product } },
      {
        new: true,
      }
    )
    .populate("wishList");

  // how to edit inside the array inside the database
  // $push
  // $addToSet
  // both are equally but  $addToSet will only push if it is unique
  // $push will push if it is not unique
  // so we use $addToSet
  // we use $addToSet because we don't want to change the order of the array

  !wishList &&
    res.status(404).json({ status: 404, message: "wishList not found" });
  wishList &&
    res.status(200).json({
      status: 200,
      message: "wishList updated successfully",
      wishList: wishList.wishList,
    });
});

export const removeFromWishList = errorCatcher(async (req, res, next) => {
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image

  const wishList = await userModel
    .findByIdAndUpdate(
      req.user._id,
      { $pull: { wishList: req.params.id } },
      {
        new: true,
      }
    )
    .populate("wishList");

  // how to edit inside the array inside the database
  // $pop
  // $pull
  // both are equally but  $pull will only pop if it is unique
  // $pop will pop if it is not unique
  // so we use $pull
  // we use $pull because we don't want to change the order of the array

  !wishList &&
    res.status(404).json({ status: 404, message: "wishList not found" });
  wishList &&
    res.status(200).json({
      status: 200,
      message: "wishList updated successfully",
      wishList: wishList.wishList,
    });
});

export const getLoggedUserWishList = errorCatcher(async (req, res, next) => {
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image

  const { wishList } = await userModel
    .findById(req.user._id)
    .populate("wishList");

  // how to edit inside the array inside the database
  // $pop
  // $pull
  // both are equally but  $pull will only pop if it is unique
  // $pop will pop if it is not unique
  // so we use $pull
  // we use $pull because we don't want to change the order of the array

  !wishList &&
    res.status(404).json({ status: 404, message: "wishList not found" });
  wishList &&
    res.status(200).json({
      status: 200,
      message: "wishList updated successfully",
      wishList,
    });
});
