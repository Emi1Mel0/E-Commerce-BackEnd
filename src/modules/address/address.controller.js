import { errorCatcher } from "../../Middleware/catchError.js";

import { userModel } from "../../../DataBases/models/user.model.js";

export const addAddress = errorCatcher(async (req, res, next) => {
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image

  const address = await userModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    {
      new: true,
    }
  );

  // how to edit inside the array inside the database
  // $push
  // $addToSet
  // both are equally but  $addToSet will only push if it is unique
  // $push will push if it is not unique
  // so we use $addToSet
  // we use $addToSet because we don't want to change the order of the array

  !address &&
    res.status(404).json({ status: 404, message: "address not found" });
  address &&
    res.status(200).json({
      status: 200,
      message: "address updated successfully",
      address: address.addresses,
    });
});

export const removeAddress = errorCatcher(async (req, res, next) => {
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image

  const address = await userModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.id } } },
    {
      new: true,
    }
  );

  // how to edit inside the array inside the database
  // $pop
  // $pull
  // both are equally but  $pull will only pop if it is unique
  // $pop will pop if it is not unique
  // so we use $pull
  // we use $pull because we don't want to change the order of the array

  !address &&
    res.status(404).json({ status: 404, message: "address not found" });
  address &&
    res.status(200).json({
      status: 200,
      message: "address updated successfully",
      address: address.addresses,
    });
});

export const getLoggedUserAddress = errorCatcher(async (req, res, next) => {
  // this line to be able to change the picture without change the name
  // and don't make an error with slugify
  // we add this line because sometimes we need to update the name not the image

  const { addresses } = await userModel.findById(req.user._id);

  // how to edit inside the array inside the database
  // $pop
  // $pull
  // both are equally but  $pull will only pop if it is unique
  // $pop will pop if it is not unique
  // so we use $pull
  // we use $pull because we don't want to change the order of the array

  addresses &&
    res.status(200).json({
      status: 200,
      message: "addresses updated successfully",
      addresses,
    });
});
