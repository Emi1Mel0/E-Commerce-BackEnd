import { appError } from "../utils/AppError.js";

export const validation = (schema) => {
  return (req, res, next) => {
    // when we had to put the image's value null
    // subcategory will not be accept it so
    let filter = {};
    if (req.file) {
      filter = { image: req.file, ...req.body, ...req.params, ...req.query };
    } else if (req.files) {
      filter = { ...req.files, ...req.body, ...req.params, ...req.query };
    } else {
      filter = { ...req.body, ...req.params, ...req.query };
    }
    const { error } = schema.validate(filter, { abortEarly: false });
    // why do we use destructing ?
    // first of all, destructing is a concept based on three dots
    // second of all, destructing is a separated operator
    // third of all, destructing is a destructive operator
    if (error) {
      // why do we use it now ?
      // so we able to collect all errors in one array
      const errorList = [];

      error.details.forEach((val) => {
        errorList.push(val.message);
      });
      // why do we use foreach ?
      // because foreach doesn't get a new array
      // it works on the original array
      next(new appError(errorList, 401));
    }
    next();
  };
};
