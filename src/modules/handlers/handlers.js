import { errorCatcher } from "../../Middleware/catchError.js";

export const deleteOne = (model) => {
  return errorCatcher(async (req, res, next) => {
    const item = await model.findByIdAndDelete(req.params.id);
    !item && res.status(404).json({ message: "not found" });
    item && res.status(200).json({ message: "deleted successfully" });
  });
};
