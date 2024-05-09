import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      minlength: [2, "too short review text"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
    }
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/,function(){
  this.populate('user','name');
  // comma to make the projection to get the name only
  // regex to be able to use any type of find 0ne or all or update or whatever
})

export const reviewModel = mongoose.model("review", reviewSchema);
