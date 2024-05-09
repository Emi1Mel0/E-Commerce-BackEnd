import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import { appError } from "../../utils/AppError.js";

export const fileUpload = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, new mongoose.Types.ObjectId + "-" + file.originalname);
    },
  });
  function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image")) {
      // i had error with the previous line because
      // i forgot ( s ) after start word 😅
      cb(null, true);
    } else {
      cb(new appError("images only", 401), false);
    }
  }

  const upload = multer({ storage, fileFilter });
  return upload
};

export const uploadSingleFile = (fieldName) => fileUpload().single(fieldName);
export const uploadArrayOfFiles = (fieldName) => fileUpload().array(fieldName);
export const uploadFields = (fields) => fileUpload().fields(fields);
