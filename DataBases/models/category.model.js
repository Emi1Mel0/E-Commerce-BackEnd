import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "name is required"],
      trim: true,
      required: true,
      minlength: [2, "too short category name"],
    },
    slug: {
      type:
      String,
      lowercase: true,
      required: true,
    },createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    image: String,
  },
  { timestamps: true }
);

categorySchema.post('init',function(doc){
  doc.image= process.env.BASE_URL + "uploads/" + doc.image
})

export const categoryModel = mongoose.model("category", categorySchema);
