import { userModel } from "../../../DataBases/models/user.model.js";
import { errorCatcher } from "../../Middleware/catchError.js";
import { ApiFeatures } from "../../utils/ApiFeatures.js";
import bcryptjs from "bcryptjs";
import { deleteOne } from "../handlers/handlers.js";

const addUser = errorCatcher(async (req, res, next) => {
  const user = new userModel(req.body);
  await user.save();
  res.status(200).json({
    message: "the user added successfully",
    user: { name: user.name, email: user.email },
  });
});

const getAllUsers = errorCatcher(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(userModel.find(), req.query)
    .pagination()
    .filter()
    .sort()
    .fields()
    .search();
  const users = await apiFeatures.mongooseQuery;
  res.status(200).json({
    message: "the users fetched successfully",
    page: apiFeatures.pageNumber,
    users,
  });
});

const getSingleUser = errorCatcher(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  !user && res.status(404).json({ message: "the user not found" });
  user && res.status(200).json({ message: "the user fetched successfully", user });
});

const updateUser = errorCatcher(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  !user && res.status(404).json({ message: "the user not found" });
  user && res.status(200).json({ message: "the user fetched successfully", user });
});

const deleteUser = deleteOne(userModel);

export { addUser, getAllUsers, getSingleUser, updateUser, deleteUser };
